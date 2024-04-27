const encryptTextButton = document.getElementById('encrypt');
const copyTextEncoderButton = document.getElementById('copyTextEncoderBtn');
const copyTextDecoderButton = document.getElementById('copyTextDecoderBtn');

// Set default input field values when the page loads
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("inputTextEncrypter").value = ""; // Default value for encryption input
    document.getElementById("inputTextDecoder").value = ""; // Default value for decryption input
});

encryptTextButton.addEventListener('click', () => {
    const encryptContainer = document.getElementById('encrypt-decode-container');
    const startGameContainer = document.getElementById('start-game-container');

    encryptContainer.style.display = 'block';
    startGameContainer.style.display = 'none';
});

// Function to turn a sentence into steganography that is more difficult to decode 
const steganographyUnreadable = (str) => {
    let output = '';
    const allWordsArray = str.split(' ');

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

function copyTextEncoder() {
    const copyText = document.getElementById('encryptedText').innerText;

    const textArea = document.createElement('textarea');
    textArea.value = copyText;
    document.body.appendChild(textArea);

    textArea.select();
    textArea.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(textArea.value);

    document.body.removeChild(textArea);

    const tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied: " + copyText;
}

function copyTextDecoder() {
    const copyText = document.getElementById('decodedText').innerText;

    const textArea = document.createElement('textarea');
    textArea.value = copyText;
    document.body.appendChild(textArea);

    textArea.select();
    textArea.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(textArea.value);

    document.body.removeChild(textArea);

    const tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied: " + copyText;
}

function outFunc() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
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

    copyTextEncoderButton.style.display = 'block';
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

    copyTextEncoderButton.style.display = 'block';
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

    copyTextDecoderButton.style.display = 'block';
}
