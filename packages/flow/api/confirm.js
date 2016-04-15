import qs from 'querystring';
import validate from './validate';
import Fiber from 'fibers';
import {config} from './config';

var post = Picker.filter(function (req, res) {
  return req.method == 'POST';
});

var input = `------------------------------3d7e7baffb2e
Content-Disposition: form-data; name="response"

status=EXITO&kpf_orden=test123&kpf_monto=1000.00&kpf_flow_order=8012&kpf_pagador=nicolaslopezj@gmail.com&s=mMlgzlEnde48ijJguvaH4bGE%2FB%2FXBzCIKc%2FM8aDe5r59BWdqj9v3StHk8B4%2B7gKXlCVuVtO9ZdE3tnaOzz9A5OZIzpDaui84%2BDiWvFX%2Bji6n4Jqh87CEYTaEki9VK%2FGGp0IEokF5LfGbYh3w4GopvIr1YDD9DEx2dcm8%2Fu5i%2BqqSPzC31fQ8bYcE4VBXX12cDIPel7yvh5zJESwHDBOS8HolW7Xroyqhn%2BLtA0RdPgZt%2FBm0kH%2BK9d5%2BHkaopcNWzILOmIjplezj9D8ZFOTBge%2BoY9HQUiDy4W%2BPuUvNDnvtfKaoVqwiI6Bbe80NAYCPpgi4BbrAK0BeCipVRnm6Jps4ZNJoOXj44LIbHwa%2BW9kfepe4JC82dWRygwo1IW8oHaH8svb1MJQmy3S5lS43HEqHsN0L1LOx264cDLAqHe64iPYDNZscUcB%2BE05KPj76O0dOPoYDTj0rwkdZ7csntro0aJED%2B6gXSBTt4CzSTRr1di%2FpH9BGNM%2FqXo%2F8lorJBOC0uxvEVgwPKoSWa3vD0mDt1PREptrzYYpfkCk8x6ncMBSPZNLvAvIE7WggOLxp0SKzLxn13UkjvA%2FXpAUAj7RyY%2FJ1iZUS7a0cys4vVyje8h9RkpHKxTb%2FAVV8GZnApCaNUrC3tYwhT%2BPY9iuNJPBUxsesVMo68O4viajDTdQ%3D
------------------------------3d7e7baffb2e--`;

post.route('/flow-confirm-payment', function (params, request, response, next) {

  var body = '';
  request.on('data', function (chunk) {
    body += chunk;
  });

  request.on('end', function () {
    Fiber(function () {
      const error = getError(body.split('\n')[3]);
      const data = {
        status: error ? 'RECHAZADO' : 'ACEPTADO',
        c: config.email,
      };
      const packed = pack(data);
      response.end(packed);
    }).run();
  });
});

const getError = function (input) {
  const data = qs.parse(input);
  var error = null;
  const payment = Payments.findOne(data.kpf_orden);
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
