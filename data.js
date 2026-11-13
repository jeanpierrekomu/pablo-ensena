// Contenido de Pablo Enseña · Empezar + Mundo 1
// Para cambiar textos, preguntas o premios, edita solo este archivo.

const POSES = {
  saluda: "assets/pablo-saludando.png",
  senala: "assets/pablo-senalando.png",
  explica: "assets/pablo-explicando.png",
  celebra: "assets/pablo-celebrando.png",
  anota: "assets/pablo-anotando.png",
  busca: "assets/pablo-buscando.png",
};

const OBJETIVOS = [
  { id: "ahorrar", emo: "🐷", txt: "Ahorrar para algo que quiero" },
  { id: "entender", emo: "🧠", txt: "Entender en qué se va mi plata" },
  { id: "casa", emo: "🏠", txt: "Ayudar con los gastos de casa" },
  { id: "emprender", emo: "🚀", txt: "Tener mi propio negocio" },
];

const GRADOS = ["1.º", "2.º", "3.º", "4.º", "5.º"];
const MINUTOS = [5, 10, 15];

// P04 · Examen inicial (también sirve para medir el avance en P25)
const EXAMEN = [
  {
    q: "Tienes S/ 20 para la semana. ¿Qué pagas primero?",
    opts: ["Un sticker nuevo", "El pasaje para ir al colegio", "Monedas para un juego"],
    ok: 1,
  },
  {
    q: "Un anuncio dice «¡Solo hoy! 50 % de descuento». ¿Qué haces?",
    opts: ["Lo compro ya, antes que se acabe", "Me pregunto si de verdad lo necesito", "Pido prestado para comprarlo"],
    ok: 1,
  },
  {
    q: "Gastas S/ 2 al día en galletas. ¿Cuánto es en 30 días?",
    opts: ["S/ 20", "S/ 32", "S/ 60"],
    ok: 2,
  },
];

const MUNDOS = [
  { n: 1, nombre: "Tu dinero", tema: "Necesidades, deseos y publicidad", color: "var(--w1)", emo: "💰" },
  { n: 2, nombre: "El poder del ahorro", tema: "Metas y alcancía", color: "var(--w2)", emo: "🐷" },
  { n: 3, nombre: "Controla tu presupuesto", tema: "Prioridades y derechos", color: "var(--w3)", emo: "📊" },
  { n: 4, nombre: "Crédito y decisiones", tema: "Cuotas, intereses y estafas", color: "var(--w4)", emo: "💳" },
  { n: 5, nombre: "Construye tu futuro", tema: "Interés compuesto y pensiones", color: "var(--w5)", emo: "🔭" },
  { n: 6, nombre: "Tu plata y el país", tema: "Boletas e impuestos", color: "var(--w6)", emo: "🇵🇪" },
];

// Orden de pantallas del Mundo 1 (P08 → P25). El mapa agrupa estos pasos en 6 paradas.
const MUNDO1 = [
  "P08", "P09", "P10", "P11", "P12", "P13", "P14", "P16", "P17",
  "P18", "P19", "P20", "P21", "P22", "P23", "P24", "P25",
];
const PARADAS = [
  { emo: "📖", nombre: "La historia de Vale", desde: "P08", hasta: "P10" },
  { emo: "🧺", nombre: "Juegos rápidos", desde: "P11", hasta: "P13" },
  { emo: "🐜", nombre: "Gasto hormiga", desde: "P14", hasta: "P17" },
  { emo: "📝", nombre: "Reto de la vida real", desde: "P18", hasta: "P20" },
  { emo: "👑", nombre: "Jefe: el Vendedor Tentador", desde: "P21", hasta: "P23", boss: true },
  { emo: "🏆", nombre: "Tu avance", desde: "P24", hasta: "P25" },
];

