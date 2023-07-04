const vouchers = require("../../../models/admin/vouchers/evouchers");
const createVoucher = async (
    orderNumber,
    invoiceNumber,
    user,
) => {
    try {
        let newVoucher = await vouchers.create({
            orderNumber,
            invoiceNumber,
            user,
          });
        console.log("e-voucher created and saved");  
    } catch (error) {
        console.log(error);
    }
};
module.exports = {createVoucher}