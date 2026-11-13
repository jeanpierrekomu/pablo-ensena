// Pablo Enseña · web jugable (Empezar P01–P07 + Mundo 1 P08–P25)
// Sin dependencias: abre index.html con un servidor estático.

/* ───────────── Estado (se guarda en este navegador) ───────────── */
const KEY = "pablo_ensena_v1";
const NUEVO = () => ({
  onboarded: false,
  name: "",
  objetivo: null,
  grado: "3.º",
  minutos: 10,
  examen: null, // { score, total }
  xp: 0,
  racha: { count: 0, last: null },
  badges: [],
  step: 0, // índice del siguiente paso en MUNDO1
  juegos: 0,
  registros: [],
  jefe: null, // { aciertos, total }
  cofre: false,
  done1: false,
  prog: {}, // pasos de los mundos 2–6
  hechos: [], // mundos 2–6 terminados
  meta: null, // P27
  gastadas: 0, // monedas usadas en P44
  ropa: { cabeza: null, cara: null, fondo: "lavanda" },
  docente: false,
  leccionXP: 0,
});
let S = load();
function load() {
  try { return { ...NUEVO(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return NUEVO(); }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }

/* ───────────── Utilidades ───────────── */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const app = $("#app");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const soles = (n) => "S/ " + (Math.round(n * 100) / 100).toLocaleString("es-PE", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const nivel = () => Math.floor(S.xp / NIVEL_XP) + 1;
const pablo = (pose, cls = "") => `<img class="pablo ${cls}" src="${POSES[pose]}" alt="Pablo" />`;
const hoy = () => new Date().toISOString().slice(0, 10);

function addXP(n) {
  if (!n) return;
  const antes = nivel();
  S.xp += n;
  S.leccionXP += n;
  marcarRacha();
  save();
  toast(`+${n} XP ⚡`);
  if (nivel() > antes) setTimeout(() => toast(`¡Nivel ${nivel()}! 🎉`), 1300);
}
function darInsignia(id) {
  if (S.badges.includes(id)) return;
  S.badges.push(id);
  save();
  const b = INSIGNIAS.find((x) => x.id === id);
  setTimeout(() => toast(`Nueva insignia: ${b.emo} ${b.t}`), 900);
}
function marcarRacha() {
  const d = hoy();
  if (S.racha.last === d) return;
  const ayer = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.racha.count = S.racha.last === ayer ? S.racha.count + 1 : 1;
  S.racha.last = d;
}

let toastTimer;
function toast(txt) {
  const t = $("#toast");
  t.textContent = txt;
  t.hidden = false;
  t.style.animation = "none"; t.offsetHeight; t.style.animation = "";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 1800);
}

/* Sonidos cortos con WebAudio (sin archivos) */
let ctx;
function beep(ok) {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const notas = ok ? [660, 880] : [300, 220];
    notas.forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = ok ? "triangle" : "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.11);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.11 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.11 + 0.18);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.11);
      o.stop(ctx.currentTime + i * 0.11 + 0.2);
    });
  } catch {}
}

function confeti() {
  const box = document.createElement("div");
  box.className = "confetti";
  const colores = ["#F9B81F", "#20B670", "#4B7BE5", "#E8577A", "#8E6CE0", "#F5A623"];
  for (let i = 0; i < 70; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "%";
    p.style.background = colores[i % colores.length];
    p.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
    p.style.animationDelay = Math.random() * 0.4 + "s";
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(p);
  }
  $(".device").appendChild(box);
  setTimeout(() => box.remove(), 3800);
}

/* Hoja inferior de feedback (P15 · Error amable vive aquí) */
function sheet({ ok, info, title, text = "", btn = "Continuar", alt, onAlt, onNext }) {
  if (!info) beep(ok);
  const s = $("#sheet");
  s.className = "sheet " + (info ? "info" : ok ? "ok" : "err");
  s.innerHTML = `
    <div class="row" style="align-items:flex-start">
      <div class="grow">
        <h3>${title}</h3>
        ${text ? `<p>${text}</p>` : ""}
      </div>
      ${info ? `<span style="font-size:52px;line-height:1">${info}</span>` : pablo(ok ? "celebra" : "explica", "sm")}
    </div>
    <button class="btn ${info ? "" : ok ? "green" : "red"}" id="sheetNext">${btn}</button>
    ${alt ? `<button class="link" id="sheetAlt" style="color:inherit">${alt}</button>` : ""}`;
  s.hidden = false;
  $("#sheetNext").focus();
  $("#sheetNext").onclick = () => { s.hidden = true; onNext && onNext(); };
  if (alt) $("#sheetAlt").onclick = () => { s.hidden = true; onAlt && onAlt(); };
}
const cerrarSheet = () => ($("#sheet").hidden = true);

/* ───────────── Navegación ───────────── */
let actual = null;
function go(id, opts = {}) {
  cerrarSheet();
  const fn = SCREENS[id] || SCREENS.P05;
  actual = id;
  app.innerHTML = "";
  const el = document.createElement("section");
  el.className = "screen";
  app.appendChild(el);
  fn(el, opts);
  app.scrollTop = 0;
  if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
}

// Mundos: cada uno es una lista de pantallas (FLOWS en data.js)
const mundoDe = (id) => +Object.keys(FLOWS).find((n) => FLOWS[n].includes(id));
const getStep = (n) => (n === 1 ? S.step : S.prog[n] || 0);
const mundoHecho = (n) => (n === 1 ? S.done1 : S.hechos.includes(n));
const mundoAbierto = (n) => n === 1 || mundoHecho(n - 1);
function setStep(n, v) {
  if (n === 1) S.step = Math.max(S.step, v);
  else S.prog[n] = Math.max(S.prog[n] || 0, v);
}
// Avanza dentro del mundo y recuerda hasta dónde llegaste
function siguiente(id) {
  const n = mundoDe(id), flow = FLOWS[n], i = flow.indexOf(id);
  setStep(n, i + 1);
  save();
  if (flow[i + 1]) return go(flow[i + 1]);
  if (n !== 1 && !S.hechos.includes(n)) S.hechos.push(n);
  save();
  go("P07");
  confeti();
  toast(`¡Mundo ${n} completado! 🏆`);
}
function mundoActual() {
  for (const n of Object.keys(FLOWS).map(Number)) if (!mundoHecho(n)) return n;
  return 6;
}
function continuarMundo(n = mundoActual()) {
  if (mundoHecho(n)) return go("P07");
  let id = FLOWS[n][getStep(n)] || FLOWS[n][0];
  if (id === "P23") id = "P21"; // el jefe siempre empieza en la intro
  go(id);
}
const pasoPct = (id) => {
  const f = FLOWS[mundoDe(id)] || MUNDO1;
  return Math.round(((f.indexOf(id) + 1) / f.length) * 100);
};

