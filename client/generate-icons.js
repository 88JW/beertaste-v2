const fs = require('fs');
const path = require('path');

// Tworzenie prostego PNG w base64 (szara ikona z "B")
function createSimpleIcon(size) {
  // Minimalna PNG z szarym tłem i białą literą B
  const canvas = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#9ca3af"/>
    <text x="50%" y="50%" font-size="${size * 0.6}" font-family="Arial" font-weight="bold" 
          fill="#ffffff" text-anchor="middle" dominant-baseline="central">B</text>
  </svg>`;
  return canvas;
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, 'public');

console.log('Generating PWA icons...');
sizes.forEach(size => {
  const svg = createSimpleIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(publicDir, filename), svg);
  console.log(`Created ${filename}`);
});

console.log('Done!');
