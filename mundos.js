// Pablo Enseña · Mundos 2 a 6 (P26–P41) y Siempre contigo (P42–P45)

const pantallaMundo = (el, id, color) => {
  el.style.setProperty("--wc", color);
  return barra(pasoPct(id));
};
const eyebrowMundo = (n, txt) => `<span class="eyebrow" style="color:${MUNDOS[n - 1].color}">Mundo ${n} · ${txt}</span>`;

/* ───────────── Mundo 2 · El poder del ahorro ───────────── */

// P26 · Mundo 2 desbloqueado
SCREENS.P26 = (el) => {
  el.classList.add("green");
  el.innerHTML = `
    <div class="top"><button class="icon-btn" data-go="P07" style="color:#fff" aria-label="Cerrar">✕</button></div>
    <div class="body center">
      <div class="pop" style="font-size:110px;line-height:1">🐷</div>
      <span class="eyebrow" style="color:#fff">¡Desbloqueado!</span>
      <h1>Mundo 2<br/>El poder del ahorro</h1>
      <p style="opacity:.92">Vas a ponerte una meta de verdad, llenar tu alcancía resistiendo tentaciones y cumplir una misión de 7 días.</p>
      <div class="chips" style="justify-content:center"><span class="pill">🎯 Meta</span><span class="pill">🐷 Alcancía</span><span class="pill">📅 7 días</span></div>
    </div>
    <div class="foot"><button class="btn" id="next">¡Vamos!</button></div>`;
  confeti();
  $("#next", el).onclick = () => siguiente("P26");
};

// P27 · Arma tu meta
SCREENS.P27 = (el) => {
  let m = S.meta ? METAS.findIndex((x) => x.t === S.meta.t) : 0;
  if (m < 0) m = 0;
  let semanal = S.meta?.semanal || 10;
  el.innerHTML = `
    ${barra(pasoPct("P27"))}
    <div class="body">
      ${eyebrowMundo(2, "Arma tu meta")}
      <h2>¿Para qué quieres ahorrar?</h2>
      <div class="grid2" id="metas"></div>
      <div><span class="lbl">¿Cuánto puedes guardar por semana? <b id="sv"></b></span>
        <input type="range" id="sem" min="2" max="30" value="${semanal}" aria-label="Ahorro semanal" /></div>
      <div class="card ok row"><span style="font-size:36px" id="me"></span>
        <div class="grow"><p class="muted">Lo logras en</p><div class="big-num" id="sem-n" style="font-size:32px"></div><p id="fecha" class="sub"></p></div></div>
      <div class="card soft"><b>Una buena meta es:</b> clara (qué), con monto (cuánto) y con fecha (cuándo). ¡La tuya ya tiene las tres!</div>
    </div>
    <div class="foot"><button class="btn" id="next">Guardar mi meta</button></div>`;
  const pintar = () => {
    const x = METAS[m];
    $("#metas", el).innerHTML = METAS.map((o, k) => `<button class="option ${k === m ? "sel" : ""}" data-k="${k}"><span class="emo">${o.emo}</span><span>${o.t}<br/><b>${soles(o.precio)}</b></span></button>`).join("");
    $$("#metas .option", el).forEach((b) => (b.onclick = () => { m = +b.dataset.k; pintar(); }));
    const semanas = Math.ceil(x.precio / semanal);
    const f = new Date(Date.now() + semanas * 7 * 864e5);
    $("#sv", el).textContent = soles(semanal);
    $("#me", el).textContent = x.emo;
    $("#sem-n", el).textContent = `${semanas} semanas`;
    $("#fecha", el).textContent = `Más o menos el ${f.toLocaleDateString("es-PE", { day: "numeric", month: "long" })}`;
  };
  $("#sem", el).oninput = (e) => { semanal = +e.target.value; pintar(); };
  $("#next", el).onclick = () => {
    S.meta = { ...METAS[m], semanal, ahorrado: 0 };
    addXP(20);
    siguiente("P27");
  };
  pintar();
};

// P28 · Alcancía
SCREENS.P28 = (el) => {
  const meta = S.meta || { ...METAS[0], semanal: 10, ahorrado: 0 };
  let ahorrado = 0, semana = 0, resistidas = 0;
  el.innerHTML = `
    ${barra(pasoPct("P28"))}
    <div class="body">
      ${eyebrowMundo(2, "Alcancía")}
      <h2>Llena tu alcancía para: ${meta.emo} ${meta.t}</h2>
      <div class="card center" style="text-align:center">
        <div id="chancha" style="font-size:90px;line-height:1;transition:transform .2s">🐷</div>
        <div class="big-num" id="ah" style="margin-top:8px"></div>
        <p class="muted" id="de"></p>
        <div class="bar ok" style="margin-top:10px"><i id="pb" style="width:0"></i></div>
      </div>
      <div id="evento"></div>
      <p class="muted" id="info"></p>
    </div>
    <div class="foot" id="f"><button class="btn" id="sem">Pasa una semana (+${soles(meta.semanal)})</button></div>`;
  const pintar = () => {
    $("#ah", el).textContent = soles(ahorrado);
    $("#de", el).textContent = `de ${soles(meta.precio)} · semana ${semana}`;
    $("#pb", el).style.width = Math.min(100, (ahorrado / meta.precio) * 100) + "%";
    $("#info", el).textContent = resistidas ? `Resististe ${resistidas} ${resistidas === 1 ? "tentación" : "tentaciones"}. 💪` : "Cada semana pasa algo. ¿Resistes?";
  };
  const terminar = () => {
    $("#f", el).innerHTML = "";
    darInsignia("ahorro");
    confeti();
    sheet({
      ok: true, title: `¡Lo lograste en ${semana} semanas! 🎉`,
      text: `Juntaste ${soles(ahorrado)} para tu ${meta.t.toLowerCase()}. Resististe ${resistidas} tentaciones: eso es lo que hace que una meta se cumpla.`,
      onNext: () => { addXP(30); siguiente("P28"); },
    });
  };
  const semanaNueva = () => {
    semana++;
    const chancha = $("#chancha", el);
    chancha.style.transform = "scale(1.18)";
    setTimeout(() => (chancha.style.transform = ""), 200);
    const tent = semana % 2 === 1 ? TENTACIONES[(semana >> 1) % TENTACIONES.length] : null;
    if (!tent) { ahorrado += meta.semanal; beep(true); pintar(); if (ahorrado >= meta.precio) terminar(); return; }
    $("#sem", el).disabled = true;
    $("#evento", el).innerHTML = `
      <div class="card warn pop"><b>Semana ${semana}:</b> ${tent.t} (${soles(tent.costo)}).
        <div class="grid2" style="margin-top:10px"><button class="btn small green" id="res">💪 Resisto</button><button class="btn small ghost" id="gas">Lo compro</button></div></div>`;
    const cerrar = (gasto) => {
      ahorrado += Math.max(0, meta.semanal - gasto);
      if (!gasto) resistidas++;
      beep(!gasto);
      $("#evento", el).innerHTML = "";
      $("#sem", el).disabled = false;
      pintar();
      if (ahorrado >= meta.precio) terminar();
    };
    $("#res", el).onclick = () => cerrar(0);
    $("#gas", el).onclick = () => cerrar(tent.costo);
  };
  $("#sem", el).onclick = semanaNueva;
  pintar();
};

