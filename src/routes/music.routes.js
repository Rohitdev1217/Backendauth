const express = require("express");
const router = express.Router();
const musicController = require("../controllers/music.controller");
const multer = require("multer");
module.exports = router;
const upload = multer({ storage: multer.memoryStorage() });
router.post("/upload", upload.single("music"), musicController.createMusic);
