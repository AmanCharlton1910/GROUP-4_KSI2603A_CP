const vocabulary = [
  { category: 'Greetings', word: 'こんにちは', reading: 'konnichiwa', meaning: 'Hello', image: 'image/hello.jpg' },
  { category: 'Greetings', word: 'ありがとう', reading: 'arigatou', meaning: 'Thank you', image: 'image/thank-you.jpg' },
  { category: 'Greetings', word: 'さようなら', reading: 'sayounara', meaning: 'Goodbye', image: 'image/goodbye.jpg' },
  { category: 'Food', word: 'りんご', reading: 'ringo', meaning: 'Apple', image: 'image/apple.jpg' },
  { category: 'Food', word: 'みず', reading: 'mizu', meaning: 'Water', image: 'image/water.jpg' },
  { category: 'Food', word: 'ごはん', reading: 'gohan', meaning: 'Rice / Meal', image: 'image/rice.jpg' },
  { category: 'Animals', word: 'ねこ', reading: 'neko', meaning: 'Cat', image: 'image/cat.jpg' },
  { category: 'Animals', word: 'かめ', reading: 'kame', meaning: 'Turtle', image: 'image/turtle.jpg' },
  { category: 'Animals', word: 'とり', reading: 'tori', meaning: 'Bird', image: 'image/bird.jpg' },
  { category: 'Phrases', word: 'おはよう', reading: 'ohayou', meaning: 'Good morning', image: 'image/good-morning.jpg' },
  { category: 'Phrases', word: 'すみません', reading: 'sumimasen', meaning: 'Excuse me / Sorry', image: 'image/sorry.jpg' },
  { category: 'Phrases', word: 'はい', reading: 'hai', meaning: 'Yes', image: 'image/yes.jpg' },
  { category: 'Phrases', word: 'いいえ', reading: 'iie', meaning: 'No', image: 'image/no.jpg' },
  { category: 'Phrases', word: 'だめ', reading: 'dame', meaning: 'No (but more aggressive)', image: 'image/no-aggressive.jpg' },
  { category: 'Isekai', word: 'ドラゴン', reading: 'doragon', meaning: 'Dragon', image: 'image/dragon.jpg' },
  { category: 'Isekai', word: '剣', reading: 'ken', meaning: 'Sword', image: 'image/sword.jpg' },
  { category: 'Isekai', word: '魔法', reading: 'mahou', meaning: 'Magic', image: 'image/magic.jpg' },
  { category: 'Isekai', word: '妖精', reading: 'yousei', meaning: 'Fairy', image: 'image/fairy.jpg' },
  { category: 'Anime Show', word: '転生したらスライムだった県', reading: 'Tensei Shitara Slime Datta Ken', meaning: 'That Time I Got Reincarnated as a Slime', image: 'image/tensura.jpg' },
  { category: 'Anime Show', word: '進撃の巨人', reading: 'Shingeki no Kyojin', meaning: 'Attack on Titan', image: 'image/aot.jpg' },
  { category: 'Anime Show', word: '鬼滅の刃', reading: 'Kimetsu no Yaiba (Or Onimetsu no Yaiba)', meaning: 'Demon Slayer', image: 'image/demon-slayer.jpg' },
];

const categories = ['All', ...new Set(vocabulary.map((item) => item.category))];
const categoryButtons = document.getElementById('categoryButtons');
const cardsGrid = document.getElementById('cardsGrid');
const quizWord = document.getElementById('quizWord');
const quizTypeLabel = document.getElementById('quizType');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const startQuizBtn = document.getElementById('startQuizBtn');
const themeToggle = document.getElementById('themeToggle');
const contrastToggle = document.getElementById('contrastToggle');
const navLinks = document.querySelectorAll('.main-nav a');

const correctSounds = [new Audio('sounds/correct.mp3'), new Audio('sounds/correct2.mp3'), new Audio('sounds/correct3.mp3')];
const wrongSounds = [new Audio('sounds/wrong.mp3'), new Audio('sounds/wrong2.mp3'), new Audio('sounds/wrong3.mp3')];
let correctSoundIndex = 0;
let wrongSoundIndex = 0;

const quizModes = ['meaning', 'word', 'picture'];
let quizModeIndex = 0;
let activeCategory = 'All';
let currentQuestion = null;

