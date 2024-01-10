const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const http = require('http');


const server = http.createServer();

const app = express();
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

require("dotenv").config()
const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
})

db.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database: ", err);
    } else {
        console.log("Successfully connected to the database");
        connection.release();
    }
});


//Route to Add an item to inventory 
app.post('/addItem', (req, res) => {
    const { item_id,item_name,quantity,description } = req.body;
    const query = 'SELECT * from grocery WHERE item_id = ?';
    db.query(query, [item_id], (error, results) => {
        if (error) {
            return res.status(500).send({ success: false, message: 'Error querying the database', error });
        }

        if (results.length) {
            return res.status(400).send({ success: false, message: 'Item already exists' });
        }
        const newItem = {
            item_id,item_name,quantity,description
        };

        db.query('INSERT INTO grocery SET ?', newItem, (error, results) => {
            if (error) {
                return res.status(500).send({ success: false, message: 'Error inserting data into the database', error });
            }

            newItem['_id'] = results.insertId;
            return res.status(200).send({ success: true, message: 'Item added successfully', item: { newItem } });
        });
    });
});

//Route to Get all items from inventory 
app.get('/getItems', (req,res) => {
    const query = 'SELECT * FROM grocery';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).send({ success: false, message: "Error querying the database", error });
        }

        if (results.length) {
            return res.status(200).send({ success: true, message: 'Items fetched successfully!', items: results });
        } else {
            return res.status(200).send({ success: false, message: 'No items found!' });
        }
    })
})

const port = process.env.PORT || 3000;


app.listen(port, () => console.log(`Server Started on port ${port}...`)).setMaxListeners(10);
