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

    plt.tight_layout()
    plt.savefig('./grafics/quantitat.png')
    plt.close()

def productesVenuts():
    connection=connectarBD()
    cursor = connection.cursor()
    query = """
    SELECT SUM(c.quantitatCom) AS productesVenuts, p.nom
    FROM linia_comanda c
    INNER JOIN productes p ON c.id_producto = p.id
    GROUP BY c.id_producto, p.nom;
    """
    cursor.execute(query)
    resultat = cursor.fetchall()
    resultat = [(int(row[0]), row[1]) for row in resultat]

    tancarBD(connection)

    df = pd.DataFrame(resultat, columns=['productesVenuts','nom'])

    df.plot(x='nom', y='productesVenuts', kind='bar')

    plt.title('Productes més venuts')
    plt.xlabel('Producte')
    plt.ylabel('Quantitat')

    plt.tight_layout()
    plt.savefig('./grafics/venuts.png')
    plt.close()

def diesMesActivitat():
    connection=connectarBD()
    cursor = connection.cursor()
    query = """
    SELECT DATE_FORMAT(fechaComanda, '%d-%m-%Y') AS fecha_formateada, SUM(1) AS comandesTotals
    FROM comanda
    GROUP BY fechaComanda
    ORDER BY fechaComanda;
    """
    cursor.execute(query)
    resultat = cursor.fetchall()

    tancarBD(connection)

    resultat = [(int(row[1]), row[0]) for row in resultat]

    df = pd.DataFrame(resultat, columns=['comandesTotals','fecha_formateada'])

    df.plot(x='fecha_formateada', y='comandesTotals', kind='bar')

    plt.title('Dies de més activitat')
    plt.xlabel('Data')
    plt.ylabel('Número de comandes')

    plt.tight_layout()
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

    plt.tight_layout()
    plt.savefig('./grafics/activitatUsuari.png')
    plt.close()     

def preuMitjaPerDia():
    connection=connectarBD()
    cursor = connection.cursor()
    query = """
    SELECT DATE_FORMAT(fechaComanda, '%d-%m-%Y') AS fecha_formateada, AVG(preuTotal) AS preuMitja
    FROM comanda
    GROUP BY fechaComanda
    ORDER BY fechaComanda;
    """
    cursor.execute(query)
    resultat = cursor.fetchall()

    tancarBD(connection)

    df = pd.DataFrame(resultat, columns=['fecha_formateada','preuMitja'])

    df.plot(x='fecha_formateada', y='preuMitja', kind='bar')

    plt.title('Preu mitjà de les comandes segons el dia')
    plt.xlabel('Data')
    plt.ylabel('Preu mitjà de les comandes')

    plt.tight_layout()
    plt.savefig('./grafics/preuMitjaPerDia.png')
    plt.close()



quantitatProductes()
productesVenuts()
diesMesActivitat()
usuarisMesActivitat()
preuMitjaPerDia()