const sleep = ms => new Promise(r => setTimeout(r, ms));

let tentativas = 0;
let alarmeAtivo = false;
let isProcessing = false;

// Função auxiliar para criar linhas de log de forma limpa
function adicionarLinha(container, texto, classe = "") {
    const span = document.createElement("span");
    if (classe) span.className = classe;
    span.innerHTML = texto + "<br>";
    container.appendChild(span);
    return span;
}

// Animação de pontos melhorada
async function animarPontos(container, textoBase, tempo) {
    const passos = tempo / 250;
    const elementoLinha = document.createElement("span");
    container.appendChild(elementoLinha);
    
    let pontos = "";
    for (let i = 0; i < passos; i++) {
        pontos = (pontos === "...") ? "" : pontos + ".";
        elementoLinha.innerText = `${textoBase}${pontos}`;
        await sleep(250);
    }
    elementoLinha.innerHTML += "<br>";
}

async function login() {
    if (alarmeAtivo || isProcessing) return;

    isProcessing = true;
    const output = document.getElementById("output");
    const box = document.getElementById("terminal-box");
    const btn = document.getElementById("loginBtn");

    btn.disabled = true;
    btn.innerText = "[ PROCESSING ]";
    tentativas++;

    try {
        if (tentativas === 1) output.innerHTML = "";

        await animarPontos(output, "> INITIALIZING CONNECTION", 800);
        await animarPontos(output, "> VERIFYING CREDENTIALS", 1000);

        await sleep(400);

        if (tentativas < 3) {
            adicionarLinha(output, `> ACCESS DENIED (${tentativas}/3)`, "denied-text");
            btn.disabled = false;
            btn.innerText = "[ EXECUTE LOGIN ]";
            isProcessing = false;
            return;
        }

        // ALARME ATIVADO
        await animarPontos(output, "> OVERRIDE DETECTED", 900);
        
        box.classList.add("panic-mode");
        alarmeAtivo = true;

        const alerta = `
        =====================================<br>
        [!] INTRUSION DETECTED<br>
        [!] SYSTEM LOCKED<br>
        [!] TOUCH INPUT TO RESET<br>
        =====================================`;
        
        adicionarLinha(output, alerta, "intrusion-detected");
        btn.innerText = "[ BLOCKED ]";

    } catch (err) {
        console.error(err);
        adicionarLinha(output, "> SYSTEM FAILURE", "error-text");
        btn.disabled = false;
        btn.innerText = "[ EXECUTE LOGIN ]";
        isProcessing = false;
    }
}

function resetarAlarme() {
    if (!alarmeAtivo) return;

    const box = document.getElementById("terminal-box");
    const output = document.getElementById("output");
    const btn = document.getElementById("loginBtn");

    box.classList.remove("panic-mode");
    output.innerHTML = "<span style='color:#39ff14'>> SYSTEM RESTORED</span><br>";

    tentativas = 0;
    alarmeAtivo = false;
    isProcessing = false;

    btn.disabled = false;
    btn.innerText = "[ EXECUTE LOGIN ]";
}

// Inicialização centralizada
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById("loginBtn");
    const user = document.getElementById("username");
    const pass = document.getElementById("password");

    if (btn) btn.addEventListener("click", login);
    if (user) user.addEventListener("focus", resetarAlarme);
    if (pass) pass.addEventListener("focus", resetarAlarme);
});
