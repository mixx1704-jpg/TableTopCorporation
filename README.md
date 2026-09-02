# Tabletop Corp. — Ficha de Jogador

Aplicação estática para criar e administrar fichas de jogador do sistema Tabletop Corp.

## Recursos

- salvamento automático no navegador;
- importação e exportação de fichas em JSON;
- cálculos automáticos de Atributos, Vida, Sanidade, Postura, Carga, XP e PD;
- catálogo completo com 200 Vantagens/Desvantagens e 1.280 Talentos;
- editor de habilidades com Peso, dano, tipo, modificador e efeito independentes para cada Moeda;
- inventário, armadura, progressão de Fixer, Treinamento, Shin e Mang;
- resumo imprimível para PDF.

## Publicar no GitHub Pages

1. Extraia o ZIP e envie todo o conteúdo para um repositório GitHub.
2. Em **Settings → Pages → Build and deployment**, escolha **GitHub Actions**.
3. Faça um push na branch `main`. O workflow incluído monta e publica o site automaticamente.

O caminho do repositório é detectado automaticamente. Para este projeto, os arquivos
serão publicados sob `/TableTopCorporation`.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Para testar a exportação estática:

```bash
npm run build:pages
```

## Observação para Windows PowerShell

O `tsconfig.json` deve ser UTF-8 **sem BOM**. O workflow incluído normaliza esse arquivo
antes do build, mas, ao editá-lo manualmente no Windows PowerShell 5, evite
`Set-Content -Encoding utf8`, pois essa versão adiciona BOM ao começo do JSON.
