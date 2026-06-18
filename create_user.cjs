const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdmin() {
    console.log("Criando usuário admin no Supabase Auth...");
    const { data, error } = await supabase.auth.admin.createUser({
        email: 'certocrivo@gmail.com',
        password: 'Teste123@',
        email_confirm: true,
        user_metadata: { role: 'admin' }
    });

    if (error) {
        console.error("Erro ao criar usuário:", error.message);
    } else {
        console.log("Usuário criado com sucesso:", data.user.email);
    }
}

createAdmin();
