// routes/booksRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const booksCtrl = require("../controllers/books");

router.post("/", auth, booksCtrl.createBook);
router.put("/:id", auth, booksCtrl.updateBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.get("/", auth, booksCtrl.getAllBooks);
router.get("/:id", auth, booksCtrl.getOneBook);

module.exports = router;
