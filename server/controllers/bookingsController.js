var db = require('../database/db');
const nodemailer = require('nodemailer');
var smtp = require('../config/smtp-config');

var SibApiV3Sdk = require("sib-api-v3-sdk");
var defaultClient = SibApiV3Sdk.ApiClient.instance;
// Configure API key authorization: api-key
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = "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"

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
  const output = 
  `<hr/>
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
  <p>${req.body.notes}</p>`;

  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
  sendSmtpEmail = {
    sender: { 
      email: "info@rnrherberge.de",
    },
    to: [
      {
        email: 'buchung@rnrherberge.de',
        // email:"dnelband@gmail.com"
      }
    ],
    replyTo: {
      email: req.body.email,
      name: `"${req.body.first_name} ${req.body.last_name}"`
    },
    subject: `${lan === "EN" ? "Booking Request" : "Buchungs Anfrage"}`, // Subject line
    htmlContent: output,
  };
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("API called successfully. Returned data: " + data);
    },
    function (error) {
      console.error(error);
      console.log('ERROR')
    }
  );
}


function SendTestEmail(address) {
  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  // console.log(apiInstance, " API INSTANCE")
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
  sendSmtpEmail = {
    sender: { email: "sender@email.com" },
    to: [
      {
        email: "person@email.com",
        name: "Person Name",
      },
    ],
    subject: "Test Email",
    textContent: "Test Email Content",
  };

  // console.log(sendSmtpEmail," SEND SMTP EMAIL")

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("API called successfully. Returned data: " + data);
    },
    function (error) {
      console.error(error);
    }
  );
}

/*

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

  */