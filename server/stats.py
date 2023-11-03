import matplotlib.pyplot as plt
import pandas as pd
import mysql.connector


def connectarBD():
    connection = mysql.connector.connect(
            host="dam.inspedralbes.cat",
            user="a22osczapmar_Projecte1",
            password="Projecte1",
            database="a22osczapmar_globalmarket"
        )
    return connection

def tancarBD(connection):
    cursor = connection.cursor()
    cursor.close()
    connection.close()


def quantitatProductes():
    connection=connectarBD()
    cursor = connection.cursor()
    query = """
    SELECT p.nom, p.quantitat FROM productes p ORDER BY quantitat DESC
    """
    cursor.execute(query)
    resultat = cursor.fetchall()

    tancarBD(connection)

    df = pd.DataFrame(resultat, columns=['nom','quantitat'])

    df.plot(x='nom', y='quantitat', kind='bar')

    plt.title('Quantitat restant de cada producte')
    plt.xlabel('Producte')
    plt.ylabel('Quantitat')

    plt.savefig('./grafics/quantitat.png')
    plt.close()

def productesVenuts():
    connection=connectarBD()
    cursor = connection.cursor()
    query = """
    SELECT SUM(c.quantitatCom) AS total_quantitatCom, p.nom
    FROM linia_comanda c
    INNER JOIN productes p ON c.id_producto = p.id
    GROUP BY c.id_producto, p.nom;
    """
    cursor.execute(query)
    resultat = cursor.fetchall()
    resultat = [(int(row[0]), row[1]) for row in resultat]

    tancarBD(connection)

    df = pd.DataFrame(resultat, columns=['total_quantitatCom','nom'])

    df.plot(x='nom', y='total_quantitatCom', kind='bar')

    plt.title('Productes més venuts')
    plt.xlabel('Producte')
    plt.ylabel('Quantitat')

    plt.savefig('./grafics/venuts.png')
    plt.close()


quantitatProductes()
productesVenuts()