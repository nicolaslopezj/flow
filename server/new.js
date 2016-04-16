import {newOrder} from 'meteor/nicolaslopezj:flow';

Meteor.methods({
  createOrder: function ({ amount, description, buyerEmail }) {
    const order = newOrder({
      amount,
      description,
      buyerEmail,
      paymentType: 1,
      successUrl: 'success',
      failureUrl: 'failure',
      meta: {
        productId: 'myProductId',
      },
    });

    console.log('New payment generated', order.paymentId);
    return order.pack;
  },
});
