const sharp = require("sharp");
const fs = require("fs");
const compressedDir = "images/compressed";

module.exports = async (req, res, next) => {
	try {
		if (!req.file) return next();

		const compressedDir = "images/compressed";
		if (!fs.existsSync(compressedDir)) {
			fs.mkdirSync(compressedDir, { recursive: true });
		}

		const inputPath = req.file.path;
		const filenameWithoutExt = req.file.filename
			.split(".")
			.slice(0, -1)
			.join(".");
		const outputPath = `${compressedDir}/compressed-${filenameWithoutExt}.webp`;

		await sharp(inputPath)
			.resize({ width: 800 }) // optionnel
			.webp({ quality: 75 }) // compression WebP
			.toFile(outputPath);

		fs.unlinkSync(inputPath); // supprime l’original
		console.log("Image compressée vers :", outputPath);
		req.file.compressedPath = outputPath; // chemin vers le fichier compressé
		next();
	} catch (error) {
		console.error("Erreur compression image:", error);
		res.status(500).json({ error: "Erreur compression image" });
	}
};
