const { MercadoPagoConfig, Payment } = require('mercadopago');
// Use test credentials to avoid live credential errors
const client = new MercadoPagoConfig({ accessToken: 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000' });
console.log(Object.keys(client));
