"use client";

import { useState } from "react";
import { Activity, Brain, Check, Clock3, Dices, FlaskConical, Plus, ShieldAlert, Sparkles, Swords, Trash2, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ANOMALY_PURCHASES,
  ANOMALY_RISKS,
  BACKGROUND_RULES,
  DEFENSIVE_MODULES,
  DISTORTION_STAGES,
  EFFECT_RULES,
  ENCOUNTER_COSTS,
  MANG_MULTIPLIERS,
  ORIGIN_RULES,
  QUALITY_RULES,
  SANITY_STATES,
  TRAINING_PROJECTS,
  WEAPON_MODULES,
  WEAPON_PROFILES,
} from "./v2-data";

export type OriginRecord = { home: string; routine: string; link: string; taboo: string; absence: string; debt: string };
export type ActiveEffect = { id: string; name: string; power: number; count: number; source: string; notes: string };
export type TrainingProject = { id: string; type: string; difficulty: number; target: number; progress: number; result: string; notes: string; complete: boolean };
export type ShinTrial = { id: string; ring: number; call: string; contradiction: string; choice: string; price: string; principle: string; mark: string; complete: boolean };
export type MindEntry = { id: string; name: string; notes: string; active: boolean };
export type AnomalyPurchase = { id: string; name: string; cost: number };
export type WorkProfile = { name: string; affinity: number; difficulty: number; success: string; failure: string };
export type Anomaly = {
  id: string; name: string; code: string; risk: keyof typeof ANOMALY_RISKS; archetype: string; concept: string; appearance: string;
  qliphoth: number; qliphothMax: number; qliphothDrop: string; qliphothRise: string; zeroEvent: string;
  life: number; posture: number; moves: number; weight: number; damage: string; enkephalin: number;
  red: number; white: number; black: number; pale: number; effectResistance: string;
  works: WorkProfile[]; skills: string; reaction: string; phases: string; parts: string; egoRewards: string;
  purchases: AnomalyPurchase[];
};
export type EncounterEnemy = { id: string; name: string; kind: string; quantity: number; cost: number };

export type V2Data = {
  origin: OriginRecord;
  combat: { round: number; actionSpent: boolean; movementSpent: boolean; reactionSpent: boolean; freeNote: string; enemyWeight: number; targetResistance: number; targetBlock: number; effects: ActiveEffect[] };
  trainingProjects: TrainingProject[];
  shin: { mangLimit: number; lightOverload: number; trials: ShinTrial[] };
  mind: {
    anchors: MindEntry[]; wounds: MindEntry[];
    egoName: string; egoForm: string; egoPrinciple: string; egoCost: string; egoBasic: string; egoIdentity: string; egoFinal: string; corrosionBehavior: string;
    corrosion: number; distortionStage: number; ruptureResult: string;
  };
  anomalies: Anomaly[];
  encounter: { characters: number; threatPerCharacter: number; clockSize: number; clockFilled: number; victory: string; notes: string; enemies: EncounterEnemy[] };
};

const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

const defaultWorks = (): WorkProfile[] => ["Instinto", "Entendimento", "Apego", "Repressão"].map((name) => ({ name, affinity: 0, difficulty: 3, success: "", failure: "" }));

export function createAnomaly(): Anomaly {
  return {
    id: uid("anomaly"), name: "Nova Anormalidade", code: "O-00-00", risk: "ZAYIN", archetype: "", concept: "", appearance: "",
    qliphoth: 3, qliphothMax: 3, qliphothDrop: "", qliphothRise: "", zeroEvent: "",
    life: 30, posture: 30, moves: 2, weight: 3, damage: "1d8+4", enkephalin: 0,
    red: 1, white: 1, black: 1, pale: 1, effectResistance: "",
    works: defaultWorks(), skills: "", reaction: "", phases: "", parts: "", egoRewards: "", purchases: [],
  };
}

export const DEFAULT_V2_DATA: V2Data = {
  origin: { home: "", routine: "", link: "", taboo: "", absence: "", debt: "" },
  combat: { round: 1, actionSpent: false, movementSpent: false, reactionSpent: false, freeNote: "", enemyWeight: 0, targetResistance: 1, targetBlock: 0, effects: [] },
  trainingProjects: [],
  shin: { mangLimit: 0, lightOverload: 0, trials: [] },
  mind: {
    anchors: [], wounds: [], egoName: "", egoForm: "", egoPrinciple: "", egoCost: "", egoBasic: "", egoIdentity: "", egoFinal: "", corrosionBehavior: "",
    corrosion: 0, distortionStage: 0, ruptureResult: "",
  },
  anomalies: [],
  encounter: { characters: 4, threatPerCharacter: 2, clockSize: 6, clockFilled: 0, victory: "", notes: "", enemies: [] },
};

