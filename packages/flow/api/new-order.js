import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {config} from './config';
import Payments from '../collections/payments';
import newOrderSchema from './new-order-schema';
import pack from './pack';

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

  const packed = pack({
    c: config.email,
    oc: paymentId,
    mp: order.paymentType,
    m: order.amount,
    o: order.description,
    ue: order.successUrl,
    uf: order.failureUrl,
    uc: config.baseUrl + 'flow-confirm-payment',
    ti: 'd',
    e: order.buyerEmail,
    v: 'kit_1_2',
  }, order.key);

  return { paymentId, pack: packed };
};
