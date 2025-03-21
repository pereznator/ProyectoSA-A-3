const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createColaborador = require("../../components/colaborador/create");
const deleteColaborador = require("../../components/colaborador/delete");
const readColaborador = require("../../components/colaborador/read");
const updateColaborador = require("../../components/colaborador/update");
const viewColaborador = require("../../components/colaborador/view");
const resetPassword = require("../../components/colaborador/reset_pwd");

router.post("/", authMiddleware.authorize, createColaborador.createColaborador);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateColaborador.updateColaborador
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteColaborador.deleteColaborador
);
router.get("/", authMiddleware.authorize, readColaborador.readColaborador);
router.get("/:id", authMiddleware.authorize, viewColaborador.viewColaborador);
router.post("/send-recovery",  resetPassword.sendMailPasswordRecovery);
router.put("/:id/reset-pwd",  resetPassword.resetPassword);
module.exports = router;
