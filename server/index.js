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



var con = null;

const port = 3593;
app.use(express.json())
app.use(cors())

server.listen(port, () => {
    console.log(`Server is running at http://dam.inspedralbes.cat:${port}`);
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
    dades = []
    dades = req.body;
    connectarBD();
    con.query(`INSERT INTO productes (nom, descripcio, preu, quantitat, imatge, id_categoria) VALUES ("${dades.nom}","${dades.descripcio}",${dades.preu},${dades.quantitat},"${dades.imatge}",${dades.id_categoria})`, function (err, result) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
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
app.post('/actualitzarProducte', (req, res) => {
    id = req.params.id;
    dades = []
    dades = req.body;
    connectarBD()
    con.query(`UPDATE productes SET nom="${dades.nom}", descripcio="${dades.descripcio}", preu=${dades.preu}, quantitat=${dades.quantitat}, imatge="${dades.imatge}", id_categoria="${dades.id_categoria}" WHERE id=${dades.id}`,
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
    connectarBD()
    usuariDades = []
    usuariDades = (req.body)
    comprovacio = true

    con.query(`SELECT email FROM usuario`, function (err, emails, fields) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            emails.forEach(email => {
                if (email.email == usuariDades.email) {
                    console.log("Aquest mail ja està en ús")
                    comprovacio = false
                }
            })
            if (comprovacio) {
                con.query(`INSERT INTO usuario (nom, cognoms, email, contrasenya) VALUES ("${usuariDades.nom}","${usuariDades.cognoms}","${usuariDades.email}","${usuariDades.contrasenya}")`, function (err, result) {
                    if (err) {
                        console.log("No s'ha pogut completar l'acció")
                        throw err;
                    }
                    else {
                        console.log("Usuari creat", result)
                        res.status(200).send()
                    }

                })
            }
        }
        tancarBD()
    })

})

app.post('/afegirTargeta', (req, res) => {
    connectarBD()
    targetaDades = []
    targetaDades = (req.body)

    con.query(`SELECT id FROM usuario WHERE email="` + targetaDades.email + '"', function (err, ids, result) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            con.query(`INSERT INTO tarjeta (id_usuari, numeroTarjeta, cvc, fecha_Expiracio, titular) VALUES ("${ids[0].id}","${targetaDades.numeroTarjeta}",${targetaDades.cvc},"${targetaDades.fecha_Expiracio}","${targetaDades.titular}")`, function (err, result) {
                if (err) {
                    console.log("No s'ha pogut completar l'acció")
                    throw err;
                }
                else {
                    console.log("Targeta afegida: ", result)
                    res.status(200).send()
                }

            })
        }
        tancarBD()
    })


})

app.post('/getComandes', (req, res) => {
    connectarBD()
    emailUser = []
    emailUser = req.body

    comandaEnviar = []

    comandaIndividual = {
        id: 0,
        estado: "",
        fechaComanda: "",
        fechaFinalizacion: "",
        productesComanda: []
    }

    con.query('SELECT id FROM usuario WHERE email="' + emailUser.email + '"', function (err, ids, fields) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            con.query('SELECT * FROM comanda WHERE id_usuari=' + ids[0].id, function (err, comandes, fields) {
                if (err) {
                    console.log("No s'ha pogut completar l'acció")
                    throw err;
                }
                else {
                    comandes.forEach(comanda => {
                        comandaIndividual.id = comanda.id
                        comandaIndividual.estado = comanda.estado
                        comandaIndividual.fechaComanda = comanda.fechaComanda
                        comandaIndividual.fechaFinalizacion = comanda.fechaFinalizacion
                        con.query('SELECT * FROM linia_comanda WHERE id_comanda=' + comanda.id, function (err, liniesComandes, fields) {
                            if (err) {
                                console.log("No s'ha pogut completar l'acció")
                                throw err;
                            }
                            else {
                                liniesComandes.forEach(liniaComanda => {
                                    con.query('SELECT * FROM productos WHERE id=' + liniaComanda.id_producte), function (err, productes, fields) {
                                        productes.forEach(producte => {
                                            comandaIndividual.productesComanda.push(producte)
                                        })
                                    }
                                })
                                comandaEnviar.push(comandaIndividual)
                            }
                        })
                    })
                    tancarBD()
                    res.json(comandaEnviar)
                }
            })
        }
    })
})

app.get('/getTotesComandes', (req, res) => {
    connectarBD()
    comandaEnviar = []

    comandaIndividual = {
        id: 0,
        estado: "",
        fechaComanda: "",
        fechaFinalizacion: "",
        productesComanda: []
    }


    con.query('SELECT * FROM comanda', function (err, comandes, fields) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            comandes.forEach(comanda => {
                comandaIndividual.id = comanda.id
                comandaIndividual.estado = comanda.estado
                comandaIndividual.fechaComanda = comanda.fechaComanda
                comandaIndividual.fechaFinalizacion = comanda.fechaFinalizacion
                con.query('SELECT * FROM linia_comanda WHERE id_comanda=' + comanda.id, function (err, liniesComandes, fields) {
                    if (err) {
                        console.log("No s'ha pogut completar l'acció")
                        throw err;
                    }
                    else {
                        liniesComandes.forEach(liniaComanda => {
                            con.query('SELECT * FROM productos WHERE id=' + liniaComanda.id_producte), function (err, productes, fields) {
                                productes.forEach(producte => {
                                    comandaIndividual.productesComanda.push(producte)
                                })
                            }
                        })
                        comandaEnviar.push(comandaIndividual)
                    }
                })
            })

        }
    })

    tancarBD()
    res.json(comandaEnviar)
})


app.post('/addComandes', (req, res) => {
    connectarBD()
    dadesComanda = []
    dadesComanda = req.body

    con.query('SELECT id FROM usuario WHERE email="' + dadesComanda.email + '"', function (err, ids, fields) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            con.query('INSERT INTO comanda (estado, fechaComanda, fechaFinalizacion, id_usuari, preuTotal) VALUES ("' + dadesComanda.estado + '","' + dadesComanda.fechaComanda + '","' + dadesComanda.fechaFinalizacion + '",' + ids[0].id + ',' + dadesComanda.preuTotal, function (err, result) {
                if (err) {
                    console.log("No s'ha pogut completar l'acció")
                    throw err;
                }
                else {

                    con.query('SELECT id FROM comanda WHERE id=' + ids[0].id + 'AND fechaComanda="' + dadesComanda.fechaComanda + '" AND fechaFinalizacion="' + dadesComanda.fechaFinalizacion + '"', function (err, idComandes, fields) {
                        if (err) {
                            console.log("No s'ha pogut completar l'acció")
                            throw err
                        }
                        else {
                            for (i = 0; i < dadesComanda.productes.length; i++) {
                                con.query('INSERT INTO linia_comanda (id_comanda, id_producto, quantitat) VALUES (' + idComandes[0].id + ',' + dadesComanda.productes[i].id + ',' + dadesComanda.productes[i].quantitat, function (err, result) {
                                    if (err) {
                                        console.log("No s'ha pogut completar l'acció")
                                        throw err
                                    }
                                })
                            }
                        }
                    })



                }
            })
        }
        tancarBD()
    })


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