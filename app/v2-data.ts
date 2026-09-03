export const ORIGIN_RULES: Record<string, { familiarity: string; charge: string }> = {
  Ninho: {
    familiarity: "+1d8 em etiqueta corporativa e acesso a serviços legais do seu Ninho.",
    charge: "Documentos, moradia ou emprego fora do Ninho custam 20% a mais.",
  },
  "Ruas de Trás": {
    familiarity: "+1d8 para encontrar rotas, abrigo e mercados clandestinos.",
    charge: "O primeiro teste burocrático em um Ninho sofre -1d8.",
  },
  Arredores: {
    familiarity: "+1d8 em orientação, fome, clima e criaturas desconhecidas.",
    charge: "Tecnologia de Wing desconhecida tem Dificuldade +1.",
  },
  "Instalação de Wing": {
    familiarity: "+1d8 em protocolos e tecnologia da Wing escolhida.",
    charge: "Registre uma obrigação, trauma ou ficha corporativa ainda ativa.",
  },
  Sindicato: {
    familiarity: "+1d8 em hierarquia criminal e negociação de território.",
    charge: "As regras, dívidas e limites do Sindicato continuam valendo.",
  },
  Oficina: {
    familiarity: "+1d8 para reconhecer qualidade e procedência de equipamento.",
    charge: "Você deve um favor ou parte dos lucros ao antigo mestre.",
  },
  Outra: {
    familiarity: "Combine a Familiaridade de uma origem com a Cobrança de outra.",
    charge: "Uma origem customizada não concede Atributo, dano ou autoridade automática.",
  },
};

export const BACKGROUND_RULES: Record<string, { benefit: string; charge: string }> = {
  "Antigo Fixer": { benefit: "+20% nos PD obtidos por Desvantagens.", charge: "-1 no resultado de ataques até ser promovido duas vezes." },
  "Sobrevivente das Ruas de Trás": { benefit: "+1d8 contra emboscadas e +1 Defesa na 1ª rodada.", charge: "Descanso inseguro recupera 25% menos Sanidade." },
  "Ex-Membro de Sindicato": { benefit: "+1d8 em intimidação e mercado ilegal; ganhe um contato.", charge: "Velhos aliados, rivais e dívidas voltam à campanha." },
  "Aprendiz de Oficina": { benefit: "+1d8 para criar, modificar e reparar; reparos próprios custam 20% menos.", charge: "Uma falha crítica destrói metade dos materiais." },
  "Ex-Agente de Segurança": { benefit: "Protegido 1 na primeira rodada e +1d8 para analisar segurança.", charge: "Sem armadura, sofra -1d8 contra Medo." },
  "Cobaia de Laboratório": { benefit: "+1d8 contra drogas, venenos, doenças e modificações corporais.", charge: "Traumas médicos, confinamento e perda corporal têm Dificuldade +1." },
  "Rato Experiente": { benefit: "+1d8 em furtividade e sobrevivência urbana; +20% de sucata.", charge: "Comece sem dinheiro." },
  Contrabandista: { benefit: "+1d8 para ocultar carga e atravessar postos; vendas ilegais rendem +20%.", charge: "Autoridades recebem +1d8 para reconhecer seus métodos." },
  Informante: { benefit: "+1d8 em investigação e um contato de informações.", charge: "Falha crítica alerta o alvo." },
  "Médico Clandestino": { benefit: "+1d8 em Medicina; cura em outros aumenta 25%.", charge: "Cura aplicada em si mesmo é reduzida em 10%." },
  "Veterano de Conflito": { benefit: "+1d8 em Iniciativa e Medo na primeira rodada.", charge: "Ferimentos antigos reduzem cura por descanso em 10%." },
  "Sobrevivente dos Arredores": { benefit: "+1d8 em sobrevivência, Medo e criaturas externas.", charge: "Burocracia e tecnologia urbana têm Dificuldade +1." },
  "Assistente de Escritório": { benefit: "+1d8 em contratos e risco; contratos oficiais rendem +10%.", charge: "Quebrar contrato gera multa de 20%." },
  Outro: { benefit: "Defina um benefício equivalente com o Mestre.", charge: "Defina uma cobrança que possa entrar em cena." },
};

