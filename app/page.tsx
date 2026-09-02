"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleDot,
  Database,
  Dices,
  Download,
  FileText,
  Gauge,
  Heart,
  ListChecks,
  Minus,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Search,
  Shield,
  Sparkles,
  Sword,
  Trash2,
  Upload,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ATTRIBUTE_TALENTS, CREATION_PERKS } from "./system-data";

const STORAGE_KEY = "tabletop-corp-ficha-v1";

const ATTRIBUTES = [
  "Força",
  "Vigor",
  "Agilidade",
  "Percepção",
  "Sanidade",
  "Inteligência",
  "Ego",
  "Vontade",
  "Superego",
  "Carisma",
  "Domar",
  "Prestidigitação",
  "Dano",
  "Ataque",
  "Shin e Mang",
  "Opressão",
] as const;

type AttributeName = (typeof ATTRIBUTES)[number];
type AttributeMap = Record<AttributeName, number>;

const ATTRIBUTE_GROUPS: { name: string; tone: string; attributes: AttributeName[] }[] = [
  { name: "Instinto", tone: "instinct", attributes: ["Força", "Vigor", "Agilidade", "Percepção"] },
  { name: "Entendimento", tone: "understanding", attributes: ["Sanidade", "Inteligência", "Ego", "Vontade"] },
  { name: "Apego", tone: "attachment", attributes: ["Superego", "Carisma", "Domar", "Prestidigitação"] },
  { name: "Repressão", tone: "repression", attributes: ["Dano", "Ataque", "Shin e Mang", "Opressão"] },
];

const ATTRIBUTE_HELP: Record<AttributeName, string> = {
  Força: "Potência física, alavanca, agarrões e carga.",
  Vigor: "Fôlego, dor, ferimentos e Vida Máxima.",
  Agilidade: "Velocidade, equilíbrio, esquiva e iniciativa.",
  Percepção: "Sentidos, atenção, pistas e emboscadas.",
  Sanidade: "Estabilidade mental e Sanidade Máxima.",
  Inteligência: "Raciocínio, memória, investigação e sistemas.",
  Ego: "Consciência de si, manifestação e controle de E.G.O.",
  Vontade: "Disciplina diante de dor, pressão e desespero.",
  Superego: "Autocontrole, consciência moral e impulsos.",
  Carisma: "Presença, liderança, negociação e intimidação.",
  Domar: "Paciência, leitura instintiva e criação de vínculos.",
  Prestidigitação: "Precisão manual, ocultação e mecanismos.",
  Dano: "Potencial destrutivo quando uma fórmula o inclui.",
  Ataque: "Treino ofensivo, leitura de guarda e consistência.",
  "Shin e Mang": "Domínio consciente da Luz; começa bloqueado.",
  Opressão: "Imobilizar, interromper, derrubar e negar espaço.",
};

const OFFICES = [
  "Fixer",
  "Funcionário de Wing",
  "Soldado Mercenário",
  "Pecador da Limbus Company",
  "Membro da Head",
  "Investigador de Distorções",
  "Bibliotecário ou Recepcionista",
  "Membro de Associação",
  "Membro de Sindicato",
  "Outro",
];

const BACKGROUNDS = [
  "Antigo Fixer",
  "Sobrevivente das Ruas de Trás",
  "Ex-Membro de Sindicato",
  "Aprendiz de Oficina",
  "Ex-Agente de Segurança",
  "Cobaia de Laboratório",
  "Rato Experiente",
  "Contrabandista",
  "Informante",
  "Médico Clandestino",
  "Veterano de Conflito",
  "Sobrevivente dos Arredores",
  "Assistente de Escritório",
  "Outro",
];

const ORIGINS = ["Ninho", "Ruas de Trás", "Arredores", "Instalação de Wing", "Sindicato", "Oficina", "Outra"];
const DAMAGE_TYPES = ["Vermelho", "Branco", "Preto", "Pálido", "Verdadeiro", "Postura", "Outro"];
const SKILL_TYPES = ["Ataque", "Defesa", "Esquiva", "Suporte", "E.G.O.", "Shin", "Passiva"];

type Coin = {
  id: string;
  name: string;
  weight: number;
  modifier: number;
  successOn: number;
  damage: string;
  damageType: string;
  effect: string;
};

type Skill = {
  id: string;
  name: string;
  type: string;
  cost: string;
  range: string;
  targets: string;
  description: string;
  commonDamage: number;
  coins: Coin[];
};

type Item = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  load: number;
  durability: number;
  durabilityMax: number;
  details: string;
};

type CustomPerk = {
  id: string;
  name: string;
  kind: "vantagem" | "desvantagem";
  pd: number;
  rule: string;
};

type Armor = {
  name: string;
  armorClass: string;
  red: number;
  white: number;
  black: number;
  pale: number;
  block: number;
  durability: number;
  durabilityMax: number;
  notes: string;
};

type Sheet = {
  version: 1;
  identity: {
    name: string;
    player: string;
    pronouns: string;
    age: string;
    appearance: string;
    origin: string;
    background: string;
    office: string;
    concept: string;
    desire: string;
    trauma: string;
    contradiction: string;
    anchors: string;
    bonds: string;
  };
  level: number;
  xp: number;
  attributes: AttributeMap;
  resources: {
    life: number;
    sanity: number;
    posture: number;
    momentum: number;
    dissonance: number;
    money: number;
    activeMang: number;
  };
  selectedPerks: string[];
  customPerks: CustomPerk[];
  selectedTalents: string[];
  skills: Skill[];
  items: Item[];
  armor: Armor;
  progression: {
    trainingMarks: number;
    reputation: number;
    contracts: number;
    fixerGrade: string;
    shinAwakened: boolean;
    trainingNotes: string;
  };
  notes: string;
};

const emptyAttributes = (): AttributeMap => Object.fromEntries(ATTRIBUTES.map((name) => [name, 0])) as AttributeMap;

const DEMO_COINS: Coin[] = [
  { id: "coin-1", name: "Abertura", weight: 5, modifier: 0, successOn: 6, damage: "1d4+2", damageType: "Vermelho", effect: "Sangramento 1/1" },
  { id: "coin-2", name: "Corte", weight: 7, modifier: 0, successOn: 6, damage: "2d4", damageType: "Vermelho", effect: "" },
  { id: "coin-3", name: "Ruptura", weight: 4, modifier: 1, successOn: 6, damage: "1d6+1", damageType: "Preto", effect: "Ruptura 2/2" },
  { id: "coin-4", name: "Fecho", weight: 9, modifier: -1, successOn: 6, damage: "2d6+3", damageType: "Pálido", effect: "Recarga 2" },
];

const DEFAULT_SHEET: Sheet = {
  version: 1,
  identity: {
    name: "Novo Funcionário",
    player: "",
    pronouns: "",
    age: "",
    appearance: "",
    origin: "Ruas de Trás",
    background: "Rato Experiente",
    office: "Fixer",
    concept: "",
    desire: "",
    trauma: "",
    contradiction: "",
    anchors: "",
    bonds: "",
  },
  level: 1,
  xp: 0,
  attributes: emptyAttributes(),
  resources: { life: 21, sanity: 16, posture: 42, momentum: 0, dissonance: 0, money: 0, activeMang: 0 },
  selectedPerks: [],
  customPerks: [],
  selectedTalents: [],
  skills: [
    {
      id: "skill-demo",
      name: "Corte Assimétrico",
      type: "Ataque",
      cost: "1 Ação",
      range: "Corpo a corpo",
      targets: "1 alvo",
      description: "Exemplo editável: quatro Moedas com Peso, dano, tipo e efeito próprios.",
      commonDamage: 0,
      coins: DEMO_COINS,
    },
  ],
  items: [],
  armor: { name: "Sem armadura", armorClass: "Comum", red: 1, white: 1, black: 1, pale: 1, block: 0, durability: 0, durabilityMax: 0, notes: "" },
  progression: { trainingMarks: 0, reputation: 0, contracts: 0, fixerGrade: "9", shinAwakened: false, trainingNotes: "" },
  notes: "",
};

const deepCopyDefault = () => JSON.parse(JSON.stringify(DEFAULT_SHEET)) as Sheet;
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