// P29 · Misión 7 días
SCREENS.P29 = (el) => {
  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const hechos = new Set();
  el.innerHTML = `
    ${barra(pasoPct("P29"))}
    <div class="body">
      ${eyebrowMundo(2, "Misión 7 días")}
      <h2>Una semana sin gastos hormiga</h2>
      <div class="row">${pablo("anota", "sm")}<div class="bubble grow">Cada día que no compres antojos, márcalo. Al séptimo día, ganas el cofre del ahorro.</div></div>
      <div class="dias" id="dias"></div>
      <div class="card soft"><b>Consejo:</b> lleva tu agua y tu fruta de casa. Así es más fácil decir que no.</div>
      <p class="muted">En la app real se marca un día por vez. Aquí puedes probarlo de una.</p>
    </div>
    <div class="foot"><button class="btn" id="next" disabled>Abrir el cofre del ahorro</button></div>`;
  const pintar = () => {
    $("#dias", el).innerHTML = dias.map((d, i) => `<button class="dia ${hechos.has(i) ? "on" : ""}" data-i="${i}"><span>${hechos.has(i) ? "🔥" : i + 1}</span>${d}</button>`).join("");
    $$(".dia", el).forEach((b) => (b.onclick = () => {
      const i = +b.dataset.i;
      hechos.has(i) ? hechos.delete(i) : (hechos.add(i), beep(true));
      pintar();
    }));
    $("#next", el).disabled = hechos.size < 7;
  };
  $("#next", el).onclick = () => { confeti(); addXP(40); siguiente("P29"); };
  pintar();
};

/* ───────────── Mundo 3 · Controla tu presupuesto ───────────── */

// P30 · Elige tu camino
SCREENS.P30 = (el) => {
  let i = 0, plata = CAMINO.inicio;
  const pintar = () => {
    if (i === CAMINO.pasos.length) return final();
    const p = CAMINO.pasos[i];
    el.innerHTML = `
      ${barra(pasoPct("P30"))}
      <div class="body">
        ${eyebrowMundo(3, "Elige tu camino")}
        <div class="card row between" style="background:var(--navy);color:#fff;border:0">
          <span>Te queda para el mes</span><b class="big-num" style="font-size:28px">${soles(plata)}</b></div>
        <p class="muted">Recuerda: a fin de mes necesitas ${soles(CAMINO.pasajes)} para pasajes.</p>
        <h2>${p.t}</h2>
        <div class="stack">
          <button class="option" data-c="a"><span class="grow">${p.a.t}</span><b>−${soles(p.a.c)}</b></button>
          <button class="option" data-c="b"><span class="grow">${p.b.t}</span><b>−${soles(p.b.c)}</b></button>
        </div>
        <div class="row" style="gap:6px">${CAMINO.pasos.map((_, k) => `<span style="flex:1;height:6px;border-radius:9px;background:${k < i ? "var(--w3)" : "var(--locked-bg)"}"></span>`).join("")}</div>
      </div>`;
    $$("[data-c]", el).forEach((b) => (b.onclick = () => { plata -= p[b.dataset.c].c; beep(true); i++; pintar(); }));
  };
  const final = () => {
    const ok = plata >= CAMINO.pasajes;
    el.innerHTML = `
      ${barra(pasoPct("P30"))}
      <div class="body center">
        ${pablo(ok ? "celebra" : "explica", "mid pop")}
        <h2>${ok ? "¡Llegaste a fin de mes!" : "Te faltó para los pasajes"}</h2>
        <div class="big-num" style="color:${ok ? "var(--ok)" : "var(--err)"}">${soles(plata)}</div>
        <p class="sub">${ok ? "Elegiste con cabeza y te sobró. Así funciona un presupuesto: primero lo fijo, luego los gustos." : `Te faltan ${soles(CAMINO.pasajes - plata)}. No pasa nada: prueba otro camino y mira cómo cambia.`}</p>
      </div>
      <div class="foot">${ok ? `<button class="btn" id="next">Continuar</button>` : `<button class="btn" id="otra">Probar otro camino</button><button class="link" id="next">Seguir igual</button>`}</div>`;
    if (!ok) $("#otra", el).onclick = () => { i = 0; plata = CAMINO.inicio; pintar(); };
    $("#next", el).onclick = () => { S.juegos++; addXP(ok ? 30 : 10); siguiente("P30"); };
  };
  pintar();
};

