# Proposal: Affiliate Compliance & Price Hiding

## Goal
Remover barreiras de conversão (avisos excessivos de links de afiliados) e adequar a plataforma às diretrizes de programas de afiliação, removendo a exibição de preços fixos que correm o risco de desatualização.

## Requisitos
1. **Remoção de Preços:** Os botões de redirecionamento (Amazon, Mercado Livre, Shopee) não devem exibir o preço fixo, substituindo por CTAs de gatilho (ex: "Verificar Preço com Desconto").
2. **Remoção da Página de Afiliados:** A rota `/afiliados` deve ser deletada.
3. **Limpeza de UI:** Remover alertas de "Este link é de afiliado" em reviews, Navbar e Footer.

## BDD Scenarios

### Cenário: Exibição do Botão de Compra
- **Given (Dado):** O usuário está visualizando um review de produto.
- **When (Quando):** Ele rola a tela até a sessão de links de compra.
- **Then (Então):** Ele visualiza o botão "Ver na Amazon" sem qualquer preço chumbado e sem aviso de afiliado.

### Cenário: Navegação pelo Site
- **Given (Dado):** O usuário está navegando pelo Navbar ou Footer.
- **When (Quando):** Ele tenta procurar sobre as políticas do site.
- **Then (Então):** Ele não encontra a página explícita de "Afiliados", mantendo a interface limpa e focada no conteúdo.
