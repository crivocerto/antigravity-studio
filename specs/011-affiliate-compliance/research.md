# Research: Affiliate Compliance & Dynamic Pricing

## Contexto
O usuário solicitou a remoção de menções explícitas de links de afiliados e a ocultação de preços fixos nos botões de redirecionamento, apontando que exibir preços fixos fere diretrizes de programas de afiliados (como Amazon Associates) caso não sejam atualizados em tempo real, e que a exposição de rótulos "afiliados" prejudica a conversão/estética.

## Achados no Código
1. **Disclaimers de Afiliados:**
   - `src/components/layout/Footer.tsx`: Contém links para a rota `/afiliados` e um texto de aviso.
   - `src/components/layout/Navbar.tsx`: Contém links de navegação para a página de afiliados.
   - `src/routes/afiliados.tsx`: Página inteira dedicada a avisos de afiliação.
   - `src/routes/como-avaliamos.tsx`: Menciona afiliados.
   - `src/routes/review.$slug.tsx`: Alerta flutuante no final da página (Aviso afiliado).

2. **Preços Estáticos:**
   - `src/routes/review.$slug.tsx`: Renderiza `{link.price.toFixed(2)}` hardcoded.
   - O Schema de `affiliate_links` no Supabase possui a chave `"price"`.

## Implicações de Business/Compliance
- **Amazon Associates:** A Amazon exige legalmente a frase "Como Participante do Programa de Associados da Amazon, sou remunerado pelas compras qualificadas efetuadas". Remover o aviso por completo pode levar a banimento do programa. Uma alternativa é fundir esse aviso na página de "Termos de Uso" de forma discreta, em vez de um banner explícito.
- **Preços Estáticos:** A Amazon **proíbe** exibir preços que fiquem desatualizados. Portanto, remover o preço estático e trocar para uma CTA "Ver Preço na Amazon" não apenas atende o usuário, mas é 100% aderente às diretrizes de compliance do programa.
