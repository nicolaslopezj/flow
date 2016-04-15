export var config = {
  successUrl: 'http://www.comercio.cl/kpf/exito.php',
  failureUrl: 'http://www.comercio.cl/kpf/fracaso.php',
  paymentUrl: 'http://flow.tuxpan.com/app/kpf/pago.php',
  key: '',
  publicKey: '',
  email: 'emailflow@comercio.com',
  paymentTypes: 1,
  integrationType: 'd',
  baseUrl: 'http://190.161.223.246:3000/',
};

export const setConfig = function (newConfig) {
  return config = _.extend(config, newConfig);
};;
