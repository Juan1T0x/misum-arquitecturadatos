const myutils = require("./myUtils");

const host = "neo4j://localhost:7687";
const user = "neo4j";
const password = "12345678";

async function main() {
  const driver = await myutils.connectDatabase(host, user, password);
  const session = myutils.openSession(driver);
  myutils.closeSession(session);
  await driver.close();
  console.log("Conexión cerrada");
}
main();
