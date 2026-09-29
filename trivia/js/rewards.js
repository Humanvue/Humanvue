// Category rewards: every right answer in a category counts toward that
// category's ladder of five objects, each better than the last.
(function () {
  var TIERS = [
    { need: 5, name: 'Bronze' },
    { need: 15, name: 'Silver' },
    { need: 30, name: 'Gold' },
    { need: 60, name: 'Platinum' },
    { need: 100, name: 'Diamond' }
  ];

  var ITEMS = {
    military: ['Canteen', 'Dog Tags', 'Challenge Coin', 'Officer\'s Saber', 'Five-Star Insignia'],
    nursing: ['Penlight', 'Pulse Oximeter', 'Stethoscope', 'Crash Cart', 'Nightingale Lamp'],
    science: ['Test Tube', 'Bunsen Burner', 'Microscope', 'Telescope', 'Nobel Medal'],
    pop: ['Mixtape', 'Boombox', 'Gold Record', 'Platinum Record', 'Diamond Record'],
    sports: ['Participation Ribbon', 'Game Ball', 'Championship Ring', 'MVP Trophy', 'Olympic Gold'],
    geo: ['Paper Map', 'Compass', 'Spyglass', 'Sextant', 'Gilded Globe'],
    politics: ['Campaign Button', 'Ballot Box', 'Speaker\'s Gavel', 'Senate Seat', 'Oval Office Desk'],
    ushistory: ['Buffalo Nickel', 'Musket Ball', 'Quill Pen', 'Liberty Bell', 'Original Constitution'],
    worldhistory: ['Clay Shard', 'Roman Coin', 'Viking Helmet', 'Samurai Sword', 'Pharaoh\'s Crown'],
    philosophy: ['Scroll', 'Oil Lamp', 'Laurel Wreath', 'Marble Bust', 'Golden Owl of Athena'],
    film: ['Popcorn Bucket', 'VHS Tape', 'Clapperboard', 'Director\'s Chair', 'Golden Statuette'],
    lit: ['Library Card', 'Bookmark', 'Fountain Pen', 'Signed First Edition', 'Golden Quill'],
    auto: ['Air Freshener', 'Socket Wrench', 'Checkered Flag', 'V8 Engine', 'Gold Steering Wheel']
  };

  // Highest tier reached with this many right answers: -1 means none yet.
  function level(count) {
    var lvl = -1;
    for (var i = 0; i < TIERS.length; i++) if (count >= TIERS[i].need) lvl = i;
    return lvl;
  }

  function reward(category, lvl) {
    var items = ITEMS[category];
    if (!items || lvl < 0) return null;
    return { category: category, level: lvl, tier: TIERS[lvl].name, item: items[lvl], need: TIERS[lvl].need };
  }

  // The reward earned by going from `before` to `after` right answers, if any.
  function unlocked(category, before, after) {
    var a = level(before);
    var b = level(after);
    return b > a ? reward(category, b) : null;
  }

  function next(category, count) {
    var lvl = level(count);
    return lvl + 1 < TIERS.length ? reward(category, lvl + 1) : null;
  }

  window.TriviaRewards = {
    TIERS: TIERS,
    ITEMS: ITEMS,
    level: level,
    reward: reward,
    unlocked: unlocked,
    next: next,
    total: function () { return Object.keys(ITEMS).length * TIERS.length; }
  };
})();
