// Pablo Enseña · todo lo que se toca responde
// 1) Efecto tecla 3D: el botón baja y su borde inferior desaparece.
// 2) Vibración corta y un «clic» suave al presionar (se apagan en Perfil).
// 3) Hojas de información para racha, XP, monedas, insignias, misiones y mundos.

const PRESIONABLE = "button, label.btn, [data-go]";

/* ───────── Efecto tecla ───────── */
let teclaCtx;
function clicTecla() {
  if (S.sonido === false) return;
  try {
    teclaCtx = teclaCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = teclaCtx.currentTime, o = teclaCtx.createOscillator(), g = teclaCtx.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(1800, t);
    o.frequency.exponentialRampToValueAtTime(600, t + 0.03);
    g.gain.setValueAtTime(0.03, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    o.connect(g).connect(teclaCtx.destination);
    o.start(t);
    o.stop(t + 0.05);
  } catch {}
}
function vibrar(ms = 8) {
  if (S.sonido === false) return;
  try { navigator.vibrate && navigator.vibrate(ms); } catch {}
}

document.addEventListener("pointerdown", (e) => {
  const b = e.target.closest(PRESIONABLE);
  if (!b || b.disabled) return;
  b.classList.add("pressing");
  b._pressAt = performance.now();
  clicTecla();
  vibrar();
}, { passive: true });
// Se suelta: deja el botón abajo al menos 90 ms para que el toque rápido también se vea
const soltar = (e) => {
  document.querySelectorAll(".pressing").forEach((b) => {
    const resta = Math.max(0, 90 - (performance.now() - (b._pressAt || 0)));
    setTimeout(() => b.classList.remove("pressing"), resta);
  });
};
["pointerup", "pointercancel", "dragstart"].forEach((ev) => document.addEventListener(ev, soltar, { passive: true }));
document.addEventListener("pointerleave", soltar, { passive: true });
// iOS solo activa :active si hay un listener de touch
document.addEventListener("touchstart", () => {}, { passive: true });
// Teclado: Enter/Espacio también «hunden» la tecla
document.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && document.activeElement?.matches?.(PRESIONABLE)) {
    const b = document.activeElement;
    b.classList.add("pressing");
    setTimeout(() => b.classList.remove("pressing"), 110);
  }
});

/* ───────── Piezas reutilizables ───────── */
const TIPS = [
  "antes de comprar algo, espera un día. Si al otro día lo sigues queriendo, piénsalo con calma.",
  "separa tu ahorro apenas recibas plata, no «lo que sobre».",
  "un precio con muchos 9 (S/ 9.99) está hecho para parecer más barato.",
  "si una oferta te apura («¡solo hoy!»), es para que no lo pienses.",
  "pide siempre boleta: así puedes reclamar y ayudas al país.",
  "compara la TCEA antes de pedir un préstamo: es su costo real.",
];

const COMO_INSIGNIA = {
  inicio: "Termina el examen inicial.",
  clasifica: "Termina el juego Clasifica en el Mundo 1.",
  detective: "Caza al menos 4 de 5 anuncios en «Caza la publicidad».",
  hormiga: "Calcula tu gasto hormiga en el Mundo 1.",
  reto: "Anota 3 compras reales en el reto del Mundo 1.",
  jefe: "Vence al Vendedor Tentador, el jefe del Mundo 1.",
  ahorro: "Llena tu alcancía en el Mundo 2.",
  derechos: "Responde «Defiende tus derechos» en el Mundo 3.",
  estafas: "Detecta al menos 4 de 5 mensajes en «Detective de estafas».",
  futuro: "Viaja en la Máquina del tiempo del Mundo 5.",
  boleta: "Resuelve el Detective de la boleta del Mundo 6.",
  feria: "Abre tu puesto en la feria del Mundo 6.",
};
const IR_INSIGNIA = { inicio: "P04", clasifica: "P11", detective: "P13", hormiga: "P14", reto: "P19", jefe: "P21", ahorro: "P28", derechos: "P32", estafas: "P36", futuro: "P38", boleta: "P40", feria: "P41" };

