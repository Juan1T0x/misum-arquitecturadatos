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

// Consulta de escritura con transacción
async function consultaEscritura(session, writeQueryText) {
  try {
    const res = await session.executeWrite((tx) => {
      return tx.run(writeQueryText);
    });
    if (!res.records.length) return null;

    const node = res.records[0].get("p");
    return node.properties;
  } catch (e) {
    console.log("Error en la consulta de escritura:", e);
    throw e;
  }
}

// Consulta de escritura con promesas
async function consultaEscrituraPromesas(session, writeQueryText) {
  return session
    .executeWrite((tx) => {
      return tx.run(writeQueryText);
    })
    .then((res) => {
      if (!res.records.length) return null;
      const node = res.records[0].get("p");
      return node.properties;
    })
    .catch((e) => {
      console.log("Error en la consulta de escritura:", e);
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
  const myQuery = "CREATE (p:Person {name: 'Woody Allen'}) RETURN p";

  // Ejecutamos la consulta
  try {
    const result = await consultaEscritura(session, myQuery);
    console.log("Resultado de la consulta:", result);
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
