const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createExistencia = require("../../components/existencia/create");
const deleteExistencia = require("../../components/existencia/delete");
const readExistencia = require("../../components/existencia/read");
const updateExistencia = require("../../components/existencia/update");
const viewExistencia = require("../../components/existencia/view");
const bulkExistencia = require("../../components/existencia/bulk");

router.post("/", authMiddleware.authorize, createExistencia.createExistencia);
router.post(
  "/bulk",
  authMiddleware.authorize,
  bulkExistencia.createExistenciaBulk
);
router.put("/:id", authMiddleware.authorize, updateExistencia.updateExistencia);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteExistencia.deleteExistencia
);
router.get("/", authMiddleware.authorize, readExistencia.readExistencia);
router.get("/:id", authMiddleware.authorize, viewExistencia.viewExistencia);

module.exports = router;
