import crypto from 'crypto';
import {config} from './config';
import serialize from './serialize';

export default validate = function (raw, signature) {
  const verify = crypto.createVerify('RSA-SHA1');
  verify.write(raw);
  verify.end();
  return verify.verify(config.publicKey, signature, 'base64');
};
