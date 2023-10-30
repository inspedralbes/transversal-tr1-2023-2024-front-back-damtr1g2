
const express = require('express');
const http = require('http')
const bodyParser = require('body-parser');
const cors = require("cors");
const mysql = require('mysql');
const fs = require('fs');

const app = express();
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server)
const { error } = require('console');



var con = null;

const port = 3001;

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

io.on('connection', (socket) => {
    socket.on('aceptarComanda', (data) => {
        connectarBD();
        con.query(`UPDATE comanda SET estado = 1 WHERE id = ${data}`, function (err, comanda) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                io.emit('message', { message: 'Comanda aceptada' })
                console.log("Comanda aceptada: ", comanda)
            }
        }),

            tancarBD();
    })
    socket.on('rechazarComanda', () => {
        connectarBD();
        con.query(`DELETE FROM comanda WHERE id = ${data}`, function (err, comanda) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                io.emit('message', { message: 'Comanda rechazada' })
                console.log("Comanda rechazada: ", comanda)
            }
        }),

            tancarBD();
    })
    socket.on('prepararComanda', () => {
        connectarBD();
        con.query(`UPDATE comanda SET estado = 2 WHERE id = ${data}`, function (err, comanda) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                io.emit('message', { message: 'Comanda preparada' })
                console.log("Comanda preparada: ", comanda)
            }
        }),

            tancarBD();
    })
    socket.on('recogerComanda', () => {
        connectarBD();
        con.query(`UPDATE comanda SET estado = 3 WHERE id = ${data}`, function (err, comanda) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                io.emit('message', { message: 'Comanda recogida' })
                console.log("Comanda recogida: ", comanda)
            }
        }),
            tancarBD();
    })
    socket.on('disconnect', () => {
        console.log('Disconected')
    })
})


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

