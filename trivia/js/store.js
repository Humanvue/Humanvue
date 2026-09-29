// Storage layer. Everything the game saves goes through TriviaStore, so a
// real backend (user accounts, shared leaderboards, a shared question bank)
// can replace this file later without touching the game code.
// Every method returns a Promise to match what a network-backed version needs.
(function () {
  var KEYS = {
    custom: 'trivia.customQuestions.v1',
    history: 'trivia.history.v1',
    lastSetup: 'trivia.lastSetup.v1',
    daily: 'trivia.daily.v2',
    profile: 'trivia.profile.v1',
    tallies: 'trivia.tallies.v1',
    seen: 'trivia.seen.v1'
  };

  // Browser storage can be missing or blocked (private windows, previews),
  // so every read falls back and every write is allowed to fail quietly.
  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function newId(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  window.TriviaStore = {
    backend: 'this browser',

    // Sign-in and live games exist only when js/cloud.js connects Firebase.
    cloud: false,
    ready: Promise.resolve(),
    live: null,
    board: null,
    user: function () { return null; },
    onAuth: function () {},
    signIn: function () { return Promise.reject(new Error('Sign-in needs the online version.')); },
    signOut: function () { return Promise.resolve(); },

    listCustomQuestions: function () {
      return Promise.resolve(read(KEYS.custom, []));
    },

    addCustomQuestion: function (question) {
      var all = read(KEYS.custom, []);
      var saved = Object.assign({}, question, {
        id: newId('c_'),
        custom: true,
        createdAt: new Date().toISOString()
      });
      all.push(saved);
      write(KEYS.custom, all);
      return Promise.resolve(saved);
    },

    deleteCustomQuestion: function (id) {
      write(KEYS.custom, read(KEYS.custom, []).filter(function (q) { return q.id !== id; }));
      return Promise.resolve();
    },

    listGames: function (limit) {
      return Promise.resolve(read(KEYS.history, []).slice(0, limit || 10));
    },

    saveGame: function (game) {
      var all = read(KEYS.history, []);
      var saved = Object.assign({}, game, { id: newId('g_'), playedAt: new Date().toISOString() });
      all.unshift(saved);
      write(KEYS.history, all.slice(0, 50));
      return Promise.resolve(saved);
    },

    clearGames: function () {
      write(KEYS.history, []);
      return Promise.resolve();
    },

    // Daily Challenge results: one per player per date. With a shared
    // backend this becomes the group leaderboard.
    listDailyResults: function () {
      return Promise.resolve(read(KEYS.daily, []));
    },

    saveDailyResult: function (result) {
      var key = result.date + '|' + result.player.toLowerCase();
      var all = read(KEYS.daily, []).filter(function (r) {
        return r.date + '|' + r.player.toLowerCase() !== key;
      });
      all.push(result);
      write(KEYS.daily, all);
      return Promise.resolve(result);
    },

    // Who is playing on this device. Becomes the signed-in user later.
    getProfile: function () {
      return Promise.resolve(read(KEYS.profile, { name: '' }));
    },

    saveProfile: function (profile) {
      var merged = Object.assign({}, read(KEYS.profile, {}), profile);
      write(KEYS.profile, merged);
      return Promise.resolve(merged);
    },

    // Right answers per category for each player, for category rewards.
    // Keys are 'name:<lowercase name>' on a device or 'uid:<id>' when signed in.
    listTallies: function () {
      return Promise.resolve(read(KEYS.tallies, {}));
    },

    addCorrect: function (playerKey, category) {
      var all = read(KEYS.tallies, {});
      var mine = all[playerKey] || (all[playerKey] = {});
      var before = mine[category] || 0;
      mine[category] = before + 1;
      write(KEYS.tallies, all);
      return Promise.resolve({ before: before, after: before + 1 });
    },

    // Questions answered per category, right or wrong, for strength charts.
    addSeen: function (playerKey, category) {
      var all = read(KEYS.seen, {});
      var mine = all[playerKey] || (all[playerKey] = {});
      mine[category] = (mine[category] || 0) + 1;
      write(KEYS.seen, all);
      return Promise.resolve();
    },

    // Everyone this device knows about, with their category counts.
    // Online this becomes every signed-in player.
    listPlayers: function () {
      var tallies = read(KEYS.tallies, {});
      var seen = read(KEYS.seen, {});
      var profile = read(KEYS.profile, { name: '' });
      var keys = Object.keys(seen);
      Object.keys(tallies).forEach(function (k) { if (keys.indexOf(k) === -1) keys.push(k); });
      return Promise.resolve(keys.map(function (k) {
        var raw = k.replace(/^name:/, '');
        var mine = profile.name && profile.name.trim().toLowerCase() === raw;
        return {
          key: k,
          name: mine ? profile.name : raw.charAt(0).toUpperCase() + raw.slice(1),
          avatar: mine ? profile.avatar : null,
          showcase: mine ? profile.showcase || [] : [],
          tallies: tallies[k] || {},
          seen: seen[k] || {}
        };
      }));
    },

    getLastSetup: function () {
      return Promise.resolve(read(KEYS.lastSetup, null));
    },

    saveLastSetup: function (setup) {
      write(KEYS.lastSetup, setup);
      return Promise.resolve();
    }
  };
})();
