function countTokens(str) {
    return str.split(/\s+/).length;
}

let tokenCounterDiv = null;
// recuperer le texte du prompt chatgpt:
let inputField = document.querySelector('#prompt-textarea');

function setupTokenCounter() {
    inputField = document.querySelector('#prompt-textarea');

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
        //tokenCounterDiv.style.textContent = "Tokens: 0"                     A DELETE

        setTimeout(() => {
            inputField.insertAdjacentElement('beforebegin', tokenCounterDiv);
        }, 1000);
        inputField.addEventListener('input', updateTokenCount);
    }
}

function removeTokenCounter() {
    if (tokenCounterDiv && tokenCounterDiv.parentNode) {
        tokenCounterDiv.parentNode.removeChild(tokenCounterDiv);
        tokenCounterDiv = null;
    }
}

function updateTokenCount() {
    tokenCounterDiv.textContent = 'Tokens: ' + countTokens(inputField.value);
}

// Utiliser un observeur pour détecter les changements dans l'URL au lieu d'un setInterval
let lastUrl = location.href; 
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        removeTokenCounter();
        setupTokenCounter();
    }
}).observe(document, { subtree: true, childList: true });

setupTokenCounter();