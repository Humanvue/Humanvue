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
    profile: 'trivia.profile.v1'
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
      write(KEYS.profile, profile);
      return Promise.resolve(profile);
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
