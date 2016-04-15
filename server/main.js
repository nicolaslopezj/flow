import { Meteor } from 'meteor/meteor';
import {setConfig} from 'meteor/nicolaslopezj:flow';
import confirm from './confirm';
import './new';

setConfig({
  successUrl: 'http://localhost:3000/success',
  failureUrl: 'http://localhost:3000/failure',
  key: Assets.getText('production.pem'),
  publicKey: Assets.getText('flow.pubkey'),
  email: 'nicolaslopezj@me.com',
  confirm: confirm,
  paymentTypes: 1,
  integrationType: 'd',
  baseUrl: 'http://190.161.223.246:3000/',
});
