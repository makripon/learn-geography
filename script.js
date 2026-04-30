const countries = [
  { country: "India", capital: "New Delhi", continent: "Asia", animal: "Bengal Tiger", flag: "🇮🇳", lat: 22, lon: 79, city: { name: "Mumbai", lat: 19.076, lon: 72.877 } },
  { country: "Brazil", capital: "Brasília", continent: "South America", animal: "Jaguar", flag: "🇧🇷", lat: -14, lon: -52, city: { name: "São Paulo", lat: -23.55, lon: -46.633 } },
  { country: "Japan", capital: "Tokyo", continent: "Asia", animal: "Japanese Macaque", flag: "🇯🇵", lat: 36, lon: 138, city: { name: "Osaka", lat: 34.693, lon: 135.502 } },
  { country: "Canada", capital: "Ottawa", continent: "North America", animal: "North American Beaver", flag: "🇨🇦", lat: 56, lon: -106, city: { name: "Toronto", lat: 43.653, lon: -79.383 } },
  { country: "Kenya", capital: "Nairobi", continent: "Africa", animal: "Lion", flag: "🇰🇪", lat: 0.02, lon: 37.9, city: { name: "Mombasa", lat: -4.043, lon: 39.668 } },
  { country: "Germany", capital: "Berlin", continent: "Europe", animal: "Federal Eagle", flag: "🇩🇪", lat: 51, lon: 10, city: { name: "Hamburg", lat: 53.551, lon: 9.993 } },
  { country: "Australia", capital: "Canberra", continent: "Oceania", animal: "Red Kangaroo", flag: "🇦🇺", lat: -25, lon: 133, city: { name: "Sydney", lat: -33.868, lon: 151.209 } },
  { country: "Egypt", capital: "Cairo", continent: "Africa", animal: "Steppe Eagle", flag: "🇪🇬", lat: 26, lon: 30, city: { name: "Alexandria", lat: 31.2, lon: 29.918 } }
];

const modeSelect = document.getElementById("modeSelect");
const newQuizBtn = document.getElementById("newQuizBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const questionMeta = document.getElementById("questionMeta");
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const feedback = document.getElementById("feedback");
const correctCount = document.getElementById("correctCount");
const attemptCount = document.getElementById("attemptCount");
const flagArea = document.getElementById("flagArea");
const mapArea = document.getElementById("mapArea");
const targetMarker = document.getElementById("targetMarker");

let score = { correct: 0, attempts: 0 };
let currentAnswer = "";

const sample = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

function setMarker(lat, lon) {
  const x = ((lon + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  targetMarker.style.left = `${x}%`;
  targetMarker.style.top = `${y}%`;
  targetMarker.classList.remove("hidden");
}

function generateQuestion() {
  feedback.textContent = "";
  feedback.className = "feedback";
  optionsDiv.innerHTML = "";
  flagArea.classList.add("hidden");
  mapArea.classList.add("hidden");
  targetMarker.classList.add("hidden");

  const mode = modeSelect.value;
  const target = sample(countries);
  const pool = shuffle(countries.filter(c => c.country !== target.country)).slice(0, 3);

  let options = [];
  if (mode === "qa") {
    questionMeta.textContent = "Mode: Country Facts MCQ";
    questionText.textContent = `What is the capital of ${target.country}?`;
    currentAnswer = target.capital;
    options = shuffle([target.capital, ...pool.map(c => c.capital)]);
  } else if (mode === "flag") {
    questionMeta.textContent = "Mode: Identify Country by Flag";
    questionText.textContent = "Which country does this flag belong to?";
    flagArea.textContent = target.flag;
    flagArea.classList.remove("hidden");
    currentAnswer = target.country;
    options = shuffle([target.country, ...pool.map(c => c.country)]);
  } else if (mode === "reverseFlag") {
    questionMeta.textContent = "Mode: Identify Flag by Country";
    questionText.textContent = `Select the correct flag for ${target.country}.`;
    currentAnswer = target.flag;
    options = shuffle([target.flag, ...pool.map(c => c.flag)]);
  } else if (mode === "animal") {
    questionMeta.textContent = "Mode: National Animal MCQ";
    questionText.textContent = `What is commonly recognized as the national animal of ${target.country}?`;
    currentAnswer = target.animal;
    options = shuffle([target.animal, ...pool.map(c => c.animal)]);
  } else if (mode === "continent") {
    questionMeta.textContent = "Mode: Continent MCQ";
    questionText.textContent = `${target.country} is in which continent?`;
    currentAnswer = target.continent;
    options = shuffle([target.continent, ...pool.map(c => c.continent)]);
    options = [...new Set(options)];
    while (options.length < 4) {
      options.push(sample(["Asia", "Europe", "Africa", "North America", "South America", "Oceania"]));
      options = [...new Set(options)];
    }
    options = shuffle(options).slice(0, 4);
  } else if (mode === "countryMap") {
    questionMeta.textContent = "Mode: Country Location on Map";
    questionText.textContent = `Where is ${target.country} located?`;
    mapArea.classList.remove("hidden");
    setMarker(target.lat, target.lon);
    currentAnswer = target.country;
    options = shuffle([target.country, ...pool.map(c => c.country)]);
  } else if (mode === "cityMap") {
    questionMeta.textContent = "Mode: City Location on Map";
    questionText.textContent = `Which city is shown on the map marker?`;
    mapArea.classList.remove("hidden");
    setMarker(target.city.lat, target.city.lon);
    currentAnswer = target.city.name;
    options = shuffle([target.city.name, ...pool.map(c => c.city.name)]);
  }

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  score.attempts += 1;
  if (selected === currentAnswer) {
    score.correct += 1;
    feedback.textContent = "✅ Correct!";
    feedback.classList.add("ok");
  } else {
    feedback.textContent = `❌ Incorrect. Correct answer: ${currentAnswer}`;
    feedback.classList.add("bad");
  }
  correctCount.textContent = score.correct;
  attemptCount.textContent = score.attempts;
}

newQuizBtn.addEventListener("click", generateQuestion);
modeSelect.addEventListener("change", generateQuestion);
resetScoreBtn.addEventListener("click", () => {
  score = { correct: 0, attempts: 0 };
  correctCount.textContent = "0";
  attemptCount.textContent = "0";
  feedback.textContent = "Score reset.";
  feedback.className = "feedback";
});
