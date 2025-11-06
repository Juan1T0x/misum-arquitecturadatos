# Máster en Ingeniería del Software. Arquitectura de datos

Juan Hernández Acosta - juan.hernandeza@um.es

## Práctica 4. Bases de datos documentales. MongoDB

### 1. Introducción

### 2. Ejercicio de entrenamiento 1

- Descárgate el siguiente fichero JSON sobre restaurantes e impórtalo en la base de datos en una colección llamada restaurantes en la base de datos restaurantesdb. Si todo va bien, la siguiente consulta nos debe decir que hay 25359 restaurantes.

Usaremos el siguiente comando para importar los datos:

```bash
docker exec -it mongodb mongoimport --db restaurantesdb --collection restaurantes --type json --file  /data/db/restaurantes.json

2025-11-05T18:42:27.389+0000    connected to: mongodb://localhost/
2025-11-05T18:42:28.268+0000    25359 document(s) imported successfully. 0 document(s) failed to import.
```

### 3. Ejercicio de entrenamiento 2

- Inserta un nuevo documento en la colección restaurantes
- Recupera dicho documento utilizando la función find() con su \_id como argumento

Primero, para insertar el documento, usamos el comando insertOne indicando los campos necesarios:

```js
db.restaurantes.insertOne({
  name: "Martin Auer",
  address: {
    building: "7676",
    coord: [47.07973227095189, 15.467341135890244],
    street: "Stiftingalstrasse 5",
    zipcode: "8010",
  },
  borough: "Graz-Ries",
  cuisine: "Bakery",
  grades: [
    {
      date: { $date: "2014-11-15T00:00:00.000Z" },
      grade: "A",
      score: 2,
    },
  ],
});
```

Una vez insertado, podemos recuperar el documento usando find() con el nombre del restaurante. Además, nos interesa recuperar el campo \_id para usarlo en la siguiente consulta:

```js
db.restaurantes.find({ name: "Martin Auer" }, { _id: 1 });
```

La consulta nos devuelve que la \_id del documento es 690ba238068d720fdc10884cc, por lo que ahora podemos recuperar el documento usando dicha \_id:

```js
db.restaurantes.find({ _id: ObjectId("690ba238068d720fdc10884c") });
```

Finalmente, el documento recuperado es el siguiente:

```bash
[
  {
    "_id": {
      "$oid": "690ba238068d720fdc10884c"
    },
    "name": "Martin Auer",
    "address": {
      "building": "7676",
      "coord": [
        47.07973227095189,
        15.467341135890244
      ],
      "street": "Stiftingalstrasse 5",
      "zipcode": "8010"
    },
    "borough": "Graz-Ries",
    "cuisine": "Bakery",
    "grades": [
      {
        "date": {
          "$date": "2014-11-15T00:00:00.000Z"
        },
        "grade": "A",
        "score": 2
      }
    ]
  }
]
```

### 4. Ejercicio de entrenamiento 3

### X. Conclusión

```bash

```
