// Pablo Enseña · En el salón (D01–D07), índice de pantallas y arranque

const DOCENTE = ["D01", "D02", "D03", "D04", "D05", "D06", "D07"];
// Alumnos ficticios para la demo
const ALUMNOS = [
  { n: "Ana C.", m: 6, xp: 1240, niv: { cant: "AD", rec: "AD" } },
  { n: "Bruno T.", m: 4, xp: 860, niv: { cant: "A", rec: "A" } },
  { n: "Camila R.", m: 5, xp: 990, niv: { cant: "A", rec: "AD" } },
  { n: "Diego P.", m: 2, xp: 310, niv: { cant: "B", rec: "B" } },
  { n: "Elena M.", m: 3, xp: 540, niv: { cant: "A", rec: "B" } },
  { n: "Franco L.", m: 1, xp: 120, niv: { cant: "C", rec: "B" } },
  { n: "Gabriela S.", m: 4, xp: 780, niv: { cant: "A", rec: "A" } },
  { n: "Hugo V.", m: 2, xp: 260, niv: { cant: "B", rec: "C" } },
];
const NIVEL_TXT = { AD: "Logro destacado", A: "Logro esperado", B: "En proceso", C: "En inicio" };

function barraDocente(id) {
  const i = DOCENTE.indexOf(id);
  return `<div class="top">
    <button class="icon-btn" data-go="${i ? DOCENTE[i - 1] : "P01"}" aria-label="Volver">←</button>
    <div class="grow"><b style="font-size:12px;color:var(--info);letter-spacing:.05em">MODO DOCENTE · ${id}</b>
      <div class="row" style="gap:4px;margin-top:4px">${DOCENTE.map((_, k) => `<span style="flex:1;height:5px;border-radius:9px;background:${k <= i ? "var(--info)" : "var(--locked-bg)"}"></span>`).join("")}</div></div>
    <button class="icon-btn" data-go="P01" aria-label="Salir">✕</button>
  </div>`;
}
document.addEventListener("click", (e) => { const b = e.target.closest("[data-filtro]"); if (b) window._filtroD07 = b.dataset.filtro; }, true);
const sigDocente = (id) => DOCENTE[DOCENTE.indexOf(id) + 1] || "D01";

// D01 · Aliado
SCREENS.D01 = (el) => {
  el.innerHTML = `
    ${barraDocente("D01")}
    <div class="body">
      <span class="eyebrow">Para colegios</span>
      <h1>Pablo Enseña llega gratis a tu salón</h1>
      <div class="row">${pablo("saluda", "sm")}<div class="bubble grow">Un aliado paga las licencias. Tú y tus alumnos no pagan nada.</div></div>
      <div class="card stack">
        <b>Tu colegio recibe</b>
        <div>✅ Licencias para todos los alumnos de 1.º a 5.º</div>
        <div>✅ Sesiones listas para proyectar (90 min)</div>
        <div>✅ Evaluación con la escala del CNEB (AD, A, B, C)</div>
        <div>✅ Capacitación para docentes</div>
      </div>
      <div class="card info stack">
        <b>🔒 Lo que el aliado nunca hace</b>
        <div>No ve datos de tus alumnos.</div>
        <div>No les vende productos ni pone publicidad.</div>
        <div>Solo recibe reportes de cuántos colegios y alumnos participan.</div>
      </div>
      <p class="muted">Inspirado en programas de EE. UU. donde una empresa financia la educación financiera en colegios públicos.</p>
    </div>
    <div class="foot"><button class="btn" data-go="D02">Entrar a mi panel</button></div>`;
};