function barra(pct, { back, close = "P07", xp = true } = {}) {
  return `<div class="top">
    <button class="icon-btn" data-go="${back || close}" aria-label="${back ? "Volver" : "Cerrar"}">${back ? "←" : "✕"}</button>
    <div class="progress" role="progressbar" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>
    ${xp ? `<span class="xp-pill">⚡ ${S.xp}</span>` : ""}
  </div>`;
}
function tabs(on) {
  const t = [["P05", "🏠", "Inicio"], ["P07", "🗺️", "Mapa"], ["P06", "🎯", "Misiones"], ["P45", "🙂", "Perfil"]];
  return `<nav class="tabs">${t.map(([id, i, l]) => `<button class="tab ${on === id ? "on" : ""}" data-go="${id}"><span class="ti">${i}</span>${l}</button>`).join("")}</nav>`;
}
// Cualquier [data-go] navega
app.addEventListener("click", (e) => {
  const b = e.target.closest("[data-go]");
  if (b) go(b.dataset.go);
});

/* Pregunta de opción múltiple reutilizable */
function quiz(root, q, onDone, { dark = false } = {}) {
  let sel = null;
  root.innerHTML = `
    <h2>${q.q}</h2>
    <div class="stack" id="opts">${q.opts.map((o, i) => `<button class="option" data-i="${i}"><span class="emo">${"ABC"[i]}</span>${o}</button>`).join("")}</div>`;
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.textContent = "Comprobar";
  btn.disabled = true;
  $$("#opts .option", root).forEach((b) =>
    b.addEventListener("click", () => {
      if (btn.dataset.locked) return;
      $$("#opts .option", root).forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel");
      sel = +b.dataset.i;
      btn.disabled = false;
    })
  );
  btn.addEventListener("click", () => {
    if (sel === null) return;
    btn.dataset.locked = 1;
    const ok = sel === q.ok;
    $$("#opts .option", root)[sel].classList.replace("sel", ok ? "right" : "wrong");
    if (!ok) $$("#opts .option", root)[q.ok].classList.add("right");
    onDone(ok, sel);
  });
  return btn;
}

/* ───────────── Pantallas ───────────── */
const SCREENS = {};

// P01 · Bienvenida
SCREENS.P01 = (el) => {
  el.innerHTML = `
    <div class="body center">
      ${pablo("saluda", "big float")}
      <span class="eyebrow gold">Educación financiera · Secundaria</span>
      <h1>Pablo Enseña</h1>
      <p class="sub">Aprende a manejar tu plata jugando.<br/>Cinco minutos al día, con Pablo.</p>
    </div>
    <div class="foot">
      <button class="btn" data-go="P02">Empezar</button>
      <button class="btn ghost" id="tengo">Ya tengo cuenta</button>
      <div class="row between"><button class="link" data-go="D01">Soy docente →</button><button class="link" data-go="INDICE">Ver todas las pantallas</button></div>
    </div>`;
  $("#tengo", el).onclick = () => (S.onboarded ? go("P05") : toast("Aún no hay progreso guardado aquí"));
};

// P02 · Objetivo
SCREENS.P02 = (el) => {
  el.innerHTML = `
    ${barra(25, { back: "P01", xp: false })}
    <div class="body">
      <div class="row">${pablo("saluda", "sm")}<div class="bubble grow">¡Hola! Soy Pablo. ¿Qué te gustaría lograr con tu plata?</div></div>
      <div class="stack">${OBJETIVOS.map((o) => `<button class="option ${S.objetivo === o.id ? "sel" : ""}" data-id="${o.id}"><span class="emo">${o.emo}</span>${o.txt}</button>`).join("")}</div>
    </div>
    <div class="foot"><button class="btn" id="next" ${S.objetivo ? "" : "disabled"}>Continuar</button></div>`;
  $$(".option", el).forEach((b) => (b.onclick = () => {
    S.objetivo = b.dataset.id; save();
    $$(".option", el).forEach((x) => x.classList.toggle("sel", x === b));
    $("#next", el).disabled = false;
  }));
  $("#next", el).onclick = () => go("P03");
};

// P03 · Personalización
SCREENS.P03 = (el) => {
  el.innerHTML = `
    ${barra(50, { back: "P02", xp: false })}
    <div class="body">
      <div class="row">${pablo("senala", "sm")}<div class="bubble grow">Cuéntame un poco de ti para armar tu camino.</div></div>
      <div>
        <label class="lbl" for="nom">¿Cómo te llamo?</label>
        <input id="nom" type="text" maxlength="20" placeholder="Tu nombre o apodo" value="${esc(S.name)}" autocomplete="off" />
        <p class="muted" style="margin-top:6px">Solo tu nombre o apodo. Nunca pedimos datos de tu familia.</p>
      </div>
      <div><span class="lbl">¿En qué grado estás?</span>
        <div class="chips" id="grados">${GRADOS.map((g) => `<button class="chip ${S.grado === g ? "sel" : ""}" data-v="${g}">${g} sec.</button>`).join("")}</div></div>
      <div><span class="lbl">¿Cuánto tiempo al día?</span>
        <div class="chips" id="mins">${MINUTOS.map((m) => `<button class="chip ${S.minutos === m ? "sel" : ""}" data-v="${m}">${m} min</button>`).join("")}</div></div>
    </div>
    <div class="foot"><button class="btn" id="next">Continuar</button></div>`;
  const nom = $("#nom", el), next = $("#next", el);
  const check = () => (next.disabled = !nom.value.trim());
  nom.oninput = () => { S.name = nom.value.trim(); save(); check(); };
  check();
  const chips = (id, key, num) => $$(`#${id} .chip`, el).forEach((c) => (c.onclick = () => {
    S[key] = num ? +c.dataset.v : c.dataset.v; save();
    $$(`#${id} .chip`, el).forEach((x) => x.classList.toggle("sel", x === c));
  }));
  chips("grados", "grado"); chips("mins", "minutos", true);
  next.onclick = () => go("P04");
};

// P04 · Examen inicial (diagnóstico: sin castigo)
SCREENS.P04 = (el) => {
  let i = 0, score = 0;
  const pintar = () => {
    if (i === EXAMEN.length) return final();
    const q = EXAMEN[i];
    let sel = null;
    el.innerHTML = `
      ${barra(50 + ((i + 1) / EXAMEN.length) * 50, { back: "P03", xp: false })}
      <div class="body">
        <span class="eyebrow">Examen inicial · ${i + 1} de ${EXAMEN.length}</span>
        <p class="muted">Es solo para saber desde dónde empiezas. Si no sabes, ¡no pasa nada!</p>
        <h2>${q.q}</h2>
        <div class="stack">${q.opts.map((o, k) => `<button class="option" data-k="${k}"><span class="emo">${"ABC"[k]}</span>${o}</button>`).join("")}</div>
      </div>
      <div class="foot"><button class="btn" id="next" disabled>Siguiente</button><button class="link" id="nose">No lo sé todavía</button></div>`;
    $$(".option", el).forEach((b) => (b.onclick = () => {
      sel = +b.dataset.k;
      $$(".option", el).forEach((x) => x.classList.toggle("sel", x === b));
      $("#next", el).disabled = false;
    }));
    $("#next", el).onclick = () => { if (sel === q.ok) score++; i++; pintar(); };
    $("#nose", el).onclick = () => { i++; pintar(); };
  };
  const final = () => {
    S.examen = { score, total: EXAMEN.length };
    S.onboarded = true;
    save();
    el.innerHTML = `
      <div class="body center">
        ${pablo("celebra", "mid pop")}
        <h2>¡Listo, ${esc(S.name || "crack")}!</h2>
        <p class="sub">Acertaste <b>${score} de ${EXAMEN.length}</b>. Con eso armé tu camino: empiezas en el <b>Mundo 1 · Tu dinero</b>.</p>
        <div class="card soft" style="width:100%">Al final del mundo vas a ver cuánto mejoraste. 📈</div>
      </div>
      <div class="foot"><button class="btn" id="ir">Ir a mi inicio</button></div>`;
    confeti();
    addXP(20);
    darInsignia("inicio");
    $("#ir", el).onclick = () => go("P05");
  };
  pintar();
};

