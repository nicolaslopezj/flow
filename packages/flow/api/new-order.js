import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {config} from './config';
import Payments from '../collections/payments';
import PaymentKeys from '../collections/keys';
import newOrderSchema from './new-order-schema';
import pack from './pack';

const getUrl = function(path, paymentId) {
  var full = path;
  if (!path.includes('http')) {
    full = `${config.baseUrl}${path}`;
  }
  if (full.includes('?')) {
    return `${full}&p=${paymentId}`;
  } else {
    return `${full}?p=${paymentId}`;
  }
}

export default newOrder = function (order) {
  check(order, newOrderSchema);
  const paymentId = Payments.insert({
    amount: order.amount,
    description: order.description,
    buyerEmail: order.buyerEmail,
    date: new Date(),
    meta: order.meta,
    status: 'pending',
  });

  if (order.key || order.storeEmail) {
    PaymentKeys.insert({
      paymentId,
      keyUsed: order.key,
      storeEmail: order.storeEmail,
    });
  }

  const data = {
    c: order.storeEmail || config.email,
    oc: paymentId,
    mp: order.paymentType,
    m: order.amount,
    o: order.description,
    ue: getUrl(order.successUrl, paymentId),
    uf: getUrl(order.failureUrl, paymentId),
    uc: config.baseUrl + 'flow-confirm-payment',
    ti: 'd',
    e: order.buyerEmail,
    v: 'kit_1_2',
  };
  const packed = pack(data, order.key);

  return { paymentId, pack: packed };
};
