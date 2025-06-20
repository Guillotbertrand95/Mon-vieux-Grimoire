const express = require("express");
const router = express.Router();

// Middlewares
const upload = require("../middleware/multer-config"); // pour l'upload
const compressImages = require("../middleware/compressImages"); // pour la compression

// Route POST pour uploader et compresser une image
router.post("/upload", upload, compressImages, (req, res) => {
	// Sécurisation de l'accès à req.file.compressedPath
	const compressedPath = req.file?.compressedPath;

	if (!compressedPath) {
		return res.status(400).json({
			message: "L'image n'a pas pu être compressée ou uploadée.",
		});
	}
	router.get("/test", (req, res) => {
		res.status(200).json({ message: "Route image OK" });
	});
	res.status(200).json({
		message: "Image uploadée et compressée !",
		chemin: compressedPath,
	});
});

module.exports = router;
