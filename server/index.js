const express = require('express');
const http = require ('http')
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const server = http.createServer(app)
const fs = require('fs');
const mysql = require('mysql');
const { resolve } = require('path');
const { fail } = require('assert');



var con = null;

const port = 3593;
app.use(express.json())
app.use(cors())

function connectarBD() {
    con = mysql.createConnection({
        host: "dam.inspedralbes.cat",
        user: "a22osczapmar_Projecte1",
        password: "Projecte1",
        database: "a22osczapmar_globalmarket"
    })
    con.connect(function (err) {
        if (err) {
            console.log("No s'ha pogut establir la connexió")
            throw err;
        }
        else {
            console.log("Connexió establerta")
        }
    })
}

function tancarBD() {
    con.end(function (err) {
        if (err) {
            console.log("No s'ha pogut tancar la connexió")
            throw err;
        }
        else {
            console.log("Connexió tancada")
        }
    })
}



app.get('/consultarUsuaris', (req, res) => {
    con.query("SELECT * FROM usuario", function (err, usuaris, fields) {
        if (err) throw err;
        usuarisEnviar = []
        usuaris.forEach(usuari => {
            usuariIndividual = {id: usuari.id, contrasenya: usuari.contrasenya, nom: usuari.nom, cognoms: usuari.cognoms, email: usuari.email}
            usuarisEnviar.push(usuariIndividual)
        })

        res.json(usuarisEnviar)
        
                
    })
});

app.get('/consultarProductes', (req, res) => {
    connectarBD()
    con.query("SELECT productes.*, categorias.nom AS catNom FROM productes JOIN categorias ON productes.id_categoria=categorias.id", function (err, productes, fields) {
        if (err) throw err;
        productesEnviar = []
        productes.forEach(producte => {
            producteIndividual = {id: producte.id, nom: producte.nom, descripcio: producte.descripcio, preu: producte.preu, quantitat: producte.quantitat, imatge: producte.imatge, id_categoria: producte.id_categoria, nom_categoria: producte.catNom}
            productesEnviar.push(producteIndividual)
        })
        res.json(productesEnviar)
    })
    tancarBD()
});

app.post('/iniciSessio', (req, res)=>{

})

app.post('/iniciSessio', (req, res)=>{
    
})



server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });