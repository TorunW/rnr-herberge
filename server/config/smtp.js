exports.getSmtp = () => {
  return {
    host: 'smtp-mail.outlook.com',
    secureConnection: false,
    port: 587,
    auth: {
      user: 'rnrherberge@outlook.de',
      pass: '???3fragezeichen',
    },
    tls: {
      ciphers: 'SSLv3',
    },
  };
};

// exports.getSmtpBooking = () => {
//   return {
//     host: 'smtp.ionos.de',
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     logger: true,
//     debug: true,
//     auth: {
//       user: 'buchung@rnrherberge.de ', // generated ethereal user
//       pass: '???3fragezeichen', // generated ethereal password
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   };
// };
