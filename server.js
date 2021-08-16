const express = require("express");
const { readdirSync } = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");

require("dotenv").config();

const app = express();

const corsOptions = {
	origin: ["http://localhost:3000"],
	credentials: true,
};

// middleware
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

function sayHello(name) {
	console.log("Hey ", name);
}

const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log("DB connection successfull!"));

// route middleware
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

sayHello("Hubert");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}.`);
});
