import os
import requests
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()

SUPABASE_URL = "https://jebfsjdibuqghnnxjcjn.supabase.co/functions/v1/products"
BOT_API_KEY = os.getenv("BOT_API_KEY")

def buscar_ofertas():
    print("🚀 Iniciando o Caçador de Ofertas...")
    
    with sync_playwright() as p:
        # Lança um navegador Chromium disfarçado
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        # URL focada em Beleza e Cuidado Pessoal no ML (Ofertas do Dia)
        url_alvo = "https://www.mercadolivre.com.br/ofertas?category=MLB1246#origin=discount_hub&deal_print_id=2284b390-d0f9-11ee-b88a-3507c9b0e1b6&c_id=special-normal"
        
        print(f"📡 Acessando: {url_alvo}")
        page.goto(url_alvo, timeout=60000)
        
        # Espera os cards de produtos carregarem
        page.wait_for_selector(".promotion-item", timeout=15000)
        
        produtos = page.query_selector_all(".promotion-item")
        
        for produto in produtos[:3]: # Pega apenas os 3 primeiros para testar
            try:
                titulo = produto.query_selector(".promotion-item__title").inner_text()
                
                # Tratamento de preço (O ML divide em original e desconto)
                preco_desconto_str = produto.query_selector(".promotion-item__price span.andes-money-amount__fraction").inner_text()
                preco_desconto = float(preco_desconto_str.replace(".", "").replace(",", "."))
                
                # Link original do produto
                link_original = produto.query_selector("a.promotion-item__link-container").get_attribute("href")
                
                # Imagem
                imagem_tag = produto.query_selector("img.promotion-item__imgs")
                imagem_url = imagem_tag.get_attribute("src") if imagem_tag else ""

                oferta = {
                    "title": titulo,
                    "original_price": preco_desconto * 1.3, # Simulação rápida se não achar o antigo
                    "discount_price": preco_desconto,
                    "image_url": imagem_url,
                    "store": "Mercado Livre",
                    "affiliate_url": link_original # Mudado de original_link para affiliate_url conforme exigencia da API
                }
                
                enviar_para_supabase(oferta)

            except Exception as e:
                print(f"Erro ao extrair produto: {e}")
                continue

        browser.close()

def enviar_para_supabase(oferta):
    headers = {
        "Authorization": f"Bearer {BOT_API_KEY}",
        "Content-Type": "application/json"
    }
    
    print(f"📦 Injetando no banco: {oferta['title']}")
    response = requests.post(SUPABASE_URL, json=oferta, headers=headers)
    
    if response.status_code == 201:
        print("✅ Sucesso!")
    else:
        print(f"❌ Falha: {response.status_code} - {response.text}")

if __name__ == "__main__":
    buscar_ofertas()
