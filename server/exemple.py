import pandas as pd
import matplotlib.pyplot as plt

# Supongamos que tienes un DataFrame con los datos
data = {
    'Categoría': ['A', 'B', 'C', 'D'],
    'Valor': [10, 25, 15, 30]
}

df = pd.DataFrame(data)

# Crear un gráfico de barras
df.plot(x='Categoría', y='Valor', kind='bar')

# Personalizar el gráfico
plt.title('Gráfico de Barras Simple')
plt.xlabel('Categoría')
plt.ylabel('Valor')
plt.show()