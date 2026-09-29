// Squad Trivia: trivia for a group of friends.
// Modes: Pass & Play (one phone, setup -> handoff/question/reveal -> results)
// Daily Challenge (same 10 questions for everyone each day, see daily.js)
// and Live Game (everyone on their own phone; needs the online version).
// All saving goes through window.TriviaStore (see store.js).
(function () {
  var CATEGORIES = window.TRIVIA_CATEGORIES;
  var BUILT_IN = window.TRIVIA_QUESTIONS;
  var Store = window.TriviaStore;
  var Daily = window.TriviaDaily;
  var Scoring = window.TriviaScoring;
  var Rewards = window.TriviaRewards;
  var Avatar = window.TriviaAvatar;

  var MAX_PLAYERS = 8;
  var KEYS = ['A', 'B', 'C', 'D'];

  var app = document.getElementById('app');

  var state = {
    screen: 'home',
    setup: {
      players: ['Big Poppa', 'Guest'],
      categories: CATEGORIES.map(function (c) { return c.id; }),
      perPlayer: 5,
      timer: 20
    },
    custom: [],
    history: [],
    dailyResults: [],
    profileName: '',
    boardTab: 'today',
    tallies: {},
    trophyKey: null,
    theme: readTheme(),
    themeOpen: false,
    profile: { avatar: null, showcase: [] },
    avatarDraft: null,
    showcaseDraft: null,
    players: null,
    viewPlayer: null,
    board: null,
    boardSeenAt: readBoardSeen(),
    live: null,
    liveError: '',
    liveBusy: false,
    signingIn: false,
    renaming: false,
    copied: false,
    game: null,
    quitArmed: false,
    clearArmed: false,
    bankError: '',
    setupError: ''
  };

  var timerHandle = null;

  // ---------- theme (kept per device) ----------

  var THEME_KEY = 'trivia.theme.v1';
  var ACCENTS = [['brass', 'Brass'], ['army', 'Army green'], ['scrubs', 'Scrubs teal'], ['navy', 'Navy'], ['crimson', 'Crimson']];
  var hostTheme = document.documentElement.getAttribute('data-theme');

  function readTheme() {
    try { return JSON.parse(window.localStorage.getItem('trivia.theme.v1')) || {}; } catch (e) { return {}; }
  }

  function applyTheme(t) {
    var root = document.documentElement;
    if (t.mode === 'light' || t.mode === 'dark') root.setAttribute('data-theme', t.mode);
    else if (hostTheme) root.setAttribute('data-theme', hostTheme);
    else root.removeAttribute('data-theme');
    root.setAttribute('data-accent', t.accent || 'brass');
  }

  function saveTheme(t) {
    state.theme = t;
    applyTheme(t);
    try { window.localStorage.setItem(THEME_KEY, JSON.stringify(t)); } catch (e) { /* stays for this visit */ }
  }

  function readBoardSeen() {
    try { return Number(window.localStorage.getItem('trivia.boardSeen.v1')) || 0; } catch (e) { return 0; }
  }

  // ---------- helpers ----------

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function catName(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].name;
    return id;
  }

  function allQuestions() {
    return BUILT_IN.concat(state.custom);
  }

  function countFor(catId) {
    return allQuestions().filter(function (q) { return q.category === catId; }).length;
  }

  function poolSize() {
    var cats = state.setup.categories;
    return allQuestions().filter(function (q) { return cats.indexOf(q.category) !== -1; }).length;
  }

  function stopTimer() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
  }

  function go(screen) {
    stopTimer();
    if (screen !== 'live' && state.live) liveReset();
    state.screen = screen;
    state.quitArmed = false;
    render();
    window.scrollTo(0, 0);
  }

  function ranked(players) {
    return players.slice().sort(function (a, b) {
      return b.score - a.score || b.correct - a.correct || a.order - b.order;
    });
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  // ---------- game flow ----------

  function startGame() {
    var s = state.setup;
    if (s.players.length < 1) { state.setupError = 'Add at least one player.'; return render(); }
    if (s.categories.length < 1) { state.setupError = 'Pick at least one category.'; return render(); }

    var pool = shuffle(allQuestions().filter(function (q) { return s.categories.indexOf(q.category) !== -1; }));
    var perPlayer = Math.min(s.perPlayer, Math.floor(pool.length / s.players.length));
    if (perPlayer < 1) { state.setupError = 'Not enough questions for that many players. Add categories or questions.'; return render(); }

    state.setupError = '';
    Store.saveLastSetup(s);

    var total = perPlayer * s.players.length;
    state.game = newGame('party', s.players, pool.slice(0, total).map(function (q) {
      return { q: q, options: shuffle([q.answer].concat(q.wrong)) };
    }), s.timer);
    state.game.perPlayer = perPlayer;
    state.game.shortened = perPlayer < s.perPlayer;
    beginTurn();
  }

  function newGame(mode, names, questions, timer) {
    return {
      mode: mode,
      players: names.map(function (name, i) {
        return { name: name, order: i, score: 0, correct: 0, answered: 0, streak: 0, bestStreak: 0 };
      }),
      questions: questions,
      perPlayer: questions.length,
      shortened: false,
      timer: timer,
      index: 0,
      picked: null,
      points: 0,
      deadline: 0,
      pattern: [],
      featured: Daily.build(Daily.today()).featured,
      lastScore: null,
      saved: false
    };
  }

  function sameName(a, b) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
  }

  // Online results carry a uid, so two friends with the same name stay apart.
  function isMe(result) {
    var u = Store.user();
    if (u && result.uid) return result.uid === u.uid;
    return !!state.profileName && sameName(result.player, state.profileName);
  }

  function playerKey(result) {
    return result.uid || result.player.trim().toLowerCase();
  }

  // Which tally a player's right answers count toward (see Store.listTallies).
  function tallyKey(name) {
    var u = Store.user();
    if (u && sameName(name, u.name)) return 'uid:' + u.uid;
    return 'name:' + name.trim().toLowerCase();
  }

  function myTallyKey() {
    var u = Store.user();
    if (u) return 'uid:' + u.uid;
    return state.profileName ? 'name:' + state.profileName.trim().toLowerCase() : null;
  }

  // Counts a right answer and returns the reward it unlocked, if any.
  // Counts every answer toward the strength chart, and right ones toward rewards.
  function recordAnswer(name, category, right) {
    Store.addSeen(tallyKey(name), category);
    return right ? creditCorrect(name, category) : null;
  }

  function creditCorrect(name, category) {
    var key = tallyKey(name);
    var mine = state.tallies[key] || (state.tallies[key] = {});
    var before = mine[category] || 0;
    mine[category] = before + 1;
    Store.addCorrect(key, category);
    return Rewards.unlocked(category, before, before + 1);
  }

  function dailyFor(name, date) {
    var d = date || Daily.today();
    if (!name) return null;
    for (var i = 0; i < state.dailyResults.length; i++) {
      var r = state.dailyResults[i];
      if (r.date === d && (Store.user() ? isMe(r) : sameName(r.player, name))) return r;
    }
    return null;
  }

  function todaysDaily() {
    return dailyFor(state.profileName);
  }

  function startDaily(name) {
    name = (name || '').trim();
    if (!name) { state.dailyError = 'Enter your name so your score lands on the leaderboard.'; return render(); }
    state.dailyError = '';
    state.profileName = name;
    Store.saveProfile({ name: name });
    if (todaysDaily()) return go('home');
    var plan = Daily.build(Daily.today());
    state.game = newGame('daily', [name], plan.questions, plan.timer);
    state.game.daily = plan;
    // Saved before the first question so quitting or reloading can't earn a replay.
    saveDailyProgress();
    showQuestion();
  }

  function saveDailyProgress(done) {
    var g = state.game;
    var p = g.players[0];
    var result = {
      player: p.name,
      date: g.daily.date,
      number: g.daily.number,
      score: p.score,
      correct: p.correct,
      total: g.questions.length,
      pattern: g.questions.map(function (_, i) { return !!g.pattern[i]; }),
      finished: !!done
    };
    var u = Store.user();
    if (u) result.uid = u.uid;
    state.dailyResults = state.dailyResults.filter(function (r) {
      return !(r.date === result.date && playerKey(r) === playerKey(result));
    }).concat([result]);
    return Store.saveDailyResult(result);
  }

  function currentPlayer() {
    var g = state.game;
    return g.players[g.index % g.players.length];
  }

  function beginTurn() {
    // Solo games skip the "pass the phone" screen.
    if (state.game.players.length > 1) go('handoff');
    else showQuestion();
  }

  function showQuestion() {
    var g = state.game;
    g.picked = null;
    g.points = 0;
    go('question');
    if (g.timer) {
      g.deadline = Date.now() + g.timer * 1000;
      tick();
      timerHandle = setInterval(tick, 100);
    }
  }

  function tick() {
    var g = state.game;
    var left = Math.max(0, g.deadline - Date.now());
    var fill = document.getElementById('timer-fill');
    var text = document.getElementById('timer-text');
    if (fill) {
      fill.style.width = (left / (g.timer * 1000) * 100) + '%';
      fill.classList.toggle('low', left < 5000);
    }
    if (text) text.textContent = Math.ceil(left / 1000) + 's';
    if (left <= 0) answer(null);
  }

  function answer(choice) {
    var g = state.game;
    if (state.screen !== 'question') return;
    var timeLeft = g.timer ? Math.max(0, g.deadline - Date.now()) / (g.timer * 1000) : null;
    stopTimer();

    var item = g.questions[g.index];
    var player = currentPlayer();
    var right = choice !== null && item.options[choice] === item.q.answer;

    g.picked = choice;
    g.lastScore = right
      ? Scoring.score(item.q.difficulty, timeLeft, player.streak + 1, item.q.category === g.featured)
      : null;
    g.points = right ? g.lastScore.total : 0;

    player.answered += 1;
    g.unlock = recordAnswer(player.name, item.q.category, right);
    if (right) {
      player.correct += 1;
      player.score += g.points;
      player.streak += 1;
      player.bestStreak = Math.max(player.bestStreak, player.streak);
    } else {
      player.streak = 0;
    }
    g.pattern[g.index] = right;
    if (g.mode === 'daily') saveDailyProgress();
    go('reveal');
  }

  function next() {
    var g = state.game;
    g.index += 1;
    if (g.index >= g.questions.length) return finish();
    beginTurn();
  }

  function finish() {
    var g = state.game;
    if (g.mode === 'daily') {
      saveDailyProgress(true);
      state.copied = false;
      return go('daily-result');
    }
    go('results');
    if (!g.saved) {
      g.saved = true;
      var order = ranked(g.players);
      Store.saveGame({
        players: order.map(function (p) { return { name: p.name, score: p.score, correct: p.correct, answered: p.answered }; }),
        winner: order[0].name,
        questionCount: g.questions.length,
        categories: state.setup.categories.slice()
      }).then(loadHistory);
    }
  }

  function loadHistory() {
    return Store.listGames(5).then(function (games) { state.history = games; });
  }

  function loadTallies() {
    return Store.listTallies().then(function (all) { state.tallies = all || {}; });
  }

  function loadDaily() {
    return Store.listDailyResults().then(function (all) { state.dailyResults = all; });
  }

  function loadCustom() {
    return Store.listCustomQuestions().then(function (qs) { state.custom = qs; });
  }

  // ---------- screens ----------

  function topbar(right) {
    return '<header class="topbar">' +
      '<p class="brand">Squad <span>Trivia</span></p>' +
      '<div class="row topbar-right">' +
        '<button class="btn-small btn-ghost" data-action="theme-toggle" aria-expanded="' + state.themeOpen + '">Theme</button>' +
        (right || '') +
      '</div>' +
      '</header>' + (state.themeOpen ? themePanel() : '');
  }

  function themePanel() {
    var t = state.theme;
    var mode = t.mode || 'auto';
    var modes = [['auto', 'Match device'], ['light', 'Light'], ['dark', 'Dark']].map(function (m) {
      return '<button data-action="theme-mode" data-value="' + m[0] + '" aria-pressed="' + (mode === m[0]) + '">' + m[1] + '</button>';
    }).join('');
    var accents = ACCENTS.map(function (a) {
      var on = (t.accent || 'brass') === a[0];
      return '<button class="swatch" data-action="theme-accent" data-value="' + a[0] + '" aria-pressed="' + on + '">' +
        '<span class="swatch-dot accent-' + a[0] + '"></span>' + a[1] + '</button>';
    }).join('');
    return '<section class="card theme-panel">' +
      '<div class="field"><span class="label">Mode</span><div class="seg">' + modes + '</div></div>' +
      '<div class="field"><span class="label">Accent color</span><div class="chips">' + accents + '</div></div>' +
      '</section>';
  }

  function scoreboard(highlight) {
    var g = state.game;
    return '<div class="board">' + ranked(g.players).map(function (p, i) {
      return '<div class="board-row' + (p === highlight ? ' current' : '') + '">' +
        '<span class="rank">' + (i + 1) + '</span>' +
        '<span class="name">' + esc(p.name) + ' <span class="sub">' + p.correct + '/' + p.answered + '</span></span>' +
        '<span class="score">' + p.score + '</span>' +
        '</div>';
    }).join('') + '</div>';
  }

  function progressText() {
    var g = state.game;
    return 'Q ' + (g.index + 1) + ' of ' + g.questions.length;
  }

  function quitButton() {
    return '<button class="btn-ghost btn-small' + (state.quitArmed ? ' btn-danger' : '') + '" data-action="quit">' +
      (state.quitArmed ? 'Tap again to quit' : 'Quit game') + '</button>';
  }

  function categoryBadges(ids, featured) {
    return '<div class="chips">' + ids.map(function (id) {
      return '<span class="cat-badge" data-cat="' + id + '">' + esc(catName(id)) +
        (id === featured ? ' · ×' + Scoring.FEATURED_BONUS : '') + '</span>';
    }).join('') + '</div>';
  }

  function dailyStreak() {
    var name = state.profileName;
    var dates = state.dailyResults.filter(function (r) { return name && isMe(r); })
      .map(function (r) { return r.date; });
    return Daily.streak(dates, Daily.today());
  }

  function shareBlock(result) {
    var text = Daily.shareText(result);
    return '<pre class="share" id="share-text">' + esc(text) + '</pre>' +
      '<button class="btn-primary" data-action="copy-share">' + (state.copied ? 'Copied. Paste it in the group chat' : 'Copy result for the group chat') + '</button>';
  }

  function viewHome() {
    var date = Daily.today();
    var plan = Daily.build(date);
    var done = todaysDaily();
    var streak = dailyStreak();
    var name = state.profileName;

    var daily = done
      ? '<p class="muted">' + esc(done.player) + ', you played today. ' + (done.finished ? '' : 'Unanswered questions count as misses. ') +
          'A new challenge unlocks at midnight.</p>' +
        '<div class="stat-grid">' +
          '<div class="stat"><div class="v">' + done.correct + '/' + done.total + '</div><div class="k">correct</div></div>' +
          '<div class="stat"><div class="v">' + done.score + '</div><div class="k">points</div></div>' +
          '<div class="stat"><div class="v">' + streak + '</div><div class="k">day streak</div></div>' +
        '</div>' + shareBlock(done) +
        (Store.cloud ? '' : '<button class="btn-ghost btn-small" data-action="switch-player">Someone else on this phone? Play as them</button>')
      : '<p class="muted">Everyone gets the same 10 questions today. <strong>' + esc(catName(plan.featured)) +
          '</strong> is the category of the day and scores double. Play once, whenever you want.</p>' +
        (Store.cloud
          ? (Store.user()
              ? '<button class="btn-primary" data-action="daily-cloud">Play today\'s challenge</button>'
              : signInButton('Sign in with Google to play'))
          : '<form class="field" data-form="daily">' +
          '<label class="label" for="daily-name">Your name</label>' +
          '<input type="text" id="daily-name" maxlength="20" autocomplete="off" placeholder="Your name" value="' + esc(name) + '">' +
          (state.dailyError ? '<p class="error">' + esc(state.dailyError) + '</p>' : '') +
          '<button class="btn-primary" type="submit">Play today\'s challenge</button>' +
        '</form>') +
        (streak ? '<p class="small muted">Current streak: ' + streak + ' day' + (streak === 1 ? '' : 's') + '</p>' : '');

    return topbar('') +
      accountStrip() +
      homeNav() +
      '<section class="card">' +
        '<div class="q-meta"><h2>Daily Challenge</h2><span class="progress">#' + plan.number + ' · ' + esc(date) + '</span></div>' +
        categoryBadges(plan.categories, plan.featured) + daily +
      '</section>' +
      '<section class="card">' +
        '<h2>Pass &amp; Play</h2>' +
        '<p class="muted">Everyone in the same room, one phone passed around. Pick the players, categories and timer.</p>' +
        '<div class="row"><button data-action="setup">Set up a game</button>' +
        '<button class="btn-ghost" data-action="bank">Add your own questions</button></div>' +
      '</section>' +
      liveCard() +
      trophyCard() +
      scoringCard() +
      '<p class="footer-note">' + (Store.cloud && Store.user()
        ? 'Daily scores and custom questions are shared with everyone signed in.'
        : 'Scores and your own questions are saved on this device.') + '</p>';
  }

  function signInButton(label) {
    return '<button class="btn-primary" data-action="sign-in"' + (state.signingIn ? ' disabled' : '') + '>' +
      (state.signingIn ? 'Opening Google sign-in…' : label) + '</button>';
  }

  function accountStrip() {
    if (!Store.cloud) return '';
    var u = Store.user();
    if (!u) return '<p class="account small muted">Sign in with Google to join the group leaderboard and live games.</p>';
    if (state.renaming) {
      return '<form class="account field-row" data-form="rename">' +
        '<input type="text" id="rename" maxlength="20" autocomplete="off" value="' + esc(u.name) + '" aria-label="Your name">' +
        '<button type="submit">Save</button></form>';
    }
    return '<div class="account row small"><span>Playing as <strong>' + esc(u.name) + '</strong></span>' +
      '<button class="btn-ghost btn-small" data-action="rename">Change name</button>' +
      '<button class="btn-ghost btn-small" data-action="sign-out">Sign out</button></div>';
  }

  function liveCard() {
    if (!Store.cloud) {
      return '<section class="card mode-soon">' +
        '<div class="q-meta"><h2>Live Game</h2><span class="soon">Online version</span></div>' +
        '<p class="muted">Everyone answers on their own phone at the same moment, from anywhere. ' +
          'Live games run on the online version of Squad Trivia, with Google sign-in: ' +
          '<a href="https://humanvue.github.io/Humanvue/">humanvue.github.io/Humanvue</a></p>' +
      '</section>';
    }
    var body;
    if (!Store.user()) {
      body = signInButton('Sign in with Google to play live');
    } else {
      body = '<p class="muted">Host a game and share the 4-letter code, or join a friend\'s game. ' +
          LIVE_QUESTIONS + ' questions from the categories picked under Pass &amp; Play, ' + (state.setup.timer || 20) + ' seconds each.</p>' +
        '<button class="btn-primary" data-action="live-host"' + (state.liveBusy ? ' disabled' : '') + '>Host a live game</button>' +
        '<form class="field-row" data-form="live-join">' +
          '<input type="text" id="live-code" maxlength="4" autocomplete="off" autocapitalize="characters" placeholder="Game code" aria-label="Game code">' +
          '<button type="submit"' + (state.liveBusy ? ' disabled' : '') + '>Join</button>' +
        '</form>';
    }
    return '<section class="card"><h2>Live Game</h2>' + body +
      (state.liveError ? '<p class="error">' + esc(state.liveError) + '</p>' : '') + '</section>';
  }

  function scoringCard() {
    return '<section class="card"><h2>How scoring works</h2>' +
      '<div class="rules">' +
        '<div><span class="tag diff-1">Easy</span> 100</div>' +
        '<div><span class="tag diff-2">Medium</span> 200</div>' +
        '<div><span class="tag diff-3">Hard</span> 300</div>' +
      '</div>' +
      '<ul class="rule-list">' +
        '<li>Answer fast for up to 25% more.</li>' +
        '<li>3 right in a row scores ×1.5, and 5 or more in a row scores ×2.</li>' +
        '<li>The category of the day scores ×' + Scoring.FEATURED_BONUS + ', in every mode.</li>' +
      '</ul></section>';
  }

  function aggregate() {
    var byName = {};
    state.dailyResults.forEach(function (r) {
      var key = playerKey(r);
      var row = byName[key] || (byName[key] = { name: r.player, mine: isMe(r), points: 0, days: 0, correct: 0, total: 0, best: 0 });
      row.points += r.score;
      row.days += 1;
      row.correct += r.correct;
      row.total += r.total;
      row.best = Math.max(row.best, r.score);
    });
    return Object.keys(byName).map(function (k) { return byName[k]; })
      .sort(function (a, b) { return b.points - a.points || b.correct - a.correct; });
  }

  function viewBoard() {
    var date = Daily.today();
    var tab = state.boardTab;
    var body;
    if (tab === 'today') {
      var rows = state.dailyResults.filter(function (r) { return r.date === date; })
        .sort(function (a, b) { return b.score - a.score || b.correct - a.correct; });
      body = rows.length
        ? '<div class="board">' + rows.map(function (r, i) {
            return '<div class="board-row' + (isMe(r) ? ' current' : '') + '">' +
              '<span class="rank">' + (i + 1) + '</span>' +
              '<span class="name">' + esc(r.player) + ' <span class="sub">' + r.correct + '/' + r.total + '</span>' +
              '<span class="dots">' + r.pattern.map(function (hit) { return '<i class="' + (hit ? 'hit' : 'miss') + '"></i>'; }).join('') + '</span></span>' +
              '<span class="score">' + r.score + '</span></div>';
          }).join('') + '</div>'
        : '<p class="muted">Nobody has played today\'s challenge yet.</p>';
    } else {
      var all = aggregate();
      body = all.length
        ? '<div class="board">' + all.map(function (r, i) {
            return '<div class="board-row' + (r.mine ? ' current' : '') + '">' +
              '<span class="rank">' + (i + 1) + '</span>' +
              '<span class="name">' + esc(r.name) + ' <span class="sub">' + r.days + ' day' + (r.days === 1 ? '' : 's') +
              ' · ' + Math.round(r.correct / r.total * 100) + '% right · best ' + r.best + '</span></span>' +
              '<span class="score">' + r.points + '</span></div>';
          }).join('') + '</div>'
        : '<p class="muted">Totals appear after the first Daily Challenge.</p>';
    }
    return topbar('<button class="btn-small" data-action="home">Home</button>') +
      '<section class="card">' +
        '<div class="q-meta"><h1>Leaderboard</h1><span class="progress">Daily #' + Daily.number(date) + '</span></div>' +
        '<div class="seg" role="tablist">' +
          '<button data-action="board-tab" data-value="today" aria-pressed="' + (tab === 'today') + '">Today</button>' +
          '<button data-action="board-tab" data-value="all" aria-pressed="' + (tab === 'all') + '">All time</button>' +
        '</div>' + body +
        '<p class="small muted">Daily Challenge points only, since everyone gets the same questions. ' +
          (Store.cloud && Store.user() ? 'Everyone signed in shows up here.' : 'This lists people who played on this device.') + '</p>' +
      '</section>';
  }

  function viewDailyResult() {
    var result = todaysDaily();
    return topbar('') +
      '<section class="card winner">' +
        '<p class="crown">Daily Challenge #' + result.number + '</p>' +
        '<h1>' + result.correct + ' out of ' + result.total + '</h1>' +
        '<div class="stat-grid" style="width:100%">' +
          '<div class="stat"><div class="v">' + result.score + '</div><div class="k">points</div></div>' +
          '<div class="stat"><div class="v">' + state.game.players[0].bestStreak + '</div><div class="k">best run</div></div>' +
          '<div class="stat"><div class="v">' + dailyStreak() + '</div><div class="k">day streak</div></div>' +
        '</div>' +
      '</section>' +
      '<section class="card">' + shareBlock(result) +
        '<button data-action="board">See the leaderboard</button>' +
        '<button class="btn-ghost" data-action="home">Back to home</button>' +
      '</section>';
  }

  function viewSetup() {
    var s = state.setup;
    var pool = poolSize();
    var needed = s.players.length * s.perPlayer;

    var players = s.players.map(function (name, i) {
      return '<span class="chip">' + esc(name) +
        '<button data-action="remove-player" data-index="' + i + '" aria-label="Remove ' + esc(name) + '">×</button></span>';
    }).join('');

    var cats = CATEGORIES.map(function (c) {
      var on = s.categories.indexOf(c.id) !== -1;
      return '<button class="cat-tile" data-cat="' + c.id + '" data-action="toggle-cat" data-id="' + c.id + '" aria-pressed="' + on + '">' +
        '<span class="dot"></span><span class="name">' + esc(c.name) + '</span>' +
        '<span class="count">' + countFor(c.id) + '</span></button>';
    }).join('');

    var perOptions = [3, 5, 10].map(function (n) {
      return '<button data-action="per" data-value="' + n + '" aria-pressed="' + (s.perPlayer === n) + '">' + n + '</button>';
    }).join('');

    var timerOptions = [[0, 'Off'], [15, '15s'], [20, '20s'], [30, '30s']].map(function (o) {
      return '<button data-action="timer" data-value="' + o[0] + '" aria-pressed="' + (s.timer === o[0]) + '">' + o[1] + '</button>';
    }).join('');

    var history = state.history.length
      ? '<div class="list">' + state.history.map(function (g) {
          var top = g.players[0];
          return '<div class="list-item"><div class="main"><p><strong>' + esc(g.winner) + '</strong> won with ' + top.score + '</p>' +
            '<p class="small muted">' + g.players.length + ' player' + (g.players.length === 1 ? '' : 's') + ' · ' + g.questionCount + ' questions</p></div>' +
            '<span class="small muted">' + esc(formatDate(g.playedAt)) + '</span></div>';
        }).join('') + '</div>' +
        '<button class="btn-ghost btn-small' + (state.clearArmed ? ' btn-danger' : '') + '" data-action="clear-history">' +
        (state.clearArmed ? 'Tap again to clear' : 'Clear history') + '</button>'
      : '<p class="small muted">Finished games show up here.</p>';

    return topbar('<button class="btn-small" data-action="home">Home</button>') +
      '<section class="card">' +
        '<h1>Who\'s playing tonight?</h1>' +
        '<p class="muted">Pass one phone around. Everyone answers their own questions, fastest right answers score the most.</p>' +
        '<div class="field"><label class="label" for="player-name">Players (' + s.players.length + '/' + MAX_PLAYERS + ')</label>' +
          '<form class="field-row" data-form="add-player">' +
            '<input type="text" id="player-name" maxlength="20" placeholder="Add a name" autocomplete="off"' + (s.players.length >= MAX_PLAYERS ? ' disabled' : '') + '>' +
            '<button type="submit"' + (s.players.length >= MAX_PLAYERS ? ' disabled' : '') + '>Add</button>' +
          '</form>' +
          '<div class="chips">' + (players || '<span class="small muted">No players yet.</span>') + '</div>' +
        '</div>' +
        '<div class="field"><div class="row" style="justify-content:space-between"><span class="label">Categories (' + s.categories.length + '/' + CATEGORIES.length + ')</span>' +
          '<span class="row"><button class="btn-ghost btn-small" data-action="cats-all">All</button><button class="btn-ghost btn-small" data-action="cats-none">None</button></span></div>' +
          '<div class="cat-grid">' + cats + '</div></div>' +
        '<div class="settings">' +
          '<div class="field"><span class="label">Questions each</span><div class="seg">' + perOptions + '</div></div>' +
          '<div class="field"><span class="label">Timer</span><div class="seg">' + timerOptions + '</div></div>' +
        '</div>' +
        (needed > pool && s.players.length
          ? '<p class="notice">Only ' + pool + ' questions in these categories, so each player gets ' + Math.floor(pool / s.players.length) + '.</p>'
          : '') +
        (state.setupError ? '<p class="error">' + esc(state.setupError) + '</p>' : '') +
        '<button class="btn-primary" data-action="start">Start game</button>' +
      '</section>' +
      '<section class="card"><h2>Recent games</h2>' + history + '</section>' +
      '<p class="footer-note">Scores and your own questions are saved on this device only.</p>';
  }

  function viewHandoff() {
    var g = state.game;
    var p = currentPlayer();
    var item = g.questions[g.index];
    return topbar(quitButton()) +
      '<section class="card handoff" data-cat="' + item.q.category + '">' +
        '<p class="label">Pass the phone to</p>' +
        '<p class="who">' + esc(p.name) + '</p>' +
        '<span class="cat-badge">' + esc(catName(item.q.category)) + '</span>' +
        '<p class="progress">' + progressText() + (g.timer ? ' · ' + g.timer + 's on the clock' : '') + '</p>' +
        '<button class="btn-primary" data-action="ready">I\'m ready</button>' +
      '</section>' +
      '<section class="card"><h2>Scoreboard</h2>' + scoreboard(p) + '</section>';
  }

  function answersHtml(reveal) {
    var g = state.game;
    var item = g.questions[g.index];
    return '<div class="answers">' + item.options.map(function (opt, i) {
      var cls = 'answer';
      var mark = '';
      if (reveal) {
        if (opt === item.q.answer) { cls += ' correct'; mark = 'Correct'; }
        else if (i === g.picked) { cls += ' wrong'; mark = 'Your pick'; }
        else cls += ' dim';
      }
      return '<button class="' + cls + '" data-action="answer" data-index="' + i + '"' + (reveal ? ' disabled' : '') + '>' +
        '<span class="key">' + KEYS[i] + '</span><span class="text">' + esc(opt) + '</span>' +
        (mark ? '<span class="mark">' + mark + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }

  function questionHeader() {
    var g = state.game;
    var item = g.questions[g.index];
    var p = currentPlayer();
    var d = item.q.difficulty || 2;
    var featured = item.q.category === g.featured;
    var nextX = Scoring.streakMultiplier(p.streak + 1);
    var tags = '<span class="tag diff-' + d + '">' + Scoring.LABEL[d] + ' · ' + Scoring.BASE[d] + '</span>' +
      (featured ? '<span class="tag tag-featured">Category of the day ×' + Scoring.FEATURED_BONUS + '</span>' : '') +
      (nextX > 1 ? '<span class="tag tag-streak">Streak ×' + nextX + '</span>' : '');
    return '<div class="q-meta"><span class="cat-badge">' + esc(catName(item.q.category)) + (item.q.custom ? ' · Custom' : '') + '</span>' +
      '<span class="progress">' + esc(p.name) + ' · ' + progressText() + '</span></div>' +
      '<div class="tags">' + tags + '</div>' +
      '<p class="q-text">' + esc(item.q.q) + '</p>';
  }

  function breakdown(sc) {
    var parts = [sc.base + ' base'];
    if (sc.speed) parts.push('+' + sc.speed + ' speed');
    var line = parts.join(' ');
    if (sc.streakX > 1) line += ' · ×' + sc.streakX + ' streak';
    if (sc.featuredX > 1) line += ' · ×' + sc.featuredX + ' category of the day';
    return '<span class="breakdown">' + line + '</span>';
  }

  function viewQuestion() {
    var g = state.game;
    var item = g.questions[g.index];
    var timer = g.timer
      ? '<div class="timer" aria-label="Time left"><div class="timer-track"><div class="timer-fill" id="timer-fill"></div></div>' +
        '<span class="timer-text" id="timer-text">' + g.timer + 's</span></div>'
      : '';
    return topbar(quitButton()) +
      '<section class="card question-card" data-cat="' + item.q.category + '">' +
        questionHeader() + timer + answersHtml(false) +
        '<p class="small muted">Tip: press 1–4 or A–D on a keyboard.</p>' +
      '</section>';
  }

  function viewReveal() {
    var g = state.game;
    var item = g.questions[g.index];
    var p = currentPlayer();
    var right = g.points > 0;
    var timedOut = g.picked === null;
    var last = g.index + 1 >= g.questions.length;
    var nextName = last ? '' : g.players[(g.index + 1) % g.players.length].name;

    var verdict = right
      ? '<div class="verdict good"><strong>Correct</strong><span class="pts">+' + g.points + '</span>' + breakdown(g.lastScore) + '</div>'
      : '<div class="verdict bad"><strong>' + (timedOut ? 'Time\'s up' : 'Not quite') + '</strong><span>Answer: ' + esc(item.q.answer) + '</span></div>';

    var streak = right && p.streak >= 3 ? '<p class="small muted">' + esc(p.name) + ' is on a ' + p.streak + '-answer streak.</p>' : '';

    var nextLabel = last ? 'See final scores' : (g.players.length > 1 ? 'Next: ' + esc(nextName) : 'Next question');

    return topbar(quitButton()) +
      '<section class="card question-card" data-cat="' + item.q.category + '">' +
        questionHeader() + verdict + unlockBanner(g.unlock, p.name) + answersHtml(true) + streak +
        '<button class="btn-primary" data-action="next">' + nextLabel + '</button>' +
      '</section>' +
      '<section class="card"><h2>Scoreboard</h2>' + scoreboard(p) + '</section>';
  }

  function viewResults() {
    var g = state.game;
    var order = ranked(g.players);
    var top = order[0];
    var leaders = order.filter(function (p) { return p.score === top.score && p.correct === top.correct; });
    var tied = leaders.length > 1;
    var accuracy = top.answered ? Math.round(top.correct / top.answered * 100) : 0;

    return topbar('') +
      '<section class="card winner">' +
        '<p class="crown">' + (tied ? 'It\'s a tie' : (order.length > 1 ? 'Winner' : 'Final score')) + '</p>' +
        '<h1>' + leaders.map(function (p) { return esc(p.name); }).join(' &amp; ') + '</h1>' +
        '<div class="stat-grid" style="width:100%">' +
          '<div class="stat"><div class="v">' + top.score + '</div><div class="k">points</div></div>' +
          '<div class="stat"><div class="v">' + accuracy + '%</div><div class="k">correct</div></div>' +
          '<div class="stat"><div class="v">' + top.bestStreak + '</div><div class="k">best streak</div></div>' +
        '</div>' +
        (g.shortened ? '<p class="small muted">Played ' + g.perPlayer + ' each because the question pool ran out.</p>' : '') +
      '</section>' +
      '<section class="card"><h2>Final standings</h2>' + scoreboard(null) +
        '<div class="stack"><button class="btn-primary" data-action="rematch">Rematch</button>' +
        '<button data-action="setup">Change players or categories</button></div>' +
      '</section>';
  }

  function viewBank() {
    var options = CATEGORIES.map(function (c) {
      return '<option value="' + c.id + '">' + esc(c.name) + '</option>';
    }).join('');

    var list = state.custom.length
      ? '<div class="list">' + state.custom.slice().reverse().map(function (q) {
          return '<div class="list-item" data-cat="' + esc(q.category) + '"><div class="main">' +
            '<p class="small muted"><span class="pill-dot"></span>' + esc(catName(q.category)) + '</p>' +
            '<p><strong>' + esc(q.q) + '</strong></p>' +
            '<p class="small muted">Answer: ' + esc(q.answer) + '</p></div>' +
            '<button class="btn-small btn-ghost btn-danger" data-action="delete-q" data-id="' + esc(q.id) + '">Delete</button></div>';
        }).join('') + '</div>'
      : '<p class="small muted">No custom questions yet. Add one above and it joins the mix in its category.</p>';

    var counts = CATEGORIES.map(function (c) {
      return '<span class="chip" data-cat="' + c.id + '" style="padding-right:12px"><span class="pill-dot"></span>' + esc(c.name) + ' · ' + countFor(c.id) + '</span>';
    }).join('');

    return topbar('<button class="btn-small" data-action="home">Home</button>') +
      '<section class="card">' +
        '<h1>Question bank</h1>' +
        '<div class="chips">' + counts + '</div>' +
        '<form class="stack" data-form="add-question">' +
          '<div class="settings">' +
            '<div class="field"><label class="label" for="q-cat">Category</label><select id="q-cat">' + options + '</select></div>' +
            '<div class="field"><label class="label" for="q-diff">Difficulty</label><select id="q-diff">' +
              '<option value="1">Easy · 100</option><option value="2" selected>Medium · 200</option><option value="3">Hard · 300</option>' +
            '</select></div>' +
          '</div>' +
          '<div class="field"><label class="label" for="q-text">Question</label><textarea id="q-text" rows="2" maxlength="200" placeholder="What is the normal adult oral temperature in °F?"></textarea></div>' +
          '<div class="field"><label class="label" for="q-answer">Right answer</label><input type="text" id="q-answer" maxlength="80" placeholder="98.6°F"></div>' +
          '<div class="field"><span class="label">Wrong answers</span><div class="wrong-grid">' +
            '<input type="text" id="q-wrong-1" maxlength="80" placeholder="96.6°F" aria-label="Wrong answer 1">' +
            '<input type="text" id="q-wrong-2" maxlength="80" placeholder="100.4°F" aria-label="Wrong answer 2">' +
            '<input type="text" id="q-wrong-3" maxlength="80" placeholder="101.2°F" aria-label="Wrong answer 3">' +
          '</div></div>' +
          (state.bankError ? '<p class="error">' + esc(state.bankError) + '</p>' : '') +
          '<button class="btn-primary" type="submit">Add question</button>' +
        '</form>' +
      '</section>' +
      '<section class="card"><h2>Your questions (' + state.custom.length + ')</h2>' + list + '</section>';
  }

  // ---------- category rewards ----------

  function medal(category, lvl, locked) {
    var tier = lvl >= 0 ? Rewards.TIERS[lvl].name.toLowerCase() : 'none';
    return '<span class="medal tier-' + tier + (locked ? ' locked' : '') + '" data-cat="' + category + '" aria-hidden="true">' +
      '<span>' + (lvl >= 0 ? ['I', 'II', 'III', 'IV', 'V'][lvl] : '?') + '</span></span>';
  }

  function unlockBanner(unlock, name) {
    if (!unlock) return '';
    return '<div class="unlock" data-cat="' + unlock.category + '">' + medal(unlock.category, unlock.level) +
      '<div><p class="label">' + esc(name) + ' unlocked a ' + unlock.tier + ' reward</p>' +
      '<p class="unlock-item">' + esc(unlock.item) + '</p>' +
      '<p class="small muted">' + unlock.need + ' right in ' + esc(catName(unlock.category)) + '</p></div></div>';
  }

  function earnedCount(tallies) {
    var n = 0;
    Object.keys(tallies || {}).forEach(function (cat) {
      if (Rewards.ITEMS[cat]) n += Rewards.level(tallies[cat]) + 1;
    });
    return n;
  }

  function trophyCard() {
    var key = myTallyKey();
    var mine = key ? state.tallies[key] || {} : {};
    var earned = earnedCount(mine);
    // Show the three best items so far, or what is closest to unlocking.
    var best = CATEGORIES.map(function (c) {
      var count = mine[c.id] || 0;
      return { cat: c.id, count: count, lvl: Rewards.level(count) };
    }).filter(function (x) { return x.lvl >= 0; })
      .sort(function (a, b) { return b.lvl - a.lvl || b.count - a.count; }).slice(0, 3);
    var shelf = best.length
      ? '<div class="shelf">' + best.map(function (x) {
          var r = Rewards.reward(x.cat, x.lvl);
          return '<div class="shelf-item" data-cat="' + x.cat + '">' + medal(x.cat, x.lvl) + '<span>' + esc(r.item) + '</span></div>';
        }).join('') + '</div>'
      : '<p class="muted">Get 5 right in any category to earn its first reward. Every category has five, from ' +
        esc(Rewards.ITEMS.nursing[0]) + ' up to ' + esc(Rewards.ITEMS.nursing[4]) + ' in Nursing &amp; Health.</p>';
    return '<section class="card">' +
      '<div class="q-meta"><h2>Trophy case</h2><span class="progress">' + earned + ' of ' + Rewards.total() + '</span></div>' +
      shelf + '<button data-action="trophies">Open trophy case</button></section>';
  }

  function viewTrophies() {
    var myKey = myTallyKey();
    var key = state.trophyKey || myKey;
    var keys = Object.keys(state.tallies).filter(function (k) { return earnedCount(state.tallies[k]) > 0 || k === myKey; });
    var nameOf = function (k) {
      if (k.indexOf('uid:') === 0) return Store.user() ? Store.user().name : 'You';
      var n = k.slice(5);
      return n.charAt(0).toUpperCase() + n.slice(1);
    };
    var picker = keys.length > 1
      ? '<div class="chips">' + keys.map(function (k) {
          return '<button class="btn-small' + (k === key ? ' chip-on' : '') + '" data-action="trophies" data-key="' + esc(k) + '">' + esc(nameOf(k)) + '</button>';
        }).join('') + '</div>'
      : '';
    var mine = (key && state.tallies[key]) || {};
    var rows = CATEGORIES.map(function (c) {
      var count = mine[c.id] || 0;
      var lvl = Rewards.level(count);
      var have = Rewards.reward(c.id, lvl);
      var next = Rewards.next(c.id, count);
      var prevNeed = lvl >= 0 ? Rewards.TIERS[lvl].need : 0;
      var pct = next ? Math.round((count - prevNeed) / (next.need - prevNeed) * 100) : 100;
      var ladder = Rewards.ITEMS[c.id].map(function (item, i) {
        return '<li class="' + (i <= lvl ? 'got' : '') + '">' + esc(item) + '</li>';
      }).join('');
      return '<div class="trophy-row" data-cat="' + c.id + '">' +
        medal(c.id, lvl, lvl < 0) +
        '<div class="trophy-main">' +
          '<p class="label">' + esc(c.name) + ' · ' + count + ' right</p>' +
          '<p class="trophy-item">' + (have ? esc(have.item) + ' <span class="tier-name">' + have.tier + '</span>' : 'Nothing yet') + '</p>' +
          (next
            ? '<div class="meter"><div style="width:' + pct + '%"></div></div>' +
              '<p class="small muted">' + (next.need - count) + ' more for ' + esc(next.item) + '</p>'
            : '<p class="small muted">Every reward in this category unlocked.</p>') +
          '<ol class="ladder">' + ladder + '</ol>' +
        '</div></div>';
    }).join('');
    return topbar('<button class="btn-small" data-action="home">Home</button>') +
      '<section class="card">' +
        '<div class="q-meta"><h1>Trophy case</h1><span class="progress">' + earnedCount(mine) + ' of ' + Rewards.total() + '</span></div>' +
        (key ? '' : '<p class="notice">Play the Daily Challenge once so the game knows your name, then your rewards show here.</p>') +
        picker +
        '<p class="small muted">Rewards unlock at ' + Rewards.TIERS.map(function (t) { return t.need; }).join(', ') +
          ' right answers in a category, in any mode.</p>' +
        '<div class="trophies">' + rows + '</div>' +
      '</section>';
  }

  // ---------- players, avatars and trash talk ----------

  function myAvatar() {
    return state.profile.avatar || Avatar.forName(state.profileName || 'Player');
  }

  function avatarFor(player) {
    return player.avatar || Avatar.forName(player.name);
  }

  function unreadMentions() {
    var u = Store.user();
    if (!u || !state.board) return 0;
    return state.board.filter(function (m) {
      return m.uid !== u.uid && m.at > state.boardSeenAt && m.mentions.indexOf(u.uid) !== -1;
    }).length;
  }

  function homeNav() {
    var badge = unreadMentions();
    return '<nav class="home-nav" aria-label="Sections">' +
      '<button data-action="board">Leaderboard</button>' +
      '<button data-action="players">Players</button>' +
      '<button data-action="talk">Trash talk' + (badge ? ' <span class="badge">' + badge + '</span>' : '') + '</button>' +
      '<button data-action="trophies">Trophy case</button>' +
      '<button class="nav-avatar" data-action="avatar">' + Avatar.svg(myAvatar(), 28, state.profileName) + 'My avatar</button>' +
      '</nav>';
  }

  function showcaseHtml(list) {
    if (!list || !list.length) return '';
    return '<div class="showcase">' + list.map(function (id) {
      var parts = id.split(':');
      var r = Rewards.reward(parts[0], Number(parts[1]));
      if (!r) return '';
      return '<span class="show-item" data-cat="' + r.category + '" title="' + esc(r.tier + ' · ' + catName(r.category)) + '">' +
        medal(r.category, r.level) + '<span>' + esc(r.item) + '</span></span>';
    }).join('') + '</div>';
  }

  // Rewards this player has unlocked, as 'category:level' ids.
  function unlockedIds(tallies) {
    var out = [];
    CATEGORIES.forEach(function (c) {
      var lvl = Rewards.level((tallies || {})[c.id] || 0);
      for (var i = lvl; i >= 0; i--) out.push(c.id + ':' + i);
    });
    return out.sort(function (a, b) { return Number(b.split(':')[1]) - Number(a.split(':')[1]); });
  }

  function viewAvatar() {
    var a = state.avatarDraft || (state.avatarDraft = Avatar.normalize(myAvatar()));
    var picks = state.showcaseDraft || (state.showcaseDraft = (state.profile.showcase || []).slice());
    var rows = Avatar.ORDER.map(function (k) {
      var opts = Avatar.OPTIONS[k].map(function (v) {
        var on = a[k] === v;
        var inner;
        if (k === 'skin' || k === 'hairColor' || k === 'shirt' || k === 'eyes') inner = '<span class="swatch-dot" style="background:' + v + '"></span>';
        else if (k === 'body') inner = v === 'person' ? 'Person' : '<span class="item-emoji" aria-hidden="true">' + Avatar.ITEMS[v].emoji + '</span>' + esc(Avatar.ITEMS[v].name);
        else if (k === 'item') inner = (Avatar.ITEMS[v].emoji ? '<span class="item-emoji" aria-hidden="true">' + Avatar.ITEMS[v].emoji + '</span>' : '') + esc(Avatar.ITEMS[v].name);
        else if (k === 'bg') inner = '<span class="swatch-dot" data-cat="' + v + '" style="background:var(--cat)"></span>' + esc(catName(v));
        else inner = esc(v.charAt(0).toUpperCase() + v.slice(1));
        return '<button class="swatch" data-action="avatar-set" data-key="' + k + '" data-value="' + esc(v) + '" aria-pressed="' + on + '"' +
          ' aria-label="' + esc(Avatar.LABELS[k] + ' ' + v) + '">' + inner + '</button>';
      }).join('');
      return '<div class="field"><span class="label">' + Avatar.LABELS[k] + (k === 'item' ? ' · ' + (Avatar.OPTIONS.item.length - 1) + ' objects' : '') + '</span>' +
        '<div class="chips' + (k === 'item' || k === 'body' ? ' item-grid' : '') + '">' + opts + '</div></div>';
    }).join('');

    var key = myTallyKey();
    var owned = unlockedIds(key ? state.tallies[key] : {});
    var showcase = owned.length
      ? '<div class="chips">' + owned.map(function (id) {
          var parts = id.split(':');
          var r = Rewards.reward(parts[0], Number(parts[1]));
          var on = picks.indexOf(id) !== -1;
          return '<button class="swatch" data-cat="' + r.category + '" data-action="showcase-toggle" data-value="' + id + '" aria-pressed="' + on + '">' +
            medal(r.category, r.level) + esc(r.item) + '</button>';
        }).join('') + '</div>'
      : '<p class="small muted">Unlock rewards by getting 5 right in a category, then pick up to three to show off here.</p>';

    var needName = !Store.user();
    return topbar('<button class="btn-small" data-action="home">Home</button>') +
      '<section class="card avatar-card">' +
        '<h1>My avatar</h1>' +
        '<div class="avatar-preview">' + Avatar.svg(a, 132, state.profileName) +
          '<div class="stack"><p class="trophy-item">' + esc(state.profileName || 'Your name') + '</p>' + showcaseHtml(picks) + '</div></div>' +
        (needName ? '<div class="field"><label class="label" for="avatar-name">Your name</label>' +
          '<input type="text" id="avatar-name" maxlength="20" autocomplete="off" value="' + esc(state.profileName) + '"></div>' : '') +
        rows +
        '<div class="field"><span class="label">Show off (' + picks.length + '/3)</span>' + showcase + '</div>' +
        '<button class="btn-primary" data-action="avatar-save">Save avatar</button>' +
      '</section>';
  }

  function strengthRows(player) {
    var rows = CATEGORIES.map(function (c) {
      var right = player.tallies[c.id] || 0;
      var seen = Math.max(player.seen[c.id] || 0, right);
      return { cat: c.id, right: right, seen: seen, acc: seen ? Math.round(right / seen * 100) : null };
    }).sort(function (a, b) { return b.right - a.right || (b.acc || 0) - (a.acc || 0); });
    return rows;
  }

  function strengthChart(player) {
    var rows = strengthRows(player);
    var max = Math.max.apply(null, rows.map(function (r) { return r.right; }).concat([1]));
    return '<div class="strength" role="table" aria-label="Right answers by category">' + rows.map(function (r, i) {
      var tip = catName(r.cat) + ': ' + r.right + ' right' + (r.seen ? ' of ' + r.seen + ' (' + r.acc + '%)' : ', not played yet');
      return '<div class="strength-row' + (r.seen ? '' : ' empty') + '" data-cat="' + r.cat + '" role="row" title="' + esc(tip) + '">' +
        '<span class="strength-name" role="cell">' + esc(catName(r.cat)) + (i < 3 && r.right ? ' <span class="tag">Strong</span>' : '') + '</span>' +
        '<span class="strength-track" role="cell">' + (r.right ? '<span class="strength-bar" style="width:' + (r.right / max * 100) + '%"></span>' : '') + '</span>' +
        '<span class="strength-val" role="cell">' + (r.seen ? r.right + ' <span class="sub">' + r.acc + '%</span>' : '<span class="sub">none</span>') + '</span>' +
        '</div>';
    }).join('') + '</div>';
  }

  function playerTotals(player) {
    var right = 0, seen = 0;
    CATEGORIES.forEach(function (c) {
      right += player.tallies[c.id] || 0;
      seen += Math.max(player.seen[c.id] || 0, player.tallies[c.id] || 0);
    });
    return { right: right, seen: seen, acc: seen ? Math.round(right / seen * 100) : 0, trophies: earnedCount(player.tallies) };
  }

  function loadPlayers() {
    return Store.listPlayers().then(function (list) {
      state.players = list.sort(function (a, b) { return playerTotals(b).right - playerTotals(a).right; });
    });
  }

  function viewPlayers() {
    var list = state.players;
    var body = !list
      ? '<p class="muted">Loading players…</p>'
      : !list.length
        ? '<p class="muted">Players show up here after they answer their first question.</p>'
        : '<div class="list">' + list.map(function (p) {
            var t = playerTotals(p);
            var top = strengthRows(p)[0];
            return '<button class="player-row" data-action="player" data-key="' + esc(p.key) + '">' +
              Avatar.svg(avatarFor(p), 48, p.name) +
              '<span class="main"><strong>' + esc(p.name) + '</strong>' +
                '<span class="small muted">' + t.right + ' right · ' + t.trophies + ' trophies' +
                (top && top.right ? ' · best at ' + esc(catName(top.cat)) : '') + '</span>' +
                showcaseHtml(p.showcase) + '</span></button>';
          }).join('') + '</div>';
    return topbar('<button class="btn-small" data-action="home">Home</button>') +
      '<section class="card"><h1>Players</h1>' + body +
        (Store.cloud && Store.user() ? '' : '<p class="small muted">This shows players on this device. The online version shows everyone signed in.</p>') +
      '</section>';
  }

  function viewPlayer() {
    var p = (state.players || []).filter(function (x) { return x.key === state.viewPlayer; })[0];
    if (!p) return viewPlayers();
    var t = playerTotals(p);
    return topbar('<button class="btn-small" data-action="players">All players</button>') +
      '<section class="card">' +
        '<div class="avatar-preview">' + Avatar.svg(avatarFor(p), 112, p.name) +
          '<div class="stack"><h1>' + esc(p.name) + '</h1>' + showcaseHtml(p.showcase) + '</div></div>' +
        '<div class="stat-grid">' +
          '<div class="stat"><div class="v">' + t.right + '</div><div class="k">right answers</div></div>' +
          '<div class="stat"><div class="v">' + t.acc + '%</div><div class="k">accuracy</div></div>' +
          '<div class="stat"><div class="v">' + t.trophies + '</div><div class="k">trophies</div></div>' +
        '</div>' +
      '</section>' +
      '<section class="card"><h2>Category strength</h2>' +
        '<p class="small muted">Bars show right answers in each category. The percentage is how often they get it right.</p>' +
        strengthChart(p) +
      '</section>';
  }

  function timeAgo(ms) {
    var m = Math.round((Date.now() - ms) / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + 'm ago';
    var h = Math.round(m / 60);
    if (h < 24) return h + 'h ago';
    return Math.round(h / 24) + 'd ago';
  }

  function withMentions(text) {
    var html = esc(text);
    var u = Store.user();
    (state.players || []).slice().sort(function (a, b) { return b.name.length - a.name.length; }).forEach(function (p) {
      var pattern = new RegExp('@' + esc(p.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w])', 'gi');
      html = html.replace(pattern, function (m) {
        return '<span class="mention' + (u && p.uid === u.uid ? ' me' : '') + '">' + m + '</span>';
      });
    });
    return html;
  }

  function viewTalk() {
    var u = Store.user();
    if (!Store.cloud || !u) {
      return topbar('<button class="btn-small" data-action="home">Home</button>') +
        '<section class="card"><h1>Trash talk</h1><p class="muted">The trash-talk board lives on the online version, where everyone is signed in: ' +
        '<a href="https://humanvue.github.io/Humanvue/">humanvue.github.io/Humanvue</a></p>' +
        (Store.cloud ? signInButton('Sign in with Google') : '') + '</section>';
    }
    var byUid = {};
    (state.players || []).forEach(function (p) { if (p.uid) byUid[p.uid] = p; });
    var msgs = state.board;
    var list = !msgs
      ? '<p class="muted">Loading…</p>'
      : !msgs.length
        ? '<p class="muted">No trash talk yet. Start it off.</p>'
        : msgs.map(function (m) {
            var who = byUid[m.uid] || { name: m.name };
            var mine = m.uid === u.uid;
            return '<div class="msg' + (m.mentions.indexOf(u.uid) !== -1 && !mine ? ' mentions-me' : '') + '">' +
              Avatar.svg(avatarFor(who), 36, m.name) +
              '<div class="main"><p class="msg-head"><strong>' + esc(m.name) + '</strong> <span class="small muted">' + timeAgo(m.at) + '</span>' +
              (mine ? ' <button class="btn-ghost btn-small" data-action="talk-delete" data-id="' + esc(m.id) + '">Delete</button>' : '') + '</p>' +
              '<p class="msg-text">' + withMentions(m.text) + '</p></div></div>';
          }).join('');
    return topbar('<button class="btn-small" data-action="home">Home</button>') +
      '<section class="card"><h1>Trash talk</h1>' +
        '<p class="small muted">One public board for the whole squad. Type @ to call someone out. There are no private messages.</p>' +
        '<div class="msgs" id="msgs">' + list + '</div>' +
        '<form class="stack" data-form="talk">' +
          '<textarea id="talk-text" rows="2" maxlength="280" placeholder="Say something about @someone\'s score…" aria-label="Message"></textarea>' +
          '<div class="chips" id="mention-list"></div>' +
          '<button class="btn-primary" type="submit">Post</button>' +
        '</form>' +
      '</section>';
  }

  // Suggest players while someone types "@na…".
  function updateMentionList() {
    var box = document.getElementById('mention-list');
    var field = document.getElementById('talk-text');
    if (!box || !field) return;
    var before = field.value.slice(0, field.selectionStart);
    var m = before.match(/@([^\s@]{0,20})$/);
    if (!m) { box.innerHTML = ''; return; }
    var q = m[1].toLowerCase();
    var me = Store.user();
    box.innerHTML = (state.players || []).filter(function (p) {
      return (!me || p.uid !== me.uid) && p.name.toLowerCase().indexOf(q) === 0;
    }).slice(0, 6).map(function (p) {
      return '<button type="button" class="swatch" data-action="mention-pick" data-name="' + esc(p.name) + '">@' + esc(p.name) + '</button>';
    }).join('');
  }

  var boardStop = null;

  function watchBoard() {
    if (boardStop) { boardStop(); boardStop = null; }
    state.board = null;
    if (!Store.board || !Store.user()) return;
    boardStop = Store.board.watch(function (msgs) {
      state.board = msgs || [];
      if (state.screen === 'talk') {
        markBoardSeen();
        render();
        var box = document.getElementById('msgs');
        if (box) box.scrollTop = box.scrollHeight;
      } else if (state.screen === 'home') {
        render();
      }
    });
  }

  function markBoardSeen() {
    state.boardSeenAt = Date.now();
    try { window.localStorage.setItem('trivia.boardSeen.v1', String(state.boardSeenAt)); } catch (e) { /* per visit */ }
  }

  // ---------- live game ----------

  var LIVE_QUESTIONS = 10;
  var liveStop = null;
  var liveTimer = null;

  function myUid() {
    var u = Store.user();
    return u ? u.uid : null;
  }

  function liveReset() {
    if (liveStop) liveStop();
    if (liveTimer) clearInterval(liveTimer);
    liveStop = null;
    liveTimer = null;
    state.live = null;
  }

  function liveFail(e) {
    state.liveBusy = false;
    state.liveError = (e && e.message) || 'Could not reach the game. Check your connection and try again.';
    render();
  }

  function hostLive() {
    var cats = state.setup.categories;
    if (!cats.length) { state.liveError = 'Pick at least one category under Pass & Play first.'; return render(); }
    var pool = shuffle(allQuestions().filter(function (q) { return cats.indexOf(q.category) !== -1; }));
    var questions = pool.slice(0, LIVE_QUESTIONS).map(function (q) {
      return { q: q, options: shuffle([q.answer].concat(q.wrong)) };
    });
    state.liveError = '';
    state.liveBusy = true;
    render();
    Store.live.create(questions, state.setup.timer || 20, Daily.build(Daily.today()).featured).then(enterLive, liveFail);
  }

  function joinLive(code) {
    code = (code || '').trim().toUpperCase();
    if (!/^[A-Z]{4}$/.test(code)) { state.liveError = 'Enter the 4-letter code from the host.'; return render(); }
    state.liveError = '';
    state.liveBusy = true;
    render();
    Store.live.join(code).then(enterLive, liveFail);
  }

  function enterLive(code) {
    state.liveBusy = false;
    go('live');
    state.live = { code: code, snap: null, seenIndex: -1, deadline: 0, picks: {}, revealing: -1, error: '' };
    liveStop = Store.live.watch(code, onLive, function () {
      if (state.live) state.live.error = 'Lost connection to the game. Check your signal.';
      render();
    });
  }

  function onLive(snap) {
    var L = state.live;
    if (!L) return;
    L.snap = snap;
    var g = snap.game;
    if (g.status === 'question' && g.index !== L.seenIndex) {
      L.seenIndex = g.index;
      L.deadline = Date.now() + g.timer * 1000;
      if (liveTimer) clearInterval(liveTimer);
      liveTimer = setInterval(liveTick, 200);
    }
    if (g.status !== 'question' && liveTimer) { clearInterval(liveTimer); liveTimer = null; }
    maybeReveal();
    if (state.screen === 'live') render();
  }

  function myAnswer(index) {
    var L = state.live;
    if (L.picks.hasOwnProperty(index)) return { choice: L.picks[index] };
    var uid = myUid();
    for (var i = 0; i < L.snap.answers.length; i++) {
      var a = L.snap.answers[i];
      if (a.index === index && a.uid === uid) return a;
    }
    return null;
  }

  function livePlayers() {
    return state.live.snap.players.slice().sort(function (a, b) { return b.score - a.score || b.correct - a.correct; });
  }

  function liveTick() {
    var L = state.live;
    if (!L || !L.snap) return;
    var g = L.snap.game;
    var left = Math.max(0, L.deadline - Date.now());
    var fill = document.getElementById('timer-fill');
    var text = document.getElementById('timer-text');
    if (fill) {
      fill.style.width = (left / (g.timer * 1000) * 100) + '%';
      fill.classList.toggle('low', left < 5000);
    }
    if (text) text.textContent = Math.ceil(left / 1000) + 's';
    if (left <= 0 && g.status === 'question' && !myAnswer(g.index)) liveAnswer(null);
    maybeReveal();
  }

  // The host's phone moves everyone to the answer once all have answered or time is up.
  function maybeReveal() {
    var L = state.live;
    var g = L.snap.game;
    if (g.host !== myUid() || g.status !== 'question' || L.revealing === g.index) return;
    var count = L.snap.answers.filter(function (a) { return a.index === g.index; }).length;
    if (count >= L.snap.players.length || Date.now() > L.deadline + 1500) {
      L.revealing = g.index;
      Store.live.setStatus(L.code, 'reveal');
    }
  }

  function liveAnswer(choice) {
    var L = state.live;
    var g = L.snap.game;
    var i = g.index;
    if (g.status !== 'question' || myAnswer(i)) return;
    L.picks[i] = choice;
    var item = g.questions[i];
    var uid = myUid();
    var mine = L.snap.players.filter(function (p) { return p.uid === uid; })[0] ||
      { score: 0, correct: 0, answered: 0, streak: 0, bestStreak: 0 };
    var right = choice !== null && item.options[choice] === item.answer;
    var timeLeft = Math.max(0, L.deadline - Date.now()) / (g.timer * 1000);
    var sc = right ? Scoring.score(item.difficulty, timeLeft, mine.streak + 1, item.category === g.featured) : null;
    var streak = right ? mine.streak + 1 : 0;
    L.lastScore = sc;
    L.unlock = recordAnswer(Store.user().name, item.category, right);
    L.unlockIndex = i;
    Store.live.answer(L.code, i, choice, sc ? sc.total : 0, {
      score: mine.score + (sc ? sc.total : 0),
      correct: mine.correct + (right ? 1 : 0),
      answered: mine.answered + 1,
      streak: streak,
      bestStreak: Math.max(mine.bestStreak, streak)
    }).catch(function () {
      L.error = 'Your answer did not save. Check your connection.';
      render();
    });
    render();
  }

  function liveAdvance() {
    var L = state.live;
    var g = L.snap.game;
    if (g.status === 'lobby') return Store.live.setStatus(L.code, 'question', 0);
    if (g.index + 1 < g.questions.length) return Store.live.setStatus(L.code, 'question', g.index + 1);
    return Store.live.setStatus(L.code, 'done');
  }

  function liveBoard(roundIndex) {
    var uid = myUid();
    var answers = state.live.snap.answers;
    return '<div class="board">' + livePlayers().map(function (p, i) {
      var round = '';
      if (typeof roundIndex === 'number') {
        var a = answers.filter(function (x) { return x.index === roundIndex && x.uid === p.uid; })[0];
        round = a ? (a.points ? '<span class="round good">+' + a.points + '</span>' : '<span class="round bad">miss</span>')
          : '<span class="round">no answer</span>';
      }
      return '<div class="board-row' + (p.uid === uid ? ' current' : '') + '">' +
        '<span class="rank">' + (i + 1) + '</span>' +
        '<span class="name">' + esc(p.name) + ' <span class="sub">' + p.correct + '/' + p.answered + '</span> ' + round + '</span>' +
        '<span class="score">' + p.score + '</span></div>';
    }).join('') + '</div>';
  }

  function liveHeader(g, item) {
    var d = item.difficulty || 2;
    var uid = myUid();
    var mine = state.live.snap.players.filter(function (p) { return p.uid === uid; })[0];
    var nextX = Scoring.streakMultiplier((mine ? mine.streak : 0) + 1);
    var tags = '<span class="tag diff-' + d + '">' + Scoring.LABEL[d] + ' · ' + Scoring.BASE[d] + '</span>' +
      (item.category === g.featured ? '<span class="tag tag-featured">Category of the day ×' + Scoring.FEATURED_BONUS + '</span>' : '') +
      (nextX > 1 && g.status === 'question' ? '<span class="tag tag-streak">Streak ×' + nextX + '</span>' : '');
    return '<div class="q-meta"><span class="cat-badge">' + esc(catName(item.category)) + (item.custom ? ' · Custom' : '') + '</span>' +
      '<span class="progress">Game ' + esc(state.live.code) + ' · Q ' + (g.index + 1) + ' of ' + g.questions.length + '</span></div>' +
      '<div class="tags">' + tags + '</div>' +
      '<p class="q-text">' + esc(item.q) + '</p>';
  }

  function viewLive() {
    var L = state.live;
    var leave = '<button class="btn-ghost btn-small" data-action="home">Leave game</button>';
    if (!L || !L.snap) {
      return topbar(leave) + '<section class="card"><h2>Connecting to game ' + esc(L ? L.code : '') + '…</h2>' +
        (L && L.error ? '<p class="error">' + esc(L.error) + '</p>' : '') + '</section>';
    }
    var g = L.snap.game;
    var isHost = g.host === myUid();
    var err = L.error ? '<p class="error">' + esc(L.error) + '</p>' : '';

    if (g.status === 'lobby') {
      return topbar(leave) +
        '<section class="card handoff">' +
          '<p class="label">Game code</p>' +
          '<p class="who code">' + esc(L.code) + '</p>' +
          '<p class="muted">Friends open Squad Trivia, sign in, and enter this code under Live Game.</p>' +
          (isHost
            ? '<button class="btn-primary" data-action="live-next">Start with ' + L.snap.players.length + ' player' + (L.snap.players.length === 1 ? '' : 's') + '</button>'
            : '<p class="progress">Waiting for ' + esc(g.hostName) + ' to start</p>') + err +
        '</section>' +
        '<section class="card"><h2>In the lobby</h2>' + liveBoard() + '</section>';
    }

    if (g.status === 'done') {
      var order = livePlayers();
      var top = order[0];
      return topbar('') +
        '<section class="card winner">' +
          '<p class="crown">' + (order.length > 1 ? 'Winner' : 'Final score') + '</p>' +
          '<h1>' + esc(top ? top.name : '') + '</h1>' +
          '<div class="stat-grid" style="width:100%">' +
            '<div class="stat"><div class="v">' + (top ? top.score : 0) + '</div><div class="k">points</div></div>' +
            '<div class="stat"><div class="v">' + (top ? top.correct : 0) + '/' + g.questions.length + '</div><div class="k">correct</div></div>' +
            '<div class="stat"><div class="v">' + (top ? top.bestStreak : 0) + '</div><div class="k">best streak</div></div>' +
          '</div>' +
        '</section>' +
        '<section class="card"><h2>Final standings</h2>' + liveBoard() +
          '<button class="btn-primary" data-action="home">Back to home</button></section>';
    }

    var item = g.questions[g.index];
    var mine = myAnswer(g.index);
    var reveal = g.status === 'reveal';
    var answers = '<div class="answers">' + item.options.map(function (opt, i) {
      var cls = 'answer';
      var mark = '';
      if (reveal) {
        if (opt === item.answer) { cls += ' correct'; mark = 'Correct'; }
        else if (mine && mine.choice === i) { cls += ' wrong'; mark = 'Your pick'; }
        else cls += ' dim';
      } else if (mine) {
        cls += mine.choice === i ? ' picked' : ' dim';
        if (mine.choice === i) mark = 'Locked in';
      }
      return '<button class="' + cls + '" data-action="live-answer" data-index="' + i + '"' + (reveal || mine ? ' disabled' : '') + '>' +
        '<span class="key">' + KEYS[i] + '</span><span class="text">' + esc(opt) + '</span>' +
        (mark ? '<span class="mark">' + mark + '</span>' : '') + '</button>';
    }).join('') + '</div>';

    var answeredCount = L.snap.answers.filter(function (a) { return a.index === g.index; }).length;

    if (!reveal) {
      var left = Math.max(0, L.deadline - Date.now());
      var timer = '<div class="timer" aria-label="Time left"><div class="timer-track"><div class="timer-fill" id="timer-fill" style="width:' +
        (left / (g.timer * 1000) * 100) + '%"></div></div><span class="timer-text" id="timer-text">' + Math.ceil(left / 1000) + 's</span></div>';
      return topbar(leave) +
        '<section class="card question-card" data-cat="' + item.category + '">' +
          liveHeader(g, item) + timer + answers +
          '<p class="progress">' + answeredCount + ' of ' + L.snap.players.length + ' answered' +
            (mine ? '. Waiting for the rest.' : '') + '</p>' + err +
        '</section>';
    }

    var mineRow = L.snap.answers.filter(function (a) { return a.index === g.index && a.uid === myUid(); })[0];
    var pts = mineRow ? mineRow.points : 0;
    var verdict = pts
      ? '<div class="verdict good"><strong>Correct</strong><span class="pts">+' + pts + '</span>' +
          (L.lastScore ? breakdown(L.lastScore) : '') + '</div>'
      : '<div class="verdict bad"><strong>' + (mine && mine.choice !== null ? 'Not quite' : 'Time\'s up') + '</strong><span>Answer: ' + esc(item.answer) + '</span></div>';
    var last = g.index + 1 >= g.questions.length;
    return topbar(leave) +
      '<section class="card question-card" data-cat="' + item.category + '">' +
        liveHeader(g, item) + verdict + (L.unlockIndex === g.index ? unlockBanner(L.unlock, Store.user().name) : '') + answers +
        (isHost
          ? '<button class="btn-primary" data-action="live-next">' + (last ? 'Show final scores' : 'Next question') + '</button>'
          : '<p class="progress">Waiting for ' + esc(g.hostName) + ' to go on</p>') + err +
      '</section>' +
      '<section class="card"><h2>Scoreboard</h2>' + liveBoard(g.index) + '</section>';
  }

  var VIEWS = {
    home: viewHome,
    live: viewLive,
    board: viewBoard,
    trophies: viewTrophies,
    avatar: viewAvatar,
    players: viewPlayers,
    player: viewPlayer,
    talk: viewTalk,
    'daily-result': viewDailyResult,
    setup: viewSetup,
    handoff: viewHandoff,
    question: viewQuestion,
    reveal: viewReveal,
    results: viewResults,
    bank: viewBank
  };

  function render() {
    // Keep a half-typed message when the board refreshes underneath it.
    var draft = document.getElementById('talk-text');
    var keep = draft ? { value: draft.value, focused: document.activeElement === draft, pos: draft.selectionStart } : null;
    app.innerHTML = '<div class="shell">' + VIEWS[state.screen]() + '</div>';
    var again = document.getElementById('talk-text');
    if (keep && again) {
      again.value = keep.value;
      if (keep.focused) { again.focus(); again.setSelectionRange(keep.pos, keep.pos); }
    }
  }

  // ---------- events ----------

  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    var action = el.getAttribute('data-action');
    var s = state.setup;

    if (action !== 'clear-history') state.clearArmed = false;

    switch (action) {
      case 'remove-player':
        s.players.splice(Number(el.getAttribute('data-index')), 1);
        render();
        break;
      case 'toggle-cat': {
        var id = el.getAttribute('data-id');
        var at = s.categories.indexOf(id);
        if (at === -1) s.categories.push(id); else s.categories.splice(at, 1);
        state.setupError = '';
        render();
        break;
      }
      case 'cats-all':
        s.categories = CATEGORIES.map(function (c) { return c.id; });
        state.setupError = '';
        render();
        break;
      case 'cats-none':
        s.categories = [];
        render();
        break;
      case 'per':
        s.perPlayer = Number(el.getAttribute('data-value'));
        render();
        break;
      case 'timer':
        s.timer = Number(el.getAttribute('data-value'));
        render();
        break;
      case 'start':
        startGame();
        break;
      case 'ready':
        showQuestion();
        break;
      case 'answer':
        answer(Number(el.getAttribute('data-index')));
        break;
      case 'next':
        next();
        break;
      case 'quit':
        if (state.quitArmed) { state.game = null; go('home'); }
        else { state.quitArmed = true; el.textContent = 'Tap again to quit'; el.classList.add('btn-danger'); }
        break;
      case 'rematch':
        startGame();
        break;
      case 'home':
        state.bankError = '';
        go('home');
        break;
      case 'setup':
        go('setup');
        break;
      case 'board':
        go('board');
        break;
      case 'theme-toggle':
        state.themeOpen = !state.themeOpen;
        render();
        break;
      case 'theme-mode':
        saveTheme(Object.assign({}, state.theme, { mode: el.getAttribute('data-value') }));
        render();
        break;
      case 'theme-accent':
        saveTheme(Object.assign({}, state.theme, { accent: el.getAttribute('data-value') }));
        render();
        break;
      case 'avatar':
        state.avatarDraft = null;
        state.showcaseDraft = null;
        go('avatar');
        break;
      case 'avatar-set':
        state.avatarDraft[el.getAttribute('data-key')] = el.getAttribute('data-value');
        render();
        break;
      case 'showcase-toggle': {
        var sid = el.getAttribute('data-value');
        var at = state.showcaseDraft.indexOf(sid);
        if (at !== -1) state.showcaseDraft.splice(at, 1);
        else if (state.showcaseDraft.length < 3) state.showcaseDraft.push(sid);
        render();
        break;
      }
      case 'avatar-save': {
        var patch = { avatar: state.avatarDraft, showcase: state.showcaseDraft };
        var nameField = document.getElementById('avatar-name');
        if (nameField && nameField.value.trim()) {
          patch.name = nameField.value.trim();
          state.profileName = patch.name;
        }
        if (!Store.user() && !state.profileName) {
          el.textContent = 'Add your name first';
          break;
        }
        if (!patch.name) patch.name = state.profileName;
        state.profile = { avatar: patch.avatar, showcase: patch.showcase };
        Store.saveProfile(patch);
        state.players = null;
        go('home');
        break;
      }
      case 'players':
        state.players = state.players || null;
        go('players');
        loadPlayers().then(render);
        break;
      case 'player':
        state.viewPlayer = el.getAttribute('data-key');
        go('player');
        break;
      case 'talk':
        markBoardSeen();
        go('talk');
        loadPlayers().then(function () {
          render();
          var box = document.getElementById('msgs');
          if (box) box.scrollTop = box.scrollHeight;
        });
        break;
      case 'mention-pick': {
        var field = document.getElementById('talk-text');
        var pos = field.selectionStart;
        var start = field.value.slice(0, pos).replace(/@[^\s@]*$/, '');
        field.value = start + '@' + el.getAttribute('data-name') + ' ' + field.value.slice(pos);
        var caret = start.length + el.getAttribute('data-name').length + 2;
        field.focus();
        field.setSelectionRange(caret, caret);
        updateMentionList();
        break;
      }
      case 'talk-delete':
        Store.board.remove(el.getAttribute('data-id'));
        break;
      case 'trophies':
        state.trophyKey = el.getAttribute('data-key') || state.trophyKey || myTallyKey();
        go('trophies');
        break;
      case 'sign-in':
        state.signingIn = true;
        render();
        Store.signIn().catch(function () {
          state.liveError = 'Google sign-in did not finish. Try again.';
        }).then(function () { state.signingIn = false; render(); });
        break;
      case 'sign-out':
        Store.signOut();
        break;
      case 'rename':
        state.renaming = true;
        render();
        var r = document.getElementById('rename');
        if (r) r.focus();
        break;
      case 'daily-cloud':
        startDaily(Store.user() ? Store.user().name : '');
        break;
      case 'live-host':
        hostLive();
        break;
      case 'live-answer':
        liveAnswer(Number(el.getAttribute('data-index')));
        break;
      case 'live-next':
        el.disabled = true;
        liveAdvance();
        break;
      case 'board-tab':
        state.boardTab = el.getAttribute('data-value');
        render();
        break;
      case 'switch-player':
        state.profileName = '';
        state.copied = false;
        render();
        var field = document.getElementById('daily-name');
        if (field) field.focus();
        break;
      case 'copy-share': {
        var text = document.getElementById('share-text').textContent;
        var done = function () { state.copied = true; render(); };
        var fallback = function () {
          var range = document.createRange();
          range.selectNodeContents(document.getElementById('share-text'));
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          el.textContent = 'Text selected. Copy it from here';
        };
        try {
          navigator.clipboard.writeText(text).then(done, fallback);
        } catch (err) {
          fallback();
        }
        break;
      }
      case 'bank':
        go('bank');
        break;
      case 'delete-q':
        Store.deleteCustomQuestion(el.getAttribute('data-id')).then(loadCustom).then(render);
        break;
      case 'clear-history':
        if (state.clearArmed) {
          state.clearArmed = false;
          Store.clearGames().then(loadHistory).then(render);
        } else {
          state.clearArmed = true;
          render();
        }
        break;
    }
  });

  app.addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target.getAttribute('data-form');

    if (form === 'add-player') {
      var input = document.getElementById('player-name');
      var name = input.value.trim();
      var s = state.setup;
      if (!name) return;
      if (s.players.some(function (p) { return p.toLowerCase() === name.toLowerCase(); })) {
        state.setupError = name + ' is already playing. Try a nickname.';
      } else if (s.players.length < MAX_PLAYERS) {
        s.players.push(name);
        state.setupError = '';
      }
      render();
      var again = document.getElementById('player-name');
      if (again && !again.disabled) again.focus();
    }

    if (form === 'talk') {
      var box = document.getElementById('talk-text');
      var text = box.value.trim().slice(0, 280);
      if (!text) return;
      var lower = text.toLowerCase();
      var mentions = (state.players || []).filter(function (p) {
        return p.uid && lower.indexOf('@' + p.name.toLowerCase()) !== -1;
      }).map(function (p) { return p.uid; }).slice(0, 10);
      box.value = '';
      updateMentionList();
      Store.board.post(text, mentions).catch(function () {
        var again = document.getElementById('talk-text');
        if (again) again.value = text;
      });
    }

    if (form === 'rename') {
      var newName = document.getElementById('rename').value.trim();
      state.renaming = false;
      if (newName) {
        state.profileName = newName;
        Store.saveProfile({ name: newName }).then(render);
      }
      render();
    }

    if (form === 'live-join') {
      joinLive(document.getElementById('live-code').value);
    }

    if (form === 'daily') {
      startDaily(document.getElementById('daily-name').value);
    }

    if (form === 'add-question') {
      var get = function (id) { return document.getElementById(id).value.trim(); };
      var q = {
        category: get('q-cat'),
        difficulty: Number(get('q-diff')) || 2,
        q: get('q-text'),
        answer: get('q-answer'),
        wrong: [get('q-wrong-1'), get('q-wrong-2'), get('q-wrong-3')]
      };
      var all = [q.answer].concat(q.wrong).map(function (x) { return x.toLowerCase(); });
      if (!q.q || !q.answer || q.wrong.some(function (w) { return !w; })) {
        state.bankError = 'Fill in the question, the right answer and all three wrong answers.';
        return render();
      }
      if (all.some(function (x, i) { return all.indexOf(x) !== i; })) {
        state.bankError = 'Each answer needs to be different.';
        return render();
      }
      state.bankError = '';
      Store.addCustomQuestion(q).then(loadCustom).then(function () {
        render();
        var cat = document.getElementById('q-cat');
        if (cat) cat.value = q.category;
        var text = document.getElementById('q-text');
        if (text) text.focus();
      });
    }
  });

  app.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'talk-text') updateMentionList();
  });

  document.addEventListener('keydown', function (e) {
    var live = state.screen === 'live' && state.live && state.live.snap && state.live.snap.game.status === 'question';
    if ((state.screen !== 'question' && !live) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    var k = e.key.toUpperCase();
    var i = KEYS.indexOf(k);
    if (i === -1 && k >= '1' && k <= '4') i = Number(k) - 1;
    if (i !== -1) { e.preventDefault(); if (live) liveAnswer(i); else answer(i); }
  });

  // ---------- boot ----------

  function loadShared() {
    return Promise.all([
      loadCustom(),
      loadDaily(),
      loadTallies(),
      Store.getProfile().then(function (p) {
        state.profileName = (p && p.name) || '';
        state.profile = { avatar: (p && p.avatar) || null, showcase: (p && p.showcase) || [] };
      })
    ]);
  }

  // Signing in or out swaps which scores and questions are shown.
  Store.onAuth(function () {
    state.renaming = false;
    state.players = null;
    watchBoard();
    loadShared().then(render, render);
  });

  Promise.all([
    Store.ready.then(loadShared),
    loadHistory(),
    Store.getLastSetup().then(function (saved) {
      if (saved && Array.isArray(saved.players)) {
        state.setup.players = saved.players.slice(0, MAX_PLAYERS);
        if (Array.isArray(saved.categories) && saved.categories.length) state.setup.categories = saved.categories;
        if (saved.perPlayer) state.setup.perPlayer = saved.perPlayer;
        if (typeof saved.timer === 'number') state.setup.timer = saved.timer;
      }
    })
  ]).then(render, render);

  applyTheme(state.theme);
  render();
})();