// P09 · Historia
const HISTORIA = [
  { narr: "Sábado, 10 a. m. Vale tiene 14 años y vive en Villa El Salvador." },
  { who: "Tía Rosa", txt: "¡Vale! Toma estos S/ 50 por ayudarme en la bodega toda la semana. 💛" },
  { me: true, txt: "¡Gracias, tía! 😍" },
  { narr: "Camino a casa, Vale pasa por la galería…" },
  { who: "Vendedor", txt: "¡Audífonos gamer a S/ 45! ¡Solo hoy! Todos tus amigos ya tienen unos." },
  { me: true, txt: "Mmm… pero el lunes tengo que pagar mis pasajes y la copia del libro." },
  { who: "Pablo", txt: "¡Buena pregunta, Vale! Antes de comprar, separa lo que NECESITAS de lo que DESEAS. Te enseño. 👇" },
];

// P10 · Lección interactiva
const LECCION = {
  conceptos: [
    { t: "Necesidad", emo: "🍚", color: "var(--ok)", d: "Lo que necesitas para vivir y estudiar: comida, pasaje, útiles, salud.", ej: ["Almuerzo", "Pasaje", "Cuaderno"] },
    { t: "Deseo", emo: "🎧", color: "var(--w4)", d: "Lo que te gusta, pero puedes vivir sin eso. ¡No está mal! Solo va después.", ej: ["Audífonos gamer", "Skin", "Gaseosa grande"] },
  ],
  pregunta: {
    q: "Vale necesita zapatillas para Educación Física. ¿Unas zapatillas de marca de S/ 300 son…?",
    opts: ["Una necesidad, porque las necesita", "Un deseo: la necesidad son zapatillas, la marca es un gusto", "Ni necesidad ni deseo"],
    ok: 1,
    bien: "¡Exacto! La necesidad es tener zapatillas. Pagar extra por la marca es un deseo.",
    mal: "Casi. Tener zapatillas sí es una necesidad, pero pagar S/ 300 por la marca es un gusto: un deseo.",
  },
};

// P11 · Clasifica
const CLASIFICA = [
  { t: "🚌 Pasaje al cole", n: true },
  { t: "🎮 Skin para el juego", n: false },
  { t: "🍚 Almuerzo", n: true },
  { t: "🥤 Gaseosa grande", n: false },
  { t: "📓 Cuaderno", n: true },
  { t: "⚽ Polo de tu equipo", n: false },
];

// P12 · ¿Lo compro?
const LOCOMPRO = [
  { emo: "🎧", t: "Audífonos gamer", precio: 45, ctx: "Tienes S/ 50. Tus audífonos todavía funcionan.", ok: "esperar", porque: "Funcionan los tuyos y te quedarías sin plata para el pasaje. Mejor ahorra para ellos." },
  { emo: "🚌", t: "Pasaje de la semana", precio: 10, ctx: "Sin pasaje no llegas al colegio.", ok: "comprar", porque: "Es una necesidad y te alcanza. ¡Va primero!" },
  { emo: "✨", t: "Pack de stickers en oferta", precio: 10, ctx: "No pensabas comprarlo hasta que viste la oferta.", ok: "esperar", porque: "Si no lo pensabas comprar, la oferta no te ahorra: te hace gastar." },
];

// P13 · Caza la publicidad (← trampa · → info útil)
const ANUNCIOS = [
  { ad: "¡SOLO HOY! Quedan 3 unidades 🔥", trampa: true, porque: "Te apura para que no lo pienses. Es urgencia falsa." },
  { ad: "Precio: S/ 25. Garantía de 6 meses.", trampa: false, porque: "Te da datos reales para decidir. ¡Eso sí sirve!" },
  { ad: "Todos tus amigos ya lo tienen 😎", trampa: true, porque: "Es presión de grupo. Lo que tengan otros no cambia lo que tú necesitas." },
  { ad: "Págalo en 12 cuotas «sin darte cuenta»", trampa: true, porque: "Las cuotas suman más de lo que parece. ¡Sí te vas a dar cuenta!" },
  { ad: "La etiqueta dice ingredientes y fecha de vencimiento", trampa: false, porque: "Es información que te protege. ¡Bien leído!" },
];

