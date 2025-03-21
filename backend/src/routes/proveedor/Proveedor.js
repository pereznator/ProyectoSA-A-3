const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createProveedor = require("../../components/proveedor/create");
const deleteProveedor = require("../../components/proveedor/delete");
const readProveedor = require("../../components/proveedor/read");
const updateProveedor = require("../../components/proveedor/update");
const viewProveedor = require("../../components/proveedor/view");
router.post(
  "/",
  authMiddleware.authorize,
  createProveedor.createProveedor
);
router.put(
  "/:id",
  authMiddleware.authorize,
  updateProveedor.updateProveedor
);
router.delete(
  "/:id",
  authMiddleware.authorize,
  deleteProveedor.deleteProveedor
);
router.get("/", authMiddleware.authorize, readProveedor.readProveedor);
router.get("/:id", authMiddleware.authorize, viewProveedor.viewProveedor);

module.exports = router;
