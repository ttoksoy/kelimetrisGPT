    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const nextLetterDisplay = document.getElementById('next-letter');
    const nextLetterBox = document.getElementById('next-letter-box');
    const restartBtn = document.getElementById('restart-btn');
    const smallBtn = document.getElementById('small-btn');
    const mediumBtn = document.getElementById('medium-btn');
    const largeBtn = document.getElementById('large-btn');
    const leftBtn = document.getElementById('left-btn');
    const downBtn = document.getElementById('down-btn');
    const rightBtn = document.getElementById('right-btn');
let isPaused = false;
    let score = 0;
    let board = [];
    let CELL_SIZE = 37; // Hücre boyutunu istediğiniz ölçüde büyütün (örneğin 40 piksel)
    let rows = 16;
    let columns = 8;
    let currentLetter = null; // Şu anda düşen harf
    let nextLetter = null; // Bir sonraki gelecek harf    let currentX = 0;
    let currentY = 0;
    let gameInterval;
    let wordList = new Set();
    let gameStarted = false; // Oyunun başlatılıp başlatılmadığını kontrol etmek için değişken
let difficulty = 'easy'; // Varsayılan olarak easy seviyesi.
let letterPool = []; // Global letter pool

    // Oyunu başlatma butonu
    document.addEventListener('DOMContentLoaded', () => {
    // HTML öğeleri tanımlandıktan sonra bu kod çalışacak.
    const startBtn = document.getElementById('start-btn');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (!gameStarted) {
                gameStarted = true;
                gameInterval = setInterval(gameLoop, 500); // Oyun döngüsünü başlat
                startBtn.style.display = "none"; // Başlat butonunu gizle
            }
        });
    }    
        // Dokunma başlangıç ve bitiş pozisyonlarını tutmak için değişkenler
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        // Dokunma başlangıcında pozisyonu kaydet
        canvas.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        });
        
        // Dokunma bitişinde pozisyonu kaydet ve kaydırma yönünü kontrol et
        canvas.addEventListener('touchend', (event) => {
            touchEndX = event.changedTouches[0].clientX;
            touchEndY = event.changedTouches[0].clientY;
            handleGesture();
        });
        
        // Kaydırma yönünü belirleme
        function handleGesture() {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
        
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Yatay kaydırma hareketi
                if (deltaX > 50) {
                    moveLetterRight(); // Sağa kaydırma
                } else if (deltaX < -50) {
                    moveLetterLeft(); // Sola kaydırma
                }
            } else {
                // Dikey kaydırma hareketi
                if (deltaY > 50) {
                    moveLetterDown(); // Aşağı kaydırma
                }
            }
            drawBoard(); // Her kaydırma hareketinden sonra tahtayı güncelle
        }
    
    function togglePause() {
        isPaused = !isPaused; // Durumu tersine çevir
    
        if (isPaused) {
            clearInterval(gameInterval); // Oyun döngüsünü durdur
            document.getElementById("pause-btn").innerText = "Resume"; // Buton metnini "Resume" olarak değiştir
        } else {
            gameInterval = setInterval(gameLoop, 500); // Oyun döngüsünü yeniden başlat
            document.getElementById("pause-btn").innerText = "Pause"; // Buton metnini "Pause" olarak değiştir
        }
    }
    
    const letterScores = {
        'A': 1, 'B': 3, 'C': 4, 'Ç': 4, 'D': 3, 'E': 1, 'F': 7, 'G': 5, 'Ğ': 9,
        'H': 5, 'I': 2, 'İ': 1, 'J': 10, 'K': 1, 'L': 1, 'M': 2, 'N': 1, 'O': 2,
        'Ö': 8, 'P': 5, 'R': 1, 'S': 2, 'Ş': 4, 'T': 1, 'U': 2, 'Ü': 3, 'V': 7,
        'Y': 3, 'Z': 7
    };
    
    const sesliHarfler = new Set(['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü']);
    const sessizHarfler = new Set(['B', 'C', 'Ç', 'D', 'F', 'G', 'Ğ', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'Ş', 'T', 'V', 'Y', 'Z']);
    let ardArdaSessizHarfSayisi = 1;
    let ardArdaSesLİHarfSayisi = 1;
    const maxSessizHarfLimit = 2; // En fazla ardışık sessiz harf sayısı

    function loadWords(callback) {
        // words.json dosyasını yükle
        fetch('data/words.json')
            .then(response => response.json())
            .then(data => {
                wordList = new Set(data);
                console.log('Kelime listesi yüklendi:', wordList);
                if (callback) callback();
            })
            .catch(error => console.error('Kelime listesi yüklenirken hata oluştu:', error));
    }

