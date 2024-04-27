const encryptTextButton = document.getElementById('encrypt');

encryptTextButton.addEventListener('click', () => {
    const encryptContainer = document.getElementById('encrypt-decode-container');
    const startGameContainer = document.getElementById('start-game-container');

    encryptContainer.style.display = 'block';
    startGameContainer.style.display = 'none';
});

// Function to turn a sentence into steganography that is more difficult to decode 
const steganographyUnreadable = (str) => {
    let output = '';
    const allWordsArray = str.toLowerCase().split(' ');

    let longestWord = 0;

    allWordsArray.forEach(word => {
        if (word.length > longestWord) {
            longestWord = word.length;
        }
    });

    for (let i = 0; i < longestWord; i++) {
        allWordsArray.forEach(word => {
            if (!(word[i] === undefined)) {
                output += word[i];
            }
        });

        output += ' ';
    }

    return output.trim();
};

// Function to turn a sentence into steganography that is easy to decode
const steganographyForDecoding = (str) => {
    let output = '';
    const allWordsArray = str.toLowerCase().split(' ');

    let longestWord = 0;

    allWordsArray.forEach(word => {
        if (word.length > longestWord) {
            longestWord = word.length;
        } 
    });

    for (let i = 0; i < longestWord; i++) {
        allWordsArray.forEach(word => {
            if (!(word[i] === undefined)) {
                output += word[i];
            } else {
                output += 'Æ';
            }
        });

        output += ' ';
    }

    return output.trim();
};

// Function to turn steganography into sentence
const steganographyDecoder = (str) => {
    let output = '';
    const allWordsArray = str.toLowerCase().split(' ');

    let longestWord = 0;

    allWordsArray.forEach(word => {
        if (word.length > longestWord) {
            longestWord = word.length;
        } 
    });

    for (let i = 0; i < longestWord; i++) {
        allWordsArray.forEach(word => {
            if (word[i] && word[i] !== 'Æ') {
                output += word[i];
            } else {
                output += ' ';
            }
        });

        output += ' ';
    }

    // Replace any 'æ' characters with spaces
    output = output.replace(/æ/g, '');

    // Capitalize the first letter of each sentence
    output = output.split('. ').map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1)).join('. ');

    return output.trim();
};  


function checkIfInputIsEmpty(input) {
    if (input === '') {
        alert('Please enter a sentence for the encrypter!');
        return true;
    }

    return false;
}

function askIfEmptyInput(inputField) {
    if (confirm('Do you want to clear the input field?')) {
        inputField.value = '';
    }
}

const encryptUnreadable = () => {
    const input = document.getElementById('inputTextEncrypter');
    const inputValue = input.value;

    if (checkIfInputIsEmpty(inputValue)) {
        return;
    }

    let output = document.getElementById('encryptedText');

    output.textContent = steganographyUnreadable(inputValue);
    output.style.border = '1px solid #000';

    askIfEmptyInput(input);
}

const encryptDecoder = () => {
    const input = document.getElementById('inputTextEncrypter');
    const inputValue = input.value;

    if (checkIfInputIsEmpty(inputValue)) {
        return;
    }

    let output = document.getElementById('encryptedText');

    output.textContent = steganographyForDecoding(inputValue);
    output.style.border = '1px solid #000';

    askIfEmptyInput(input);
}

const decodeText = () => {
    const input = document.getElementById('inputTextDecoder');
    const inputValue = input.value;

    if (checkIfInputIsEmpty(inputValue)) {
        return;
    }

    let output = document.getElementById('decodedText');

    output.textContent = steganographyDecoder(inputValue);
    output.style.border = '1px solid #000';

    askIfEmptyInput(input);
}
