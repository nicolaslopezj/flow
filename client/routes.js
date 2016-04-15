FlowRouter.route('/', {
  action: function (params, queryParams) {
    BlazeLayout.render('home');
  },
});

FlowRouter.route('/success', {
  action: function (params, queryParams) {
    BlazeLayout.render('success');
  },
});

FlowRouter.route('/failure', {
  action: function (params, queryParams) {
    BlazeLayout.render('failure');
  },
});
