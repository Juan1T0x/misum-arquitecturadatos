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

// Consulta de lectura con Promises
async function consultaPromises(session, queryText) {
  return session
    .executeRead((tx) => {
      return tx.run(queryText);
    })
    .then((res) => {
      const resultados = res.records.map((row) => row.get("name"));
      return resultados;
    })
    .then((names) => {
      names.forEach((name) => console.log(name));
      return names;
    })
    .catch((e) => {
      console.log(e);
      throw e;
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
  const myQuery = "MATCH (p:Person) RETURN p.name AS name";

  // Ejecutamos la consulta
  try {
    await consultaPromises(session, myQuery);
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
