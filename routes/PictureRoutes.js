const express = require('express');
const router = express.Router(); 
const PicturesController = require("../controllers/PictureController")


router.post("/", PicturesController.uploadUserPicture)
router.get("/:id", PicturesController.getPicture)

module.exports = router;