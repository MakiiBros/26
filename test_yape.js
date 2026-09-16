const https = require('https');

const data = JSON.stringify({
  otp: "123456",
  phoneNumber: "970725307",
  email: "test@test.com",
  totalAmount: 15.00
});

const options = {
  hostname: 'api.mercadopago.com',
  port: 443,
  path: `/platforms/pci/yape/v1/payment?public_key=${process.env.MERCADO_PAGO_PUBLIC_KEY || ''}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let out = '';
  res.on('data', d => { out += d; });
  res.on('end', () => console.log(out));
});
req.write(data);
req.end();
