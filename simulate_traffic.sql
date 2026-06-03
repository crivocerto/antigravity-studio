-- Apaga os dados antigos para termos um gráfico limpo de teste
TRUNCATE TABLE guide_views CASCADE;
TRUNCATE TABLE clicks_tracking CASCADE;

DO $$
DECLARE
    v_guide_id UUID;
    v_product_id UUID;
BEGIN
    -- Seleciona um guia e um produto base (os que criamos no E2E)
    SELECT id INTO v_guide_id FROM guides LIMIT 1;
    SELECT id INTO v_product_id FROM products LIMIT 1;

    IF v_guide_id IS NULL THEN
        RAISE NOTICE 'Nenhum guia encontrado para simular trafego.';
        RETURN;
    END IF;

    -- Inserir Page Views (10 a 50 por dia)
    INSERT INTO guide_views (guide_id, source, user_agent, created_at)
    SELECT 
      v_guide_id,
      'direct',
      'Mozilla/5.0 Test Simulator',
      CURRENT_TIMESTAMP - (d || ' days')::interval + (random() * 24 || ' hours')::interval
    FROM generate_series(0, 6) AS d
    CROSS JOIN generate_series(1, (random() * 40 + 10)::int);

    -- Inserir Cliques (20 a 100 por dia)
    INSERT INTO clicks_tracking (guide_id, product_id, marketplace, destination_url, created_at)
    SELECT 
      v_guide_id,
      v_product_id,
      (ARRAY['amazon', 'mercadolivre', 'shopee'])[floor(random() * 3 + 1)],
      'https://simulated.link',
      CURRENT_TIMESTAMP - (d || ' days')::interval + (random() * 24 || ' hours')::interval
    FROM generate_series(0, 6) AS d
    CROSS JOIN generate_series(1, (random() * 80 + 20)::int);
    
    RAISE NOTICE 'Trafego simulado com sucesso!';
END $$;
