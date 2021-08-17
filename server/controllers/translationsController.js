var db = require('../database/db');

exports.getPageTranslation = (req, res) => {
  var sql = `SELECT * FROM translations WHERE item_type = 'page' AND de_id = ?`;
  var params = [req.params.id];
  db.all(sql, params, (err, row) => {
    console.log(err);
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.getPostTranslation = (req, res) => {
  var sql = `SELECT * FROM translations WHERE item_type = 'post' AND de_id = ?`;
  var params = [req.params.id];
  db.all(sql, params, (err, row) => {
    console.log(err);
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

exports.createTranslation = (req, res) => {
  const { de_id, eng_id, item_type } = req.body;
  var sql =
    'INSERT INTO translations ( de_id, eng_id, item_type ) VALUES (?,?,?)';
  var params = [de_id, eng_id, item_type];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: result,
      id: this.lastID,
    });
  });
};