// D02 · Panel docente
SCREENS.D02 = (el) => {
  const prom = Math.round(ALUMNOS.reduce((a, x) => a + x.m, 0) / ALUMNOS.length * 10) / 10;
  el.innerHTML = `
    ${barraDocente("D02")}
    <div class="body">
      <div class="row between"><div><p class="muted">Prof. de DPCC</p><h2>3.º B · ${ALUMNOS.length * 4} alumnos</h2></div><span class="pill">I. E. 6054</span></div>
      <div class="grid2">
        <button class="card tapcard" data-go="D07"><p class="muted">Mundo promedio</p><h2>${prom}</h2></button>
        <button class="card tapcard" data-go="D05"><p class="muted">Activos esta semana</p><h2>87 %</h2></button>
      </div>
      <button class="card warn row tapcard" data-go="D07" data-filtro="pausa"><span style="font-size:24px">⚠️</span><p class="grow" style="text-align:left"><b>${ALUMNOS.filter((a) => a.m <= 2).length} alumnos</b> no avanzan hace 7 días. <b style="color:var(--info)">Ver quiénes</b></p><span class="chev">›</span></button>
      <h3>Actividades para la clase</h3>
      <div class="stack">
        <button class="option" data-go="D03"><span class="emo">🏙️</span><span class="grow"><b>Ciudad Pablo</b><br/><small class="muted">Simulación de 90 min · inspirada en Finlandia</small></span>›</button>
        <button class="option" data-go="D04"><span class="emo">🔐</span><span class="grow"><b>Escape room financiero</b><br/><small class="muted">45 min en equipos · inspirado en Canadá</small></span>›</button>
        <button class="option" data-go="D05"><span class="emo">🏆</span><span class="grow"><b>Liga del salón</b><br/><small class="muted">Competencia semanal por equipos</small></span>›</button>
        <button class="option" data-go="D06"><span class="emo">🥇</span><span class="grow"><b>Copa Pablo</b><br/><small class="muted">Torneo entre colegios</small></span>›</button>
        <button class="option" data-go="D07"><span class="emo">📋</span><span class="grow"><b>Evaluación del salón</b><br/><small class="muted">AD · A · B · C por competencia</small></span>›</button>
      </div>
    </div>
    <div class="foot"><button class="btn" data-go="D03">Siguiente</button></div>`;
};

// D03 · Ciudad Pablo
SCREENS.D03 = (el) => {
  const sueldo = 120;
  let ronda = 0, plata = 0, ahorro = 0, deuda = 0;
  const RONDAS = [
    { t: "Cobra tu sueldo y paga tus impuestos", txt: `Tu sueldo de práctica es ${soles(sueldo)}. El 10 % va a impuestos para la ciudad.`, ops: [{ t: "💵 Cobrar y pagar S/ 12", f: () => (plata = sueldo - 12) }] },
    { t: "Paga alquiler, comida y pasaje", txt: "Elige cómo vivir esta semana.", ops: [
      { t: "🏠 Cuarto compartido + menú (S/ 60)", f: () => (plata -= 60) },
      { t: "🏢 Cuarto solo + delivery (S/ 95)", f: () => (plata -= 95) }] },
    { t: "Imprevisto: se rompió tu celular", txt: "Arreglarlo cuesta S/ 40.", ops: [
      { t: "🐷 Uso mis ahorros", f: () => { ahorro = plata; plata -= 40; } },
      { t: "🏦 Pido préstamo al banco (devuelves S/ 48)", f: () => { deuda = 48; } }] },
    { t: "Cierre del día", txt: "¿Cuánto te quedó?", ops: [] },
  ];
  const pintar = () => {
    const r = RONDAS[ronda];
    el.innerHTML = `
      ${barraDocente("D03")}
      <div class="body">
        <span class="eyebrow">En clase · Inspirado en Finlandia 🇫🇮</span>
        <h2>Hoy trabajas en Ciudad Pablo</h2>
        <div class="card row">${pablo("senala", "sm")}<div class="grow"><b>Tu puesto: cajero/a de la bodega</b>
          <p style="color:var(--ok);font:700 18px var(--font-title)">Sueldo de práctica: ${soles(sueldo)}</p>
          <p class="muted">Tus compañeros son el banco, la municipalidad, el mercado y la tienda de celulares.</p></div></div>
        <div class="row between card soft"><span>Tu plata</span><b class="big-num" style="font-size:26px">${soles(plata)}</b>${deuda ? `<span class="tag d">Deuda ${soles(deuda)}</span>` : ""}</div>
        ${RONDAS.map((x, k) => `<div class="card row" style="${k === ronda ? "border-color:var(--brand)" : ""}"><span>${k < ronda ? "✔️" : k === ronda ? "▶️" : "🔒"}</span><div class="grow"><b>Ronda ${k + 1}</b><p class="sub">${x.t}</p></div></div>`).join("")}
        ${ronda < 3 ? `<div class="card warn"><b>${r.t}</b><p>${r.txt}</p><div class="stack" style="margin-top:10px">${r.ops.map((o, k) => `<button class="option" data-o="${k}">${o.t}</button>`).join("")}</div></div>`
        : `<div class="card ok"><b>Cierre</b><p>Te quedaron <b>${soles(plata)}</b>${deuda ? ` y debes <b>${soles(deuda)}</b> al banco` : ""}. ${plata - deuda >= 20 ? "¡Buen día en la ciudad!" : "Fue un día ajustado: ¿qué cambiarías mañana?"}</p></div>`}
        <p class="muted">El docente proyecta la ciudad; cada alumno juega desde su celular. Dura una clase de 90 minutos.</p>
      </div>
      <div class="foot"><button class="btn" data-go="D04" ${ronda < 3 ? "hidden" : ""}>Siguiente</button></div>`;
    $$("[data-o]", el).forEach((b) => (b.onclick = () => { r.ops[+b.dataset.o].f(); beep(true); ronda++; pintar(); }));
  };
  pintar();
};