function mergeSheet(candidate: Partial<Sheet>): Sheet {
  const base = deepCopyDefault();
  return {
    ...base,
    ...candidate,
    identity: { ...base.identity, ...(candidate.identity ?? {}) },
    attributes: { ...base.attributes, ...(candidate.attributes ?? {}) },
    resources: { ...base.resources, ...(candidate.resources ?? {}) },
    progression: { ...base.progression, ...(candidate.progression ?? {}) },
    armor: { ...base.armor, ...(candidate.armor ?? {}) },
    selectedPerks: Array.isArray(candidate.selectedPerks) ? candidate.selectedPerks : [],
    selectedTalents: Array.isArray(candidate.selectedTalents) ? candidate.selectedTalents : [],
    customPerks: Array.isArray(candidate.customPerks) ? candidate.customPerks : [],
    skills: Array.isArray(candidate.skills) ? candidate.skills : base.skills,
    items: Array.isArray(candidate.items) ? candidate.items : [],
    version: 1,
  };
}

function mangMultiplier(spent: number) {
  if (spent === 7) return 2;
  return Math.floor(Math.pow(1.1, Math.max(0, spent)) * 10) / 10;
}

function rollExpression(expression: string): { total: number; detail: string } | null {
  const compact = expression.replace(/\s+/g, "");
  if (!compact || !/^[0-9dD+\-]+$/.test(compact)) return null;
  const parts = compact.match(/[+\-]?[^+\-]+/g);
  if (!parts) return null;
  let total = 0;
  const detail: string[] = [];
  for (const part of parts) {
    const sign = part.startsWith("-") ? -1 : 1;
    const token = part.replace(/^[+\-]/, "");
    const dice = token.match(/^(\d*)[dD](\d+)$/);
    if (dice) {
      const count = clamp(Number(dice[1] || 1), 1, 100);
      const faces = clamp(Number(dice[2]), 2, 1000);
      const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * faces) + 1);
      total += sign * rolls.reduce((sum, roll) => sum + roll, 0);
      detail.push(`${sign < 0 ? "-" : ""}[${rolls.join(", ")}]`);
    } else if (/^\d+$/.test(token)) {
      total += sign * Number(token);
      detail.push(`${sign < 0 ? "-" : "+"}${token}`);
    } else return null;
  }
  return { total, detail: detail.join(" ").replace(/^\+/, "") };
}

function Choice({ value, options, onChange, label, className = "" }: { value: string; options: string[]; onChange: (value: string) => void; label: string; className?: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`tc-select ${className}`} aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="tc-select-content">
        {options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function Field({ label, value, onChange, placeholder = "", type = "text", min, max, step, className = "" }: { label: string; value: string | number; onChange: (value: string) => void; placeholder?: string; type?: string; min?: number; max?: number; step?: number; className?: string }) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} min={min} max={max} step={step} />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder = "", rows = 3, className = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; rows?: number; className?: string }) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} />
    </label>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <header className="section-heading">
      <span className="section-index">{eyebrow}</span>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </header>
  );
}

