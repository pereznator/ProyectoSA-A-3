const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createIngreso = require("../../components/ingreso/create");
const deleteIngreso = require("../../components/ingreso/delete");
const readIngreso = require("../../components/ingreso/read");
const updateIngreso = require("../../components/ingreso/update");
const viewIngreso = require("../../components/ingreso/view");
router.post(
  "/",
  authMiddleware.authorize,
  createIngreso.createIngreso
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateIngreso.updateIngreso
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteIngreso.deleteIngreso
);
router.get("/", authMiddleware.authorize, readIngreso.readIngreso);
router.get("/:id", authMiddleware.authorize, viewIngreso.viewIngreso);

module.exports = router;
