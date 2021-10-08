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
