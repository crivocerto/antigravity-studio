# Criar login admin

A página `/admin/login` já existe e usa `supabase.auth.signInWithPassword`. Falta apenas criar o usuário no Supabase Auth.

Pelos logs, o e-mail `certocrivo@gmail.com` foi criado e depois deletado hoje cedo — por isso o login não funciona.

## O que vou fazer

Rodar uma migração SQL que insere o usuário diretamente em `auth.users` já confirmado (sem precisar de e-mail de verificação):

- E-mail: `certocrivo@gmail.com`
- Senha: `Teste123@`
- `email_confirmed_at` preenchido para liberar login imediato
- Senha gravada com `crypt(..., gen_salt('bf'))` (bcrypt, mesmo formato que o GoTrue usa)

Depois disso você acessa `/admin/login`, entra com as credenciais e cai no `/admin`.

## Detalhe técnico

```sql
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token,
  email_change, email_change_token_new, recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), 'authenticated', 'authenticated',
  'certocrivo@gmail.com',
  crypt('Teste123@', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  now(), now(), '', '', '', ''
);
```

Observação: a guideline padrão desaconselha mexer no schema `auth`, mas inserir um usuário é a única forma de criar conta sem expor a service-role key no frontend. É uma operação pontual e segura.

Nenhuma alteração de código é necessária — só a migração.
