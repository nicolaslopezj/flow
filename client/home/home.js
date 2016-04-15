Template.home.onRendered(function () {
  Session.set('pack', null);
});

Template.home.helpers({

  isTests() {
    return true;
  },

  getPack() {
    return Session.get('pack');
  },

  getSchema() {
    return new SimpleSchema({
      amount: {
        type: Number,
      },
      description: {
        type: String,
      },
      buyerEmail: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
      },
    });
  },

  getDefault() {
    return {
      amount: 1000,
      description: 'Testing',
      buyerEmail: 'nicolaslopezj@gmail.com',
    };
  },
});

AutoForm.hooks({
  newPaymentForm: {
    onSubmit: function (insertDoc) {
      Meteor.call('createOrder', insertDoc, (error, response) => {
        if (error) {
          this.done(error);
          console.log('Error', error);
        } else {
          Session.set('pack', response);
          this.done();
        }
      });
      return false;
    },
  },
});
