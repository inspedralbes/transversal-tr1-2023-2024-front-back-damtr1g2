
export async function getProductes() {
  try {
    const response = await fetch('http://localhost:3539/consultarProductes');
    const preguntas = await response.json();
    console.log("preguntas fetch:"+preguntas);
    return preguntas;
  } catch (error) {
    console.log("Error al recuperar datos");
    throw error; 
  }
}

  
export async function deleteProducto(idProducte){
   const response= await fetch(`http://localhost:3539/esborrarProducte/${idProducte}`, 
   {method: 'DELETE'}).then(response => response.text()) // or response.json() if it's JSON
   .then(borrado => {
     if(borrado == false){
      console.log('El producte pertany a una comanda, no es pot borrar')
      
      
      return false
     }return true
     
   });

  console.log("Quieres borrar el producto: "+idProducte)
}

export async function addProducto(dadesProducte){
  
  const response= await fetch(`http://localhost:3539/afegirProducte`, 
  {method: 'POST', headers: {
    'Content-Type':  'application/json' ,
  },
  body: JSON.stringify(dadesProducte)},);
  return response;
 }

export async function updateProducto(dadesProducte){
  
    const response = await fetch(`http://localhost:3539/actualitzarProducte`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadesProducte)});
      console.log(response)
      return response;
}

export async function getComandas() {
  try {
    const response = await fetch('http://localhost:3539/AllComandes');
    const comandas = await response.json();
    console.log(comandas);
    return comandas;
  } catch (error) {
    console.log("Error al recuperar datos");
    throw error; 
  }
}

export async function login(usuario){

  return fetch(`http://localhost:3539/loginAdmin`, 
  {method: 'POST', headers: {
    'Content-Type':  'application/json' ,
  },
  body: JSON.stringify(usuario)});
}


