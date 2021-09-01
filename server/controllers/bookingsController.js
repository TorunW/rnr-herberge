const { TouchZoomRotateHandler } = require('mapbox-gl');
var db = require('../database/db');
const nodemailer = require('nodemailer');

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
    notes,
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
    notes,
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
  const output = `
  <p>You have a new booking request/ Ihr habt eine neue Buchungsanfrage</p>
  <hr/>
  <ul>  
    <li>Firstname/Vorname: ${req.body.first_name}</li>
    <li>Lastname/Name: ${req.body.last_name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.telephone}</li>
    <li>Room/Zimmer: ${req.body.room}</li>
    <li>Number of guests/ Anzahl personen: ${req.body.guest_count}</li>
    <li>Arrival/Ankunft: ${req.body.arrival}</li>
    <li>Departure/Abreise: ${req.body.departure}</li>
    <li>Message/Nachricht: ${req.body.notes}</li>
  </ul>
  <h3>Message/Nachricht:</h3>
  <p>${req.body.notes}</p>
`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smpt-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'torun.wikstroem@outlook.com', // generated ethereal user
      pass: '_hwG8Cs_!)8LS,H', // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Nodemailer Contact" <torun.wikstroem@outlook.com>', // sender address
    to: 'torun.wikstrom@gmail.com', // list of receivers
    subject: 'Booking Request- Buchungs Anfrage', // Subject line
    text: 'Hello world?', // plain text body
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
