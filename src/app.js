require('dotenv').config({path: __dirname + '/.env'});
const pm = require('promisemaker');
const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

// Create a connection
const db = pm(
  mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }),
  {
    rejectOnErrors: false,
    mapArgsToProps: {
      query: ["rows", "fields"]
    }
  }
);

app.use(express.static(__dirname + '/www'));
app.use(bodyparser.json());

app.get('/petowners', async function(req,res) {
    const result = await query('SELECT * FROM petOwners');
    res.json(result);
});

app.get('/petowners/:pnr', async function(req,res) {
    const result = await query(`
        SELECT * FROM petOwners
        WHERE pnr = ?
    `,[req.params.pnr]);
    res.json(result);
});

app.delete('/petowners/:pnr', async function(req,res) {
    const result = await query(`
        DELETE FROM petOwners WHERE pnr = ?
    `,[req.params.pnr]);
    res.json(result);
});

app.get('/pets/:pnr', async function(req,res) {
    const pnr = req.params.pnr;
    let result = await query('SELECT * FROM petsandowners WHERE pnr = ' + pnr);
    res.json(result);
});

app.post('/petowners', async function(req,res) {
    const owner = req.body;
    const result = await query('INSERT INTO petOwners SET ?',[owner]);
    res.json(result);
});

app.listen(3030, () => {
    console.log('app listening on port 3030');
});

// a helper function that makes query syntax shorter
async function query(query, params){
    let result = await db.query(query, params);
    return result.rows;
}
