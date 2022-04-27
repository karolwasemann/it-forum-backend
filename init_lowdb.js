// nodejs->json-lowdb-server.js

//*** import nessacary stuff ***
import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import _ from "lodash";

//*** init lodash with db.json file***
// Use JSON file for storage

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

//*** Read JSON FILE ***/
// Read data from JSON file, this will set db.data content
// If file.json doesn't exist, db.data will be null
await db.read();
//console.log(db.data); //null, if no data set yet

// ***set default Data***
// ||=
// => "The logical OR assignment (x ||= y) operator only assigns if x is falsy."
db.data ||= {
  comment: [],
};
await db.write(); // Write db.data content to db.json

// *** init lodash chain ***
// Note: db.data needs to be initialized before lodash.chain is called.
// verkettung von lodash BEfehlen werden möglich
db.chain = _.chain(db.data);

export default db;
