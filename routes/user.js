const express           = require("express");
const accountController = require("../controllers/user");
const router            = express.Router();

router
  .route("/profile")
  .get(accountController.profilePage);

module.exports = router;