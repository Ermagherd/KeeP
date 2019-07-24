const express           = require("express");
const profileController = require("../controllers/profile");
const router            = express.Router();

router
  .route("/all-users")
  .get(profileController.allUsers);

router
  .route("/:profile")
  .get(profileController.profilePage);


module.exports = router;