// D04 · Escape room
SCREENS.D04 = (el) => {
  const CANDADOS = [
    { q: "Ahorras S/ 5 cada semana. ¿Cuánto tienes en 8 semanas?", a: 40 },
    { q: "Celular: S/ 600 al contado o 12 cuotas de S/ 65. ¿Cuántos soles pagas de más en cuotas?", a: 180 },
    { q: "Pagaste S/ 118 con IGV de 18 %. ¿Cuántos soles fueron de IGV?", a: 18 },
  ];
  let abiertos = 0, seg = 10 * 60;
  el.innerHTML = `
    ${barraDocente("D04")}
    <div class="body">
      <span class="eyebrow">En clase · Inspirado en Canadá 🇨🇦</span>
      <div class="row between"><h2>Escape room: la bóveda</h2><b class="pill" id="reloj">10:00</b></div>
      <p class="sub">En equipos: resuelvan los 3 candados para abrir la bóveda antes de que acabe el tiempo.</p>
      <div class="stack" id="cands"></div>
    </div>
    <div class="foot" id="f"></div>`;
  const reloj = setInterval(() => {
    if (!document.body.contains(el)) return clearInterval(reloj);
    seg = Math.max(0, seg - 1);
    $("#reloj", el).textContent = `${String(Math.floor(seg / 60)).padStart(2, "0")}:${String(seg % 60).padStart(2, "0")}`;
  }, 1000);
  const pintar = () => {
    $("#cands", el).innerHTML = CANDADOS.map((c, k) => `
      <div class="card ${k < abiertos ? "ok" : ""}" style="${k > abiertos ? "opacity:.5" : ""}">
        <div class="row"><span style="font-size:28px">${k < abiertos ? "🔓" : "🔒"}</span><b class="grow">Candado ${k + 1}</b></div>
        ${k <= abiertos ? `<p style="margin:8px 0">${c.q}</p>` : ""}
        ${k === abiertos ? `<div class="row"><input type="number" inputmode="numeric" id="cod" placeholder="Código" aria-label="Código" /><button class="btn small navy" id="probar">Probar</button></div>` : ""}
      </div>`).join("");
    const p = $("#probar", el);
    if (p) {
      const intento = () => {
        const v = +$("#cod", el).value;
        if (v === CANDADOS[abiertos].a) { beep(true); abiertos++; pintar(); if (abiertos === 3) ganar(); }
        else { beep(false); toast("Código incorrecto 🔒"); $("#cod", el).classList.add("shake"); setTimeout(() => $("#cod", el)?.classList.remove("shake"), 400); }
      };
      p.onclick = intento;
      $("#cod", el).onkeydown = (e) => e.key === "Enter" && intento();
    }
  };
  const ganar = () => {
    clearInterval(reloj);
    confeti();
    $("#f", el).innerHTML = `<div class="card ok" style="text-align:center"><div style="font-size:48px">💰</div><b>¡Abrieron la bóveda!</b></div><button class="btn" data-go="D05">Siguiente</button>`;
  };
  $("#f", el).innerHTML = `<button class="link" data-go="D05">Saltar actividad</button>`;
  pintar();
};

