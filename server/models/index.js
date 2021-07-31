"use strict";
 
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './db.sqlite' // or ':memory:'
});
var db = {};
 
 
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model =  require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model;
    });
 
Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
 
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;