// "Yeniden Oyna" butonuna tıklanınca oyunu yeniden başlat
const restartBtn = document.getElementById('restart-btn');
restartBtn.addEventListener('click', () => {
    // Skoru sıfırla
    updateScore(0);

    // Tahtayı yeniden başlat
    initializeBoard();

    // Oyun döngüsünü yeniden başlat
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 500);

    // "Yeniden Oyna" butonunu gizle
    restartBtn.style.display = "none";

    // "Başlat" butonunu yeniden gizle
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.style.display = "none";
    }
});

    function checkGameOver() {
        // En üst satırdaki herhangi bir hücre doluysa oyun sona erer
        for (let x = 0; x < columns; x++) {
            if (board[0][x] !== '') {
                gameOver(); // Eğer dolu hücre varsa oyunu sonlandır
                return true;
            }
        }
        return false;
    }
    function gameOver() {
        clearInterval(gameInterval); // Oyunu durdur
        alert("Game Over! Oyun sona erdi."); // Kullanıcıya oyun sonu mesajı göster
        // Oyunu yeniden başlatma veya ana menüye yönlendirme işlemleri yapılabilir
            // "Yeniden Oyna" butonunu görünür yap
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.style.display = "block";
        }
    }

    
    function sessizHarfKontrolu(harf) {
        if (sessizHarfler.has(harf)) {
            ardArdaSessizHarfSayisi++;
        } else {
            ardArdaSessizHarfSayisi = 0; // Sesli harf gelirse sıfırlanır
        }
        return ardArdaSessizHarfSayisi <= maxSessizHarfLimit;
    }

document.getElementById("difficulty-level").addEventListener("change", (event) => {
    difficulty = event.target.value; // Zorluk seviyesini güncelle
    letterPool = createLetterPool(difficulty); // Yeni harf havuzunu oluştur
    console.log(`Seçilen Zorluk Seviyesi: ${difficulty}`);
    console.log(`Yeni Harf Havuzu:`, letterPool);
});

function createLetterPool(difficulty) {
    let pool = [];
    switch (difficulty) {
        case 'easy':
            ardArdaSesLİHarfSayisi=1;
            ardArdaSessizHarfSayisi=1;
            // Kolay seviye: Harf puanı ile ters orantılı olarak letterPool'u oluştur
            for (const letter in letterScores) {
                const score = letterScores[letter];
                const count = 11 - score; // En düşük puanlı harfler daha fazla
                for (let i = 0; i < count; i++) {
                    pool.push(letter);
                }
            }
            break;

        case 'medium':
            ardArdaSesLİHarfSayisi=1;
            ardArdaSessizHarfSayisi=2;

            // Orta seviye: Puanı 1-3 olanlar 3 adet, 4-6 arası 2 adet, 7 ve üstü 1 adet
            for (const letter in letterScores) {
                const score = letterScores[letter];
                let count = 1;
                if (score <= 3) count = 3;
                else if (score <= 6) count = 2;
                for (let i = 0; i < count; i++) {
                    pool.push(letter);
                }
            }
            break;

        case 'hard':
            ardArdaSesLİHarfSayisi=2;
            ardArdaSessizHarfSayisi=4;

            // Zor seviye: Her harften sadece bir adet
            pool = Object.keys(letterScores);
            break;

        default:
            console.error('Bilinmeyen zorluk seviyesi:', difficulty);
            return [];
    }

    return pool;
}
// Seed değerini tanımla, oyunun başında rastgele bir sayı ile başlat
let seed = Date.now(); // Başlangıç seed değeri, oyunun her seferinde farklı olması için

