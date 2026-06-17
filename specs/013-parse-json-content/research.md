# Research: Interpretação de JSON Inteligente pelo Frontend

## O Problema Principal (Root Cause)
O dump do banco de dados (CSV) revelou exatamente o que está acontecendo! O cronjob de Inteligência Artificial (`crivocerto_pet_daily`) está gerando os reviews com sucesso, mas em vez de preencher as colunas individuais do banco de dados (`hero_image`, `pros`, `cons`, `rating`), ele está jogando **todo o payload JSON cru** gerado pela IA diretamente dentro da coluna `content` da tabela `posts`.

Como o código atual do frontend espera que essas informações venham mapeadas direitinho das suas respectivas colunas do Postgres, o frontend lê as colunas vazias e acaba renderizando um post quebrado:
- Sem imagem (porque `hero_image` está nulo)
- Sem excerpt (porque está vazio)
- Sem nota (rating 0)
- E quando o usuário clica para ler, a página exibe um bloco de texto feio com código JSON no lugar do texto em Markdown.

## A Solução
Não precisamos alterar o Agent/Cronjob! A beleza de uma arquitetura moderna é que o frontend pode ser inteligente o suficiente para detectar isso. 
Vamos atualizar a função `mapPost` no `src/data/posts.ts`. Ela vai tentar fazer um `JSON.parse` na coluna `content`. Se der certo, ela mesma vai desmembrar esse JSON e repovoar as propriedades do post em tempo de execução, garantindo que o review do Alimentador Ekaza apareça idêntico aos outros.
