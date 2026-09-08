const https = require('https');
const options = {
  hostname: 'api.mercadopago.com',
  port: 443,
  path: '/v1/card_tokens?public_key=APP_USR-a3aad7db-afac-4e07-8646-e27de28ddca2',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};
// I won't guess the Yape payload, I will try to find it in the SDK's source code