// P14 · Gasto hormiga
const ANTOJOS = [
  { emo: "🍪", t: "Galletas", precio: 1.5 },
  { emo: "🥤", t: "Gaseosa", precio: 2.5 },
  { emo: "🍭", t: "Chupetín", precio: 0.5 },
  { emo: "🍟", t: "Papitas", precio: 2 },
];
const EQUIVALENCIAS = [
  { min: 0, t: "un cuaderno", emo: "📓" },
  { min: 40, t: "una entrada al cine", emo: "🎬" },
  { min: 100, t: "unas zapatillas", emo: "👟" },
  { min: 250, t: "un celular básico", emo: "📱" },
];

// P16 · Simulación S/ 100
const SIMULACION = [
  { id: "ahorro", emo: "🐷", t: "Ahorrar", ini: 0 },
  { id: "quiero", emo: "🎧", t: "Algo que quiero", ini: 0 },
  { id: "salida", emo: "🍕", t: "Salida con amigos", ini: 0 },
  { id: "regalo", emo: "🎁", t: "Regalo o ayudar en casa", ini: 0 },
];

// P17 · Lo que aprendiste
const APRENDISTE = [
  "Una necesidad va primero; un deseo puede esperar.",
  "La publicidad usa trucos: urgencia, presión de amigos y cuotas.",
  "Los gastos pequeños, juntos, se vuelven grandes: gasto hormiga.",
  "Separar una parte para ahorrar desde el inicio te da opciones.",
];

// P19 · Registro (ejemplos rápidos)
const EJEMPLOS_REGISTRO = [
  { t: "Pasaje", monto: 2, n: true },
  { t: "Galletas", monto: 1.5, n: false },
  { t: "Copia del libro", monto: 3, n: true },
  { t: "Gaseosa", monto: 2.5, n: false },
];

// P21–P23 · Jefe: el Vendedor Tentador
const JEFE = {
  nombre: "El Vendedor Tentador",
  vidas: 3,
  rondas: [
    [
      { q: "«Compra 2 y lleva 3» en chocolates que no pensabas comprar. ¿Qué es?", opts: ["Una oportunidad única", "Una forma de hacerte gastar más", "Un regalo"], ok: 1 },
      { q: "¿Cuál de estas es un DESEO?", opts: ["Útiles escolares", "Pasaje al colegio", "Funda nueva para el celular"], ok: 2 },
    ],
    [
      { q: "Tienes S/ 30 y necesitas S/ 10 para pasajes. ¿Cuánto puedes usar en un gusto sin problemas?", opts: ["S/ 30", "Hasta S/ 20", "S/ 40, pidiendo prestado"], ok: 1 },
      { q: "Gastas S/ 3 cada día de colegio en snacks. ¿Cuánto es en una semana de 5 días?", opts: ["S/ 15", "S/ 3", "S/ 21"], ok: 0 },
      { q: "El vendedor dice «¡Todos lo tienen!». Tu mejor respuesta:", opts: ["Entonces lo compro", "Lo pienso: ¿de verdad lo necesito?", "Le pido plata a mi familia"], ok: 1 },
    ],
  ],
};

const INSIGNIAS = [
  { id: "inicio", emo: "🌱", t: "Primer paso" },
  { id: "clasifica", emo: "🧺", t: "Ordenado" },
  { id: "detective", emo: "🕵️", t: "Detective de anuncios" },
  { id: "hormiga", emo: "🐜", t: "Cazahormigas" },
  { id: "reto", emo: "📝", t: "Reto real" },
  { id: "jefe", emo: "👑", t: "Venciste al Vendedor" },
];

