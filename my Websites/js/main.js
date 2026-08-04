/* =============================================
   ZaMain Portfolio — Interactive Terminal
   ============================================= */

(function () {
  'use strict';

  // =============================================
  // CONFIG
  // =============================================
  const LS_CONTENT = [
    { text: '',                 cls: '' },
    { text: 'Yours Truly — The Dev ZaMain', cls: 'ls-line--highlight', delay: 0 },
    { text: '',                 cls: '', delay: 0 },
    { text: '/services',        cls: 'ls-line--dir', delay: 200 },
    { text: '  websites',       cls: 'ls-line--dir-sub', delay: 400 },
    { text: '  discord-bots',   cls: 'ls-line--dir-sub', delay: 600 },
    { text: '  minecraft-plugins', cls: 'ls-line--dir-sub', delay: 800 },
    { text: '  minecraft-mods', cls: 'ls-line--dir-sub', delay: 1000 },
  ];

  const VERSION = '1.0.0';

  // =============================================
  // DOM REFS
  // =============================================
  const typedCmdEl    = document.getElementById('typedCmd');
  const introCursor   = document.getElementById('introCursor');
  const lsOutput      = document.getElementById('lsOutput');
  const interactiveArea = document.getElementById('interactiveArea');
  const cmdOutput     = document.getElementById('commandOutput');
  const cmdInput      = document.getElementById('cmdInput');
  const terminalBody  = document.getElementById('terminalBody');
  const terminal      = document.getElementById('terminal');
  const navToggle     = document.querySelector('.nav__toggle');
  const navLinks      = document.querySelector('.nav__links');
  const sectionTitles = document.querySelectorAll('.section__title');
  const serviceCards  = document.querySelectorAll('.service-card');

  // =============================================
  // INTRO: TYPED COMMAND + LS OUTPUT
  // =============================================
  const CMD_TEXT = 'ls';

  function typeCommand (text, el, cursor, done) {
    let i = 0;
    const interval = 60;
    function tick () {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(tick, interval);
      } else {
        cursor.style.animation = 'blink 1s step-end infinite';
        setTimeout(done, 500);
      }
    }
    cursor.style.animation = 'none';
    tick();
  }

  function showLSOutput () {
    lsOutput.classList.add('visible');
    LS_CONTENT.forEach(function (item, index) {
      const line = document.createElement('span');
      line.className = 'ls-line' + (item.cls ? ' ' + item.cls : '');
      line.textContent = item.text;
      if (item.delay != null) {
        line.style.animationDelay = item.delay + 'ms';
      } else {
        line.style.animationDelay = (index * 180) + 'ms';
      }
      lsOutput.appendChild(line);
    });

    // Show interactive area after all lines appear
    const totalDelay = 500 + (LS_CONTENT.length * 180) + 600;
    setTimeout(function () {
      interactiveArea.removeAttribute('hidden');
      cmdInput.focus();
    }, totalDelay);

    // Dismiss intro cursor
    setTimeout(function () {
      introCursor.style.display = 'none';
    }, 500 + CMD_TEXT.length * 60);
  }

  // Kick off
  typeCommand(CMD_TEXT, typedCmdEl, introCursor, showLSOutput);

  // =============================================
  // LIVE COMMAND SYSTEM
  // =============================================
  const COMMANDS = {
    help: {
      desc: 'Show available commands',
      run: function () {
        const list = Object.keys(COMMANDS).sort();
        return list.map(function (cmd) {
          return '  ' + cmd.padEnd(14) + COMMANDS[cmd].desc;
        }).join('\n');
      }
    },
    whoami: {
      desc: 'About ZaMain',
      run: function () {
        return (
          'ZaMain — Independent Developer\n' +
          'From Palestine. I build websites, Discord bots,\n' +
          'Minecraft plugins, and Minecraft mods.'
        );
      }
    },
    services: {
      desc: 'List offered services',
      run: function () {
        return (
          'Available Services:\n' +
          '  websites           Responsive websites and web apps\n' +
          '  discord-bots       Custom Discord bots\n' +
          '  minecraft-plugins  Spigot/Paper plugins\n' +
          '  minecraft-mods     Forge/NeoForge/Fabric mods'
        );
      }
    },
    payments: {
      desc: 'Accepted payment methods',
      run: function () {
        return (
          'Accepted Payment Methods:\n' +
          '  Gift Cards\n' +
          '  Solana (SOL)\n' +
          '  Litecoin (LTC)\n' +
          '  Bitcoin (BTC)\n' +
          '  Other crypto by arrangement\n\n' +
          'Contact me for wallet addresses and availability.'
        );
      }
    },
    contact: {
      desc: 'How to reach ZaMain',
      run: function () {
        return (
          'Discord: @zamainny\n' +
          'GitHub:  @ZaMainXS\n' +
          'Reddit:  u/ZaMainny'
        );
      }
    },
    ls: {
      desc: 'List directory contents',
      run: function () {
        return (
          'Yours Truly — The Dev ZaMain\n\n' +
          '/services\n' +
          '  websites\n' +
          '  discord-bots\n' +
          '  minecraft-plugins\n' +
          '  minecraft-mods'
        );
      }
    },
    version: {
      desc: 'Show version info',
      run: function () {
        return 'zamain/portfolio v' + VERSION;
      }
    },
    clear: {
      desc: 'Clear terminal output',
      run: function () {
        cmdOutput.textContent = '';
        return null;
      }
    },
    date: {
      desc: 'Show current date and time',
      run: function () {
        return new Date().toLocaleString('en-US', {
          timeZone: 'UTC',
          dateStyle: 'full',
          timeStyle: 'short'
        }) + ' UTC';
      }
    },
    uptime: {
      desc: 'Show session duration',
      run: function () {
        const sec = Math.floor((Date.now() - SESSION_START) / 1000);
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return m + 'm ' + s + 's';
      }
    },
    banner: {
      desc: 'Display intro banner',
      run: function () {
        return (
          'zamain@portfolio:~$ ls\n\n' +
          'Yours Truly — The Dev ZaMain\n\n' +
          '/services\n' +
          '  websites\n' +
          '  discord-bots\n' +
          '  minecraft-plugins\n' +
          '  minecraft-mods'
        );
      }
    },
  };

  const SESSION_START = Date.now();
  let history = [];
  let historyIndex = -1;

  function processCommand (input) {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return { type: 'info', text: '' };

    // Scroll to section shortcuts
    if (trimmed === 'about' || trimmed === 'bio') {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
      return { type: 'info', text: '' };
    }
    if (trimmed === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return { type: 'info', text: '' };
    }

    const cmd = COMMANDS[trimmed];
    if (cmd) {
      const output = cmd.run();
      if (output === null) return null; // clear
      return { type: 'success', text: output };
    }

    return { type: 'error', text: 'bash: ' + trimmed + ': command not found. Type "help" for available commands.' };
  }

  function appendOutput (type, text) {
    if (text === '') return;
    const block = document.createElement('div');
    block.className = type;
    block.textContent = text;
    cmdOutput.appendChild(block);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  cmdInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const val = cmdInput.value;
      cmdInput.value = '';

      // Echo the command
      const echoLine = document.createElement('div');
      echoLine.style.cssText = 'font-size:12px;color:var(--text-muted);margin-bottom:4px;';
      echoLine.textContent = 'zamain@portfolio:~$ ' + val;
      cmdOutput.appendChild(echoLine);

      // Process
      const result = processCommand(val);
      if (result === null) {
        // clear
        cmdOutput.textContent = '';
      } else {
        appendOutput(result.type, result.text);
      }

      // History
      if (val.trim()) {
        history.push(val);
        historyIndex = history.length;
      }
    }

    // Arrow up/down for history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        historyIndex = Math.max(0, historyIndex - 1);
        cmdInput.value = history[historyIndex];
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        cmdInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        cmdInput.value = '';
      }
    }
  });

  // Focus input on any click in terminal body
  terminalBody.addEventListener('click', function (e) {
    if (e.target !== cmdInput) {
      cmdInput.focus();
    }
  });

  // =============================================
  // 3D TERMINAL TILT (mouse)
  // =============================================
  if (window.innerWidth > 768) {
    terminal.addEventListener('mousemove', function (e) {
      const rect = terminal.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 4;   // ±4 deg
      const rotateX = ((centerY - y) / centerY) * 3;   // ±3 deg
      terminal.style.transform =
        'perspective(1200px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });

    terminal.addEventListener('mouseleave', function () {
      terminal.style.transform = 'perspective(1200px) rotateX(3deg) rotateY(-1deg)';
      terminal.style.transition = 'transform 0.4s ease';
      setTimeout(function () {
        terminal.style.transition = 'transform 0.1s ease';
      }, 400);
    });
  }

  // =============================================
  // SCROLL REVEAL
  // =============================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sectionTitles.forEach(function (el) {
    revealObserver.observe(el);
  });

  serviceCards.forEach(function (el) {
    revealObserver.observe(el);
  });

  // =============================================
  // MOBILE NAV TOGGLE
  // =============================================
  navToggle.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });

  // Close nav on link click
  navLinks.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav on outside click
  document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

})();