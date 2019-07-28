const express       = require("express");
const rootRoutes    = require("./root");
const accountRoutes = require("./account");
const profileRoute    = require("./profile");

const router = express.Router();

router.use("/", rootRoutes);
router.use("/account", accountRoutes);
router.use("/profile", profileRoute);

module.exports = router;
