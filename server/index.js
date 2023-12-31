const express = require('express');
const session = require('express-session');
const http = require('http')
const bodyParser = require('body-parser');
const cors = require("cors");
const mysql = require('mysql');
const fs = require('fs');
const client = require('https');
const path = require('path');
const cookieParser = require('cookie-parser');
const {spawn} = require('child_process')
const Middleware = session({
    secret: 'passwordAccess',
    resave: true,
    saveUninitialized: true
})
const corsOptions = {
    origin: ["http://localhost:3000", "http://globalmarketapp.dam.inspedralbes.cat"],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    exposedHeaders: ['set-cookie', 'ajax-redirect'],
    preflightContinue: true,
    optionsSuccessStatus: 200,
};

const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: corsOptions })
const { error } = require('console');
const SERVER_URL = "http://globalmarketapp.dam.inspedralbes.cat"


var sessiones = [];

var con = null;

const port = 3593;
const sessionMiddleware = session({
    secret: 'mySecretKey',
    resave: true,
    name: "globalMarket",
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        domain: "globalmarketapp.dam.inspedralbes.cat",
        path: "/",
        maxAge: 3600000,
        sameSite: 'lax'
    }
});

app.use(sessionMiddleware);
app.use(cookieParser("mySecretKey"));
app.use(express.json())
app.use(cors(corsOptions));

//var sharedsession = require('express-socket.io-session');

//io.use(sharedsession(sessionMiddleware));

server.listen(port, () => {
    console.log(`Server is running at ${SERVER_URL}:${port}`);
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
            console.log("Connexió establerta a BD")
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
            console.log("Connexió tancada a BD")
        }
    })
}
io.on('connection', (socket) => {
    //console.log("connection",socket.request);
    console.log('A user connected');
    console.log('Current users', sessiones);
    //console.log(socket.handshake.session.user)
    socket.on('autentificacion', (user) => {

        console.log("id", user);
        if (sessiones[user.id].user.isAdmin === 1) {
            console.log("AdminSocket", sessiones[user.id].user);
            socket.join("Admin");
        }
        else {
            if (sessiones[user.id].user) {
                console.log("UserSocket", sessiones[user.id].user);
                console.log("Join socket", sessiones[user.id].user.email);
                socket.join(sessiones[user.id].user.email);
            }
        }

    })
    socket.on('aceptarComanda', (data, callback) => {
        console.log("aceptarComanda", data);

        connectarBD();
        console.log('Acceso al socket');
        con.query(`UPDATE comanda SET estado = 1 WHERE id = ${data.idComanda}`, function (err, comanda) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                try {
                    con.query(`SELECT C.id,C.estado,C.preuTotal,U.nom,U.cognoms,U.email FROM comanda C 
                    JOIN usuario U ON C.id_usuari = U.id WHERE C.id = ${data.idComanda}`, function (err, comandaActualitzada, fields) {
                        io.to("Admin").emit('comandaActualitzada', comandaActualitzada[0]);
                        console.log("Enviar a",comandaActualitzada[0].email)
                        io.to(comandaActualitzada[0].email).emit('comandaActualitzada', comandaActualitzada[0]);
                        callback("comanda actualitzada amb exit")
                        tancarBD();
                    })

                }
                catch (error) {
                    console.log(error)
                }

            }
        })

    })
    socket.on('rechazarComanda', (data,callback) => {

        connectarBD();
        con.query(`UPDATE comanda SET estado = 4 WHERE id = ${data.idComanda}`, function (err, comanda) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                try {
                    con.query(`SELECT C.id,C.estado,C.preuTotal,U.nom,U.cognoms,U.email FROM comanda C 
                    JOIN usuario U ON C.id_usuari = U.id WHERE C.id = ${data.idComanda}`, function (err, comandaActualitzada, fields) {
                        io.to("Admin",).emit('comandaActualitzada', comandaActualitzada[0]);
                        io.to(comandaActualitzada[0].email).emit('comandaActualitzada', comandaActualitzada[0]);
                        tancarBD();
                        callback("comanda rebutjada amb exit")
                        
                    })
                }
                catch (error) {
                    console.log(error)
                }

            }
        })
    })
    socket.on('prepararComanda', (data,callback) => {

        connectarBD();
        con.query(`UPDATE comanda SET estado = 2 WHERE id = ${data.idComanda}`, function (err, comanda) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                try {
                    con.query(`SELECT C.id,C.estado,C.preuTotal,U.nom,U.cognoms,U.email FROM comanda C 
                    JOIN usuario U ON C.id_usuari = U.id WHERE C.id = ${data.idComanda}`, function (err, comandaActualitzada, fields) {
                        io.to("Admin",).emit('comandaActualitzada', comandaActualitzada[0]);
                        io.to(comandaActualitzada[0].email).emit('comandaActualitzada', comandaActualitzada[0]);
                        tancarBD();
                        callback("comanda preparada")
                        
                    })
                }
                catch (error) {
                    console.log(error)
                }

            }
        })
    })
    socket.on('recogerComanda', (data) => {

        console.log(data)

        connectarBD();
        con.query(`UPDATE comanda SET estado = 3 WHERE id = ${data.id}`, function (err, comanda) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                try {
                    con.query(`SELECT C.id,C.estado,C.preuTotal,U.nom,U.cognoms,U.email FROM comanda C 
                    JOIN usuario U ON C.id_usuari = U.id WHERE C.id = ${data.id}`, function (err, comandaActualitzada, fields) {
                        io.to("Admin",).emit('comandaActualitzada', comandaActualitzada[0]);
                        io.to(comandaActualitzada[0].email).emit('comandaActualitzada', comandaActualitzada[0]);
                        tancarBD();
                    })
                }
                catch (error) {
                    console.log(error)
                }

            }
        })
    })
    socket.on('disconnect', () => {
        socket.leave(session.id);
        console.log('Disconnected: ' + session.id);
    })
})