export function mergeV2Data(candidate?: Partial<V2Data>): V2Data {
  const base = structuredClone(DEFAULT_V2_DATA);
  return {
    ...base,
    ...(candidate ?? {}),
    origin: { ...base.origin, ...(candidate?.origin ?? {}) },
    combat: { ...base.combat, ...(candidate?.combat ?? {}), effects: Array.isArray(candidate?.combat?.effects) ? candidate.combat.effects : [] },
    shin: { ...base.shin, ...(candidate?.shin ?? {}), trials: Array.isArray(candidate?.shin?.trials) ? candidate.shin.trials : [] },
    mind: {
      ...base.mind,
      ...(candidate?.mind ?? {}),
      anchors: Array.isArray(candidate?.mind?.anchors) ? candidate.mind.anchors : [],
      wounds: Array.isArray(candidate?.mind?.wounds) ? candidate.mind.wounds : [],
    },
    trainingProjects: Array.isArray(candidate?.trainingProjects) ? candidate.trainingProjects : [],
    anomalies: Array.isArray(candidate?.anomalies) ? candidate.anomalies.map((anomaly) => ({ ...createAnomaly(), ...anomaly, works: Array.isArray(anomaly.works) ? anomaly.works : defaultWorks(), purchases: Array.isArray(anomaly.purchases) ? anomaly.purchases : [] })) : [],
    encounter: { ...base.encounter, ...(candidate?.encounter ?? {}), enemies: Array.isArray(candidate?.encounter?.enemies) ? candidate.encounter.enemies : [] },
  };
}

