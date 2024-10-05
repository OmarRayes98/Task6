const fs = require("fs");
const path = require("path");

function readDataFromFile(callback) {
    fs.readFile("data.json", "utf8", (err, data) => {
    callback(JSON.parse(data));
    });
}

function writeDataToFile(data, callback) {
    fs.writeFile("data.json", JSON.stringify(data, null, 2), "utf8", (err) => {
    callback(err);
    });
}

module.exports = { readDataFromFile, writeDataToFile };