// P31 · Ordena prioridades
SCREENS.P31 = (el) => {
  const orden = [3, 0, 4, 2, 1].map((k) => PRIORIDADES[k]);
  el.innerHTML = `
    ${barra(pasoPct("P31"))}
    <div class="body">
      ${eyebrowMundo(3, "Ordena prioridades")}
      <h2>¿Qué pagas primero?</h2>
      <p class="sub">Tienes S/ 50 para la semana. Ordena de lo más importante (arriba) a lo que puede esperar.</p>
      <div class="stack" id="lista"></div>
    </div>
    <div class="foot"><button class="btn" id="next">Comprobar</button></div>`;
  const pintar = () => {
    $("#lista", el).innerHTML = orden.map((t, k) => `
      <div class="option" style="cursor:default"><b style="width:22px;color:var(--w3)">${k + 1}</b><span class="grow">${t}</span>
        <button class="icon-btn" data-up="${k}" ${k ? "" : "disabled"} aria-label="Subir">▲</button>
        <button class="icon-btn" data-dn="${k}" ${k < orden.length - 1 ? "" : "disabled"} aria-label="Bajar">▼</button></div>`).join("");
    $$("[data-up]", el).forEach((b) => (b.onclick = () => { const k = +b.dataset.up; [orden[k - 1], orden[k]] = [orden[k], orden[k - 1]]; pintar(); }));
    $$("[data-dn]", el).forEach((b) => (b.onclick = () => { const k = +b.dataset.dn; [orden[k + 1], orden[k]] = [orden[k], orden[k + 1]]; pintar(); }));
  };
  $("#next", el).onclick = () => {
    const ok = orden[0] === PRIORIDADES[0] && orden[1] === PRIORIDADES[1];
    $$("#lista .option", el).forEach((o, k) => o.classList.add(orden[k] === PRIORIDADES[k] ? "right" : "wrong"));
    sheet({
      ok, title: ok ? "¡Prioridades claras!" : "Casi: revisa lo de arriba",
      text: ok ? "Lo que te permite estudiar va primero. Los gustos, con lo que sobra." : `Lo primero son los ${PRIORIDADES[0].slice(3).toLowerCase()} y los ${PRIORIDADES[1].slice(3).toLowerCase()}: sin eso no puedes estudiar.`,
      btn: ok ? "Continuar" : "Ordenar de nuevo",
      alt: ok ? null : "Seguir igual",
      onNext: () => (ok ? (S.juegos++, addXP(25), siguiente("P31")) : pintar()),
      onAlt: () => { addXP(5); siguiente("P31"); },
    });
  };
  pintar();
};

// P32 · Defiende tus derechos
SCREENS.P32 = (el) => {
  let i = 0, aciertos = 0;
  const pintar = () => {
    const q = DERECHOS[i];
    el.innerHTML = `
      ${barra(pasoPct("P32"))}
      <div class="body" id="q"></div>
      <div class="foot" id="f"></div>`;
    const cont = document.createElement("div");
    cont.className = "stack";
    cont.style.gap = "14px";
    $("#q", el).innerHTML = `${eyebrowMundo(3, `Defiende tus derechos · ${i + 1} de ${DERECHOS.length}`)}`;
    $("#q", el).appendChild(cont);
    const btn = quiz(cont, q, (ok) => {
      if (ok) aciertos++;
      sheet({
        ok, title: ok ? "¡Así se defiende!" : "Tienes más derechos de lo que crees", text: q.porque,
        onNext: () => {
          if (ok) addXP(10);
          i++;
          if (i < DERECHOS.length) pintar();
          else { darInsignia("derechos"); siguiente("P32"); }
        },
      });
    });
    $("#f", el).appendChild(btn);
  };
  pintar();
};

// P33 · Reto con tu familia (presupuesto de práctica, sin datos de la familia)
SCREENS.P33 = (el) => {
  const sel = new Set();
  let foto = null;
  el.innerHTML = `
    ${barra(pasoPct("P33"))}
    <div class="body">
      ${eyebrowMundo(3, "Reto con tu familia")}
      <h2>Arma un lonche familiar con S/ ${LONCHE.presupuesto}</h2>
      <p class="sub">Hazlo con alguien de tu casa. Es un presupuesto de práctica: no usen su plata real.</p>
      <div class="card row between"><span>Gastado</span><b class="big-num" style="font-size:26px" id="tot"></b></div>
      <div class="bar ok"><i id="tb"></i></div>
      <div class="stack" id="items"></div>
      <div class="card soft stack">
        <b>📷 Foto del lonche (opcional)</b>
        <div id="fprev"></div>
        <label class="btn ghost small" style="text-align:center">Agregar foto<input type="file" accept="image/*" id="foto" hidden /></label>
        <p class="muted">La foto se queda en tu celular. Puedes borrarla cuando quieras.</p>
      </div>
      <div class="card info row" style="align-items:flex-start"><span style="font-size:22px">🔒</span>
        <p>Nunca te preguntamos cuánto gana tu familia, sus deudas ni sus cuentas (D.S. 016-2024-JUS).</p></div>
    </div>
    <div class="foot"><button class="btn" id="next" disabled>Terminamos el reto</button></div>`;
  const pintar = () => {
    const tot = [...sel].reduce((a, k) => a + LONCHE.items[k].precio, 0);
    const pasa = tot > LONCHE.presupuesto;
    $("#tot", el).textContent = `${soles(tot)} / ${soles(LONCHE.presupuesto)}`;
    $("#tot", el).style.color = pasa ? "var(--err)" : "var(--text)";
    $("#tb", el).style.width = Math.min(100, (tot / LONCHE.presupuesto) * 100) + "%";
    $("#tb", el).style.background = pasa ? "var(--err)" : "";
    $("#items", el).innerHTML = LONCHE.items.map((x, k) => `<button class="option ${sel.has(k) ? "sel" : ""}" data-k="${k}"><span class="emo">${x.emo}</span><span class="grow">${x.t}</span><b>${soles(x.precio)}</b></button>`).join("");
    $$("#items .option", el).forEach((b) => (b.onclick = () => { const k = +b.dataset.k; sel.has(k) ? sel.delete(k) : sel.add(k); pintar(); }));
    $("#next", el).disabled = !sel.size || pasa;
    if (pasa) toast("¡Te pasaste! Quita algo 🙈");
    $("#fprev", el).innerHTML = foto ? `<div class="row"><img src="${foto}" style="width:80px;height:80px;object-fit:cover;border-radius:14px" alt="Foto del lonche" /><button class="link" id="borrar" style="color:var(--err)">Borrar foto</button></div>` : "";
    if (foto) $("#borrar", el).onclick = () => { URL.revokeObjectURL(foto); foto = null; pintar(); };
  };
  $("#foto", el).onchange = (e) => { const f = e.target.files[0]; if (f) { foto = URL.createObjectURL(f); pintar(); } };
  $("#next", el).onclick = () => {
    const tot = [...sel].reduce((a, k) => a + LONCHE.items[k].precio, 0);
    sheet({ ok: true, title: "¡Reto familiar cumplido! 👨‍👩‍👧", text: `Usaron ${soles(tot)} y les sobraron ${soles(LONCHE.presupuesto - tot)}. Decidir juntos qué entra y qué no es hacer un presupuesto.`, onNext: () => { addXP(40); siguiente("P33"); } });
  };
  pintar();
};

