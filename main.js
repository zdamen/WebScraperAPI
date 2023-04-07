const fs = require("fs");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/UpdateData", (req, res) => {
  let data = req.body;
  console.log(data);

  fs.writeFile("Database.json", JSON.stringify(data, undefined, 2), (err) => {
    if (err) {
      console.error("Error writing data to file:", err);
      res.status(500).json({ message: "Failed to update data" });
    } else {
      console.log("Data written to file");
      res.status(200).json({ message: "Data updated successfully" });
    }
  });
});

app.get('/GetPrices', (req, res) => {
  fs.readFile('Database.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading Database.json');
    } else {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
});

app.listen(process.env.PORT || 3000, () => console.log("API Server is running..."));

