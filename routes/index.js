const express       = require("express");
const rootRoutes    = require("./root");
const accountRoutes = require("./account");
const profileRoute  = require("./profile");
const uploadRoute   = require("./upload");

const router = express.Router();

router.use("/", rootRoutes);
router.use("/account", accountRoutes);
router.use("/profile", profileRoute);
router.use("/upload", uploadRoute);

module.exports = router;
