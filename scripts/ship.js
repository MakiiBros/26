const { execSync } = require('child_process');

function run(cmd, desc) {
  console.log(`\n🚀 ${desc}...`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (err) {
    console.error(`❌ Error en: ${desc}`);
    return false;
  }
}

function getCommitMessage() {
  const args = process.argv.slice(2).join(' ').trim();
  if (args) return args;
  const now = new Date();
  return `deploy: actualización automática ${now.toISOString().replace('T', ' ').substring(0, 19)}`;
}

async function ship() {
  console.log('====================================================');
  console.log('📦 SUBIDA AUTOMÁTICA Y LIMPIA A GITHUB / VERCEL');
  console.log('====================================================');

  // 1. Verificar cambios pendientes
  const status = execSync('git status -s', { encoding: 'utf8' }).trim();
  
  if (!status) {
    console.log('ℹ️ No hay cambios pendientes por commitear.');
    console.log('🔄 Sincronizando con origin/main...');
    run('git pull origin main --rebase', 'Actualizando desde remoto');
    run('git push origin main', 'Verificando push a main');
    console.log('✅ Tu proyecto está 100% sincronizado con producción.');
    return;
  }

  console.log('📝 Archivos modificados detectados:');
  console.log(status);

  // 2. Compilar antes de subir para asegurar 0 errores
  console.log('\n🔍 Validando compilación con TypeScript y Next.js...');
  const buildSuccess = run('npm run build', 'Compilación de producción');
  if (!buildSuccess) {
    console.error('\n⛔ LA SUBIDA SE DETUVO: El build falló. Corrige los errores antes de desplegar para evitar romper Vercel.');
    process.exit(1);
  }

  // 3. Commit y Push a main directo (cero ramas divergentes)
  const message = getCommitMessage();
  const addSuccess = run('git add -A', 'Agregando cambios al commit');
  if (!addSuccess) process.exit(1);

  const commitSuccess = run(`git commit -m "${message}"`, 'Creando commit limpio');
  if (!commitSuccess) process.exit(1);

  // 4. Rebase seguro por si alguien subió algo antes
  run('git pull origin main --rebase', 'Sincronizando con origin/main');

  // 5. Push final a main
  const pushSuccess = run('git push origin main', 'Subiendo a origin/main para Vercel');
  if (!pushSuccess) {
    console.error('❌ Error al subir a GitHub. Verifica tu conexión.');
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log('🎉 ¡SUBIDA COMPLETADA CON ÉXITO!');
  console.log('• Rama: main (única fuente de verdad)');
  console.log('• Cero ramas secundarias ni conflictos');
  console.log('• Vercel está desplegando automáticamente en makibros.me');
  console.log('====================================================\n');
}

ship();

