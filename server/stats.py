import matplotlib.pyplot as plt
import pandas as pd
import mysql.connector


connection = mysql.connector.connect(
    host="dam.inspedralbes.cat",
    user="a22osczapmar_Projecte1",
    password="Projecte1",
    database="a22osczapmar_globalmarket"
    )

cursor = connection.cursor()

query = """

SELECT * FROM productes ORDER BY quantitat DESC


"""

cursor.execute(query)

resultat = cursor.fetchall()

cursor.close()

connection.close()

df = pd.DataFrame(resultat, columns=['id','nom','descripcio','preu','quantitat','imatge'])

df.plot(x='nom', y='quantitat', kind='bar')

plt.title('Quantitat restant de cada producte')
plt.xlabel('Producte')
plt.ylabel('Quantitat')

plt.savefig('quantitat.png')