//INICIAR SESIÓN
app.get('/getLogin', (req, res) => {
    if (req.session.user?.email) {
        res.json(req.session.user);
    } else {
        usuariIndividual = { email: "" };
        res.json(usuariIndividual);
    }
});
app.post('/login', (req, res) => {
    console.log("Login:id-session", req.session);

    req.session.user = {};
    const login = req.body;
    let usuariIndividual = {};
    let comprovacio = false;

    connectarBD();
    con.query("SELECT * FROM usuario", function (err, usuaris, fields) {
        if (err) throw err;
        else {
            usuaris.forEach(usuari => {
                if (usuari.email == login.email) {
                    console.log("Mail trobat");

                    if (usuari.contrasenya != login.password) {
                        console.log("Usuari o contrasenya incorrectes");
                        usuariIndividual = { email: "" };
                    } else {
                        console.log("pwd trobat");

                        usuariIndividual = {
                            id: req.session.id,
                            userId: usuari.id,
                            nom: usuari.nom,
                            cognoms: usuari.cognoms,
                            email: usuari.email,
                            isAdmin: 0
                        };
                        req.session.user = usuariIndividual;
                        sessiones[req.session.id] = req.session;
                        comprovacio = true;
                        console.log(usuariIndividual);
                        res.json(usuariIndividual);
                    }
                } else if (!comprovacio) {
                    console.log("Usuari o contrasenya incorrectes");
                    usuariIndividual = { email: "" };
                }
            });

            if (!comprovacio) {
                res.json(usuariIndividual);
            }
        }

        tancarBD();
    });
});

app.get('/logout', (req, res) => {
    const sessionId = req.session.id;
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            res.status(500).json({ message: 'Error al cerrar la sesión' });
        } else {
            console.log("Sesión cerrada");
            io.in(sessionId).disconnectSockets();

            res.clearCookie('connect.sid'); // Elimina la cookie de sesión
            res.status(200).send();
        }
    });
});
//GET USUARIOS
app.get('/consultarUsuaris', requireAdminLogin, (req, res) => {
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
            if (producte.activado) {
                filename = producte.nom.replaceAll(' ', '_');
                imageURL = `${SERVER_URL}:${port}/images/${filename}.jpg`;

                producteIndividual = { id: producte.id, nom: producte.nom, descripcio: producte.descripcio, preu: producte.preu, quantitat: producte.quantitat, imatge: imageURL, id_categoria: producte.id_categoria, nom_categoria: producte.catNom, activado: producte.activado }
                productesEnviar.push(producteIndividual)
            }
        })
        res.json(productesEnviar)
    })
    tancarBD()
});

