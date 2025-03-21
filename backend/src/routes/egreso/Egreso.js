const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createEgreso = require("../../components/egreso/create");
const deleteEgreso = require("../../components/egreso/delete");
const readEgreso = require("../../components/egreso/read");
const updateEgreso = require("../../components/egreso/update");
const viewEgreso = require("../../components/egreso/view");
router.post(
  "/",
  authMiddleware.authorize,
  createEgreso.createEgreso
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateEgreso.updateEgreso
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteEgreso.deleteEgreso
);
router.get("/", authMiddleware.authorize, readEgreso.readEgreso);
router.get(
  "/:id",
  authMiddleware.authorize,
  viewEgreso.viewEgreso
);

module.exports = router;