const MISIONES = [
  { id: "xp", t: "Gana 150 XP", meta: 150, emo: "⚡" },
  { id: "juegos", t: "Termina 4 juegos", meta: 4, emo: "🎮" },
  { id: "racha", t: "Practica 3 días seguidos", meta: 3, emo: "🔥" },
  { id: "reto", t: "Anota 3 compras reales", meta: 3, emo: "📝" },
];

const NIVEL_XP = 200; // XP por nivel

/* ───────────── Mundos 2 a 6 ───────────── */
const FLOWS = {
  1: MUNDO1,
  2: ["P26", "P27", "P28", "P29"],
  3: ["P30", "P31", "P32", "P33"],
  4: ["P34", "P35", "P36", "P37"],
  5: ["P38", "P39"],
  6: ["P40", "P41"],
};
const NOMBRES = {
  P01: "Bienvenida", P02: "Onboarding · Objetivo", P03: "Personalización", P04: "Examen inicial", P05: "Inicio", P06: "Misiones de la semana", P07: "Mapa",
  P08: "Detalle de lección", P09: "Historia", P10: "Lección interactiva", P11: "Clasifica", P12: "¿Lo compro?", P13: "Caza la publicidad", P14: "Gasto hormiga",
  P15: "Error amable", P16: "Simulación S/ 100", P17: "Lo que aprendiste", P18: "Reto vida real", P19: "Registro", P20: "Resultados",
  P21: "Jefe · intro", P22: "Jefe · rondas", P23: "Jefe superado", P24: "Subiste de nivel", P25: "Tu avance",
  P26: "¡Mundo 2 desbloqueado!", P27: "Arma tu meta", P28: "Alcancía", P29: "Misión 7 días",
  P30: "Elige tu camino", P31: "Ordena prioridades", P32: "Defiende tus derechos", P33: "Reto con tu familia",
  P34: "Cuotas", P35: "Carrera de intereses", P36: "Detective de estafas", P37: "¿Quién cuida tu plata?",
  P38: "Máquina del tiempo", P39: "Tu yo del futuro",
  P40: "Detective de la boleta", P41: "Tu puesto en la feria",
  P42: "Repaso", P43: "Álbum", P44: "Personaliza a Pablo", P45: "Perfil",
  D01: "Aliado", D02: "Panel docente", D03: "Ciudad Pablo", D04: "Escape room", D05: "Liga del salón", D06: "Copa Pablo", D07: "Vista docente",
};
const ICONOS = {
  P26: "🎉", P27: "🎯", P28: "🐷", P29: "📅", P30: "🛤️", P31: "🔢", P32: "⚖️", P33: "👨‍👩‍👧",
  P34: "💳", P35: "🏁", P36: "🕵️", P37: "🏦", P38: "⏳", P39: "👵", P40: "🧾", P41: "🏪",
};
const CAPITULOS = [
  { t: "Empezar", ids: ["P01", "P02", "P03", "P04", "P05", "P06", "P07"] },
  { t: "Mundo 1 · Tu dinero", ids: ["P08", "P09", "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20", "P21", "P22", "P23", "P24", "P25"] },
  { t: "Mundo 2 · El poder del ahorro", ids: FLOWS[2] },
  { t: "Mundo 3 · Controla tu presupuesto", ids: FLOWS[3] },
  { t: "Mundo 4 · Crédito y decisiones", ids: FLOWS[4] },
  { t: "Mundo 5 · Construye tu futuro", ids: FLOWS[5] },
  { t: "Mundo 6 · Tu plata y el país", ids: FLOWS[6] },
  { t: "Siempre contigo", ids: ["P42", "P43", "P44", "P45"] },
  { t: "En el salón (docente)", ids: ["D01", "D02", "D03", "D04", "D05", "D06", "D07"] },
];

