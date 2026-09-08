const fs = require('fs');
const file = 'src/app/api/process_payment/route.ts';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/const baseUrl = .*/, 'const baseUrl = "https://makibros-test.vercel.app";');
fs.writeFileSync(file, code);
