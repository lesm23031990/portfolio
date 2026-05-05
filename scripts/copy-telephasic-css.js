/**
 * Copia main.css de Proyecto Victoria al proyecto portfolio como telephasic.css
 * y comenta el @import de fontawesome para que no falle.
 * Ejecutar: node scripts/copy-telephasic-css.js
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(projectRoot, '..', 'Proyecto Victoria', 'assets', 'css', 'main.css');
const destPath = path.join(projectRoot, 'src', 'assets', 'styles', 'telephasic.css');

if (!fs.existsSync(sourcePath)) {
  console.error('No se encontró:', sourcePath);
  console.error('Asegúrate de que "Proyecto Victoria" esté en la misma carpeta que "portfolio".');
  process.exit(1);
}

let css = fs.readFileSync(sourcePath, 'utf8');
css = css.replace(
  /@import\s+url\s*\(\s*["']fontawesome-all\.min\.css["']\s*\)\s*;\s*\n/,
  '/* Font Awesome: opcional, agregar en index.html si necesitas iconos */\n'
);
fs.writeFileSync(destPath, css, 'utf8');
console.log('OK: telephasic.css creado en src/assets/styles/');