/* ───────────── Mundo 4 · Crédito y decisiones ───────────── */

// P34 · Cuotas
SCREENS.P34 = (el) => {
  const precio = 600;
  const cuota = (n) => { const r = 0.04; return (precio * r) / (1 - Math.pow(1 + r, -n)); };
  let fase = 0;
  const pintar = () => {
    el.innerHTML = `
      ${barra(pasoPct("P34"))}
      <div class="body">
        ${eyebrowMundo(4, "Cuotas")}
        <div class="card center" style="text-align:center"><div style="font-size:56px">📱</div><h2>Celular nuevo</h2>
          <div class="grid2" style="margin-top:10px"><div class="card soft"><p class="muted">Al contado</p><b class="big-num" style="font-size:26px">${soles(precio)}</b></div>
          <div class="card soft"><p class="muted">En cuotas</p><b class="big-num" style="font-size:26px">12 × ${soles(65)}</b></div></div></div>
        <div id="q" class="stack" style="gap:14px"></div>
      </div>
      <div class="foot" id="f"></div>`;
    if (fase === 0) {
      const btn = quiz($("#q", el), { q: "¿Cuánto pagas EN TOTAL si eliges cuotas?", opts: ["S/ 600", "S/ 650", "S/ 780"], ok: 2 }, (ok) =>
        sheet({ ok, title: ok ? "¡Bien calculado!" : "Hagamos la cuenta", text: "12 × S/ 65 = S/ 780. Pagas S/ 180 más: un 30 % extra por no tener la plata hoy.", onNext: () => { if (ok) addXP(15); fase = 1; pintar(); } }));
      $("#f", el).appendChild(btn);
    } else {
      $("#q", el).innerHTML = `
        <h3>Juega con las cuotas</h3>
        <div class="chips" id="ns">${[3, 6, 12, 24].map((n) => `<button class="chip" data-n="${n}">${n} cuotas</button>`).join("")}</div>
        <div class="card stack" id="res"></div>`;
      const ver = (n) => {
        $$("#ns .chip", el).forEach((c) => c.classList.toggle("sel", +c.dataset.n === n));
        const tot = cuota(n) * n;
        $("#res", el).innerHTML = `
          <div class="row between"><span>Cuota mensual</span><b>${soles(cuota(n))}</b></div>
          <div class="row between"><span>Total que pagas</span><b>${soles(tot)}</b></div>
          <div class="row between" style="color:var(--err)"><span>Pagas de más</span><b>${soles(tot - precio)}</b></div>
          <div><p class="muted">Contado</p><div class="bar"><i style="width:${(precio / (precio * 2)) * 100}%;background:var(--ok)"></i></div></div>
          <div><p class="muted">Cuotas</p><div class="bar"><i style="width:${Math.min(100, (tot / (precio * 2)) * 100)}%;background:var(--w4)"></i></div></div>`;
      };
      $$("#ns .chip", el).forEach((c) => (c.onclick = () => ver(+c.dataset.n)));
      ver(12);
      $("#f", el).innerHTML = `<p class="muted">Más cuotas = cuota más chiquita, pero pagas mucho más al final.</p><button class="btn" id="next">Entendido</button>`;
      $("#next", el).onclick = () => { addXP(15); siguiente("P34"); };
    }
  };
  pintar();
};

// P35 · Carrera de intereses
SCREENS.P35 = (el) => {
  const prestamo = 200;
  const A = (sem) => prestamo * Math.pow(1.35, sem / 52); // TCEA 35 %
  const B = (sem) => prestamo * Math.pow(1.1, sem); // 10 % semanal
  el.innerHTML = `
    ${barra(pasoPct("P35"))}
    <div class="body">
      ${eyebrowMundo(4, "Carrera de intereses")}
      <h2>Pides S/ ${prestamo}. ¿Cuánto debes con el tiempo?</h2>
      <div class="card stack" style="gap:16px">
        <div><div class="row between"><b>🏛️ Caja (TCEA 35 % al año)</b><b id="va"></b></div><div class="bar"><i id="ba" style="width:0;background:var(--w3)"></i></div></div>
        <div><div class="row between"><b>💸 «Préstamo rápido» (10 % semanal)</b><b id="vb"></b></div><div class="bar"><i id="bb" style="width:0;background:var(--err)"></i></div></div>
        <p class="muted" id="sem">Semana 0</p>
      </div>
      <div class="card warn" id="moral" hidden></div>
    </div>
    <div class="foot" id="f"><button class="btn" id="go">🏁 Arrancar la carrera</button></div>`;
  const max = B(13);
  const pintar = (s) => {
    $("#va", el).textContent = soles(A(s)); $("#vb", el).textContent = soles(B(s));
    $("#ba", el).style.width = (A(s) / max) * 100 + "%"; $("#bb", el).style.width = (B(s) / max) * 100 + "%";
    $("#sem", el).textContent = `Semana ${s} de 13 (3 meses)`;
  };
  pintar(0);
  $("#go", el).onclick = () => {
    $("#go", el).disabled = true;
    let s = 0;
    const t = setInterval(() => {
      s++; pintar(s);
      if (s === 13) {
        clearInterval(t);
        $("#moral", el).hidden = false;
        $("#moral", el).innerHTML = `En 3 meses, con la caja debes <b>${soles(A(13))}</b>. Con el «préstamo rápido», <b>${soles(B(13))}</b>: más del triple. Compara siempre la <b>TCEA</b>: es el costo total del préstamo.`;
        $("#f", el).innerHTML = `<button class="btn" id="next">Continuar</button>`;
        $("#next", el).onclick = () => { S.juegos++; addXP(20); siguiente("P35"); };
      }
    }, 260);
  };
};

