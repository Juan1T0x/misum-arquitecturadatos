/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use("restaurantesdb");

// Find if there is a restaurant named Martin Auer
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

// Find the restaurant named Martin Auer and return its id
db.restaurantes.find({ name: "Martin Auer" }, { _id: 1 });