// P05 · Inicio
SCREENS.P05 = (el) => {
  if (!S.onboarded) return go("P01");
  const n = mundoActual(), M = MUNDOS[n - 1], fin = mundoHecho(6);
  const pct = Math.round((getStep(n) / FLOWS[n].length) * 100);
  const sig = n === 1 ? paradaActual().emo + " " + paradaActual().nombre : NOMBRES[FLOWS[n][Math.min(getStep(n), FLOWS[n].length - 1)]];
  const mis = estadoMisiones();
  el.innerHTML = `
    <div class="body">
      <div class="row between">
        <div><p class="muted">${saludo()}</p><h2>¡Hola, ${esc(S.name || "crack")}!</h2></div>
        ${statsBtns()}
      </div>
      <div class="hero">
        <div class="grow stack" style="gap:8px">
          <span class="muted" style="color:#B9B6E0">MUNDO ${n} · ${M.nombre.toUpperCase()}</span>
          <h3>${fin ? "¡Terminaste los 6 mundos! 🏆" : sig}</h3>
          <div class="bar"><i style="width:${fin ? 100 : pct}%"></i></div>
          <span class="sub" style="font-size:13px">${fin ? "Repasa y completa tu álbum" : pct + "% del mundo"}</span>
          <button class="btn small" id="cont" style="align-self:flex-start">${fin ? "Ver el mapa" : getStep(n) ? "Continuar" : "Empezar"}</button>
        </div>
        ${pablo("senala", "sm")}
      </div>
      <div>
        <h3 style="margin-bottom:8px">Siempre contigo</h3>
        <div class="grid3">
          <button class="card mini" data-go="P42"><span>🔁</span>Repaso</button>
          <button class="card mini" data-go="P43"><span>📒</span>Álbum</button>
          <button class="card mini" data-go="P44"><span>👕</span>Viste a Pablo</button>
        </div>
      </div>
      <div class="card">
        <div class="row between"><h3>Misiones de la semana</h3><button class="link" data-go="P06">Ver todas</button></div>
        <div class="stack" style="margin-top:8px">${mis.slice(0, 2).map(filaMision).join("")}</div>
      </div>
      <button class="card soft row tapcard" id="tip">
        <span style="font-size:26px">💡</span>
        <p class="grow" style="text-align:left"><b>Tip de Pablo:</b> <span id="tipt">${TIPS[S.tip % TIPS.length]}</span></p><span class="chev">↻</span>
      </button>
      <button class="row between card tapcard" data-info="xp" style="text-align:left">
        <div><p class="muted">Nivel</p><h3>${nivel()}</h3></div>
        <div class="grow"><div class="bar"><i style="width:${((S.xp % NIVEL_XP) / NIVEL_XP) * 100}%"></i></div>
        <p class="muted" style="margin-top:4px">${NIVEL_XP - (S.xp % NIVEL_XP)} XP para el nivel ${nivel() + 1}</p></div>
      </button>
    </div>
    ${tabs("P05")}`;
  $("#cont", el).onclick = () => continuarMundo();
  $("#tip", el).onclick = () => { S.tip = (S.tip || 0) + 1; save(); $("#tipt", el).textContent = TIPS[S.tip % TIPS.length]; };
};
function saludo() {
  const h = new Date().getHours();
  return h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
}
function paradaActual() {
  const id = MUNDO1[Math.min(S.step, MUNDO1.length - 1)];
  return PARADAS.find((p) => MUNDO1.indexOf(id) >= MUNDO1.indexOf(p.desde) && MUNDO1.indexOf(id) <= MUNDO1.indexOf(p.hasta)) || PARADAS[0];
}

// P06 · Misiones
function estadoMisiones() {
  const v = { xp: S.xp, juegos: S.juegos, racha: S.racha.count, reto: S.registros.length };
  return MISIONES.map((m) => ({ ...m, val: Math.min(v[m.id], m.meta) }));
}
function filaMision(m) {
  const done = m.val >= m.meta;
  return `<button class="row mis" data-mis="${m.id}"><span style="font-size:24px">${done ? "✅" : m.emo}</span>
    <div class="grow"><div class="row between"><b>${m.t}</b><span class="muted">${m.val}/${m.meta}</span></div>
    <div class="bar ${done ? "ok" : ""}" style="margin-top:6px"><i style="width:${(m.val / m.meta) * 100}%"></i></div></div><span class="chev">›</span></button>`;
}
SCREENS.P06 = (el) => {
  const mis = estadoMisiones();
  const todas = mis.every((m) => m.val >= m.meta);
  el.innerHTML = `
    <div class="body">
      <h2>Misiones de la semana</h2>
      <p class="sub">Se renuevan cada lunes. Complétalas todas y abre el cofre.</p>
      <div class="card stack" style="gap:16px">${mis.map(filaMision).join("")}</div>
      <div class="card ${todas && !S.cofre ? "warn" : "soft"} center" style="text-align:center">
        <div style="font-size:54px" class="${todas && !S.cofre ? "float" : ""}">${S.cofre ? "📭" : "🎁"}</div>
        <h3>${S.cofre ? "Cofre abierto" : "Cofre semanal: +100 XP"}</h3>
        <p class="muted">${S.cofre ? "Vuelve el lunes por otro." : todas ? "¡Ya puedes abrirlo!" : "Te faltan " + mis.filter((m) => m.val < m.meta).length + " misiones."}</p>
        ${todas && !S.cofre ? `<button class="btn" id="cofre" style="margin-top:10px">Abrir cofre</button>` : ""}
      </div>
    </div>
    ${tabs("P06")}`;
  const c = $("#cofre", el);
  if (c) c.onclick = () => { S.cofre = true; addXP(100); confeti(); go("P06"); };
};

