# Máster en Ingeniería del Software. Arquitectura de datos

Juan Hernández Acosta - juan.hernandeza@um.es

## Práctica 3. Conectando a Neo4J desde JavaScript (JS)

### 1. Introducción

En esta práctica vamos a familiarizarnos con la conexión a bases de datos Neo4J desde JavaScript utilizando el driver oficial de Neo4J para JS. Realizaremos consultas de lectura y escritura, tanto simples como dentro de transacciones, y manejaremos errores y excepciones.

### 2. Ejercicios sobre la base de datos de Marvel

#### 2.1. Consulta simple a la base de datos

- Hasta ahora hemos hecho siempre las consultas contra la base de datos de películas. A continuación consultaréis la base de datos de Marvel. La consulta consiste en obtener los nombres de los héroes (podéis probar con cualquier otra), los cuales mostraremos por pantalla a través de la función procesa, que es similar a ejercicios anteriores.

Para la realización de este ejercicio, se ha usado lógica propuesta en el ejercicio 5 a través de una transacción que devuelve los resultados de la consulta Cypher sin procesar.

```js
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
```

Además, se ha modificado la función procesa para que muestre los nombres de los héroes obtenidos en la consulta.

```js
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
```

La consulta Cypher que se ha utilizado es la siguiente:

```js
const myQuery = "MATCH (h:Hero) RETURN h.name AS name";
```

Finalmente, se ejecuta la consulta y se procesan los resultados obtenidos:

```js
const resultadosIniciales = await consultaResultados(session, myQuery);
console.log("Resultados iniciales:");
procesa(resultadosIniciales);
```

#### 2.2. Escenario con transacción y simulación de fallo

- Crearemos un héroe que relacionaremos con uno existente a través de la relación CO_STAR. Tenéis que simular un fallo tras la creación del héroe, de manera que no sea posible relacionarlo con el héroe existente y se reviertan los cambios. Para simular el error podéis lanzar una excepción.

```js
throw new Error("Simulación de error para rollback");
```

Para este ejercicio, se ha creado la función crearHeroeConRollback. Esta usa la lógica de la consulta de escritura con transacción del ejercicio 3. Dentro de la transacción, se crea un nuevo héroe y luego se lanza una excepción para simular un error. Esto provoca que la transacción se revierta automáticamente, y el nuevo héroe no se cree en la base de datos. Por tanto, todo el código a partir de la excepción no se ejecuta.

```js
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
```

Después, se ejecuta la consulta inicial para mostrar los héroes existentes, se llama a la función crearHeroeConRollback para intentar crear un nuevo héroe y luego se vuelve a ejecutar la consulta para mostrar los héroes existentes después del intento de creación fallido.

```js
const resultadosIniciales = await consultaResultados(session, myQuery);
console.log("Resultados iniciales:");
procesa(resultadosIniciales);

await crearHeroeConRollback(session, "Bobobo", "Spiderman");

const resultadosFinales = await consultaResultados(session, myQuery);
console.log("Resultados finales:");
procesa(resultadosFinales);
```

### 3. Conclusión

Aunque no se han podido mostrar los resultados obtenidos de las consultas debido a la indisponibilidad de los archivos para cargar la base de datos de héroes, esta práctica nos ha permitido entender cómo funciona la conexión a Neo4J desde JavaScript, así como la ejecución de consultas de lectura y escritura, el manejo de transacciones y la simulación de errores. Estos conceptos son fundamentales para trabajar en aplicaciones no solo de JavaScript, sino en cualquier entorno que requiera interacción con bases de datos.
