export default PaymentKeys = new Mongo.Collection('flow_paymentkeys');

PaymentKeys.attachSchema({
  paymentId: {
    type: String,
  },
  keyUsed: {
    type: String,
  },
  storeEmail: {
    type: String,
  },
});