function SmallField({ label, value, onChange, type = "text", min, max, step }: { label: string; value: string | number; onChange: (value: string) => void; type?: string; min?: number; max?: number; step?: number }) {
  return <label className="field"><span>{label}</span><input type={type} min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function SmallArea({ label, value, onChange, rows = 2, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; rows?: number; placeholder?: string }) {
  return <label className="field"><span>{label}</span><textarea rows={rows} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function NativeChoice({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label className="field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

export function OriginDossier({ origin, background, record, onChange }: { origin: string; background: string; record: OriginRecord; onChange: (record: OriginRecord) => void }) {
  const originRule = ORIGIN_RULES[origin] ?? ORIGIN_RULES.Outra;
  const backgroundRule = BACKGROUND_RULES[background] ?? BACKGROUND_RULES.Outro;
  const set = (key: keyof OriginRecord, value: string) => onChange({ ...record, [key]: value });
  return <section className="panel origin-dossier">
    <div className="compact-section-title"><div><span>ORIGEM</span><strong>Detalhes pessoais</strong></div><details><summary>Ver benefícios e cobranças</summary><div className="origin-rules"><article><span>Familiaridade · {origin}</span><p>{originRule.familiarity}</p></article><article><span>Cobrança</span><p>{originRule.charge}</p></article><article><span>Benefício · {background}</span><p>{backgroundRule.benefit}</p></article><article><span>Custo do antecedente</span><p>{backgroundRule.charge}</p></article></div></details></div>
    <div className="origin-grid">
      <SmallArea label="Casa" value={record.home} onChange={(value) => set("home", value)} placeholder="Onde o personagem chama de lar?" />
      <SmallArea label="Rotina" value={record.routine} onChange={(value) => set("routine", value)} placeholder="Como sobrevivia antes da campanha?" />
      <SmallArea label="Vínculo" value={record.link} onChange={(value) => set("link", value)} placeholder="Pessoa, lugar ou organização importante." />
      <SmallArea label="Tabu" value={record.taboo} onChange={(value) => set("taboo", value)} placeholder="Regra local que nunca deve quebrar." />
      <SmallArea label="Ausência" value={record.absence} onChange={(value) => set("absence", value)} placeholder="O que ficou para trás?" />
      <SmallArea label="Dívida" value={record.debt} onChange={(value) => set("debt", value)} placeholder="Quem ainda pode cobrar?" />
    </div>
  </section>;
}

export function momentumModifier(momentum: number) {
  if (momentum <= -45) return -3;
  if (momentum <= -30) return -2;
  if (momentum <= -15) return -1;
  if (momentum >= 45) return 3;
  if (momentum >= 30) return 2;
  if (momentum >= 15) return 1;
  return 0;
}

export function CombatWorkspace({ data, onChange, momentum, onMomentum, lastWeight, lastDamage, activeMang }: { data: V2Data; onChange: (data: V2Data) => void; momentum: number; onMomentum: (value: number) => void; lastWeight: number; lastDamage: number; activeMang: number }) {
  const combat = data.combat;
  const ownWeight = lastWeight;
  const clash = ownWeight === combat.enemyWeight ? "EMPATE — ambos neutralizam" : ownWeight > combat.enemyWeight ? "VITÓRIA — +10 Momentum" : "DERROTA — −10 Momentum";
  const mangMultiplier = MANG_MULTIPLIERS[clamp(activeMang, 0, 20)];
  const finalDamage = Math.max(0, Math.floor(lastDamage * mangMultiplier * combat.targetResistance) - combat.targetBlock);
  const updateCombat = (patch: Partial<V2Data["combat"]>) => onChange({ ...data, combat: { ...combat, ...patch } });
  const addEffect = () => updateCombat({ effects: [...combat.effects, { id: uid("effect"), name: "Sangramento", power: 1, count: 1, source: "", notes: "" }] });
  const patchEffect = (id: string, patch: Partial<ActiveEffect>) => updateCombat({ effects: combat.effects.map((effect) => effect.id === id ? { ...effect, ...patch } : effect) });
  return <>
    <section className="combat-dashboard">
      <article className="panel turn-panel"><div className="panel-label">ECONOMIA DA RODADA</div><div className="round-line"><span>RODADA</span><strong>{combat.round}</strong><Button variant="outline" size="sm" onClick={() => updateCombat({ round: combat.round + 1, actionSpent: false, movementSpent: false, reactionSpent: false })}>Próxima</Button></div><div className="turn-toggles">{[["actionSpent", "Ação"], ["movementSpent", "Movimento"], ["reactionSpent", "Reação"]] .map(([key, label]) => <button key={key} className={combat[key as "actionSpent"] ? "spent" : ""} onClick={() => updateCombat({ [key]: !combat[key as "actionSpent"] })}><Check />{label}</button>)}</div><SmallField label="Ação livre / lembrete" value={combat.freeNote} onChange={(freeNote) => updateCombat({ freeNote })} /></article>
      <article className="panel momentum-panel"><div className="panel-label">MOMENTUM</div><strong>{momentum > 0 ? "+" : ""}{momentum}</strong><span>MODIFICADOR POR MOEDA: {momentumModifier(momentum) > 0 ? "+" : ""}{momentumModifier(momentum)}</span><Progress value={((momentum + 45) / 90) * 100} /><p>−45/−30/−15 e +15/+30/+45 alteram cada Moeda ofensiva.</p></article>
      <article className="panel clash-panel"><div className="panel-label">CONFRONTO</div><div className="clash-values"><div><span>SEU PESO</span><strong>{ownWeight}</strong><small>última Habilidade rolada</small></div><SmallField label="Peso inimigo" type="number" min={0} value={combat.enemyWeight} onChange={(value) => updateCombat({ enemyWeight: Number(value) })} /></div><p className={ownWeight >= combat.enemyWeight ? "good" : "bad"}>{clash}</p><Button disabled={ownWeight === combat.enemyWeight} onClick={() => onMomentum(clamp(momentum + (ownWeight > combat.enemyWeight ? 10 : -10), -45, 45))}>Aplicar resultado</Button></article>
    </section>
    <section className="panel damage-calculator"><div><span>DANO DA ÚLTIMA ROLAGEM</span><strong>{lastDamage}</strong><small>× Mang {mangMultiplier.toFixed(1)}</small></div><SmallField label="Resistência do alvo ×" type="number" min={0} step={0.1} value={combat.targetResistance} onChange={(value) => updateCombat({ targetResistance: Number(value) })} /><SmallField label="Bloqueio do alvo" type="number" min={0} value={combat.targetBlock} onChange={(value) => updateCombat({ targetBlock: Number(value) })} /><div><span>DANO FINAL</span><strong>{finalDamage}</strong><small>arredondado para baixo</small></div><code>piso(({lastDamage} × {mangMultiplier.toFixed(1)}) × {combat.targetResistance}) − {combat.targetBlock}</code></section>
    <section className="panel effect-tracker"><div className="v2-section-head"><div><span>EFEITOS ATIVOS</span><strong>Potência / Contagem independentes</strong></div><Button onClick={addEffect}><Plus /> Efeito</Button></div>
      {combat.effects.length === 0 ? <div className="empty-inline"><Activity /><span>Nenhum efeito ativo.</span></div> : <div className="effect-list">{combat.effects.map((effect) => { const rule = EFFECT_RULES.find(([name]) => name === effect.name); return <article key={effect.id}><NativeChoice label="Efeito" value={effect.name} options={EFFECT_RULES.map(([name]) => name)} onChange={(name) => patchEffect(effect.id, { name })} /><SmallField label="Potência" type="number" min={0} value={effect.power} onChange={(value) => patchEffect(effect.id, { power: Number(value) })} /><SmallField label="Contagem" type="number" min={0} value={effect.count} onChange={(value) => patchEffect(effect.id, { count: Number(value) })} /><SmallField label="Fonte / alvo" value={effect.source} onChange={(source) => patchEffect(effect.id, { source })} /><SmallArea label="Notas" value={effect.notes} onChange={(notes) => patchEffect(effect.id, { notes })} /><Button variant="ghost" size="icon-sm" onClick={() => updateCombat({ effects: combat.effects.filter((entry) => entry.id !== effect.id) })}><Trash2 /></Button>{rule && <p className={`effect-rule ${rule[1]}`}>{rule[2]}</p>}</article>; })}</div>}
      <details className="rules-library"><summary>Consultar os 28 efeitos do sistema</summary><div>{EFFECT_RULES.map(([name, kind, rule]) => <article key={name}><span className={kind}>{kind}</span><strong>{name}</strong><p>{rule}</p></article>)}</div></details>
    </section>
  </>;
}

export function EquipmentReference() {
  return <details className="panel equipment-reference"><summary><span><Swords /> Referência de equipamento</span><small>Perfis, qualidades e módulos</small></summary><div className="equipment-reference-body"><div className="weapon-profile-grid">{Object.entries(WEAPON_PROFILES).map(([name, profile]) => <article key={name}><strong>{name}</strong><span>Dano {profile.damage}</span><span>Peso {profile.weight}</span><span>{profile.coins} Moedas</span><small>{profile.modules} módulo(s)</small></article>)}</div><div className="equipment-rulebook"><div><article><strong>QUALIDADE</strong>{QUALITY_RULES.map(([name, rule]) => <p key={name}><b>{name}</b>{rule}</p>)}</article><article><strong>MÓDULOS DE ARMA</strong>{WEAPON_MODULES.map(([name, rule]) => <p key={name}><b>{name}</b>{rule}</p>)}</article><article><strong>MÓDULOS DEFENSIVOS</strong>{DEFENSIVE_MODULES.map(([name, rule]) => <p key={name}><b>{name}</b>{rule}</p>)}</article></div></div></div></details>;
}

export function ProgressionV2({ data, onChange, shinAttribute, shinUnlocked, awakened, onAwaken, activeMang, onActiveMang }: { data: V2Data; onChange: (data: V2Data) => void; shinAttribute: number; shinUnlocked: boolean; awakened: boolean; onAwaken: () => void; activeMang: number; onActiveMang: (value: number) => void }) {
  const updateShin = (patch: Partial<V2Data["shin"]>) => onChange({ ...data, shin: { ...data.shin, ...patch } });
  const addProject = () => { const preset = TRAINING_PROJECTS[0]; onChange({ ...data, trainingProjects: [...data.trainingProjects, { id: uid("training"), type: preset.type, difficulty: preset.difficulty, target: preset.progress, progress: 0, result: preset.result, notes: "", complete: false }] }); };
  const patchProject = (id: string, patch: Partial<TrainingProject>) => onChange({ ...data, trainingProjects: data.trainingProjects.map((project) => project.id === id ? { ...project, ...patch } : project) });
  const addTrial = () => updateShin({ trials: [...data.shin.trials, { id: uid("trial"), ring: data.shin.trials.length + 1, call: "", contradiction: "", choice: "", price: "", principle: "", mark: "", complete: false }] });
  const patchTrial = (id: string, patch: Partial<ShinTrial>) => updateShin({ trials: data.shin.trials.map((trial) => trial.id === id ? { ...trial, ...patch } : trial) });
  const multiplier = MANG_MULTIPLIERS[clamp(activeMang, 0, 20)];
  return <>
    <section className="panel project-panel"><div className="v2-section-head"><div><span>PROJETOS DE TREINO</span><strong>Progresso, dificuldade e recompensa</strong></div><Button onClick={addProject}><Plus /> Projeto</Button></div>{data.trainingProjects.length === 0 ? <div className="empty-inline"><Sparkles /><span>Nenhum projeto estruturado.</span></div> : <div className="project-list">{data.trainingProjects.map((project) => <article className={project.complete ? "complete" : ""} key={project.id}><NativeChoice label="Projeto" value={project.type} options={TRAINING_PROJECTS.map((entry) => entry.type)} onChange={(type) => { const preset = TRAINING_PROJECTS.find((entry) => entry.type === type)!; patchProject(project.id, { type, difficulty: preset.difficulty, target: preset.progress, result: preset.result }); }} /><SmallField label="Dificuldade" type="number" min={1} value={project.difficulty} onChange={(value) => patchProject(project.id, { difficulty: Number(value) })} /><SmallField label="Progresso" type="number" min={0} value={project.progress} onChange={(value) => patchProject(project.id, { progress: Number(value) })} /><SmallField label="Meta" type="number" min={1} value={project.target} onChange={(value) => patchProject(project.id, { target: Number(value) })} /><Progress value={clamp((project.progress / Math.max(1, project.target)) * 100, 0, 100)} /><p>{project.result}</p><SmallArea label="Notas" value={project.notes} onChange={(notes) => patchProject(project.id, { notes })} /><button className="complete-project" onClick={() => patchProject(project.id, { complete: !project.complete })}><Check />{project.complete ? "Concluído" : "Marcar conclusão"}</button><Button variant="ghost" size="icon-sm" onClick={() => onChange({ ...data, trainingProjects: data.trainingProjects.filter((entry) => entry.id !== project.id) })}><Trash2 /></Button></article>)}</div>}</section>
    <section className="panel shin-v2-panel"><div className="v2-section-head"><div><span>ANÉIS DE MANG</span><strong>Limite conquistado por Provas</strong></div><div className="shin-actions"><Button variant={awakened ? "default" : "outline"} onClick={onAwaken}>{awakened ? "Shin desperto" : "Marcar despertar"}</Button><Zap /></div></div><div className="shin-v2-overview"><article><span>ATRIBUTO SHIN E MANG</span><strong>{shinAttribute}</strong><small>{shinUnlocked ? "desbloqueado" : "bloqueado"}</small></article><label><span>LIMITE DE MANG</span><input type="number" min={0} max={shinAttribute} value={data.shin.mangLimit} onChange={(event) => updateShin({ mangLimit: clamp(Number(event.target.value), 0, shinAttribute) })} /><small>não pode superar o Atributo</small></label><label><span>MANG ATIVO</span><input type="number" min={0} max={data.shin.mangLimit} value={activeMang} onChange={(event) => onActiveMang(clamp(Number(event.target.value), 0, data.shin.mangLimit))} /><small>multiplicador ×{multiplier.toFixed(1)}</small></label><label><span>SOBRECARGA DE LUZ</span><input type="number" min={0} max={6} value={data.shin.lightOverload} onChange={(event) => updateShin({ lightOverload: clamp(Number(event.target.value), 0, 6) })} /><small>3: 1d4 Sanidade e zera Mang · 6: Ruptura</small></label></div><p className="rule-note">Ao despertar, Shin e Mang torna-se pelo menos 1 e o primeiro Anel é liberado. Ganhe 1 Mang ao vencer Confronto por 5+ de Peso, afirmar o Princípio sob risco ou sofrer dano ligado ao Desejo — no máximo uma vez por gatilho por rodada.</p><div className="trial-head"><strong>PROVAS</strong><Button variant="outline" onClick={addTrial}><Plus /> Nova Prova</Button></div>{data.shin.trials.map((trial) => <article className={`trial-card ${trial.complete ? "complete" : ""}`} key={trial.id}><SmallField label="Anel" type="number" min={1} max={20} value={trial.ring} onChange={(value) => patchTrial(trial.id, { ring: Number(value) })} /><SmallField label="Chamado" value={trial.call} onChange={(call) => patchTrial(trial.id, { call })} /><SmallField label="Contradição" value={trial.contradiction} onChange={(contradiction) => patchTrial(trial.id, { contradiction })} /><SmallField label="Escolha" value={trial.choice} onChange={(choice) => patchTrial(trial.id, { choice })} /><SmallField label="Preço" value={trial.price} onChange={(price) => patchTrial(trial.id, { price })} /><SmallField label="Afirmação / Princípio" value={trial.principle} onChange={(principle) => patchTrial(trial.id, { principle })} /><SmallField label="Marca" value={trial.mark} onChange={(mark) => patchTrial(trial.id, { mark })} /><button className="complete-project" onClick={() => patchTrial(trial.id, { complete: !trial.complete })}><Check />{trial.complete ? "Concluída" : "Pendente"}</button><Button variant="ghost" size="icon-sm" onClick={() => updateShin({ trials: data.shin.trials.filter((entry) => entry.id !== trial.id) })}><Trash2 /></Button></article>)}</section>
  </>;
}

export function MindWorkspace({ data, onChange, sanity, maxSanity, ego, willpower, dissonance }: { data: V2Data; onChange: (data: V2Data) => void; sanity: number; maxSanity: number; ego: number; willpower: number; dissonance: number }) {
  const mind = data.mind;
  const updateMind = (patch: Partial<V2Data["mind"]>) => onChange({ ...data, mind: { ...mind, ...patch } });
  const patchEntry = (group: "anchors" | "wounds", id: string, patch: Partial<MindEntry>) => updateMind({ [group]: mind[group].map((entry) => entry.id === id ? { ...entry, ...patch } : entry) });
  const addEntry = (group: "anchors" | "wounds") => updateMind({ [group]: [...mind[group], { id: uid(group), name: group === "anchors" ? "Nova Âncora" : "Nova Ferida", notes: "", active: true }] });
  const sanityPercent = Math.round((sanity / Math.max(1, maxSanity)) * 100);
  const state = SANITY_STATES.find(([, band]) => { const [min, max] = band.replace("%", "").split(/[–-]/).map(Number); return sanityPercent >= min && sanityPercent <= max; }) ?? SANITY_STATES[0];
  const activeAnchors = mind.anchors.filter((entry) => entry.active).length;
  const openWounds = mind.wounds.filter((entry) => entry.active).length;
  const rupturePool = ego + willpower + activeAnchors;
  const ruptureDifficulty = 3 + Math.floor(dissonance / 2) + openWounds;
  return <>
    <section className="mind-hero panel"><div><span>ESTADO MENTAL</span><strong>{state[0]}</strong><p>{sanity}/{maxSanity} · {sanityPercent}% — {state[2]}</p></div><div><span>TESTE DE RUPTURA</span><strong>{rupturePool}d8 <i>vs.</i> Dif. {ruptureDifficulty}</strong><p>Ego + Vontade + Âncoras ativas / 3 + piso(Dissonância ÷ 2) + Feridas abertas</p></div></section>
    <div className="mind-columns">{(["anchors", "wounds"] as const).map((group) => <section className="panel mind-list" key={group}><div className="v2-section-head"><div><span>{group === "anchors" ? "ÂNCORAS" : "FERIDAS"}</span><strong>{mind[group].filter((entry) => entry.active).length} {group === "anchors" ? "ativa(s)" : "aberta(s)"}</strong></div><Button variant="outline" onClick={() => addEntry(group)}><Plus /> Adicionar</Button></div>{mind[group].map((entry) => <article key={entry.id}><button className={entry.active ? "active" : ""} onClick={() => patchEntry(group, entry.id, { active: !entry.active })}><Check /></button><SmallField label="Nome" value={entry.name} onChange={(name) => patchEntry(group, entry.id, { name })} /><SmallArea label="Descrição / reparo" value={entry.notes} onChange={(notes) => patchEntry(group, entry.id, { notes })} /><Button variant="ghost" size="icon-sm" onClick={() => updateMind({ [group]: mind[group].filter((item) => item.id !== entry.id) })}><Trash2 /></Button></article>)}</section>)}</div>
    <section className="panel ego-panel"><div className="v2-section-head"><div><span>MANIFESTAÇÃO E.G.O.</span><strong>Forma, princípio e corrosão</strong></div><Brain /></div><div className="ego-grid"><SmallField label="Nome" value={mind.egoName} onChange={(egoName) => updateMind({ egoName })} /><SmallField label="Forma" value={mind.egoForm} onChange={(egoForm) => updateMind({ egoForm })} /><SmallField label="Princípio" value={mind.egoPrinciple} onChange={(egoPrinciple) => updateMind({ egoPrinciple })} /><SmallField label="Custo" value={mind.egoCost} onChange={(egoCost) => updateMind({ egoCost })} /><SmallArea label="Habilidade básica" value={mind.egoBasic} onChange={(egoBasic) => updateMind({ egoBasic })} /><SmallArea label="Habilidade de identidade" value={mind.egoIdentity} onChange={(egoIdentity) => updateMind({ egoIdentity })} /><SmallArea label="Habilidade final" value={mind.egoFinal} onChange={(egoFinal) => updateMind({ egoFinal })} /><SmallArea label="Comportamento em Corrosão" value={mind.corrosionBehavior} onChange={(corrosionBehavior) => updateMind({ corrosionBehavior })} /></div><div className="corrosion-track"><label><span>CORROSÃO</span><input type="number" min={0} max={6} value={mind.corrosion} onChange={(event) => updateMind({ corrosion: clamp(Number(event.target.value), 0, 6) })} /></label><p><b>3</b> sinais visíveis · <b>5</b> perde controle parcial · <b>6</b> Corrosão completa</p><Progress value={(mind.corrosion / 6) * 100} /></div></section>
    <section className="panel distortion-panel"><div className="v2-section-head"><div><span>DISTORÇÃO → ANORMALIDADE</span><strong>{DISTORTION_STAGES[mind.distortionStage]}</strong></div><ShieldAlert /></div><input className="stage-slider" aria-label="Estágio de Distorção" type="range" min={0} max={6} value={mind.distortionStage} onChange={(event) => updateMind({ distortionStage: Number(event.target.value) })} /><div className="stage-labels">{DISTORTION_STAGES.map((stage, index) => <button className={mind.distortionStage === index ? "active" : ""} key={stage} onClick={() => updateMind({ distortionStage: index })}>{index}</button>)}</div><SmallArea label="Resultado da Ruptura / estado atual" value={mind.ruptureResult} onChange={(ruptureResult) => updateMind({ ruptureResult })} rows={4} placeholder="E.G.O., Clareza, Distorção, Pânico ou Manifestação Parcial…" /></section>
  </>;
}

export function MasterWorkspace({ data, onChange }: { data: V2Data; onChange: (data: V2Data) => void }) {
  const [selectedId, setSelectedId] = useState(data.anomalies[0]?.id ?? "");
  const anomaly = data.anomalies.find((entry) => entry.id === selectedId) ?? data.anomalies[0];
  const patchAnomaly = (patch: Partial<Anomaly>) => anomaly && onChange({ ...data, anomalies: data.anomalies.map((entry) => entry.id === anomaly.id ? { ...entry, ...patch } : entry) });
  const encounter = data.encounter;
  const updateEncounter = (patch: Partial<V2Data["encounter"]>) => onChange({ ...data, encounter: { ...encounter, ...patch } });
  const threatBudget = encounter.characters * encounter.threatPerCharacter;
  const threatSpent = encounter.enemies.reduce((sum, enemy) => sum + enemy.quantity * enemy.cost, 0);
  const anomalyBudget = anomaly ? ANOMALY_RISKS[anomaly.risk].budget : 0;
  const anomalySpent = anomaly?.purchases.reduce((sum, purchase) => sum + purchase.cost, 0) ?? 0;
  return <>
    <section className="master-art panel"><div><span>PROTOCOLO DE CONTENÇÃO // V2</span><strong>Anormalidades e encontros</strong><p>Orçamentos automáticos, Qliphoth, Trabalhos, combate, recompensas E.G.O. e Relógios.</p></div></section>
    <section className="anomaly-workbench"><aside className="panel anomaly-list"><div className="panel-label">ANORMALIDADES // {data.anomalies.length}</div>{data.anomalies.map((entry) => <button className={entry.id === anomaly?.id ? "active" : ""} key={entry.id} onClick={() => setSelectedId(entry.id)}><span>{entry.risk} · {entry.code}</span><strong>{entry.name}</strong></button>)}<Button onClick={() => { const next = createAnomaly(); onChange({ ...data, anomalies: [...data.anomalies, next] }); setSelectedId(next.id); }}><Plus /> Criar Anormalidade</Button></aside>
      {anomaly ? <section className="panel anomaly-editor"><div className="v2-section-head"><div><span>FICHA DE ANORMALIDADE</span><strong>{anomaly.name}</strong></div><Button variant="ghost" size="icon-sm" onClick={() => { onChange({ ...data, anomalies: data.anomalies.filter((entry) => entry.id !== anomaly.id) }); setSelectedId(""); }}><Trash2 /></Button></div><div className="anomaly-fields"><SmallField label="Nome" value={anomaly.name} onChange={(name) => patchAnomaly({ name })} /><SmallField label="Código" value={anomaly.code} onChange={(code) => patchAnomaly({ code })} /><NativeChoice label="Risco" value={anomaly.risk} options={Object.keys(ANOMALY_RISKS)} onChange={(risk) => patchAnomaly({ risk: risk as Anomaly["risk"] })} /><SmallField label="Origem / arquétipo" value={anomaly.archetype} onChange={(archetype) => patchAnomaly({ archetype })} /><SmallArea label="Conceito" value={anomaly.concept} onChange={(concept) => patchAnomaly({ concept })} /><SmallArea label="Aparência e história" value={anomaly.appearance} onChange={(appearance) => patchAnomaly({ appearance })} /></div>
        <div className="anomaly-budget"><span>ORÇAMENTO {anomaly.risk}</span><strong className={anomalySpent > anomalyBudget ? "bad" : ""}>{anomalySpent} / {anomalyBudget}</strong><small>Referência: {ANOMALY_RISKS[anomaly.risk].life} Vida · {ANOMALY_RISKS[anomaly.risk].moves} Mov. · {ANOMALY_RISKS[anomaly.risk].damage} dano · {ANOMALY_RISKS[anomaly.risk].phases} fase(s)</small><Progress value={clamp((anomalySpent / Math.max(1, anomalyBudget)) * 100, 0, 100)} /></div>
        <div className="purchase-grid">{ANOMALY_PURCHASES.map(([name, cost]) => <button key={name} onClick={() => patchAnomaly({ purchases: [...anomaly.purchases, { id: uid("purchase"), name, cost }] })}><Plus /><span>{name}</span><strong>{cost}</strong></button>)}</div>{anomaly.purchases.length > 0 && <div className="chosen-purchases">{anomaly.purchases.map((purchase) => <button key={purchase.id} onClick={() => patchAnomaly({ purchases: anomaly.purchases.filter((entry) => entry.id !== purchase.id) })}>{purchase.name} · {purchase.cost} <Trash2 /></button>)}</div>}
        <div className="qliphoth-grid"><SmallField label="Qliphoth atual" type="number" min={0} value={anomaly.qliphoth} onChange={(value) => patchAnomaly({ qliphoth: Number(value) })} /><SmallField label="Qliphoth máximo" type="number" min={0} value={anomaly.qliphothMax} onChange={(value) => patchAnomaly({ qliphothMax: Number(value) })} /><SmallField label="Quando diminui" value={anomaly.qliphothDrop} onChange={(qliphothDrop) => patchAnomaly({ qliphothDrop })} /><SmallField label="Quando aumenta" value={anomaly.qliphothRise} onChange={(qliphothRise) => patchAnomaly({ qliphothRise })} /><SmallArea label="Evento em Qliphoth 0" value={anomaly.zeroEvent} onChange={(zeroEvent) => patchAnomaly({ zeroEvent })} /></div>
        <div className="work-grid">{anomaly.works.map((work, index) => <article key={work.name}><strong>{work.name}</strong><SmallField label="Afinidade −2…+2" type="number" min={-2} max={2} value={work.affinity} onChange={(value) => patchAnomaly({ works: anomaly.works.map((entry, i) => i === index ? { ...entry, affinity: Number(value) } : entry) })} /><SmallField label="Dificuldade" type="number" min={1} value={work.difficulty} onChange={(value) => patchAnomaly({ works: anomaly.works.map((entry, i) => i === index ? { ...entry, difficulty: Number(value) } : entry) })} /><SmallArea label="Sucesso" value={work.success} onChange={(success) => patchAnomaly({ works: anomaly.works.map((entry, i) => i === index ? { ...entry, success } : entry) })} /><SmallArea label="Falha" value={work.failure} onChange={(failure) => patchAnomaly({ works: anomaly.works.map((entry, i) => i === index ? { ...entry, failure } : entry) })} /></article>)}</div>
        <div className="anomaly-combat"><div className="form-grid"><SmallField label="Vida" type="number" min={0} value={anomaly.life} onChange={(value) => patchAnomaly({ life: Number(value) })} /><SmallField label="Postura" type="number" min={0} value={anomaly.posture} onChange={(value) => patchAnomaly({ posture: Number(value) })} /><SmallField label="Movimentos" type="number" min={0} value={anomaly.moves} onChange={(value) => patchAnomaly({ moves: Number(value) })} /><SmallField label="Peso padrão" type="number" min={0} value={anomaly.weight} onChange={(value) => patchAnomaly({ weight: Number(value) })} /><SmallField label="Dano base" value={anomaly.damage} onChange={(damage) => patchAnomaly({ damage })} /><SmallField label="Enkephalin" type="number" min={0} value={anomaly.enkephalin} onChange={(value) => patchAnomaly({ enkephalin: Number(value) })} /></div><div className="resistance-grid"><SmallField label="Vermelho ×" type="number" step={0.1} value={anomaly.red} onChange={(value) => patchAnomaly({ red: Number(value) })} /><SmallField label="Branco ×" type="number" step={0.1} value={anomaly.white} onChange={(value) => patchAnomaly({ white: Number(value) })} /><SmallField label="Preto ×" type="number" step={0.1} value={anomaly.black} onChange={(value) => patchAnomaly({ black: Number(value) })} /><SmallField label="Pálido ×" type="number" step={0.1} value={anomaly.pale} onChange={(value) => patchAnomaly({ pale: Number(value) })} /></div><SmallArea label="Resistência a efeitos" value={anomaly.effectResistance} onChange={(effectResistance) => patchAnomaly({ effectResistance })} /><SmallArea label="Habilidades 1 e 2" value={anomaly.skills} onChange={(skills) => patchAnomaly({ skills })} /><SmallArea label="Reação / passiva" value={anomaly.reaction} onChange={(reaction) => patchAnomaly({ reaction })} /><SmallArea label="Fases, fuga e domínio" value={anomaly.phases} onChange={(phases) => patchAnomaly({ phases })} /><SmallArea label="Partes e condições de quebra" value={anomaly.parts} onChange={(parts) => patchAnomaly({ parts })} /><SmallArea label="E.G.O. — arma, armadura, presente e habilidade" value={anomaly.egoRewards} onChange={(egoRewards) => patchAnomaly({ egoRewards })} /></div>
      </section> : <div className="panel empty-state"><FlaskConical /><strong>Nenhuma Anormalidade</strong><p>Crie a primeira para abrir o formulário completo.</p></div>}</section>
    <section className="panel encounter-panel"><div className="v2-section-head"><div><span>ORÇAMENTO DE ENCONTRO</span><strong className={threatSpent > threatBudget ? "bad" : ""}>{threatSpent} / {threatBudget} ameaça</strong></div><Dices /></div><div className="encounter-config"><SmallField label="Personagens" type="number" min={1} value={encounter.characters} onChange={(value) => updateEncounter({ characters: Number(value) })} /><NativeChoice label="Ameaça por personagem" value={String(encounter.threatPerCharacter)} options={["1", "2", "3", "4", "5"]} onChange={(value) => updateEncounter({ threatPerCharacter: Number(value) })} /><SmallArea label="Condição de vitória" value={encounter.victory} onChange={(victory) => updateEncounter({ victory })} /><SmallArea label="Ambiente e notas" value={encounter.notes} onChange={(notes) => updateEncounter({ notes })} /></div><div className="enemy-palette">{ENCOUNTER_COSTS.map(([kind, cost]) => <button key={kind} onClick={() => updateEncounter({ enemies: [...encounter.enemies, { id: uid("enemy"), name: kind, kind, quantity: 1, cost }] })}><Plus />{kind}<strong>{cost}</strong></button>)}</div><div className="enemy-list">{encounter.enemies.map((enemy) => <article key={enemy.id}><SmallField label="Nome" value={enemy.name} onChange={(name) => updateEncounter({ enemies: encounter.enemies.map((entry) => entry.id === enemy.id ? { ...entry, name } : entry) })} /><SmallField label="Quantidade" type="number" min={1} value={enemy.quantity} onChange={(value) => updateEncounter({ enemies: encounter.enemies.map((entry) => entry.id === enemy.id ? { ...entry, quantity: Number(value) } : entry) })} /><SmallField label="Custo/un." type="number" min={0} step={0.5} value={enemy.cost} onChange={(value) => updateEncounter({ enemies: encounter.enemies.map((entry) => entry.id === enemy.id ? { ...entry, cost: Number(value) } : entry) })} /><strong>{enemy.quantity * enemy.cost}</strong><Button variant="ghost" size="icon-sm" onClick={() => updateEncounter({ enemies: encounter.enemies.filter((entry) => entry.id !== enemy.id) })}><Trash2 /></Button></article>)}</div><div className="clock-panel"><Clock3 /><div><span>RELÓGIO</span><strong>{encounter.clockFilled}/{encounter.clockSize}</strong></div><select value={encounter.clockSize} onChange={(event) => updateEncounter({ clockSize: Number(event.target.value), clockFilled: Math.min(encounter.clockFilled, Number(event.target.value)) })}><option value={4}>4 segmentos</option><option value={6}>6 segmentos</option><option value={8}>8 segmentos</option></select><div className="clock-segments">{Array.from({ length: encounter.clockSize }, (_, index) => <button className={index < encounter.clockFilled ? "filled" : ""} key={index} onClick={() => updateEncounter({ clockFilled: index + 1 === encounter.clockFilled ? index : index + 1 })}>{index + 1}</button>)}</div></div></section>
  </>;
}