// P07 · Mapa
SCREENS.P07 = (el) => {
  if (!S.onboarded) return go("P01");
  const idxActual = S.done1 ? PARADAS.length : PARADAS.indexOf(paradaActual());
  const offs = [0, 60, 30, -40, -10, 40];
  el.innerHTML = `
    <div class="body">
      <div class="row between"><h2>Mapa</h2>${statsBtns()}</div>
      <button class="world tap" data-mundo="1" style="background:var(--w1)">
        <span style="font-size:30px">💰</span>
        <div class="grow"><b style="opacity:.85;font-size:12px">MUNDO 1${S.done1 ? " · COMPLETADO ✓" : ""}</b><h3>Tu dinero</h3><p style="font-size:13px;opacity:.9">Necesidades, deseos y publicidad</p></div><span class="chev">›</span>
      </button>
      <div class="path">
        ${PARADAS.map((p, i) => {
          const est = i < idxActual ? "done" : i === idxActual ? "current" : "locked";
          return `${est === "current" ? `<span class="start-tag" style="position:relative;left:${offs[i]}px">${S.step ? "SIGUE AQUÍ" : "EMPIEZA"}</span>` : ""}
            <button class="node ${est} ${p.boss ? "boss" : ""}" data-i="${i}" style="position:relative;left:${offs[i]}px" ${est === "locked" ? "disabled" : ""} aria-label="${p.nombre}">${est === "locked" ? "🔒" : p.emo}</button>
            <span class="node-label" style="position:relative;left:${offs[i]}px">${p.nombre}</span>`;
        }).join("")}
      </div>
      ${MUNDOS.slice(1).map((m) => {
        const abierto = mundoAbierto(m.n), paso = getStep(m.n), f = FLOWS[m.n];
        return `
        <button class="world tap ${abierto ? "" : "locked"}" data-mundo="${m.n}" style="${abierto ? `background:${m.color}` : ""}">
          <span style="font-size:28px">${abierto ? m.emo : "🔒"}</span>
          <div class="grow"><b style="font-size:12px;opacity:.85">MUNDO ${m.n}${mundoHecho(m.n) ? " · COMPLETADO ✓" : ""}</b><h3>${m.nombre}</h3>
          <p style="font-size:13px;opacity:.9">${abierto ? m.tema : `Termina el Mundo ${m.n - 1} para abrirlo`}</p></div><span class="chev">${abierto ? "›" : ""}</span>
        </button>
        ${abierto ? `<div class="path">${f.map((id, i) => {
          const est = mundoHecho(m.n) || i < paso ? "done" : i === paso ? "current" : "locked";
          const off = [0, 50, -30, 30][i % 4];
          return `${est === "current" ? `<span class="start-tag" style="position:relative;left:${off}px">${paso ? "SIGUE AQUÍ" : "EMPIEZA"}</span>` : ""}
            <button class="node ${est}" data-id="${id}" data-m="${m.n}" style="position:relative;left:${off}px" ${est === "locked" ? "disabled" : ""} aria-label="${NOMBRES[id]}">${est === "locked" ? "🔒" : ICONOS[id]}</button>
            <span class="node-label" style="position:relative;left:${off}px">${NOMBRES[id]}</span>`;
        }).join("")}</div>` : ""}`;
      }).join("")}
    </div>
    ${tabs("P07")}`;
  $$(".node", el).forEach((n) => (n.onclick = () => {
    if (n.dataset.id) return n.classList.contains("current") ? continuarMundo(+n.dataset.m) : go(n.dataset.id);
    const i = +n.dataset.i;
    if (i === idxActual) return continuarMundo(1);
    go(PARADAS[i].desde); // repetir una parada ya hecha
  }));
  // lleva la vista al mundo en curso
  const cur = $$(".node.current", el).pop();
  if (cur && mundoActual() > 1) setTimeout(() => cur.scrollIntoView({ block: "center" }), 50);
};

/* ───────────── Mundo 1 ───────────── */

// P08 · Detalle de lección
SCREENS.P08 = (el) => {
  S.leccionXP = 0; save();
  el.innerHTML = `
    ${barra(pasoPct("P08"))}
    <div class="body">
      <span class="eyebrow gold">Mundo 1 · Lección 1</span>
      <h1>Necesidades y deseos</h1>
      <div class="chips"><span class="pill">⏱ 8 min</span><span class="pill">⚡ hasta 300 XP</span><span class="pill">🎮 4 juegos</span></div>
      <div class="row">${pablo("explica", "mid")}<div class="bubble grow">Vale recibió S/ 50. ¿Los gasta todo o no? Ayúdala a decidir.</div></div>
      <div class="card">
        <h3>Vas a aprender a…</h3>
        <div class="stack" style="margin-top:8px">
          <div>✅ Separar lo que necesitas de lo que deseas</div>
          <div>✅ Detectar los trucos de la publicidad</div>
          <div>✅ Ver cuánto suman los gastos pequeños</div>
          <div>✅ Repartir tu plata con un plan</div>
        </div>
      </div>
      <p class="muted">Competencia del CNEB: «Gestiona responsablemente los recursos económicos».</p>
    </div>
    <div class="foot"><button class="btn" id="next">Empezar</button></div>`;
  $("#next", el).onclick = () => siguiente("P08");
};

// P09 · Historia
SCREENS.P09 = (el) => {
  let n = 1;
  el.innerHTML = `
    ${barra(pasoPct("P09"))}
    <div class="body"><span class="eyebrow">Historia</span><div class="chat" id="chat"></div></div>
    <div class="foot"><button class="btn" id="next">Siguiente</button></div>`;
  const chat = $("#chat", el), btn = $("#next", el);
  const pintar = () => {
    chat.innerHTML = HISTORIA.slice(0, n).map((m) =>
      m.narr ? `<div class="msg narr">${m.narr}</div>`
      : `<div class="msg ${m.me ? "me" : ""}">${m.me ? "" : `<div class="who">${m.who}</div>`}${m.txt}</div>`).join("");
    chat.lastElementChild.scrollIntoView({ behavior: "smooth", block: "end" });
    btn.textContent = n >= HISTORIA.length ? "Ayudar a Vale" : "Siguiente";
  };
  btn.onclick = () => {
    if (n < HISTORIA.length) { n++; pintar(); }
    else { addXP(10); siguiente("P09"); }
  };
  pintar();
};

// P10 · Lección interactiva
SCREENS.P10 = (el) => {
  const conceptos = () => {
    el.innerHTML = `
      ${barra(pasoPct("P10"))}
      <div class="body">
        <span class="eyebrow">Aprende</span>
        <h2>¿Necesidad o deseo?</h2>
        <p class="sub">Toca cada tarjeta para ver ejemplos.</p>
        ${LECCION.conceptos.map((c, i) => `
          <button class="card" data-c="${i}" style="text-align:left;border-color:${c.color};box-shadow:0 4px 0 ${c.color}">
            <div class="row"><span style="font-size:34px">${c.emo}</span><div class="grow"><h3 style="color:${c.color}">${c.t}</h3><p>${c.d}</p></div></div>
            <div class="chips ej" style="margin-top:10px" hidden>${c.ej.map((e) => `<span class="pill">${e}</span>`).join("")}</div>
          </button>`).join("")}
      </div>
      <div class="foot"><button class="btn" id="next" disabled>Entendido</button></div>`;
    const vistos = new Set();
    $$("[data-c]", el).forEach((c) => (c.onclick = () => {
      $(".ej", c).hidden = false;
      vistos.add(c.dataset.c);
      if (vistos.size === 2) $("#next", el).disabled = false;
    }));
    $("#next", el).onclick = pregunta;
  };
  const pregunta = () => {
    el.innerHTML = `${barra(pasoPct("P10"))}<div class="body" id="q"></div><div class="foot" id="f"></div>`;
    const q = LECCION.pregunta;
    const btn = quiz($("#q", el), q, (ok) =>
      sheet({
        ok, title: ok ? "¡Bien pensado!" : "Casi, casi…", text: ok ? q.bien : q.mal,
        onNext: () => { addXP(ok ? 20 : 5); siguiente("P10"); },
      }));
    $("#f", el).appendChild(btn);
  };
  conceptos();
};