INSIGNIAS.push(
  { id: "ahorro", emo: "🐷", t: "Meta lograda" },
  { id: "derechos", emo: "⚖️", t: "Defensor" },
  { id: "estafas", emo: "🛡️", t: "Antiestafas" },
  { id: "futuro", emo: "🔭", t: "Viajero del tiempo" },
  { id: "boleta", emo: "🧾", t: "Pide boleta" },
  { id: "feria", emo: "🏪", t: "Emprendedor" },
);

// P27 · Metas
const METAS = [
  { emo: "🎧", t: "Audífonos", precio: 120 },
  { emo: "👟", t: "Zapatillas", precio: 180 },
  { emo: "🎁", t: "Regalo para mamá", precio: 60 },
  { emo: "🎒", t: "Mochila nueva", precio: 90 },
];

// P28 · Tentaciones de la alcancía
const TENTACIONES = [
  { t: "Tus amigos compran gaseosa a la salida", costo: 3 },
  { t: "Ves un llavero de tu anime favorito", costo: 8 },
  { t: "Hay promo de hamburguesa en la esquina", costo: 6 },
  { t: "Te ofrecen stickers para el cuaderno", costo: 4 },
];

// P30 · Elige tu camino
const CAMINO = {
  inicio: 80,
  pasajes: 30,
  pasos: [
    { t: "Es sábado y tus amigos van al cine.", a: { t: "🎬 Voy al cine con canchita", c: 18 }, b: { t: "🍿 Propongo ver una peli en casa", c: 4 } },
    { t: "Se te acaban los datos del celular.", a: { t: "📶 Recargo el paquete grande", c: 15 }, b: { t: "📶 Uso el wifi del cole y recargo lo básico", c: 5 } },
    { t: "Sale una oferta de polos en la galería.", a: { t: "👕 Me llevo dos", c: 30 }, b: { t: "🙅 Hoy no, no lo necesito", c: 0 } },
  ],
};

// P31 · Ordena prioridades (orden correcto)
const PRIORIDADES = ["🚌 Pasajes al colegio", "📚 Materiales del proyecto", "📱 Recarga del celular", "🍕 Salida con amigos", "👕 Polo nuevo"];

// P32 · Defiende tus derechos (Código de Protección y Defensa del Consumidor)
const DERECHOS = [
  { q: "Compraste audífonos y a los 3 días dejaron de sonar. ¿Qué haces?", opts: ["Pierdo mi plata, ni modo", "Pido cambio o reparación: tengo garantía", "Lo publico en redes y listo"], ok: 1, porque: "Todo producto debe funcionar como se ofreció. Guarda tu boleta: con ella reclamas." },
  { q: "En la tienda no te quieren atender el reclamo. ¿Qué pides?", opts: ["El Libro de Reclamaciones", "Hablar con otro cliente", "Nada, me voy"], ok: 0, porque: "Todo negocio debe tener Libro de Reclamaciones, físico o virtual. Te deben dar una copia." },
  { q: "En la vitrina dice S/ 30, pero en caja te cobran S/ 35. ¿Cuánto debes pagar?", opts: ["S/ 35, lo que dice la caja", "S/ 30, el precio que mostraron", "Lo que yo quiera"], ok: 1, porque: "El precio que te muestran es el que deben respetar." },
];

// P33 · Reto con tu familia (presupuesto de práctica)
const LONCHE = {
  presupuesto: 60,
  items: [
    { emo: "🥖", t: "Pan (20 unidades)", precio: 6 },
    { emo: "🧀", t: "Queso fresco", precio: 12 },
    { emo: "🥛", t: "Leche", precio: 7 },
    { emo: "🍌", t: "Frutas", precio: 10 },
    { emo: "🥤", t: "Gaseosa 3 L", precio: 9 },
    { emo: "🍪", t: "Galletas", precio: 5 },
    { emo: "🥓", t: "Jamonada", precio: 9 },
    { emo: "🧈", t: "Mantequilla", precio: 6 },
    { emo: "🎂", t: "Torta", precio: 25 },
  ],
};

