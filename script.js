const generateBtn = document.getElementById('generateBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const paletteDiv = document.getElementById('palette');
const paletteTypeSelect = document.getElementById('paletteType');
const copyNotification = document.getElementById('copyNotification');
const copyMessage = document.getElementById('copyMessage');
const loading = document.getElementById('loading');

let currentPalette = [];

// Color names mapping
const colorNames = {
  red: ['Crimson', 'Ruby', 'Cherry', 'Rose', 'Scarlet'],
  orange: ['Tangerine', 'Peach', 'Amber', 'Coral', 'Sunset'],
  yellow: ['Golden', 'Lemon', 'Canary', 'Sunshine', 'Butter'],
  green: ['Forest', 'Mint', 'Sage', 'Emerald', 'Lime'],
  blue: ['Ocean', 'Sky', 'Navy', 'Azure', 'Cerulean'],
  purple: ['Lavender', 'Violet', 'Plum', 'Orchid', 'Amethyst'],
  pink: ['Blush', 'Flamingo', 'Magenta', 'Fuchsia', 'Rose'],
  brown: ['Chocolate', 'Coffee', 'Walnut', 'Umber', 'Cinnamon'],
  teal: ['Aqua', 'Turquoise', 'Cyan', 'Jade', 'Peacock'],
  gray: ['Silver', 'Slate', 'Ash', 'Charcoal', 'Smoke'],
};

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getColorName(hex) {
  const hsl = hexToHsl(hex);
  const hue = hsl[0];
  const sat = hsl[1];
  const light = hsl[2];

  if (sat < 15 && light > 20 && light < 80) {
    return colorNames.gray[Math.floor(Math.random() * colorNames.gray.length)];
  }
  if (sat < 30 && light <= 20) {
    return colorNames.brown[
      Math.floor(Math.random() * colorNames.brown.length)
    ];
  }
  if (hue >= 0 && hue < 30)
    return colorNames.red[Math.floor(Math.random() * colorNames.red.length)];
  if (hue >= 30 && hue < 60)
    return colorNames.orange[
      Math.floor(Math.random() * colorNames.orange.length)
    ];
  if (hue >= 60 && hue < 120)
    return colorNames.yellow[
      Math.floor(Math.random() * colorNames.yellow.length)
    ];
  if (hue >= 120 && hue < 180) {
    if (sat > 30) {
      return colorNames.green[
        Math.floor(Math.random() * colorNames.green.length)
      ];
    } else {
      return colorNames.teal[
        Math.floor(Math.random() * colorNames.teal.length)
      ];
    }
  }
  if (hue >= 180 && hue < 210)
    return colorNames.teal[Math.floor(Math.random() * colorNames.teal.length)];
  if (hue >= 210 && hue < 240)
    return colorNames.blue[Math.floor(Math.random() * colorNames.blue.length)];
  if (hue >= 240 && hue < 300)
    return colorNames.purple[
      Math.floor(Math.random() * colorNames.purple.length)
    ];
  return colorNames.pink[Math.floor(Math.random() * colorNames.pink.length)];
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function generatePalette(type) {
  const baseHue = Math.floor(Math.random() * 360);
  let colors = [];

  switch (type) {
    case 'complementary':
      colors = [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 180) % 360, 70, 50),
        hslToHex(baseHue, 50, 70),
        hslToHex((baseHue + 180) % 360, 50, 70),
        hslToHex(baseHue, 80, 30),
      ];
      break;
    case 'analogous':
      colors = [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 30) % 360, 70, 50),
        hslToHex((baseHue + 60) % 360, 70, 50),
        hslToHex((baseHue - 30 + 360) % 360, 70, 50),
        hslToHex((baseHue - 60 + 360) % 360, 70, 50),
      ];
      break;
    case 'triadic':
      colors = [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 120) % 360, 70, 50),
        hslToHex((baseHue + 240) % 360, 70, 50),
        hslToHex(baseHue, 50, 70),
        hslToHex((baseHue + 120) % 360, 50, 70),
      ];
      break;
    case 'tetradic':
      colors = [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 90) % 360, 70, 50),
        hslToHex((baseHue + 180) % 360, 70, 50),
        hslToHex((baseHue + 270) % 360, 70, 50),
        hslToHex(baseHue, 50, 70),
      ];
      break;
    case 'split-complementary':
      colors = [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 150) % 360, 70, 50),
        hslToHex((baseHue + 210) % 360, 70, 50),
        hslToHex(baseHue, 50, 70),
        hslToHex((baseHue + 150) % 360, 50, 70),
      ];
      break;
    case 'shades':
      colors = [
        hslToHex(baseHue, 30, 15),
        hslToHex(baseHue, 40, 30),
        hslToHex(baseHue, 50, 45),
        hslToHex(baseHue, 60, 60),
        hslToHex(baseHue, 70, 75),
      ];
      break;
    case 'monochromatic':
      colors = [
        hslToHex(baseHue, 70, 20),
        hslToHex(baseHue, 70, 35),
        hslToHex(baseHue, 70, 50),
        hslToHex(baseHue, 70, 65),
        hslToHex(baseHue, 70, 80),
      ];
      break;
    case 'random':
    default:
      for (let i = 0; i < 5; i++) {
        const h = Math.floor(Math.random() * 360);
        const s = Math.floor(Math.random() * 50) + 50;
        const l = Math.floor(Math.random() * 40) + 30;
        colors.push(hslToHex(h, s, l));
      }
      break;
  }

  return colors;
}

function createColorCard(color) {
  const colorName = getColorName(color);

  const card = document.createElement('div');
  card.className = 'color-card';
  card.innerHTML = `
        <div class="color-preview" style="background-color: ${color}"></div>
        <div class="color-info">
            <div class="color-hex">${color.toUpperCase()}</div>
            <div class="color-name">${colorName}</div>
            <button class="copy-btn" onclick="copyColor('${color}')">
                <i class="fas fa-copy"></i> Copy
            </button>
        </div>
    `;

  card.addEventListener('click', (e) => {
    if (!e.target.closest('.copy-btn')) {
      copyColor(color);
    }
  });

  return card;
}

function showPalette(colors) {
  currentPalette = colors;
  paletteDiv.innerHTML = '';

  colors.forEach((color, index) => {
    const card = createColorCard(color);
    card.style.animationDelay = `${index * 0.1}s`;
    paletteDiv.appendChild(card);
  });

  setTimeout(() => {
    paletteDiv.classList.add('show');
  }, 100);
}

function copyColor(color) {
  navigator.clipboard.writeText(color).then(() => {
    copyMessage.textContent = `${color} copied!`;
    showNotification();
  });
}

function copyAllColors() {
  if (currentPalette.length === 0) return;

  const allColors = currentPalette.join(', ');
  navigator.clipboard.writeText(allColors).then(() => {
    copyMessage.textContent = 'All colors copied!';
    showNotification();
  });
}

function showNotification() {
  copyNotification.classList.add('show');
  setTimeout(() => {
    copyNotification.classList.remove('show');
  }, 2000);
}

function showLoading() {
  loading.classList.add('show');
  paletteDiv.classList.remove('show');
}

function hideLoading() {
  loading.classList.remove('show');
}

generateBtn.addEventListener('click', () => {
  showLoading();

  setTimeout(() => {
    const type = paletteTypeSelect.value;
    const colors = generatePalette(type);
    hideLoading();
    showPalette(colors);
  }, 500);
});

copyAllBtn.addEventListener('click', copyAllColors);

// Generate initial palette
window.addEventListener('load', () => {
  setTimeout(() => {
    const colors = generatePalette('monochromatic');
    showPalette(colors);
  }, 500);
});
