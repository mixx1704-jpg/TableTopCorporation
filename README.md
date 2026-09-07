# Tabletop Corp. — Ficha de Jogador

Aplicação estática para criar e administrar fichas de jogador do sistema Tabletop Corp.

## Recursos

- salvamento automático no navegador;
- retrato do personagem com compressão, salvamento local e inclusão na ficha exportada;
- importação e exportação de fichas em JSON;
- cálculos automáticos de Atributos, Vida, Sanidade, Postura, Carga/Sobrecarga, XP e PD;
- catálogo completo com 200 Vantagens/Desvantagens e 1.280 Talentos;
- editor de habilidades com Peso, dano, tipo, modificador e efeito independentes para cada Moeda;
- aba de implantes com Capacidade, Estresse, modelos prontos e bônus automáticos de Atributos;
- Origem V2 com Casa, Rotina, Vínculo, Tabu, Ausência, Dívida, Familiaridade e Cobrança;
- combate com economia da rodada, Momentum por Moeda, Confronto, dano final e 28 Efeitos;
- inventário e armadura V2 com qualidade, procedência, preço, Durabilidade, módulos e perfis por Grau;
- progressão de Fixer, fontes rápidas de XP, projetos de Treino, Provas, Shin, Mang e Sobrecarga de Luz;
- Mente e E.G.O. com Âncoras, Feridas, Teste de Ruptura, Corrosão e Distorção;
- resumo imprimível para PDF.

## Publicar no GitHub Pages

1. Extraia o ZIP e envie todo o conteúdo para um repositório GitHub.
2. Em **Settings → Pages → Build and deployment**, escolha **GitHub Actions**.
3. Faça um push na branch `main`. O workflow incluído monta e publica o site automaticamente.

Não é necessário instalar Node para publicar: o GitHub Actions faz toda a compilação.

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

## Créditos visuais

Interface original inspirada na linguagem visual dos jogos da Project Moon. As duas artes
atmosféricas locais foram selecionadas a partir das referências oficiais creditadas no
Manual Expandido V2 fornecido para o projeto. Limbus Company, Lobotomy Corporation e
Library of Ruina pertencem à Project Moon. Este projeto é uma ferramenta de fã, sem
afiliação oficial.
