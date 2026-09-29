// Daily Challenge: everyone gets the same questions on the same date without
// any server. The date seeds a random generator, which picks the day's three
// categories (the first is the category of the day), ten built-in questions
// and the answer order. Custom questions
// are left out because they only exist on one device.
(function () {
  var QUESTIONS_PER_DAY = 10;
  var CATEGORIES_PER_DAY = 3;
  var TIMER = 20;
  var LAUNCH = Date.UTC(2026, 8, 29); // Day #1

  function seedFrom(text) {
    var h = 2166136261;
    for (var i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // mulberry32: small, fast and identical on every browser.
  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededShuffle(list, rand) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Local calendar date, so the challenge rolls over at each player's midnight.
  function today(now) {
    var d = now || new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function number(date) {
    var p = date.split('-').map(Number);
    return Math.round((Date.UTC(p[0], p[1] - 1, p[2]) - LAUNCH) / 86400000) + 1;
  }

  function build(date) {
    var rand = rng(seedFrom('squad-trivia:' + date));
    var cats = seededShuffle(window.TRIVIA_CATEGORIES.map(function (c) { return c.id; }), rand)
      .slice(0, CATEGORIES_PER_DAY);
    // Sort by id first so the pick never depends on the order of the source file.
    var pool = window.TRIVIA_QUESTIONS
      .filter(function (q) { return cats.indexOf(q.category) !== -1; })
      .sort(function (a, b) { return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; });
    var questions = seededShuffle(pool, rand).slice(0, QUESTIONS_PER_DAY).map(function (q) {
      return { q: q, options: seededShuffle([q.answer].concat(q.wrong), rand) };
    });
    // The first category drawn is the day's featured category (double points).
    return { date: date, number: number(date), categories: cats, featured: cats[0], questions: questions, timer: TIMER };
  }

  function shareText(result) {
    var squares = result.pattern.map(function (hit) { return hit ? '🟩' : '🟥'; }).join('');
    return 'Squad Trivia Daily #' + result.number + '\n' +
      result.correct + '/' + result.total + ' · ' + result.score + ' pts\n' + squares;
  }

  // Consecutive days played, counting back from the most recent date given.
  function streak(dates, fromDate) {
    var have = {};
    dates.forEach(function (d) { have[d] = true; });
    var p = fromDate.split('-').map(Number);
    var cursor = new Date(p[0], p[1] - 1, p[2]);
    if (!have[today(cursor)]) cursor.setDate(cursor.getDate() - 1);
    var count = 0;
    while (have[today(cursor)]) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  window.TriviaDaily = {
    today: today,
    number: number,
    build: build,
    shareText: shareText,
    streak: streak
  };
})();
