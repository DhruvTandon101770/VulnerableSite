// Toggle the hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// 🚨 No Validation, Directly Sends Data
function insertPatient(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const contact = document.getElementById('contact').value;

  fetch('http://localhost:5500/menu1/insert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, contact }) // 🚨 Allows XSS
  }).then(() => window.location.href = '/menu1');
}

// 🚨 XSS Vulnerability
function showUpdatePatientForm(patientID, name, contact) {
  document.getElementById('update-patient-id').value = patientID;
  document.getElementById('update-name').value = name;
  document.getElementById('update-contact').value = contact;
  document.getElementById('update-patient-form').style.display = 'block';
}

// 🚨 No Protection, Accepts Anything
function updatePatient(event) {
  event.preventDefault();
  const patientID = document.getElementById('update-patient-id').value;
  const name = document.getElementById('update-name').value;
  const contact = document.getElementById('update-contact').value;

  fetch('/menu1/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientID, name, contact })
  }).then(() => window.location.href = '/menu1');
}

// 🚨 No Authentication, Anyone Can Delete
function deletePatient(patientID) {
  fetch('/menu1/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientID })
  }).then(() => window.location.href = '/menu1');
}

// 🚨 No Authentication or CSRF Protection for Doctors
function insertDoctor(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const speciality = document.getElementById('speciality').value;

  fetch('/menu2/insert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, speciality })
  }).then(() => window.location.href = '/menu2');
}

function showUpdateDoctorForm(doctorID, name, speciality) {
  document.getElementById('update-doctor-id').value = doctorID;
  document.getElementById('update-name').value = name;
  document.getElementById('update-speciality').value = speciality;
  document.getElementById('update-doctor-form').style.display = 'block';
}

function updateDoctor(event) {
  event.preventDefault();
  const doctorID = document.getElementById('update-doctor-id').value;
  const name = document.getElementById('update-name').value;
  const speciality = document.getElementById('update-speciality').value;

  fetch('/menu2/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doctorID, name, speciality })
  }).then(() => window.location.href = '/menu2');
}

function deleteDoctor(doctorID) {
  fetch('/menu2/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doctorID })
  }).then(() => window.location.href = '/menu2');
}

// 🚨 No Security, Anyone Can Modify Appointments
function insertAppointment(event) {
  event.preventDefault();
  const doctorID = document.getElementById('doctorID').value;
  const patientID = document.getElementById('patientID').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  fetch('/menu3/insert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doctorID, patientID, date, time })
  }).then(() => window.location.href = '/menu3');
}

function updateAppointment(appointmentID, doctorID, patientID, date, time) {
  const newDoctorID = prompt('Enter new doctor ID:', doctorID);
  const newPatientID = prompt('Enter new patient ID:', patientID);
  const newDate = prompt('Enter new date:', date);
  const newTime = prompt('Enter new time:', time);

  fetch('/menu3/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appointmentID, doctorID: newDoctorID, patientID: newPatientID, date: newDate, time: newTime })
  }).then(() => window.location.href = '/menu3');
}

function deleteAppointment(appointmentID) {
  fetch('/menu3/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appointmentID })
  }).then(() => window.location.href = '/menu3');
}
