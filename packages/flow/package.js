Package.describe({
  name: 'nicolaslopezj:flow',
  version: '0.1.7',
  summary: 'Flow payments for Meteor',
  git: '',
  documentation: 'README.md',
});

Npm.depends({
  'body-parser': '1.15.0',
  multiparty: '4.1.2',
});

Package.onUse(function (api) {
  api.versionsFrom('1.3.1');

  api.use('ecmascript');
  api.use('mongo');
  api.use('check');
  api.use('mdg:validated-method@1.0.2');
  api.use('aldeed:simple-schema@1.5.3');
  api.use('aldeed:collection2@2.9.1');
  api.use('meteorhacks:picker@1.0.3');

  api.mainModule('main_client.js', 'client');
  api.mainModule('main_server.js', 'server');
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('nicolaslopezj:flow');

  //api.mainModule('flow-tests.js');
});
