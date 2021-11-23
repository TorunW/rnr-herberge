var db = require('../database/db');
const nodemailer = require('nodemailer');
var smtp = require('../config/smtp-config');

exports.getBookings = (req, res) => {
  var sql = 'SELECT * FROM bookings';
  var params = [req.params.id];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.createBooking = (req, res) => {
  const {
    first_name,
    last_name,
    email,
    telephone,
    room,
    guest_count,
    arrival,
    departure,
    notes
  } = req.body;
  var sql =
    'INSERT INTO bookings (first_name, last_name, email, telephone, room, guest_count, arrival, departure, notes ) VALUES (?,?,?,?,?,?,?,?,?)';
  var params = [
    first_name,
    last_name,
    email,
    telephone,
    room,
    guest_count,
    arrival,
    departure,
    notes
  ];
  db.run(sql, params, function (err, result) {
    console.log(err);
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: result,
      id: this.lastID,
    });
    sendBooking(req, res);
  });
};

function sendBooking(req, res) {

  const lan = req.body.language;
  
  const output = `
  <hr/>
  <ul>  
    <li>${lan === "EN" ? "Firstname" : "Vorname"}: ${req.body.first_name}</li>
    <li>${lan === "EN" ? "Lastname" : "Name"}: ${req.body.last_name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.telephone}</li>
    <li>${lan === "EN" ? "Room" : "Zimmer"}: ${req.body.room}</li>
    <li>${lan === "EN" ? "Number of guests" : "Anzahl personen"}: ${req.body.guest_count}</li>
    <li>${lan === "EN" ? "Arrival" : "Ankunft"}: ${req.body.arrival}</li>
    <li>${lan === "EN" ? "Departure" : "Abreise"}: ${req.body.departure}</li>
  </ul>
  <h3>${lan === "EN" ? "Message" : "Nachricht"}:</h3>
  <p>${req.body.notes}</p>
`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(smtp.getSmtp());

  // setup email data with unicode symbols
  let mailOptions = {
    from: `"${req.body.first_name} ${req.body.last_name}" <${req.body.email}>`, // sender address
    to: 'buchung@rnrherberge.de', // list of receivers
    subject: `${lan === "EN" ? "Booking Request" : "Buchungs Anfrage"}`, // Subject line
    text: `${lan === "EN" ? "New booking request" : "Neue Zimmerbuchung"} - `, // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}
