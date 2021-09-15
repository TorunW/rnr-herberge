var db = require('../database/db');
var md5 = require('md5');

exports.getUsers = function (req, res) {
  var sql = 'select * from user';
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
};

exports.getUserById = function (req, res) {
  var sql = 'select * from user where id = ?';
  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row,
    });
  });
};

exports.getUser = function (req, res) {
  res.json(req.user);
};

exports.createUser = function (req, res) {
  var errors = [];
  if (!req.body.password) {
    errors.push('No password specified');
  }
  if (!req.body.email) {
    errors.push('No email specified');
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(',') });
    return;
  }
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password),
  };
  var sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)';
  var params = [data.name, data.email, data.password];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID,
    });
  });
};

exports.updateUser = function (req, res) {
  var data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password ? md5(req.body.password) : null,
  };
  db.run(
    `UPDATE users set 
           username = COALESCE(?,username), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
    [data.username, data.email, data.password, req.params.id],
    function (err, result) {
<<<<<<< HEAD
      console.log(err)
=======
      console.log('hhhhhhhh');
      console.log(err, 'err', result, 'result');
>>>>>>> 6f310d15c4a3ff1cb5d32df9219ba3fc5bbbdf5a
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({
        message: 'success',
        data: data,
        changes: this.changes,
      });
    }
  );
};
