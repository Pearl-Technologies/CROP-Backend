const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const allowRight = require('../controller/superAdminController/allowRight');
const {createSuperAdmin, superAdminLogin} = require('../controller/superAdminController/superAdmin');
const {createAdmin, getAllAdmin} = require("../controller/superAdminController/user");

router.post("/allowRight", [body("_id", "id is required").exists(), 
body('invoiceCycle', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('businessTier', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('customerTier', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('serviceRequest', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('complaint', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('orderRevocation', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('survayDesign', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('serviceChange', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('notifications', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('notificationsContent', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('pricing', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('subscription_frequencies', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('earnPoint_valuation', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('redeemPoint_valuation', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
body('massNotifications', "not a valid entry").custom(value=> value === 'E' || value === 'B' || value ==='V' || value ==='N'),
],
 allowRight);

 router.post("/createSuperAdmin", [body("name", "Name should be atleast 3 characters").isLength({ min: 3 }), body("email", "Enter a valid email").isEmail(), body("password", "Passowrd must be atleast 5 characters").isLength({ min: 5 })], createSuperAdmin);

router.post("/superAdminLogin", [body("email", "Enter a valid email").isEmail(), body("password", "Passowrd should not be blank").exists()], superAdminLogin);

router.post("/createAdmin", [body("name", "Name should be atleast 3 characters").isLength({ min: 3 }), body("email", "Enter a valid email").isEmail(), body("password", "Passowrd must be atleast 5 characters").isLength({ min: 5 }), body("c_password", "Passowrd must be atleast 5 characters").isLength({ min: 5 })], createAdmin);
router.post("/getAllAdmin", getAllAdmin);

module.exports = router;