function spawnLetter() {
    if (checkGameOver()) return;

    // Letter pool boşsa yeniden oluştur
    if (letterPool.length === 0) {
        console.error("Letter pool is empty! Creating new pool.");
        letterPool = createLetterPool(difficulty);
    }

    let nextHarf;

    // Rastgele harf seçmek için xorshift kullanın
    do {
        seed = xorshift(seed); // Rastgeleliği tohumlayarak kontrol edin
        const index = seed % letterPool.length; // Harfi seçmek için havuzdaki indeksi belirleyin
        nextHarf = letterPool[index];
    } while (!sessizHarfKontrolu(nextHarf)); // Kısıtlama geçilene kadar harf seçmeye devam et

    currentLetter = nextLetter;
    nextLetter = nextHarf;
    currentX = Math.floor(columns / 2);
    currentY = 0;

    // Ekranda sıradaki harfi göster
    nextLetterDisplay.innerText = `Sıradaki Harf: ${nextLetter}`; // Alttaki sıradaki harf
    nextLetterBox.innerText = nextLetter; // Sağ üstteki kutucuk sıradaki harf
}

    function initializeBoard() {
        board = Array(rows).fill().map(() => Array(columns).fill(''));
        drawBoard();
    
        const letters = Object.keys(letterScores); // Tüm harfleri içeren listeyi al
        nextLetter = letters[Math.floor(Math.random() * letters.length)]; // İlk sıradaki harfi rastgele belirle
        spawnLetter(); // İlk harfi başlatmak için spawnLetter işlevini çağır
    }
    
    
