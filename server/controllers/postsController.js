var db = require('../database/db');

// get posts
exports.getPostsByPageId = (req, res) => {
  var sql = 'SELECT * FROM posts WHERE page_id = ?  ORDER BY ord ASC';
  var params = [req.params.id];
  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
};

// create post, here we choose if we want to create an article (in admin we see like a text editor), or if we want a form (for contact or bookings)
exports.createPost = (req, res) => {
  console.log('create post');
  const { page_id, title, content, ord, type } = req.body;
  var sql =
    'INSERT INTO posts (page_id, title, content, ord, type  ) VALUES (?,?,?,?,?)';
  var params = [page_id, title, content, ord, type];
  console.log(sql);
  console.log(params);
  db.run(sql, params, function (err, result) {
    console.log(result);
    console.log(err);
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

// edit/update existing posts
exports.updatePost = (req, res) => {
  const { page_id, title, content, ord, type } = req.body;
  db.run(
    `UPDATE posts SET 
      page_id = COALESCE(?,page_id),
        title = COALESCE(?,title),
        content = COALESCE(?,content),
        ord = COALESCE(?,ord),
        type = COALESCE(?,type)
        WHERE post_id = ?`,
    [page_id, title, content, ord, type, req.params.id],
    function (err, result) {
      console.log(err);
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: 'success' });
    }
  );
};

// delete posts
exports.deletePost = (req, res) => {
  db.run(
    'DELETE FROM posts WHERE post_id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: 'deleted', changes: this.changes });
    }
  );
};
