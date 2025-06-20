const Book = require("../models/Book");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

// 📚 Créer un livre
exports.createBook = (req, res, next) => {
	try {
		const bookObject = JSON.parse(req.body.book);
		delete bookObject._id;
		delete bookObject._userId;

		const compressedFilename = req.file.compressedPath.split("/").pop();

		const book = new Book({
			...bookObject,
			userId: req.auth.userId,
			imageUrl: `${req.protocol}://${req.get(
				"host"
			)}/images/compressed/${compressedFilename}`,
		});

		book.save()
			.then(() => res.status(201).json({ message: "Livre enregistré !" }))
			.catch((error) => res.status(400).json({ error }));
	} catch (error) {
		res.status(400).json({ error });
	}
};

// ✏️ Modifier un livre
exports.updateBook = (req, res, next) => {
	Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Livre modifié !" }))
		.catch((error) => res.status(400).json({ error }));
};

// 🗑️ Supprimer un livre
exports.deleteBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (book.userId != req.auth.userId) {
				return res.status(401).json({ message: "Not authorized" });
			}
			const filename = book.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Book.deleteOne({ _id: req.params.id })
					.then(() =>
						res.status(200).json({ message: "Livre supprimé !" })
					)
					.catch((error) => res.status(401).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

// 📖 Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
	Book.find()
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }));
};

// 🔍 Récupérer un seul livre
exports.getOneBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => res.status(200).json(book))
		.catch((error) => res.status(404).json({ error }));
};

// ⭐ Noter un livre
exports.rateBook = async (req, res) => {
	try {
		const userId = req.auth.userId;
		const grade = req.body.grade ?? req.body.rating;
		const { bookId } = req.params;

		// 🔒 Vérifications de base
		if (!bookId) {
			return res.status(400).json({ message: "ID du livre manquant" });
		}
		if (typeof grade !== "number" || grade < 0 || grade > 5) {
			return res
				.status(400)
				.json({ message: "Note invalide (doit être entre 0 et 5)" });
		}

		// 🔎 Récupération du livre
		const book = await Book.findById(bookId);
		if (!book) {
			return res.status(404).json({ message: "Livre non trouvé" });
		}

		// 🛡️ Vérification de double notation
		const existingRating = book.ratings.find((r) => r.userId === userId);
		if (existingRating) {
			return res
				.status(400)
				.json({ message: "Vous avez déjà noté ce livre." });
		}

		// ✅ Ajouter la nouvelle note
		book.ratings.push({ userId, grade });

		// 🔢 Recalcul de la moyenne
		const total = book.ratings.reduce((acc, r) => acc + r.grade, 0);
		book.averageRating = Number((total / book.ratings.length).toFixed(1)); // précision 1 chiffre

		await book.save();
		res.status(200).json(book);
	} catch (error) {
		console.error("Erreur dans rateBook :", error);
		res.status(500).json({ error: error.message });
	}
};
