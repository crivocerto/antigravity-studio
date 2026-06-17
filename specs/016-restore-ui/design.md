# SDD Design: Restaurando Tema Lovable + Tailwind V4

## Modificações em Globals.css (Tailwind V4)
O Tailwind V4 gerencia os tokens no próprio CSS através da diretiva `@theme`. Injetaremos as cores originais da V3 no CSS raiz:

```css
@theme {
  --color-primary: #0d9a6e;
  --color-primary-bright: #10b981;
  --color-primary-deep: #065f46;
  --color-primary-fg: #ffffff;
  --color-ink: #111318;
  --color-body: #2d3039;
  --color-mute: #6b7280;
  --color-stone: #9ca3af;
  --color-surface: #f8f8fa;
  --color-hairline: #e5e7eb;
}

@layer base {
  body {
    background-color: white !important;
    color: var(--color-ink) !important;
  }
}
```

## Refatoração de Componentes
- `Header.tsx`: Copiar a estrutura do `old_navbar.tsx`, mas trocando o componente `<Link>` do TanStack Router para o `<Link>` do Next.js. O estado de rolagem (shadows) será portado usando `useEffect` como no original.
- `ProductCard.tsx` e `BannerVIP.tsx`: Passar um pente-fino garantindo que utilizem as cores como `bg-primary`, `text-ink`, e os arredondamentos da identidade antiga.
