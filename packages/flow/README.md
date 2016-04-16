# Flow Meteor

Flow es una plataforma de pagos que te permite realizar pagos vía webpay.

## Instrucciones

```sh
meteor add nicolaslopezj:flow
```

### Obtener key

Para obtener la key debes entrar a https://www.flow.cl/app/web/misDatos.php y
hacer click en el boton descargar certificado.

Para el ambiente de pruebas debes entrar a http://flow.tuxpan.com/app/web/misDatos.php y
hacer click en el boton descargar certificado.

### Configurar

```js
import {setConfig} from 'meteor/nicolaslopezj:flow';

setConfig({
  baseUrl: 'http://myapp.com/',
  successUrl: 'http://myapp.com/success',
  failureUrl: 'http://myapp.com/failure',
  key: Assets.getText('comercio.pem'),
  publicKey: Assets.getText('flow.pubkey'),
  email: 'myemail@mail.com',
  confirm: myConfirmFunction,
  paymentTypes: 1,
});
```

- **baseUrl**: La url del sitio web. Se necesita para que flow confirme el pago.
En caso de estar en ambiente local, hay abrir los puertos desde el router y poner
la ip publica. Ej: ```http://190.161.223.246:3000```.

- **successUrl**: Url donde va a llegar el usuario cuando el pago se realice
correctamente.

- **failureUrl**: Url donde va a llegar el usuario cuando el pago tenga algun error.

- **key**: La privada llave que entrega flow a cada comercio. Si la guardas en la
carpeta ```private``` de la app puedes usar ```Assets.getText('comercio.pem')```
para obtenerla.

- **publicKey**: La privada publica de Flow.

```
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAx0BVTE0HmmtEDfKydMLF
YrfRsQPY6B8fYeNtl76GHLZyhSl3+MzYKdic9oJbvDm2Co9x6zNgUEzEA1RmjZ9H
yVS5mJEj0VRM2Ydx2kfG33bjmwsWSoasPNnCeIvApYZWRVsKICIVrH5wUqky3Jku
4grLynflGO0rYYC+mOcqbr+9/tJ/bDX0fFcNFHNz1xRcca32A/jZXd2N4W80vPrD
uUqy5uqaQEIX65EP1y/wmNaM6nK8WprgkX1Qi5xeN7ikaDEROiYLbZedz+FxqBOL
nvETvFAmDWFjQeb0+ppDoA3dZPW7oebnyLALGSJVmia+Ig3OsKFmf6F67ygN+4R/
gJESLyS92kvGpbJGSc130FKt2wmLhO0YmFNzNF4s01hHgigVuVG6OqNdYCtvNbQH
tIcBnUOUyma3Z0zKAH3lPW4nOljM9uNihG32UNlGeV9d/UmjqvVvLy5MbeEEsEw2
LqXH9cGZVjDxt+Qq5y2Mw2/v0E9v+7CyTkUxhU6iY0xXSpajFnoIAQpCY/NhPGQu
N9cFJxGY1EB7cVp8nZzZIWo7u9lsoEDqG93ugmqA/mFSsevn0qUTJinSbbxjiXyo
1hU4TLtGY9myYeljO5uoLn1Kps5950U/tilNh8LJALwVniJuO+E+CeQgLuD/lNAv
vlOeisrct5CChy8/+tfL5fcCAwEAAQ==
-----END PUBLIC KEY-----
```

- **email**: El email de la cuenta de flow.

- **confirm**: Una función que se llamará para que la aplicación verifique que el
pago esta correcto. Debe retornar ```true``` para que el pago se apruebe, si retorna
un string, este sera el mensaje de error.

- **paymentTypes**: Ingrese aquí el medio de pago, Solo Webpay = 1, Solo
Servipag = 2, Todos los medios de pago = 9;

### Crear nuevos pagos

```js
import {newOrder} from 'meteor/nicolaslopezj:flow';

Meteor.methods({
  createOrder: function ({ amount, description, buyerEmail }) {
    const order = newOrder({
      amount,
      description,
      buyerEmail,
      paymentType: 1,
      successUrl: 'success',
      failureUrl: 'failure',
      meta: {
        productId: 'myProductId',
      },
    });

    console.log('New payment generated', order.paymentId);
    return order.pack;
  },
});
```

### Confirmar pagos

```js
/**
 * El monto ya fue verificado al llamar esta funcion
 */
export default confirm = function (payment) {
  console.log('confirming payment', payment);

  // payment.meta.paymentId

  //return 'No products lefts';
  return true;
};
```

### Ejemplo

Este proyecto esta dentro de una aplicacion meteor que puedes usar para probar.
