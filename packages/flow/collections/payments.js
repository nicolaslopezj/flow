export default Payments = new Mongo.Collection('flow_payments');

Payments.attachSchema({
  amount: {
    type: Number,
  },
  description: {
    type: String,
  },
  buyerEmail: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Email,
  },
  date: {
    type: Date,
    index: 1,
  },
  status: {
    type: String,
    allowedValues: ['pending', 'error', 'success'],
  },
  error: {
    type: String,
    optional: true,
  },
  meta: {
    type: Object,
    blackbox: true,
    optional: true,
  },
});
