import { Cone } from "cone";
import express from "express";
import fs from 'fs';
// import { document, Element } from 'html-element';
// console.info("cone-example > imported important shim for document and Element in Node.js env", document, Element);

const app = express();
const port = 3000;

app.use("/", (req, res) => {

  const data = fs.readFileSync('example.cone', 'utf8');
  console.info("cone-example > building from data", data);

  const generated = Cone.ConeBuilder.build({
    data
  });
  console.info("cone-example > finished generating HTML", generated);

  res.set('Content-Type', 'text/html');
  res.send(generated);
});

app.listen(port, () => {
  console.log(`cone-example > live on port ${port}`);
});