// P11 · Clasifica
SCREENS.P11 = (el) => {
  let sel = null, errores = 0;
  const quedan = CLASIFICA.map((x, i) => ({ ...x, i }));
  const en = { n: [], d: [] };
  el.innerHTML = `
    ${barra(pasoPct("P11"))}
    <div class="body">
      <span class="eyebrow">Juego · Clasifica</span>
      <h2>Ayuda a Vale a ordenar</h2>
      <p class="sub">Toca una cosa y luego su canasta.</p>
      <div class="items" id="items"></div>
      <div class="grid2">
        <button class="bucket n" data-b="n"><h3>🍚 Necesidad</h3><div class="stack" id="bn" style="gap:6px"></div></button>
        <button class="bucket d" data-b="d"><h3>🎧 Deseo</h3><div class="stack" id="bd" style="gap:6px"></div></button>
      </div>
    </div>`;
  const pintar = () => {
    $("#items", el).innerHTML = quedan.map((x) => `<button class="item ${sel === x.i ? "sel" : ""}" data-i="${x.i}">${x.t}</button>`).join("") || `<p class="muted">¡Todo ordenado!</p>`;
    $("#bn", el).innerHTML = en.n.map((t) => `<span class="item">${t}</span>`).join("");
    $("#bd", el).innerHTML = en.d.map((t) => `<span class="item">${t}</span>`).join("");
    $$(".bucket", el).forEach((b) => b.classList.toggle("ready", sel !== null));
    $$("#items .item", el).forEach((b) => (b.onclick = () => { sel = +b.dataset.i; pintar(); }));
  };
  $$(".bucket", el).forEach((b) => (b.onclick = () => {
    if (sel === null) return toast("Primero toca una cosa de arriba 👆");
    const it = CLASIFICA[sel];
    const esN = b.dataset.b === "n";
    if (it.n === esN) {
      beep(true);
      en[b.dataset.b].push(it.t);
      quedan.splice(quedan.findIndex((x) => x.i === sel), 1);
      sel = null;
      pintar();
      if (!quedan.length) {
        S.juegos++; darInsignia("clasifica");
        sheet({
          ok: true, title: errores ? "¡Lo lograste!" : "¡Perfecto, sin errores!",
          text: errores ? `Te equivocaste ${errores} ${errores === 1 ? "vez" : "veces"}, y está bien: así se aprende.` : "Tienes muy claro qué va primero.",
          onNext: () => { addXP(Math.max(10, 30 - errores * 5)); siguiente("P11"); },
        });
      }
    } else {
      errores++; beep(false);
      const node = $(`#items [data-i="${sel}"]`, el);
      node.classList.add("shake");
      setTimeout(() => node.classList.remove("shake"), 450);
      toast(it.n ? "Mmm… ¿podrías vivir sin eso? 🤔" : "¿Seguro que es imprescindible? 🤔");
    }
  }));
  pintar();
};

// P12 · ¿Lo compro?
SCREENS.P12 = (el) => {
  let i = 0, aciertos = 0;
  const pintar = () => {
    const c = LOCOMPRO[i];
    el.innerHTML = `
      ${barra(pasoPct("P12"))}
      <div class="body">
        <span class="eyebrow">Juego · ¿Lo compro? · ${i + 1} de ${LOCOMPRO.length}</span>
        <div class="card center" style="text-align:center">
          <div style="font-size:56px">${c.emo}</div>
          <h2>${c.t}</h2>
          <div class="big-num" style="color:var(--w4);margin:6px 0">${soles(c.precio)}</div>
          <p class="sub">${c.ctx}</p>
        </div>
        <div class="card soft">
          <b>Antes de decidir, pregúntate:</b>
          <div class="stack" style="margin-top:8px;gap:6px">
            <div>1️⃣ ¿Lo necesito o lo deseo?</div>
            <div>2️⃣ ¿Puede esperar?</div>
            <div>3️⃣ ¿Me alcanza sin dejar de pagar lo importante?</div>
          </div>
        </div>
      </div>
      <div class="foot"><div class="grid2">
        <button class="btn navy" data-r="esperar">⏳ Esperar</button>
        <button class="btn green" data-r="comprar">✅ Comprar</button>
      </div></div>`;
    $$("[data-r]", el).forEach((b) => (b.onclick = () => {
      const ok = b.dataset.r === c.ok;
      if (ok) aciertos++;
      sheet({
        ok, title: ok ? "¡Buena decisión!" : "Piénsalo otra vez", text: c.porque,
        onNext: () => {
          if (ok) addXP(10);
          i++;
          if (i < LOCOMPRO.length) pintar(); else { S.juegos++; save(); siguiente("P12"); }
        },
      });
    }));
  };
  pintar();
};

// P13 · Caza la publicidad (deslizar)
SCREENS.P13 = (el) => {
  let i = 0, aciertos = 0;
  el.innerHTML = `
    ${barra(pasoPct("P13"))}
    <div class="body">
      <span class="eyebrow">Juego · Caza la publicidad</span>
      <h2>¿Trampa o info útil?</h2>
      <p class="sub">Desliza a la izquierda si es una trampa y a la derecha si te sirve para decidir.</p>
      <div class="deck" id="deck"></div>
      <div class="row between muted"><span>← Trampa</span><span id="cnt"></span><span>Info útil →</span></div>
      <div class="circle-btns"><button class="circle no" id="no" aria-label="Trampa">✕</button><button class="circle yes" id="si" aria-label="Info útil">✓</button></div>
    </div>`;
  const deck = $("#deck", el);
  const pintar = () => {
    $("#cnt", el).textContent = `${i + 1} de ${ANUNCIOS.length}`;
    deck.innerHTML = ANUNCIOS.slice(i, i + 2).reverse().map((a, k, arr) => `
      <div class="swipe ${k === 0 && arr.length > 1 ? "behind" : ""}">
        <span class="stamp l">TRAMPA</span><span class="stamp r">ÚTIL</span>
        <span style="font-size:13px;font-weight:700;color:var(--muted)">ANUNCIO</span>
        <div class="ad">${a.ad}</div>
      </div>`).join("");
    arrastre(deck.lastElementChild);
  };
  const responder = (trampa) => {
    const a = ANUNCIOS[i];
    const card = deck.lastElementChild;
    card.style.transition = "transform .35s, opacity .35s";
    card.style.transform = `translateX(${trampa ? -500 : 500}px) rotate(${trampa ? -25 : 25}deg)`;
    card.style.opacity = 0;
    const ok = a.trampa === trampa;
    if (ok) aciertos++;
    setTimeout(() => sheet({
      ok, title: ok ? (trampa ? "¡Trampa cazada! 🕵️" : "¡Bien leído!") : (a.trampa ? "Era una trampa" : "Esta sí era útil"),
      text: a.porque,
      onNext: () => {
        if (ok) addXP(10);
        i++;
        if (i < ANUNCIOS.length) pintar();
        else {
          S.juegos++; if (aciertos >= 4) darInsignia("detective"); save();
          sheet({ ok: true, title: `Cazaste ${aciertos} de ${ANUNCIOS.length}`, text: "Ahora ves los trucos que antes pasaban desapercibidos.", onNext: () => siguiente("P13") });
        }
      },
    }), 250);
  };
  function arrastre(card) {
    let x0 = null, dx = 0;
    card.onpointerdown = (e) => { x0 = e.clientX; card.setPointerCapture(e.pointerId); card.style.transition = "none"; };
    card.onpointermove = (e) => {
      if (x0 === null) return;
      dx = e.clientX - x0;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
      $(".stamp.l", card).style.opacity = Math.min(1, Math.max(0, -dx / 90));
      $(".stamp.r", card).style.opacity = Math.min(1, Math.max(0, dx / 90));
    };
    card.onpointerup = card.onpointercancel = () => {
      if (x0 === null) return;
      x0 = null;
      if (Math.abs(dx) > 90) responder(dx < 0);
      else { card.style.transition = "transform .25s"; card.style.transform = ""; $$(".stamp", card).forEach((s) => (s.style.opacity = 0)); }
      dx = 0;
    };
  }
  $("#no", el).onclick = () => responder(true);
  $("#si", el).onclick = () => responder(false);
  pintar();
};

