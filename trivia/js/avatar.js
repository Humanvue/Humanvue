// Avatar builder: a player's look is a small set of choices, drawn as SVG.
(function () {
  var OPTIONS = {
    skin: ['#f6d7c3', '#eab794', '#d39a6a', '#a86b44', '#7a4a2c', '#4b2e1d'],
    hair: ['none', 'buzz', 'short', 'curly', 'long', 'bun'],
    hairColor: ['#1f1a17', '#4a2f1e', '#8a5a2b', '#c99a4b', '#b7b2a8', '#a33a2a'],
    face: ['smile', 'grin', 'smirk', 'focused'],
    hat: ['none', 'beret', 'scrub cap', 'ball cap', 'headset'],
    shirt: ['#56702a', '#16807f', '#2c67ad', '#b3322f', '#34427a', '#1a1e18'],
    bg: ['military', 'nursing', 'science', 'pop', 'sports', 'geo', 'politics', 'ushistory', 'worldhistory', 'philosophy', 'film', 'lit', 'auto']
  };

  var LABELS = { skin: 'Skin tone', hair: 'Hair', hairColor: 'Hair color', face: 'Expression', hat: 'Headwear', shirt: 'Shirt', bg: 'Background' };

  var DEFAULT = { skin: '#d39a6a', hair: 'short', hairColor: '#1f1a17', face: 'smile', hat: 'none', shirt: '#56702a', bg: 'military' };

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
    return { skin: pick('skin', 1), hair: pick('hair', 4), hairColor: pick('hairColor', 7), face: pick('face', 10),
      hat: 'none', shirt: pick('shirt', 13), bg: pick('bg', 16) };
  }

  function hairSvg(style, c) {
    switch (style) {
      case 'buzz': return '<path d="M34 50 Q36 26 60 24 Q84 26 86 50 Q80 38 60 36 Q40 38 34 50Z" fill="' + c + '" opacity="0.85"/>';
      case 'short': return '<path d="M32 54 Q30 22 60 20 Q92 22 88 54 Q84 36 70 34 Q56 42 40 38 Q34 44 32 54Z" fill="' + c + '"/>';
      case 'curly': return '<g fill="' + c + '"><circle cx="38" cy="40" r="10"/><circle cx="50" cy="28" r="11"/><circle cx="66" cy="26" r="11"/><circle cx="80" cy="36" r="10"/><circle cx="86" cy="50" r="7"/><circle cx="34" cy="52" r="7"/></g>';
      case 'long': return '<path d="M30 92 Q24 30 60 20 Q96 30 90 92 L82 92 Q86 50 76 38 Q60 44 44 38 Q34 50 38 92Z" fill="' + c + '"/>';
      case 'bun': return '<g fill="' + c + '"><circle cx="60" cy="16" r="10"/><path d="M32 54 Q30 24 60 22 Q90 24 88 54 Q84 38 60 36 Q36 38 32 54Z"/></g>';
      default: return '';
    }
  }

  function hatSvg(style) {
    switch (style) {
      case 'beret': return '<path d="M30 40 Q34 18 64 18 Q92 20 90 36 Q70 30 30 40Z" fill="#2f3b1c"/><circle cx="38" cy="36" r="4" fill="#d9a647"/>';
      case 'scrub cap': return '<path d="M32 46 Q32 20 60 20 Q88 20 88 46 Q60 38 32 46Z" fill="#3aa7b8"/><path d="M32 46 Q60 38 88 46" stroke="#2a8494" stroke-width="3" fill="none"/>';
      case 'ball cap': return '<path d="M32 44 Q32 18 60 18 Q88 18 88 44Z" fill="#b3322f"/><path d="M60 44 L100 46 Q96 52 60 50Z" fill="#8e2522"/>';
      case 'headset': return '<path d="M30 58 Q30 18 60 18 Q90 18 90 58" stroke="#1a1e18" stroke-width="5" fill="none"/><rect x="24" y="52" width="10" height="16" rx="4" fill="#1a1e18"/><rect x="86" y="52" width="10" height="16" rx="4" fill="#1a1e18"/>';
      default: return '';
    }
  }

  function faceSvg(face) {
    var eyes = face === 'focused'
      ? '<path d="M44 58 h10 M66 58 h10" stroke="#1a1e18" stroke-width="3" stroke-linecap="round"/>'
      : '<circle cx="49" cy="58" r="3.4" fill="#1a1e18"/><circle cx="71" cy="58" r="3.4" fill="#1a1e18"/>';
    var mouth = {
      smile: '<path d="M50 72 Q60 80 70 72" stroke="#1a1e18" stroke-width="3" fill="none" stroke-linecap="round"/>',
      grin: '<path d="M48 70 Q60 84 72 70 Z" fill="#fff" stroke="#1a1e18" stroke-width="2.5" stroke-linejoin="round"/>',
      smirk: '<path d="M52 74 Q64 76 72 68" stroke="#1a1e18" stroke-width="3" fill="none" stroke-linecap="round"/>',
      focused: '<path d="M52 74 h16" stroke="#1a1e18" stroke-width="3" stroke-linecap="round"/>'
    }[face] || '';
    return eyes + mouth;
  }

  // bgColor comes from the page's category tokens so it follows the theme.
  function svg(a, size, label) {
    a = normalize(a);
    var s = size || 64;
    var longBack = a.hair === 'long' ? hairSvg('long', a.hairColor) : '';
    return '<svg class="avatar" data-cat="' + a.bg + '" width="' + s + '" height="' + s + '" viewBox="0 0 120 120" role="img" aria-label="' +
      (label ? String(label).replace(/"/g, '&quot;') + '\'s avatar' : 'Avatar') + '">' +
      '<circle cx="60" cy="60" r="60" class="avatar-bg"/>' +
      longBack +
      '<path d="M22 120 Q24 92 60 90 Q96 92 98 120Z" fill="' + a.shirt + '"/>' +
      '<rect x="52" y="78" width="16" height="14" fill="' + a.skin + '"/>' +
      '<ellipse cx="60" cy="58" rx="26" ry="28" fill="' + a.skin + '"/>' +
      (a.hair === 'long' ? '<path d="M34 50 Q36 26 60 24 Q84 26 86 50 Q80 36 60 36 Q40 36 34 50Z" fill="' + a.hairColor + '"/>' : hairSvg(a.hair, a.hairColor)) +
      faceSvg(a.face) +
      hatSvg(a.hat) +
      '</svg>';
  }

  window.TriviaAvatar = { OPTIONS: OPTIONS, LABELS: LABELS, DEFAULT: DEFAULT, normalize: normalize, forName: forName, svg: svg };
})();
