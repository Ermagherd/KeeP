const express       = require("express");
const rootRoutes    = require('./root');
const accountRoutes = require('./account');
const userRoutes    = require('./user');

const router = express.Router();

router
  .use("/", rootRoutes);
router
  .use("/account", accountRoutes);
router
  .use("/user", userRoutes);

module.exports = router;