// D05 · Liga del salón
SCREENS.D05 = (el) => {
  const EQ = [
    { t: "Los Ahorradores", emo: "🐷", xp: 2840 },
    { t: "Team Sol", emo: "☀️", xp: 2610, yo: true },
    { t: "Las Alcancías", emo: "🏺", xp: 2230 },
    { t: "Los Cuyes Financieros", emo: "🐹", xp: 1980 },
    { t: "Inversionistas Pro", emo: "📈", xp: 1720 },
    { t: "Los Sin Deudas", emo: "🛡️", xp: 1450 },
  ];
  el.innerHTML = `
    ${barraDocente("D05")}
    <div class="body">
      <span class="eyebrow">Liga semanal · Inspirado en Australia 🇦🇺</span>
      <h2>Liga del salón · 3.º B</h2>
      <p class="sub">Los equipos suman el XP de sus integrantes. El lunes se reinicia.</p>
      <div class="card row between" style="background:var(--navy);color:#fff;border:0"><span>Quedan</span><b>2 días 6 h</b></div>
      <div class="card stack" style="gap:0">${EQ.map((e, k) => `
        <button class="list-row tap-row" data-eq="${k}" style="${e.yo ? "background:var(--info-bg);margin:0 -16px;padding:10px 16px;width:calc(100% + 32px)" : ""}">
          <b style="width:24px">${["🥇", "🥈", "🥉"][k] || k + 1}</b><span style="font-size:22px">${e.emo}</span>
          <span class="grow"><b>${e.t}</b>${e.yo ? " <span class='tag n'>tu equipo</span>" : ""}</span><b>${e.xp.toLocaleString("es-PE")} XP</b></button>`).join("")}</div>
      <div class="card soft">🏅 Los 3 primeros ganan una insignia de salón. <b>3.º B vs. 3.º A</b>: van ganando por 1 230 XP.</div>
    </div>
    <div class="foot"><button class="btn" data-go="D06">Siguiente</button></div>`;
  $$("[data-eq]", el).forEach((b) => (b.onclick = () => {
    const e = EQ[+b.dataset.eq], miembros = ["Ana", "Bruno", "Camila", "Diego", "Elena", "Franco", "Gaby", "Hugo"].sort(() => Math.random() - 0.5).slice(0, 4);
    sheet({ info: e.emo, title: e.t, text: `${e.xp.toLocaleString("es-PE")} XP esta semana · Integrantes: ${miembros.join(", ")}.${e.yo ? " ¡Es tu equipo!" : ""}`, btn: "Cerrar" });
  }));
};

// D06 · Copa Pablo
SCREENS.D06 = (el) => {
  el.innerHTML = `
    ${barraDocente("D06")}
    <div class="body">
      <span class="eyebrow gold">Torneo entre colegios</span>
      <h1>Copa Pablo 2027 🥇</h1>
      <div class="row">${pablo("celebra", "sm")}<div class="bubble grow">Tu salón puede representar al colegio. ¡Gana el que más aprende, no el que más juega!</div></div>
      <div class="card stack">
        <button class="row tap-row" data-fase="Gana el equipo que más mejora en un mes de liga." data-t="Fase de salón"><span class="tag n">Abril</span><b class="grow" style="text-align:left">Fase de salón</b><span class="muted">Liga del salón</span><span class="chev">›</span></button>
        <button class="row tap-row" data-fase="Los 3 mejores salones de cada colegio resuelven la bóveda en vivo." data-t="Fase UGEL"><span class="tag n">Junio</span><b class="grow" style="text-align:left">Fase UGEL</b><span class="muted">Escape room en vivo</span><span class="chev">›</span></button>
        <button class="row tap-row" data-fase="Un salón por UGEL juega una Ciudad Pablo gigante." data-t="Fase regional"><span class="tag n">Agosto</span><b class="grow" style="text-align:left">Fase regional</b><span class="muted">Ciudad Pablo</span><span class="chev">›</span></button>
        <button class="row tap-row" data-fase="Los finalistas de cada región se enfrentan en Lima." data-t="Gran final en Lima"><span class="tag d">Octubre</span><b class="grow" style="text-align:left">Gran final en Lima</b><span class="muted">🏆</span><span class="chev">›</span></button>
      </div>
      <div class="card warn"><b>Premios:</b> trofeo, laptops para el aula del salón ganador y capacitación para su docente (los aporta el aliado).</div>
      <p class="muted">Se gana por avance entre el examen inicial y el final, así no gana solo el salón con más horas de juego.</p>
    </div>
    <div class="foot"><button class="btn" id="ins">Inscribir a 3.º B</button><button class="link" data-go="D07">Siguiente</button></div>`;
  $$("[data-fase]", el).forEach((b) => (b.onclick = () => sheet({ info: "🥇", title: b.dataset.t, text: b.dataset.fase, btn: "Cerrar" })));
  $("#ins", el).onclick = () => { confeti(); toast("¡3.º B inscrito en la Copa Pablo! 🥇"); $("#ins", el).disabled = true; $("#ins", el).textContent = "Inscrito ✓"; };
};