function createCategoryButtons() {
  categoryButtons.innerHTML = categories
    .map(
      (category) => `
      <button class="category-button ${category === activeCategory ? 'active' : ''}" data-category="${category}">
        ${category}
      </button>
    `
    )
    .join('');

  categoryButtons.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      createCategoryButtons();
      renderVocabulary();
    });
  });
}

function renderVocabulary() {
  if (!cardsGrid) return;
  const filtered = activeCategory === 'All'
    ? vocabulary
    : vocabulary.filter((item) => item.category === activeCategory);

  cardsGrid.innerHTML = filtered
    .map((item) => {
      const index = vocabulary.indexOf(item);
      return `
      <article class="card" data-index="${index}">
        <div class="card-header">
          <h3>${item.word}</h3>
          <button class="sound-button" type="button" onclick="speakWord('${item.word}')" aria-label="Play pronunciation for ${item.word}">🔊</button>
        </div>
        <p class="reading">${item.reading}</p>
        <img class="card-image" id="image-${index}" src="${item.image}" alt="${item.meaning}" style="display:none" />
        <p class="meaning" id="meaning-${index}">Tap to reveal meaning</p>
        <button type="button" onclick="toggleMeaning(${index})">Reveal meaning</button>
      </article>
    `;
    })
    .join('');
}

function toggleMeaning(index) {
  const meaningElement = document.getElementById(`meaning-${index}`);
  const imageElement = document.getElementById(`image-${index}`);
  const item = vocabulary[index];
  if (!meaningElement) return;
  const isCurrentlyRevealed = meaningElement.textContent === item.meaning;
  meaningElement.textContent = isCurrentlyRevealed ? 'Tap to reveal meaning' : item.meaning;
  if (imageElement) imageElement.style.display = isCurrentlyRevealed ? 'none' : 'block';
}

