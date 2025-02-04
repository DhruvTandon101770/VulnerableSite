const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 5500;

// MySQL Connection (No Security Applied)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'adbms_proj'
});

connection.connect();

// 🚨 Tables are created with no security constraints
connection.query("CREATE TABLE IF NOT EXISTS Doctor (DoctorID INT PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(50), Speciality VARCHAR(50))");
connection.query("CREATE TABLE IF NOT EXISTS Patient (PatientID INT PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(50), Contact VARCHAR(50))");
connection.query("CREATE TABLE IF NOT EXISTS Appointment (AppointmentID INT PRIMARY KEY AUTO_INCREMENT, Date DATE, Time TIME, DoctorID INT, PatientID INT, FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID), FOREIGN KEY (PatientID) REFERENCES Patient(PatientID))");

// Middleware (Allows Everything)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// 🚨 No Authentication, Anyone Can Access the Site
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Vulnerable Web App</h1>
    <a href="/menu1">Manage Patients</a><br>
    <a href="/menu2">Manage Doctors</a><br>
    <a href="/menu3">Manage Appointments</a>
  `);
});

// 🚨 **SQL Injection Vulnerable Patient Management**
app.get('/menu1', (req, res) => {
  connection.query(`SELECT * FROM Patient`, (err, results) => {
    let output = '<h1>Patients</h1>';
    results.forEach(p => {
      output += `<p>${p.PatientID} - ${p.Name} (${p.Contact})</p>`;
    });
    output += `
      <form method="POST" action="/menu1/insert">
        <input type="text" name="name" placeholder="Name">
        <input type="text" name="contact" placeholder="Contact">
        <button type="submit">Add Patient</button>
      </form>
    `;
    res.send(output);
  });
});

// 🚨 **SQL Injection Exploitable**
app.post('/menu1/insert', (req, res) => {
  const { name, contact } = req.body;
  const query = `INSERT INTO Patient (Name, Contact) VALUES ('${name}', '${contact}')`; 
  connection.query(query, () => res.redirect('/menu1'));
});

// 🚨 **SQL Injection + No Validation**
app.post('/menu1/update', (req, res) => {
  const { patientID, name, contact } = req.body;
  const query = `UPDATE Patient SET Name = '${name}', Contact = '${contact}' WHERE PatientID = ${patientID}`;
  connection.query(query, () => res.redirect('/menu1'));
});

// 🚨 **CSRF and SQL Injection Exploitable**
app.post('/menu1/delete', (req, res) => {
  const { patientID } = req.body;
  connection.query(`DELETE FROM Patient WHERE PatientID = ${patientID}`, () => res.redirect('/menu1'));
});

// 🚨 **XSS Attack Possible**
app.get('/menu2', (req, res) => {
  connection.query(`SELECT * FROM Doctor`, (err, results) => {
    let output = '<h1>Doctors</h1>';
    results.forEach(d => {
      output += `<p>${d.DoctorID} - ${d.Name} (${d.Speciality})</p>`;
    });
    output += `
      <form method="POST" action="/menu2/insert">
        <input type="text" name="name" placeholder="Name">
        <input type="text" name="speciality" placeholder="Speciality">
        <button type="submit">Add Doctor</button>
      </form>
    `;
    res.send(output);
  });
});

// 🚨 **SQL Injection in Insert**
app.post('/menu2/insert', (req, res) => {
  const { name, speciality } = req.body;
  connection.query(`INSERT INTO Doctor (Name, Speciality) VALUES ('${name}', '${speciality}')`, () => res.redirect('/menu2'));
});

// 🚨 **XSS Attack Possible**
app.get('/menu3', (req, res) => {
  connection.query(`SELECT * FROM Appointment`, (err, results) => {
    let output = '<h1>Appointments</h1>';
    results.forEach(a => {
      output += `<p>${a.AppointmentID} - ${a.Date} at ${a.Time}</p>`;
    });
    output += `
      <form method="POST" action="/menu3/insert">
        <input type="text" name="doctorID" placeholder="Doctor ID">
        <input type="text" name="patientID" placeholder="Patient ID">
        <input type="date" name="date">
        <input type="time" name="time">
        <button type="submit">Add Appointment</button>
      </form>
    `;
    res.send(output);
  });
});

// 🚨 **SQL Injection in Appointment Insert**
app.post('/menu3/insert', (req, res) => {
  const { doctorID, patientID, date, time } = req.body;
  const query = `INSERT INTO Appointment (DoctorID, PatientID, Date, Time) VALUES (${doctorID}, ${patientID}, '${date}', '${time}')`;
  connection.query(query, () => res.redirect('/menu3'));
});

// 🚨 **No Authentication or Security**
app.post('/menu3/delete', (req, res) => {
  const { appointmentID } = req.body;
  connection.query(`DELETE FROM Appointment WHERE AppointmentID = ${appointmentID}`, () => res.redirect('/menu3'));
});

// Start the vulnerable server
app.listen(port, () => {
  console.log(`Vulnerable server running on http://localhost:${port}`);
});
