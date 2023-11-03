const express = require('express');
const http = require('http')
const bodyParser = require('body-parser');
const cors = require("cors");
const mysql = require('mysql');
const fs = require('fs');
const client = require('https');
const path = require('path');
const uuid = require('uuid');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
const { error } = require('console');



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
const socketMap = new Map();

io.on('connection', (socket) => {
    socketMap.set(socket.session_key, socket);
    socket.on('getStatusComandas', (sesion_key) => {
        username = userMap.get(session_key);

        //falta hacer la QUERY
    });
    socket.on('aceptarComanda', (data) => {
        connectarBD();
        con.query(`UPDATE comanda SET estado = 1 WHERE id = ${data.idComanda}`, function (err, comanda) {
            if (err) {
                console.log("No s'ha pogut completar l'acció")
                throw err;
            }
            else {
                con.query(`SELECT usuario.* FROM usuario JOIN comanda ON comanda.id_usuari = usuario.id WHERE comanda.id = ${data.idComanda}`, function (err, usuari) {
                    if (err) {
                        console.log("No s'ha pogut completar l'acció")
                        throw err;
                    }
                    else { 
                        try{
                       sessionkey = sessionKeyMap.get(usuari.nom)
                       socketMap.get(sessionKey).emit('comanda', comanda)
                        }catch(error){
                            console.log(error)
                        }
                    }
                }),
                //io.emit('message', { message: 'Comanda aceptada' })
                console.log("Comanda aceptada: ", comanda)
            }
        }),
        
            tancarBD();
    })
    socket.on('rechazarComanda', (data) => {
        connectarBD();
        con.query(`UPDATE comanda SET estado = 4 WHERE id = ${data.idComanda}`, function (err, comanda) {
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
    socket.on('prepararComanda', (data) => {
        connectarBD();
        con.query(`UPDATE comanda SET estado = 2 WHERE id = ${data.idComanda}`, function (err, comanda) {
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
    socket.on('recogerComanda', (data) => {
        connectarBD();
        con.query(`UPDATE comanda SET estado = 3 WHERE id = ${data.idComanda}`, function (err, comanda) {
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
    socket.on('getComandas', (session_key) => {
        const name = getSessionKeyByUsername(session_key);

        if (name) {
            const comandas = getComandas(name);

            socket.emit('comandas', { comandas: comandas });
        } else {
            socket.emit('comandasError', { message: 'Invalid session_key' });
        }
    });
    socket.on('disconnect', (session_key) => {
        username = userMap.get(session_key);
        sessionKeyMap.delete(username);
        userMap.delete(session_key);
        console.log('Disconected')
    })
})


//INICIAR SESIÓN
const sessionKeyMap = new Map();
const userMap = new Map(); //inversa de sessionmap
app.post('/login', (req, res) => {
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

                        // Generate a unique session_key
                        const session_key = uuid.v4();

                        // Store the session_key in the map with email as the value
                        sessionKeyMap.set(usuari.nom, session_key);
                        userMap.set(session_key, usuari.nom)
                        usuariIndividual = {
                            session_key: session_key,
                            nom: usuari.nom,
                            cognoms: usuari.cognoms,
                            email: usuari.email,
                            key: session_key,
                        };

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
            if (producte.activado) {
            filename = producte.nom.replaceAll(' ', '_');
            imageURL = `http://dam.inspedralbes.cat:${port}/images/${filename}.jpg`;

            producteIndividual = { id: producte.id, nom: producte.nom, descripcio: producte.descripcio, preu: producte.preu, quantitat: producte.quantitat, imatge: imageURL, id_categoria: producte.id_categoria, nom_categoria: producte.catNom, activado: producte.activado }
            productesEnviar.push(producteIndividual)
        }
        })
        res.json(productesEnviar)
    })
    tancarBD()
});

app.get('/consultarProductesAdmin', (req, res) => {
    connectarBD()
    con.query("SELECT productes.*, categorias.nom AS catNom FROM productes JOIN categorias ON productes.id_categoria=categorias.id", function (err, productes, fields) {
        if (err) throw err;
        productesEnviar = []
        productes.forEach(producte => {
            filename = producte.nom.replaceAll(' ', '_');
            imageURL = `http://dam.inspedralbes.cat:${port}/images/${filename}.jpg`;

            producteIndividual = { id: producte.id, nom: producte.nom, descripcio: producte.descripcio, preu: producte.preu, quantitat: producte.quantitat, imatge: imageURL, id_categoria: producte.id_categoria, nom_categoria: producte.catNom, activado: producte.activado }
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
    con.query(`INSERT INTO productes (nom, descripcio, preu, quantitat, imatge, id_categoria) VALUES ("${dades.nom}","${dades.descripcio}",${dades.preu},${dades.quantitat},"${dades.nom.replaceAll(' ', '_') + '.jpg'}",${dades.id_categoria})`, function (err, result) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            console.log("Producte afegit: ", result)
            downloadImage(dades.imatge, dades.nom.replaceAll(' ', '_'), 'images', '.jpg')
                .then(console.log)
                .catch(console.error);
            res.status(200).send()
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
            res.status(200).send()
        }

    })
    con.query(`SELECT * FROM productes WHERE productes.id = "${id}"`, function (err, producte, fields) {
        if (err) {
            throw err;
        } else {
            eraseImage('images', producte.nom.replaceAll(' ', '_') + '.jpg');
        }
    });
    tancarBD()

});

//UPDATE PRODUCTO
app.post('/actualitzarProducte', async (req, res) => {
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
    imageURL = `http://dam.inspedralbes.cat:${port}/images/${producte[0].nom.replaceAll(' ', '_')}.jpg`;
    if (imageURL != dades.imatge) {
        eraseImage(dades.nom.replaceAll(' ', '_') + '.jpg', 'images')
        downloadImage(dades.imatge, dades.nom.replaceAll(' ', '_'), 'images', '.jpg')
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
                con.query(`INSERT INTO usuario (nom, cognoms, email, contrasenya) VALUES ("${usuariDades.nom}","${usuariDades.cognom}","${usuariDades.email}","${usuariDades.password}")`, function (err, result) {
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
                    imatge: `http://dam.inspedralbes.cat:${port}/images/${producto.imatge}`, descripcio: producto.descripcio
                };
            });

            const comandaIndividual = {
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


app.get('/allComandes', async (req, res) => {
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
                    imatge: producto.imatge,
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


    /*con.query('SELECT * FROM comanda', function (err, comandes, fields) {
        if (err) throw err
        else {
            comandes.forEach(comanda => {
                console.log("Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                con.query('SELECT id_producto, quantitatCom FROM linia_comanda WHERE id_comanda=' + comanda.id, function (err, liniesComanda, fields) {
                    console.log("CCCCCCCCCCCCCCCCCCCCCCC")
                    if (err) throw err
                    else {
                        liniesComanda.forEach(liniaComanda => {
                            con.query('SELECT * FROM productes WHERE id=' + liniaComanda.id_producto, function (err, productes, fields) {

                                if (err) throw err
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
                                    console.log(productes[0].id)
                                    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")

                                }

                            })
                            productesComanda = []
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

                console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")

                

                comandasEnviar.push(comandaIndividual)



            })
            res.json(comandasEnviar)

        }

    })*/

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

app.post('/productoActivado', (req,res)=>{
    connectarBD()
    const data = req.body;
    console.log("Producto a activar: ", data.id,", Su estado: ",data.activado)
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
    } else if (!data.activado){
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
app.post('/actualitzarUsuari', (req, res) => {
    connectarBD()
    dades = (req.body)
    comprovacio = true

    con.query(`UPDATE usuario SET nom = "${dades.nom}", cognoms = "${dades.cognoms}" WHERE id= ${dades.id}`, function (err, result, fields) {
        if (err) {
            console.log("No s'ha pogut completar l'acció")
            throw err;
        }
        else {
            console.log("Usuario actualizado correctamente: ", result)
        }
        tancarBD()
    }) 

})

//-----FUNCIONES--------
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
                    .once('close', () => resolve(filePath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

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
