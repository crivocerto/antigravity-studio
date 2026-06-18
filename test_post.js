async function test() {
  try {
    const response = await fetch('https://jebfsjdibuqghnnxjcjn.supabase.co/functions/v1/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 123456789-qwertyuio'
      },
      body: JSON.stringify({
        title: "Air Fryer Teste Bot",
        original_price: 499.90,
        discount_price: 299.90,
        affiliate_url: "https://mercadolivre.com/sec/teste-bot",
        image_url: "https://http2.mlstatic.com/D_NQ_NP_900661-MLA71391500057_082023-O.webp",
        store: "Mercado Livre"
      })
    });
    
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", data);
  } catch(e) {
    console.error(e);
  }
}

test();
