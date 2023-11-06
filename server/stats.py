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

def diesMesActivitat():
    connection=connectarBD()
    cursor = connection.cursor()
    query = """
    SELECT fechaComanda, SUM(1) AS suma_resultados
    FROM comanda
    GROUP BY fechaComanda
    ORDER BY fechaComanda;
    """
    cursor.execute(query)
    resultat = cursor.fetchall()

    tancarBD(connection)

    df = pd.DataFrame(resultat, columns=['suma_resultados','fechaComanda'])

    df.plot(x='fechaComanda', y='suma_resultados', kind='bar')

    plt.title('Dies de més activitat')
    plt.xlabel('Data')
    plt.ylabel('Número de comandes')

    plt.savefig('./grafics/activitatData.png')
    plt.close()

def usuarisMesActivitat():
    connection=connectarBD()
    cursor = connection.cursor()
    query = """
    SELECT id_usuari, SUM(1) AS suma_resultados
    FROM comanda
    GROUP BY id_usuari
    ORDER BY suma_resultados DESC;
    """
    cursor.execute(query)
    resultat = cursor.fetchall()

    tancarBD(connection)

    df = pd.DataFrame(resultat, columns=['suma_resultados','id_usuari'])

    df.plot(x='id_usuari', y='suma_resultados', kind='bar')

    plt.title('Usuaris amb més activitat')
    plt.xlabel('ID usuari')
    plt.ylabel('Número de comandes')

    plt.savefig('./grafics/activitatUsuari.png')
    plt.close()     

def preuMitjaPerDia():
    connection=connectarBD()
    cursor = connection.cursor()
    query = """
    SELECT fechaComanda, AVG(preuTotal) AS preuMitja
    FROM comanda
    GROUP BY fechaComanda
    ORDER BY fechaComanda;
    """
    cursor.execute(query)
    resultat = cursor.fetchall()

    tancarBD(connection)

    df = pd.DataFrame(resultat, columns=['fechaComanda','preuMitja'])

    df.plot(x='fechaComanda', y='preuMitja', kind='bar')

    plt.title('Preu mitjà de les comandes segons el dia')
    plt.xlabel('Data')
    plt.ylabel('Preu mitjà de les comandes')

    plt.savefig('./grafics/preuMitjaPerDia.png')
    plt.close()


quantitatProductes()
productesVenuts()
diesMesActivitat()
usuarisMesActivitat()
preuMitjaPerDia()