export const EFFECT_RULES = [
  ["Sangramento", "negativo", "Ao usar Moeda ofensiva, sofre dano igual à Potência; reduza a Contagem em 1."],
  ["Queimadura", "negativo", "No fim da rodada, sofre dano igual à Potência; reduza a Contagem em 1."],
  ["Ruptura", "negativo", "Ao ser atingido, sofre dano adicional igual à Potência; reduza a Contagem em 1."],
  ["Tremor", "negativo", "Acumula instabilidade para efeitos de Explosão de Tremor."],
  ["Afundamento", "negativo", "Ao ser atingido, perde Sanidade igual à Potência; reduza a Contagem em 1."],
  ["Paralisia", "negativo", "Penaliza Moedas na próxima rodada conforme a Potência."],
  ["Fragilidade", "negativo", "Receba mais dano conforme a Potência durante a rodada."],
  ["Debilidade", "negativo", "Cause menos dano conforme a Potência durante a rodada."],
  ["Desarmado", "negativo", "Não pode usar o armamento indicado até recuperar a posse."],
  ["Imobilizado", "negativo", "Não pode gastar Movimento enquanto o efeito persistir."],
  ["Vínculo", "negativo", "Reduz deslocamento e pode impedir mudança de zona."],
  ["Fumaça", "negativo", "Amplia dano recebido, mas pode fortalecer técnicas próprias."],
  ["Pregos", "negativo", "Marcador acumulável usado por habilidades e punições."],
  ["Erosão", "negativo", "Desgasta proteção, armadura ou resistência."],
  ["Vulnerável", "negativo", "Piora uma resistência ou abre condição de acerto."],
  ["Pânico", "negativo", "Impede ação coerente até o personagem recuperar o controle."],
  ["Força", "positivo", "Aumenta dano ofensivo durante a rodada."],
  ["Resistência", "positivo", "Reduz dano recebido durante a rodada."],
  ["Rapidez", "positivo", "Aumenta iniciativa, deslocamento ou prioridade."],
  ["Proteção", "positivo", "Reduz dano recebido em Vida."],
  ["Proteção de Postura", "positivo", "Reduz dano recebido em Postura."],
  ["Firmeza", "positivo", "Resiste a empurrões, quedas e interrupções."],
  ["Poise", "positivo", "Reserva de precisão/critério consumida por técnicas."],
  ["Carga", "positivo", "Reserva elétrica consumida por habilidades e equipamentos."],
  ["Regeneração", "positivo", "Recupera recurso no momento indicado."],
  ["Espinhos", "positivo", "Causa retorno de dano quando o portador é atingido."],
  ["Fanatismo", "positivo", "Fortalece ações alinhadas à convicção indicada."],
  ["Blindagem", "positivo", "Absorve ou reduz dano antes da Vida."],
] as const;

export const WEAPON_PROFILES = {
  "ZAYIN / Grau 9–7": { damage: "2–4", weight: "2–3", coins: "1–2", modules: 1 },
  "TETH / Grau 6–4": { damage: "4–7", weight: "3–5", coins: "2–3", modules: 2 },
  "HE / Grau 3–2": { damage: "7–11", weight: "5–7", coins: "2–4", modules: 3 },
  "WAW / Grau 2–1": { damage: "11–16", weight: "7–10", coins: "3–5", modules: 4 },
  "ALEPH / Cor": { damage: "16–24", weight: "10–15", coins: "3–6", modules: 5 },
} as const;

export const WEAPON_MODULES = [
  ["Balanceada", "+1 Peso; não combina com Brutal."],
  ["Brutal", "+2 dano base; Carga +1."],
  ["Precisa", "Uma vez por rodada, repita uma Moeda que mostrou 1."],
  ["Oculta", "Carga -1 para revista e ocultação, mínimo 1; dano base -1."],
  ["Serrilhada", "Ao causar dano, Sangramento 2/2."],
  ["Incendiária", "Ao causar dano, Queimadura 2/2; exige munição especial."],
  ["Ressonante", "Ao atingir, Ruptura 2/2; manutenção custa 25% a mais."],
  ["Atordoante", "Troque metade do dano por Tremor igual ao valor trocado."],
  ["Conversora", "Escolha um segundo tipo de dano ao preparar a missão."],
  ["Vinculada", "+1d8 contra desarme; outra pessoa sofre -1d8 para usar."],
] as const;

