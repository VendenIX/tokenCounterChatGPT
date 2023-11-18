function countTokens(str) {
    return str.split(/\s+/).length;
}

let tokenCounterDiv = null;
let toggleButton = null;
// recuperer le texte du prompt chatgpt:
let inputField = document.querySelector('#prompt-textarea');
let isHidden = false;
let isActivedByDefault = true;

// Charge la valeur actuelle de la case à cocher depuis le stockage local
browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'enableTokenCounter') {
        setupTokenCounter(); // Exécute la logique de setupTokenCounter
    }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'activateFunction') {
        // Appelez la fonction à activer ici
        hideAndActivate();
    }
    // Ajoutez le traitement pour d'autres actions si nécessaire
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggleButtonClick') {
        toggleButtonClick();
    }
});

function setupTokenCounter() {
    if (inputField) {
        tokenCounterDiv = document.createElement('div');
        //rendre le truc flotant pour le foutre au dessus:
        tokenCounterDiv.className = 'token-counter';
        tokenCounterDiv.style.top = '-1px';
        tokenCounterDiv.style.left = '200px';
        tokenCounterDiv.style.padding = '0px';
        tokenCounterDiv.style.marginLeft = '15px';
        //pour mettre le texte en bold ou strong si tu veux:
        tokenCounterDiv.style.fontWeight = 'bold';
        tokenCounterDiv.style.color = 'white';
        tokenCounterDiv.textContent = 'Tokens: 0';
        tokenCounterDiv.style.zIndex = '10000';
        tokenCounterDiv.style.textContent = "Tokens: 0"

        toggleButton = document.createElement('button');
        toggleButton.addEventListener('click', function () {
            if (toggleButton.textContent === 'OFF') {
                toggleButton.textContent = 'ON';
                toggleButton.style.backgroundColor = '#2ECC40'; // Vert pour ON
                inputField.addEventListener('input', updateTokenCount);
                isActivedByDefault = false;
            } else {
                toggleButton.textContent = 'OFF';
                toggleButton.style.backgroundColor = '#FF4136'; // Rouge pour OFF
                inputField.removeEventListener('input', updateTokenCount);
                isActivedByDefault = true;
            }
        });

        setTimeout(() => {
            inputField.insertAdjacentElement('beforebegin', tokenCounterDiv);
        }, 1000);
        if (isActivedByDefault) {
            inputField.addEventListener('input', updateTokenCount);
        }
    }
}

function removeTokenCounter() {
    if (tokenCounterDiv && tokenCounterDiv.parentNode) {
        tokenCounterDiv.parentNode.removeChild(tokenCounterDiv);
        tokenCounterDiv = null;
    }
}

function createTokenCounter() {
    inputField = document.querySelector('#prompt-textarea');
    setupTokenCounter();

}

function updateTokenCount() {
    if (!isHidden && isActivedByDefault) {
        tokenCounterDiv.textContent = 'Tokens: ' + countTokens(inputField.value);
    }
}

setupTokenCounter();

function hideAndActivate() {
    isHidden = !isHidden;
    isActivedByDefault = !isActivedByDefault;

    if (isHidden) {
        toggleButton.style.display = 'none'; // Masquer le bouton ON/OFF
    } else {
        toggleButton.style.display = 'block'; // Afficher le bouton ON/OFF
    }

    if (isActivedByDefault) {
        inputField.addEventListener('input', updateTokenCount);
        tokenCounterDiv.style.display = 'block'; // Afficher le compteur de jetons
    } else {
        inputField.removeEventListener('input', updateTokenCount);
        tokenCounterDiv.style.display = 'none'; // Masquer le compteur de jetons
    }
}

function toggleButtonClick() {
    isActivedByDefault = !isActivedByDefault;

    if (isActivedByDefault) {
        inputField.addEventListener('input', updateTokenCount);
        tokenCounterDiv.style.display = 'block'; // Afficher le compteur de jetons
    } else {
        inputField.removeEventListener('input', updateTokenCount);
        tokenCounterDiv.style.display = 'none'; // Masquer le compteur de jetons
    }

    updateTokenCount();
}

let currentUrl = window.location.href;

setInterval(() => {
    if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        removeTokenCounter();
        createTokenCounter();
    }
}, 4000); // Vérifiez toutes les 500 millisecondes