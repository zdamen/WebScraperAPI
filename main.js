const fs = require("fs");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");

const app = express();
app.use(cors());
app.use(express.json());

let cache = null; // Add a variable to store the cached data

function readDataFromFile() {
  return new Promise((resolve, reject) => {
    fs.readFile("Database.json", "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      }
    });
  });
}

function loadData() {
  return readDataFromFile()
    .then((data) => {
      cache = data;
      return data;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });
}

app.post("/UpdateData", (req, res) => {
  let data = req.body;
  console.log(data);

  fs.writeFile("Database.json", JSON.stringify(data, undefined, 2), (err) => {
    if (err) {
      console.error("Error writing data to file:", err);
      res.status(500).json({ message: "Failed to update data" });
    } else {
      console.log("Data written to file");
      loadData(); // Update the cache when the file is updated
      res.status(200).json({ message: "Data updated successfully" });
    }
  });
});

app.get("/GetPrices", (req, res) => {
  if (cache) {
    // Serve the data from the cache if it's available
    res.json(cache);
  } else {
    // Load the data from the file and store it in the cache if it's not available
    loadData()
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res.status(500).send("Error reading Database.json");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error reading Database.json");
      });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("API Server is running...");
  loadData(); // Load the data into the cache when the server starts
});
