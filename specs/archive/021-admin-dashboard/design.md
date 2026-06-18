# Admin Dashboard & Bot Fix Design

## Data Architecture
1. **Limpeza de Banco**: 
   - `DELETE FROM deals WHERE categoria = 'maquiagem'` seguido pela recarga do Bot apenas com a URL corrigida.
2. **Dashboard RPC (Opcional, mas recomendado)**:
   - Para o "Top 5 Produtos", será criada uma query Server-Side no Next.js (já que a segurança é `ADMIN_PASSWORD`). 
   - Query: Faz um JOIN das tabelas `deals` e `cliques` usando a sintaxe do Supabase JS para agregar contagem, agrupando e ordenando `desc`.

## Frontend Architecture
- **Página de Login (`/admin/login`)**:
  - Input simples, salva estado em `sessionStorage` (ex: `admin_auth=true`) para UX client-side.
  - Middleware no Next.js (`middleware.ts`): Protege a rota `/admin` exigindo a `ADMIN_PASSWORD` nos cookies ou query. Mas o mais simples para SSR é uma autenticação Server Action que seta um cookie de sessão assinado (com JOSE ou Iron-Session) ou apenas um cookie simples validado pelo Middleware.
- **Página Principal (`/admin/page.tsx`)**:
  - *Layout*: Topo com as métricas "Top 5", centro com formulário de injeção manual, e rodapé com a tabela CRUD.
  - *Data Fetching*: Server Component pegando os dados via `supabase` service_role.

## System Interfaces
- O botão de exclusão disparará uma **Server Action** (`deleteDeal(id)`) passando o cookie do Admin para autorização, usando o Supabase Admin Client.
- A injeção manual dispara uma **Server Action** (`addDeal(data)`) inserindo na tabela `deals`.

## Fallback & Constraints
- A injeção manual não resolve o gerador de afiliado (necessita bypass no bot local). O usuário deverá inserir o link afiliado (`https://meli.la/...`) diretamente no formulário, não a URL pura do produto. Se ele inserir URL pura, a conversão não será registrada. A UI terá um *Hint* informando isso.
