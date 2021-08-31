var db = require('../database/db');

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
  });
};
