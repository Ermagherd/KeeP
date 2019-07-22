const express           = require("express");
const profileController = require("../controllers/profile");
const router            = express.Router();

router
  .route("/:profile")
  .get(profileController.profilePage);

router
  .route("/all-users")
  .get(profileController.allUsers);

module.exports = router;