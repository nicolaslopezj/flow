export default newOrderSchema = new SimpleSchema({
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
  paymentType: {
    type: Number,
    allowedValues: [1, 2, 9],
    optional: true,
  },
  successUrl: {
    type: String,
  },
  failureUrl: {
    type: String,
  },
  meta: {
    type: Object,
    blackbox: true,
    optional: true,
  },
});