function speakWord(word) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function speakFeedback(message) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function stopAllFeedbackSounds() {
  [...correctSounds, ...wrongSounds].forEach((audio) => {
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}

function getNextFeedbackSound(isCorrect) {
  const sounds = isCorrect ? correctSounds : wrongSounds;
  if (!sounds || !sounds.length) return null;

  if (isCorrect) {
    const audio = sounds[correctSoundIndex];
    correctSoundIndex = (correctSoundIndex + 1) % sounds.length;
    return audio;
  }

  const audio = sounds[wrongSoundIndex];
  wrongSoundIndex = (wrongSoundIndex + 1) % sounds.length;
  return audio;
}

function playFeedbackSound(isCorrect) {
  stopAllFeedbackSounds();
  const audio = getNextFeedbackSound(isCorrect);
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {
    // ignore playback failures if the user has blocked autoplay
  });
}

function applyTheme(theme) {
  const dark = theme === 'dark';
  document.body.classList.toggle('dark', dark);
  localStorage.setItem('jwlTheme', dark ? 'dark' : 'light');
  if (themeToggle) {
    themeToggle.textContent = dark ? 'Light Mode' : 'Dark Mode';
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

function applyHighContrast(enabled) {
  document.body.classList.toggle('high-contrast', enabled);
  localStorage.setItem('jwlHighContrast', enabled ? 'true' : 'false');
  if (contrastToggle) {
    contrastToggle.textContent = enabled ? 'Normal Contrast' : 'High Contrast';
    contrastToggle.setAttribute('aria-pressed', enabled.toString());
    contrastToggle.setAttribute('aria-label', enabled ? 'Disable high contrast mode' : 'Enable high contrast mode');
  }
}

function loadTheme() {
  const storedTheme = localStorage.getItem('jwlTheme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    applyTheme(storedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
}

function loadAccessibilitySettings() {
  applyHighContrast(localStorage.getItem('jwlHighContrast') === 'true');
}

function createLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-inner">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('loaded'));
  return overlay;
}

const loadingOverlay = createLoadingOverlay();

function showLoadingOverlay() {
  if (loadingOverlay) {
    loadingOverlay.classList.remove('loaded');
  }
}

function handleLinkClick(event) {
  const anchor = event.target.closest('a');
  if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin) return;
  if (url.pathname === location.pathname && url.search === location.search) return;
  event.preventDefault();
  showLoadingOverlay();
  setTimeout(() => {
    window.location.href = url.href;
  }, 220);
}

function toggleTheme() {
  applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (contrastToggle) contrastToggle.addEventListener('click', () => applyHighContrast(!document.body.classList.contains('high-contrast')));

function setActiveNavLink() {
  const pageName = location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('#')[0];
    const isSamePage = linkPage === pageName || (linkPage === '' && pageName === 'index.html');
    const isSectionLink = pageName === 'index.html' && href === '#vocab' && location.hash === '#vocab';
    const isActive = isSamePage || isSectionLink;

    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

setActiveNavLink();

document.addEventListener('click', handleLinkClick);

function pickQuestion() {
  const choices = vocabulary.slice();
  const randomIndex = Math.floor(Math.random() * choices.length);
  const questionItem = choices.splice(randomIndex, 1)[0];
  const mode = quizModes[quizModeIndex];
  quizModeIndex = (quizModeIndex + 1) % quizModes.length;

  const getRandomChoices = (pool, correctValue) => {
    const options = [correctValue];
    while (options.length < 4) {
      const randomOption = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      if (randomOption && !options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  if (mode === 'meaning') {
    const pool = choices.map((item) => item.meaning);
    return {
      type: mode,
      prompt: questionItem.word,
      subtitle: `(${questionItem.reading})`,
      image: null,
      answer: questionItem.meaning,
      options: getRandomChoices(pool, questionItem.meaning),
    };
  }

  if (mode === 'word') {
    const pool = choices.map((item) => item.word);
    return {
      type: mode,
      prompt: questionItem.meaning,
      subtitle: '',
      image: null,
      answer: questionItem.word,
      options: getRandomChoices(pool, questionItem.word),
    };
  }

  const pool = choices.map((item) => item.word);
  return {
    type: mode,
    prompt: 'Which Japanese word matches this picture?',
    subtitle: '',
    image: questionItem.image,
    answer: questionItem.word,
    options: getRandomChoices(pool, questionItem.word),
  };
}

function renderQuiz() {
  currentQuestion = pickQuestion();
  quizFeedback.textContent = '';

  const typeDescriptions = {
    meaning: 'Choose the English meaning for the Japanese word shown.',
    word: 'Choose the Japanese word that matches the English meaning.',
    picture: 'Choose the Japanese word that matches the picture.',
  };

  if (quizTypeLabel) {
    quizTypeLabel.textContent = typeDescriptions[currentQuestion.type];
  }

  if (quizWord) {
    if (currentQuestion.image) {
      quizWord.innerHTML = `<img class="quiz-image" src="${currentQuestion.image}" alt="Quiz image" />`;
    } else {
      quizWord.textContent = currentQuestion.subtitle
        ? `${currentQuestion.prompt} ${currentQuestion.subtitle}`
        : currentQuestion.prompt;
    }
  }

  quizOptions.innerHTML = currentQuestion.options
    .map(
      (option) => `
      <button class="option-button" type="button">${option}</button>
    `
    )
    .join('');

  quizOptions.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.textContent;
      const correct = selected === currentQuestion.answer;
      if (correct) {
        quizFeedback.textContent = '✔ Correct! Well done.';
        playFeedbackSound(true);
      } else {
        quizFeedback.textContent = `✖ Incorrect. The right answer is ${currentQuestion.answer}.`;
        playFeedbackSound(false);
      }
      quizOptions.querySelectorAll('button').forEach((optionButton) => {
        optionButton.disabled = true;
        optionButton.classList.add(optionButton.textContent === currentQuestion.answer ? 'correct' : 'incorrect');
      });
      if (correct) {
        button.classList.remove('incorrect');
        button.classList.add('correct');
      }
    });
  });
}

if (startQuizBtn) {
  startQuizBtn.addEventListener('click', () => {
    // If quiz section exists on page, scroll to it; otherwise navigate to quiz page
    const localQuiz = document.getElementById('quiz');
    if (localQuiz) {
      localQuiz.scrollIntoView({ behavior: 'smooth' });
    } else {
      location.href = 'quiz.html';
    }
  });
}

if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', renderQuiz);

window.toggleMeaning = toggleMeaning;
window.speakWord = speakWord;

if (categoryButtons && cardsGrid) {
  createCategoryButtons();
  renderVocabulary();
}

if (quizWord && quizOptions) {
  renderQuiz();
}

loadTheme();
loadAccessibilitySettings();
