const router = require("express").Router();
const authMiddleware = require("../../middlewares/tokenValidator");
const createAdmin = require("../../components/admin/create");
const deleteAdmin = require("../../components/admin/delete");
const readAdmin = require("../../components/admin/read");
const updateAdmin = require("../../components/admin/update");
const viewAdmin = require("../../components/admin/view");
router.post("/",authMiddleware.authorize, createAdmin.createAdmin);
router.put("/:id",authMiddleware.authorize, updateAdmin.updateAdmin);
router.delete("/:id",authMiddleware.authorize, deleteAdmin.deleteAdmin);
router.get("/",authMiddleware.authorize, readAdmin.readAdmin);
router.get("/:id",authMiddleware.authorize, viewAdmin.viewAdmin);

module.exports = router;
