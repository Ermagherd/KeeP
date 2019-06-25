const express = require("express");
const rootRoutes = require('./root');
const accountRoutes = require('./account.js');

const router = express.Router();

router.use("/", rootRoutes);
router.use("/account", accountRoutes);

module.exports = router;