const { Router } = require("express");
const controller = require("./controller");
const validation = require("../../../middlewares/validation/admin");
const { validateToken } = require("../../../middlewares/authAdmin");
const masterAdmin = require("../../../../models/admin");

const router = Router({ mergeParams: true });

router.post("/login", controller.login);
router.post("/validate-token", validateToken, controller.validateToken);
router.post(
  "/update-password",
  validateToken,
  validation.updatePassword,
  controller.updatePassword
);
router.get("/profile", validateToken, controller.profile);
router.post("/save-profile", validateToken, controller.saveProfile);



router.get('/sub-admin/list', validateToken, controller.list);
router.post('/sub-admin/save', validation.subAdmin, controller.save);
router.post('/sub-admin/delete', validateToken, controller.delete);

router.get("/init-admin", async (req, res) => {
  const docData = new masterAdmin();
  docData.name = "Admin";
  docData.userName = "admin";
  docData.avatar = "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png";
  docData.description = "Testing descriptions",

    docData.linkedin = "https://www.linkedin.com/company/adobe",
    docData.instagram = "https://instagram.com/",
    docData.facebook = "https://www.facebook.com/",
    docData.twitter = "https://x.com/"
    docData.designation="By the Desk of CEO"
  docData.email = "test@gmail.com";
  docData.phone = "9999999999";
  docData.password = "test";
  docData.userType = "SuperAdmin";

  await docData.save();

  res.send("success");
});

module.exports = router;
