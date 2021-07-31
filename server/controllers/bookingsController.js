var db = require("../database/db");

exports.getBookings = (req, res) => {
  var sql = "SELECT * FROM bookings";
  var params = [req.params.id];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};
