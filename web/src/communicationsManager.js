
export async function getProductes() {
  try {
    const response = await fetch('http://dam.inspedralbes.cat:3593/consultarProductes');
    const preguntas = await response.json();
    console.log(preguntas);
    return preguntas;
  } catch (error) {
    console.log("Error al recuperar datos");
    throw error; 
  }
}

  
export async function deleteProducto(idProducte){
   const response= await fetch(`http://dam.inspedralbes.cat:3593/esborrarProducte/${idProducte}`, 
   {method: 'DELETE'});
   console.log(response);

  console.log("Quieres borrar el producto: "+idProducte)
}

export async function addProducto(dadesProducte){
  
  const response= await fetch(`http://dam.inspedralbes.cat:3593/afegirProducte`, 
  {method: 'POST', headers: {
    'Content-Type':  'application/json' ,
  },
  body: JSON.stringify(dadesProducte)},);
  return response;
 }

export async function updateProducto(dadesProducte){
  
    const response = await fetch(`http://dam.inspedralbes.cat:3593/actualitzarProducte`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadesProducte)});
      console.log(response)
}

export async function getComandas() {
  try {
    const response = await fetch('http://dam.inspedralbes.cat:3593/AllComandes');
    const comandas = await response.json();
    console.log(comandas);
    return comandas;
  } catch (error) {
    console.log("Error al recuperar datos");
    throw error; 
  }
}

