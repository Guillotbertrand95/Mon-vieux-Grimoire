// routes/booksRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const booksCtrl = require("../controllers/books");
const multer = require("../middleware/multer-config");
const compressImages = require("../middleware/compressImages");
const booksController = require("../controllers/books");

router.post("/", auth, multer, compressImages, booksCtrl.createBook);
router.put("/:id", auth, booksCtrl.updateBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.get("/", booksCtrl.getAllBooks);
router.get("/bestrating", booksController.getBestRatedBooks);
router.get("/:id", booksCtrl.getOneBook);
router.post("/:bookId/rating", auth, booksController.rateBook);

module.exports = router;