function drawBoard() {
    // Tüm tahtayı temizleyin
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sabit harf küplerini tahtaya çizin
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            if (board[y][x]) {
                const pixelX = x * CELL_SIZE;
                const pixelY = y * CELL_SIZE;

                const gradient = ctx.createLinearGradient(pixelX, pixelY, pixelX + CELL_SIZE, pixelY + CELL_SIZE);
                gradient.addColorStop(0, currentTheme.light);
                gradient.addColorStop(1, currentTheme.dark);
                ctx.fillStyle = gradient;
                ctx.fillRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);
                ctx.strokeStyle = currentTheme.border;
                ctx.strokeRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);

                // Harfi ortalayarak çiz
                const letterxy = board[y][x];
                ctx.font = `bold ${CELL_SIZE / 1.5}px Arial`;
                ctx.fillStyle = '#fff'; // Harf rengini değiştirmedik, isterseniz bunu da değiştirebiliriz
                ctx.fillText(letterxy, pixelX + CELL_SIZE / 4, pixelY + CELL_SIZE / 1.5);

                // Harf puanını daha küçük bir yazı tipi ile göster
                ctx.font = `bold ${CELL_SIZE / 3.5}px Arial`;
                ctx.fillStyle = '#fff';
                ctx.fillText(letterScores[letterxy], pixelX + CELL_SIZE - 10, pixelY + CELL_SIZE - 5);
            }
        }
    }

    // Düşen harfi çiz
    if (currentLetter) {
        const pixelX = currentX * CELL_SIZE;
        const pixelY = currentY * CELL_SIZE;

        const gradient = ctx.createLinearGradient(pixelX, pixelY, pixelX + CELL_SIZE, pixelY + CELL_SIZE);
        gradient.addColorStop(0, currentTheme.light);
        gradient.addColorStop(1, currentTheme.dark);
        ctx.fillStyle = gradient;
        ctx.fillRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = currentTheme.border;
        ctx.strokeRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);

        ctx.font = `bold ${CELL_SIZE / 1.5}px Arial`;
        ctx.fillStyle = '#fff';
        ctx.fillText(currentLetter, pixelX + CELL_SIZE / 4, pixelY + CELL_SIZE / 1.5);

        ctx.font = `bold ${CELL_SIZE / 3.5}px Arial`;
        ctx.fillStyle = '#fff';
        ctx.fillText(letterScores[currentLetter], pixelX + CELL_SIZE - 10, pixelY + CELL_SIZE - 5);
    }
}

    function updateScore(newScore) {
        score = newScore;
        scoreDisplay.innerText = `Skor: ${score}`;
    }

    function moveLetterDown() {
        if (currentY + 1 < rows && !board[currentY + 1][currentX]) {
            currentY++;
        } else {
            board[currentY][currentX] = currentLetter;
            checkForWords();
            spawnLetter();
        }
    }

    function moveLetterLeft() {
        if (currentX > 0 && !board[currentY][currentX - 1]) {
            currentX--;
        }
    }

    function moveLetterRight() {
        if (currentX < columns - 1 && !board[currentY][currentX + 1]) {
            currentX++;
        }
    }

    function gameLoop() {
        if (isPaused) return; // Eğer oyun duraklatılmışsa güncellemeleri yapma
        moveLetterDown();
        checkForWords();
        drawBoard();
    }

    function checkForWords() {
        const foundWords = findWords();
        if (foundWords.length === 0) {
            // Eğer kelime bulunmadıysa oyuna devam et
            return;
        }
        foundWords.forEach(word => {
            addScore(word.word); // Her kelimenin puanını hesaplayın ve ekleyin
    
            word.positions.forEach(pos => {
                animateExplosion(pos.x, pos.y);  // Animasyon efekti ekleyin
                board[pos.y][pos.x] = '';
            });
        });
    
        dropLetters();
        drawBoard();
    }
    
    function findWords() {
    const foundWords = [];
    // Yatay kontrol
    for (let y = 0; y < rows; y++) {
        for (let startX = 0; startX < columns; startX++) {
            let word = '';
            const positions = [];

            for (let x = startX; x < columns; x++) {
                if (board[y][x] === '') break;
                word += board[y][x];
                positions.push({ x: x, y: y });

                if (word.length >= 3) {
                    console.log('Algılanan kelime:', word); // Kontrol
                    if (wordList.has(word)) {
                        foundWords.push({ word: word, positions: [...positions] });
                    }
                }
            }
        }
    }

    // Dikey kontrol
    for (let x = 0; x < columns; x++) {
        for (let startY = 0; startY < rows; startY++) {
            let word = '';
            const positions = [];

            for (let y = startY; y < rows; y++) {
                if (board[y][x] === '') break;
                word += board[y][x];
                positions.push({ x: x, y: y });

               if (word.length >= 3 && wordList.has(word)) {
                    foundWords.push({ word: word, positions: [...positions] });
                }
            }
        }
    }

    // En uzun kelimeyi seç
    const longestWords = [];
    let maxLength = 0;

    foundWords.forEach(wordInfo => {
        if (wordInfo.word.length > maxLength) {
            maxLength = wordInfo.word.length;
            longestWords.length = 0;  // Öncekileri temizle
            longestWords.push(wordInfo);
        } else if (wordInfo.word.length === maxLength) {
            longestWords.push(wordInfo);
        }
    });

    return foundWords;
    }
    function animateExplosion(x, y, callback) {
        const explosionFrames = 10; // Patlama animasyonunun kare sayısı
        let frame = 0;
        const interval = setInterval(() => {
            ctx.clearRect(x * 30, y * 30, 30, 30); // Harfi temizle
    
            // Patlama efektini çiz
            ctx.save();
            ctx.translate(x * CELL_SIZE + 15 , y * CELL_SIZE + 15 ); // Hücrenin ortasına konumlandır
            ctx.scale(1 - frame / explosionFrames, 1 - frame / explosionFrames); // Çerçeve sayısına göre küçült
            ctx.globalAlpha = 1 - frame / explosionFrames; // Çerçeve sayısına göre saydamlaştır
    
            // Patlama rengini ayarla
            ctx.fillStyle = '#FF4500';
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
    
            frame++;
            if (frame >= explosionFrames) {
                clearInterval(interval);
                callback(); // Animasyon bittiğinde geri çağırma işlevini çalıştır
            }
        }, 30); // Her kareyi 30 ms aralıklarla göster
    }
    
    function dropLetters() {
        for (let x = 0; x < columns; x++) {
            for (let y = rows - 1; y >= 0; y--) {
                if (board[y][x] === '') {
                    for (let k = y - 1; k >= 0; k--) {
                        if (board[k][x] !== '') {
                            board[y][x] = board[k][x];
                            board[k][x] = '';
                            break;
                        }
                    }
                }
            }
        }
    }
    let foundWordsList = []; // Tüm bulunan kelimeler ve puanlarını saklamak için dizi
    
    function addScore(word) {
        let wordScore = 0;
    
        // Her harfin puanını topla
        for (let letter of word) {
            wordScore += letterScores[letter] || 0;
        }
    
        // Kelime uzunluğuna göre bonus puan ekle
        let lengthBonus = 0;
        if (word.length >= 4) {
            lengthBonus = Math.pow(2, word.length - 3) * 5;
        }
        wordScore += lengthBonus;
    
        // Toplam skoru güncelle
        score += wordScore; // score'ı doğrudan güncelle
        updateScore(score); // Güncellenmiş skoru ekranda göster
        
        console.log(`Bulunan kelime: ${word}, Harflerin Toplam Puanı: ${wordScore - lengthBonus}, Bonus: ${lengthBonus}, Toplam Puan: ${wordScore}`);
        document.getElementById("last-found-word").innerText = `Son Bulunan Kelime: ${word} (+${wordScore} puan)`;
    
        // Tüm kelimeler listesine ekle
        foundWordsList.push({ word: word, score: wordScore });
    }
    function toggleWordList() {
        const allFoundWordsDiv = document.getElementById("all-found-words");
        if (allFoundWordsDiv.style.display === "none") {
            // Listeyi göster ve kelimeleri güncelle
            allFoundWordsDiv.style.display = "block";
            allFoundWordsDiv.innerHTML = "Tüm Bulunan Kelimeler:<br>" + foundWordsList.slice().reverse().map(item => `${item.word}: ${item.score} puan`).join("<br>");
        } else {
            // Listeyi gizle
            allFoundWordsDiv.style.display = "none";
        }
    }
    function clearWord(start, fixed, end, direction) {
        if (direction === 'row') {
            for (let x = start; x <= end; x++) {
                board[fixed][x] = '';
            }
        } else if (direction === 'column') {
            for (let y = start; y <= end; y++) {
                board[y][fixed] = '';
            }
        }
        drawBoard();
    }

    restartBtn.addEventListener('click', () => {
        updateScore(0);
        initializeBoard();
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 500);
    });
    
    //smallBtn.addEventListener('click', () => setBoardSize(200, 300));
    //mediumBtn.addEventListener('click', () => setBoardSize(400, 600));
    //largeBtn.addEventListener('click', () => setBoardSize(600, 900));
    
    leftBtn.addEventListener('click', () => {
        moveLetterLeft();
        drawBoard();
    });
    downBtn.addEventListener('click', () => {
        moveLetterDown();
        drawBoard();
    });
    rightBtn.addEventListener('click', () => {
        moveLetterRight();
        drawBoard();
    });

    function setBoardSize(width, height) {
        canvas.width = columns * CELL_SIZE;
        canvas.height = rows * CELL_SIZE;
        //initializeBoard();
        drawBoard(); // Tahtayı yeni boyutlarla çiz
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            moveLetterLeft();
        } else if (event.key === 'ArrowRight') {
            moveLetterRight();
        } else if (event.key === 'ArrowDown') {
            moveLetterDown();
        }
        drawBoard();
    });

    window.addEventListener('load', () => {
        loadWords(() => {
            initializeBoard();
            //gameInterval = setInterval(gameLoop, 500);
        });
    });
    
    document.getElementById("settings-toggle").addEventListener("click", function() {
        const settingsContainer = document.getElementById("settings-container");
        if (settingsContainer.style.display === "none" || settingsContainer.style.display === "") {
            settingsContainer.style.display = "block";
        } else {
            settingsContainer.style.display = "none";
        }
    });

    // Ayarlar menüsünü kapatma butonu
    document.getElementById("close-settings").addEventListener("click", function() {
        document.getElementById("settings-container").style.display = "none";
    });
    
    document.getElementById('pause-resume-btn').addEventListener('click', () => {
    togglePause();

    const pauseResumeBtn = document.getElementById('pause-resume-btn');

    if (isPaused) {
        // Devam etme (Play) simgesini ekle
        pauseResumeBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40px" height="40px">
                <circle cx="12" cy="12" r="12" fill="#2196f3"/>
                <polygon points="9,5 20,12 9,19" fill="#ffffff"/>
            </svg>`;
        pauseResumeBtn.title = "Devam Et";
    } else {
        // Durdurma (Pause) simgesini ekle
        pauseResumeBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40px" height="40px">
                <circle cx="12" cy="12" r="12" fill="#2196f3"/>
                <rect x="8" y="5" width="3" height="14" fill="#ffffff"/>
                <rect x="13" y="5" width="3" height="14" fill="#ffffff"/>
            </svg>`;
        pauseResumeBtn.title = "Durdur";
    }
    });
    
    const boardSizeSelect = document.getElementById('board-size');
    
    boardSizeSelect.addEventListener('change', () => {
        const selectedSize = boardSizeSelect.value;
    
        if (selectedSize === 'small') {
            setBoardSize(10, 5, 40); // Küçük: 10 satır, 5 sütun, 40px hücre boyutu
        } else if (selectedSize === 'medium') {
            setBoardSize(15, 7, 35); // Orta: 15 satır, 7 sütun, 35px hücre boyutu
        } else if (selectedSize === 'large') {
            setBoardSize(20, 10, 30); // Büyük: 20 satır, 10 sütun, 30px hücre boyutu
        }
    });

    function setBoardSize(newRows, newColumns, newCellSize) {
    rows = newRows;
    columns = newColumns;
    CELL_SIZE = newCellSize;

    // Canvas boyutunu ayarla
    canvas.width = columns * CELL_SIZE;
    canvas.height = rows * CELL_SIZE;

    // Tahtayı yeniden oluştur
    initializeBoard();
    drawBoard();
    }

    // Renk temaları nesnesi
    const colorThemes = {
        blue: {
            light: '#229ed4',
            dark: '#0571f5',
            border: '#455982'
        },
        red: {
            light: '#ff0518',
            dark: '#e30213',
            border: '#8b0000'
        },
        green: {
            light: '#90ee90',
            dark: '#228b22',
            border: '#006400'
        },
        orange: {
            light: '#ffa07a',
            dark: '#ff4500',
            border: '#b22222'
        }
    };
    
    // Varsayılan renk teması
    let currentTheme = colorThemes.blue;
    
    // Renk seçimini dinleyin ve güncelleyin
    document.getElementById("color-theme").addEventListener("change", (event) => {
        currentTheme = colorThemes[event.target.value];
        drawBoard(); // Renk güncellendikten sonra tahtayı yeniden çiz
    });


document.getElementById('start-btn').addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;

        // Ayarları al ve oyunu başlat
        difficulty = document.getElementById("difficulty-level").value;
        letterPool = createLetterPool(difficulty);

        // Oyunu başlat
        initializeBoard();
        gameInterval = setInterval(gameLoop, 500); // Oyun döngüsünü başlat
        document.getElementById("difficulty-display").innerText = `Zorluk Seviyesi: ${difficulty}`; // Zorluk seviyesini görüntüle

        // Başlat butonunu gizle
        document.getElementById('start-btn').style.display = "none";
    }
});
document.getElementById("difficulty-display").innerText = `Zorluk Seviyesi: ${difficulty}`;



function xorshift(seed) {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return (seed < 0 ? ~seed + 1 : seed) % 1e9;  // Pozitif bir sayı üret
}




});