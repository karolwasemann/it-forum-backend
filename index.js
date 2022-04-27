import express from "express";
import db from "./init_lowdb.js";
import cors from "cors"; // Cross-Origin Resource Sharing
import { appendFile } from "fs";

const app = express();
app.use(cors()); // allow all request
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/notfound", (req, res, next) => {
  try {
    const myErr = new Error("not-found");
    myErr.type = "not-found";
    next(err);
  } catch (err) {
    console.log("hier im Err");
    next(err);
  }
});

app.get("/404", (req, res) => {
  res.status(404).send("Server not found");
});

app.use((err, req, res, next) => {
  const date = new Date().toLocaleString();
  let text = "\n" + date + "\n" + err.type;
  appendFile("./error_log.txt", text, () => {});
  console.log("hallo");
  res.redirect("/404");
});

app.get("/", (req, res) => {
  res.send(db.data.comments);
});

app.post("/", async (req, res, next) => {
  console.log("recieved");
  // console.log(db);
  console.log(req.body);
  db.data["comments"].push(req.body);
  await db.write();

  res.end();
});
app.delete("/", (req, res) => {
  const id = req.body.id;
  console.log(id);
  db.data["comments"] = db.data["comments"].filter(
    (comment) => comment.id !== id
  );
  // db.data["comments"] = newdb;
  db.write();

  res.end();
});

app.put("/", (req, res) => {
  const id = req.body.id;
  const message = req.body.message;

  db.data["comments"].forEach((comment) =>
    comment.id === id ? (comment.message = message) : null
  );

  db.write();
  res.end();
});

app.delete("/", (req, res) => {
  const id = req.body.id;
  console.log("id", id);

  db.data["comments"] = db.data["comments"].filter(
    (comment) => comment.id !== id
  );
  db.write();
  res.end();
});

app.put("/", (req, res) => {});

app.use((req, res) => {
  res.redirect("/notfound");
});

app.listen(PORT, () => console.log("Listening on port 4000"));