// D07 · Vista docente (evaluación)
SCREENS.D07 = (el) => {
  let comp = "cant", filtro = window._filtroD07 || null;
  window._filtroD07 = null;
  const COMP = { cant: "Resuelve problemas de cantidad", rec: "Gestiona responsablemente los recursos económicos" };
  const pintar = () => {
    el.innerHTML = `
      ${barraDocente("D07")}
      <div class="body">
        <span class="eyebrow">Evaluación · Escala del CNEB</span>
        <h2>Así va 3.º B</h2>
        <div class="chips">${Object.entries(COMP).map(([k, t]) => `<button class="chip ${comp === k ? "sel" : ""}" data-c="${k}">${t}</button>`).join("")}</div>
        <div class="grid4">${["AD", "A", "B", "C"].map((n) => `<button class="card nivel tapcard n-${n} ${filtro === n ? "on" : ""}" data-nf="${n}"><b>${n}</b><span>${ALUMNOS.filter((a) => a.niv[comp] === n).length}</span></button>`).join("")}</div>
        ${filtro ? `<button class="pill" id="quitar" style="align-self:flex-start;border:0">Mostrando: ${filtro === "pausa" ? "sin avanzar 7 días" : NIVEL_TXT[filtro]} · ✕ quitar filtro</button>` : ""}
        <div class="card stack" style="gap:0">${ALUMNOS.map((a, k) => ({ a, k })).filter(({ a }) => !filtro || (filtro === "pausa" ? a.m <= 2 : a.niv[comp] === filtro)).map(({ a, k }) => `
          <button class="list-row tap-row" data-al="${k}"><span class="grow" style="text-align:left"><b>${a.n}</b><br/><small class="muted">Mundo ${a.m} · ${a.xp} XP</small></span>
            ${a.m <= 2 ? `<span class="tag d" title="No avanza hace 7 días">⏸ 7 días</span>` : ""}
            <span class="nivel-pill n-${a.niv[comp]}" title="${NIVEL_TXT[a.niv[comp]]}">${a.niv[comp]}</span><span class="chev">›</span></button>`).join("")}</div>
        <p class="muted">AD: logro destacado · A: logro esperado · B: en proceso · C: en inicio. El nivel sale de los juegos, el reto real y el jefe de cada mundo.</p>
      </div>
      <div class="foot"><button class="btn navy" id="csv">📋 Copiar reporte para Excel</button><button class="link" data-go="D01">Volver al inicio del modo docente</button></div>`;
    $$("[data-c]", el).forEach((c) => (c.onclick = () => { comp = c.dataset.c; pintar(); }));
    $$("[data-nf]", el).forEach((c) => (c.onclick = () => { filtro = filtro === c.dataset.nf ? null : c.dataset.nf; pintar(); }));
    if ($("#quitar", el)) $("#quitar", el).onclick = () => { filtro = null; pintar(); };
    $$("[data-al]", el).forEach((b) => (b.onclick = () => {
      const a = ALUMNOS[+b.dataset.al];
      sheet({
        info: "🧑‍🎓", title: a.n,
        text: `Mundo ${a.m} de 6 · ${a.xp} XP. Cantidad: ${a.niv.cant} (${NIVEL_TXT[a.niv.cant]}). Recursos económicos: ${a.niv.rec} (${NIVEL_TXT[a.niv.rec]}).${a.m <= 2 ? " No avanza hace 7 días." : ""}`,
        btn: "💛 Enviar mensaje de ánimo", alt: "Cerrar",
        onNext: () => toast(`Pablo le mandó ánimo a ${a.n.split(" ")[0]} 💛`),
      });
    }));
    $("#csv", el).onclick = () => {
      const filas = [["Alumno", "Mundo", "XP", COMP.cant, COMP.rec], ...ALUMNOS.map((a) => [a.n, a.m, a.xp, a.niv.cant, a.niv.rec])];
      // Se copia como tabla (tabs): se pega directo en Excel o Google Sheets
      const tsv = filas.map((f) => f.join("\t")).join("\n");
      const mostrar = () => sheet({ info: "📋", title: "Reporte de 3.º B", text: `Selecciónalo y cópialo:<textarea id="tsv" readonly style="width:100%;height:120px;margin-top:8px;font:12px ui-monospace,monospace;border-radius:10px;border:2px solid var(--border);padding:8px">${tsv}</textarea>`, btn: "Listo" });
      try {
        navigator.clipboard.writeText(tsv).then(() => toast("Reporte copiado: pégalo en Excel 📋"), () => { mostrar(); setTimeout(() => $("#tsv")?.select(), 50); });
      } catch { mostrar(); }
    };
  };
  pintar();
};

