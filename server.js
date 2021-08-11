const express = require("express");
const { readdirSync } = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(morgan("dev"));

// route middleware
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}.`);
});
