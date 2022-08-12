"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoffee = exports.editCoffee = exports.editCoffeePage = exports.addCoffee = exports.addCoffeePage = exports.oneCoffee = exports.allCoffee = exports.defaultCoffee = void 0;
const mysql_1 = __importDefault(require("mysql"));
const db = mysql_1.default.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'sqluser',
    password: 'password',
    database: `mydb`
});
db.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
});
const defaultCoffee = (req, res, next) => {
    res.redirect('/coffee');
};
exports.defaultCoffee = defaultCoffee;
const allCoffee = (req, res, next) => {
    let myQuery = `SELECT * FROM coffee`;
    db.query(myQuery, (err, data, fields) => {
        if (err) {
            res.send(err);
        }
        res.render('all-coffee', {
            coffeeList: data
        });
    });
};
exports.allCoffee = allCoffee;
const oneCoffee = (req, res, next) => {
    let itemId = req.params.coffeeId;
    let myQuery = `SELECT * FROM coffee WHERE coffeeId='${itemId}' LIMIT 1`;
    db.query(myQuery, (err, data, fields) => {
        if (err) {
            return res.send(err);
        }
        console.log(data);
        if (data.length == 0) {
            return res.status(404).render('error', {
                message: "This is not the URL you are looking for!"
            });
        }
        let foundCoffee = data[0];
        res.render('coffee-detail', {
            foundCoffee
        });
    });
};
exports.oneCoffee = oneCoffee;
const addCoffeePage = (req, res, next) => {
    res.render('add-coffee');
};
exports.addCoffeePage = addCoffeePage;
const addCoffee = (req, res, next) => {
    let newItem = req.body;
    let myQuery = `INSERT INTO coffee (name, description, price) VALUES ('${newItem.name}', '${newItem.description}', '${newItem.price}')`;
    db.query(myQuery, (err, data, fields) => {
        if (err) {
            return res.send(err);
        }
        console.log(data);
        res.redirect('/coffee');
    });
};
exports.addCoffee = addCoffee;
const editCoffeePage = (req, res, next) => {
    let itemId = req.params.coffeeId;
    let myQuery = `SELECT * FROM coffee WHERE coffeeId='${itemId}' LIMIT 1`;
    db.query(myQuery, (err, data, fields) => {
        if (err) {
            return res.send(err);
        }
        console.log(data);
        if (data.length == 0) {
            return res.status(404).render('error', {
                message: "This is not the URL you are looking for!"
            });
        }
        let foundCoffee = data[0];
        res.render('edit-coffee', {
            foundCoffee
        });
    });
};
exports.editCoffeePage = editCoffeePage;
const editCoffee = (req, res, next) => {
    let itemId = req.params.coffeeId;
    let editItem = req.body;
    let myQuery = `UPDATE coffee SET name='${editItem.name}', description='${editItem.description}', price='${editItem.price}' WHERE coffeeId=${itemId}`;
    db.query(myQuery, (err, data, fields) => {
        if (err) {
            return res.send(err);
        }
        console.log(data);
        res.redirect('/coffee');
    });
};
exports.editCoffee = editCoffee;
const deleteCoffee = (req, res, next) => {
    let itemId = req.params.coffeeId;
    let myQuery = `DELETE FROM coffee WHERE coffeeId=${itemId}`;
    db.query(myQuery, (err, data, fields) => {
        if (err) {
            return res.send(err);
        }
        console.log(data);
        res.redirect('/coffee');
    });
};
exports.deleteCoffee = deleteCoffee;