// P36 · Detective de estafas
SCREENS.P36 = (el) => {
  let i = 0, aciertos = 0;
  const pintar = () => {
    const m = MENSAJES[i];
    el.innerHTML = `
      ${barra(pasoPct("P36"))}
      <div class="body">
        ${eyebrowMundo(4, `Detective de estafas · ${i + 1} de ${MENSAJES.length}`)}
        <h2>¿Estafa o mensaje real?</h2>
        <div class="phone">
          <div class="phone-top">💬 ${m.de}</div>
          <div class="msg pop" style="max-width:100%">${m.txt}</div>
        </div>
      </div>
      <div class="foot"><div class="grid2">
        <button class="btn red" data-r="1">🚨 Estafa</button>
        <button class="btn green" data-r="0">✅ Real</button>
      </div></div>`;
    $$("[data-r]", el).forEach((b) => (b.onclick = () => {
      const ok = !!+b.dataset.r === m.estafa;
      if (ok) aciertos++;
      sheet({
        ok, title: ok ? (m.estafa ? "¡Estafa detectada! 🛡️" : "¡Bien! Era real") : (m.estafa ? "¡Cuidado, era estafa!" : "Este sí era real"), text: m.porque,
        onNext: () => {
          if (ok) addXP(10);
          i++;
          if (i < MENSAJES.length) pintar();
          else { S.juegos++; if (aciertos >= 4) darInsignia("estafas"); siguiente("P36"); }
        },
      });
    }));
  };
  pintar();
};

// P37 · ¿Quién cuida tu plata?
SCREENS.P37 = (el) => {
  const resp = {};
  el.innerHTML = `
    ${barra(pasoPct("P37"))}
    <div class="body">
      ${eyebrowMundo(4, "¿Quién cuida tu plata?")}
      <h2>¿Está supervisada por la SBS?</h2>
      <p class="sub">La SBS vigila a quienes guardan y prestan plata. Si no está supervisado, nadie te protege.</p>
      <div class="stack" id="ents"></div>
    </div>
    <div class="foot"><button class="btn" id="next" disabled>Comprobar</button></div>`;
  const pintar = () => {
    $("#ents", el).innerHTML = ENTIDADES.map((e, k) => `
      <div class="card row" style="padding:12px"><span style="font-size:26px">${e.emo}</span><b class="grow">${e.t}</b>
        <button class="chip ${resp[k] === true ? "sel" : ""}" data-k="${k}" data-v="1">Sí</button>
        <button class="chip ${resp[k] === false ? "sel" : ""}" data-k="${k}" data-v="0">No</button></div>`).join("");
    $$("#ents .chip", el).forEach((c) => (c.onclick = () => { resp[c.dataset.k] = c.dataset.v === "1"; pintar(); }));
    $("#next", el).disabled = Object.keys(resp).length < ENTIDADES.length;
  };
  $("#next", el).onclick = () => {
    const mal = ENTIDADES.filter((e, k) => resp[k] !== e.sbs);
    sheet({
      ok: !mal.length, title: mal.length ? `Revisa ${mal.length === 1 ? "una" : mal.length}` : "¡Todo correcto!",
      text: mal.length ? `${mal.map((e) => e.t).join(", ")}: ${mal[0].sbs ? "sí está supervisado" : "no está supervisado"}. Antes de ahorrar o pedir prestado, búscalo en la web de la SBS.` : "Antes de ahorrar o pedir prestado, búscalo en la web de la SBS. Si no aparece, ¡aléjate!",
      onNext: () => { addXP(mal.length ? 10 : 25); siguiente("P37"); },
    });
  };
  pintar();
};

/* ───────────── Mundo 5 · Construye tu futuro ───────────── */

// P38 · Máquina del tiempo (interés compuesto)
SCREENS.P38 = (el) => {
  let mes = 20, anios = 10, tasa = 5;
  el.innerHTML = `
    ${barra(pasoPct("P38"))}
    <div class="body">
      ${eyebrowMundo(5, "Máquina del tiempo")}
      <h2>Viaja al futuro de tus ahorros ⏳</h2>
      <div><span class="lbl">Ahorro al mes: <b id="lm"></b></span><input type="range" id="m" min="10" max="200" step="10" value="${mes}" aria-label="Ahorro mensual" /></div>
      <div><span class="lbl">Años: <b id="la"></b></span><input type="range" id="a" min="1" max="40" value="${anios}" aria-label="Años" /></div>
      <div><span class="lbl">Rendimiento al año</span><div class="chips" id="t">${[0, 2, 5, 8].map((x) => `<button class="chip" data-t="${x}">${x === 0 ? "Bajo el colchón" : x + " %"}</button>`).join("")}</div></div>
      <div class="card"><div class="chart" id="ch"></div>
        <div class="row between" style="margin-top:10px"><span class="muted">Pusiste</span><b id="pus"></b></div>
        <div class="row between"><span class="muted">Tienes</span><b class="big-num" style="font-size:26px;color:var(--w5)" id="ten"></b></div>
        <div class="row between"><span class="muted">Ganaste solo por esperar</span><b style="color:var(--ok)" id="gan"></b></div></div>
    </div>
    <div class="foot"><button class="btn" id="next">Volver al presente</button></div>`;
  const valor = (a) => { const r = tasa / 100 / 12, n = a * 12; return r ? mes * ((Math.pow(1 + r, n) - 1) / r) : mes * n; };
  const pintar = () => {
    $("#lm", el).textContent = soles(mes); $("#la", el).textContent = anios;
    $$("#t .chip", el).forEach((c) => c.classList.toggle("sel", +c.dataset.t === tasa));
    const pts = Array.from({ length: 8 }, (_, k) => Math.max(1, Math.round(((k + 1) / 8) * anios)));
    const max = valor(anios);
    $("#ch", el).innerHTML = pts.map((a) => {
      const v = valor(a), p = mes * a * 12;
      return `<div class="col"><i class="t" style="height:${(v / max) * 100}%"><i class="p" style="height:${(p / v) * 100}%"></i></i><span>${a}a</span></div>`;
    }).join("");
    const tot = valor(anios), puesto = mes * anios * 12;
    $("#pus", el).textContent = soles(Math.round(puesto)); $("#ten", el).textContent = soles(Math.round(tot)); $("#gan", el).textContent = soles(Math.round(tot - puesto));
  };
  $("#m", el).oninput = (e) => { mes = +e.target.value; pintar(); };
  $("#a", el).oninput = (e) => { anios = +e.target.value; pintar(); };
  $$("#t .chip", el).forEach((c) => (c.onclick = () => { tasa = +c.dataset.t; pintar(); }));
  $("#next", el).onclick = () => { darInsignia("futuro"); addXP(25); siguiente("P38"); };
  pintar();
};