function statsBtns() {
  return `<div class="stats">
    <button class="stat" data-info="racha" aria-label="Ver mi racha">🔥 ${S.racha.count}</button>
    <button class="stat" data-info="xp" aria-label="Ver mi XP">⚡ ${S.xp}</button>
  </div>`;
}
function insigniasHTML() {
  return `<div class="badges">${INSIGNIAS.map((b) => `<button class="badge ${S.badges.includes(b.id) ? "" : "off"}" data-insignia="${b.id}"><span class="bi">${b.emo}</span>${b.t}</button>`).join("")}</div>`;
}

/* ───────── Qué pasa al tocar cada cosa ───────── */
document.addEventListener("click", (e) => {
  const t = e.target;

  const info = t.closest("[data-info]");
  if (info) {
    const k = info.dataset.info;
    if (k === "racha") {
      const dias = ["L", "M", "M", "J", "V", "S", "D"], hoyIdx = (new Date().getDay() + 6) % 7;
      const sem = dias.map((d, i) => {
        const on = i <= hoyIdx && hoyIdx - i < S.racha.count;
        return `<span class="rdia ${on ? "on" : ""} ${i === hoyIdx ? "hoy" : ""}">${on ? "🔥" : "·"}<small>${d}</small></span>`;
      }).join("");
      sheet({ info: "🔥", title: `Racha de ${S.racha.count} ${S.racha.count === 1 ? "día" : "días"}`, text: `<span class="semana">${sem}</span>Practica aunque sea un juego al día para que no se apague.`, btn: "¡A practicar!", onNext: () => continuarMundo() });
    } else if (k === "xp") {
      sheet({ info: "⚡", title: `Nivel ${nivel()} · ${S.xp} XP`, text: `Te faltan ${NIVEL_XP - (S.xp % NIVEL_XP)} XP para el nivel ${nivel() + 1}. Ganas XP en cada juego, reto y jefe. Cada 10 XP te dan 1 moneda para vestir a Pablo.`, btn: "Vestir a Pablo", alt: "Cerrar", onNext: () => go("P44") });
    } else if (k === "monedas") {
      sheet({ info: "🪙", title: `${monedas()} monedas`, text: "Ganas 1 moneda por cada 10 XP. Úsalas para comprar accesorios a Pablo.", btn: "Entendido" });
    }
    return;
  }

  const ins = t.closest("[data-insignia]");
  if (ins) {
    const b = INSIGNIAS.find((x) => x.id === ins.dataset.insignia), tiene = S.badges.includes(b.id);
    sheet({ info: tiene ? b.emo : "🔒", title: b.t, text: tiene ? `¡Ya la tienes! ${COMO_INSIGNIA[b.id]}` : `Cómo ganarla: ${COMO_INSIGNIA[b.id]}`, btn: tiene ? "¡Genial!" : "Ir a ganarla", alt: tiene ? null : "Cerrar", onNext: () => { if (!tiene) go(IR_INSIGNIA[b.id]); } });
    return;
  }

  const mis = t.closest("[data-mis]");
  if (mis) {
    const id = mis.dataset.mis;
    if (id === "reto") return go("P19");
    if (id === "racha") return sheet({ info: "🔥", title: "Practica 3 días seguidos", text: `Llevas ${S.racha.count}. Vuelve mañana y juega aunque sea un juego.`, btn: "Jugar ahora", onNext: () => continuarMundo() });
    return continuarMundo();
  }

  const mundo = t.closest("[data-mundo]");
  if (mundo) {
    const n = +mundo.dataset.mundo;
    if (!mundoAbierto(n)) return toast(`🔒 Termina el Mundo ${n - 1} para abrirlo`);
    const M = MUNDOS[n - 1], f = FLOWS[n];
    sheet({
      info: M.emo, title: `Mundo ${n} · ${M.nombre}`,
      text: `${M.tema}. ${mundoHecho(n) ? "¡Ya lo completaste! Puedes repetir cualquier juego." : `Vas en el paso ${Math.min(getStep(n) + 1, f.length)} de ${f.length}.`}`,
      btn: mundoHecho(n) ? "Repetir desde el inicio" : getStep(n) ? "Continuar" : "Empezar", alt: "Cerrar",
      onNext: () => (mundoHecho(n) ? go(f[0]) : continuarMundo(n)),
    });
  }
});
