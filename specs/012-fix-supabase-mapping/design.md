# Design: Tratamento de Erros e Graceful Degradation

Não haverá novas interfaces ou designs de tela nesta Spec, pois o foco é inteiramente na infraestrutura e "Graceful Degradation" (degradação amigável).

O post de "Erro" já provou seu valor ao mostrar o erro no frontend. A única mudança visual será:
- Remover a tag de âncora (`<Link>`) dos componentes do `PostCard.tsx` se o `post.slug` for "error", alterando a cor do título para vermelho vibrante para destacar que se trata de uma mensagem do sistema e não um review real.
