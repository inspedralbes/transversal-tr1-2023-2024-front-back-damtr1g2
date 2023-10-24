
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

  
export async function deletePregunta(idProducte){
   const response= await fetch(`http://dam.inspedralbes.cat:3593/esborrarProducte/${idProducte}`, 
   {method: 'DELETE'});
   console.log(response);

  console.log("Quieres borrar el producto: "+idProducte)
}

export async function addPregunta(dadesProducte){
  
  const response= await fetch(`http://dam.inspedralbes.cat:3593/afegirProducte`, 
  {method: 'POST', headers: {
    'Content-Type':  'application/json' ,
  },
  body: JSON.stringify(dadesProducte)},);

 }

export async function updatePregunta(dadesProducte,idProducte){
  
    const response = await fetch(`http://dam.inspedralbes.cat:3593/actualitzaProducte/${idProducte}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadesProducte)});
      console.log(response)
    if (response.ok) {
      console.log(`Pregunta ${idProducte} actualizada correctamente.`);
    } else {
      const errorMessage = await response.text();
      console.error(`Error al actualizar la pregunta ${idProducte}. Estado: ${response.status}, Mensaje: ${errorMessage}`);
    }
  
}


