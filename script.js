const vocabulary = [
  { category: 'Greetings', word: 'こんにちは', reading: 'konnichiwa', meaning: 'Hello', image: 'https://via.placeholder.com/480x270?text=%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF' },
  { category: 'Greetings', word: 'ありがとう', reading: 'arigatou', meaning: 'Thank you', image: 'https://via.placeholder.com/480x270?text=%E3%81%82%E3%82%8A%E3%81%8C%E3%81%A8%E3%81%86' },
  { category: 'Greetings', word: 'さようなら', reading: 'sayounara', meaning: 'Goodbye', image: 'https://via.placeholder.com/480x270?text=%E3%81%95%E3%82%88%E3%81%86%E3%81%AA%E3%82%89' },
  { category: 'Food', word: 'りんご', reading: 'ringo', meaning: 'Apple', image: 'https://via.placeholder.com/480x270?text=Apple' },
  { category: 'Food', word: 'みず', reading: 'mizu', meaning: 'Water', image: 'https://via.placeholder.com/480x270?text=Water' },
  { category: 'Food', word: 'ごはん', reading: 'gohan', meaning: 'Rice / Meal', image: 'https://via.placeholder.com/480x270?text=Rice' },
  { category: 'Animals', word: 'ねこ', reading: 'neko', meaning: 'Cat', image: 'https://via.placeholder.com/480x270?text=Cat' },
  { category: 'Animals', word: 'いぬ', reading: 'inu', meaning: 'Dog', image: 'https://via.placeholder.com/480x270?text=Dog' },
  { category: 'Animals', word: 'とり', reading: 'tori', meaning: 'Bird', image: 'https://via.placeholder.com/480x270?text=Bird' },
  { category: 'Phrases', word: 'おはよう', reading: 'ohayou', meaning: 'Good morning', image: 'https://via.placeholder.com/480x270?text=Good%20morning' },
  { category: 'Phrases', word: 'すみません', reading: 'sumimasen', meaning: 'Excuse me / Sorry', image: 'https://via.placeholder.com/480x270?text=Sorry' },
  { category: 'Phrases', word: 'はい', reading: 'hai', meaning: 'Yes', image: 'https://via.placeholder.com/480x270?text=Yes' },
  { category: 'Phrases', word: 'いいえ', reading: 'iie', meaning: 'No', image: 'https://via.placeholder.com/480x270?text=No' },
];

const categories = ['All', ...new Set(vocabulary.map((item) => item.category))];
const categoryButtons = document.getElementById('categoryButtons');
const cardsGrid = document.getElementById('cardsGrid');
const quizWord = document.getElementById('quizWord');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const startQuizBtn = document.getElementById('startQuizBtn');

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

function pickQuestion() {
  const choices = vocabulary.slice();
  const randomIndex = Math.floor(Math.random() * choices.length);
  const questionItem = choices.splice(randomIndex, 1)[0];
  const options = [questionItem.meaning];

  while (options.length < 4) {
    const randomOption = choices.splice(Math.floor(Math.random() * choices.length), 1)[0];
    if (randomOption && !options.includes(randomOption.meaning)) {
      options.push(randomOption.meaning);
    }
  }

  return {
    word: questionItem.word,
    meaning: questionItem.meaning,
    options: options.sort(() => Math.random() - 0.5),
  };
}

function renderQuiz() {
  currentQuestion = pickQuestion();
  quizWord.textContent = currentQuestion.word;
  quizFeedback.textContent = '';
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
      const correct = selected === currentQuestion.meaning;
      quizFeedback.textContent = correct ? '✔ Correct! Well done.' : `✖ Incorrect. The right answer is ${currentQuestion.meaning}.`;
      quizOptions.querySelectorAll('button').forEach((optionButton) => {
        optionButton.disabled = true;
        optionButton.classList.add(optionButton.textContent === currentQuestion.meaning ? 'correct' : 'incorrect');
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
