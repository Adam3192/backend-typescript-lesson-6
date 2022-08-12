import { RequestHandler } from "express";
import { Coffee } from "../models/coffee";
import { coffeeList } from '../models/coffee-data';
import mysql, { FieldInfo, MysqlError } from 'mysql';

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'sqluser',
    password: 'password',
    database: `mydb`
});

db.connect((err: MysqlError) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
});

export const defaultCoffee: RequestHandler = (req, res, next) => {
    res.redirect('/coffee');
}

export const allCoffee: RequestHandler = (req, res, next) => {
    let myQuery = `SELECT * FROM coffee`;
    db.query(myQuery, (err: MysqlError, data: any, fields: FieldInfo) => {
        if (err) {
            res.send(err);
        }
        res.render('all-coffee', {
            coffeeList: data
        })
    });
}

export const oneCoffee: RequestHandler = (req, res, next) => {

    let itemId = req.params.coffeeId;

    let myQuery = `SELECT * FROM coffee WHERE coffeeId='${itemId}' LIMIT 1`;
    
    db.query(myQuery, (err: MysqlError, data: any, fields: FieldInfo) => {
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
        })
    });
}

export const addCoffeePage: RequestHandler = (req, res, next) => {
    res.render('add-coffee');
}

export const addCoffee: RequestHandler = (req, res, next) => {
    let newItem: Coffee = req.body;
    let myQuery = `INSERT INTO coffee (name, description, price) VALUES ('${newItem.name}', '${newItem.description}', '${newItem.price}')`;
    
    db.query(myQuery, (err: MysqlError, data: any, fields: FieldInfo) => {
        if (err) {
            return res.send(err);
        }
        console.log(data);
        res.redirect('/coffee');
    });
}

export const editCoffeePage: RequestHandler = (req, res, next) => {
    let itemId = req.params.coffeeId;

    let myQuery = `SELECT * FROM coffee WHERE coffeeId='${itemId}' LIMIT 1`;
    
    db.query(myQuery, (err: MysqlError, data: any, fields: FieldInfo) => {
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
        })
    });
}

export const editCoffee: RequestHandler = (req, res, next) => {
    let itemId: string = req.params.coffeeId;
    let editItem: Coffee = req.body;
    let myQuery = `UPDATE coffee SET name='${editItem.name}', description='${editItem.description}', price='${editItem.price}' WHERE coffeeId=${itemId}`
    
    db.query(myQuery, (err: MysqlError, data: any, fields: FieldInfo) => {
        if (err) {
            return res.send(err);
        }
        console.log(data);
        res.redirect('/coffee');
    });
}

export const deleteCoffee: RequestHandler = (req, res, next) => {
    let itemId: string = req.params.coffeeId;
    let myQuery = `DELETE FROM coffee WHERE coffeeId=${itemId}`;

    db.query(myQuery, (err: MysqlError, data: any, fields: FieldInfo) => {
        if (err) {
            return res.send(err);
        }
        console.log(data);
        res.redirect('/coffee');
    });
}