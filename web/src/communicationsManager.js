const SERVER_URL = "http://globalmarketapp.dam.inspedralbes.cat:3593"
export async function logout() {
  try {
    fetch('/logout', {method: 'GET',credentials: 'include', mode: 'cors', mode: 'cors'});
  }
  catch (error) {
    console.log("Error al cerrar sesión");
  }
}
export async function getProductes() {
  try {
    const response = await fetch(`${SERVER_URL}/consultarProductesAdmin`, {method: 'GET',credentials: 'include', mode: 'cors'});
    const productes = await response.json();
    console.log(productes);
    return productes;
  } catch (error) {
    console.log("Error al recuperar datos");
    throw error; 
  }
}

  
export async function deleteProducto(idProducte){
   const response = await fetch(`${SERVER_URL}/esborrarProducte/${idProducte}`, 
   {
    method: 'DELETE',
    credentials: 'include', mode: 'cors'
  })
  console.log("Quieres borrar el producto: "+idProducte)
  console.log(response)
  return response
}

export async function addProducto(dadesProducte){
  
  const response= await fetch(`${SERVER_URL}/afegirProducte`, 
  {method: 'POST', credentials: 'include', mode: 'cors', headers: {
    'Content-Type':  'application/json' ,
  },
  body: JSON.stringify(dadesProducte)},);
  return response;
 }

export async function updateProducto(dadesProducte){
  
    const response = await fetch(`${SERVER_URL}/actualitzarProducte`, {
      method: 'POST', 
      credentials: 'include', mode: 'cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadesProducte)});
      console.log(response)
      return response;
}

export async function getComandas() {
  try {
    const response = await fetch(`${SERVER_URL}/allComandes`, {method:'GET',credentials: 'include', mode: 'cors'});
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
    const response = await fetch(`${SERVER_URL}/consultarCategories`, {method:'GET',credentials: 'include', mode: 'cors'});
    const categorias = await response.json();
    console.log(categorias);
    return categorias;
  } catch (error) {
    console.log("Error al recuperar datos");
    throw error; 
  }
}

export async function getGrafics() {
  try {
    const response = await fetch(`${SERVER_URL}/estadisticas`, {method:'GET',credentials: 'include', mode: 'cors'});
    const grafics = await response.json();
    console.log(grafics);
    return grafics;
  } catch (error) {
    console.log("Error al recuperar datos");
    throw error; 
  }
}

export async function login(usuario){

  return fetch(`${SERVER_URL}/loginAdmin`, 
  {method: 'POST',
  credentials: 'include', mode: 'cors',
   headers: {
    'Content-Type':  'application/json' ,
  },
  body: JSON.stringify(usuario)});
}

export async function productoActivado(idProducte, activo){
  const response= await fetch(`${SERVER_URL}/productoActivado`, {
  method: 'POST',
  credentials:'include', mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: idProducte, activado: activo})});
      console.log("Cambio",response)
}

export async function getLogin(){
  return fetch(`${SERVER_URL}/getLogin`, {method:'GET',credentials: 'include', mode: 'cors'});
}

export async function endSession(){
  return fetch(`${SERVER_URL}/logout`, {method:'GET',credentials: 'include', mode: 'cors'});
}

