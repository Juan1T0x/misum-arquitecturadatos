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

// Función para crear un nuevo héroe y una relación, con rollback simulado
async function crearHeroeConRollback(session, nuevoHeroe, heroeExistente) {
  try {
    await session.executeWrite(async (tx) => {
      console.log(`Creando héroe ${nuevoHeroe}`);
      await tx.run("CREATE (h:Hero {name: $nombre}) RETURN h", {
        nombre: nuevoHeroe,
      });

      throw new Error("Simulación de error para rollback");

      await tx.run(
        "MATCH (a:Hero {name:$nuevo}), (b:Hero {name:$existente}) CREATE (a)-[:CO_STAR]->(b)",
        { nuevo: nuevoHeroe, existente: heroeExistente }
      );
    });
  } catch (error) {
    console.error("Error durante la creación del héroe:", error.message);
    console.log("Rollback ejecutado automáticamente");
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
    return { nombre };
  });
  resultados.forEach((heroe, index) => {
    console.log("Heroe numero " + (index + 1) + ", Nombre:", heroe.nombre);
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
  const myQuery = "MATCH (h:Hero) RETURN h.name AS name";

  // Ejecutamos la consulta
  try {
    const resultadosIniciales = await consultaResultados(session, myQuery);
    console.log("Resultados iniciales:");
    procesa(resultadosIniciales);

    await crearHeroeConRollback(session, "Bobobo", "Spiderman");

    const resultadosFinales = await consultaResultados(session, myQuery);
    console.log("Resultados finales:");
    procesa(resultadosFinales);
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
