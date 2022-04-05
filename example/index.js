import express from "express";
import fs from "fs";
import { Cone } from "oogy-cone";

// import { dirname } from "path";
// import { fileURLToPath } from "url";
// const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use("/assets", express.static("assets"));

app.use("/", (req, res) => {
  const template = fs.readFileSync("example.cone", "utf8");
  console.info("cone-example > building from data", template);

  const generated = Cone.ConeBuilder.build({
    template,
  });
  console.info("cone-example > finished generating HTML", generated);

  res.set("Content-Type", "text/html");
  res.send(generated);
});

app.listen(port, () => {
  console.log(`cone-example > live on port ${port}`);
});