app.get('/consultarProductesAdmin', requireAdminLogin, (req, res) => {
    connectarBD()
    con.query("SELECT productes.*, categorias.nom AS catNom FROM productes JOIN categorias ON productes.id_categoria=categorias.id", function (err, productes, fields) {
        if (err) throw err;
        productesEnviar = []
        productes.forEach(producte => {
            filename = producte.nom.replaceAll(' ', '_');
            imageURL = `${SERVER_URL}:${port}/images/${filename}.jpg`;

            producteIndividual = { id: producte.id, nom: producte.nom, descripcio: producte.descripcio, preu: producte.preu, quantitat: producte.quantitat, imatge: imageURL, id_categoria: producte.id_categoria, nom_categoria: producte.catNom, activado: producte.activado }
            productesEnviar.push(producteIndividual)

        })
        res.json(productesEnviar)
    })
    tancarBD()
});

//ADD PRODUCTO
app.post('/afegirProducte', requireAdminLogin, (req, res) => {
    dades = []
    dades = req.body;
    connectarBD();
    con.query(`INSERT INTO productes (nom, descripcio, preu, quantitat, imatge, id_categoria) VALUES ("${dades.nom}","${dades.descripcio}",${dades.preu},${dades.quantitat},"${dades.nom.replaceAll(' ', '_') + '.jpg'}",${dades.id_categoria})`, function (err, result) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            console.log("Producte afegit: ", result)
            downloadImage(dades.imatge, dades.nom.replaceAll(' ', '_'), 'images', '.jpg')
                .then(res.status(200).send())
                .catch(res.status(406).send());
            
        }

    })

    tancarBD()
});

//DELETE PRODUCTO
app.delete('/esborrarProducte/:id', requireAdminLogin, (req, res) => {
    const id = req.params.id;
    connectarBD()
    con.query(`SELECT * FROM productes WHERE productes.id = "${id}"`, function (err, producte, fields) {
        if (err) {
            throw err;
        } else {con.query(`DELETE FROM productes WHERE id=${id}`, function (err, result) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            console.log("Producte esborrat")
            eraseImage('images', producte[0].nom.replaceAll(' ', '_') + '.jpg');
            tancarBD()
            res.status(200).send()
        }

    })
            
        }
    });
    
    
    

});

