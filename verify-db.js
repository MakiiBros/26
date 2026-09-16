const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://usxhvlchkuzmbrqkgpqn.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function verify() {
  try {
    const res = await fetch(`${url}/rest/v1/categories?select=*`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Base de datos conectada.');
      console.log(`✅ ${data.length} categorías encontradas:`, data.map(c => c.name).join(', '));
    } else {
      console.error('❌ Error HTTP:', res.status, await res.text());
    }
  } catch (e) {
    console.error('❌ Error de conexión:', e.message);
  }
}

verify();

