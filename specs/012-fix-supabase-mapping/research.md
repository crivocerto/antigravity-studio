# Research: Falha de Comunicação e Resiliência do Frontend

## O Problema Principal (Root Cause)
O screenshot enviado confirmou o erro exato: `TypeError: Failed to fetch`. 
Isso não significa que o banco de dados está sem dados ou que o esquema SQL está errado. Significa que o navegador tentou fazer uma requisição HTTP para a URL do Supabase e o endereço **falhou na resolução DNS** ou foi bloqueado. 

Por que isso ocorreu?
A integração nativa do Lovable injeta as variáveis de ambiente com os nomes `SUPABASE_URL` e `SUPABASE_ANON_KEY`. 
No entanto, o projeto usa o bundler **Vite**. Por padrão, o Vite deleta (strip out) **todas** as variáveis de ambiente que não comecem com o prefixo `VITE_` por questões de segurança. Como resultado, o código compilado recebeu `undefined` para essas chaves.
Como nossa função de inicialização possuía um fallback (`https://placeholder-project.supabase.co`), o cliente do Supabase tentou conectar nesse placeholder, gerando o famoso erro de `Failed to fetch`.

## Problema Secundário (Crash de UI)
Quando ocorre um erro (ou quando os dados vêm mal formatados), o React tentou renderizar a propriedade `post.category.name`. Como `post.category` estava vindo como `undefined` (seja por falha do Join no Postgres ou pelo Mock de erro imperfeito), a aplicação inteira quebrou com a "Tela Branca da Morte" (`Cannot read properties of undefined`).

## A Solução (Já parcialmente implementada)
1. Precisamos garantir a resiliência do método `mapPost` (Type Safety com Fallbacks) para que a UI **NUNCA MAIS** quebre, mesmo se o banco retornar dados pela metade.
2. Precisamos ajustar o roteamento de erro para que posts com id "error" (os nossos posts fake de debug) não sejam clicáveis, já que eles não existem na base de dados de verdade e a rota `review/$slug` vai falhar.
