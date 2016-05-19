import qs from 'querystring';
import validate from './validate';
import Fiber from 'fibers';
import {config} from './config';

var post = Picker.filter(function (req, res) {
  return req.method == 'POST';
});

post.route('/flow-confirm-payment', function (params, request, response, next) {

  var body = '';
  request.on('data', function (chunk) {
    body += chunk;
  });

  request.on('end', function () {
    Fiber(function () {
      const query = qs.parse(body.split('\n')[3]);
      const payment = Payments.findOne(query.kpf_orden);
      if (!payment) {
        console.log('payment not found');
        return response.end('payment not found');
      }
      const error = getError(body.split('\n')[3], query, payment);
      const data = { status: error ? 'RECHAZADO' : 'ACEPTADO' };

      const paymentKey = PaymentKeys.findOne({ paymentId: payment._id });
      const key = paymentKey ? paymentKey.keyUsed : config.key;
      data.c = paymentKey ? paymentKey.storeEmail : config.email;

      const packed = pack(data, key);
      response.end(packed);
    }).run();
  });
});

const getError = function (input, data, payment) {
  var error = null;
  if (!payment) return 'Payment not found';
  if (!data.status) {
    error = 'Invalid response status';
  } else if (!data.s) {
    error = 'Invalid response (no signature)';
  } else if (!data.kpf_orden) {
    error = 'Invalid response Orden number';
  } else if (!data.kpf_monto) {
    error = 'Invalid response Amount';
  } else if (!validate(input.split('&s=')[0], data.s)) {
    error = 'Invalid signature from Flow';
  } else if (data.status == 'ERROR') {
    error = data.kpf_error;
  } else if (payment.amount !== Number(data.kpf_monto)) {
    error = 'Invalid amount';
  } else {
    try {
      const appResponse = config.confirm(payment);
      if (_.isString(appResponse)) {
        error = appResponse;
      } else if (appResponse !== true) {
        error = 'App declined payment';
      }
    } catch (e) {
      console.log('Error', e);
      error = 'App error confirming payment';
    }
  }

  if (error) {
    Payments.update(payment._id, { $set: { status: 'error', error } });
    return error;
  } else {
    Payments.update(payment._id, { $set: { status: 'success' } });
  }
};
