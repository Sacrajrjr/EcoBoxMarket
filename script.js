document.addEventListener("DOMContentLoaded", () => {

    const botoes = document.querySelectorAll(".add-to-cart");
    const listaCarrinho = document.getElementById("carrinho-lista");
    const totalCarrinho = document.getElementById("carrinho-total");
    const contadorCarrinho = document.getElementById("cart-count");

    // --- CARREGAR DO LOCALSTORAGE ---
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    atualizarCarrinho();
    atualizarContador();

    // --- ADICIONAR ITEM AO CARRINHO ---
    botoes.forEach(botao => {
        botao.addEventListener("click", (e) => {
            e.preventDefault();

            const card = botao.closest(".card");
            const nome = card.querySelector(".card-title").innerText;
            const preco = parseFloat(card.querySelector(".price-value").innerText);

            // 🔥 verificar se já existe no carrinho
            const existente = carrinho.find(item => item.nome === nome);

            if (existente) {
                existente.quantidade++;
            } else {
                carrinho.push({
                    nome,
                    preco,
                    quantidade: 1
                });
            }

            salvarCarrinho();
            atualizarCarrinho();
            atualizarContador();
        });
    });

    // --- ATUALIZAR LISTA E TOTAL ---
    function atualizarCarrinho() {
        listaCarrinho.innerHTML = "";
        let total = 0;

        carrinho.forEach((item, index) => {
            total += item.preco * item.quantidade;

            const li = document.createElement("li");
            li.classList.add("mb-3");

            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${item.nome}</strong><br>
                        <small>R$ ${item.preco.toFixed(2)} cada</small>
                    </div>

                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-outline-success" onclick="alterarQuantidade(${index}, -1)">−</button>
                        <span><strong>${item.quantidade}</strong></span>
                        <button class="btn btn-sm btn-outline-success" onclick="alterarQuantidade(${index}, 1)">+</button>

                        <button class="btn btn-sm btn-danger" onclick="removerItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <hr>
            `;

            listaCarrinho.appendChild(li);
        });

        totalCarrinho.innerText = total.;
    }

    // --- ALTERAR QUANTIDADE (+/-) ---
    window.alterarQuantidade = function(index, delta) {
        carrinho[index].quantidade += delta;

        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }

        salvarCarrinho();
        atualizarCarrinho();
        atualizarContador();
    };

    // --- REMOVER ITEM ---
    window.removerItem = function(index) {
        carrinho.splice(index, 1);
        salvarCarrinho();
        atualizarCarrinho();
        atualizarContador();
    };

    // --- LIMPAR CARRINHO ---
    window.limparCarrinho = function() {
        carrinho = [];
        salvarCarrinho();
        atualizarCarrinho();
        atualizarContador();
    };

    // --- SALVAR NO LOCALSTORAGE ---
    function salvarCarrinho() {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }

    // --- CONTADOR DO CARRINHO (NOVO) ---
    function atualizarContador() {
        const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);

        contadorCarrinho.textContent = totalItens;
        contadorCarrinho.style.display = totalItens > 0 ? "inline-block" : "none";
    }

});

