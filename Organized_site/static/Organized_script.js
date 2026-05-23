const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Contador de tentativas falhas
let tentativas = 0;
let alarmeAtivo = false;

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
    
    output.innerHTML += `<span class="intrusion-detected">
=====================================<br>
[!] EMERGENCY ALERT: INTRUSION DETECTED!<br>
[!] 3 FAILED ATTEMPTS - TRACE ROUTE INITIATED<br>
[!] CLICK ON INPUT TO RESET TERMINAL<br>
=====================================</span>`;
}

// Função para desligar o alarme quando o usuário focar em algum input
function resetarAlarme() {
    if (alarmeAtivo) {
        const terminalBox = document.getElementById('terminal-box');
        const output = document.getElementById('output');
        
        terminalBox.classList.remove('panic-mode'); // Para de tremer e desliga o vermelho
        output.innerHTML = "<span style='color: #39ff14;'>> Terminal reseted. Ready for new input...</span>";
        
        // Reseta o contador e o estado do alarme
        tentativas = 0;
        alarmeAtivo = false;
    }
}

// Adiciona o evento de escuta ("onfocus") nos campos de input assim que a página carrega
window.onload = function() {
    document.getElementById('username').addEventListener('focus', resetarAlarme);
    document.getElementById('password').addEventListener('focus', resetarAlarme);
};