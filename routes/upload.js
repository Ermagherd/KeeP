

const express        = require("express");
const uploadController = require("../controllers/upload");
const router         = express.Router();

router
  .route("/:filename")
  .get(uploadController.get_image);

module.exports = router;