// P36 · Detective de estafas
const MENSAJES = [
  { de: "Número desconocido", txt: "🎉 ¡Ganaste un iPhone! Solo yapea S/ 20 para el envío.", estafa: true, porque: "Nadie te regala un premio pidiéndote plata primero." },
  { de: "SMS", txt: "BANCO: tu cuenta será bloqueada. Entra aquí: banco-seguro-pe.xyz", estafa: true, porque: "Los bancos no te mandan links para «desbloquear». Mira la dirección rara." },
  { de: "Número nuevo", txt: "Hola hijo, soy mamá, cambié de número. Yapéame S/ 100 urgente 🙏", estafa: true, porque: "Siempre llama al número de siempre antes de mandar plata." },
  { de: "Colegio (grupo oficial)", txt: "Mañana no hay clases por el simulacro de sismo.", estafa: false, porque: "Es información, no te pide plata ni datos." },
  { de: "App de tu billetera", txt: "Recibiste S/ 10 de Tía Rosa.", estafa: false, porque: "Es un aviso de que te llegó plata. No te pide nada." },
];

// P37 · ¿Quién cuida tu plata?
const ENTIDADES = [
  { emo: "🏦", t: "Banco", sbs: true },
  { emo: "🏛️", t: "Caja municipal", sbs: true },
  { emo: "💸", t: "Préstamo «gota a gota»", sbs: false },
  { emo: "🤝", t: "Cooperativa de ahorro y crédito", sbs: true },
  { emo: "📈", t: "«Duplica tu plata en 30 días»", sbs: false },
  { emo: "🏢", t: "Financiera", sbs: true },
];

// P39 · AFP / ONP
const FUTURO_Q = [
  { q: "En la AFP, la plata que aportas…", opts: ["Va a una cuenta a tu nombre y se invierte", "Se pierde si cambias de trabajo", "La usa el colegio"], ok: 0 },
  { q: "En la ONP, para tener pensión necesitas…", opts: ["Aportar al menos 20 años", "Tener 18 años", "Pagar una vez"], ok: 0 },
];

// P41 · Feria
const FERIA = { capital: 40, costo: 0.5, stand: 5, precios: [1, 1.5, 2], demanda: { 1: 70, 1.5: 50, 2: 28 } };

// P42 · Repaso (mezcla de todos los mundos)
const REPASO = [
  ...EXAMEN,
  ...JEFE.rondas.flat(),
  ...DERECHOS.map(({ q, opts, ok }) => ({ q, opts, ok })),
  ...FUTURO_Q,
  { q: "Un celular cuesta S/ 600 al contado o 12 cuotas de S/ 65. ¿Cuánto pagas de más en cuotas?", opts: ["S/ 65", "S/ 180", "Nada"], ok: 1 },
  { q: "De una compra de S/ 118, ¿cuánto es IGV (18 %)?", opts: ["S/ 18", "S/ 21.24", "S/ 11.80"], ok: 0 },
];

// P44 · Ropa para Pablo
const ROPA = [
  { id: "birrete", slot: "cabeza", emo: "🎓", t: "Birrete", precio: 30 },
  { id: "gorra", slot: "cabeza", emo: "🧢", t: "Gorra", precio: 20 },
  { id: "corona", slot: "cabeza", emo: "👑", t: "Corona", precio: 60 },
  { id: "lentes", slot: "cara", emo: "👓", t: "Lentes", precio: 15 },
  { id: "sol", slot: "cara", emo: "🕶️", t: "Lentes de sol", precio: 25 },
  { id: "mono", slot: "cara", emo: "🎀", t: "Moño", precio: 10 },
];
const FONDOS = { lavanda: "#E4DEFA", menta: "#D3F3E3", cielo: "#DCE8FF", durazno: "#FFE6CC", rosa: "#FCE1EA" };
