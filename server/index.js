const express = require('express');
const http = require('http')
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const server = http.createServer(app)
const fs = require('fs');
const mysql = require('mysql');
const { resolve } = require('path');
const { fail } = require('assert');
const socketIO = require('socket.io');



var con = null;

const port = 3001;
app.use(express.json())
app.use(cors())

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

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


//GET USUARIOS
app.get('/consultarUsuaris', (req, res) => {
    con.query("SELECT * FROM usuario", function (err, usuaris, fields) {
        if (err) throw err;
        usuarisEnviar = []
        usuaris.forEach(usuari => {
            usuariIndividual = { id: usuari.id, contrasenya: usuari.contrasenya, nom: usuari.nom, cognoms: usuari.cognoms, email: usuari.email }
            usuarisEnviar.push(usuariIndividual)
        })

        res.json(usuarisEnviar)


    })
});

//GET PRODUCTOS
app.get('/consultarProductes', (req, res) => {
    connectarBD()
    con.query("SELECT productes.*, categorias.nom AS catNom FROM productes JOIN categorias ON productes.id_categoria=categorias.id", function (err, productes, fields) {
        if (err) throw err;
        productesEnviar = []
        productes.forEach(producte => {
            producteIndividual = { id: producte.id, nom: producte.nom, descripcio: producte.descripcio, preu: producte.preu, quantitat: producte.quantitat, imatge: producte.imatge, id_categoria: producte.id_categoria, nom_categoria: producte.catNom }
            productesEnviar.push(producteIndividual)
        })
        res.json(productesEnviar)
    })
    tancarBD()
});

//ADD PRODUCTO
app.post('/afegirProducte', (req, res) => {
    console.log("afegir")
    dades = []
    dades= req.body;
    connectarBD();
    con.query(`INSERT INTO productes (nom, descripcio, preu, quantitat, imatge, id_categoria) 
    VALUES ("${dades.nom}","${dades.descripcio}",${dades.preu},${dades.quantitat},"${dades.imatge}",${dades.id_categoria})`, function (err, result) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            
        }
        else {
            console.log("Producte afegit: ", result)
        }

    })
    tancarBD()
});

//DELETE PRODUCTO
app.delete('/esborrarProducte/:id', (req, res) => {
    const id = req.params.id;
    connectarBD()
    con.query(`DELETE FROM productes WHERE id=${id}`, function (err, result) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            console.log("Producte esborrat")
        }

    })
    tancarBD()
});

//UPDATE PRODUCTO
app.post('/actualitzarProducte/', (req, res) => {
    const dades = req.body
    console.log(dades)
    connectarBD()
    con.query(`UPDATE productes SET 
    nom="${dades.nom}", descripcio="${dades.descripcio}", preu=${dades.preu}, quantitat=${dades.quantitat}, imatge="${dades.imatge}", id_categoria="${dades.id_categoria}" WHERE id=${dades.id}`,
        function (err, result) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
                
            }
            else {
                console.log("Producte actualitzat: ", result)
            }

        })
        
    tancarBD()
    
});

//INICIAR SESIÓN
app.post('/login', (req, res) => {
    login = []
    login = req.body
    usuariIndividual = {}
    comprovacio = false
    connectarBD()
    con.query("SELECT * FROM usuario", function (err, usuaris, fields) {
        if (err) throw err;
        else {
            usuaris.forEach(usuari => {
                if (usuari.email == login.email) {
                    console.log("Mail trobat")

                    if (usuari.contrasenya != login.password) {
                        console.log("Usuari o contrasenya incorrectes")
                        usuariIndividual = { email: "" }

                    }
                    else {
                        console.log("pwd trobat")
                        usuariIndividual = { password: "", nom: usuari.nom, cognoms: usuari.cognoms, email: usuari.email }
                        comprovacio = true
                        console.log(usuariIndividual)
                        res.json(usuariIndividual)
                    }

                }
                else if (!comprovacio) {
                    console.log("Usuari o contrasenya incorrectes")
                    usuariIndividual = { email: "" }
                }
            })
            if (!comprovacio) {
                
                res.json(usuariIndividual)
            }
        }
    })
    tancarBD()
})

//REGISTRAR USUARIO
app.post('/registrarUsuari', (req, res) => {
    usuariDades = []
    usuariDades=(req.body)
    con.query(`INSERT INTO usuario (nom, cognoms, email, contrasenya) 
    VALUES ("${usuariDades.nom}","${usuariDades.cognoms}",${usuariDades.email},"${usuariDades.contrasenya}"`, function (err, result) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            console.log("Usuari creat", result)
        }

    })
    connectarBD()





    tancarBD()
})

//-----FUNCIONES--------
function getMaxId(table) {
    connectarBD()
    con.query(`SELECT MAX(id) AS maxid FROM ${table}`, function (err, result) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }

    })
    tancarBD()
    return result[0].maxid;
}

//SOCKETS

const io = socketIO(server);

// Mapa de datos socket-username
const socketMap = new Map();

io.on('connection', (socket) => {
    console.log('A user connected');
  
    
    socket.on('setUsername', (username) => {
      console.log(`User '${username}' connected`);
      // Store the socket connection with the username
      socketMap.set(username, socket);
    });
  
    // Handle events from the Android app
    socket.on('androidEvent', (data) => {
      // Get the username associated with this socket
      const username = getUsernameBySocket(socket);
      console.log(`Data from ${username}:`, data);
  
      // Example: Send data only to this connection
      socket.emit('serverEvent', 'Hello from server to ' + username);
    });
  
    socket.on('disconnect', () => {
      // Remove the socket connection when the user disconnects
      const username = getUsernameBySocket(socket);
      console.log(`User '${username}' disconnected`);
      socketMap.delete(username);
    });
  });

  

function getUsernameBySocket(socket) {
  // Find the username associated with this socket
  for (const [username, userSocket] of socketMap.entries()) {
    if (userSocket === socket) {
      return username;
    }
  }
  return null;
}