var sqlite3 = require('sqlite3').verbose();
var md5 = require('md5');

const DBSOURCE = 'db.sqlite';

let db = new sqlite3.Database(DBSOURCE, err => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');

    // Pages
    db.run(
      `CREATE TABLE pages (
                page_id INTEGER PRIMARY KEY AUTOINCREMENT,
                title text UNIQUE, 
                link text,
                ord INTEGER,
                language text,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT title_unique UNIQUE (title)
            )`,
      err => {
        if (err) {
          // Table already created
          console.log('Pages table already created');
        } else {
          // Table just created, creating some rows
          var insert = 'INSERT INTO pages (title, link, ord) VALUES (?,?,?)';
          db.run(insert, ['home', 'home', 1]);
          db.run(insert, ['test', 'test', 2]);
          // db.run(insert, ['with space', 'with_space', 'pictures/3.jpg', 0.3]);
        }
      }
    );

    // Posts
    db.run(
      `CREATE TABLE posts (
                post_id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_id INTEGER, 
                title text,
                content text,
                type text,
                ord INTEGER,
                language text,
                CONSTRAINT post_id_unique UNIQUE (post_id)
            )`,
      err => {
        if (err) {
          // Table already created
          console.log('Posts table already created');
        } else {
          // Table just created, creating some rows
          var insert =
            'INSERT INTO posts (page_id,title, type, ord, language) VALUES (?,?,?,?,?)';
          db.run(insert, [1, 'I am the article title', 'article', 1, 'eng']);
          db.run(insert, [2, 'I am the form', 'form', 2, 'de']);
        }
      }
    );

    // Messages
    db.run(
      `CREATE TABLE messages (
                msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text, 
                email text, 
                msg text,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT msg_id_unique UNIQUE (msg_id)
            )`,
      err => {
        if (err) {
          // Table already created
          console.log('Messages table already created');
        } else {
          // Table just created, creating some rows
          console.log('Messages table created');
        }
      }
    );

    // Bookings
    db.run(
      `CREATE TABLE bookings (
                    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    first_name text, 
                    last_name text,
                    email text,
                    telefon text, 
                    room text,
                    guest_count text,
                    arrival text,
                    departure text,
                    notes text,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT booking_id_unique UNIQUE (booking_id)
                )`,
      err => {
        if (err) {
          // Table already created
          console.log('Bookings table already created');
        } else {
          // Table just created, creating some rows
          console.log('Bookings table created');
        }
      }
    );

    // Translations
    db.run(
      `CREATE TABLE translations (
        translation_id INTEGER PRIMARY KEY AUTOINCREMENT,
        de_id text,
        eng_id text,
        item_type text,
        CONSTRAINT translation_id_unique UNIQUE (translation_id)
      )`,
      err => {
        if (err) {
          // Table already created
          console.log('translations table already created');
        } else {
          // Table just created, creating some rows
          console.log('translations table created');
        }
      }
    );

    // Users
    db.run(
      `CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username text, 
                email text UNIQUE, 
                password text,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt text,
                CONSTRAINT email_unique UNIQUE (email)
            )`,
      err => {
        if (err) {
          // Table already created
          console.log('Users table already created');
        } else {
          // Table just created, creating some rows
          var insert =
            'INSERT INTO users (username, email, password) VALUES (?,?,?)';
          db.run(insert, ['admin', 'admin@example.com', 'admin123456']);
          db.run(insert, ['user', 'user@example.com', 'user123456']);
        }
      }
    );
  }
});

module.exports = db;
