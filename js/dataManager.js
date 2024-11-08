// dataManager.js
let wordList = new Set();

export function loadWords(callback) {
    fetch('data/words.json')
        .then(response => response.json())
        .then(data => {
            wordList = new Set(data);
            if (callback) callback();
        })
        .catch(error => console.error('Kelime listesi yüklenirken hata oluştu:', error));
}

export function isWordValid(word) {
    return wordList.has(word);
}

export function getWordList() {
    return Array.from(wordList);
}