// P14 · Gasto hormiga
SCREENS.P14 = (el) => {
  let a = 0, veces = 5, toco = false;
  el.innerHTML = `
    ${barra(pasoPct("P14"))}
    <div class="body">
      <span class="eyebrow">Juego · Gasto hormiga</span>
      <h2>Los gastos chiquitos también suman</h2>
      <div><span class="lbl">Elige un antojo</span><div class="chips" id="ant"></div></div>
      <div><span class="lbl">¿Cuántas veces por semana? <b id="vv"></b></span>
        <input type="range" id="veces" min="1" max="7" value="5" aria-label="Veces por semana" /></div>
      <div class="card center" style="text-align:center">
        <p class="muted">En un mes gastas</p><div class="big-num" id="mes"></div>
        <p class="muted" style="margin-top:10px">En un año</p><div class="big-num" id="anio" style="color:var(--w4)"></div>
      </div>
      <div class="card warn row"><span style="font-size:32px" id="eqe"></span><p class="grow" id="eq"></p></div>
    </div>
    <div class="foot"><button class="btn" id="next" disabled>¡Ya entendí!</button></div>`;
  const calc = () => {
    const x = ANTOJOS[a];
    const mes = x.precio * veces * 4, anio = x.precio * veces * 52;
    $("#ant", el).innerHTML = ANTOJOS.map((o, k) => `<button class="chip ${k === a ? "sel" : ""}" data-k="${k}">${o.emo} ${o.t} · ${soles(o.precio)}</button>`).join("");
    $$("#ant .chip", el).forEach((c) => (c.onclick = () => { a = +c.dataset.k; toco = true; calc(); }));
    $("#vv", el).textContent = veces;
    $("#mes", el).textContent = soles(mes);
    $("#anio", el).textContent = soles(anio);
    const eq = [...EQUIVALENCIAS].reverse().find((e) => anio >= e.min);
    $("#eqe", el).textContent = eq.emo;
    $("#eq", el).innerHTML = `Con lo que gastas en ${x.t.toLowerCase()} en un año podrías comprar <b>${eq.t}</b>.`;
    $("#next", el).disabled = !toco;
  };
  $("#veces", el).oninput = (e) => { veces = +e.target.value; toco = true; calc(); };
  $("#next", el).onclick = () => { S.juegos++; darInsignia("hormiga"); addXP(20); siguiente("P14"); };
  calc();
};

// P16 · Simulación S/ 100
SCREENS.P16 = (el) => {
  const v = Object.fromEntries(SIMULACION.map((s) => [s.id, s.ini]));
  const total = () => Object.values(v).reduce((a, b) => a + b, 0);
  el.innerHTML = `
    ${barra(pasoPct("P16"))}
    <div class="body">
      <span class="eyebrow">Simulación</span>
      <h2>Tu tía te regala S/ 100 por tu cumpleaños 🎂</h2>
      <p class="sub">Repártelos como tú quieras. No hay una sola respuesta correcta.</p>
      <div class="card stack alloc" style="gap:14px">
        ${SIMULACION.map((s) => `
          <div><div class="row between"><span>${s.emo} ${s.t}</span><b id="v-${s.id}">S/ 0</b></div>
          <input type="range" min="0" max="100" step="5" value="0" data-id="${s.id}" aria-label="${s.t}" /></div>`).join("")}
      </div>
      <div class="card soft row between"><span>Te quedan por repartir</span><b class="big-num" style="font-size:26px" id="resta">S/ 100</b></div>
    </div>
    <div class="foot"><button class="btn" id="next" disabled>Listo</button></div>`;
  $$("input[type=range]", el).forEach((r) => (r.oninput = () => {
    const id = r.dataset.id;
    const otros = total() - v[id];
    v[id] = Math.min(+r.value, 100 - otros);
    r.value = v[id];
    $(`#v-${id}`, el).textContent = soles(v[id]);
    const resta = 100 - total();
    $("#resta", el).textContent = soles(resta);
    $("#resta", el).style.color = resta ? "var(--text)" : "var(--ok)";
    $("#next", el).disabled = resta !== 0;
  }));
  $("#next", el).onclick = () => {
    const ah = v.ahorro;
    if (ah >= 20) {
      sheet({ ok: true, title: "¡Te pagaste primero! 🐷", text: `Guardaste ${soles(ah)}. Ahorrar al inicio, y no «lo que sobre», es el truco de la gente que llega a sus metas.`, onNext: () => { addXP(30); siguiente("P16"); } });
    } else {
      sheet({
        ok: false, title: ah ? "Vas bien, pero puedes más" : "¿Y tu yo del futuro?",
        text: `Ahorraste ${soles(ah)}. Prueba separar al menos S/ 20 antes de gastar: así tienes plata para algo grande o para una emergencia.`,
        btn: "Probar de nuevo", alt: "Seguir con mi reparto",
        onNext: () => {}, onAlt: () => { addXP(10); siguiente("P16"); },
      });
    }
  };
};

// P17 · Lo que aprendiste
SCREENS.P17 = (el) => {
  el.innerHTML = `
    ${barra(pasoPct("P17"))}
    <div class="body">
      <div class="row">${pablo("celebra", "mid pop")}<div class="grow"><span class="eyebrow ok">Resumen</span><h2 style="margin-top:8px">Lo que aprendiste hoy</h2></div></div>
      <div class="card stack">${APRENDISTE.map((t) => `<div class="row" style="align-items:flex-start"><span>✅</span><p>${t}</p></div>`).join("")}</div>
      <div class="grid2">
        <div class="card center" style="text-align:center"><p class="muted">XP de esta lección</p><h2 style="color:var(--gold)">⚡ ${S.leccionXP}</h2></div>
        <div class="card center" style="text-align:center"><p class="muted">Racha</p><h2>🔥 ${S.racha.count}</h2></div>
      </div>
    </div>
    <div class="foot"><button class="btn" id="next">Continuar</button></div>`;
  $("#next", el).onclick = () => siguiente("P17");
};

