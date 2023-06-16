const vouchers = require("../../../models/admin/vouchers/evouchers");
const createVoucher = async (
    image,
    orderNumber,
    code,
    invoiceNumber,
    user,
) => {
    try {
        let newVoucher = await vouchers.create({
            image,
            orderNumber,
            code,
            invoiceNumber,
            user,
          });
        console.log("e-voucher created and saved");  
    } catch (error) {
        console.log(error);
    }
};
module.exports = {createVoucher}