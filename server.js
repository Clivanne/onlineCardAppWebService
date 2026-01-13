// include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialize Express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start the server
app.listen(port, () => {
    console.log('Server running on port', port);
});

//Example Route: Get all cards
app.get('/allcards', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.cards');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allcards' });
    }
});

app.post('/addcard', async (req, res) => {
    const{ card_name, card_pic} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO cards (card_name, card_pic) VALUES (?,?)', [card_name, card_pic]);
        res.status(201).json({message: 'Card '+card_name+' added successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add card '+card_name});
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM rptasks');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving tasks' });
    }
});

app.post('/addtask', async (req, res) => {
    const { task_name, task_status } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO rptasks (task_name, task_status) VALUES (?, ?)',
            [task_name, task_status]
        );
        res.json({ message: 'Task added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding task' });
    }
});



app.put('/updatetask/:id', async (req, res) => {
    const { id } = req.params;
    const { task_name, task_status } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE rptasks SET task_name = ?, task_status = ? WHERE id = ?',
            [task_name, task_status, id]
        );
        res.json({ message: 'Task updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating task' });
    }
});

app.delete('/deletetask/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM rptasks WHERE id = ?',
            [id]
        );
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting task' });
    }
});

app.get('/allkpop', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM kpop');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for allkpop' });
    }
});

// Add a new KPOP group
app.post('/addkpop', async (req, res) => {
    const { group_name, group_pic } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO kpop (group_name, group_pic) VALUES (?, ?)',
            [group_name, group_pic]
        );
        res.status(201).json({
            message: 'KPOP group ' + group_name + ' added successfully.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Server error - could not add KPOP group ' + group_name
        });
    }
});