// P18 · Reto de la vida real
SCREENS.P18 = (el) => {
  el.innerHTML = `
    ${barra(pasoPct("P18"))}
    <div class="body">
      <span class="eyebrow gold">Reto de la vida real</span>
      <h2>Ahora te toca a ti</h2>
      <div class="row">${pablo("anota", "mid")}<div class="bubble grow">Durante 3 días, anota 3 cosas que compres y marca si fue necesidad o deseo.</div></div>
      <div class="card warn"><b>🏅 Premio:</b> +40 XP y la insignia «Reto real».</div>
      <div class="card info row" style="align-items:flex-start"><span style="font-size:22px">🔒</span>
        <p>Solo anotas <b>tus</b> compras. Nunca te pedimos cuánto gana tu familia, sus deudas ni sus cuentas.</p></div>
    </div>
    <div class="foot"><button class="btn" id="next">Acepto el reto</button><button class="link" data-go="P05">Más tarde</button></div>`;
  $("#next", el).onclick = () => { addXP(10); siguiente("P18"); };
};

// P19 · Registro
SCREENS.P19 = (el) => {
  let tipo = null;
  el.innerHTML = `
    ${barra(pasoPct("P19"))}
    <div class="body">
      <div class="row between"><span class="eyebrow gold">Reto · Registro</span><b id="cnt"></b></div>
      <h2>¿Qué compraste?</h2>
      <div class="chips" id="ej">${EJEMPLOS_REGISTRO.map((e, k) => `<button class="chip" data-k="${k}">${e.t}</button>`).join("")}</div>
      <div class="grid2">
        <div><label class="lbl" for="qt">Qué fue</label><input id="qt" type="text" maxlength="30" placeholder="Ej.: pasaje" /></div>
        <div><label class="lbl" for="qm">Cuánto (S/)</label><input id="qm" type="number" min="0" step="0.5" inputmode="decimal" placeholder="0.00" /></div>
      </div>
      <div class="grid2">
        <button class="option" data-t="n"><span class="emo">🍚</span>Necesidad</button>
        <button class="option" data-t="d"><span class="emo">🎧</span>Deseo</button>
      </div>
      <button class="btn navy" id="add" disabled>Anotar</button>
      <div class="card" id="lista"></div>
      <p class="muted">En el colegio tienes 3 días. Aquí puedes probarlo de una vez.</p>
    </div>
    <div class="foot"><button class="btn" id="next">Ver mis resultados</button></div>`;
  const qt = $("#qt", el), qm = $("#qm", el), add = $("#add", el);
  const valida = () => (add.disabled = !(qt.value.trim() && +qm.value > 0 && tipo));
  const pintar = () => {
    $("#cnt", el).textContent = `${Math.min(S.registros.length, 3)} de 3`;
    $("#lista", el).innerHTML = S.registros.length
      ? S.registros.map((r, k) => `<div class="list-row"><span class="grow">${esc(r.t)}</span><span class="tag ${r.n ? "n" : "d"}">${r.n ? "Necesidad" : "Deseo"}</span><b>${soles(r.monto)}</b><button class="icon-btn" data-del="${k}" aria-label="Borrar">✕</button></div>`).join("")
      : `<p class="muted" style="text-align:center">Todavía no anotas nada.</p>`;
    $$("[data-del]", el).forEach((b) => (b.onclick = () => { S.registros.splice(+b.dataset.del, 1); save(); pintar(); }));
    $("#next", el).disabled = S.registros.length < 3;
  };
  [qt, qm].forEach((i) => (i.oninput = valida));
  $$("[data-t]", el).forEach((b) => (b.onclick = () => {
    tipo = b.dataset.t;
    $$("[data-t]", el).forEach((x) => x.classList.toggle("sel", x === b));
    valida();
  }));
  $$("#ej .chip", el).forEach((c) => (c.onclick = () => {
    const e = EJEMPLOS_REGISTRO[+c.dataset.k];
    qt.value = e.t; qm.value = e.monto; tipo = null;
    $$("[data-t]", el).forEach((x) => x.classList.remove("sel"));
    valida();
    toast("Ahora marca: ¿necesidad o deseo?");
  }));
  add.onclick = () => {
    S.registros.push({ t: qt.value.trim(), monto: +qm.value, n: tipo === "n" });
    save(); beep(true);
    qt.value = ""; qm.value = ""; tipo = null;
    $$("[data-t]", el).forEach((x) => x.classList.remove("sel"));
    valida(); pintar();
    if (S.registros.length === 3) toast("¡Reto cumplido! 🎉");
  };
  $("#next", el).onclick = () => siguiente("P19");
  pintar();
};

// P20 · Resultados del reto
SCREENS.P20 = (el) => {
  const n = S.registros.filter((r) => r.n).reduce((a, r) => a + r.monto, 0);
  const d = S.registros.filter((r) => !r.n).reduce((a, r) => a + r.monto, 0);
  const max = Math.max(n, d, 1);
  const pctD = n + d ? Math.round((d / (n + d)) * 100) : 0;
  el.innerHTML = `
    ${barra(pasoPct("P20"))}
    <div class="body">
      <span class="eyebrow gold">Resultados del reto</span>
      <h2>Así gastaste</h2>
      <div class="card">
        <div class="vbars" style="margin-top:26px">
          <div style="text-align:center"><div class="vbar" style="height:4px;background:var(--ok)" data-h="${(n / max) * 140}"><span>${soles(n)}</span></div><b style="display:block;margin-top:8px">🍚 Necesidad</b></div>
          <div style="text-align:center"><div class="vbar" style="height:4px;background:var(--w4)" data-h="${(d / max) * 140}"><span>${soles(d)}</span></div><b style="display:block;margin-top:8px">🎧 Deseo</b></div>
        </div>
      </div>
      <div class="row">${pablo(pctD > 50 ? "explica" : "celebra", "sm")}
        <div class="bubble grow">${pctD > 50
          ? `El ${pctD} % fue en deseos. ¡No está mal darse gustos! Solo cuida que no se coman tu pasaje.`
          : `Solo el ${pctD} % fue en deseos. ¡Primero lo importante! Así se hace.`}</div></div>
    </div>
    <div class="foot"><button class="btn" id="next">Continuar</button></div>`;
  requestAnimationFrame(() => setTimeout(() => $$(".vbar", el).forEach((b) => (b.style.height = b.dataset.h + "px")), 60));
  $("#next", el).onclick = () => { darInsignia("reto"); addXP(40); siguiente("P20"); };
};

// P21 · Jefe: intro
SCREENS.P21 = (el) => {
  el.classList.add("dark");
  el.innerHTML = `
    ${barra(pasoPct("P21"))}
    <div class="body center">
      <span class="eyebrow">Jefe del Mundo 1</span>
      <div style="font-size:96px" class="float">🧑‍💼</div>
      <h1>${JEFE.nombre}</h1>
      <p class="sub">Va a intentar que gastes en lo que no necesitas. Respóndele bien para vencerlo.</p>
      <div class="boss-card" style="width:100%">
        <div class="row between"><span>Tus vidas</span><span class="hearts">${"❤️".repeat(JEFE.vidas)}</span></div>
        <div class="row between" style="margin-top:8px"><span>Rondas</span><b>${JEFE.rondas.length}</b></div>
        <div class="row between" style="margin-top:8px"><span>Premio</span><b>+100 XP y 👑</b></div>
      </div>
    </div>
    <div class="foot"><button class="btn" id="next">¡A pelear!</button><button class="link" data-go="P07" style="color:#B9B6E0">Todavía no</button></div>`;
  $("#next", el).onclick = () => siguiente("P21");
};