export const DEFENSIVE_MODULES = [
  ["Placas substituíveis", "Uma vez por missão, ignore perda de Durabilidade; Carga +1."],
  ["Forro lunar", "+1d8 contra dano Branco e Medo; custo ×1,5."],
  ["Selagem", "+1d8 contra gás, líquido e contaminação; reparo exige oficina."],
  ["Distribuição de impacto", "Reduza dano de Postura em 2, uma vez por rodada."],
  ["Desengate rápido", "Vestir ou remover usa Movimento, não Ação."],
  ["Camuflagem ativa", "+1d8 para se ocultar imóvel; consome 1 Carga por cena."],
  ["Âncora corporal", "+1d8 contra empurrão e imobilização; -1 Iniciativa."],
  ["Reservatório", "Guarde até 5 Carga para implantes ou habilidades."],
] as const;

export const QUALITY_RULES = [
  ["Improvisado", "Metade do preço; Durabilidade -2; falha crítica quebra."],
  ["Comum", "Sem modificador."],
  ["Profissional", "Preço ×2; +1 Durabilidade ou +1d8 em função estreita."],
  ["Oficina renomada", "Preço ×5; dois módulos e assinatura visual."],
  ["Singularidade / E.G.O.", "Sem preço fixo; exige contrato, extração, licença ou consequência."],
] as const;

export const TRAINING_PROJECTS = [
  { type: "Talento extra", difficulty: 3, progress: 6, result: "Escolha adicional no mesmo nível de Talento." },
  { type: "Nova habilidade", difficulty: 3, progress: 8, result: "Registre uma nova Habilidade treinada." },
  { type: "Proficiência com arma", difficulty: 3, progress: 6, result: "Remova uma penalidade de uso da arma." },
  { type: "Reduzir complicação", difficulty: 4, progress: 8, result: "Atenue uma complicação recorrente." },
  { type: "Despertar Shin", difficulty: 4, progress: 12, result: "Desperte Shin e abra o primeiro Mang." },
  { type: "Dominar E.G.O.", difficulty: 5, progress: 12, result: "Controle uma manifestação ou equipamento E.G.O." },
];

export const MANG_MULTIPLIERS = [1, 1.1, 1.2, 1.3, 1.4, 1.6, 1.7, 2, 2.1, 2.3, 2.5, 2.8, 3.1, 3.4, 3.7, 4.1, 4.5, 5, 5.5, 6.1, 6.7];

export const SANITY_STATES = [
  ["Centrada", "70–100%", "Sem penalidade."],
  ["Tensa", "40–69%", "Sinais de estresse; interprete hesitação e irritação."],
  ["Fraturada", "20–39%", "A pressão mental já interfere nas decisões."],
  ["À Beira", "1–19%", "Qualquer nova perda pode provocar Ruptura."],
  ["Ruptura", "0%", "Faça o Teste de Ruptura e aplique o resultado narrativo."],
] as const;

export const DISTORTION_STAGES = [
  "0 — Estável",
  "1 — Sussurro",
  "2 — Fissura",
  "3 — Manifestação parcial",
  "4 — Distorção dominante",
  "5 — Quase Anormalidade",
  "6 — Anormalidade completa",
];

export const ANOMALY_RISKS = {
  ZAYIN: { budget: 8, moves: "1–2", life: "20–45", phases: "1", damage: "4–8" },
  TETH: { budget: 14, moves: "2–3", life: "40–80", phases: "2", damage: "8–14" },
  HE: { budget: 22, moves: "3–4", life: "75–140", phases: "3", damage: "14–22" },
  WAW: { budget: 34, moves: "4–6", life: "130–240", phases: "4", damage: "22–36" },
  ALEPH: { budget: 50, moves: "5–8", life: "220–400+", phases: "5+", damage: "36–60" },
} as const;

export const ANOMALY_PURCHASES = [
  ["+20 Vida ou +30 Postura", 1], ["+1 Movimento", 2], ["+2 dano ou +2 Peso", 1],
  ["Efeito 3/3", 2], ["Ataque em área", 2], ["Nova parte corporal", 3],
  ["Reação especial", 3], ["Fase extra", 5], ["Imunidade contornável", 4], ["Domínio altera o cenário", 6],
] as const;

export const ENCOUNTER_COSTS = [
  ["Lacaio", 0.5], ["Comum", 1], ["Elite", 2], ["Chefe de duas fases", 4],
  ["Equipamento acima do grupo", 1], ["Objetivo ou ambiente hostil", 1],
] as const;
