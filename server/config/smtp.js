exports.getSmtp = () => {
  return {
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'herbergernr@gmail.com',
      pass: '???3fragezeichen',
    },
  };
};
