const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createEstadoCivil = require("../../components/estado_civil/create");
const deleteEstadoCivil = require("../../components/estado_civil/delete");
const readEstadoCivil = require("../../components/estado_civil/read");
const updateEstadoCivil = require("../../components/estado_civil/update");
const viewEstadoCivil = require("../../components/estado_civil/view");
router.post("/", authMiddleware.authorize, createEstadoCivil.createEstadoCivil);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateEstadoCivil.updateEstadoCivil
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteEstadoCivil.deleteEstadoCivil
);
router.get("/", authMiddleware.authorize, readEstadoCivil.readEstadoCivil);
router.get("/:id", authMiddleware.authorize, viewEstadoCivil.viewEstadoCivil);

module.exports = router;
