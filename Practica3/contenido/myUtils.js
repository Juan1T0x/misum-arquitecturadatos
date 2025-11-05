// Importamos el driver de Neo4j
var neo4j = require("neo4j-driver");

// Función para probar la conexión a la base de datos Neo4j, devuelve el driver si la conexión es exitosa
async function connectDatabase(host, user, password) {
  const driver = neo4j.driver(host, neo4j.auth.basic(user, password));

  try {
    const serverInfo = await driver.getServerInfo();
    console.log("Conexión realizad con éxito a: ", serverInfo.address);
    return driver;
  } catch (err) {
    console.error("Error al conectar con Neo4j: ", err.message);
    if (err.cause) {
      console.error("Causa: ", err.cause);
    }
    await driver.close();
    throw err;
  }
}

// Función para cerrar la conexión con la base de datos
async function closeConnection(driver) {
  try {
    await driver.close();
    console.log("Conexión cerrada con éxito.");
  } catch (err) {
    console.error("Error al cerrar la conexión: ", err.message);
  }
}

// Función para abrir una sesión en la base de datos especificada
function openSession(driver, database) {
  const session = driver.session({ database: database });
  console.log("Sesión abierta con éxito en la base de datos: ", database);
  return session;
}

// Función para cerrar una sesión
async function closeSession(session) {
  try {
    await session.close();
    console.log("Sesión cerrada con éxito.");
  } catch (err) {
    console.error("Error al cerrar la sesión: ", err.message);
  }
}

// Prueba de conexión haciendo uso de las funciones definidas
async function testConnection(host, user, password, database) {
  const driver = await connectDatabase(host, user, password);
  const session = openSession(driver, database);
  await closeSession(session);
  await closeConnection(driver);
}

// Exportamos las funciones para su uso en otros módulos
module.exports = {
  connectDatabase,
  openSession,
  closeSession,
  testConnection,
};
