const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const http = require('http');


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
// app.post('/addItem', (req, res) => {
//     const { item_id,item_name,quantity,description } = req.body;
//     const query = 'SELECT * from grocery WHERE item_id = ?';
//     db.query(query, [item_id], (error, results) => {
//         if (error) {
//             return res.status(500).send({ success: false, message: 'Error querying the database', error });
//         }

//         if (results.length) {
//             return res.status(400).send({ success: false, message: 'Item already exists' });
//         }
//         const newItem = {
//             item_id,item_name,quantity,description
//         };

//         db.query('INSERT INTO grocery SET ?', newItem, (error, results) => {
//             if (error) {
//                 return res.status(500).send({ success: false, message: 'Error inserting data into the database', error });
//             }

//             newItem['_id'] = results.insertId;
//             return res.status(200).send({ success: true, message: 'Item added successfully', item: { newItem } });
//         });
//     });
// });

app.post('/addItems', async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    const items = req.body; // Expecting an array of items

    // Extract all item IDs
    const itemIds = items.map(item => item.item_id);

    // Check if any of the items already exist
    const existingItemsQuery = 'SELECT item_id FROM grocery WHERE item_id IN (?)';
    db.query(existingItemsQuery, [itemIds], (error, results) => {
        if (error) {
            return res.status(500).send({ success: false, message: 'Error querying the database', error });
        }

        const existingItemIds = new Set(results.map(item => item.item_id));

        // Filter out items that already exist
        const newItems = items.filter(item => !existingItemIds.has(item.item_id));

        if (newItems.length === 0) {
            return res.status(400).send({ success: false, message: 'All items already exist' });
        }

        // Prepare bulk insert data
        const insertData = newItems.map(({ item_id, item_name, quantity, description }) => [item_id, item_name, quantity, description]);

        // Bulk insert new items
        const insertQuery = 'INSERT INTO grocery (item_id, item_name, quantity, description) VALUES ?';
        db.query(insertQuery, [insertData], (error, results) => {
            if (error) {
                return res.status(500).send({ success: false, message: 'Error inserting data into the database', error });
            }

            return res.status(200).send({ success: true, message: `${newItems.length} items added successfully` });
        });
    });
});


//Route to Get all items from inventory 
app.get('/getItems', (req,res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
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
