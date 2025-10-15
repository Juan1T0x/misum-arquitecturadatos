const myutils = require("./myUtils");

const host = "neo4j://localhost:7687";
const user = "neo4j";
const password = "12345678";

async function consulta(session, queryText) {
  try {
    const res = await session.executeRead((tx) => {
      return tx.run(queryText);
    });
    // resultado es un array con los nombres devueltos por la consulta
    const resultados = res.records.map((row) => row.get("name"));
    resultados.forEach(myutils.showElement);
  } catch (err) {
    console.error("Error en la consulta", err.message);
    if (err.cause) console.error("Causa:", err.cause);
    throw err;
  }
}

async function main() {
  const driver = await myutils.connectDatabase(host, user, password);
  const session = myutils.openSession(driver);
  try {
    const myQuery = "MATCH (p:Person) RETURN p.name AS name LIMIT 10";
    await consulta(session, myQuery);
  } catch (err) {
    console.error("Error en main:", err.message);
  } finally {
    await session.close();
    console.log("Sesión cerrada");
    await driver.close();
    console.log("Conexión cerrada");
  }
}
main();
