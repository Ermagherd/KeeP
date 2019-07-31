const express           = require("express");
const accountController = require("../controllers/account");
const router            = express.Router();

router
  .route("/login")
  .get(accountController.loginPage)
  .post(accountController.validateLogin, accountController.userLogin);

router
  .route("/signup")
  .get(accountController.signupPage)
  .post(accountController.validateUserCreation, accountController.createUser);

router
  .route("/reset-password")
  .post(accountController.validateResetPassword, accountController.reset_password);

router
  .route("/logout")
  .get(accountController.logout);

module.exports = router;
