// Online mode: when the Firebase SDK and config are loaded (the GitHub Pages
// build), this swaps TriviaStore's shared data over to Firestore and adds
// Google sign-in and live games. Anywhere else the game stays on this device.
//
// Firestore layout (see firestore.rules):
//   users/{uid}                  display name
//   dailyResults/{date}_{uid}    one Daily Challenge result per person per day
//   customQuestions/{id}         the group's shared question bank
//   live/{code}                  a live game: questions, status, current index
//   live/{code}/players/{uid}    each player's running score
//   live/{code}/answers/{i}_{uid} each player's answer to question i
(function () {
  var config = window.TRIVIA_FIREBASE_CONFIG;
  var fb = window.firebase;
  if (!config || !fb || !fb.firestore || !fb.auth) return;

  var Store = window.TriviaStore;
  var local = Object.assign({}, Store);
  var auth, db;
  try {
    fb.initializeApp(config);
    auth = fb.auth();
    db = fb.firestore();
  } catch (e) {
    return;
  }
  var now = fb.firestore.FieldValue.serverTimestamp;

  var profile = null; // { uid, name }
  var listeners = [];

  function firstName(user) {
    return ((user.displayName || user.email || 'Player').split(/[\s@]/)[0]).slice(0, 20);
  }

  Store.cloud = true;
  Store.backend = 'Squad Trivia online';

  Store.ready = new Promise(function (resolve) {
    var settled = false;
    // Never hold the page hostage if Firebase is slow to answer.
    setTimeout(function () { if (!settled) { settled = true; resolve(); } }, 4000);
    auth.onAuthStateChanged(function (user) {
      var done = function () {
        listeners.forEach(function (fn) { fn(profile); });
        if (!settled) { settled = true; resolve(); }
      };
      if (!user) { profile = null; return done(); }
      var ref = db.collection('users').doc(user.uid);
      ref.get().then(function (snap) {
        var name = (snap.exists && snap.data().name) || firstName(user);
        profile = { uid: user.uid, name: name };
        if (!snap.exists) return ref.set({ name: name, createdAt: now() });
      }).catch(function () {
        profile = { uid: user.uid, name: firstName(user) };
      }).then(done);
    });
  });

  Store.user = function () { return profile; };
  Store.onAuth = function (fn) { listeners.push(fn); };

  Store.signIn = function () {
    var provider = new fb.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider).catch(function (e) {
      var code = e && e.code;
      if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
        return auth.signInWithRedirect(provider);
      }
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
      throw e;
    });
  };

  Store.signOut = function () { return auth.signOut(); };

  // ---------- profile ----------

  Store.getProfile = function () {
    return profile ? Promise.resolve({ name: profile.name }) : local.getProfile();
  };

  Store.saveProfile = function (p) {
    if (!profile) return local.saveProfile(p);
    profile.name = p.name;
    return db.collection('users').doc(profile.uid).set({ name: p.name }, { merge: true }).then(function () { return p; });
  };

  // ---------- daily challenge ----------

  Store.listDailyResults = function () {
    if (!profile) return local.listDailyResults();
    return db.collection('dailyResults').get().then(function (snap) {
      return snap.docs.map(function (d) { return d.data(); });
    }).catch(function () { return local.listDailyResults(); });
  };

  Store.saveDailyResult = function (result) {
    local.saveDailyResult(result);
    if (!profile) return Promise.resolve(result);
    var doc = Object.assign({}, result, { uid: profile.uid, updatedAt: now() });
    return db.collection('dailyResults').doc(result.date + '_' + profile.uid).set(doc)
      .then(function () { return result; }, function () { return result; });
  };

  // ---------- category rewards ----------
  // The signed-in player's tallies live on their user doc so they follow them
  // to any phone. Pass & Play guests stay on the device.

  var myTallies = null;

  Store.listTallies = function () {
    return local.listTallies().then(function (all) {
      if (!profile) return all;
      return db.collection('users').doc(profile.uid).get().then(function (snap) {
        myTallies = (snap.exists && snap.data().tallies) || {};
        all['uid:' + profile.uid] = Object.assign({}, myTallies);
        return all;
      }, function () { return all; });
    });
  };

  Store.addCorrect = function (playerKey, category) {
    if (!profile || playerKey !== 'uid:' + profile.uid) return local.addCorrect(playerKey, category);
    myTallies = myTallies || {};
    var before = myTallies[category] || 0;
    myTallies[category] = before + 1;
    var patch = {};
    patch['tallies.' + category] = fb.firestore.FieldValue.increment(1);
    db.collection('users').doc(profile.uid).update(patch).catch(function () {});
    return Promise.resolve({ before: before, after: before + 1 });
  };

  // ---------- shared question bank ----------

  Store.listCustomQuestions = function () {
    if (!profile) return local.listCustomQuestions();
    return db.collection('customQuestions').orderBy('createdAt').get().then(function (snap) {
      return snap.docs.map(function (d) { return Object.assign({}, d.data(), { id: d.id, custom: true }); });
    }).catch(function () { return local.listCustomQuestions(); });
  };

  Store.addCustomQuestion = function (q) {
    if (!profile) return local.addCustomQuestion(q);
    var doc = Object.assign({}, q, { createdBy: profile.uid, createdByName: profile.name, createdAt: now() });
    return db.collection('customQuestions').add(doc).then(function (ref) {
      return Object.assign({}, q, { id: ref.id, custom: true });
    });
  };

  Store.deleteCustomQuestion = function (id) {
    if (!profile) return local.deleteCustomQuestion(id);
    return db.collection('customQuestions').doc(id).delete();
  };

  // ---------- live games ----------

  var CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I or O, they read like 1 and 0

  function newCode() {
    var code = '';
    for (var i = 0; i < 4; i++) code += CODE_LETTERS[Math.floor(Math.random() * CODE_LETTERS.length)];
    return code;
  }

  function gameRef(code) { return db.collection('live').doc(code); }

  function joinAs(code) {
    return gameRef(code).collection('players').doc(profile.uid).set({
      uid: profile.uid,
      name: profile.name,
      score: 0,
      correct: 0,
      answered: 0,
      streak: 0,
      bestStreak: 0,
      joinedAt: now()
    }, { merge: true });
  }

  Store.live = {
    // questions: [{ q: question, options: [...] }]
    create: function (questions, timer, featured) {
      var code = newCode();
      var ref = gameRef(code);
      return ref.get().then(function (snap) {
        if (snap.exists) return Store.live.create(questions, timer, featured);
        return ref.set({
          host: profile.uid,
          hostName: profile.name,
          status: 'lobby',
          index: -1,
          timer: timer,
          featured: featured,
          questions: questions.map(function (item) {
            return {
              id: item.q.id,
              category: item.q.category,
              difficulty: item.q.difficulty || 2,
              q: item.q.q,
              answer: item.q.answer,
              custom: !!item.q.custom,
              options: item.options
            };
          }),
          createdAt: now()
        }).then(function () { return joinAs(code); }).then(function () { return code; });
      });
    },

    join: function (code) {
      return gameRef(code).get().then(function (snap) {
        if (!snap.exists) throw new Error('No game with code ' + code + '. Check the letters with the host.');
        if (snap.data().status === 'done') throw new Error('That game already finished.');
        return joinAs(code).then(function () { return code; });
      });
    },

    // Calls onChange({ game, players, answers }) whenever anything changes.
    watch: function (code, onChange, onError) {
      var snapshot = { game: null, players: [], answers: [] };
      var emit = function () { if (snapshot.game) onChange(snapshot); };
      var ref = gameRef(code);
      var stops = [
        ref.onSnapshot(function (s) { snapshot.game = s.exists ? s.data() : null; emit(); }, onError),
        ref.collection('players').onSnapshot(function (s) {
          snapshot.players = s.docs.map(function (d) { return d.data(); });
          emit();
        }, onError),
        ref.collection('answers').onSnapshot(function (s) {
          snapshot.answers = s.docs.map(function (d) { return d.data(); });
          emit();
        }, onError)
      ];
      return function () { stops.forEach(function (stop) { stop(); }); };
    },

    // Host only: move the game to a new status and question.
    setStatus: function (code, status, index) {
      var patch = { status: status };
      if (typeof index === 'number') patch.index = index;
      return gameRef(code).update(patch);
    },

    // choice is null when time ran out. playerPatch holds the new totals.
    answer: function (code, index, choice, points, playerPatch) {
      var ref = gameRef(code);
      var batch = db.batch();
      batch.set(ref.collection('answers').doc(index + '_' + profile.uid), {
        uid: profile.uid,
        index: index,
        choice: choice,
        points: points,
        at: now()
      });
      batch.update(ref.collection('players').doc(profile.uid), playerPatch);
      return batch.commit();
    }
  };
})();
