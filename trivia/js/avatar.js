// Avatar builder: a player's look is a small set of choices, drawn as an SVG
// portrait (head and shoulders) with soft shading so it reads as a person.
(function () {
  // Objects a player can hold up next to their portrait.
  var ITEMS = [
    ['none', 'Nothing', ''],
    ['stethoscope', 'Stethoscope', '🩺'], ['syringe', 'Syringe', '💉'], ['pill', 'Pill', '💊'], ['medal', 'Military medal', '🎖️'],
    ['shield', 'Shield', '🛡️'], ['dagger', 'Dagger', '🗡️'], ['anchor', 'Anchor', '⚓'], ['compass', 'Compass', '🧭'],
    ['map', 'Map', '🗺️'], ['globe', 'Globe', '🌎'], ['books', 'Books', '📚'], ['pencil', 'Pencil', '✏️'],
    ['test-tube', 'Test tube', '🧪'], ['microscope', 'Microscope', '🔬'], ['telescope', 'Telescope', '🔭'], ['magnet', 'Magnet', '🧲'],
    ['lightbulb', 'Light bulb', '💡'], ['trophy', 'Trophy', '🏆'], ['football', 'Football', '🏈'], ['basketball', 'Basketball', '🏀'],
    ['baseball', 'Baseball', '⚾'], ['soccer', 'Soccer ball', '⚽'], ['golf', 'Golf flag', '⛳'], ['fishing', 'Fishing pole', '🎣'],
    ['guitar', 'Guitar', '🎸'], ['microphone', 'Microphone', '🎤'], ['headphones', 'Headphones', '🎧'], ['camera', 'Camera', '📷'],
    ['popcorn', 'Popcorn', '🍿'], ['clapper', 'Clapperboard', '🎬'], ['controller', 'Game controller', '🎮'], ['dice', 'Dice', '🎲'],
    ['coffee', 'Coffee', '☕'], ['beer', 'Beer', '🍺'], ['wine', 'Wine', '🍷'], ['pizza', 'Pizza', '🍕'],
    ['taco', 'Taco', '🌮'], ['burger', 'Burger', '🍔'], ['donut', 'Donut', '🍩'], ['cake', 'Birthday cake', '🎂'],
    ['car', 'Car', '🚗'], ['pickup', 'Pickup truck', '🛻'], ['motorcycle', 'Motorcycle', '🏍️'], ['wrench', 'Wrench', '🔧'],
    ['rocket', 'Rocket', '🚀'], ['airplane', 'Airplane', '✈️'], ['dog', 'Dog', '🐕'], ['cat', 'Cat', '🐈'],
    ['parrot', 'Parrot', '🦜'], ['rose', 'Rose', '🌹'], ['crown', 'Crown', '👑'], ['gem', 'Diamond', '💎'],
    ['money', 'Money bag', '💰'], ['fire', 'Fire', '🔥']
  ];

  var OPTIONS = {
    skin: ['#f6d7c3', '#eab794', '#d39a6a', '#a86b44', '#7a4a2c', '#4b2e1d'],
    eyes: ['#5b3a1e', '#8a6a2f', '#3f6f9e', '#4f7a4a', '#6f7478', '#1f1a17'],
    hair: ['none', 'buzz', 'short', 'curly', 'long', 'bun'],
    hairColor: ['#1f1a17', '#4a2f1e', '#8a5a2b', '#c99a4b', '#b7b2a8', '#a33a2a'],
    face: ['smile', 'grin', 'smirk', 'focused'],
    glasses: ['none', 'round', 'square', 'aviators', 'goggles'],
    hat: ['none', 'beret', 'scrub cap', 'ball cap', 'headset'],
    shirt: ['#56702a', '#16807f', '#2c67ad', '#b3322f', '#34427a', '#1a1e18'],
    bg: ['military', 'nursing', 'science', 'pop', 'sports', 'geo', 'politics', 'ushistory', 'worldhistory', 'philosophy', 'film', 'lit', 'auto'],
    item: ITEMS.map(function (i) { return i[0]; }),
    // 'person', or any object from the list with a face, hair and hats on it.
    body: ['person'].concat(ITEMS.slice(1).map(function (i) { return i[0]; }))
  };

  var LABELS = { body: 'Avatar is', skin: 'Skin tone', eyes: 'Eye color', hair: 'Hair', hairColor: 'Hair color', face: 'Expression',
    glasses: 'Glasses', hat: 'Headwear', shirt: 'Shirt', bg: 'Background', item: 'Holding' };

  var DEFAULT = { body: 'person', skin: '#d39a6a', eyes: '#5b3a1e', hair: 'short', hairColor: '#1f1a17', face: 'smile', glasses: 'none', hat: 'none',
    shirt: '#56702a', bg: 'military', item: 'none' };

  var ITEM_BY_ID = {};
  ITEMS.forEach(function (i) { ITEM_BY_ID[i[0]] = { id: i[0], name: i[1], emoji: i[2] }; });

  function normalize(a) {
    var out = {};
    Object.keys(DEFAULT).forEach(function (k) {
      out[k] = a && OPTIONS[k].indexOf(a[k]) !== -1 ? a[k] : DEFAULT[k];
    });
    return out;
  }

  // A friendly default based on the name, so everyone starts looking different.
  function forName(name) {
    var h = 0;
    for (var i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    var pick = function (k, salt) { var list = OPTIONS[k]; return list[(h >>> salt) % list.length]; };
    return { body: 'person', glasses: 'none', skin: pick('skin', 1), eyes: pick('eyes', 3), hair: pick('hair', 5), hairColor: pick('hairColor', 8), face: pick('face', 11),
      hat: 'none', shirt: pick('shirt', 14), bg: pick('bg', 17), item: 'none' };
  }

  // Mixes a hex color toward black (amt < 0) or white (amt > 0).
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    var mix = function (c) { return Math.round(c + (t - c) * p); };
    return '#' + ((1 << 24) + (mix(r) << 16) + (mix(g) << 8) + mix(b)).toString(16).slice(1);
  }

  // Hair drawn behind the head (only long hair and buns reach back there).
  function hairBack(style, c, id) {
    var fill = 'url(#' + id + '-hair)';
    if (style === 'long') return '<path d="M35 52 C33 30 45 18 60 18 C76 18 87 30 85 52 C86 70 88 86 90 100 C82 104 74 102 70 96 L50 96 C46 102 38 104 30 100 C32 86 34 70 35 52Z" fill="' + fill + '"/>';
    if (style === 'bun') return '<ellipse cx="60" cy="17" rx="11" ry="9.5" fill="' + fill + '"/><path d="M52 19 Q60 23 68 19" stroke="' + shade(c, -0.35) + '" stroke-width="1.2" fill="none"/>';
    if (style === 'curly') return '<g fill="' + fill + '"><circle cx="38" cy="58" r="7"/><circle cx="82" cy="58" r="7"/><circle cx="37" cy="68" r="6"/><circle cx="83" cy="68" r="6"/></g>';
    return '';
  }

  // Hair over the scalp and hairline.
  function hairFront(style, c, id) {
    var fill = 'url(#' + id + '-hair)';
    var dark = shade(c, -0.35);
    switch (style) {
      case 'buzz':
        return '<path d="M40 50 C39 32 49 24 60 24 C71 24 81 32 80 50 C78 42 72 36 60 35 C48 36 42 42 40 50Z" fill="' + c + '" opacity="0.82"/>';
      case 'short':
        return '<path d="M38 52 C35 31 46 20 61 20 C76 20 86 30 82 52 C81 44 78 38 73 35 C66 39 54 39 46 36 C42 40 39 46 38 52Z" fill="' + fill + '"/>' +
          '<path d="M52 24 Q62 22 72 27" stroke="' + shade(c, 0.25) + '" stroke-width="1.4" fill="none" opacity="0.6"/>';
      case 'curly':
        var curls = [[42, 38, 7], [48, 29, 8], [58, 24, 8.5], [69, 25, 8], [77, 32, 7.5], [81, 42, 6.5], [39, 47, 6], [52, 33, 6], [65, 32, 6]];
        return '<g fill="' + fill + '">' + curls.map(function (k) { return '<circle cx="' + k[0] + '" cy="' + k[1] + '" r="' + k[2] + '"/>'; }).join('') + '</g>' +
          '<g fill="none" stroke="' + dark + '" stroke-width="1" opacity="0.5">' +
          curls.slice(0, 6).map(function (k) { return '<path d="M' + (k[0] - 3) + ' ' + k[1] + ' q3 -4 6 0"/>'; }).join('') + '</g>';
      case 'long':
        return '<path d="M38 54 C36 30 47 20 61 20 C76 20 85 31 82 54 C79 42 74 34 64 32 C58 40 47 42 41 42 C39 46 38 50 38 54Z" fill="' + fill + '"/>' +
          '<path d="M64 32 C60 38 54 41 47 42" stroke="' + dark + '" stroke-width="1" fill="none" opacity="0.5"/>';
      case 'bun':
        return '<path d="M39 50 C38 31 48 23 60 23 C72 23 82 31 81 50 C79 41 72 35 60 34 C48 35 41 41 39 50Z" fill="' + fill + '"/>';
      case 'object':
        return '';
      default:
        return '<ellipse cx="54" cy="31" rx="7" ry="3" fill="#ffffff" opacity="0.18"/>';
    }
  }

  function hatSvg(style) {
    switch (style) {
      case 'beret':
        return '<path d="M36 40 C34 26 50 16 66 18 C80 20 88 28 84 36 C72 32 52 34 36 40Z" fill="#2f3b1c"/>' +
          '<path d="M36 40 C52 34 72 32 84 36" stroke="#1c2410" stroke-width="2.4" fill="none"/>' +
          '<circle cx="45" cy="33" r="3.6" fill="#d9a647" stroke="#8a6a1c" stroke-width="0.8"/>';
      case 'scrub cap':
        return '<path d="M38 44 C37 26 48 19 60 19 C72 19 83 26 82 44 C70 39 50 39 38 44Z" fill="#3aa7b8"/>' +
          '<path d="M38 44 C50 39 70 39 82 44" stroke="#2a8494" stroke-width="2.6" fill="none"/>' +
          '<g fill="#ffffff" opacity="0.55"><circle cx="50" cy="28" r="1.4"/><circle cx="60" cy="25" r="1.4"/><circle cx="70" cy="28" r="1.4"/><circle cx="55" cy="34" r="1.4"/><circle cx="66" cy="34" r="1.4"/></g>';
      case 'ball cap':
        return '<path d="M38 44 C37 25 48 18 60 18 C72 18 83 25 82 44Z" fill="#b3322f"/>' +
          '<path d="M60 18 L60 44" stroke="#8e2522" stroke-width="0.8"/><circle cx="60" cy="19" r="1.8" fill="#8e2522"/>' +
          '<path d="M38 44 C50 40 70 40 82 44 C88 45 96 47 98 50 C84 50 60 49 38 47Z" fill="#8e2522"/>';
      case 'headset':
        return '<path d="M37 56 C35 28 46 18 60 18 C74 18 85 28 83 56" stroke="#1a1e18" stroke-width="3.4" fill="none"/>' +
          '<rect x="32" y="48" width="9" height="15" rx="4" fill="#1a1e18"/><rect x="79" y="48" width="9" height="15" rx="4" fill="#1a1e18"/>' +
          '<path d="M36 62 C38 72 46 76 54 75" stroke="#1a1e18" stroke-width="1.8" fill="none"/><circle cx="55" cy="75" r="2.4" fill="#1a1e18"/>';
      default:
        return '';
    }
  }

  function eyesSvg(face, iris) {
    var squint = face === 'grin' ? 0.8 : face === 'focused' ? 0.85 : 1;
    var one = function (cx) {
      return '<ellipse cx="' + cx + '" cy="54" rx="5" ry="' + (3.3 * squint) + '" fill="#fbfaf7"/>' +
        '<circle cx="' + cx + '" cy="54" r="2.5" fill="' + iris + '"/>' +
        '<circle cx="' + cx + '" cy="54" r="1.15" fill="#111"/>' +
        '<circle cx="' + (cx + 0.9) + '" cy="53.1" r="0.6" fill="#fff"/>' +
        '<path d="M' + (cx - 5.4) + ' 54 Q' + cx + ' ' + (50.2 + (1 - squint) * 3) + ' ' + (cx + 5.4) + ' 54" stroke="#2a1d16" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
    };
    return one(50) + one(70);
  }

  function browSvg(face, hairColor) {
    var d = face === 'focused'
      ? ['M44 47 Q50 45.5 56 48', 'M64 48 Q70 45.5 76 47']
      : face === 'smirk'
        ? ['M44 46.5 Q50 44 56 46', 'M64 44.5 Q70 41.5 76 44']
        : ['M44 46.5 Q50 43.5 56 46', 'M64 46 Q70 43.5 76 46.5'];
    return '<g stroke="' + shade(hairColor, 0.05) + '" stroke-width="2.2" fill="none" stroke-linecap="round">' +
      '<path d="' + d[0] + '"/><path d="' + d[1] + '"/></g>';
  }

  function glassesSvg(style) {
    var frame = '#1f1a17';
    switch (style) {
      case 'round':
        return '<g fill="#ffffff" fill-opacity="0.12" stroke="' + frame + '" stroke-width="1.6">' +
          '<circle cx="50" cy="54" r="6.6"/><circle cx="70" cy="54" r="6.6"/></g>' +
          '<path d="M56.6 53.5 Q60 51.5 63.4 53.5 M43.4 53 L39 51.5 M76.6 53 L81 51.5" stroke="' + frame + '" stroke-width="1.4" fill="none"/>';
      case 'square':
        return '<g fill="#ffffff" fill-opacity="0.12" stroke="' + frame + '" stroke-width="2">' +
          '<rect x="42.5" y="48.5" width="15" height="11" rx="2.5"/><rect x="62.5" y="48.5" width="15" height="11" rx="2.5"/></g>' +
          '<path d="M57.5 53 L62.5 53 M42.5 52 L39 51 M77.5 52 L81 51" stroke="' + frame + '" stroke-width="1.8" fill="none"/>';
      case 'aviators':
        return '<g fill="#2a2f36" fill-opacity="0.88" stroke="#b8963c" stroke-width="1.2">' +
          '<path d="M42 50 L57.5 50 Q58 58 52 61 Q43 61 42 50Z"/><path d="M62.5 50 L78 50 Q77 61 68 61 Q62 58 62.5 50Z"/></g>' +
          '<path d="M57.5 50.5 Q60 49 62.5 50.5 M42 50.5 L39 50 M78 50.5 L81 50" stroke="#b8963c" stroke-width="1.2" fill="none"/>' +
          '<path d="M45 52 L49 52" stroke="#ffffff" stroke-width="1" opacity="0.5"/>';
      case 'goggles':
        return '<path d="M36 52 L84 52" stroke="#3a3f46" stroke-width="4"/>' +
          '<g fill="#bfe6ff" fill-opacity="0.55" stroke="#3a3f46" stroke-width="2.2">' +
          '<rect x="41" y="47" width="17" height="13" rx="5"/><rect x="62" y="47" width="17" height="13" rx="5"/></g>';
      default:
        return '';
    }
  }

  function mouthSvg(face, skin) {
    var lip = shade(skin, -0.28);
    switch (face) {
      case 'grin':
        return '<path d="M50 69.5 Q60 80 70 69.5 Q60 72 50 69.5Z" fill="#5e2424"/>' +
          '<path d="M52 70.3 Q60 72.6 68 70.3 L67 72.6 Q60 74.3 53 72.6Z" fill="#fbfaf7"/>' +
          '<path d="M50 69.5 Q60 80 70 69.5" stroke="' + lip + '" stroke-width="1.3" fill="none"/>';
      case 'smirk':
        return '<path d="M52 72 Q60 73.5 68 68.5 Q61 75.5 52 72Z" fill="' + lip + '"/>';
      case 'focused':
        return '<path d="M52 71.5 Q60 72.6 68 71.5 Q60 74.2 52 71.5Z" fill="' + lip + '"/>';
      default:
        return '<path d="M51 70 Q60 76.5 69 70 Q60 73.5 51 70Z" fill="' + lip + '"/>' +
          '<path d="M53 70.4 Q60 72.4 67 70.4" stroke="' + shade(skin, -0.4) + '" stroke-width="0.8" fill="none"/>';
    }
  }

  // An object as the avatar: the emoji is the head, with the same eyes,
  // mouth, hair, glasses and hat placed on top. Silly on purpose.
  function objectBody(a, id) {
    var obj = ITEM_BY_ID[a.body];
    // Hair and hats are drawn for a head about 40 wide; stretch them to fit.
    var fit = function (inner) { return '<g transform="translate(60 44) scale(1.3 1.15) translate(-60 -44)">' + inner + '</g>'; };
    return fit(hairBack(a.hair, a.hairColor, id)) +
      '<text x="60" y="68" text-anchor="middle" dominant-baseline="central" font-size="74">' + obj.emoji + '</text>' +
      '<g transform="translate(60 62) scale(1.15) translate(-60 -60)">' +
        browSvg(a.face, a.hairColor) +
        eyesSvg(a.face, a.eyes) +
        mouthSvg(a.face, '#b0564a') +
        glassesSvg(a.glasses) +
      '</g>' +
      fit(hairFront(a.hair === 'none' ? 'object' : a.hair, a.hairColor, id) + hatSvg(a.hat));
  }

  var uid = 0;

  // The background comes from the page's category tokens so it follows the theme.
  function svg(a, size, label) {
    a = normalize(a);
    var s = size || 64;
    var id = 'av' + (++uid);
    var skin = a.skin;
    var item = ITEM_BY_ID[a.item];
    var name = label ? String(label).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;') : '';
    return '<svg class="avatar" data-cat="' + a.bg + '" width="' + s + '" height="' + s + '" viewBox="0 0 120 120" role="img" aria-label="' +
      (name ? name + '\'s avatar' : 'Avatar') + (a.body !== 'person' ? ', a ' + ITEM_BY_ID[a.body].name.toLowerCase() + ' with a face' : '') + (item && item.emoji ? ', holding a ' + item.name.toLowerCase() : '') + '">' +
      '<defs>' +
        '<clipPath id="' + id + '-clip"><circle cx="60" cy="60" r="60"/></clipPath>' +
        '<radialGradient id="' + id + '-face" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="' + shade(skin, 0.1) + '"/><stop offset="0.7" stop-color="' + skin + '"/><stop offset="1" stop-color="' + shade(skin, -0.18) + '"/></radialGradient>' +
        '<linearGradient id="' + id + '-hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + shade(a.hairColor, 0.18) + '"/><stop offset="1" stop-color="' + shade(a.hairColor, -0.15) + '"/></linearGradient>' +
        '<linearGradient id="' + id + '-shirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + shade(a.shirt, 0.12) + '"/><stop offset="1" stop-color="' + shade(a.shirt, -0.22) + '"/></linearGradient>' +
        '<radialGradient id="' + id + '-bg" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/><stop offset="1" stop-color="#000000" stop-opacity="0.12"/></radialGradient>' +
      '</defs>' +
      '<g clip-path="url(#' + id + '-clip)">' +
        '<circle cx="60" cy="60" r="60" class="avatar-bg"/>' +
        '<circle cx="60" cy="60" r="60" fill="url(#' + id + '-bg)"/>' +
        (a.body !== 'person' ? objectBody(a, id) :
        hairBack(a.hair, a.hairColor, id) +
        // neck and shoulders
        '<path d="M52 72 L52 90 Q60 95 68 90 L68 72Z" fill="' + shade(skin, -0.12) + '"/>' +
        '<path d="M52 80 Q60 86 68 80 L68 84 Q60 90 52 84Z" fill="' + shade(skin, -0.25) + '" opacity="0.5"/>' +
        '<path d="M14 124 C16 102 32 93 50 89 Q60 97 70 89 C88 93 104 102 106 124Z" fill="url(#' + id + '-shirt)"/>' +
        '<path d="M50 89 L60 101 L70 89" fill="' + shade(skin, -0.08) + '"/>' +
        '<path d="M50 89 L60 101 L70 89" stroke="' + shade(a.shirt, -0.35) + '" stroke-width="1.6" fill="none" stroke-linejoin="round"/>' +
        // ears
        '<ellipse cx="40" cy="56" rx="4.3" ry="7" fill="' + shade(skin, -0.08) + '"/>' +
        '<ellipse cx="80" cy="56" rx="4.3" ry="7" fill="' + shade(skin, -0.08) + '"/>' +
        '<path d="M39.5 52 Q37.5 56 40 60" stroke="' + shade(skin, -0.3) + '" stroke-width="1" fill="none"/>' +
        '<path d="M80.5 52 Q82.5 56 80 60" stroke="' + shade(skin, -0.3) + '" stroke-width="1" fill="none"/>' +
        // face
        '<path d="M40 50 C40 32 49 25 60 25 C71 25 80 32 80 50 C80 63 77 72 70 78 C65 82 55 82 50 78 C43 72 40 63 40 50Z" fill="url(#' + id + '-face)"/>' +
        '<ellipse cx="48" cy="63" rx="4.5" ry="2.6" fill="#e2766b" opacity="0.18"/>' +
        '<ellipse cx="72" cy="63" rx="4.5" ry="2.6" fill="#e2766b" opacity="0.18"/>' +
        browSvg(a.face, a.hairColor) +
        eyesSvg(a.face, a.eyes) +
        // nose
        '<path d="M60.5 55 Q59.5 61 57 64.2 Q60 66 63 64.2" stroke="' + shade(skin, -0.32) + '" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<ellipse cx="60" cy="63.2" rx="3.2" ry="1.6" fill="' + shade(skin, 0.14) + '" opacity="0.4"/>' +
        mouthSvg(a.face, skin) +
        hairFront(a.hair, a.hairColor, id) +
        glassesSvg(a.glasses) +
        hatSvg(a.hat)) +
      '</g>' +
      (item && item.emoji
        ? '<circle cx="98" cy="98" r="18" class="avatar-item-bg"/><text x="98" y="99" text-anchor="middle" dominant-baseline="central" font-size="21">' + item.emoji + '</text>'
        : '') +
      '</svg>';
  }

  window.TriviaAvatar = {
    ORDER: ['body', 'skin', 'eyes', 'hair', 'hairColor', 'face', 'glasses', 'hat', 'shirt', 'bg', 'item'],
    OPTIONS: OPTIONS, LABELS: LABELS, DEFAULT: DEFAULT, ITEMS: ITEM_BY_ID,
    normalize: normalize, forName: forName, svg: svg
  };
})();
