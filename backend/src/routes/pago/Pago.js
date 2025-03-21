const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createPago = require("../../components/pago/create");
const deletePago = require("../../components/pago/delete");
const readPago = require("../../components/pago/read");
const updatePago = require("../../components/pago/update");
const viewPago = require("../../components/pago/view");
router.post("/", authMiddleware.authorize, createPago.createPago);
router.put("/:id", authMiddleware.authorize, updatePago.updatePago);
router.delete("/:id", authMiddleware.authorize, deletePago.deletePago);
router.get("/", authMiddleware.authorize, readPago.readPago);
router.get("/:id", authMiddleware.authorize, viewPago.viewPago);

module.exports = router;
