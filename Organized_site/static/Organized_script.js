const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Contador de tentativas falhas
let tentativas = 0;
let alarmeAtivo = false;

// ===== MATRIX ANIMATION =====
let matrixActive = true;
const matrixChars = [];
const maxMatrixChars = 30;

function createMatrixChar() {
    const matrixBackground = document.getElementById('matrix-background');
    if (!matrixBackground) return;

    const char = document.createElement('div');
    char.className = 'matrix-char';
    char.textContent = Math.random() > 0.5 ? '0' : '1';
    
    const randomLeft = Math.random() * window.innerWidth;
    const randomDuration = 5 + Math.random() * 10; // 5-15 segundos
    const randomDelay = Math.random() * 2; // 0-2 segundos de delay
    
    char.style.left = randomLeft + 'px';
    char.style.animationDuration = randomDuration + 's';
    char.style.animationDelay = randomDelay + 's';
    
    matrixBackground.appendChild(char);
    matrixChars.push(char);

    // Remove o elemento após a animação terminar
    setTimeout(() => {
        char.remove();
        const index = matrixChars.indexOf(char);
        if (index > -1) matrixChars.splice(index, 1);
    }, (randomDuration + randomDelay) * 1000);
}

function startMatrixAnimation() {
    if (!matrixActive) return;
    
    // Cria novos caracteres continuamente
    if (matrixChars.length < maxMatrixChars) {
        createMatrixChar();
    }
    
    requestAnimationFrame(startMatrixAnimation);
}

function setMatrixRed(isRed) {
    matrixChars.forEach(char => {
        if (isRed) {
            char.classList.add('red');
        } else {
            char.classList.remove('red');
        }
    });
}

// ===== ANIMAÇÃO DE PONTOS =====
async function animarPontos(elemento, tempoTotalMs) {
    const passos = tempoTotalMs / 250;
    let pontos = "";

    for (let i = 0; i < passos; i++) {
        if (pontos === "...") {
            pontos = "";
        } else {
            pontos += ".";
        }
        elemento.innerHTML = elemento.innerHTML.replace(/\.*$/, pontos);
        await sleep(250);
    }
    elemento.innerHTML = elemento.innerHTML.replace(/\.*$/, "") + "<br>";
}

// ===== FUNÇÃO DE LOGIN =====
async function login() {
    // Se o alarme já estiver ativo, bloqueia novos cliques de login até o reset
    if (alarmeAtivo) return;

    const output = document.getElementById('output');
    const terminalBox = document.getElementById('terminal-box');
    
    output.innerHTML = ""; 
    tentativas++; // Incrementa a tentativa atual

    // Sequência padrão de carregamento hacker
    output.innerHTML += "> INITIALIZING UPLINK TO CIA MAIN_FRAME";
    await animarPontos(output, 750);

    output.innerHTML += "> DECRYPTING CREDENTIALS";
    await animarPontos(output, 1000);

    // Se ainda não chegou na 3ª tentativa, dá apenas um erro simples de acesso negado
    if (tentativas < 3) {
        await sleep(300);
        output.innerHTML += `<span style="color: #ffcc00;">> ERROR: ACCESS DENIED (${tentativas}/3). RE-ENTER CREDENTIALS...</span>`;
        return;
    }

    // --- SE CHEGOU NA 3ª TENTATIVA: ATIVA O ALARME ---
    output.innerHTML += "> OVERRIDING SECURITY GATEWAY";
    await animarPontos(output, 1000);

    await sleep(400);
    terminalBox.classList.add('panic-mode');
    alarmeAtivo = true;
    
    // Ativa o efeito vermelho na Matrix
    setMatrixRed(true);
    
    output.innerHTML += `<span class="intrusion-detected">
=====================================<br>
[!] EMERGENCY ALERT: INTRUSION DETECTED!<br>
[!] 3 FAILED ATTEMPTS - TRACE ROUTE INITIATED<br>
[!] CLICK ON INPUT TO RESET TERMINAL<br>
=====================================</span>`;
}

// ===== FUNÇÃO DE RESET DO ALARME =====
function resetarAlarme() {
    if (alarmeAtivo) {
        const terminalBox = document.getElementById('terminal-box');
        const output = document.getElementById('output');
        
        terminalBox.classList.remove('panic-mode'); // Para de tremer e desliga o vermelho
        output.innerHTML = "<span style='color: #39ff14;'>> Terminal reseted. Ready for new input...</span>";
        
        // Desativa o efeito vermelho na Matrix
        setMatrixRed(false);
        
        // Reseta o contador e o estado do alarme
        tentativas = 0;
        alarmeAtivo = false;
    }
}

// ===== INICIALIZAÇÃO DA PÁGINA =====
window.onload = function() {
    // Adiciona listeners nos inputs
    document.getElementById('username').addEventListener('focus', resetarAlarme);
    document.getElementById('password').addEventListener('focus', resetarAlarme);
    
    // Inicia a animação Matrix
    startMatrixAnimation();
};