// P22 · Jefe: rondas
SCREENS.P22 = (el) => {
  el.classList.add("dark");
  const preguntas = JEFE.rondas.flatMap((r, ri) => r.map((q) => ({ ...q, ri })));
  let i = 0, vidas = JEFE.vidas, aciertos = 0;
  const frases = ["¡Esta oferta no se repite!", "¡Vamos, cómpralo ya!", "¡Te lo dejo baratito!", "¡Todos lo están llevando!", "¡Última oportunidad!"];
  const pintar = () => {
    const q = preguntas[i];
    const hp = 100 - (aciertos / preguntas.length) * 100;
    el.innerHTML = `
      ${barra(pasoPct("P22"), { close: "P07" })}
      <div class="body">
        <div class="row between"><span class="eyebrow">Ronda ${q.ri + 1} de ${JEFE.rondas.length}</span><span class="hearts">${"❤️".repeat(vidas)}${"🖤".repeat(JEFE.vidas - vidas)}</span></div>
        <div class="boss-card row">
          <span style="font-size:44px">${q.ri ? "😤" : "🧑‍💼"}</span>
          <div class="grow"><b>${JEFE.nombre}</b><div class="hp" style="margin-top:6px"><i style="width:${hp}%"></i></div>
          <p class="muted" style="margin-top:6px">«${frases[i % frases.length]}»</p></div>
        </div>
        <div id="q" class="stack" style="gap:14px"></div>
      </div>
      <div class="foot" id="f"></div>`;
    const btn = quiz($("#q", el), q, (ok) => {
      if (ok) aciertos++; else vidas--;
      if (vidas === 0) {
        return sheet({ ok: false, title: "¡Casi lo vences!", text: "El vendedor ganó esta vez. Repasa y vuelve: cada intento te hace más fuerte.", btn: "Reintentar", alt: "Volver al mapa", onNext: () => go("P22"), onAlt: () => go("P07") });
      }
      sheet({
        ok, title: ok ? "¡Golpe certero! 💥" : "¡Te tentó! Pierdes una vida",
        text: ok ? "El vendedor pierde fuerza." : `La respuesta era: «${q.opts[q.ok]}».`,
        onNext: () => {
          i++;
          if (i === preguntas.length) {
            S.jefe = { aciertos, total: preguntas.length };
            save();
            return siguiente("P22");
          }
          if (preguntas[i].ri !== q.ri) {
            sheet({ ok: true, title: `¡Ronda ${preguntas[i].ri + 1}!`, text: "El vendedor se enoja y sube la presión. 😤", btn: "¡Vamos!", onNext: pintar });
          } else pintar();
        },
      });
    });
    $("#f", el).appendChild(btn);
  };
  pintar();
};

// P23 · Jefe superado
SCREENS.P23 = (el) => {
  el.classList.add("dark");
  el.innerHTML = `
    <div class="body center">
      ${pablo("celebra", "big pop")}
      <span class="eyebrow">¡Jefe vencido!</span>
      <h1>Venciste al ${JEFE.nombre}</h1>
      <p class="sub">${S.jefe ? `Acertaste ${S.jefe.aciertos} de ${S.jefe.total}.` : ""} Ya no te convence cualquier oferta.</p>
      <div class="boss-card row" style="width:100%"><span style="font-size:40px">👑</span><div class="grow" style="text-align:left"><b>Nueva insignia</b><p class="sub">Venciste al Vendedor</p></div><b style="color:var(--brand)">+100 XP</b></div>
    </div>
    <div class="foot"><button class="btn" id="next">Continuar</button></div>`;
  confeti();
  $("#next", el).onclick = () => { darInsignia("jefe"); addXP(100); siguiente("P23"); };
};

// P24 · Subiste de nivel
SCREENS.P24 = (el) => {
  el.classList.add("green");
  el.innerHTML = `
    <div class="body center">
      <div class="pop" style="width:150px;height:150px;border-radius:50%;background:#fff;color:var(--ok);display:grid;place-items:center;font:800 64px var(--font-title);box-shadow:0 8px 0 #148A53">${nivel()}</div>
      <h1>¡Subiste al nivel ${nivel()}!</h1>
      <p style="opacity:.9">Tienes ⚡ ${S.xp} XP y terminaste el Mundo 1.</p>
      ${pablo("celebra", "mid float")}
    </div>
    <div class="foot"><button class="btn" id="next">Ver mi avance</button></div>`;
  confeti();
  $("#next", el).onclick = () => siguiente("P24");
};

// P25 · Tu avance (antes vs. ahora)
SCREENS.P25 = (el) => {
  S.done1 = true; save();
  const antes = S.examen ? Math.round((S.examen.score / S.examen.total) * 100) : 0;
  const ahora = S.jefe ? Math.round((S.jefe.aciertos / S.jefe.total) * 100) : 0;
  el.innerHTML = `
    <div class="body">
      <span class="eyebrow ok">Mundo 1 completado</span>
      <h2>Tu avance</h2>
      <div class="card">
        <p class="muted">Respuestas correctas: examen inicial vs. jefe final</p>
        <div class="vbars" style="margin-top:30px">
          <div style="text-align:center"><div class="vbar" style="height:4px;background:var(--locked)" data-h="${Math.max(antes, 4) * 1.4}"><span>${antes}%</span></div><b style="display:block;margin-top:8px">Antes</b></div>
          <div style="text-align:center"><div class="vbar" style="height:4px;background:var(--ok)" data-h="${Math.max(ahora, 4) * 1.4}"><span>${ahora}%</span></div><b style="display:block;margin-top:8px">Ahora</b></div>
        </div>
      </div>
      <div class="row">${pablo("celebra", "sm")}<div class="bubble grow">${ahora > antes ? `¡Mejoraste ${ahora - antes} puntos! Eso es aprender de verdad.` : ahora === 100 ? "¡Perfecto de principio a fin!" : "¡Lo lograste! Repite los juegos cuando quieras para afinar."}</div></div>
      <h3>Tus insignias</h3>
      ${insigniasHTML()}
      <button class="world tap" data-go="P26" style="background:var(--w2)"><span style="font-size:30px">🐷</span><div class="grow"><b style="font-size:12px">DESBLOQUEADO</b><h3>Mundo 2 · El poder del ahorro</h3><p style="font-size:13px">Metas, alcancía y una misión de 7 días.</p></div><span class="chev">›</span></button>
    </div>
    <div class="foot"><button class="btn" data-go="P26">Ir al Mundo 2</button><button class="link" data-go="P07">Volver al mapa</button></div>`;
  requestAnimationFrame(() => setTimeout(() => $$(".vbar", el).forEach((b) => (b.style.height = b.dataset.h + "px")), 60));
};
