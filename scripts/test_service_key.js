const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Leer manualmente el archivo .env.local
let SUPABASE_SERVICE_ROLE_KEY = '';
try {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const match = envFile.match(/SUPABASE_SERVICE_ROLE_KEY="(.*?)"/);
  if (match) {
    SUPABASE_SERVICE_ROLE_KEY = match[1];
  }
} catch (e) {
  console.error("Error leyendo .env.local", e);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://usxhvlchkuzmbrqkgpqn.supabase.co';

if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === 'tu_clave_service_role_aqui') {
  console.error("ERROR: No se encontró una clave Service Role válida.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testConnection() {
  console.log("Probando conexión a Supabase con Service Role Key...");
  
  const dummyOrder = {
    customer_name: "Test User",
    customer_phone: "123456789",
    customer_address: "Test Address",
    items: [],
    total_price: 0,
    payment_method: "cash",
    payment_status: "pending"
  };

  const { data, error } = await supabase
    .from('orders')
    .insert(dummyOrder)
    .select('id')
    .single();

  if (error) {
    console.error("❌ Error al insertar orden:");
    console.error(error);
    process.exit(1);
  }

  console.log("✅ ¡Inserción exitosa! La Service Role Key funciona y se salta el RLS. ID insertado:", data.id);

  const { error: deleteError } = await supabase
    .from('orders')
    .delete()
    .eq('id', data.id);

  if (!deleteError) {
    console.log("✅ Limpieza completada exitosamente.");
  }
}

testConnection();

