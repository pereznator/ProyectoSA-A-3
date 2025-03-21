const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const missingToken = require("../../middlewares/misingToken");
const login = require("../../helpers/cognito/login");
const refresh = require("../../helpers/cognito/refresh");
const logout = require("../../helpers/cognito/logout");
const getUsr = require("../../helpers/cognito/getUsr");
router.post("/login", login.handleLogin);
router.get("/refresh", missingToken.missingToken, refresh.handleRefresh);
router.get("/logout", missingToken.missingToken, logout.handleLogout);
router.get("/get-usr", authMiddleware.authorize, getUsr.getUsr);

module.exports = router;
