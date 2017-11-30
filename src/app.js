const pm = require('promisemaker');
const mysql = require('mysql');
const express = require('express');
const app = express();

// Create a connection
const db = pm(
  mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "myskul",
    database: "petregister"
  }),
  {
    rejectOnErrors: false,
    mapArgsToProps: {
      query: ["rows", "fields"]
    }
  }
);

app.get('/', async function(req,res) {
    let result = await query('SELECT * FROM petOwners');
    console.log(result);
    res.json(result);
});

app.get('/pets/:pnr', async function(req,res) {
    const pnr = req.params.pnr;
    console.log(pnr);
    let result = await query('SELECT * FROM petsandowners WHERE pnr = ' + pnr);
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
