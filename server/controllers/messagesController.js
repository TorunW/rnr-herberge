var db = require('../database/db');
const nodemailer = require('nodemailer');

var smtp = require('../config/smtp');

exports.getMessages = (req, res) => {
  var sql = 'SELECT * FROM messages ORDER BY created_at DESC';
  var params = [req.params.id];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.getMessage = (req, res) => {
  var sql = 'SELECT * FROM messages WHERE msg_id = ?';
  var params = [req.params.id];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.createMessage = (req, res) => {
  const { name, email, msg } = req.body;
  var sql = 'INSERT INTO messages (name, email, msg ) VALUES (?,?,?)';
  var params = [name, email, msg];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: result,
      id: this.lastID,
    });
    sendMessage(req, res);
  });
};

function sendMessage(req, res) {
  const output = `
  <p>Message - Nachricht</p>
  <hr/>
  <ul>  
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
  </ul>
  <h3>Message/Nachricht:</h3>
  <p>${req.body.msg}</p>
`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(smtp.getSmtp());

  // setup email data with unicode symbols
  let mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`, // sender address
    to: 'torun.wikstrom@gmail.com', // list of receivers
    subject: 'Message - Nachricht', // Subject line
    text: 'New message - Neue nachricht', // plain text body
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
