var db = require('../database/db');
var SibApiV3Sdk = require("sib-api-v3-sdk");
var defaultClient = SibApiV3Sdk.ApiClient.instance;
// Configure API key authorization: api-key
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SMTP_API_KEY

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
  const { name, email, msg, language } = req.body;
  var sql =
    'INSERT INTO messages (name, email, msg ) VALUES (?,?,?)';
  var params = [name, email, msg];
  console.log(sql,params);
  db.run(sql, params, function (err, result) {
    if (err) {
      console.log(err);
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
  <p>${req.body.language} </p>
  <hr/>
  <ul>  
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
  </ul>
  <h3>Message/Nachricht:</h3>
  <p>${req.body.msg}</p>`;


var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
sendSmtpEmail = {
  sender: { 
    email: "info@rnrherberge.de",
    text: 'RnR Herberge', // plain text body
  },
  to: [
    {
      email: 'info@rnrherberge.de',
      email:"dnelband@gmail.com"
    }
  ],
  replyTo: {
    email: req.body.email,
    name: req.body.name
  },
  subject:"New Message",
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

  // // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport(smtp.getSmtp());

  // // setup email data with unicode symbols
  // let mailOptions = {
  //   from: `"${req.body.name}" <${req.body.email}>`, // sender address
  //   to: 'info@rnrherberge.de', // list of receivers
  //   subject: 'Message - Nachricht', // Subject line
  //   text: 'New message - Neue nachricht', // plain text body
  //   html: output, // html body
  // };

  // // send mail with defined transport object
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     return console.log(error);
  //   }
  //   console.log('Message sent: %s', info.messageId);
  //   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // });
}