function StatCard({ label, value, detail, tone = "neutral", icon }: { label: string; value: string | number; detail?: string; tone?: string; icon?: React.ReactNode }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-label">{icon}{label}</div>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

function NumberBox({ value, onChange, min = 0, max = 999, label }: { value: number; onChange: (value: number) => void; min?: number; max?: number; label: string }) {
  return <input className="number-box" aria-label={label} type="number" min={min} max={max} value={value} onChange={(event) => onChange(clamp(Number(event.target.value), min, max))} />;
}

const fixerGrades = [
  { grade: "9", level: 1, reputation: 0, contracts: 0, requirement: "Registro e teste básico" },
  { grade: "8", level: 2, reputation: 10, contracts: 2, requirement: "2 contratos" },
  { grade: "7", level: 4, reputation: 25, contracts: 5, requirement: "5 contratos" },
  { grade: "6", level: 6, reputation: 45, contracts: 8, requirement: "8 contratos e avaliação" },
  { grade: "5", level: 8, reputation: 70, contracts: 12, requirement: "12 contratos" },
  { grade: "4", level: 10, reputation: 100, contracts: 16, requirement: "16 contratos e recomendação" },
  { grade: "3", level: 12, reputation: 140, contracts: 21, requirement: "21 contratos e feito público" },
  { grade: "2", level: 15, reputation: 190, contracts: 27, requirement: "27 contratos e prova de mérito" },
  { grade: "1", level: 18, reputation: 250, contracts: 35, requirement: "35 contratos e operação extraordinária" },
  { grade: "Cor", level: 20, reputation: 320, contracts: 35, requirement: "Nomeação da Hana e feito irrepetível" },
];

export default function Home() {
  const [sheet, setSheet] = useState<Sheet>(DEFAULT_SHEET);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState("Aguardando dados");
  const [activeTab, setActiveTab] = useState("identidade");
  const [talentAttribute, setTalentAttribute] = useState<AttributeName>("Força");
  const [talentLevel, setTalentLevel] = useState("Liberados");
  const [talentSearch, setTalentSearch] = useState("");
  const [perkKind, setPerkKind] = useState<"vantagem" | "desvantagem">("vantagem");
  const [perkSearch, setPerkSearch] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("skill-demo");
  const [attributeRoll, setAttributeRoll] = useState<{ name: string; dice: number[]; hits: number } | null>(null);
  const [skillRoll, setSkillRoll] = useState<{ skillId: string; results: { coin: Coin; raw: number; final: number; success: boolean; weight: number; damage: number; detail: string }[]; totalWeight: number; totalDamage: number } | null>(null);
  const [xpGain, setXpGain] = useState(2);
  const [customPerkDraft, setCustomPerkDraft] = useState({ name: "", kind: "vantagem" as "vantagem" | "desvantagem", pd: 1, rule: "" });
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const loaded = mergeSheet(JSON.parse(raw));
          setSheet(loaded);
          setSelectedSkillId(loaded.skills[0]?.id ?? "");
        }
      } catch {
        toast.error("O salvamento local não pôde ser lido.");
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sheet));
      setSaveState(`Salvo localmente às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [sheet, hydrated]);

  const selectedOfficialPerks = useMemo(() => CREATION_PERKS.filter((perk) => sheet.selectedPerks.includes(perk.id)), [sheet.selectedPerks]);
  const hasPerk = (id: string) => sheet.selectedPerks.includes(id);
  const rawDisadvantagePD = selectedOfficialPerks.filter((perk) => perk.kind === "desvantagem").reduce((sum, perk) => sum + perk.pd, 0) + sheet.customPerks.filter((perk) => perk.kind === "desvantagem").reduce((sum, perk) => sum + perk.pd, 0);
  const gainedPD = sheet.identity.background === "Antigo Fixer" ? Math.floor(rawDisadvantagePD * 1.2) : rawDisadvantagePD;
  const spentPD = selectedOfficialPerks.filter((perk) => perk.kind === "vantagem").reduce((sum, perk) => sum + perk.pd, 0) + sheet.customPerks.filter((perk) => perk.kind === "vantagem").reduce((sum, perk) => sum + perk.pd, 0);
  const pdBalance = gainedPD - spentPD;
  const attributeBudget = Math.max(0, 10 + (sheet.level - 1) * 2 + (hasPerk("vantagem-1") ? sheet.level - 1 : 0) - (hasPerk("desvantagem-4") ? 1 : 0));
  const attributeSpent = ATTRIBUTES.reduce((sum, attribute) => sum + sheet.attributes[attribute], 0);
  const attributeCap = Math.min(20, sheet.level + 1);
  const maxLife = Math.max(1, 20 + sheet.level + sheet.attributes.Vigor * 4 + (hasPerk("vantagem-2") ? 4 : 0) - (hasPerk("desvantagem-2") ? 4 : 0));
  const maxSanity = Math.max(1, 15 + sheet.level + sheet.attributes.Sanidade * 4 + (hasPerk("vantagem-3") ? 4 : 0) - (hasPerk("desvantagem-3") ? 4 : 0));
  const maxPosture = maxLife * 2;
  const maxLoad = 5 + sheet.attributes.Força;
  const currentLoad = sheet.items.reduce((sum, item) => sum + item.load * item.quantity, 0);
  const nextXP = sheet.level >= 20 ? 0 : 8 + sheet.level * 2;
  const sanityPercent = Math.round((sheet.resources.sanity / maxSanity) * 100);
  const sanityState = sanityPercent <= 0 ? "Ruptura" : sanityPercent < 20 ? "À Beira" : sanityPercent < 40 ? "Fraturada" : sanityPercent < 70 ? "Tensa" : "Centrada";
  const talentTrainingCost = useMemo(() => {
    const counts = new Map<string, number>();
    for (const id of sheet.selectedTalents) {
      const talent = ATTRIBUTE_TALENTS.find((entry) => entry.id === id);
      if (!talent) continue;
      const key = `${talent.attribute}-${talent.level}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    let cost = 0;
    counts.forEach((count, key) => {
      const level = Number(key.split("-").at(-1));
      if (count > 1) cost += (count - 1) * (level <= 4 ? 1 : level <= 8 ? 2 : level <= 12 ? 3 : level <= 16 ? 4 : 5);
    });
    return cost;
  }, [sheet.selectedTalents]);

  const warnings = useMemo(() => {
    const result: string[] = [];
    if (attributeSpent > attributeBudget) result.push(`Atributos excedem o orçamento em ${attributeSpent - attributeBudget} ponto(s).`);
    if (attributeSpent < attributeBudget) result.push(`Ainda há ${attributeBudget - attributeSpent} ponto(s) de Atributo para distribuir.`);
    if (pdBalance < 0) result.push(`Faltam ${Math.abs(pdBalance)} PD para pagar as Vantagens escolhidas.`);
    if (rawDisadvantagePD > 10) result.push(`As Desvantagens somam ${rawDisadvantagePD} PD; o livro recomenda no máximo 10 na criação.`);
    if (sheet.selectedPerks.includes("vantagem-1") && sheet.selectedPerks.includes("desvantagem-5")) result.push("Habilidoso e Aprendizado Lento são incompatíveis.");
    if (sheet.selectedPerks.includes("vantagem-2") && sheet.selectedPerks.includes("desvantagem-2")) result.push("Corpo Robusto e Corpo Frágil são incompatíveis.");
    if (sheet.selectedPerks.includes("vantagem-3") && sheet.selectedPerks.includes("desvantagem-3")) result.push("Mente Fortificada e Mente Instável são incompatíveis.");
    selectedOfficialPerks.filter((perk) => perk.office !== "Geral" && perk.office !== sheet.identity.office).forEach((perk) => result.push(`${perk.name} exige o Ofício ${perk.office}.`));
    if (currentLoad > maxLoad) result.push(`Carga excedida em ${(currentLoad - maxLoad).toFixed(1)}.`);
    for (const attribute of ATTRIBUTES) if (sheet.attributes[attribute] > attributeCap) result.push(`${attribute} excede o limite natural ${attributeCap}.`);
    if (!sheet.progression.shinAwakened && sheet.attributes["Shin e Mang"] > 0) result.push("Shin e Mang possui pontos, mas ainda está bloqueado.");
    return result;
  }, [attributeBudget, attributeCap, attributeSpent, currentLoad, maxLoad, pdBalance, rawDisadvantagePD, selectedOfficialPerks, sheet]);

  const filteredTalents = useMemo(() => ATTRIBUTE_TALENTS.filter((talent) => {
    if (talent.attribute !== talentAttribute) return false;
    if (talentLevel === "Liberados" && talent.level > sheet.attributes[talentAttribute]) return false;
    if (talentLevel !== "Liberados" && talentLevel !== "Todos" && talent.level !== Number(talentLevel)) return false;
    const query = talentSearch.trim().toLowerCase();
    return !query || talent.name.toLowerCase().includes(query) || talent.effect.toLowerCase().includes(query);
  }), [sheet.attributes, talentAttribute, talentLevel, talentSearch]);

  const filteredPerks = useMemo(() => CREATION_PERKS.filter((perk) => {
    if (perk.kind !== perkKind) return false;
    const query = perkSearch.trim().toLowerCase();
    return !query || perk.name.toLowerCase().includes(query) || perk.rule.toLowerCase().includes(query) || perk.office.toLowerCase().includes(query);
  }), [perkKind, perkSearch]);

  const selectedSkill = sheet.skills.find((skill) => skill.id === selectedSkillId) ?? sheet.skills[0];

  function updateIdentity<K extends keyof Sheet["identity"]>(key: K, value: Sheet["identity"][K]) {
    setSheet((current) => ({ ...current, identity: { ...current.identity, [key]: value } }));
  }

  function updateResource<K extends keyof Sheet["resources"]>(key: K, value: number) {
    setSheet((current) => ({ ...current, resources: { ...current.resources, [key]: value } }));
  }

  function updateProgression<K extends keyof Sheet["progression"]>(key: K, value: Sheet["progression"][K]) {
    setSheet((current) => ({ ...current, progression: { ...current.progression, [key]: value } }));
  }

  function setAttribute(attribute: AttributeName, value: number) {
    if (attribute === "Shin e Mang" && !sheet.progression.shinAwakened) return;
    const safe = clamp(value, 0, 20);
    setSheet((current) => {
      const delta = safe - current.attributes[attribute];
      const resources = { ...current.resources };
      if (delta > 0 && attribute === "Vigor") {
        resources.life += delta * 4;
        resources.posture += delta * 8;
      }
      if (delta > 0 && attribute === "Sanidade") resources.sanity += delta * 4;
      return { ...current, attributes: { ...current.attributes, [attribute]: safe }, resources };
    });
  }

  function togglePerk(id: string) {
    setSheet((current) => ({ ...current, selectedPerks: current.selectedPerks.includes(id) ? current.selectedPerks.filter((perkId) => perkId !== id) : [...current.selectedPerks, id] }));
  }

  function toggleTalent(id: string) {
    setSheet((current) => ({ ...current, selectedTalents: current.selectedTalents.includes(id) ? current.selectedTalents.filter((talentId) => talentId !== id) : [...current.selectedTalents, id] }));
  }

  function rollAttribute(attribute: AttributeName) {
    const count = Math.max(1, sheet.attributes[attribute]);
    const dice = Array.from({ length: count }, () => Math.floor(Math.random() * 8) + 1);
    setAttributeRoll({ name: attribute, dice, hits: dice.filter((die) => die >= 5).length });
  }

  function updateSkill(skillId: string, patch: Partial<Skill>) {
    setSheet((current) => ({ ...current, skills: current.skills.map((skill) => skill.id === skillId ? { ...skill, ...patch } : skill) }));
  }

  function updateCoin(skillId: string, coinId: string, patch: Partial<Coin>) {
    setSheet((current) => ({ ...current, skills: current.skills.map((skill) => skill.id === skillId ? { ...skill, coins: skill.coins.map((coin) => coin.id === coinId ? { ...coin, ...patch } : coin) } : skill) }));
  }

  function addSkill() {
    const id = uid("skill");
    const skill: Skill = { id, name: "Nova habilidade", type: "Ataque", cost: "1 Ação", range: "Corpo a corpo", targets: "1 alvo", description: "", commonDamage: 0, coins: [] };
    setSheet((current) => ({ ...current, skills: [...current.skills, skill] }));
    setSelectedSkillId(id);
  }

  function duplicateSkill(skill: Skill) {
    const id = uid("skill");
    const copy = { ...skill, id, name: `${skill.name} — cópia`, coins: skill.coins.map((coin) => ({ ...coin, id: uid("coin") })) };
    setSheet((current) => ({ ...current, skills: [...current.skills, copy] }));
    setSelectedSkillId(id);
  }

  function deleteSkill(skillId: string) {
    setSheet((current) => {
      const next = current.skills.filter((skill) => skill.id !== skillId);
      setSelectedSkillId(next[0]?.id ?? "");
      return { ...current, skills: next };
    });
  }

  function addCoin(skillId: string) {
    const coin: Coin = { id: uid("coin"), name: `Moeda ${selectedSkill?.coins.length ? selectedSkill.coins.length + 1 : 1}`, weight: 3, modifier: 0, successOn: 6, damage: "1d4", damageType: "Vermelho", effect: "" };
    updateSkill(skillId, { coins: [...(selectedSkill?.coins ?? []), coin] });
  }

  function moveCoin(skill: Skill, coinId: string, direction: -1 | 1) {
    const index = skill.coins.findIndex((coin) => coin.id === coinId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= skill.coins.length) return;
    const coins = [...skill.coins];
    [coins[index], coins[target]] = [coins[target], coins[index]];
    updateSkill(skill.id, { coins });
  }

  function rollSkill(skill: Skill) {
    const results = skill.coins.map((coin) => {
      const raw = Math.floor(Math.random() * 8) + 1;
      const final = clamp(raw + coin.modifier, 1, 8);
      const success = final >= coin.successOn;
      const rolled = success ? rollExpression(coin.damage) : null;
      return { coin, raw, final, success, weight: success ? coin.weight : 0, damage: rolled?.total ?? 0, detail: rolled?.detail ?? (success ? "fórmula livre" : "—") };
    });
    const successful = results.filter((result) => result.success).length;
    setSkillRoll({ skillId: skill.id, results, totalWeight: results.reduce((sum, result) => sum + result.weight, 0), totalDamage: results.reduce((sum, result) => sum + result.damage, 0) + (successful ? skill.commonDamage : 0) });
  }

  function addItem() {
    setSheet((current) => ({ ...current, items: [...current.items, { id: uid("item"), name: "Novo item", category: "Equipamento", quantity: 1, load: 1, durability: 10, durabilityMax: 10, details: "" }] }));
  }

  function updateItem(itemId: string, patch: Partial<Item>) {
    setSheet((current) => ({ ...current, items: current.items.map((item) => item.id === itemId ? { ...item, ...patch } : item) }));
  }

  function addCustomPerk() {
    if (!customPerkDraft.name.trim()) return toast.error("Dê um nome ao perk customizado.");
    setSheet((current) => ({ ...current, customPerks: [...current.customPerks, { ...customPerkDraft, id: uid("custom-perk") }] }));
    setCustomPerkDraft({ name: "", kind: "vantagem", pd: 1, rule: "" });
    toast.success("Perk customizado incluído.");
  }

  function exportSheet() {
    const blob = new Blob([JSON.stringify(sheet, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(sheet.identity.name || "personagem").toLowerCase().replace(/[^a-z0-9áàâãéêíóôõúç]+/gi, "-")}.tabletop-corp.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Ficha exportada.");
  }

  function importSheet(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = mergeSheet(JSON.parse(String(reader.result)));
        setSheet(imported);
        setSelectedSkillId(imported.skills[0]?.id ?? "");
        toast.success("Ficha importada e salva localmente.");
      } catch {
        toast.error("Esse arquivo não é uma ficha válida.");
      }
    };
    reader.readAsText(file);
  }

  function manualSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sheet));
    setSaveState("Salvo agora");
    toast.success("Ficha salva neste dispositivo.");
  }

  function addXP() {
    const adjusted = (hasPerk("vantagem-1") || hasPerk("desvantagem-5")) ? Math.floor(xpGain * 0.9) : xpGain;
    setSheet((current) => ({ ...current, xp: current.xp + Math.max(0, adjusted) }));
    toast.success(`${adjusted} XP adicionado${adjusted !== xpGain ? " após o modificador de 10%" : ""}.`);
  }

  function levelUp() {
    if (sheet.level >= 20 || sheet.xp < nextXP) return;
    setSheet((current) => ({
      ...current,
      level: current.level + 1,
      xp: current.xp - nextXP,
      resources: { ...current.resources, life: current.resources.life + 1, sanity: current.resources.sanity + 1, posture: current.resources.posture + 2 },
      progression: { ...current.progression, trainingMarks: current.progression.trainingMarks + 1 },
    }));
    toast.success("Nível aumentado: o orçamento de Atributos e as Marcas de Treino foram atualizados.");
  }

  const tabItems = [
    ["identidade", "01", "Identidade", UserRound],
    ["atributos", "02", "Atributos", Gauge],
    ["talentos", "03", "Talentos", Sparkles],
    ["perks", "04", "Perks", ListChecks],
    ["habilidades", "05", "Habilidades", Sword],
    ["equipamento", "06", "Equipamento", Shield],
    ["progressao", "07", "Progressão", Zap],
    ["resumo", "08", "Resumo", FileText],
  ] as const;

  return (
    <main className="app-shell">
      <Toaster position="bottom-right" richColors />
      <div className="signal-rail" aria-hidden="true"><span>TABLETOP CORP.</span><i /><span>ARQUIVO DE PESSOAL</span></div>

      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><span>TC</span><i>01</i></div>
          <div><p>SISTEMA DE GESTÃO DE ATIVOS</p><h1>Ficha de Funcionário</h1></div>
        </div>
        <div className="topbar-actions">
          <span className={`save-indicator ${saveState.includes("Salvo") ? "saved" : ""}`}><Database />{saveState}</span>
          <Button variant="outline" size="sm" onClick={manualSave}><Save /> Salvar</Button>
          <Button variant="outline" size="sm" onClick={() => importRef.current?.click()}><Upload /> Importar</Button>
          <input ref={importRef} hidden type="file" accept="application/json,.json" onChange={(event) => { importSheet(event.target.files?.[0]); event.currentTarget.value = ""; }} />
          <Button variant="outline" size="sm" onClick={exportSheet}><Download /> Exportar</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Apagar e reiniciar ficha"><RotateCcw /></Button></AlertDialogTrigger>
            <AlertDialogContent className="tc-dialog">
              <AlertDialogHeader><AlertDialogTitle>Reiniciar toda a ficha?</AlertDialogTitle><AlertDialogDescription>Os dados locais atuais serão substituídos. Exporte um JSON antes se quiser guardar uma cópia.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => { const fresh = deepCopyDefault(); setSheet(fresh); setSelectedSkillId(fresh.skills[0].id); toast.success("Ficha reiniciada."); }}>Reiniciar ficha</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <section className="status-deck">
        <div className="subject-card">
          <div className="subject-number">#{String(sheet.level).padStart(2, "0")}</div>
          <div><span>SUJEITO REGISTRADO</span><strong>{sheet.identity.name || "Sem nome"}</strong><small>{sheet.identity.office} · {sheet.identity.origin}</small></div>
        </div>
        <StatCard tone="life" label="Vida" value={`${sheet.resources.life}/${maxLife}`} detail="20 + Nível + Vigor × 4" icon={<Heart />} />
        <StatCard tone="sanity" label="Sanidade" value={`${sheet.resources.sanity}/${maxSanity}`} detail={sanityState} icon={<Brain />} />
        <StatCard tone="posture" label="Postura" value={`${sheet.resources.posture}/${maxPosture}`} detail="Vida Máxima × 2" icon={<Shield />} />
        <StatCard tone={pdBalance < 0 ? "danger" : "pd"} label="Saldo PD" value={pdBalance} detail={`${gainedPD} obtidos · ${spentPD} gastos`} icon={<CircleDot />} />
        <StatCard tone={attributeSpent > attributeBudget ? "danger" : "points"} label="Atributos" value={`${attributeSpent}/${attributeBudget}`} detail={`Limite individual ${attributeCap}`} icon={<Gauge />} />
      </section>

      {warnings.length > 0 && (
        <details className="validation-banner">
          <summary><AlertTriangle /> {warnings.length} pendência{warnings.length === 1 ? "" : "s"} na ficha <ChevronDown /></summary>
          <ul>{warnings.map((warning, index) => <li key={`${warning}-${index}`}>{warning}</li>)}</ul>
        </details>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="workspace-tabs">
        <TabsList variant="line" className="workspace-nav">
          {tabItems.map(([value, index, label, Icon]) => <TabsTrigger key={value} value={value} className="nav-tab"><span>{index}</span><Icon />{label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="identidade" className="workspace-panel">
          <SectionHeading eyebrow="01 / REGISTRO" title="Identidade e motivo" description="A ficha mede capacidade; estas respostas explicam por que ela importa." />
          <div className="two-column identity-layout">
            <section className="panel">
              <div className="panel-label">DADOS CIVIS</div>
              <div className="form-grid">
                <Field label="Nome" value={sheet.identity.name} onChange={(value) => updateIdentity("name", value)} />
                <Field label="Jogador" value={sheet.identity.player} onChange={(value) => updateIdentity("player", value)} />
                <Field label="Pronomes" value={sheet.identity.pronouns} onChange={(value) => updateIdentity("pronouns", value)} />
                <Field label="Idade aproximada" value={sheet.identity.age} onChange={(value) => updateIdentity("age", value)} />
                <label className="field"><span>Origem</span><Choice label="Origem" value={sheet.identity.origin} options={ORIGINS} onChange={(value) => updateIdentity("origin", value)} /></label>
                <label className="field"><span>Antecedente</span><Choice label="Antecedente" value={sheet.identity.background} options={BACKGROUNDS} onChange={(value) => updateIdentity("background", value)} /></label>
                <label className="field full"><span>Ofício</span><Choice label="Ofício" value={sheet.identity.office} options={OFFICES} onChange={(value) => updateIdentity("office", value)} className="w-full" /></label>
                <TextAreaField className="full" label="Aparência, hábitos e maneira de falar" value={sheet.identity.appearance} onChange={(value) => updateIdentity("appearance", value)} rows={4} />
              </div>
            </section>
            <section className="panel narrative-panel">
              <div className="panel-label">NÚCLEO DRAMÁTICO</div>
              <TextAreaField label="Conceito" value={sheet.identity.concept} onChange={(value) => updateIdentity("concept", value)} placeholder="[Nome] é [passado ou papel] que deseja [...], mas [...]." />
              <TextAreaField label="Desejo" value={sheet.identity.desire} onChange={(value) => updateIdentity("desire", value)} placeholder="O que justifica aceitar trabalhos perigosos?" />
              <TextAreaField label="Trauma / o que teme perder" value={sheet.identity.trauma} onChange={(value) => updateIdentity("trauma", value)} />
              <TextAreaField label="Contradição e limite imperdoável" value={sheet.identity.contradiction} onChange={(value) => updateIdentity("contradiction", value)} />
              <div className="form-grid"><TextAreaField label="Duas Âncoras" value={sheet.identity.anchors} onChange={(value) => updateIdentity("anchors", value)} /><TextAreaField label="Laços e razão para ficar" value={sheet.identity.bonds} onChange={(value) => updateIdentity("bonds", value)} /></div>
            </section>
          </div>
          <section className="panel resource-panel">
            <div className="panel-label">RECURSOS ATUAIS</div>
            <div className="resource-grid">
              {[{ key: "life", label: "Vida", max: maxLife, tone: "red" }, { key: "sanity", label: "Sanidade", max: maxSanity, tone: "white" }, { key: "posture", label: "Postura", max: maxPosture, tone: "gold" }].map((resource) => <div className="resource-row" key={resource.key}><div><strong>{resource.label}</strong><small>{sheet.resources[resource.key as "life"]} / {resource.max}</small></div><Progress value={clamp((sheet.resources[resource.key as "life"] / resource.max) * 100, 0, 100)} className={resource.tone} /><NumberBox label={resource.label} value={sheet.resources[resource.key as "life"]} max={resource.max} onChange={(value) => updateResource(resource.key as "life", value)} /></div>)}
              <div className="resource-row compact"><div><strong>Momentum</strong><small>-45 a 45</small></div><NumberBox label="Momentum" value={sheet.resources.momentum} min={-45} max={45} onChange={(value) => updateResource("momentum", value)} /></div>
              <div className="resource-row compact"><div><strong>Dissonância</strong><small>0 a 6</small></div><NumberBox label="Dissonância" value={sheet.resources.dissonance} min={0} max={6} onChange={(value) => updateResource("dissonance", value)} /></div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="atributos" className="workspace-panel">
          <SectionHeading eyebrow="02 / CAPACIDADE" title="Dezesseis Atributos" description="Cada ponto concede 1d8; resultados 5+ geram Acerto em testes de Atributo." />
          <div className="attribute-summary"><span>PONTOS DISTRIBUÍDOS</span><strong className={attributeSpent > attributeBudget ? "bad" : ""}>{attributeSpent} / {attributeBudget}</strong><Progress value={clamp((attributeSpent / Math.max(1, attributeBudget)) * 100, 0, 100)} /></div>
          <div className="attribute-groups">
            {ATTRIBUTE_GROUPS.map((group) => <section className={`attribute-group ${group.tone}`} key={group.name}><header><span>{group.name}</span><small>{group.attributes.reduce((sum, attr) => sum + sheet.attributes[attr], 0)} pontos</small></header><div>{group.attributes.map((attribute) => {
              const locked = attribute === "Shin e Mang" && !sheet.progression.shinAwakened;
              return <article className={`attribute-card ${locked ? "locked" : ""}`} key={attribute}><div className="attribute-name"><strong>{attribute}</strong><p>{ATTRIBUTE_HELP[attribute]}</p></div><div className="attribute-control"><Button variant="ghost" size="icon-sm" disabled={locked || sheet.attributes[attribute] <= 0} onClick={() => setAttribute(attribute, sheet.attributes[attribute] - 1)}><Minus /></Button><input aria-label={attribute} type="number" min="0" max="20" value={sheet.attributes[attribute]} onChange={(event) => setAttribute(attribute, Number(event.target.value))} disabled={locked} /><Button variant="ghost" size="icon-sm" disabled={locked || sheet.attributes[attribute] >= attributeCap || attributeSpent >= attributeBudget} onClick={() => setAttribute(attribute, sheet.attributes[attribute] + 1)}><Plus /></Button></div><Button className="roll-attribute" variant="outline" size="sm" disabled={locked || sheet.attributes[attribute] <= 0} onClick={() => rollAttribute(attribute)}><Dices /> {sheet.attributes[attribute]}d8</Button>{locked && <span className="lock-note">BLOQUEADO</span>}</article>;
            })}</div></section>)}
          </div>
          {attributeRoll && <section className="roll-console"><div><span>TESTE // {attributeRoll.name.toUpperCase()}</span><strong>{attributeRoll.hits} ACERTO{attributeRoll.hits === 1 ? "" : "S"}</strong></div><div className="dice-line">{attributeRoll.dice.map((die, index) => <i key={index} className={die >= 5 ? "hit" : ""}>{die}</i>)}</div></section>}
        </TabsContent>

        <TabsContent value="talentos" className="workspace-panel">
          <SectionHeading eyebrow="03 / ESPECIALIZAÇÃO" title="Catálogo de 1.280 Talentos" description="Escolha uma das quatro opções de cada nível alcançado; escolhas extras exigem Treinamento." />
          <section className="catalog-toolbar panel">
            <label className="field"><span>Atributo</span><Choice label="Atributo dos talentos" value={talentAttribute} options={[...ATTRIBUTES]} onChange={(value) => setTalentAttribute(value as AttributeName)} /></label>
            <label className="field"><span>Nível</span><Choice label="Nível dos talentos" value={talentLevel} options={["Liberados", "Todos", ...Array.from({ length: 20 }, (_, index) => String(index + 1))]} onChange={setTalentLevel} /></label>
            <label className="field search-field"><span>Busca</span><div><Search /><input value={talentSearch} onChange={(event) => setTalentSearch(event.target.value)} placeholder="Nome ou efeito…" /></div></label>
            <div className="catalog-count"><span>SELECIONADOS</span><strong>{sheet.selectedTalents.length}</strong><small>{talentTrainingCost} Marca(s) em escolhas extras</small></div>
          </section>
          <div className="talent-grid">
            {filteredTalents.map((talent) => {
              const selected = sheet.selectedTalents.includes(talent.id);
              const locked = talent.level > sheet.attributes[talentAttribute];
              return <article key={talent.id} className={`talent-card ${selected ? "selected" : ""} ${locked ? "locked" : ""}`}><div className="talent-level"><span>NÍVEL</span><strong>{String(talent.level).padStart(2, "0")}</strong><small>{talent.grade}</small></div><div className="talent-body"><h3>{talent.name}</h3><p>{talent.effect}</p></div><Button variant={selected ? "default" : "outline"} size="sm" disabled={locked && !selected} onClick={() => toggleTalent(talent.id)}>{selected ? <><Check /> Escolhido</> : locked ? "Bloqueado" : <><Plus /> Escolher</>}</Button></article>;
            })}
            {filteredTalents.length === 0 && <div className="empty-state"><BookOpen /><strong>Nenhum talento neste filtro</strong><p>Aumente o Atributo ou altere a busca.</p></div>}
          </div>
        </TabsContent>

        <TabsContent value="perks" className="workspace-panel">
          <SectionHeading eyebrow="04 / TRAÇOS" title="Vantagens e Desvantagens" description="Desvantagens concedem PD; Vantagens consomem PD. Opções exclusivas validam o Ofício atual." />
          <section className="pd-ledger">
            <div><span>PD BRUTO</span><strong>{rawDisadvantagePD}</strong><small>{sheet.identity.background === "Antigo Fixer" ? "+20% por Antigo Fixer" : "das Desvantagens"}</small></div>
            <div><span>PD DISPONÍVEL</span><strong>{gainedPD}</strong><small>após modificadores</small></div>
            <div><span>PD GASTO</span><strong>{spentPD}</strong><small>em Vantagens</small></div>
            <div className={pdBalance < 0 ? "negative" : "positive"}><span>SALDO</span><strong>{pdBalance}</strong><small>{pdBalance < 0 ? "compra inválida" : "compra válida"}</small></div>
          </section>
          <section className="catalog-toolbar panel perk-toolbar">
            <div className="segmented"><Button variant={perkKind === "vantagem" ? "default" : "ghost"} onClick={() => setPerkKind("vantagem")}>Vantagens</Button><Button variant={perkKind === "desvantagem" ? "default" : "ghost"} onClick={() => setPerkKind("desvantagem")}>Desvantagens</Button></div>
            <label className="field search-field"><span>Buscar no catálogo</span><div><Search /><input value={perkSearch} onChange={(event) => setPerkSearch(event.target.value)} placeholder="Nome, Ofício ou regra…" /></div></label>
            <div className="office-chip"><BriefcaseBusiness /><span>Ofício atual</span><strong>{sheet.identity.office}</strong></div>
          </section>
          <div className="perk-grid">
            {filteredPerks.map((perk) => {
              const selected = sheet.selectedPerks.includes(perk.id);
              const wrongOffice = perk.office !== "Geral" && perk.office !== sheet.identity.office;
              return <article className={`perk-card ${selected ? "selected" : ""} ${wrongOffice ? "restricted" : ""}`} key={perk.id}><header><Badge variant="outline">#{String(perk.number).padStart(3, "0")}</Badge><Badge className="office-badge">{perk.office}</Badge><strong>{perk.pd} PD</strong></header><h3>{perk.name}</h3><p>{perk.rule}</p><Button variant={selected ? "default" : "outline"} size="sm" disabled={wrongOffice && !selected} onClick={() => togglePerk(perk.id)}>{selected ? <><X /> Remover</> : wrongOffice ? `Exige ${perk.office}` : <><Plus /> Adicionar</>}</Button></article>;
            })}
          </div>
          <section className="panel custom-perk-panel">
            <div className="panel-label">PERK CUSTOMIZADO</div>
            <div className="custom-perk-form"><Field label="Nome" value={customPerkDraft.name} onChange={(name) => setCustomPerkDraft((draft) => ({ ...draft, name }))} /><label className="field"><span>Tipo</span><Choice label="Tipo do perk" value={customPerkDraft.kind} options={["vantagem", "desvantagem"]} onChange={(kind) => setCustomPerkDraft((draft) => ({ ...draft, kind: kind as "vantagem" | "desvantagem" }))} /></label><Field label="PD" type="number" min={0} max={99} value={customPerkDraft.pd} onChange={(pd) => setCustomPerkDraft((draft) => ({ ...draft, pd: Number(pd) }))} /><TextAreaField label="Regra" value={customPerkDraft.rule} onChange={(rule) => setCustomPerkDraft((draft) => ({ ...draft, rule }))} rows={2} /><Button onClick={addCustomPerk}><Plus /> Incluir</Button></div>
            {sheet.customPerks.length > 0 && <div className="custom-perk-list">{sheet.customPerks.map((perk) => <div key={perk.id}><Badge>{perk.kind}</Badge><strong>{perk.name}</strong><span>{perk.pd} PD</span><p>{perk.rule}</p><Button variant="ghost" size="icon-sm" onClick={() => setSheet((current) => ({ ...current, customPerks: current.customPerks.filter((entry) => entry.id !== perk.id) }))}><Trash2 /></Button></div>)}</div>}
          </section>
        </TabsContent>

        <TabsContent value="habilidades" className="workspace-panel">
          <SectionHeading eyebrow="05 / TÉCNICAS" title="Construtor de Habilidades" description="Cada Moeda tem sua própria rolagem de ataque, Peso, dano, tipo e efeito — sem impor um padrão único à habilidade." />
          <div className="skill-workbench">
            <aside className="skill-list panel"><div className="panel-label">HABILIDADES // {sheet.skills.length}</div>{sheet.skills.map((skill) => <button key={skill.id} className={selectedSkillId === skill.id ? "active" : ""} onClick={() => setSelectedSkillId(skill.id)}><span>{skill.type}</span><strong>{skill.name}</strong><small>{skill.coins.length} Moeda{skill.coins.length === 1 ? "" : "s"}</small></button>)}<Button onClick={addSkill}><Plus /> Nova habilidade</Button></aside>
            {selectedSkill ? <section className="skill-editor panel">
              <div className="skill-editor-header"><div><span>PERFIL ATIVO</span><input value={selectedSkill.name} onChange={(event) => updateSkill(selectedSkill.id, { name: event.target.value })} /></div><div><Button variant="outline" size="sm" onClick={() => duplicateSkill(selectedSkill)}>Duplicar</Button><Button variant="ghost" size="icon-sm" onClick={() => deleteSkill(selectedSkill.id)}><Trash2 /></Button></div></div>
              <div className="form-grid skill-meta"><label className="field"><span>Tipo</span><Choice label="Tipo de habilidade" value={selectedSkill.type} options={SKILL_TYPES} onChange={(type) => updateSkill(selectedSkill.id, { type })} /></label><Field label="Custo" value={selectedSkill.cost} onChange={(cost) => updateSkill(selectedSkill.id, { cost })} /><Field label="Alcance" value={selectedSkill.range} onChange={(range) => updateSkill(selectedSkill.id, { range })} /><Field label="Alvos / área" value={selectedSkill.targets} onChange={(targets) => updateSkill(selectedSkill.id, { targets })} /><Field label="Dano base comum" type="number" value={selectedSkill.commonDamage} onChange={(commonDamage) => updateSkill(selectedSkill.id, { commonDamage: Number(commonDamage) })} /><TextAreaField className="full" label="Descrição e aprimoramento" value={selectedSkill.description} onChange={(description) => updateSkill(selectedSkill.id, { description })} rows={2} /></div>
              <div className="coin-header"><div><span>SEQUÊNCIA DE MOEDAS</span><strong>{selectedSkill.coins.length}d8 de ataque</strong></div><div><Button variant="outline" onClick={() => addCoin(selectedSkill.id)}><Plus /> Adicionar Moeda</Button><Button onClick={() => rollSkill(selectedSkill)} disabled={selectedSkill.coins.length === 0}><Dices /> Rolar sequência</Button></div></div>
              <div className="coin-stack">{selectedSkill.coins.map((coin, index) => <article className="coin-card" key={coin.id}><div className="coin-order"><span>MOEDA</span><strong>{String(index + 1).padStart(2, "0")}</strong><div><Button variant="ghost" size="icon-xs" disabled={index === 0} onClick={() => moveCoin(selectedSkill, coin.id, -1)}>↑</Button><Button variant="ghost" size="icon-xs" disabled={index === selectedSkill.coins.length - 1} onClick={() => moveCoin(selectedSkill, coin.id, 1)}>↓</Button></div></div><div className="coin-fields"><Field label="Nome" value={coin.name} onChange={(name) => updateCoin(selectedSkill.id, coin.id, { name })} /><Field label="Peso" type="number" min={0} value={coin.weight} onChange={(weight) => updateCoin(selectedSkill.id, coin.id, { weight: Number(weight) })} /><Field label="Mod. do d8" type="number" min={-3} max={3} value={coin.modifier} onChange={(modifier) => updateCoin(selectedSkill.id, coin.id, { modifier: Number(modifier) })} /><Field label="Sucesso em" type="number" min={2} max={8} value={coin.successOn} onChange={(successOn) => updateCoin(selectedSkill.id, coin.id, { successOn: Number(successOn) })} /><Field label="Dano desta Moeda" value={coin.damage} onChange={(damage) => updateCoin(selectedSkill.id, coin.id, { damage })} placeholder="Ex.: 2d4+3" /><label className="field"><span>Tipo de dano</span><Choice label={`Tipo de dano da Moeda ${index + 1}`} value={coin.damageType} options={DAMAGE_TYPES} onChange={(damageType) => updateCoin(selectedSkill.id, coin.id, { damageType })} /></label><Field className="coin-effect" label="Efeito / condição" value={coin.effect} onChange={(effect) => updateCoin(selectedSkill.id, coin.id, { effect })} /></div><Button variant="ghost" size="icon-sm" aria-label={`Remover Moeda ${index + 1}`} onClick={() => updateSkill(selectedSkill.id, { coins: selectedSkill.coins.filter((entry) => entry.id !== coin.id) })}><Trash2 /></Button></article>)}</div>
              {skillRoll?.skillId === selectedSkill.id && <section className="skill-roll-result"><header><span>RESULTADO DA SEQUÊNCIA</span><div><strong>{skillRoll.totalWeight}</strong> Peso total <i /><strong>{skillRoll.totalDamage}</strong> dano rolado</div></header><div>{skillRoll.results.map((result, index) => <article className={result.success ? "success" : "fail"} key={result.coin.id}><div><span>#{index + 1}</span><strong>{result.coin.name}</strong></div><p>d8: <b>{result.raw}</b>{result.coin.modifier !== 0 && <> → {result.final}</>} · {result.success ? "SUCESSO" : "FALHA"}</p><p>Peso {result.weight} · {result.coin.damageType} {result.damage} <small>{result.detail}</small></p>{result.coin.effect && <em>{result.coin.effect}</em>}</article>)}</div></section>}
            </section> : <div className="empty-state panel"><Sword /><strong>Nenhuma habilidade</strong><Button onClick={addSkill}>Criar a primeira</Button></div>}
          </div>
        </TabsContent>

        <TabsContent value="equipamento" className="workspace-panel">
          <SectionHeading eyebrow="06 / CARGA" title="Armadura e Inventário" description="Carga Máxima = 5 + Força. Durabilidade chega a 0 quando o item fica Inutilizado." />
          <div className="two-column equipment-layout">
            <section className="panel armor-panel"><div className="panel-label">ARMADURA ATIVA</div><div className="form-grid"><Field label="Nome" value={sheet.armor.name} onChange={(name) => setSheet((current) => ({ ...current, armor: { ...current.armor, name } }))} /><Field label="Classe / perfil" value={sheet.armor.armorClass} onChange={(armorClass) => setSheet((current) => ({ ...current, armor: { ...current.armor, armorClass } }))} /><Field label="Bloqueio fixo" type="number" value={sheet.armor.block} onChange={(block) => setSheet((current) => ({ ...current, armor: { ...current.armor, block: Number(block) } }))} /><Field label="Durabilidade" type="number" value={sheet.armor.durability} onChange={(durability) => setSheet((current) => ({ ...current, armor: { ...current.armor, durability: Number(durability) } }))} /><Field label="Durabilidade máxima" type="number" value={sheet.armor.durabilityMax} onChange={(durabilityMax) => setSheet((current) => ({ ...current, armor: { ...current.armor, durabilityMax: Number(durabilityMax) } }))} /></div><div className="resistance-grid"><label className="red"><span>VERMELHO</span><input type="number" step="0.1" value={sheet.armor.red} onChange={(event) => setSheet((current) => ({ ...current, armor: { ...current.armor, red: Number(event.target.value) } }))} /><small>× dano físico</small></label><label className="white"><span>BRANCO</span><input type="number" step="0.1" value={sheet.armor.white} onChange={(event) => setSheet((current) => ({ ...current, armor: { ...current.armor, white: Number(event.target.value) } }))} /><small>× dano mental</small></label><label className="black"><span>PRETO</span><input type="number" step="0.1" value={sheet.armor.black} onChange={(event) => setSheet((current) => ({ ...current, armor: { ...current.armor, black: Number(event.target.value) } }))} /><small>× Vida/Sanidade</small></label><label className="pale"><span>PÁLIDO</span><input type="number" step="0.1" value={sheet.armor.pale} onChange={(event) => setSheet((current) => ({ ...current, armor: { ...current.armor, pale: Number(event.target.value) } }))} /><small>× dano existencial</small></label></div><TextAreaField label="Módulos, restrições e notas" value={sheet.armor.notes} onChange={(notes) => setSheet((current) => ({ ...current, armor: { ...current.armor, notes } }))} /></section>
            <section className="panel load-panel"><div className="panel-label">CARGA E RECURSOS</div><div className="load-gauge"><div><span>CARGA ATUAL</span><strong className={currentLoad > maxLoad ? "bad" : ""}>{currentLoad.toFixed(1)} / {maxLoad}</strong></div><Progress value={clamp((currentLoad / Math.max(1, maxLoad)) * 100, 0, 100)} /></div><Field label="Dinheiro" type="number" value={sheet.resources.money} onChange={(value) => updateResource("money", Number(value))} /><div className="formula-note"><strong>Fórmula de dano final</strong><code>piso((arma + dados + bônus) × Mang × resistência) − Bloqueio</code></div></section>
          </div>
          <section className="panel inventory-panel"><div className="inventory-header"><div><span>INVENTÁRIO</span><strong>{sheet.items.length} registro(s)</strong></div><Button onClick={addItem}><Plus /> Novo item</Button></div>{sheet.items.length === 0 ? <div className="empty-state"><BriefcaseBusiness /><strong>Inventário vazio</strong><p>Adicione armas, consumíveis, implantes e objetos pessoais.</p></div> : <div className="item-list">{sheet.items.map((item) => <article key={item.id}><div className="item-main"><input value={item.name} onChange={(event) => updateItem(item.id, { name: event.target.value })} /><Choice label={`Categoria de ${item.name}`} value={item.category} options={["Arma", "Equipamento", "Consumível", "Implante", "Ferramenta", "Objeto pessoal", "Outro"]} onChange={(category) => updateItem(item.id, { category })} /></div><div className="item-numbers"><Field label="Qtd." type="number" min={1} value={item.quantity} onChange={(quantity) => updateItem(item.id, { quantity: Number(quantity) })} /><Field label="Carga/un." type="number" min={0} step={0.1} value={item.load} onChange={(load) => updateItem(item.id, { load: Number(load) })} /><Field label="Durab." type="number" min={0} value={item.durability} onChange={(durability) => updateItem(item.id, { durability: Number(durability) })} /><Field label="Máx." type="number" min={0} value={item.durabilityMax} onChange={(durabilityMax) => updateItem(item.id, { durabilityMax: Number(durabilityMax) })} /></div><TextAreaField label="Efeito, módulos, preço ou complicação" value={item.details} onChange={(details) => updateItem(item.id, { details })} rows={2} /><Button variant="ghost" size="icon-sm" onClick={() => setSheet((current) => ({ ...current, items: current.items.filter((entry) => entry.id !== item.id) }))}><Trash2 /></Button></article>)}</div>}</section>
        </TabsContent>

        <TabsContent value="progressao" className="workspace-panel">
          <SectionHeading eyebrow="07 / CARREIRA" title="Experiência, Treino e Luz" description="Nível mede crescimento pessoal; Grau mede reputação profissional e licença." />
          <div className="progression-grid">
            <section className="panel xp-panel"><div className="panel-label">EXPERIÊNCIA</div><div className="level-display"><span>NÍVEL</span><strong>{String(sheet.level).padStart(2, "0")}</strong><small>limite de Atributo {attributeCap}</small></div><div className="xp-track"><div><span>{sheet.xp} XP</span><strong>{sheet.level >= 20 ? "NÍVEL MÁXIMO" : `${nextXP} para subir`}</strong></div><Progress value={sheet.level >= 20 ? 100 : clamp((sheet.xp / nextXP) * 100, 0, 100)} /></div><div className="xp-actions"><NumberBox label="XP ganho" value={xpGain} min={0} max={99} onChange={setXpGain} /><Button variant="outline" onClick={addXP}><Plus /> Adicionar XP</Button><Button onClick={levelUp} disabled={sheet.level >= 20 || sheet.xp < nextXP}>Subir de nível</Button></div><p className="rule-note">Ao subir: +2 Pontos de Atributo e +1 Marca de Treino. Habilidoso concede +1 ponto extra, mas reduz o XP recebido em 10%.</p></section>
            <section className="panel training-panel"><div className="panel-label">TREINAMENTO</div><div className="training-stat"><span>Marcas disponíveis</span><NumberBox label="Marcas de Treino" value={sheet.progression.trainingMarks} onChange={(value) => updateProgression("trainingMarks", value)} /></div><div className="training-stat"><span>Custo das escolhas extras</span><strong>{talentTrainingCost}</strong></div><TextAreaField label="Projetos em andamento e Progresso" value={sheet.progression.trainingNotes} onChange={(value) => updateProgression("trainingNotes", value)} rows={7} placeholder="Ex.: Despertar Shin — 7/12 de Progresso…" /></section>
          </div>
          <section className="panel fixer-panel"><div className="fixer-header"><div><span>LICENÇA DE FIXER</span><strong>Grau {sheet.progression.fixerGrade}</strong></div><div><Field label="Reputação" type="number" min={0} value={sheet.progression.reputation} onChange={(value) => updateProgression("reputation", Number(value))} /><Field label="Contratos" type="number" min={0} value={sheet.progression.contracts} onChange={(value) => updateProgression("contracts", Number(value))} /><label className="field"><span>Grau atual</span><Choice label="Grau de Fixer" value={sheet.progression.fixerGrade} options={fixerGrades.map((entry) => entry.grade)} onChange={(value) => updateProgression("fixerGrade", value)} /></label></div></div><div className="grade-track">{fixerGrades.map((entry) => { const eligible = sheet.level >= entry.level && sheet.progression.reputation >= entry.reputation && sheet.progression.contracts >= entry.contracts; const current = sheet.progression.fixerGrade === entry.grade; return <article key={entry.grade} className={`${eligible ? "eligible" : ""} ${current ? "current" : ""}`}><div><span>GRAU</span><strong>{entry.grade}</strong></div><p>Nível {entry.level} · Rep. {entry.reputation} · {entry.contracts} contratos</p><small>{entry.requirement}</small>{eligible ? <Badge><Check /> Elegível</Badge> : <Badge variant="outline">Pendente</Badge>}</article>; })}</div><p className="rule-note">Cumprir os números dá direito à avaliação; a promoção ainda precisa acontecer em cena.</p></section>
          <section className="panel shin-panel"><div className="shin-header"><div><Zap /><span>SHIN E MANG</span><strong>{sheet.progression.shinAwakened ? "DESPERTO" : "BLOQUEADO"}</strong></div><Button variant={sheet.progression.shinAwakened ? "default" : "outline"} onClick={() => updateProgression("shinAwakened", !sheet.progression.shinAwakened)}>{sheet.progression.shinAwakened ? "Shin desperto" : "Marcar despertar"}</Button></div><div className="shin-grid"><div><span>Mang ativo</span><NumberBox label="Mang ativo" value={sheet.resources.activeMang} min={0} max={Math.max(0, sheet.attributes["Shin e Mang"])} onChange={(value) => updateResource("activeMang", value)} /><small>Limite: {sheet.attributes["Shin e Mang"]}</small></div><div><span>Multiplicador ao gastar tudo</span><strong>×{mangMultiplier(sheet.resources.activeMang).toFixed(1)}</strong><small>piso em décimos de 1,1ⁿ; 7 fecha em 2,0×</small></div><div><span>Requisitos de despertar</span><p>Vontade 6, Ego 4, evento de Luz e 12 de Progresso em treino Dif. 4.</p></div></div></section>
        </TabsContent>

        <TabsContent value="resumo" className="workspace-panel print-sheet">
          <SectionHeading eyebrow="08 / ARQUIVO FINAL" title={sheet.identity.name || "Personagem sem nome"} description={`${sheet.identity.office} · ${sheet.identity.origin} · Nível ${sheet.level}`} />
          <div className="summary-actions"><Button onClick={() => window.print()}><Printer /> Imprimir / salvar PDF</Button><Button variant="outline" onClick={exportSheet}><Download /> Exportar JSON</Button></div>
          <section className="summary-hero"><div><span>CONCEITO</span><p>{sheet.identity.concept || "Não registrado."}</p></div><div className="summary-vitals"><StatCard label="Vida" value={`${sheet.resources.life}/${maxLife}`} /><StatCard label="Sanidade" value={`${sheet.resources.sanity}/${maxSanity}`} detail={sanityState} /><StatCard label="Postura" value={`${sheet.resources.posture}/${maxPosture}`} /><StatCard label="Grau" value={sheet.progression.fixerGrade} detail={`${sheet.progression.reputation} reputação`} /></div></section>
          <section className="summary-section"><h3>ATRIBUTOS</h3><div className="summary-attributes">{ATTRIBUTES.map((attribute) => <div key={attribute}><span>{attribute}</span><strong>{sheet.attributes[attribute]}</strong><small>{sheet.attributes[attribute]}d8</small></div>)}</div></section>
          <div className="summary-columns"><section className="summary-section"><h3>VANTAGENS</h3>{selectedOfficialPerks.filter((perk) => perk.kind === "vantagem").map((perk) => <div className="summary-entry" key={perk.id}><strong>{perk.name}</strong><p>{perk.rule}</p></div>)}{sheet.customPerks.filter((perk) => perk.kind === "vantagem").map((perk) => <div className="summary-entry" key={perk.id}><strong>{perk.name} <small>custom</small></strong><p>{perk.rule}</p></div>)}</section><section className="summary-section"><h3>DESVANTAGENS</h3>{selectedOfficialPerks.filter((perk) => perk.kind === "desvantagem").map((perk) => <div className="summary-entry" key={perk.id}><strong>{perk.name}</strong><p>{perk.rule}</p></div>)}{sheet.customPerks.filter((perk) => perk.kind === "desvantagem").map((perk) => <div className="summary-entry" key={perk.id}><strong>{perk.name} <small>custom</small></strong><p>{perk.rule}</p></div>)}</section></div>
          <section className="summary-section"><h3>TALENTOS</h3><div className="summary-talents">{sheet.selectedTalents.map((id) => ATTRIBUTE_TALENTS.find((talent) => talent.id === id)).filter(Boolean).map((talent) => talent && <div key={talent.id}><span>{talent.attribute} · Nível {talent.level}</span><strong>{talent.name}</strong><p>{talent.effect}</p></div>)}</div></section>
          <section className="summary-section"><h3>HABILIDADES</h3>{sheet.skills.map((skill) => <article className="summary-skill" key={skill.id}><header><div><span>{skill.type}</span><strong>{skill.name}</strong></div><small>{skill.cost} · {skill.range} · {skill.targets}</small></header><p>{skill.description}</p><div>{skill.coins.map((coin, index) => <span key={coin.id}>#{index + 1} {coin.name}: Peso {coin.weight}, {coin.damage} {coin.damageType}{coin.effect ? `, ${coin.effect}` : ""}</span>)}</div></article>)}</section>
          <div className="summary-columns"><section className="summary-section"><h3>ARMADURA</h3><div className="summary-entry"><strong>{sheet.armor.name}</strong><p>V {sheet.armor.red}× · B {sheet.armor.white}× · P {sheet.armor.black}× · Pá {sheet.armor.pale}× · Bloqueio {sheet.armor.block}</p><p>{sheet.armor.notes}</p></div></section><section className="summary-section"><h3>INVENTÁRIO</h3>{sheet.items.map((item) => <div className="summary-entry" key={item.id}><strong>{item.quantity}× {item.name}</strong><p>{item.category} · Carga {(item.load * item.quantity).toFixed(1)} · Dur. {item.durability}/{item.durabilityMax}</p><p>{item.details}</p></div>)}</section></div>
          <section className="summary-section"><h3>NOTAS DA CAMPANHA</h3><textarea value={sheet.notes} onChange={(event) => setSheet((current) => ({ ...current, notes: event.target.value }))} rows={8} placeholder="Contratos, contatos, Feridas, Âncoras quebradas, promessas…" /></section>
          {warnings.length > 0 && <section className="summary-section summary-warnings"><h3>PENDÊNCIAS</h3>{warnings.map((warning, index) => <p key={index}>• {warning}</p>)}</section>}
        </TabsContent>
      </Tabs>
      <footer className="app-footer"><span>DOCUMENTO DE USO INTERNO</span><i>TABLETOP CORP. // ARQUIVO LOCAL</i><span>V.01</span></footer>
    </main>
  );
}
