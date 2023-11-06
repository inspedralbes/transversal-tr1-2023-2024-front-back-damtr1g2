
export async function getProductes() {
  try {
    const response = await fetch('http://dam.inspedralbes.cat:3593/consultarProductesAdmin');
    const productes = await response.json();
    console.log(productes);
    return productes;
  } catch (error) {
    console.log("Error al recuperar datos");
    throw error; 
  }
}

  
export async function deleteProducto(idProducte){
   const response= await fetch(`http://dam.inspedralbes.cat:3593/esborrarProducte/${idProducte}`, 
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
      return response;
}

export async function getComandas() {
  try {
    const response = await fetch('http://dam.inspedralbes.cat:3593/allComandes');
    const comandas = await response.json();
    console.log(comandas);
    return comandas;
  } catch (error) {
    console.log("Error al recuperar datos");
    throw error; 
  }
}

export async function getCategorias() {
  try {
    const response = await fetch('http://dam.inspedralbes.cat:3593/consultarCategories');
    const categorias = await response.json();
    console.log(categorias);
    return categorias;
  } catch (error) {
    console.log("Error al recuperar datos");
    throw error; 
  }
}

export async function login(usuario){

  return fetch(`http://dam.inspedralbes.cat:3593/loginAdmin`, 
  {method: 'POST', headers: {
    'Content-Type':  'application/json' ,
  },
  body: JSON.stringify(usuario)});
}

export async function productoActivado(idProducte, activo){
  const response= await fetch(`http://dam.inspedralbes.cat:3593/productoActivado`, {
  method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: idProducte, activado: activo})});
      console.log("Cambio",response)
}