/* ───────────── P15 · Error amable (demo suelta) ───────────── */
SCREENS.P15 = (el) => {
  el.innerHTML = `${barra(40)}<div class="body" id="q"></div><div class="foot" id="f"></div>`;
  const q = { q: "¿Cuál de estas es una NECESIDAD?", opts: ["Skin para el juego", "Pasaje al colegio", "Gaseosa grande"], ok: 1 };
  const btn = quiz($("#q", el), q, (ok) =>
    sheet({ ok, title: ok ? "¡Bien!" : "¡Casi! No pasa nada", text: ok ? "Prueba a equivocarte para ver el error amable." : "El pasaje es lo que te lleva al colegio: eso va primero. Equivocarse es parte de aprender. 💛", btn: "Intentar otra", onNext: () => go("P15") }));
  $("#f", el).appendChild(btn);
  $("#q", el).insertAdjacentHTML("afterbegin", `<span class="eyebrow">P15 · Error amable</span><p class="muted">Cuando fallas, Pablo te explica sin regañarte.</p>`);
};

/* ───────────── Índice de pantallas ───────────── */
SCREENS.INDICE = (el) => {
  el.innerHTML = `
    <div class="top"><button class="icon-btn" data-go="${S.onboarded ? "P05" : "P01"}" aria-label="Cerrar">✕</button><b class="grow">Todas las pantallas</b></div>
    <div class="body">
      <p class="sub">${Object.keys(NOMBRES).length} pantallas en el orden del Figma. Toca una para abrirla.</p>
      ${CAPITULOS.map((c, k) => `
        <div><h3 style="margin-bottom:8px">${k + 1} · ${c.t}</h3>
        <div class="stack" style="gap:6px">${c.ids.map((id) => `<button class="option idx" data-ir="${id}"><b class="code">${id}</b><span class="grow">${NOMBRES[id]}</span>›</button>`).join("")}</div></div>`).join("")}
    </div>`;
  $$("[data-ir]", el).forEach((b) => (b.onclick = () => {
    if (!S.onboarded && !["P01", "P02", "P03", "P04"].includes(b.dataset.ir) && !b.dataset.ir.startsWith("D")) {
      S.onboarded = true; S.name = S.name || "Invitado"; save();
    }
    go(b.dataset.ir);
  }));
};

/* ───────────── Arranque ───────────── */
(() => {
  const inicio = location.hash.slice(1);
  const libre = ["P01", "P02", "P03", "P04", "INDICE", ...DOCENTE];
  go(SCREENS[inicio] && (S.onboarded || libre.includes(inicio)) ? inicio : S.onboarded ? "P05" : "P01");
})();