//UPDATE PRODUCTO
app.post('/actualitzarProducte', requireAdminLogin, async (req, res) => {
    dades = []
    dades = req.body;
    console.log(dades.id);
    connectarBD()
    const producte = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM productes WHERE productes.id = "${dades.id}"`, function (err, productes, fields) {
            if (err) reject(err);
            resolve(productes);
        });
    });
   imageURL = `${SERVER_URL}:${port}/images/${producte[0].nom.replaceAll(' ', '_')}.jpg`;
    if (imageURL != dades.imatge) {
        await eraseImage(dades.nom.replaceAll(' ', '_') + '.jpg', 'images')
       await  downloadImage(dades.imatge, dades.nom.replaceAll(' ', '_'), 'images', '.jpg')
            .then(console.log)
            .catch(console.error);


    } else {
        renameImageProduct(dades, 'images', producte[0].imatge);
    }
    con.query(`UPDATE productes SET nom="${dades.nom}", descripcio="${dades.descripcio}", preu=${dades.preu}, quantitat=${dades.quantitat}, imatge="${dades.nom.replaceAll(' ', '_') + '.jpg'}", id_categoria="${dades.id_categoria}" WHERE id=${dades.id}`,
        function (err, result) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                console.log("Producte actualitzat: ", result);
                res.status(200).send();
            }

        })
    tancarBD()
});



app.post('/loginAdmin', (req, res) => {

    login = []
    req.session.user = {};
    login = req.body
    usuariIndividual = {}
    comprovacio = false
    connectarBD()
    con.query("SELECT * FROM usuario", function (err, usuaris, fields) {
        if (err) throw err;
        else {
            usuaris.forEach(usuari => {
                if (usuari.email == login.email && usuari.isAdmin == 1) {
                    console.log("Mail trobat")

                    if (usuari.contrasenya != login.password) {
                        console.log("Usuari o contrasenya incorrectes")
                        usuariIndividual = { email: "" }

                    }
                    else {
                        console.log("pwd trobat")
                        usuariIndividual = { id: req.session.id, password: "", nom: usuari.nom, cognoms: usuari.cognoms, email: usuari.email, isAdmin: usuari.isAdmin }
                        req.session.user = usuariIndividual;
                        sessiones[req.session.id] = req.session;
                        comprovacio = true

                        console.log("LoginAdmin:id-session", req.session);
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
                con.query(`INSERT INTO usuario (nom, cognoms, email, contrasenya) VALUES ("${usuariDades.nom}","${usuariDades.cognoms}","${usuariDades.email}","${usuariDades.password}")`, function (err, result) {
                    if (err) {
                        console.log("No s'ha pogut completar l'acció")
                        throw err;
                    }
                    else {
                        console.log("Usuari creat", result)
                        res.status(200).send()
                    }

                })
            } else {
                //Mail en uso
                res.status(403).send()
            }
        }
        tancarBD()
    })

})

app.post('/afegirTargeta', requireLogin, (req, res) => {
    connectarBD()
    targetaDades = []
    targetaDades = (req.body)

    con.query(`SELECT id FROM usuario WHERE email="` + req.session.user.email + '"', function (err, ids, result) {
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

app.post('/getComandes', requireLogin, async (req, res) => {
    const mail = req.body.email
    connectarBD();
    try {
        const comandas = await new Promise((resolve, reject) => {
            con.query(`SELECT comanda.*, usuario.email FROM comanda JOIN usuario ON comanda.id_usuari = usuario.id WHERE usuario.email = "${mail}"`, function (err, comandas, fields) {
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
                    imatge: `${SERVER_URL}:${port}/images/${producto.imatge}`, descripcio: producto.descripcio
                };
            });

            const comandaIndividual = {
                id: comanda.id,
                estado: comanda.estado,
                preuTotal: comanda.preuTotal, lista_productos: productosComanda, email: comanda.email
            };
            comandasEnviar.push(comandaIndividual);
        }
        tancarBD();
        console.log(comandasEnviar);
        res.json(comandasEnviar);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/consultarCategories', (req, res) => {
    categoriesEnviar = []
    categoriaIndividual = {}
    connectarBD()
    con.query('SELECT * FROM categorias', function (err, categories, fields) {
        categories.forEach(categoria => {
            categoriaIndividual = { id: categoria.id, nom: categoria.nom }

            categoriesEnviar.push(categoriaIndividual)
            console.log(categoriaIndividual)
        })
        res.json(categoriesEnviar)
    })

    tancarBD()
})


app.get('/allComandes', requireAdminLogin, async (req, res) => {
    comandasEnviar = [];
    comandaIndividual = {}
    productesComanda = []
    producteIndividual = {}
    connectarBD();
    try {
        comandas = await new Promise((resolve, reject) => {
            con.query(`SELECT * FROM comanda`, function (err, comandas, fields) {
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
                    imatge: `${SERVER_URL}:${port}/images/${producto.imatge}`,
                    descripcio: producto.descripcio
                };
            });

            const comandaIndividual = {
                id: comanda.id,
                id_usuari: comanda.id_usuari,
                estado: comanda.estado,
                fechaComanda: comanda.fechaComanda,
                fechaFinalizacion: comanda.fechaFinalizacion,
                preuTotal: comanda.preuTotal,
                lista_productos: productosComanda,
            };

            comandasEnviar.push(comandaIndividual);
        }

        res.json(comandasEnviar);
        tancarBD()
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }


});

app.post('/addComandes', requireLogin, (req, res) => {
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
                    console.log(dadesComanda.lista_productos.length)
                    for (i = 0; i < dadesComanda.lista_productos.length; i++) {
                        con.query('INSERT INTO linia_comanda (id_comanda, id_producto, quantitatCom) VALUES (' + nuevaComandaId + ',' + dadesComanda.lista_productos[i].id + ',' + dadesComanda.lista_productos[i].quantitat + ')', function (err, result) {
                            if (err) {
                                console.log("No s'ha pogut completar l'acció")
                                throw err
                            } else {
                                insercionesCompletadas++
                                if (insercionesCompletadas === dadesComanda.lista_productos.length) {
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

app.get('/images/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'images', req.params.filename);
    console.log(filePath)
    res.sendFile(filePath)

})

app.get('/grafics/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'grafics', req.params.filename);
    console.log(filePath)
    res.sendFile(filePath)

})

app.post('/productoActivado', requireAdminLogin, (req, res) => {
    connectarBD()
    const data = req.body;
    console.log("Producto a activar: ", data.id, ", Su estado: ", data.activado)
    if (data.activado) {
        con.query(`UPDATE productes SET activado = false WHERE id = ${data.id}`, function (err, result) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                console.log("Producto desactivado", result)
                res.status(200).send()
            }

        })
    } else if (!data.activado) {
        con.query(`UPDATE productes SET activado = true WHERE id = ${data.id}`, function (err, result) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                console.log("Producto activado", result)
                res.status(200).send()
            }

        })
    }
    tancarBD()
})

app.post('/actualitzarUsuari', requireLogin, (req, res) => {
    connectarBD()
    dades = (req.body)
    comprovacio = true

    con.query(`UPDATE usuario SET nom = "${dades.nom}", cognoms = "${dades.cognoms}", email = "${dades.email}" WHERE id= ${dades.userId}`, function (err, result, fields) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            req.session.user.nom = dades.nom;
            req.session.user.cognoms = dades.cognoms;
            req.session.user.email = dades.email;
            console.log("Usuario actualizado correctamente: ", result)
        }

    })
    res.status(200).send()
    tancarBD()
})



app.get('/estadisticas', requireAdminLogin, async (req, res) => {

    try {
        const graficsEnviarP = await new Promise((resolve, reject) => {
            py = spawn('python3', ["./stats.py"])
            py.stdout.on('data', (data) => {
                console.log(`Resultado de Python: ${data}`);
            });
            py.stderr.on('data', (data) => {
                console.error(`Error: ${data}`);
            });
            fs.readdir("grafics", (err, grafics) => {
                const baseURL = `${SERVER_URL}:${port}/grafics/`;
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    const graficsEnviar = grafics.map(grafic => baseURL + grafic);
                    console.log("GRAFICS"+graficsEnviar);
                    resolve(graficsEnviar);
                    
                }
            });
        });res.json(graficsEnviarP);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

app.get('/getAPK',function(req,res) {
    console.log('single file');
    const rutaAPK = path.join(__dirname, './apk/FastMarket.apk');
    // Download function provided by express
    res.download(rutaAPK, function(err) {
        if(err) {
            console.log(err);
        }
    })

    console.log("APK")
})



//-----FUNCIONES--------
function requireLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send();
    }
}
function requireAdminLogin(req, res, next) {
    if (req.session.user && req.session.user.isAdmin === 1) {
        next();
    } else {
        res.status(401).send();
    }
}
function renameImageProduct(producte, directory, oldImageName) {
    const oldFilePath = path.join(directory, oldImageName);
    const newFilePath = path.join(directory, producte.nom.replaceAll(' ', '_') + ".jpg");
    fs.rename(oldFilePath, newFilePath, (error) => {
        if (error) {
            console.error('Error al renombrar el archivo:', error);
        } else {
            console.log('Archivo renombrado exitosamente.');
        }
    });
}
function downloadImage(url, title, directory, extension) {

    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                if (!fs.existsSync(directory)) {
                    fs.mkdirSync(directory);
                }
                const filePath = path.join(directory, title + extension);
                res.pipe(fs.createWriteStream(filePath))
                    .on('error', reject)
                    .once('close', () => {
                        console.log("Saved new image");
                        resolve(filePath)
                    });
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(console.error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
    });
}
async function eraseImage(directory, filename) {
    const filePath = path.join(directory, filename);
    await fs.unlink(filePath, err => {
        if (err) {
            //No habia imatge
        }

        console.log('File is deleted.')
    })
}
function obtenerFechaActual() {
    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Suma 1 al mes ya que en JavaScript los meses comienzan en 0
    const dia = fecha.getDate().toString().padStart(2, '0');

    const fechaFormateada = `${año}-${mes}-${dia}`;

    return fechaFormateada;
}
function getUserSessionIdForOrder(orderId) {
    connectarBD;
    con.query(`SELECT id_usuari FROM comanda WHERE id = ${orderId}`, function (err, userId) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            console.log("Id de usuario", userId)
            res.status(200).send()
        }
        tancarBD;
        return userId;
    })

}