// P39 · Tu yo del futuro (AFP / ONP)
SCREENS.P39 = (el) => {
  let fase = 0, i = 0;
  const pintar = () => {
    if (fase === 0) {
      el.innerHTML = `
        ${barra(pasoPct("P39"))}
        <div class="body">
          ${eyebrowMundo(5, "Tu yo del futuro")}
          <div class="row"><div style="font-size:64px">👵</div><div class="bubble grow">¡Hola! Soy tú a los 65 años. Te cuento cómo llegamos a tener una pensión.</div></div>
          <p class="sub">Cuando trabajes con contrato, una parte de tu sueldo va a tu jubilación. Hay dos sistemas:</p>
          <div class="card" style="border-color:var(--w5)"><h3 style="color:var(--w5)">AFP · Sistema privado</h3><p>Tu plata va a una <b>cuenta a tu nombre</b> y se invierte. Lo que juntes, más lo que gane, es tu pensión.</p></div>
          <div class="card" style="border-color:var(--w3)"><h3 style="color:var(--w3)">ONP · Sistema público</h3><p>Aportas a un <b>fondo común</b>. Si aportas al menos 20 años, recibes una pensión fija.</p></div>
          <div class="card soft">💡 Empezar a aportar joven hace que tu plata crezca más tiempo (¡como en la máquina del tiempo!).</div>
        </div>
        <div class="foot"><button class="btn" id="next">Ponme a prueba</button></div>`;
      $("#next", el).onclick = () => { fase = 1; pintar(); };
      return;
    }
    const q = FUTURO_Q[i];
    el.innerHTML = `${barra(pasoPct("P39"))}<div class="body" id="q"></div><div class="foot" id="f"></div>`;
    const btn = quiz($("#q", el), q, (ok) => sheet({
      ok, title: ok ? "¡Correcto!" : "Casi", text: `La respuesta es: «${q.opts[q.ok]}».`,
      onNext: () => { if (ok) addXP(10); i++; if (i < FUTURO_Q.length) pintar(); else siguiente("P39"); },
    }));
    $("#f", el).appendChild(btn);
  };
  pintar();
};

/* ───────────── Mundo 6 · Tu plata y el país ───────────── */

// P40 · Detective de la boleta
SCREENS.P40 = (el) => {
  const total = 50, base = total / 1.18, igv = total - base;
  let fase = 0;
  const vistos = new Set();
  const pintar = () => {
    if (fase === 0) {
      el.innerHTML = `
        ${barra(pasoPct("P40"))}
        <div class="body">
          ${eyebrowMundo(6, "Detective de la boleta")}
          <h2>Toca cada parte de la boleta 🔍</h2>
          <div class="boleta">
            <button class="zona" data-z="ruc"><b>BODEGA DON PEPE</b><br/>RUC 10xxxxxxxx1</button>
            <div class="row between"><span>Arroz 5 kg</span><span>S/ 28.00</span></div>
            <div class="row between"><span>Aceite 1 L</span><span>S/ 12.00</span></div>
            <div class="row between"><span>Azúcar 2 kg</span><span>S/ 10.00</span></div>
            <hr/>
            <button class="zona" data-z="base"><div class="row between"><span>Op. gravada</span><span>${soles(base)}</span></div></button>
            <button class="zona" data-z="igv"><div class="row between"><span>IGV 18 %</span><span>${soles(igv)}</span></div></button>
            <button class="zona" data-z="total"><div class="row between"><b>TOTAL</b><b>${soles(total)}</b></div></button>
          </div>
          <div class="card soft" id="exp">👆 Toca una parte de la boleta para saber qué es.</div>
        </div>
        <div class="foot"><button class="btn" id="next" disabled>Siguiente</button></div>`;
      const EXP = {
        ruc: "<b>RUC:</b> el número del negocio ante la SUNAT. Así se sabe quién te vendió.",
        base: "<b>Op. gravada:</b> el precio de lo que compraste, sin el impuesto.",
        igv: "<b>IGV:</b> impuesto de 18 %. Ya estaba dentro del precio. Va al Estado.",
        total: "<b>Total:</b> lo que pagaste. Incluye el IGV.",
      };
      $$(".zona", el).forEach((z) => (z.onclick = () => {
        $$(".zona", el).forEach((x) => x.classList.toggle("on", x === z));
        vistos.add(z.dataset.z);
        $("#exp", el).innerHTML = EXP[z.dataset.z];
        $("#next", el).disabled = vistos.size < 4;
      }));
      $("#next", el).onclick = () => { fase = 1; pintar(); };
      return;
    }
    el.innerHTML = `${barra(pasoPct("P40"))}<div class="body" id="q"></div><div class="foot" id="f"></div>`;
    const btn = quiz($("#q", el), { q: "¿Para qué se usa el IGV que pagas?", opts: ["Para el dueño de la bodega", "Para colegios, postas y pistas", "Se pierde"], ok: 1 }, (ok) =>
      sheet({ ok, title: ok ? "¡Exacto!" : "Mmm, no", text: "Con los impuestos se pagan colegios, postas, pistas y más. Por eso pedir boleta ayuda a tu país: si no hay boleta, ese impuesto puede no llegar.", onNext: () => { darInsignia("boleta"); addXP(ok ? 25 : 10); siguiente("P40"); } }));
    $("#f", el).appendChild(btn);
  };
  pintar();
};

