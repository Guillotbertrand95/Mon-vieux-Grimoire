const express = require("express");

const app = express();
app.use((req, res, next) => {
	console.log("requete reçu");
	next();
});

app.use((req, res, next) => {
	res.status(201);
	console.log("ok");
	next();
});
app.use((req, res, next) => {
	res.json({ message: "votre requete est bien reçu" });
});

module.exports = app;
