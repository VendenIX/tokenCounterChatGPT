chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'activateFunction') {
        // Envoie un message au contenu du script pour activer la fonction
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'activateFunction' });
        });
    }
    // Ajoutez le traitement pour d'autres actions si nécessaire
});
