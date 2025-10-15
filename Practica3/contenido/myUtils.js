const neo4j = require("neo4j-driver");

async function connectDatabase(host, user, password) {
  const driver = neo4j.driver(host, neo4j.auth.basic(user, password));
  try {
    const serverInfo = await driver.getServerInfo();
    console.log("Conectado a:", serverInfo.address);
    return driver;
  } catch (err) {
    console.error("Error al conectar con Neo4j: ", err.message);
    if (err.cause) {
      console.error("Causa:", err.cause);
    }
    await driver.close();
    throw err;
  }
}

function openSession(driver) {
  const session = driver.session({ database: "neo4j" });
  console.log("Sesión iniciada");
  return session;
}

async function closeSession(session) {
  try {
    await session.close();
    console.log("Sesión cerrada");
  } catch (err) {
    console.error("Error al cerrar la sesión:", err.message);
  }
}

function showElement(item) {
  console.log(item);
}

module.exports = { connectDatabase, openSession, closeSession, showElement };
