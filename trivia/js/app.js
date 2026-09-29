// Squad Trivia: trivia for a group of friends.
// Modes: Pass & Play (one phone, setup -> handoff/question/reveal -> results)
// and Daily Challenge (same 10 questions for everyone each day, see daily.js).
// All saving goes through window.TriviaStore (see store.js).
(function () {
  var CATEGORIES = window.TRIVIA_CATEGORIES;
  var BUILT_IN = window.TRIVIA_QUESTIONS;
  var Store = window.TriviaStore;
  var Daily = window.TriviaDaily;

  var BASE_POINTS = 100;
  var SPEED_BONUS = 50;
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
    dailyResults: {},
    copied: false,
    game: null,
    quitArmed: false,
    clearArmed: false,
    bankError: '',
    setupError: ''
  };

  var timerHandle = null;

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
      saved: false
    };
  }

  function todaysDaily() {
    return state.dailyResults[Daily.today()] || null;
  }

  function startDaily() {
    if (todaysDaily()) return go('home');
    var plan = Daily.build(Daily.today());
    state.game = newGame('daily', ['You'], plan.questions, plan.timer);
    state.game.daily = plan;
    // Saved before the first question so quitting or reloading can't earn a replay.
    saveDailyProgress();
    showQuestion();
  }

  function saveDailyProgress(done) {
    var g = state.game;
    var p = g.players[0];
    var result = {
      date: g.daily.date,
      number: g.daily.number,
      score: p.score,
      correct: p.correct,
      total: g.questions.length,
      pattern: g.questions.map(function (_, i) { return !!g.pattern[i]; }),
      finished: !!done
    };
    state.dailyResults[result.date] = result;
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
    var left = g.timer ? Math.max(0, g.deadline - Date.now()) : 0;
    stopTimer();

    var item = g.questions[g.index];
    var player = currentPlayer();
    var right = choice !== null && item.options[choice] === item.q.answer;

    g.picked = choice;
    g.points = right
      ? BASE_POINTS + (g.timer ? Math.round(SPEED_BONUS * left / (g.timer * 1000)) : 0)
      : 0;

    player.answered += 1;
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
      (right || '') +
      '</header>';
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

  function categoryBadges(ids) {
    return '<div class="chips">' + ids.map(function (id) {
      return '<span class="cat-badge" data-cat="' + id + '">' + esc(catName(id)) + '</span>';
    }).join('') + '</div>';
  }

  function dailyStreak() {
    return Daily.streak(Object.keys(state.dailyResults), Daily.today());
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

    var daily = done
      ? '<p class="muted">You played today. ' + (done.finished ? '' : 'Unanswered questions count as misses. ') +
          'A new challenge unlocks at midnight.</p>' +
        '<div class="stat-grid">' +
          '<div class="stat"><div class="v">' + done.correct + '/' + done.total + '</div><div class="k">correct</div></div>' +
          '<div class="stat"><div class="v">' + done.score + '</div><div class="k">points</div></div>' +
          '<div class="stat"><div class="v">' + streak + '</div><div class="k">day streak</div></div>' +
        '</div>' + shareBlock(done)
      : '<p class="muted">Everyone gets the same 10 questions today. Play once, whenever you want, then post your score in the group chat.</p>' +
        '<button class="btn-primary" data-action="daily">Play today\'s challenge</button>' +
        (streak ? '<p class="small muted">Current streak: ' + streak + ' day' + (streak === 1 ? '' : 's') + '</p>' : '');

    return topbar('<button class="btn-small" data-action="bank">Question bank</button>') +
      '<section class="card">' +
        '<div class="q-meta"><h2>Daily Challenge</h2><span class="progress">#' + plan.number + ' · ' + esc(date) + '</span></div>' +
        categoryBadges(plan.categories) + daily +
      '</section>' +
      '<section class="card">' +
        '<h2>Pass &amp; Play</h2>' +
        '<p class="muted">Everyone in the same room, one phone passed around. Pick the players, categories and timer.</p>' +
        '<button data-action="setup">Set up a game</button>' +
      '</section>' +
      '<section class="card mode-soon">' +
        '<div class="q-meta"><h2>Live Game</h2><span class="soon">Coming soon</span></div>' +
        '<p class="muted">Everyone answers on their own phone at the same moment, from anywhere, with a shared leaderboard. This turns on once the free hosting and sign-in are set up.</p>' +
      '</section>' +
      '<p class="footer-note">Scores and your own questions are saved on this device only.</p>';
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
        '<button data-action="home">Back to home</button>' +
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
    return '<div class="q-meta"><span class="cat-badge">' + esc(catName(item.q.category)) + (item.q.custom ? ' · Custom' : '') + '</span>' +
      '<span class="progress">' + esc(p.name) + ' · ' + progressText() + '</span></div>' +
      '<p class="q-text">' + esc(item.q.q) + '</p>';
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
      ? '<div class="verdict good"><strong>Correct</strong><span class="pts">+' + g.points + '</span></div>'
      : '<div class="verdict bad"><strong>' + (timedOut ? 'Time\'s up' : 'Not quite') + '</strong><span>Answer: ' + esc(item.q.answer) + '</span></div>';

    var streak = right && p.streak >= 3 ? '<p class="small muted">' + esc(p.name) + ' is on a ' + p.streak + '-answer streak.</p>' : '';

    var nextLabel = last ? 'See final scores' : (g.players.length > 1 ? 'Next: ' + esc(nextName) : 'Next question');

    return topbar(quitButton()) +
      '<section class="card question-card" data-cat="' + item.q.category + '">' +
        questionHeader() + verdict + answersHtml(true) + streak +
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
          '<div class="field"><label class="label" for="q-cat">Category</label><select id="q-cat">' + options + '</select></div>' +
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

  var VIEWS = {
    home: viewHome,
    'daily-result': viewDailyResult,
    setup: viewSetup,
    handoff: viewHandoff,
    question: viewQuestion,
    reveal: viewReveal,
    results: viewResults,
    bank: viewBank
  };

  function render() {
    app.innerHTML = '<div class="shell">' + VIEWS[state.screen]() + '</div>';
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
      case 'daily':
        startDaily();
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

    if (form === 'add-question') {
      var get = function (id) { return document.getElementById(id).value.trim(); };
      var q = {
        category: get('q-cat'),
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

  document.addEventListener('keydown', function (e) {
    if (state.screen !== 'question' || e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key.toUpperCase();
    var i = KEYS.indexOf(k);
    if (i === -1 && k >= '1' && k <= '4') i = Number(k) - 1;
    if (i !== -1) { e.preventDefault(); answer(i); }
  });

  // ---------- boot ----------

  Promise.all([
    loadCustom(),
    loadHistory(),
    loadDaily(),
    Store.getLastSetup().then(function (saved) {
      if (saved && Array.isArray(saved.players)) {
        state.setup.players = saved.players.slice(0, MAX_PLAYERS);
        if (Array.isArray(saved.categories) && saved.categories.length) state.setup.categories = saved.categories;
        if (saved.perPlayer) state.setup.perPlayer = saved.perPlayer;
        if (typeof saved.timer === 'number') state.setup.timer = saved.timer;
      }
    })
  ]).then(render, render);

  render();
})();
