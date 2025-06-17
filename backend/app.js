const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const booksRoutes = require("./routes/books"); // 👈 ajouté
const imageRoutes = require("./routes/image");
mongoose
	.connect(
		"mongodb+srv://guillotbertrand95:967996GLTbg44@cluster0.5i535hf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

app.use("/api/books", booksRoutes); // 👈 pour les routes /api/books
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/image", imageRoutes);
module.exports = app;
