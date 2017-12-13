const pm = require('promisemaker');
const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const config = require('./config.json');

// Create a connection
const db = pm(
  mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbName
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

app.post('/petowners', async function(req, res) {
    const owner = req.body;
    const result = await query('INSERT INTO petOwners SET ?',[owner]);
    res.json(result);
});

app.delete('/petowners/:pnr', async function(req, res) {
    const result = await query(`
        DELETE FROM petOwners WHERE pnr = ?
    `,[req.params.pnr]);
    res.json(result);
});

app.get('/pets/:pnr', async function(req, res) {
    const pnr = req.params.pnr;
    let result = await query('SELECT * FROM petsandowners2 WHERE pnr = ' + pnr);
    res.json(result);
});

app.post('/pets', async function(req, res) {
    const pet = req.body.pet;
    const ownerPnr = req.body.pnr;
    const result = await query('INSERT INTO pets SET ?', [pet]);
    const result2 = await query('INSERT INTO petOwnersPetsRelations SET ?', [{
        pnr: ownerPnr,
        petId: result.insertId
    }]);
    res.json({"msg":"Added pet successfully"});
});

app.delete('/pets/:id', async function(req, res) {
    const result = await query(`
        DELETE FROM pets WHERE id = ?
    `, [req.params.id]);
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
