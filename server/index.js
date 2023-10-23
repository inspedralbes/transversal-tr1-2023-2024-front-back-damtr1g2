const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const fs = require('fs');
const mysql = require('mysql2')

var con = mysql.createConnection({
    host: "dam.inspedralbes.cat",
    user: "a22osczapmar_Projecte1",
    password: "Projecte1",
    database: "a22osczapmar_globalmarket"
})


const port = 3000;
app.use(express.json())
app.use(cors())

function connectarBD() {
    con.connect(function (err) {
        if (err) {
            escriureLog("No s'ha pogut establir la connexió")
            throw err;
        }
        else {
            escriureLog("Connexió establerta")
        }
    })
}

function tancarBD() {
    con.end(function (err) {
        if (err) {
            escriureLog("No s'ha pogut tancar la connexió")
            throw err;
        }
        else {
            escriureLog("Connexió tancada")
        }
    })
}

app.get('/', (req, res) => {
    
  });