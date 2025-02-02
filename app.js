const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 5500;

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // No security here
  database: 'ADBMS_proj'
});

// Create tables (No security, anyone can run these queries)
connection.query(`CREATE TABLE IF NOT EXISTS Doctor (DoctorID INT PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(50), Speciality VARCHAR(50))`);
connection.query(`CREATE TABLE IF NOT EXISTS Patient (PatientID INT PRIMARY KEY, Name VARCHAR(50), Contact VARCHAR(50))`);
connection.query(`CREATE TABLE IF NOT EXISTS Appointment (AppointmentID INT PRIMARY KEY AUTO_INCREMENT, Date DATE, Time TIME, DoctorID INT, PatientID INT, FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID), FOREIGN KEY (PatientID) REFERENCES Patient(PatientID))`);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes (No security applied)
app.get('/', (req, res) => {
  res.render('index', { menus: [] });
});

// 🚨 **Vulnerable to SQL Injection**
app.get('/menu1', (req, res) => {
  connection.query(`SELECT * FROM Patient`, (err, results) => {
    res.render('menu1', { patients: results });
  });
});

// 🚨 **No Input Validation, SQL Injection Possible**
app.post('/menu1/insert', (req, res) => {
  const { name, contact } = req.body;
  connection.query(`INSERT INTO Patient (Name, Contact) VALUES ('${name}', '${contact}')`); 
  res.redirect('/menu1');
});

// 🚨 **Vulnerable to SQL Injection**
app.post('/menu1/update', (req, res) => {
  const { patientID, name, contact } = req.body;
  connection.query(`UPDATE Patient SET Name = '${name}', Contact = '${contact}' WHERE PatientID = ${patientID}`);
  res.redirect('/menu1');
});

// 🚨 **No Authentication or CSRF Protection**
app.post('/menu1/delete', (req, res) => {
  const { patientID } = req.body;
  connection.query(`DELETE FROM Patient WHERE PatientID = ${patientID}`);
  res.redirect('/menu1');
});

// 🚨 **Similar vulnerabilities in other routes**
app.get('/menu2', (req, res) => {
  connection.query(`SELECT * FROM Doctor`, (err, results) => {
    res.render('menu2', { doctors: results });
  });
});

app.post('/menu2/insert', (req, res) => {
  const { name, speciality } = req.body;
  connection.query(`INSERT INTO Doctor (Name, Speciality) VALUES ('${name}', '${speciality}')`);
  res.redirect('/menu2');
});

app.post('/menu2/update', (req, res) => {
  const { doctorID, name, speciality } = req.body;
  connection.query(`UPDATE Doctor SET Name = '${name}', Speciality = '${speciality}' WHERE DoctorID = ${doctorID}`);
  res.redirect('/menu2');
});

app.post('/menu2/delete', (req, res) => {
  const { doctorID } = req.body;
  connection.query(`DELETE FROM Doctor WHERE DoctorID = ${doctorID}`);
  res.redirect('/menu2');
});

app.get('/menu3', (req, res) => {
  connection.query(`SELECT * FROM Appointment`, (err, results) => {
    res.render('menu3', { appointments: results });
  });
});

app.post('/menu3/insert', (req, res) => {
  const { doctorID, patientID, date, time } = req.body;
  connection.query(`INSERT INTO Appointment (DoctorID, PatientID, Date, Time) VALUES (${doctorID}, ${patientID}, '${date}', '${time}')`);
  res.redirect('/menu3');
});

app.post('/menu3/update', (req, res) => {
  const { appointmentID, doctorID, patientID, date, time } = req.body;
  connection.query(`UPDATE Appointment SET DoctorID = ${doctorID}, PatientID = ${patientID}, Date = '${date}', Time = '${time}' WHERE AppointmentID = ${appointmentID}`);
  res.redirect('/menu3');
});

app.post('/menu3/delete', (req, res) => {
  const { appointmentID } = req.body;
  connection.query(`DELETE FROM Appointment WHERE AppointmentID = ${appointmentID}`);
  res.redirect('/menu3');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
