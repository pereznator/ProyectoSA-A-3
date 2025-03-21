const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createCliente = require("../../components/cliente/create");
const deleteCliente = require("../../components/cliente/delete");
const readCliente = require("../../components/cliente/read");
const updateCliente = require("../../components/cliente/update");
const viewCliente = require("../../components/cliente/view");
const resetPassword = require("../../components/cliente/reset_pwd");
const check_usr = require("../../components/cliente/check_usr");
const { desactivarCliente } = require("../../components/cliente/desactivar");

router.post("/", createCliente.createCliente);
router.put(
  "/update/:id",
  authMiddleware.authorize,
  updateCliente.updateCliente
);
router.put("/check/:id", check_usr.checkUsr);
router.delete("/:id", authMiddleware.authorize, deleteCliente.deleteCliente);
router.get("/", authMiddleware.authorize, readCliente.readCliente);
router.get("/desactivar/:username", desactivarCliente);
router.get("/:id", authMiddleware.authorize, viewCliente.viewCliente);
router.post("/send-recovery", resetPassword.sendMailPasswordRecovery);
router.put("/:id/reset-pwd", resetPassword.resetPassword);

module.exports = router;