app.post('/getComandes', async (req, res) => {
    const mail = req.body.email
    connectarBD();
    try {
        const comandas = await new Promise((resolve, reject) => {
            con.query(`SELECT comanda.*, usuario.* FROM comanda JOIN usuario ON comanda.id_usuari = usuario.id WHERE usuario.email = "${mail}"`, function (err, comandas, fields) {
                if (err) reject(err);
                resolve(comandas);
            });
        });

        const comandasEnviar = [];

        for (const comanda of comandas) {
            const productosCom = await new Promise((resolve, reject) => {
                con.query(`SELECT linia_comanda.*, productes.* FROM linia_comanda JOIN productes ON productes.id = linia_comanda.id_producto WHERE id_comanda = ${comanda.id}`, function (err, productosCom, fields) {
                    if (err) reject(err);
                    resolve(productosCom);
                });
            });

            const productosComanda = productosCom.map(producto => {
                return {
                    id: producto.id_producto, nom: producto.nom, preu: producto.preu, quantitat: producto.quantitatCom, preuTotal: producto.quantitatCom * producto.preu,
                    imatge: producto.imatge, descripcio: producto.descripcio
                };
            });

            const comandaIndividual = {
                id: comanda.id, estado: comanda.estado, fechaComanda: comanda.fechaComanda, fechaFinalizacion: comanda.fechaFinalizacion, id_usuari: comanda.id_usuari,
                preuTotal: comanda.preuTotal, lista_productos: productosComanda, email: comanda.email
            };
            comandasEnviar.push(comandaIndividual);
        }

        res.json(comandasEnviar);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/allComandes', (req, res) => {
    comandasEnviar = [];
    comandaIndividual = {}
    productesComanda = []
    producteIndividual = {}
    connectarBD();
    /*try {
        comandas = await new Promise((resolve, reject) => {
            con.query(`SELECT comanda.*, usuario.* FROM comanda JOIN usuario ON comanda.id_usuari = usuario.id`, function (err, comandas, fields) {
                if (err) reject(err);
                resolve(comandas);
            });
        });



        for (const comanda of comandas) {
            const productosCom = await new Promise((resolve, reject) => {
                con.query(`SELECT linia_comanda.*, productes.* FROM linia_comanda JOIN productes ON productes.id = linia_comanda.id_producto WHERE id_comanda = ${comanda.id}`, function (err, productosCom, fields) {
                    if (err) reject(err);
                    resolve(productosCom);
                });
            });

            const productosComanda = productosCom.map(producto => {
                return {
                    id: producto.id_producto,
                    nom: producto.nom,
                    preu: producto.preu,
                    quantitat: producto.quantitatCom,
                    preuTotal: producto.quantitatCom * producto.preu,
                    imatge: producto.imatge,
                    descripcio: producto.descripcio
                };
            });

            const comandaIndividual = {
                id: comanda.id,
                estado: comanda.estado,
                fechaComanda: comanda.fechaComanda,
                fechaFinalizacion: comanda.fechaFinalizacion,
                id_usuari: comanda.id_usuari,
                preuTotal: comanda.preuTotal,
                lista_productos: productosComanda,
                email: comanda.email
            };

            comandasEnviar.push(comandaIndividual);
        }

        res.json(comandasEnviar);
        tancarBD()
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }*/


    con.query('SELECT * FROM comanda', function (err, comandes, fields) {
        if (err) console.log("aaaa")
        else {
            comandes.forEach(comanda => {
                connectarBD();
                con.query('SELECT id_producto, quantitatCom FROM linia_comanda WHERE id_comanda=' + comanda.id, function (err, liniesComanda, fields) {
                    if (err) console.log("bbbb")
                    else {
                        liniesComanda.forEach(liniaComanda => {
                            con.query('SELECT * FROM productes WHERE id=' + liniaComanda.id_producto, function (err, productes, fields) {

                                if (err) console.log("cccc")
                                else {
                                    producteIndividual = {
                                        id: productes[0].id,
                                        nom: productes[0].nom,
                                        descripcio: productes[0].descripcio,
                                        quantitat: liniaComanda.quantitatCom,
                                        imatge: productes[0].imatge,
                                        preu: productes[0].preu,
                                        preuTotal: productes[0].preu * liniaComanda.quantitatCom
                                    }

                                    productesComanda.push(producteIndividual)
                                    console.log(productesComanda)

                                }

                            })
                        })
                    }
                })

                comandaIndividual = {
                    id: comanda.id,
                    id_usuari: comanda.id_usuari,
                    estado: comanda.estado,
                    fechaComanda: comanda.fechaComanda,
                    fechaFinalizacion: comanda.fechaFinalizacion,
                    preuTotal: comanda.preuTotal,
                    lista_productos: productesComanda,
                }

                console.log(comandaIndividual.lista_productos[0])

                productesComanda = []

                comandasEnviar.push(comandaIndividual)



            })
            res.json(comandasEnviar)

        }

    })

});

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
            con.query('INSERT INTO comanda (estado, fechaComanda, fechaFinalizacion, id_usuari, preuTotal) VALUES ("' + dadesComanda.estado + '","' + obtenerFechaActual() + '",NULL,' + ids[0].id + ',' + dadesComanda.preuTotal + ')', function (err, result) {
                if (err) {
                    console.log("No s'ha pogut completar l'acció")
                    throw err;
                }
                else {
                    const nuevaComandaId = result.insertId
                    let insercionesCompletadas = 0
                    for (i = 0; i < dadesComanda.productes.length; i++) {
                        con.query('INSERT INTO linia_comanda (id_comanda, id_producto, quantitatCom) VALUES (' + nuevaComandaId + ',' + dadesComanda.productes[i].id + ',' + dadesComanda.productes[i].quantitat + ')', function (err, result) {
                            if (err) {
                                console.log("No s'ha pogut completar l'acció")
                                throw err
                            } else {
                                insercionesCompletadas++
                                if (insercionesCompletadas === dadesComanda.productes.length) {
                                    // Todas las inserciones se han completado
                                    tancarBD()
                                    res.status(200).send()
                                }
                            }
                        })
                    }
                }
            })



        }
    })
})

//-----FUNCIONES--------
function obtenerFechaActual() {
    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Suma 1 al mes ya que en JavaScript los meses comienzan en 0
    const dia = fecha.getDate().toString().padStart(2, '0');

    const fechaFormateada = `${año}-${mes}-${dia}`;

    return fechaFormateada;

}