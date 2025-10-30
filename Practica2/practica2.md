# Máster en Ingeniería del Software. Arquitectura de datos

Juan Hernández Acosta - juan.hernandeza@um.es

## Práctica 2. Consultas en Neo4J. Cypher

### 1. Introducción

### 2. Consulta de entrenamiento 1

- Define una consulta que recupere la propiedad tagline de la película (Movie) titulada (title) “Top Gun”.

> MATCH (m:Movie)
> WHERE m.title = 'Top Gun'
> RETURN m.tagline

![](imagenes/taglineTopGun.png)

### 3. Consulta de entrenamiento 2

- Define una consulta que obtenga el nombre del productor o productores de la película When Harry Met Sally.

> MATCH (p:Person)-[:PRODUCED]->(m:Movie)
> WHERE m.title = 'When Harry Met Sally'
> RETURN p.name

![](imagenes/productoresWhenHarry.png)

### 4. Consulta de entrenamiento 3

- Define una consulta que busque a la persona “Santiago Segura”, añada la película “El día de la bestia” y cree la relación entre el actor y la película.

> MATCH (p:Person {name: 'Santiago Segura'})
> MERGE (m:Movie {title : 'El día de la bestia'})
> MERGE (p)-[r:ACTED_IN]->(m)
> RETURN p,r,m

![](imagenes/mergeSantiagoSegura.png)

### 5. Consulta de entrenamiento 4

- Encontrar la película Padre no hay más que uno y añadirle las propiedades fecha de estreno (released)= 2019 y eslogan(tagline) = “¿Y cuándo decís que viene mamá?”

> MATCH (m:Movie {title: 'Padre no hay más que uno'})
> SET m.tagline = '¿Y cuándo decís que viene mamá?'
> SET m.released = 2019
> RETURN m

![](imagenes/cuandoVieneMama.png)

### 6. Consulta de entrenamiento 5

- Obtener el nombre de la persona, su papel y el título de la película en la que el papel incluya “agent”, haciendo la consulta case-insensitive.

> MATCH (p:Person)-[r:ACTED_IN]->(m:Movie)
> WHERE any(role IN r.roles WHERE toLower(role) CONTAINS 'agent')
> RETURN p.name, r.roles, m.title

En este caso, hemos incluido la función predicativa _any_ ya que no podemos aplicar directamente el operador _CONTAINS_ a r.roles debido a que esta etiqueta es del tipo lista dentro de la relación.

![](imagenes/roles.png)

### 7. Consulta de entrenamiento 6

- Obtener el nombre de la persona que ha dirigido más películas, y el número de películas.

> MATCH (p:Person)-[r:DIRECTED]->(m:Movie)
> RETURN p.name as director, count(m) as dirigidas
> ORDER BY dirigidas DESC
> LIMIT 1

![](imagenes/peliculasDirigidas.png)

### X. Conclusión

