exports.getSmtp = () => {
  return {
    host: 'smtp.ionos.de',
    port: 465,
    secure: true, // true for 465, false for other ports
    logger: true,
    debug: true,
    auth: {
      user: 'info@rnrherberge.de ', // generated ethereal user
      pass: '????4fragezeichen', // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  };
};

exports.getSmtpBooking = () => {
  return {
    host: 'smtp.ionos.de',
    port: 465,
    secure: true, // true for 465, false for other ports
    logger: true,
    debug: true,
    auth: {
      user: 'buchung@rnrherberge.de ', // generated ethereal user
      pass: '???3fragezeichen', // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  };
};
