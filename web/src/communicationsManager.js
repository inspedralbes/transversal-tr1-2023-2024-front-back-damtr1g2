
export async function getProductes() {
  try {
    const response = await fetch('http://localhost:3000/consultarProductes');
    const preguntas = await response.json();
    return preguntas;
  } catch (error) {
    throw error; 
  }
}

  
export async function deletePregunta(question){
   const response= await fetch(`http://localhost:3000/preguntas/${question}`, 
   {method: 'DELETE'});
   console.log(response);

  console.log("Quieres borrar la pregunta: "+question)
}

export async function addPregunta(dadesPregunta){
  for (const key in dadesPregunta) {
    if (dadesPregunta.hasOwnProperty(key)) {
        console.log(`${key}: ${dadesPregunta[key]}`);
    }
}
  const response= await fetch(`http://localhost:3000/preguntas`, 
  {method: 'POST', headers: {
    'Content-Type':  'application/json' ,
  },
  body: JSON.stringify(dadesPregunta)},);

 }

export async function updatePregunta(dadesPregunta,indexquestion){
  
    const response = await fetch(`http://localhost:3000/preguntas/${indexquestion}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadesPregunta)});
      console.log(response)
    if (response.ok) {
      console.log(`Pregunta ${indexquestion} actualizada correctamente.`);
    } else {
      const errorMessage = await response.text();
      console.error(`Error al actualizar la pregunta ${indexquestion}. Estado: ${response.status}, Mensaje: ${errorMessage}`);
    }
  
}


