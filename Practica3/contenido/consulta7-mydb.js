// Importamos las funciones definidas en myUtils.js
const {
  connectDatabase,
  openSession,
  closeSession,
  testConnection,
} = require("./myUtils");

// Variables globales

// Credenciales de conexión
const host = "neo4j://localhost:7687";
const user = "neo4j";
const password = "12345678";

// Base de datos a utilizar
const database = "neo4j";

// Métodos

//Función para procesar un registro individual (cada fila del stream, correspondiente al record)
function procesaRecord(record) {
  const nombre = record.get("name");
  const born = record.get("born");
  const year = typeof born?.toNumber === "function" ? born.toNumber() : born;

  console.log("Actor: " + nombre + ", Año de nacimiento: " + year);
}

// Consulta de lectura con streams
async function consultaStream(session, queryText) {
  return new Promise((resolve, reject) => {
    session.run(queryText).subscribe({
      onKeys: (keys) => {
        console.log("Claves de las columnas:", keys);
      },
      // Record es cada fila del resultado
      onNext: (record) => {
        procesaRecord(record);
      },
      onCompleted: async (summary) => {
        console.log(
          "Tiempo en el que el primer resultado estuvo disponible (ms):" +
            summary.resultAvailableAfter
        );
        console.log(
          "Tiempo desde completarse la consulta hasta que se empezaron a procesar resultados (ms):" +
            summary.resultConsumedAfter
        );
        resolve(summary);
      },
      onError: async (error) => {
        console.error("Error durante la ejecución de la consulta:", error);
        reject(error);
      },
    });
  });
}

// Main
async function main() {
  // DEBUG: Probar la conexión a la base de datos
  // testConnection(host, user, password, database);

  // Primero, abrimos la conexión y la sesión
  const driver = await connectDatabase(host, user, password);
  const session = openSession(driver, database);

  // Definimos la consulta Cypher
  const myQuery =
    "MATCH (p:Person) WHERE p.born IS NOT NULL RETURN p.name AS name, p.born as born";

  // Ejecutamos la consulta
  try {
    console.log("Resultados procesados:");
    const resultados = await consultaStream(session, myQuery);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error.message);
    if (error.cause) {
      console.error("Causa:", error.cause);
    }
  } finally {
    // Cerramos la sesión y la conexión
    await closeSession(session);
    await driver.close();
  }
}

main();
