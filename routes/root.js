const express        = require("express");
const mainController = require("../controllers/main");
const router         = express.Router();

router
  .route("/")
  .get(mainController.landingPage);

router
  .route("/about")
  .get(mainController.aboutPage);

router
  .route("/dashboard")
  .get(mainController.dashboardPage);

module.exports = router;