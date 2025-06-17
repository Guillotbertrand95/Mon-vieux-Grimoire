// controllers/booksController.js
const Book = require("../models/Book");
const fs = require("fs");

const sharp = require("sharp");
const path = require("path");

exports.createBook = (req, res, next) => {
	try {
		const bookObject = JSON.parse(req.body.book);
		delete bookObject._id;
		delete bookObject._userId;

		// Extraire juste le nom de fichier à partir du chemin compressé
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

// Modifier un livre
exports.updateBook = (req, res, next) => {
	Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Livre modifié !" }))
		.catch((error) => res.status(400).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((thing) => {
			if (thing.userId != req.auth.userId) {
				res.status(401).json({ message: "Not authorized" });
			} else {
				const filename = thing.imageUrl.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					Book.deleteOne({ _id: req.params.id })
						.then(() => {
							res.status(200).json({
								message: "Objet supprimé !",
							});
						})
						.catch((error) => res.status(401).json({ error }));
				});
			}
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};

// Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
	Book.find()
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }));
};

// Récupérer un seul livre par son ID
exports.getOneBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => res.status(200).json(book))
		.catch((error) => res.status(404).json({ error }));
};
