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

// Consulta de lectura con transacción que devuelve los resultados sin procesar
async function consultaResultados(session, queryText) {
  try {
    const res = await session.executeRead((tx) => {
      return tx.run(queryText);
    });
    return res;
  } catch (err) {
    console.error("Error en la consulta", err.message);
    if (err.cause) console.error("Causa:", err.cause);
    throw err;
  }
}

// Función para procesar y mostrar los resultados de la consulta de forma legible
function procesa(datos) {
  console.log("Número de resultados obtenidos:" + datos.records.length);
  console.log(
    "Tiempo en el que el primer resultado estuvo disponible (ms):" +
      datos.summary.resultAvailableAfter
  );
  console.log(
    "Tiempo desde completarse la consulta hasta que se empezaron a procesar resultados (ms):" +
      datos.summary.resultConsumedAfter
  );
  console.log(
    "Actualizaciones realizadas tras la consulta:\n",
    datos.summary.counters.updates()
  );
  const resultados = datos.records.map((row) => {
    const nombre = row.get("name");
    const born = row.get("born");
    const year = typeof born?.toNumber === "function" ? born.toNumber() : born;
    return { nombre, year };
  });
  resultados.forEach((actor, index) => {
    console.log(
      "Actor numero " + (index + 1) + ", Nombre:",
      actor.nombre,
      ", Año de nacimiento:",
      actor.year
    );
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
    "MATCH (p:Person) RETURN p.name AS name, p.born as born LIMIT 10";

  // Ejecutamos la consulta
  try {
    const resultados = await consultaResultados(session, myQuery);
    console.log("Resultados procesados:");
    procesa(resultados);
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
