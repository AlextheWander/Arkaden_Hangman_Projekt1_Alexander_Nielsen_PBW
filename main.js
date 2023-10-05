// 1. En liste(Array) over programmeringssprog og variabler til spillet.
let programming_languages = ["javascript", "python", "java", "c", "ruby", "swift", "go", "rust"];

let answer = '';
let maxWrong = 6; 
let mistakes = 0; 
let correctGuesses = 0; 
let guessed = []; 
let wordStatus = null; 
let latestScore = 0; 
let bestScore = localStorage.getItem('hangmanBestScore') || 0; // Bedste score fra lokal lagring.

// 2. Elementer fra HTML.
const bestScoreElement = document.getElementById('best-score');
const latestScoreElement = document.getElementById('latest-score');


// 3. Funktion til at vælge et tilfældigt ord fra listen.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length
function randomWord() {
    answer = programming_languages[Math.floor(Math.random() * programming_languages.length)];
    document.getElementById('wordLength').textContent = answer.length;
   // console.log(answer);
}

// 4. Funktion til at generere tastaturknapper.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
function generateButtons() {
    // Opret HTML-knapper for hvert bogstav.
    let buttonsHTML = 'abcdefghijklmnopqrstuvwxyzæøå'.split('').map(letter =>
        `<button
            class="btn-keyboard"
            id='${letter}'
            onClick="handleGuess('${letter}')"
        >
            ${letter}
        </button>`
    ).join('');
       
    // Sæt knapperne ind i HTML-dokumentet.
    document.getElementById('keyboard').innerHTML = buttonsHTML;
}

// 5. Funktion til at håndtere et gæt fra spilleren.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
// https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/add

function handleGuess(chosenLetter) {
    if (wordStatus !== answer) {
        if (mistakes === maxWrong) {
            return; 
        }

        if (guessed.indexOf(chosenLetter) === -1) {
            guessed.push(chosenLetter); // Tilføj bogstavet til gættede bogstaver.
            const buttonElement = document.getElementById(chosenLetter);
            buttonElement.setAttribute('disabled', true); // Deaktiver knappen.
           
            // console.log(chosenLetter);

            if (answer.indexOf(chosenLetter) >= 0) {
                guessedWord(); // Opdater det viste ord med de korrekte bogstaver.
                correctGuesses++;
                checkIfGameWon(); // Tjek om spillet er vundet.
                buttonElement.classList.add('correct-guess'); // Tilføj CSS-klasse for korrekte gæt.
            } else {
                mistakes++;
                checkIfGameLost(); // Tjek om spillet er tabt.
                updateHangmanPicture(); // Opdater billedet af galgen.
                buttonElement.classList.add('wrong-guess'); // Tilføj CSS-klasse for forkerte gæt.
            }
            // console.log(mistakes);

            // Opdater statistik på siden.
            document.getElementById('correctGuesses').textContent = correctGuesses;
            document.getElementById('mistakes').textContent = mistakes;
        }
    }
}

// 6. Funktion til at opdatere billedet af galgen baseret på antal fejl.
function updateHangmanPicture() {
    document.getElementById('hangmanPic').src = './assets/' + mistakes + '.svg';
}

// 7. Funktion til at tjekke, om spillet er vundet.
// https://www.w3schools.com/jsref/prop_style_display.asp
// https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
function checkIfGameWon() {
    if (wordStatus === answer) {
        hideKeyboard(); // Skjul tastaturet.
        document.getElementById('keyboard').textContent = ''; // Fjern tastaturknapperne.
        document.getElementById('win-message').style.display = 'block'; // Vis besked om sejr.

        const totalScore = correctGuesses - mistakes;
        document.getElementById('total-score').textContent = totalScore;
        updateBestScore(totalScore); // Opdater bedste score.
        saveLatestScore(totalScore); // Gem seneste score.
        latestScore = totalScore;
        latestScoreElement.textContent = latestScore;

        
    }
}

// 8. Funktion til at tjekke, om spillet er tabt.
// https://www.freecodecamp.org/news/loose-vs-strict-equality-in-javascript/

function checkIfGameLost() {
    if (mistakes === maxWrong) {
        document.getElementById('word-field').textContent = 'Du har desværre tabt, det rigtige svar var: ' + answer;
        hideKeyboard(); // Skjul tastaturet.
        const totalScore = correctGuesses - mistakes;
        document.getElementById('total-score').textContent = totalScore;
        updateBestScore(totalScore); // Opdater bedste score.
        saveLatestScore(totalScore); // Gem seneste score.
        latestScore = totalScore;
        latestScoreElement.textContent = latestScore;
    }
}

// 9. Funktion til at opdatere det viste ord med gættede bogstaver.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
function guessedWord() {
    wordStatus = answer.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join('');
    document.getElementById('word-field').textContent = wordStatus;
}

// 10. Initialisering af spillet.
document.getElementById('maxWrong').textContent = maxWrong;
randomWord();
generateButtons();
guessedWord();

// 11. Justering af tekststørrelse.
let currentFontSize = 1;
let fontSizeIncrement = 0.05;

document.getElementById('plus-textSize').addEventListener('click', function () {
    if (currentFontSize < 1.25) {
        currentFontSize += fontSizeIncrement;
        changeFontSize(currentFontSize);
    }
});

document.getElementById('minus-textSize').addEventListener('click', function () {
    if (currentFontSize > 1) {
        currentFontSize -= fontSizeIncrement;
        changeFontSize(currentFontSize);
    }
});

// 12. Funktion til at ændre tekststørrelsen i spillet.
function changeFontSize(size) {
    const buttons = document.querySelectorAll('.btn, .btn-reset, .btn-primary, .btn-secound');
    const textElements = document.querySelectorAll('p, h2, h3, .word-field, #win-message, button');

    textElements.forEach(element => {
        element.style.fontSize = `${size * 120}%`;
    });

    buttons.forEach(button => {
        button.style.fontSize = `${size * 120}%`;
    });
}

// Indlæs tidligere scores fra lokal lagring.
latestScore = localStorage.getItem('hangmanLatestScore') || 0;
latestScoreElement.textContent = latestScore;
bestScoreElement.textContent = bestScore;

// 13. Funktion til at opdatere bedste score, hvis den aktuelle score er højere.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
function updateBestScore(score) {
    const currentBestScore = parseInt(localStorage.getItem('hangmanBestScore')) || 0;
    if (score > currentBestScore) {
        localStorage.setItem('hangmanBestScore', score.toString());
        bestScoreElement.textContent = score;
    }
}

// 14. Funktion til at gemme seneste score i lokal lagring.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
function saveLatestScore(score) {
    localStorage.setItem('hangmanLatestScore', score.toString());
}


// 15. funktion til at skjule tastaturet 
function hideKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.style.display = 'none';
}

// 16. funktion til at vise tastaturet 

function showKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.style.display = 'block';
}


// 17. Funktion til at nulstille spillet.

function reset() {
    mistakes = 0;
    guessed = [];
    correctGuesses = 0;
    wordStatus = null;
    document.getElementById('hangmanPic').src = './assets/0.svg';
    document.getElementById('word-field').textContent = '';
    document.getElementById('correctGuesses').textContent = correctGuesses;
    document.getElementById('mistakes').textContent = mistakes;
    randomWord();
    guessedWord();
    generateButtons();
    showKeyboard();


// Aktiver alle knapper igen.
// https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute
    document.querySelectorAll('.btn').forEach(button => {
        button.removeAttribute('disabled');
    });

    document.getElementById('win-message').style.display = 'none';
}