// P41 · Tu puesto en la feria
SCREENS.P41 = (el) => {
  let cant = 40, precio = 1.5, intentos = 0;
  el.innerHTML = `
    ${barra(pasoPct("P41"))}
    <div class="body">
      ${eyebrowMundo(6, "Tu puesto en la feria")}
      <h2>Vende marcianos en la feria del cole 🏪</h2>
      <p class="sub">Tienes ${soles(FERIA.capital)}. Cada marciano te cuesta ${soles(FERIA.costo)} y el stand ${soles(FERIA.stand)}.</p>
      <div><span class="lbl">¿Cuántos preparas? <b id="lc"></b></span><input type="range" id="c" min="10" max="${(FERIA.capital - FERIA.stand) / FERIA.costo}" step="5" value="${cant}" aria-label="Cantidad" /></div>
      <div><span class="lbl">¿A cuánto los vendes?</span><div class="chips" id="p">${FERIA.precios.map((x) => `<button class="chip" data-p="${x}">${soles(x)}</button>`).join("")}</div></div>
      <div class="card" id="res"><p class="muted" style="text-align:center">Arma tu plan y abre el puesto.</p></div>
    </div>
    <div class="foot" id="f"><button class="btn" id="abrir">Abrir el puesto</button></div>`;
  const pintar = () => {
    $("#lc", el).textContent = cant;
    $$("#p .chip", el).forEach((c) => c.classList.toggle("sel", +c.dataset.p === precio));
  };
  $("#c", el).oninput = (e) => { cant = +e.target.value; pintar(); };
  $$("#p .chip", el).forEach((c) => (c.onclick = () => { precio = +c.dataset.p; pintar(); }));
  $("#abrir", el).onclick = () => {
    intentos++;
    const vendidos = Math.min(cant, FERIA.demanda[precio]);
    const ingresos = vendidos * precio, costos = cant * FERIA.costo + FERIA.stand, gan = ingresos - costos;
    $("#res", el).innerHTML = `
      <div class="row between"><span>Vendiste</span><b>${vendidos} de ${cant}</b></div>
      <div class="row between"><span>Ingresos</span><b>${soles(ingresos)}</b></div>
      <div class="row between"><span>Costos (marcianos + stand)</span><b>−${soles(costos)}</b></div>
      <hr/>
      <div class="row between"><b>Ganancia</b><b class="big-num" style="font-size:26px;color:${gan >= 0 ? "var(--ok)" : "var(--err)"}">${soles(gan)}</b></div>
      <p class="muted" style="margin-top:6px">${vendidos < cant ? `Te sobraron ${cant - vendidos}: preparaste de más para ese precio.` : FERIA.demanda[precio] > cant ? "¡Se acabaron! Pudiste vender más." : "¡Justo lo que pedían!"}</p>`;
    beep(gan > 0);
    $("#f", el).innerHTML = `<button class="btn" id="next">Cerrar la feria</button><button class="link" id="otra">Probar otro plan</button>`;
    $("#otra", el).onclick = () => go("P41");
    $("#next", el).onclick = () => sheet({
      ok: gan > 0, title: gan > 0 ? `¡Ganaste ${soles(gan)}! 🏪` : "Esta vez perdiste plata",
      text: "Ganancia = ingresos − costos. Un buen negocio piensa cuánto pedirán sus clientes antes de comprar mercadería. Y si creces, te formalizas con RUC y entregas boleta.",
      onNext: () => { S.juegos++; darInsignia("feria"); addXP(gan > 0 ? 40 : 15); siguiente("P41"); },
    });
  };
  pintar();
};

/* ───────────── Siempre contigo ───────────── */

// P42 · Repaso
SCREENS.P42 = (el) => {
  const preguntas = [...REPASO].sort(() => Math.random() - 0.5).slice(0, 5);
  let i = 0, aciertos = 0;
  const pintar = () => {
    if (i === preguntas.length) {
      el.innerHTML = `
        <div class="body center">${pablo(aciertos >= 4 ? "celebra" : "explica", "mid pop")}
          <h2>Repaso terminado</h2><div class="big-num">${aciertos}/${preguntas.length}</div>
          <p class="sub">${aciertos >= 4 ? "¡Tu memoria está on fire! 🔥" : "Repasar seguido es lo que hace que no se te olvide. ¡Vuelve mañana!"}</p></div>
        <div class="foot"><button class="btn" id="otra">Otro repaso</button><button class="link" data-go="P05">Volver al inicio</button></div>`;
      $("#otra", el).onclick = () => go("P42");
      return;
    }
    el.innerHTML = `${barra(((i + 1) / preguntas.length) * 100, { close: "P05" })}<div class="body"><span class="eyebrow">Repaso · ${i + 1} de ${preguntas.length}</span><div id="q" class="stack" style="gap:14px"></div></div><div class="foot" id="f"></div>`;
    const q = preguntas[i];
    const btn = quiz($("#q", el), q, (ok) => {
      if (ok) aciertos++;
      sheet({ ok, title: ok ? "¡Bien!" : "Casi", text: ok ? "" : `Era: «${q.opts[q.ok]}».`, onNext: () => { if (ok) addXP(5); i++; pintar(); } });
    });
    $("#f", el).appendChild(btn);
  };
  pintar();
};

