function countTokens(str) {
    return str.split(/\s+/).length;
}

let tokenCounterDiv = null;
// recuperer le texte du prompt chatgpt:
let inputField = document.querySelector('#prompt-textarea');
let isHidden = false;
let isActivedByDefault = true;

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'activateFunction') {
        // Appelez la fonction à activer ici
        hideAndActivate();
    }
    // Ajoutez le traitement pour d'autres actions si nécessaire
});

function setupTokenCounter() {
    /*
    if (tokenCounterConfigured) return;
    tokenCounterConfigured = true;
    */
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


    if (isActivedByDefault) {
        inputField.addEventListener('input', updateTokenCount);
        tokenCounterDiv.style.display = 'block'; // Afficher le compteur de jetons
    } else {
        inputField.removeEventListener('input', updateTokenCount);
        tokenCounterDiv.style.display = 'none'; // Masquer le compteur de jetons
    }
}


// Utiliser un observeur pour détecter les changements dans l'URL au lieu d'un setInterval
let lastUrl = location.href; 
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        console.log("CHANGEMENT !!!")
        lastUrl = url;
        removeTokenCounter();
        tokenCounterConfigured = false; // Reset le flag
        setupTokenCounter();
        createTokenCounter();
    }
}).observe(document, { subtree: true, childList: true });