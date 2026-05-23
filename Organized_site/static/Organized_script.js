const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let tentativas = 0;
let alarmeAtivo = false;

// --- SISTEMA DE MATRIX BACKGROUND ---
function criarMatrixBackground() {
    const container = document.createElement('div');
    container.className = 'matrix-background';
    document.body.insertBefore(container, document.body.firstChild);
    
    // Define a largura de cada coluna (20px)
    const colWidth = 20;
    const colCount = Math.floor(window.innerWidth / colWidth);
    
    // Loop que gera caracteres constantemente
    const spawnChar = () => {
        const randomCol = Math.floor(Math.random() * colCount);
        criarColuna(container, randomCol, colWidth);
        // Ajuste a velocidade da chuva aqui (menor = mais denso)
        setTimeout(spawnChar, 70); 
    };
    
    spawnChar();
}

function criarColuna(container, colIndex, colWidth) {
    const char = document.createElement('div');
    char.className = 'matrix-char';
    // Se o alarme estiver ativo, usamos caracteres diferentes ou mantemos o padrão
    char.textContent = Math.random() > 0.5 ? '0' : '1';
    
    // Adiciona classe 'red' se o alarme estiver ativo
    if (alarmeAtivo) char.classList.add('red');
    
    char.style.left = (colIndex * colWidth) + 'px';
    
    // Velocidade aleatória para cada caractere
    const duration = 5 + Math.random() * 8;
    char.style.animation = `fall ${duration}s linear forwards`;
    
    container.appendChild(char);
    
    // Limpeza automática ao terminar a animação
    char.addEventListener('animationend', () => char.remove());
}

// --- LÓGICA DO TERMINAL ---
async function animarPontos(elemento, tempoTotalMs) {
    const passos = tempoTotalMs / 250;
    let pontos = "";
    for (let i = 0; i < passos; i++) {
        pontos = pontos.length >= 3 ? "" : pontos + ".";
        elemento.innerHTML = elemento.innerHTML.replace(/\.*$/, pontos);
        await sleep(250);
    }
    elemento.innerHTML = elemento.innerHTML.replace(/\.*$/, "") + "<br>";
}

function ativarModoVermelho() {
    const terminalBox = document.getElementById('terminal-box');
    terminalBox.classList.add('panic-mode');
    // Adiciona a classe 'red' aos caracteres que já existem na tela
    document.querySelectorAll('.matrix-char').forEach(c => c.classList.add('red'));
}

function desativarModoVermelho() {
    document.getElementById('terminal-box').classList.remove('panic-mode');
    document.querySelectorAll('.matrix-char').forEach(c => c.classList.remove('red'));
}

async function login() {
    if (alarmeAtivo) return;

    // 1. Desabilita todos os inputs e o botão antes de começar
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const btn = document.getElementById('loginBtn');
    
    [username, password, btn].forEach(el => el.disabled = true);
    btn.textContent = "[ PROCESSING... ]"; // Feedback visual

    const output = document.getElementById('output');
    const terminalBox = document.getElementById('terminal-box');
    
    output.innerHTML = ""; 
    tentativas++;

    output.innerHTML += "> INITIALIZING UPLINK TO CIA MAIN_FRAME";
    await animarPontos(output, 750);

    output.innerHTML += "> DECRYPTING CREDENTIALS";
    await animarPontos(output, 1000);

    if (tentativas < 3) {
        await sleep(300);
        output.innerHTML += `<span style="color: #ffcc00;">> ERROR: ACCESS DENIED (${tentativas}/3). RE-ENTER CREDENTIALS...</span>`;
        
        // 2. Reabilita os campos para uma nova tentativa
        [username, password, btn].forEach(el => el.disabled = false);
        btn.textContent = "[ EXECUTE LOGIN ]";
        return;
    }

    // Se chegar no alarme, não precisa reabilitar, pois o usuário precisa resetar
    output.innerHTML += "> OVERRIDING SECURITY GATEWAY";
    await animarPontos(output, 1000);
    await sleep(400);
    
    terminalBox.classList.add('panic-mode');
    ativarModoVermelho();
    alarmeAtivo = true;
    
    output.innerHTML += `<span class="intrusion-detected">
=====================================<br>
[!] EMERGENCY ALERT: INTRUSION DETECTED!<br>
[!] CLICK ON INPUT TO RESET TERMINAL<br>
=====================================</span>`;
    
    // O botão fica desabilitado até o reset
    btn.textContent = "[ LOCKED ]";
}

function resetarAlarme() {
    if (alarmeAtivo) {
        desativarModoVermelho();
        alarmeAtivo = false;
        tentativas = 0;
        document.getElementById('output').innerHTML = "<span style='color: #39ff14;'>> Terminal reseted. Ready for new input...</span>";
    }
}

window.onload = function() {
    criarMatrixBackground();
    document.getElementById('username').addEventListener('focus', resetarAlarme);
    document.getElementById('password').addEventListener('focus', resetarAlarme);
    document.getElementById('loginBtn').addEventListener('click', login);
};

function resetarAlarme() {
    if (alarmeAtivo) {
        const terminalBox = document.getElementById('terminal-box');
        const output = document.getElementById('output');
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        const btn = document.getElementById('loginBtn');
        
        terminalBox.classList.remove('panic-mode');
        desativarModoVermelho();
        
        // Limpa e reabilita tudo
        output.innerHTML = "<span style='color: #39ff14;'>> Terminal reseted. Ready for new input...</span>";
        [username, password, btn].forEach(el => el.disabled = false);
        btn.textContent = "[ EXECUTE LOGIN ]";
        
        tentativas = 0;
        alarmeAtivo = false;
    }
}
