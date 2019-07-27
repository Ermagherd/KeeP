const express           = require("express");
const profileController = require("../controllers/profile");
const router            = express.Router();

router
  .route("/all-users")
  .get(profileController.allUsers);

router
  .route("/add-friend")
  .post(profileController.add_friend);

router
  .route("/unfollow-friend")
  .post(profileController.unfollow_friend);

router
  .route("/approve-friend")
  .post(profileController.approve_friend);

router
  .route("/remove-friend")
  .post(profileController.remove_friend);

router
  .route("/decline-friend")
  .post(profileController.decline_friend);

router
  .route("/unblock-friend")
  .post(profileController.unblock_friend);

router
  .route("/:profile")
  .get(profileController.profilePage);


module.exports = router;