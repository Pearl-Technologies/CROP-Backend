const mongoose = require("mongoose");
//1-customer
//2-business
//3-admin
//4-superadmin

const AccountNotificationCustomerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users_customers",
  },
  message: { type: String, require: true },
  owner_account: { type: Number, require: true, default: 1 },
  web_push: { type: Number, require: true, default: 1 },
  android_push: { type: Number, require: true, default: 1 },
  ios_push: { type: Number, require: true, default: 1 },
  notification_status: { type: Number, require: true, default: 1 },
  status: { type: Boolean, required: true, default: true },
},{
  timestamps: true
});

const GeneralNotificationCustomerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users_customers",
  },
  message: { type: String, require: true },
  owner_account: { type: Number, require: true, default: 1 },
  web_push: { type: Number, require: true, default: 1 },
  android_push: { type: Number, require: true, default: 1 },
  ios_push: { type: Number, require: true, default: 1 },
  notification_status: { type: Number, require: true, default: 1 },
  status: { type: Boolean, required: true, default: true },
},{
  timestamps: true
});

const InvoicePaymentNotificationCustomerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users_customers",
  },
  message: { type: String, require: true },
  owner_account: { type: Number, require: true, default: 1 },
  web_push: { type: Number, require: true, default: 1 },
  android_push: { type: Number, require: true, default: 1 },
  ios_push: { type: Number, require: true, default: 1 },
  notification_status: { type: Number, require: true, default: 1 },
  status: { type: Boolean, required: true, default: true },
},{
  timestamps: true
});

const ComplainNotificationCustomerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users_customers",
  },
  message: { type: String, require: true },
  owner_account: { type: Number, require: true, default: 1 },
  web_push: { type: Number, require: true, default: 1 },
  android_push: { type: Number, require: true, default: 1 },
  ios_push: { type: Number, require: true, default: 1 },
  notification_status: { type: Number, require: true, default: 1 },
  status: { type: Boolean, required: true, default: true },
},{
  timestamps: true
});

const AccountNotificationCustomer = mongoose.model(
  "account_notification_customer",
  AccountNotificationCustomerSchema
);
const GeneralNotificationCustomer = mongoose.model(
  "general_notification_customer",
  GeneralNotificationCustomerSchema
);
const InvoicePaymentNotificationCustomer = mongoose.model(
  "invoice_payment_notification_customer",
  InvoicePaymentNotificationCustomerSchema
);
const ComplainNotificationCustomer = mongoose.model(
  "complain_notification_customer",
  ComplainNotificationCustomerSchema
);

module.exports = {
  AccountNotificationCustomer,
  GeneralNotificationCustomer,
  InvoicePaymentNotificationCustomer,
  ComplainNotificationCustomer,
};