// P43 · Álbum de figuritas
SCREENS.P43 = (el) => {
  const figus = [];
  Object.entries(FLOWS).forEach(([n, f]) => {
    const mundo = MUNDOS[n - 1];
    const ids = n === "1" ? ["P11", "P13", "P14", "P16", "P20", "P23"] : f;
    ids.forEach((id) => figus.push({ id, n: +n, emo: n === "1" ? { P11: "🧺", P13: "📢", P14: "🐜", P16: "🎂", P20: "📝", P23: "👑" }[id] : ICONOS[id], t: NOMBRES[id], color: mundo.color, ok: mundoHecho(+n) || getStep(+n) > FLOWS[n].indexOf(id) }));
  });
  const tengo = figus.filter((f) => f.ok).length;
  el.innerHTML = `
    <div class="body">
      <div class="row between"><h2>Álbum</h2><b>${tengo}/${figus.length}</b></div>
      <div class="bar"><i style="width:${(tengo / figus.length) * 100}%"></i></div>
      <p class="sub">Cada juego que terminas pega una figurita. ¡Llénalo!</p>
      ${MUNDOS.map((m) => `
        <h3 style="color:${m.color}">${m.emo} Mundo ${m.n} · ${m.nombre}</h3>
        <div class="badges">${figus.filter((f) => f.n === m.n).map((f) => `
          <button class="figu ${f.ok ? "" : "off"}" ${f.ok ? `data-go="${f.id}"` : "disabled"} style="--c:${f.color}"><span class="bi">${f.ok ? f.emo : "❔"}</span>${f.ok ? f.t : "???"}</button>`).join("")}</div>`).join("")}
    </div>
    ${tabs("")}`;
};

// P44 · Personaliza a Pablo
const monedas = () => Math.floor(S.xp / 10) - S.gastadas;
function pabloVestido(cls = "mid") {
  const r = S.ropa, cab = ROPA.find((x) => x.id === r.cabeza), cara = ROPA.find((x) => x.id === r.cara);
  return `<div class="avatar ${cls}" style="background:${FONDOS[r.fondo] || FONDOS.lavanda}">
    ${pablo("saluda")}
    ${cab ? `<span class="acc cabeza">${cab.emo}</span>` : ""}
    ${cara ? `<span class="acc cara ${cara.id}">${cara.emo}</span>` : ""}
  </div>`;
}
SCREENS.P44 = (el) => {
  S.compradas = S.compradas || [];
  const pintar = () => {
    el.innerHTML = `
      ${barra(100, { close: "P05", xp: false })}
      <div class="body">
        <div class="row between"><h2>Viste a Pablo</h2><button class="chip" data-info="monedas">🪙 ${monedas()}</button></div>
        <div class="center" style="display:flex;justify-content:center">${pabloVestido("big")}</div>
        <p class="muted" style="text-align:center">Ganas 1 moneda por cada 10 XP.</p>
        <h3>Accesorios</h3>
        <div class="badges">${ROPA.map((x) => {
          const tiene = S.compradas.includes(x.id), puesto = S.ropa[x.slot] === x.id;
          return `<button class="badge ${puesto ? "puesto" : ""}" data-id="${x.id}"><span class="bi">${x.emo}</span>${x.t}<br/><small>${puesto ? "Puesto ✓" : tiene ? "Ponérselo" : "🪙 " + x.precio}</small></button>`;
        }).join("")}</div>
        <h3>Fondo</h3>
        <div class="chips">${Object.entries(FONDOS).map(([k, c]) => `<button class="color ${S.ropa.fondo === k ? "sel" : ""}" data-f="${k}" style="background:${c}" aria-label="${k}"></button>`).join("")}</div>
      </div>
      <div class="foot"><button class="btn" data-go="P45">Ver mi perfil</button></div>`;
    $$("[data-id]", el).forEach((b) => (b.onclick = () => {
      const x = ROPA.find((r) => r.id === b.dataset.id);
      if (!S.compradas.includes(x.id)) {
        if (monedas() < x.precio) return toast(`Te faltan ${x.precio - monedas()} monedas 🪙`);
        S.gastadas += x.precio; S.compradas.push(x.id); beep(true); toast(`¡Compraste ${x.t}!`);
      }
      S.ropa[x.slot] = S.ropa[x.slot] === x.id ? null : x.id;
      save(); pintar();
    }));
    $$("[data-f]", el).forEach((b) => (b.onclick = () => { S.ropa.fondo = b.dataset.f; save(); pintar(); }));
  };
  pintar();
};

// P45 · Perfil
SCREENS.P45 = (el) => {
  if (!S.onboarded) return go("P01");
  const mundosHechos = [1, 2, 3, 4, 5, 6].filter(mundoHecho).length;
  el.innerHTML = `
    <div class="body">
      <div class="row">
        <button data-go="P44" style="border:0;background:none;padding:0" aria-label="Personalizar a Pablo">${pabloVestido("sm")}</button>
        <div class="grow"><h2>${esc(S.name || "Sin nombre")}</h2><p class="sub">${S.grado} de secundaria · ${S.minutos} min al día</p>
          <button class="link" data-go="P44" style="padding:0">👕 Personalizar a Pablo</button></div>
      </div>
      <div class="grid2">
        <button class="card tapcard" data-info="xp"><p class="muted">Nivel</p><h2>${nivel()}</h2></button>
        <button class="card tapcard" data-info="xp"><p class="muted">XP total</p><h2>⚡ ${S.xp}</h2></button>
        <button class="card tapcard" data-info="racha"><p class="muted">Racha</p><h2>🔥 ${S.racha.count} ${S.racha.count === 1 ? "día" : "días"}</h2></button>
        <button class="card tapcard" data-go="P07"><p class="muted">Mundos</p><h2>🗺️ ${mundosHechos}/6</h2></button>
      </div>
      <div class="row between"><h3>Insignias · ${S.badges.length}/${INSIGNIAS.length}</h3><button class="link" data-go="P43">Ver álbum</button></div>
      ${insigniasHTML()}
      <button class="btn ghost" data-go="INDICE">Ver todas las pantallas</button>
      <button class="option" id="sonido"><span class="emo">${S.sonido === false ? "🔇" : "🔊"}</span><span class="grow">Sonidos y vibración</span><b>${S.sonido === false ? "Apagados" : "Encendidos"}</b></button>
      <button class="btn ghost" id="reset">Reiniciar mi progreso</button>
    </div>
    ${tabs("P45")}`;
  $("#sonido", el).onclick = () => { S.sonido = S.sonido === false; save(); go("P45"); };
  $("#reset", el).onclick = () => {
    sheet({
      info: "🗑️", title: "¿Borrar tu progreso?", text: "Se borran tu XP, racha, insignias y mundos en este navegador. No se puede deshacer.",
      btn: "Sí, borrar todo", alt: "Cancelar",
      onNext: () => { S = NUEVO(); save(); go("P01"); },
    });
  };
};
