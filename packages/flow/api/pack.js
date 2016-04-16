import {config} from './config';
import crypto from 'crypto';
import serialize from './serialize';

export default pack = function (data, key) {
  const serialized = serialize(data);
  const sign = crypto.createSign('RSA-SHA1');
  sign.write(serialized);
  sign.end();
  const signature = sign.sign(key || config.key, 'base64');
  return `${serialized}&s=${signature}`;
};
