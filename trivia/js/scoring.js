// Scoring rules, shared by every mode.
//   points = (difficulty base + speed bonus) x streak multiplier x category-of-the-day bonus
(function () {
  var BASE = { 1: 100, 2: 200, 3: 300 };
  var LABEL = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
  var SPEED_SHARE = 0.25; // an instant answer earns up to 25% extra
  var FEATURED_BONUS = 2;

  // Right answers in a row, counting this one: 3+ is 1.5x, 5+ is 2x.
  function streakMultiplier(streak) {
    if (streak >= 5) return 2;
    if (streak >= 3) return 1.5;
    return 1;
  }

  // timeLeft is 0..1 of the clock remaining, or null when the timer is off.
  function score(difficulty, timeLeft, streak, featured) {
    var base = BASE[difficulty] || BASE[2];
    var speed = timeLeft == null ? 0 : Math.round(base * SPEED_SHARE * timeLeft);
    var streakX = streakMultiplier(streak);
    var featuredX = featured ? FEATURED_BONUS : 1;
    return {
      base: base,
      speed: speed,
      streakX: streakX,
      featuredX: featuredX,
      total: Math.round((base + speed) * streakX * featuredX)
    };
  }

  window.TriviaScoring = {
    BASE: BASE,
    LABEL: LABEL,
    FEATURED_BONUS: FEATURED_BONUS,
    streakMultiplier: streakMultiplier,
    score: score
  };
})();
