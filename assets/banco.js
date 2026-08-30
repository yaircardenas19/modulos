/* ─────────────────────────────────────────────────────────
   Banco renovable de ejercicios.
   Cada visita genera enunciados con parámetros distintos.
   Esto es lo que hace que el módulo impreso no envejezca:
   el QR es el mismo, el contenido detrás cambia.
   ───────────────────────────────────────────────────────── */
(function () {
  "use strict";
  var RC = window.RC = window.RC || {};

  /* ── utilidades ── */
  function ale(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function elegir(v) { return v[Math.floor(Math.random() * v.length)]; }
  function mezclar(v) {
    var a = v.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function pesos(n) {
    return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function dec(n, d) {
    return Number(n).toFixed(d === undefined ? 2 : d).replace(".", ",");
  }
  /* Como dec, pero sin ceros de relleno al final: 64,0000 → 64 */
  function limpio(n, d) {
    var s = dec(n, d === undefined ? 4 : d);
    if (s.indexOf(",") < 0) return s;
    return s.replace(/0+$/, "").replace(/,$/, "");
  }
  function mcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
  function mcm(a, b) { return a * b / mcd(a, b); }
  /* ── conteo (caps. 12 y 13) ── */
  function mil(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function fact(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
  function perm(n, r) { var v = 1; for (var i = 0; i < r; i++) v *= (n - i); return v; }
  function comb(n, r) { return perm(n, r) / fact(r); }
  function bajando(n, r) { var v = []; for (var i = 0; i < r; i++) v.push(n - i); return v.join(" × "); }
  function factorizar(n) {
    var f = [], d = 2;
    while (n > 1) { var e = 0; while (n % d === 0) { n /= d; e++; } if (e) f.push([d, e]); d++; if (d * d > n && n > 1) { f.push([n, 1]); break; } }
    return f;
  }
  function factorTexto(n) {
    return factorizar(n).map(function (p) { return p[1] > 1 ? p[0] + "^" + p[1] : "" + p[0]; }).join(" × ");
  }

  var NOMBRES = ["Karen", "Daniela", "Andrés", "Laura", "Santiago", "Valentina", "Kevin", "Sara", "José Miguel", "Camila"];
  var TIENDAS = ["la tienda del barrio", "el almacén del centro", "la papelería", "el supermercado", "la ferretería"];
  var CIUDADES = ["Barranquilla", "Soledad", "Malambo", "Puerto Colombia", "Santa Marta"];

  /* ═══════════ CAPÍTULO 0 · Resolución de problemas ═══════════ */
  var G = {};

  G.c00 = [
    function () {
      var m = ale(6, 14), c = ale(6, 14);
      return { niv: "N2", e: "En un parqueadero solo hay motos y carros. Se cuentan <b>" + (m + c) +
        " vehículos</b> y <b>" + (2 * m + 4 * c) + " llantas</b>. ¿Cuántas motos y cuántos carros hay?",
        s: m + " motos y " + c + " carros. Suponiendo que todos fueran motos habría " + 2 * (m + c) +
           " llantas; faltan " + (2 * m + 4 * c - 2 * (m + c)) + ", y cada carro agrega 2." };
    },
    function () {
      var b = ale(3, 9) * 50, d = ale(2, 6) * 500;
      return { niv: "N2", e: "Un cuaderno y un lápiz cuestan <b>" + pesos(2 * b + d) + "</b> en total. El cuaderno cuesta <b>" +
        pesos(d) + " más</b> que el lápiz. ¿Cuánto cuesta el lápiz?",
        s: "El lápiz cuesta " + pesos(b) + " y el cuaderno " + pesos(b + d) + ". Verifica: suman " + pesos(2 * b + d) + "." };
    },
    function () {
      var x = ale(3, 15), a = ale(2, 9), k = ale(2, 6);
      return { niv: "N1", e: "Pensé un número, le sumé <b>" + a + "</b>, multipliqué por <b>" + k +
        "</b> y obtuve <b>" + k * (x + a) + "</b>. ¿Qué número pensé?",
        s: x + ". Ve hacia atrás: " + k * (x + a) + " ÷ " + k + " = " + (x + a) + ", y " + (x + a) + " − " + a + " = " + x + "." };
    },
    function () {
      var n = ale(5, 12);
      return { niv: "N2", e: "En una reunión de <b>" + n + " personas</b> cada una saluda de mano a todas las demás exactamente una vez. ¿Cuántos saludos hay?",
        s: (n * (n - 1) / 2) + ". Simplifica el caso: con 3 personas hay 3, con 4 hay 6. La regla es n × (n − 1) ÷ 2." };
    },
    function () {
      var sube = ale(3, 5), baja = sube - ale(1, 2), alto = sube * ale(3, 6);
      var dias = Math.ceil((alto - sube) / (sube - baja)) + 1;
      return { niv: "N3", e: "Un caracol sube <b>" + sube + " m</b> de día y resbala <b>" + baja +
        " m</b> de noche por un muro de <b>" + alto + " m</b>. ¿En qué día llega arriba?",
        s: "Día " + dias + ". Avanza " + (sube - baja) + " m netos al día, pero el último día llega antes de resbalar." };
    },
    function () {
      var d = elegir(["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]);
      var n = ale(40, 200);
      var ds = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
      var r = ds[(ds.indexOf(d) + n) % 7];
      return { niv: "N2", e: "Si hoy es <b>" + d + "</b>, ¿qué día de la semana será dentro de <b>" + n + " días</b>?",
        s: r + ". Divide " + n + " entre 7: el residuo es " + (n % 7) + ", así que avanzas " + (n % 7) + " días desde el " + d + "." };
    },
    function () {
      var a = ale(2, 4), r = ale(2, 3), t = 5;
      var seq = [a]; for (var i = 1; i < 4; i++) seq.push(seq[i - 1] * r + 1);
      var sig = seq[3] * r + 1;
      return { niv: "N1", e: "Continúa la secuencia y escribe la regla: <b>" + seq.join(", ") + ", …</b>",
        s: "Sigue " + sig + ". Cada término es el anterior multiplicado por " + r + " y más 1." };
    },
    function () {
      var p = ale(3, 6), v = ale(2, 5) * 10000;
      return { niv: "N3", e: "<b>" + p + " personas</b> se reparten un premio: cada una recibe <b>la mitad</b> de lo que recibió la anterior. La última recibió <b>" +
        pesos(v) + "</b>. ¿De cuánto era el premio total?",
        s: pesos(v * (Math.pow(2, p) - 1)) + ". Ve hacia atrás duplicando: la última recibió " + pesos(v) + ", la anterior " + pesos(2 * v) + ", y así." };
    }
  ];

  /* ═══════════ CAPÍTULO 1 · Números ═══════════ */
  G.c01 = [
    function () {
      var num = elegir([3, 5, 7, 9, 11]), den = elegir([8, 16, 20, 25, 40]);
      var d = num / den;
      return { niv: "N1", e: "Escribe <b>" + num + "/" + den + "</b> como número decimal y como porcentaje.",
        s: dec(d, 4).replace(/,?0+$/, "") + " y " + dec(d * 100, 2).replace(/,?0+$/, "") + " %. La raya de fracción es una división: " + num + " ÷ " + den + "." };
    },
    function () {
      var a = elegir([3, 5, 7]), b = elegir([8, 16]), c = ale(35, 65) / 100;
      var fa = a / b;
      return { niv: "N2", e: "¿Cuál cantidad es mayor: <b>" + a + "/" + b + "</b> o <b>" + dec(c, 2) + "</b>?",
        s: (fa > c ? a + "/" + b : dec(c, 2)) + ". Lleva las dos al mismo registro: " + a + "/" + b + " = " + dec(fa, 4) +
           ". Iguala la cantidad de cifras antes de comparar." };
    },
    function () {
      var a = ale(2, 6) / 10, b = a + 0.1;
      return { niv: "N2", e: "Escribe <b>tres números distintos</b> que estén entre <b>" + dec(a, 1) + "</b> y <b>" + dec(b, 1) + "</b>. ¿Cuántos hay en total?",
        s: "Infinitos. Por ejemplo " + dec(a + 0.02, 2) + ", " + dec(a + 0.05, 2) + " y " + dec(a + 0.077, 3) +
           ". El promedio de dos números siempre queda entre ellos, y ese truco se puede repetir sin fin." };
    },
    function () {
      var v = mezclar([{ t: "√" + elegir([2, 3, 5, 7]), r: "irracional" }, { t: "0," + ale(1, 9) + "" + ale(1, 9) + "…  (se repite el bloque)", r: "racional" },
                       { t: "−" + ale(2, 20), r: "racional (entero)" }, { t: dec(ale(1, 99) / 100, 2), r: "racional" }]);
      return { niv: "N1", e: "Clasifica cada número como racional o irracional: <b>" + v.map(function (x) { return x.t; }).join(" · ") + "</b>",
        s: v.map(function (x) { return x.t + " → " + x.r; }).join(" · ") + ". Criterio: si el decimal se acaba o repite un bloque, es racional." };
    },
    function () {
      var vals = mezclar([-ale(2, 9), 0, ale(1, 5), -ale(1, 5) / 2, ale(10, 30) / 10]);
      var ord = vals.slice().sort(function (x, y) { return x - y; });
      return { niv: "N1", e: "Ordena de menor a mayor: <b>" + vals.map(function (x) { return dec(x, 1).replace(/,0$/, ""); }).join(" · ") + "</b>",
        s: ord.map(function (x) { return dec(x, 1).replace(/,0$/, ""); }).join(" < ") + ". En los negativos, mientras mayor el número sin signo, más a la izquierda queda." };
    },
    function () {
      var t = ale(20, 60), p = ale(4, 15);
      return { niv: "N3", e: "En un salón de <b>" + t + " estudiantes</b>, <b>" + p + "</b> perdieron el parcial. ¿Qué fracción del salón perdió? Escríbela también como decimal y como porcentaje.",
        s: p + "/" + t + " = " + dec(p / t, 4) + " = " + dec(p * 100 / t, 1) + " %. Simplifica la fracción dividiendo por " + mcd(p, t) + "." };
    }
  ];

  /* ═══════════ CAPÍTULO 2 · MCD y mcm ═══════════ */
  function parCoprimo() {
    var pares = [[2, 3], [3, 4], [4, 5], [3, 5], [5, 6], [2, 5], [4, 7], [3, 7], [5, 8]];
    return elegir(pares);
  }
  G.c02 = [
    function () {
      var d = elegir([4, 6, 8, 12, 15, 18]), p = parCoprimo();
      var a = d * p[0], b = d * p[1];
      return { niv: "N1", e: "Calcula el <b>M.C.D.</b> y el <b>m.c.m.</b> de <b>" + a + "</b> y <b>" + b + "</b> por descomposición en factores primos.",
        s: "M.C.D. = " + d + " y m.c.m. = " + mcm(a, b) + ". " + a + " = " + factorTexto(a) + " y " + b + " = " + factorTexto(b) +
           ". Verifica: " + d + " × " + mcm(a, b) + " = " + a + " × " + b + "." };
    },
    function () {
      var d = elegir([12, 15, 18, 24]), p = parCoprimo(), q = ale(2, 4);
      var a = d * p[0], b = d * p[1], c = d * q;
      return { niv: "N3", e: "Una fundación tiene <b>" + a + "</b> cuadernos, <b>" + b + "</b> lápices y <b>" + c +
        "</b> borradores. Quiere armar el mayor número de kits idénticos <b>sin que sobre nada</b>. ¿Cuántos kits y qué lleva cada uno?",
        s: mcd(mcd(a, b), c) + " kits, con " + (a / mcd(mcd(a, b), c)) + " cuadernos, " + (b / mcd(mcd(a, b), c)) +
           " lápices y " + (c / mcd(mcd(a, b), c)) + " borradores. Es el M.C.D. de los tres: repartir sin que sobre." };
    },
    function () {
      var a = elegir([8, 10, 12, 15]), b = elegir([18, 20, 24]), c = elegir([30, 36, 40]);
      var m = mcm(mcm(a, b), c);
      return { niv: "N3", e: "Tres rutas de bus en " + elegir(CIUDADES) + " salen del portal cada <b>" + a + "</b>, <b>" + b +
        "</b> y <b>" + c + " minutos</b>. Acaban de salir las tres juntas. ¿Dentro de cuántos minutos vuelven a coincidir?",
        s: m + " minutos. Es el m.c.m. de los tres: coincidir pide múltiplos, no divisores." };
    },
    function () {
      var n = elegir([84, 126, 150, 198, 210, 225, 360, 480, 600]);
      return { niv: "N1", e: "Descompón <b>" + n + "</b> en factores primos, bajando hasta 1.",
        s: n + " = " + factorTexto(n) + ". Si te quedaste con un número compuesto a medio camino, el resultado sale mal." };
    },
    function () {
      var a = elegir([36, 48, 60, 72]), b = elegir([90, 120, 150]);
      return { niv: "N2", e: "Se quieren cortar dos cintas de <b>" + a + " cm</b> y <b>" + b +
        " cm</b> en pedazos iguales lo más largos posible, sin desperdicio. ¿De cuántos centímetros es cada pedazo y cuántos pedazos salen?",
        s: "Cada pedazo de " + mcd(a, b) + " cm; salen " + (a / mcd(a, b)) + " + " + (b / mcd(a, b)) + " = " +
           (a / mcd(a, b) + b / mcd(a, b)) + " pedazos. Cortar sin desperdicio pide M.C.D." };
    },
    function () {
      var d = elegir([6, 8, 9, 12]), p = parCoprimo();
      var a = d * p[0], b = d * p[1];
      return { niv: "N2", e: "Dos números tienen M.C.D. igual a <b>" + d + "</b> y m.c.m. igual a <b>" + mcm(a, b) +
        "</b>. Si uno de ellos es <b>" + a + "</b>, ¿cuál es el otro?",
        s: b + ". Usa M.C.D. × m.c.m. = a × b, entonces b = (" + d + " × " + mcm(a, b) + ") ÷ " + a + "." };
    }
  ];

  /* ═══════════ CAPÍTULO 3 · Proporcionalidad ═══════════ */
  G.c03 = [
    function () {
      var u = elegir([3200, 4200, 2800, 5500]), q1 = ale(2, 5), q2 = ale(6, 12);
      return { niv: "N1", e: "Si <b>" + q1 + " kilos</b> de arroz cuestan <b>" + pesos(u * q1) + "</b>, ¿cuánto cuestan <b>" + q2 + " kilos</b>?",
        s: pesos(u * q2) + ". Directa: el precio por kilo es " + pesos(u) + " y no cambia." };
    },
    function () {
      var t = elegir([6, 8, 10, 12]), n1 = elegir([4, 6, 12]), n2 = elegir([8, 16, 24]);
      var d = n1 * t / n2;
      return { niv: "N1", e: "<b>" + n1 + " trabajadores</b> levantan un muro en <b>" + t + " días</b>. ¿Cuántos días tardan <b>" +
        n2 + " trabajadores</b> al mismo ritmo?",
        s: dec(d, 2).replace(/,00$/, "") + " días. Inversa: más trabajadores, menos días. El trabajo total (" + n1 * t + " trabajador-días) no cambia." };
    },
    function () {
      var ob1 = ale(4, 8), d1 = ale(9, 15), h1 = elegir([6, 8]);
      var ob2 = ale(5, 12), h2 = elegir([5, 6, 8, 10]);
      var d2 = ob1 * d1 * h1 / (ob2 * h2);
      return { niv: "N3", e: "Para una obra se necesitan <b>" + ob1 + " obreros</b> durante <b>" + d1 + " días</b> trabajando <b>" +
        h1 + " horas diarias</b>. ¿Cuántos días tardarán <b>" + ob2 + " obreros</b> si trabajan <b>" + h2 + " horas diarias</b>?",
        s: dec(d2, 2).replace(/,00$/, "") + " días. Compuesta: ambas magnitudes son inversas respecto a los días. Verifica con el trabajo total: " +
           (ob1 * d1 * h1) + " obrero-horas." };
    },
    function () {
      var p = elegir([[2, 3], [3, 4], [3, 5], [4, 5], [5, 7]]);
      var k = ale(3, 9), tot = (p[0] + p[1]) * k;
      return { niv: "N2", e: "En un salón la razón entre mujeres y hombres es <b>" + p[0] + " : " + p[1] + "</b> y hay <b>" +
        tot + " estudiantes</b> en total. ¿Cuántas mujeres y cuántos hombres hay?",
        s: (p[0] * k) + " mujeres y " + (p[1] * k) + " hombres. Son " + (p[0] + p[1]) + " partes en total, cada parte vale " +
           tot + " ÷ " + (p[0] + p[1]) + " = " + k + ". Verifica que sumen " + tot + "." };
    },
    function () {
      var g1 = ale(2, 5), h = ale(4, 10), g2 = g1 * ale(2, 4);
      return { niv: "N1", e: "<b>" + g1 + " grifos</b> iguales llenan un tanque en <b>" + h + " horas</b>. ¿En cuántas horas lo llenan <b>" + g2 + " grifos</b>?",
        s: dec(g1 * h / g2, 2).replace(/,00$/, "") + " horas. Inversa: el producto grifos × horas se conserva en " + (g1 * h) + "." };
    },
    function () {
      var km = elegir([100, 120, 150]), lt = elegir([8, 9, 10, 12]), disp = ale(20, 45);
      return { niv: "N2", e: "Un carro consume <b>" + lt + " litros</b> de gasolina cada <b>" + km +
        " km</b>. Si tiene <b>" + disp + " litros</b> disponibles, ¿cuántos kilómetros puede recorrer?",
        s: dec(km * disp / lt, 1) + " km. Directa: rinde " + dec(km / lt, 2) + " km por litro." };
    }
  ];

  /* ═══════════ CAPÍTULO 4 · Porcentajes ═══════════ */
  G.c04 = [
    function () {
      var p = ale(6, 30) * 10000, r = elegir([10, 15, 20, 25, 30, 35, 40]);
      return { niv: "N1", e: "Un artículo cuesta <b>" + pesos(p) + "</b> y tiene <b>" + r + " % de descuento</b>. ¿Cuánto paga el cliente?",
        s: pesos(p * (1 - r / 100)) + ". Un solo factor: " + pesos(p) + " × " + dec(1 - r / 100, 2) + "." };
    },
    function () {
      var p = ale(8, 40) * 10000, r = elegir([15, 20, 25, 30, 35]);
      return { niv: "N2", e: "Una tienda ofrece <b>" + r + " % de descuento</b> sobre un artículo de <b>" + pesos(p) +
        "</b>. Sobre el valor con descuento aplica el <b>IVA del 19 %</b>. ¿Cuánto paga el cliente?",
        s: pesos(p * (1 - r / 100) * 1.19) + ". Encadena factores: " + pesos(p) + " × " + dec(1 - r / 100, 2) +
           " × 1,19. El IVA va sobre " + pesos(p * (1 - r / 100)) + ", no sobre el precio de lista." };
    },
    function () {
      var p = ale(10, 40) * 10000, r1 = elegir([30, 40, 50]), r2 = elegir([10, 15, 20, 25]);
      var f = (1 - r1 / 100) * (1 - r2 / 100);
      return { niv: "N3", e: "Un aviso dice: «<b>" + r1 + " % de descuento + " + r2 +
        " % adicional en caja</b>». Sobre un artículo de <b>" + pesos(p) + "</b>, ¿cuánto paga el cliente y cuál es el descuento real total?",
        s: "Paga " + pesos(p * f) + ". El descuento real es del " + dec((1 - f) * 100, 1) + " %, no del " + (r1 + r2) +
           " %. Los porcentajes son factores que se multiplican: " + dec(1 - r1 / 100, 2) + " × " + dec(1 - r2 / 100, 2) + " = " + dec(f, 4) + "." };
    },
    function () {
      var v0 = ale(8, 30) * 10000, r = elegir([8, 12, 15, 20, 25]);
      var v1 = v0 * (1 + r / 100);
      return { niv: "N2", e: "El precio de un producto pasó de <b>" + pesos(v0) + "</b> a <b>" + pesos(v1) +
        "</b>. ¿Cuál fue el aumento porcentual? Si ahora vuelve a " + pesos(v0) + ", ¿cuál es la disminución porcentual?",
        s: "Aumento del " + r + " % (sobre " + pesos(v0) + "). Disminución del " + dec((v1 - v0) * 100 / v1, 2) +
           " % (sobre " + pesos(v1) + "). El mismo salto en pesos da dos porcentajes distintos porque cambia la base." };
    },
    function () {
      var f = ale(6, 25) * 10000, r = elegir([10, 15, 20, 25, 30]);
      var p = f / (1 - r / 100);
      return { niv: "N2", e: "Después de un <b>" + r + " % de descuento</b> pagaste <b>" + pesos(f) + "</b>. ¿Cuál era el precio original?",
        s: pesos(p) + ". No se le suma el " + r + " % a " + pesos(f) + ": se divide entre " + dec(1 - r / 100, 2) +
           ", porque " + pesos(f) + " es el " + (100 - r) + " % del original." };
    },
    function () {
      var a = ale(3, 9), b = a + ale(1, 4);
      return { niv: "N3", e: "Una tasa pasa del <b>" + a + " %</b> al <b>" + b + " %</b>. Expresa el cambio en <b>puntos porcentuales</b> y en <b>porcentaje de aumento</b>, y explica por qué son distintos.",
        s: (b - a) + " puntos porcentuales (una resta) y un aumento del " + dec((b - a) * 100 / a, 1) +
           " % (una división: " + (b - a) + " ÷ " + a + "). Las dos son ciertas; decir «subió " + (b - a) + " %» no lo es." };
    }
  ];

  /* ═══════════ CAPÍTULO 5 · Interés ═══════════ */
  G.c05 = [
    function () {
      var c = ale(5, 30) * 100000, i = elegir([1, 1.5, 2, 2.5, 3]), t = ale(6, 18);
      return { niv: "N1", e: "Se prestan <b>" + pesos(c) + "</b> al <b>" + dec(i, 1).replace(/,0$/, "") +
        " % mensual</b> de <b>interés simple</b> durante <b>" + t + " meses</b>. ¿Cuánto interés se paga y cuánto se debe al final?",
        s: "Interés " + pesos(c * i / 100 * t) + " y monto " + pesos(c * (1 + i / 100 * t)) +
           ". I = C · i · t, con i = " + dec(i / 100, 4) + " y t = " + t + " meses." };
    },
    function () {
      var c = ale(5, 30) * 100000, i = elegir([2, 2.5, 3, 4, 5]), t = ale(5, 12);
      var m = c * Math.pow(1 + i / 100, t);
      return { niv: "N1", e: "Se prestan <b>" + pesos(c) + "</b> al <b>" + dec(i, 1).replace(/,0$/, "") +
        " % mensual</b> con <b>capitalización mensual</b> durante <b>" + t + " meses</b>. ¿Cuánto se debe al final?",
        s: pesos(m) + ". M = C(1 + i)^t = " + pesos(c) + " × " + dec(Math.pow(1 + i / 100, t), 4) +
           ". A interés simple habrían sido " + pesos(c * (1 + i / 100 * t)) + ": el compuesto siempre da más." };
    },
    function () {
      var i = elegir([1, 1.5, 2, 2.5, 3, 5, 10, 15, 20]);
      var ea = (Math.pow(1 + i / 100, 12) - 1) * 100;
      return { niv: "N2", e: "Un prestamista cobra <b>" + dec(i, 1).replace(/,0$/, "") +
        " % mensual</b> y afirma que su tasa anual es del <b>" + dec(i * 12, 0) + " %</b>. ¿Es cierto? Calcula la tasa efectiva anual.",
        s: "No. La efectiva anual es " + dec(ea, 1) + " %, no " + dec(i * 12, 0) +
           " %. Se compone: (1 + i)^12 − 1, no se multiplica por 12." };
    },
    function () {
      var c = ale(4, 25) * 100000, i = elegir([2, 3, 4, 5]), t = ale(8, 24);
      var s = c * (1 + i / 100 * t), k = c * Math.pow(1 + i / 100, t);
      return { niv: "N3", e: "Dos créditos por <b>" + pesos(c) + "</b> al <b>" + i + " % mensual</b> durante <b>" + t +
        " meses</b>: uno es <b>simple</b> y el otro <b>compuesto</b>. ¿Cuánto se debe en cada caso y cuál es la diferencia?",
        s: "Simple " + pesos(s) + ", compuesto " + pesos(k) + ". Diferencia de " + pesos(k - s) +
           ". La diferencia crece cada vez más rápido, porque uno es recta y el otro curva." };
    },
    function () {
      var c = ale(3, 20) * 100000, i = elegir([2, 3, 4, 5]), t = ale(4, 10);
      var m = c * Math.pow(1 + i / 100, t);
      return { niv: "N2", e: "Una deuda a interés compuesto del <b>" + i + " % mensual</b> llegó a <b>" + pesos(m) +
        "</b> después de <b>" + t + " meses</b>. ¿Cuánto se prestó originalmente?",
        s: pesos(c) + ". Se despeja C = M ÷ (1 + i)^t = " + pesos(m) + " ÷ " + dec(Math.pow(1 + i / 100, t), 4) + "." };
    },
    function () {
      var c = ale(4, 15) * 100000, cu = elegir([10, 12, 18]), pago = Math.round(c * elegir([1.18, 1.25, 1.32]) / cu / 1000) * 1000;
      return { niv: "N3", e: elegir(TIENDAS).charAt(0).toUpperCase() + elegir(TIENDAS).slice(1) +
        " ofrece un electrodoméstico de <b>" + pesos(c) + "</b> «sin cuota inicial, en <b>" + cu + " cuotas de " + pesos(pago) +
        "</b>». ¿Cuánto paga en total, cuánto son intereses y le parece que el aviso puede decir «sin intereses»?",
        s: "Paga " + pesos(pago * cu) + " en total, de los cuales " + pesos(pago * cu - c) +
           " son intereses (un " + dec((pago * cu - c) * 100 / c, 1) + " % sobre el precio). El aviso no podría decir «sin intereses»." };
    }
  ];

  /* ═══════════ CAPÍTULO 6 · Álgebra y ecuaciones ═══════════ */
  G.c06 = [
    function () {
      var m = ale(2, 9), b = ale(3, 20), x = ale(2, 12);
      return { niv: "N1", e: "Evalúa la expresión <b>" + m + "x + " + b + "</b> para <b>x = " + x + "</b>.",
        s: (m * x + b) + ". Primero se multiplica y después se suma: " + m + " × " + x + " = " + (m * x) + ", más " + b + "." };
    },
    function () {
      var a = ale(2, 9), x = ale(2, 15), b = ale(3, 25);
      return { niv: "N1", e: "Resuelve y verifica reemplazando: <b>" + a + "x − " + b + " = " + (a * x - b) + "</b>.",
        s: "x = " + x + ". Suma " + b + " a los dos lados: " + a + "x = " + (a * x) + ". Divide entre " + a + ". Verifica: " +
           a + "(" + x + ") − " + b + " = " + (a * x - b) + " ✓" };
    },
    function () {
      var x = ale(2, 12), a = ale(4, 9), c = ale(1, 3), b = ale(2, 20);
      var d = b + (a - c) * x;
      return { niv: "N2", e: "Resuelve: <b>" + a + "x + " + b + " = " + c + "x + " + d + "</b>.",
        s: "x = " + x + ". Junta las letras de un lado: " + (a - c) + "x = " + (d - b) + ". Después divide. Verifica reemplazando en los dos lados." };
    },
    function () {
      var fijo = ale(2, 9) * 10000, tarifa = ale(2, 9) * 500, n = ale(3, 12);
      var cosa = elegir([["gimnasio", "de matrícula", "mensuales", "meses"],
                         ["taller", "de diagnóstico", "por hora", "horas"],
                         ["plan de datos", "de cargo fijo", "por giga", "gigas"]]);
      return { niv: "N2", e: "Un " + cosa[0] + " cobra <b>" + pesos(fijo) + "</b> " + cosa[1] + " y <b>" + pesos(tarifa) +
        "</b> " + cosa[2] + ". Escribe la fórmula del total y calcula lo que se paga por <b>" + n + " " + cosa[3] + "</b>.",
        s: "Fórmula: total = " + pesos(fijo) + " + " + pesos(tarifa) + " × n. Para n = " + n + ": " + pesos(fijo + tarifa * n) +
           ". Comprueba en n = 0: debe dar " + pesos(fijo) + ", no cero." };
    },
    function () {
      var v2 = elegir([600, 800]), v1 = v2 + elegir([200, 400]), k = ale(3, 8);
      var f1 = ale(2, 5) * 1000, f2 = f1 + (v1 - v2) * k;
      return { niv: "N3", e: "Una app paga <b>" + pesos(f1) + " + " + pesos(v1) + " por km</b> y otra paga <b>" + pesos(f2) +
        " + " + pesos(v2) + " por km</b>. ¿A partir de cuántos kilómetros conviene la segunda?",
        s: "Se igualan y da k = " + k + " km. A partir de <b>más de " + k + " km</b> conviene la segunda: compruébalo con " +
           (k + 2) + " km, donde la primera paga " + pesos(f1 + v1 * (k + 2)) + " y la segunda " + pesos(f2 + v2 * (k + 2)) + "." };
    },
    function () {
      var fijo = ale(3, 8) * 5000, tarifa = ale(3, 9) * 500, n = ale(4, 14);
      return { niv: "N2", e: "Un servicio cobra <b>" + pesos(fijo) + "</b> fijos más <b>" + pesos(tarifa) +
        "</b> por hora. Si la factura fue de <b>" + pesos(fijo + tarifa * n) + "</b>, ¿cuántas horas se usaron?",
        s: n + " horas. Resta el fijo: " + pesos(tarifa * n) + ", y divide entre " + pesos(tarifa) + "." };
    },
    function () {
      var k = ale(3, 9), cosas = elegir([["estudiantes", "profesores"], ["pasajeros", "buses"], ["operarios", "supervisores"]]);
      return { niv: "N2", e: "«En un lugar hay <b>" + k + " veces más " + cosas[0] + " que " + cosas[1] +
        "</b>.» Escribe la relación con letras, llamando <span class='mat'>A</span> a los " + cosas[0] + " y <span class='mat'>B</span> a los " + cosas[1] + ".",
        s: "A = " + k + "B. Pruébalo con números: si hay 3 " + cosas[1] + ", hay " + (3 * k) + " " + cosas[0] +
           ", y " + (3 * k) + " = " + k + " × 3 ✓. La trampa es escribir " + k + "A = B, que es al revés." };
    }
  ];

  /* ═══════════ CAPÍTULO 7 · Funciones y gráficas ═══════════ */
  G.c07 = [
    function () {
      var m = ale(2, 7), b = ale(2, 15), x = ale(-3, 8);
      return { niv: "N1", e: "Para la función <b>f(x) = " + m + "x + " + b + "</b>, calcula <b>f(" + x + ")</b>.",
        s: (m * x + b) + ". Reemplaza y opera: " + m + "(" + x + ") + " + b + "." };
    },
    function () {
      var ini = elegir([20, 25, 30, 40]), ritmo = elegir([2, 2.5, 4, 5]);
      var cosa = elegir([["una vela", "cm", "se consume", "cm por hora", "horas"],
                         ["un saldo prepago", "mil pesos", "se descuenta", "mil pesos por minuto", "minutos"]]);
      return { niv: "N2", e: cosa[0].charAt(0).toUpperCase() + cosa[0].slice(1) + " de <b>" + ini + " " + cosa[1] +
        "</b> " + cosa[2] + " a razón de <b>" + dec(ritmo, 1).replace(/,0$/, "") + " " + cosa[3] +
        "</b>. Escribe la fórmula y da su <b>dominio y rango en contexto</b>.",
        s: "y = " + ini + " − " + dec(ritmo, 1).replace(/,0$/, "") + "t. Se agota en t = " + dec(ini / ritmo, 1).replace(/,0$/, "") +
           " " + cosa[4] + ". Dominio: de 0 a " + dec(ini / ritmo, 1).replace(/,0$/, "") + ". Rango: de 0 a " + ini +
           ". Ni tiempo negativo ni cantidad negativa." };
    },
    function () {
      var x1 = 0, y1 = ale(2, 9) * 500, x2 = ale(4, 12), sube = ale(2, 9) * 100;
      return { niv: "N2", e: "Un segmento de recta va del punto <b>(0 ; " + y1 + ")</b> al punto <b>(" + x2 + " ; " +
        (y1 + sube * x2) + ")</b>. Halla su fórmula y di cuánto sube por cada unidad.",
        s: "y = " + y1 + " + " + sube + "x. Sube " + sube + " por unidad: (" + (y1 + sube * x2) + " − " + y1 + ") ÷ " + x2 + "." };
    },
    function () {
      var figs = mezclar([["una recta inclinada", "SÍ"], ["una circunferencia", "NO"],
                          ["una parábola abierta hacia arriba", "SÍ"], ["una recta vertical", "NO"]]);
      return { niv: "N1", e: "Aplica la <b>prueba de la recta vertical</b> y di cuáles de estas gráficas representan funciones: " +
        figs.map(function (f) { return f[0]; }).join(" · ") + ".",
        s: figs.map(function (f) { return f[0] + " → " + f[1]; }).join(" · ") +
           ". Si una vertical la corta en dos o más puntos, una entrada tendría dos salidas y no es función." };
    },
    function () {
      var t1 = ale(10, 25), t2 = ale(30, 50), km = ale(8, 20);
      return { niv: "N3", e: "En una gráfica de <b>kilómetros acumulados contra el tiempo</b>, un recorrido sube hasta <b>" + km +
        " km</b> en los primeros <b>" + t1 + " minutos</b>, se queda plano <b>" + (t2 - t1) +
        " minutos</b> y después vuelve a subir. Describe qué pasó en cada tramo y di en cuál fue más rápido.",
        s: "En el primer tramo se movió (subió " + km + " km). En el tramo plano <b>estuvo detenido</b>: los kilómetros acumulados no cambian. " +
           "El tramo más rápido es el más inclinado, no el más largo. Un tramo plano nunca significa «terreno plano»." };
    },
    function () {
      var cap = elegir([300, 400, 500, 600]), r = elegir([20, 25, 50]);
      return { niv: "N2", e: "Un tanque vacío de <b>" + cap + " litros</b> se llena a <b>" + r +
        " litros por minuto</b>. Escribe la fórmula, su dominio y su rango, y di cuánta agua hay a los <b>" + Math.round(cap / r / 2) + " minutos</b>.",
        s: "a = " + r + "t. Se llena en " + (cap / r) + " minutos. Dominio: de 0 a " + (cap / r) + " min. Rango: de 0 a " + cap +
           " L. A los " + Math.round(cap / r / 2) + " min hay " + (r * Math.round(cap / r / 2)) + " L." };
    }
  ];

  /* ═══════════ CAPÍTULO 8 · Tipos de crecimiento ═══════════ */
  G.c08 = [
    function () {
      var tipo = elegir(["lineal", "cuadratica", "exponencial"]);
      var vals = [], f = "", pista = "";
      if (tipo === "lineal") {
        var b = ale(2, 12), m = ale(3, 9);
        for (var i = 0; i < 5; i++) vals.push(b + m * i);
        f = "y = " + m + "x + " + b; pista = "Las primeras diferencias son constantes (" + m + "): es <b>lineal</b>.";
      } else if (tipo === "cuadratica") {
        var a = ale(1, 4);
        for (var j = 0; j < 5; j++) vals.push(a * j * j);
        f = "y = " + a + "x²"; pista = "Las primeras diferencias no son constantes, pero las <b>segundas</b> sí (" + (2 * a) + "): es <b>cuadrática</b>.";
      } else {
        var a0 = ale(2, 6), r = elegir([2, 3]);
        for (var k = 0; k < 5; k++) vals.push(a0 * Math.pow(r, k));
        f = "y = " + a0 + " · " + r + "^x"; pista = "Las razones son constantes (" + r + "): es <b>exponencial</b>.";
      }
      return { niv: "N2", e: "Identifica el tipo de crecimiento y escribe la fórmula. Para <b>x = 0, 1, 2, 3, 4</b> los valores son: <b>" +
        vals.join(" · ") + "</b>",
        s: pista + " La fórmula es <b>" + f + "</b>. Verifícala en x = 3, que debe dar " + vals[3] + "." };
    },
    function () {
      var l = ale(2, 9), k = elegir([2, 3, 4]);
      return { niv: "N2", e: "Un salón cuadrado tiene <b>" + l + " m</b> de lado y se amplía a <b>" + (l * k) +
        " m</b> de lado. ¿Por cuánto se multiplica su área?",
        s: "Por " + (k * k) + ". El área pasa de " + (l * l) + " m² a " + (l * k * l * k) + " m². Si el lado se multiplica por " +
           k + ", el área se multiplica por " + k + "² = " + (k * k) + ". Duplicar el lado NO duplica el área." };
    },
    function () {
      var ini = elegir([3, 4, 5, 8]), r = elegir([2, 3]), h = ale(3, 7);
      return { niv: "N1", e: "Una cadena de mensajes empieza con <b>" + ini + " personas</b> y cada hora se <b>multiplica por " + r +
        "</b>. ¿Cuántas personas hay a las <b>" + h + " horas</b>?",
        s: (ini * Math.pow(r, h)) + " personas. Es " + ini + " × " + r + "^" + h + ". Ojo: no es " + ini + " × " + r + " × " + h + "." };
    },
    function () {
      var dia = ale(8, 20), fijo = elegir([50000, 80000, 100000]);
      var expo = Math.pow(2, dia - 1);
      return { niv: "N3", e: "La opción A paga <b>" + pesos(fijo) + " diarios</b>. La opción B paga <b>$1 el primer día</b> y <b>duplica</b> cada día. " +
        "¿Cuál paga más <b>el día " + dia + "</b>?",
        s: (expo > fijo ? "La opción B" : "La opción A") + ". El día " + dia + " la B paga " + pesos(expo) +
           " y la A paga " + pesos(fijo) + ". Ojo: los primeros días la A gana con mucha ventaja, y aun así la B termina arriba si el contrato es largo." };
    },
    function () {
      var a = ale(2, 8), r = elegir([1.5, 2, 3]), x = ale(3, 6);
      return { niv: "N1", e: "Evalúa <b>y = " + a + " · " + limpio(r, 1) + "<sup>x</sup></b> para <b>x = " + x + "</b>.",
        s: limpio(a * Math.pow(r, x), 2) + ". Se eleva primero y se multiplica después: " +
           limpio(r, 1) + " elevado a " + x + " es " + limpio(Math.pow(r, x)) + ", y eso por " + a + "." };
    },
    function () {
      var pob = elegir([30, 40, 45]), ini = elegir([2, 3, 4]);
      var h = Math.ceil(Math.log(pob / ini) / Math.log(2));
      return { niv: "N3", e: "Un rumor arranca con <b>" + ini + " personas</b> en un salón de <b>" + pob +
        " estudiantes</b> y cada hora se duplica. ¿En cuántas horas lo sabe todo el salón, y a partir de cuándo deja de valer el modelo?",
        s: "En " + h + " horas la fórmula pasa de " + pob + " (da " + (ini * Math.pow(2, h)) +
           "). Pero el modelo <b>deja de valer ahí</b>: no puede haber más personas enteradas que estudiantes en el salón. " +
           "La gráfica real se aplana en " + pob + ", no sigue subiendo." };
    }
  ];

  /* ═══════════ CAPÍTULO 9 · Unidades y conversión ═══════════ */
  G.c09 = [
    function () {
      var pares = [["kilogramos", "gramos", 1000], ["metros", "centímetros", 100],
                   ["litros", "mililitros", 1000], ["kilómetros", "metros", 1000]];
      var p = elegir(pares), v = ale(15, 95) / 10;
      return { niv: "N1", e: "Convierte <b>" + dec(v, 1).replace(/,0$/, "") + " " + p[0] + "</b> a <b>" + p[1] + "</b>.",
        s: limpio(v * p[2], 2) + " " + p[1] + ". El " + p[1].slice(0, -1) + " es más pequeño, así que el número sube: se multiplica por " + p[2] + "." };
    },
    function () {
      var lb = ale(3, 40);
      return { niv: "N1", e: "En la plaza de mercado, ¿cuántos <b>gramos</b> son <b>" + lb + " libras</b>? ¿Y cuántos kilogramos?",
        s: (lb * 500) + " g, es decir " + limpio(lb * 0.5, 2) + " kg. La libra de plaza son 500 g. Con la libra internacional (453,6 g) darían " +
           limpio(lb * 453.6, 1) + " g: casi un 10 % menos." };
    },
    function () {
      var bultos = ale(8, 40), kg = elegir([25, 50]), porc = elegir([50, 80, 100, 125, 200]);
      return { niv: "N2", e: "Un camión lleva <b>" + bultos + " bultos</b> de <b>" + kg +
        " kg</b>. Si cada porción usa <b>" + porc + " g</b>, ¿para cuántas porciones alcanza toda la carga?",
        s: (bultos * kg * 1000 / porc) + " porciones. Cadena: " + bultos + " bultos × (" + kg + " kg / bulto) × (1.000 g / kg) × (1 porción / " +
           porc + " g). Se cancelan bultos, kg y g, y sobrevive «porción»." };
    },
    function () {
      var gal = ale(2, 8), ml = elegir([25, 30, 50, 60]);
      var total = gal * 3785;
      return { niv: "N2", e: "Una caneca trae <b>" + gal + " galones</b> (1 galón = 3.785 ml). Si cada preparación usa <b>" + ml +
        " ml</b>, ¿para cuántas preparaciones alcanza?",
        s: Math.floor(total / ml) + " preparaciones completas (salen " + limpio(total / ml, 1) + ", y no se puede hacer una a medias). Son " +
           total + " ml en total." };
    },
    function () {
      var ha = ale(2, 12) / 2;
      return { niv: "N2", e: "Un terreno mide <b>" + dec(ha, 1).replace(/,0$/, "") + " hectáreas</b>. ¿Cuántos <b>metros cuadrados</b> son? " +
        "Si el metro cuadrado vale $95.000, ¿cuánto vale el terreno?",
        s: limpio(ha * 10000, 0) + " m² y " + pesos(ha * 10000 * 95000) + ". Una hectárea son 10.000 m²." };
    },
    function () {
      var m = ale(12, 48) / 10, cm = ale(15, 95);
      return { niv: "N2", e: "Un mesón mide <b>" + dec(m, 2).replace(/,?0+$/, "") + " m</b> y una extensión mide <b>" + cm +
        " cm</b>. ¿Cuánto miden juntos? Da la respuesta en metros <b>y</b> en centímetros.",
        s: limpio(m * 100 + cm, 0) + " cm, es decir " + limpio(m + cm / 100, 2) + " m. Hay que igualar la unidad antes de sumar: no se puede responder «" +
           limpio(m + cm, 2) + "» sin decir de qué." };
    }
  ];

  /* ═══════════ CAPÍTULO 10 · Perímetro, área y volumen ═══════════ */
  G.c10 = [
    function () {
      var a = ale(30, 90) / 10, b = ale(20, 60) / 10;
      return { niv: "N1", e: "Un cuarto rectangular mide <b>" + dec(a, 1) + " m</b> por <b>" + dec(b, 1) +
        " m</b>. Calcula su <b>perímetro</b> y su <b>área</b>.",
        s: "Perímetro " + limpio(2 * (a + b), 2) + " m · Área " + limpio(a * b, 2) +
           " m². Ojo con las unidades: el perímetro va en m y el área en m²." };
    },
    function () {
      var lado = elegir([20, 25, 30, 40, 50]);
      return { niv: "N1", e: "Una baldosa cuadrada mide <b>" + lado + " cm</b> de lado. ¿Cuál es su área en <b>cm²</b> y en <b>m²</b>?",
        s: (lado * lado) + " cm² = " + limpio(lado * lado / 10000, 4) + " m². Se divide entre <b>10.000</b>, no entre 100: el factor va al cuadrado porque el área tiene dos dimensiones." };
    },
    function () {
      var lado = elegir([20, 25, 30, 40, 50]), n1 = ale(8, 20), n2 = ale(6, 16);
      var L = n1 * lado / 100, A = n2 * lado / 100;
      return { niv: "N2", e: "Un piso mide <b>" + limpio(L, 2) + " m × " + limpio(A, 2) + " m</b> y se embaldosa con piezas de <b>" +
        lado + " × " + lado + " cm</b>. ¿Cuántas baldosas se necesitan? Agrega el 10 % de obra.",
        s: (n1 * n2) + " baldosas exactas, y con el 10 % de obra hay que comprar " + Math.ceil(n1 * n2 * 1.1) +
           ". Verifica contando: " + n1 + " a lo largo × " + n2 + " a lo ancho." };
    },
    function () {
      var cm2 = elegir([900, 1600, 2500, 400, 4500, 12000]);
      return { niv: "N1", e: "Convierte <b>" + cm2 + " cm²</b> a <b>metros cuadrados</b>.",
        s: limpio(cm2 / 10000, 4) + " m². Se divide entre 10.000. Si dividiste entre 100 te dio " +
           limpio(cm2 / 100, 2) + " m², que es cien veces más grande de lo que es." };
    },
    function () {
      var a = ale(25, 50) / 10, b = ale(20, 40) / 10, h = elegir([2.4, 2.5, 2.6]);
      return { niv: "N2", e: "Un cuarto mide <b>" + dec(a, 1) + " × " + dec(b, 1) + " × " + dec(h, 1) +
        " m</b> de alto. ¿Cuál es su <b>volumen</b> y a cuántos <b>litros</b> de aire equivale?",
        s: limpio(a * b * h, 2) + " m³, es decir " + limpio(a * b * h * 1000, 0) + " litros. Recuerda: 1 m³ = 1.000 litros, no un millón." };
    },
    function () {
      var a = ale(40, 70) / 10, b = ale(25, 45) / 10, h = elegir([2.4, 2.5]);
      var pared = 2 * (a + b) * h, puerta = 1.6, vent = 1.2;
      var neta = pared - puerta - vent, rinde = 35, manos = 2;
      return { niv: "N3", e: "Un cuarto de <b>" + dec(a, 1) + " × " + dec(b, 1) + " m</b> y <b>" + dec(h, 1) +
        " m</b> de alto se va a pintar. Tiene una puerta de 0,80 × 2,00 m y una ventana de 1,20 × 1,00 m. " +
        "La pintura rinde 35 m² por galón y por mano, y se dan 2 manos. ¿Cuántos galones hay que comprar?",
        s: "Paredes: " + limpio(pared, 2) + " m². Menos puerta (1,6) y ventana (1,2): " + limpio(neta, 2) +
           " m². Con dos manos: " + limpio(neta * manos, 2) + " m². Entre 35: " + limpio(neta * manos / rinde, 2) +
           " galones → hay que comprar <b>" + Math.ceil(neta * manos / rinde) + "</b>. Al comprar material siempre se redondea hacia arriba." };
    }
  ];

  /* ═══════════ CAPÍTULO 11 · Escala y transformaciones ═══════════ */
  G.c11 = [
    function () {
      var esc = elegir([25, 50, 75, 100]), pc = ale(20, 120) / 10;
      return { niv: "N1", e: "En un plano a escala <b>1:" + esc + "</b>, una pared mide <b>" + dec(pc, 1).replace(/,0$/, "") +
        " cm</b>. ¿Cuánto mide de verdad, en metros?",
        s: limpio(pc * esc / 100, 2) + " m. Del plano a la realidad se <b>multiplica</b> por " + esc + ": " +
           limpio(pc * esc, 1) + " cm." };
    },
    function () {
      var esc = elegir([25, 50, 75, 100]), real = ale(8, 60) / 10;
      return { niv: "N1", e: "Un mueble mide <b>" + dec(real, 2).replace(/,?0+$/, "") + " m</b>. En un plano a escala <b>1:" + esc +
        "</b>, ¿cuántos centímetros mide?",
        s: limpio(real * 100 / esc, 2) + " cm. De la realidad al plano se <b>divide</b>: " + limpio(real * 100, 1) + " cm ÷ " + esc + "." };
    },
    function () {
      var esc = elegir([50, 100, 200, 500]), pc = ale(3, 12);
      return { niv: "N2", e: "En un plano, una distancia mide <b>" + pc + " cm</b> y en la realidad mide <b>" +
        limpio(pc * esc / 100, 2) + " m</b>. ¿Cuál es la escala?",
        s: "1 : " + esc + ". Se pasan las dos a la misma unidad y se divide la real entre la del dibujo: " +
           limpio(pc * esc, 0) + " cm ÷ " + pc + " cm = " + esc + "." };
    },
    function () {
      var k = elegir([2, 3, 4, 5]);
      return { niv: "N2", e: "Las longitudes de una figura se multiplican por <b>" + k +
        "</b>. ¿Por cuánto se multiplica su <b>área</b>? ¿Y su <b>volumen</b>, si fuera un cuerpo?",
        s: "El área por " + (k * k) + " (que es " + k + "²) y el volumen por " + (k * k * k) + " (que es " + k +
           "³). Los ángulos no cambian nunca." };
    },
    function () {
      var v = mezclar([["deslizar un mueble sin girarlo", "traslación"], ["verse en un espejo", "reflexión"],
                       ["girar una llave", "rotación"], ["fotocopiar al 200 %", "cambio de escala"]]);
      return { niv: "N1", e: "Identifica la transformación en cada caso: " + v.map(function (x) { return x[0]; }).join(" · ") + ".",
        s: v.map(function (x) { return x[0] + " → " + x[1]; }).join(" · ") +
           ". Las tres primeras son movimientos rígidos: conservan tamaño, ángulos y área. La última cambia el tamaño pero conserva la forma." };
    },
    function () {
      var esc = elegir([50, 75, 100]), a = ale(40, 90) / 10, b = ale(30, 60) / 10;
      return { niv: "N3", e: "Un plano a escala <b>1:" + esc + "</b> muestra una sala de <b>" + limpio(a, 1) + " cm × " +
        limpio(b, 1) + " cm</b>. Halla sus dimensiones reales, su área real y comprueba que la razón entre el área real y la del plano sea " + esc + "².",
        s: "Real: " + limpio(a * esc / 100, 2) + " m × " + limpio(b * esc / 100, 2) + " m, con área " +
           limpio(a * b * esc * esc / 10000, 2) + " m². Área del plano: " + limpio(a * b, 2) + " cm². La razón entre las dos, en las mismas unidades, da " +
           (esc * esc) + " = " + esc + "². Las longitudes van por " + esc + " y las áreas por " + esc + "²." };
    }
  ];

  /* ═══════════ CAPÍTULO 12 · Conteo ═══════════ */

  G.c12 = [
    function () {
      var a = ale(3, 6), b = ale(3, 5), c = ale(2, 4);
      return { niv: "N1", e: "Karen ofrece <b>" + a + " tipos de arepa</b>, <b>" + b + " bebidas</b> y <b>" + c +
        " adiciones</b>. Un combo lleva una de cada cosa. ¿Cuántos combos distintos hay?",
        s: mil(a * b * c) + " combos. Se <b>multiplica</b>: " + a + " × " + b + " × " + c + " = " + mil(a * b * c) +
           ". Si sumaras darían " + (a + b + c) + ", que es el error de leer «y» como suma. Dibuja el árbol con 2 arepas y " + b +
           " bebidas y cuenta las puntas: son " + (2 * b) + ", no " + (2 + b) + "." };
    },
    function () {
      var n = ale(4, 7), q = elegir([["personas", "sillas en fila"], ["libros", "puestos del estante"], ["fotos", "marcos de la pared"]]);
      return { niv: "N1", e: "¿De cuántas maneras se pueden acomodar <b>" + n + " " + q[0] + "</b> en <b>" + n + " " + q[1] + "</b>?",
        s: mil(fact(n)) + " maneras, que es " + n + "! = " + bajando(n, n) + ". En el primer puesto caben " + n +
           ", en el segundo quedan " + (n - 1) + ", y así hasta 1. El factorial <b>baja de uno en uno hasta 1</b>: no es " + n +
           " multiplicado por sí mismo " + n + " veces, que daría " + mil(Math.pow(n, n)) + "." };
    },
    function () {
      var n = ale(5, 9), r = elegir([2, 3]);
      var cargos = r === 2 ? "presidente y secretario" : "presidente, secretario y tesorero";
      return { niv: "N2", e: "De <b>" + n + " candidatos</b> se eligen <b>" + cargos + "</b>. ¿De cuántas maneras se puede formar la mesa directiva?",
        s: mil(perm(n, r)) + ". Los cargos son distintos, así que <b>sí importa el orden</b>: es una permutación P(" + n + "," + r +
           ") = " + bajando(n, r) + " = " + mil(perm(n, r)) + ". Si los " + r +
           " elegidos no tuvieran cargo, habría que dividir entre " + r + "! = " + fact(r) + " y quedarían " + mil(comb(n, r)) + "." };
    },
    function () {
      var n = ale(6, 10), r = elegir([2, 3, 4]);
      if (r >= n) r = 3;
      return { niv: "N2", e: "De un grupo de <b>" + n + " estudiantes</b> se escogen <b>" + r +
        "</b> para un comité <b>sin cargos</b>. ¿Cuántos comités distintos hay?",
        s: mil(comb(n, r)) + " comités. Aquí <b>no importa el orden</b>: es una combinación C(" + n + "," + r + ") = (" +
           bajando(n, r) + ") ÷ " + r + "! = " + mil(perm(n, r)) + " ÷ " + fact(r) + " = " + mil(comb(n, r)) +
           ". Se divide entre " + r + "! porque el mismo comité se contó " + fact(r) + " veces, una por cada orden." };
    },
    function () {
      var d = elegir([3, 4]);
      var con = Math.pow(10, d), sin_ = perm(10, d);
      return { niv: "N2", e: "Una clave tiene <b>" + d + " dígitos</b> del 0 al 9. ¿Cuántas claves hay si <b>se pueden repetir</b> los dígitos? ¿Y si tienen que ser <b>todos distintos</b>?",
        s: "Con repetición: " + mil(con) + " (10" + (d === 3 ? "³" : "⁴") + ", porque en cada casilla vuelven a caber las 10 cifras). Sin repetir: " +
           bajando(10, d) + " = " + mil(sin_) + ". La diferencia son " + mil(con - sin_) +
           " claves. La palabra <b>«distintos»</b> del enunciado es la que decide toda la cuenta: subráyala." };
    },
    function () {
      var m = ale(4, 6), h = ale(4, 6), k = 2, r = 3;
      var tot = comb(m, k) * comb(h, r - k);
      return { niv: "N3", e: "Un curso tiene <b>" + m + " mujeres</b> y <b>" + h +
        " hombres</b>. Se arma un comité de <b>3 personas sin cargos</b> en el que debe haber <b>exactamente 2 mujeres</b>. ¿Cuántos comités cumplen la condición? Compara con el total de comités de 3 sin ninguna condición.",
        s: mil(tot) + " comités. Se escogen las mujeres y los hombres por separado y se <b>multiplica</b>: C(" + m + ",2) × C(" + h +
           ",1) = " + comb(m, k) + " × " + h + " = " + mil(tot) + ". Sin condición serían C(" + (m + h) + ",3) = " + mil(comb(m + h, 3)) +
           ", así que la condición deja fuera " + mil(comb(m + h, 3) - tot) +
           ". Dos comprobaciones: el resultado con condición nunca puede pasar del total, y en ningún paso importa el orden." };
    }
  ];

  /* ═══════════ CAPÍTULO 13 · Probabilidad ═══════════ */

  G.c13 = [
    function () {
      var r = ale(2, 8), a = ale(3, 12), t = r + a;
      var col = elegir([["rojas", "azules"], ["blancas", "negras"], ["verdes", "amarillas"]]);
      var g = mcd(r, t);
      return { niv: "N1", e: "En una bolsa hay <b>" + r + " bolas " + col[0] + "</b> y <b>" + a + " " + col[1] +
        "</b>. Sacas una sin mirar. ¿Qué probabilidad hay de que salga " + col[0].replace(/s$/, "") + "? Escríbela en fracción, decimal y porcentaje.",
        s: r + "/" + t + (g > 1 ? " = " + (r / g) + "/" + (t / g) : "") + " = " + limpio(r / t, 4) + " = " +
           limpio(r * 100 / t, 2) + " %. Favorables: " + r + ". Posibles: <b>" + t + "</b>, que es el total, no las que sobran. " +
           "Comprobación: P(" + col[1].replace(/s$/, "") + ") = " + a + "/" + t + ", y las dos suman 1." };
    },
    function () {
      var p = elegir([10, 15, 20, 25, 30, 35, 40, 60, 75, 80]);
      var cosa = elegir(["que llueva mañana", "que el bus pase en menos de 5 minutos",
                         "que a Daniela le den propina en un domicilio", "que haya fila en la tienda"]);
      return { niv: "N1", e: "La probabilidad de <b>" + cosa + "</b> es del <b>" + p +
        " %</b>. ¿Cuál es la probabilidad de que <b>no</b> ocurra? Da la respuesta en porcentaje y en decimal.",
        s: (100 - p) + " % = " + limpio((100 - p) / 100, 2) + ". Regla del complemento: P(no A) = 1 − P(A). " +
           "Que ocurra y que no ocurra agotan todos los casos, así que las dos probabilidades tienen que sumar 1 (o 100 %)." };
    },
    function () {
      var n = elegir([2, 3, 4]), cara = Math.pow(2, n);
      return { niv: "N2", e: "Se lanza una moneda <b>" + n + " veces seguidas</b>. ¿Cuántos resultados posibles hay? ¿Qué probabilidad hay de que salga <b>cara todas las veces</b>? ¿Y de que salga <b>al menos un sello</b>?",
        s: cara + " resultados posibles (2" + (n === 2 ? "²" : n === 3 ? "³" : "⁴") + ", por el principio multiplicativo del capítulo 12). " +
           "P(todas cara) = 1/" + cara + " = " + limpio(1 / cara, 4) + ". " +
           "P(al menos un sello) = 1 − 1/" + cara + " = " + (cara - 1) + "/" + cara + " = " + limpio((cara - 1) / cara, 4) +
           ". La segunda se hace por <b>complemento</b>: enumerar todos los casos con al menos un sello es mucho más largo y da lo mismo." };
    },
    function () {
      var v = elegir([[3, "que la suma sea 4", 3], [4, "que la suma sea 5", 4], [5, "que la suma sea 6", 5],
                      [6, "que la suma sea 7", 6], [7, "que la suma sea 8", 5], [8, "que la suma sea 9", 4]]);
      return { niv: "N2", e: "Se lanzan <b>dos dados</b> corrientes. ¿Qué probabilidad hay de <b>" + v[1] + "</b>?",
        s: v[2] + "/36 = " + limpio(v[2] / 36, 4) + " = " + limpio(v[2] * 100 / 36, 2) +
           " %. La tabla de dos dados tiene <b>36 casillas</b> (6 × 6), no 11 ni 12: el 3-4 y el 4-3 son casillas distintas. " +
           "De esas 36, " + v[2] + " dan esa suma. Ese es justo el error de juntar resultados que se ven iguales pero no lo son." };
    },
    function () {
      var t = ale(24, 45), a = ale(8, 15), b = ale(8, 15), amb = ale(2, 6);
      if (a + b - amb > t) { a = Math.floor(t / 3); b = Math.floor(t / 3); amb = 2; }
      var uno = a + b - amb;
      return { niv: "N2", e: "En un curso de <b>" + t + " estudiantes</b>, <b>" + a + "</b> usan transporte público y <b>" + b +
        "</b> trabajan, y <b>" + amb + "</b> hacen las dos cosas. Se escoge una persona al azar. ¿Qué probabilidad hay de que <b>use transporte público o trabaje</b>?",
        s: uno + "/" + t + " = " + limpio(uno / t, 4) + " = " + limpio(uno * 100 / t, 2) + " %. Aquí <b>no</b> se suman y ya: " +
           a + " + " + b + " = " + (a + b) + " contaría dos veces a los " + amb +
           " que están en los dos grupos. Hay que restarlos: " + a + " + " + b + " − " + amb + " = " + uno +
           ". La suma simple solo vale cuando los dos eventos no pueden ocurrir juntos." };
    },
    function () {
      var boletas = elegir([120, 150, 200, 250, 300, 400]), mias = ale(2, 8);
      var precio = elegir([2000, 3000, 5000]);
      return { niv: "N3", e: "El salón rifa un mercado con <b>" + boletas + " boletas</b> a <b>" + pesos(precio) +
        "</b> cada una. Daniela compró <b>" + mias + "</b>. Calcula su probabilidad de ganar el primer premio en fracción y en porcentaje. " +
        "Después: sale la primera boleta y <b>no es suya</b>. ¿Cuál es ahora su probabilidad del segundo premio? ¿Subió o bajó? " +
        "Por último, ¿cuánto recauda el salón y cuánto vale «en promedio» cada boleta si el mercado cuesta " + pesos(boletas * precio * 0.4) + "?",
        s: "P(primer premio) = " + mias + "/" + boletas + " = " + limpio(mias * 100 / boletas, 3) +
           " %. Tras salir una boleta ajena quedan <b>" + (boletas - 1) + "</b>, así que P = " + mias + "/" + (boletas - 1) + " = " +
           limpio(mias * 100 / (boletas - 1), 3) + " %: <b>subió</b>, porque el total bajó y sus boletas siguen ahí. " +
           "Recaudo: " + boletas + " × " + pesos(precio) + " = " + pesos(boletas * precio) + ". Valor promedio de una boleta para el comprador: " +
           pesos(boletas * precio * 0.4) + " ÷ " + boletas + " = " + pesos(precio * 0.4) + ", o sea " +
           "40 centavos por cada peso gastado. La diferencia es la ganancia del salón: eso es lo que hay que discutir, no la suerte." };
    }
  ];

  /* ═══════════ CAPÍTULO 14 · Gráficos y tablas de frecuencia ═══════════ */

  G.c14 = [
    function () {
      var n = elegir([40, 50, 80, 120, 150, 200, 250]), k = ale(6, Math.floor(n * 0.6));
      var q = elegir(["usan transporte público", "trabajan mientras estudian", "vienen de otro municipio",
                      "perdieron el primer parcial", "tienen internet en casa"]);
      return { niv: "N1", e: "De <b>" + n + " estudiantes</b> encuestados, <b>" + k + "</b> " + q +
        ". ¿Cuál es la <b>frecuencia relativa</b>, en porcentaje? ¿Y la de los que no?",
        s: limpio(k * 100 / n, 2) + " % y " + limpio((n - k) * 100 / n, 2) + " %. Se divide entre el <b>total</b>: " +
           k + " ÷ " + n + " = " + limpio(k / n, 4) + ". Las dos tienen que sumar 100 %, y esa es la comprobación. " +
           "Ojo: " + k + " es la frecuencia <b>absoluta</b>; solo sirve para comparar dentro de este mismo grupo." };
    },
    function () {
      var p = elegir([5, 10, 12, 15, 20, 25, 30, 40, 45, 60]);
      var g = elegir([36, 45, 72, 90, 120, 180]);
      return { niv: "N1", e: "En un gráfico circular, ¿cuántos <b>grados</b> le corresponden a una porción del <b>" + p +
        " %</b>? Y al revés: ¿qué <b>porcentaje</b> representa una porción de <b>" + g + "°</b>?",
        s: limpio(p * 3.6, 1) + "° y " + limpio(g / 3.6, 2) + " %. Los 360 grados se reparten igual que los 100 puntos porcentuales: " +
           "de porcentaje a grados se multiplica por 3,6 y de grados a porcentaje se divide entre 3,6. " +
           "Es la proporcionalidad directa del capítulo 3, y la comprobación es que las porciones sumen 360°." };
    },
    function () {
      var v = mezclar([
        ["el salario mínimo de los últimos diez años", "líneas", "hay orden en el tiempo y lo que importa es la tendencia"],
        ["el medio de transporte de los estudiantes del curso", "barras", "son categorías sin orden y se quiere comparar cuál es mayor"],
        ["cómo se reparte el presupuesto del hogar por rubro", "circular", "las partes suman un total que existe de verdad"],
        ["la estatura y el peso de 30 personas", "dispersión", "hay dos datos por cada persona y se busca si se mueven juntos"],
        ["el número de goles de los cinco equipos punteros", "barras", "son categorías y se comparan entre sí"]
      ]).slice(0, 4);
      return { niv: "N2", e: "Di qué gráfico usarías en cada caso y por qué: " +
        v.map(function (x, i) { return "<b>" + (i + 1) + ".</b> " + x[0]; }).join(" · "),
        s: v.map(function (x, i) { return (i + 1) + ". <b>" + x[1] + "</b> — " + x[2] + "."; }).join(" ") +
           " Regla corta: ante la duda, barras. Es el único que casi nunca está mal elegido." };
    },
    function () {
      var n1 = elegir([80, 100, 120, 150, 200]), n2 = elegir([40, 50, 60]);
      var k1 = Math.round(n1 * elegir([0.15, 0.2, 0.25, 0.3])), k2 = Math.round(n2 * elegir([0.4, 0.45, 0.5, 0.55]));
      return { niv: "N2", e: "En el curso <b>A</b>, de <b>" + n1 + "</b> estudiantes perdieron <b>" + k1 +
        "</b>. En el curso <b>B</b>, de <b>" + n2 + "</b> perdieron <b>" + k2 +
        "</b>. Una noticia titula que al curso A le fue peor «porque son más reprobados». ¿Es correcto el titular? Sustenta con las dos frecuencias.",
        s: "No es correcto. En A perdió el " + limpio(k1 * 100 / n1, 1) + " % y en B el " + limpio(k2 * 100 / n2, 1) +
           " %: <b>a B le fue peor</b>. La frecuencia absoluta (" + k1 + " contra " + k2 +
           ") solo compara dentro del mismo grupo; para comparar grupos de <b>distinto tamaño</b> hay que pasar a porcentaje. " +
           "Es el mismo error de mirar el numerador sin el denominador que aparece en el capítulo 13." };
    },
    function () {
      var t = elegir([80, 85, 90, 35, 60]);
      var a = t + ale(3, 8), b = a + ale(5, 12);
      var apar = (b - t) / (a - t), real = b / a;
      return { niv: "N2", e: "Un gráfico de barras tiene el eje vertical <b>de " + t + " a " + (b + 2) +
        "</b>. Dos barras valen <b>" + a + "</b> y <b>" + b + "</b>. ¿Cuántas veces más alta se <b>ve</b> la segunda? ¿Y cuánto la supera <b>de verdad</b>, en porcentaje?",
        s: "Se ve " + limpio(apar, 2) + " veces más alta, porque el eje truncado deja visible solo " + (a - t) + " y " + (b - t) +
           " unidades. De verdad la supera en " + limpio((b - a) * 100 / a, 1) + " % (" + b + " es " + limpio(real, 3) +
           " veces " + a + "). <b>Lee el eje antes que las barras:</b> si no empieza en 0, ninguna comparación visual vale." };
    },
    function () {
      var cats = mezclar([["Bus", 0], ["Moto", 0], ["A pie", 0], ["Bicicleta", 0], ["Carro", 0]]).slice(0, 4);
      var v = [], tot = 0;
      for (var i = 0; i < 4; i++) { var x = ale(5, 30); v.push(x); tot += x; }
      var det = cats.map(function (c, i) { return c[0] + " " + v[i]; }).join(" · ");
      var rel = cats.map(function (c, i) { return c[0] + " " + limpio(v[i] * 100 / tot, 1) + " %"; }).join(" · ");
      var may = 0; for (var j = 1; j < 4; j++) if (v[j] > v[may]) may = j;
      return { niv: "N3", e: "Se encuestó a un curso sobre cómo llega a la universidad: " + det +
        ". Construye la <b>tabla de frecuencias completa</b> (absoluta y relativa), decide qué gráfico usarías y justifica por qué descartas los otros tres. " +
        "Escribe además el título y la fuente que le pondrías.",
        s: "Total: <b>" + tot + "</b> estudiantes. Relativas: " + rel +
           ". Suman 100 % (puede dar 99,9 o 100,1 por redondeo). Gráfico: <b>barras</b>, porque la variable es cualitativa (sin orden natural, así que la línea queda descartada) y la pregunta es comparar categorías. " +
           "El circular solo competiría si la pregunta fuera «qué parte del total», y la dispersión ni siquiera aplica: hay un solo dato por estudiante. " +
           "La mayoría llega en " + cats[may][0].toLowerCase() + " (" + limpio(v[may] * 100 / tot, 1) + " %). " +
           "El título debe decir qué muestra, y la fuente debe incluir fecha y <b>n = " + tot + "</b>: sin el n, un porcentaje no se puede evaluar." };
    }
  ];

  /* ═══════════ CAPÍTULO 15 · Centro y dispersión ═══════════ */

  G.c15 = [
    function () {
      var v = [], s = 0;
      for (var i = 0; i < 5; i++) { var x = ale(8, 30); v.push(x); s += x; }
      return { niv: "N1", e: "Calcula el <b>promedio</b> de: <b>" + v.join(" · ") + "</b>. Comprueba después que <span class=\"mat\">media × n</span> devuelva la suma.",
        s: "Suma = " + s + ", y son 5 datos: " + s + " ÷ 5 = <b>" + limpio(s / 5, 2) + "</b>. Comprobación: " +
           limpio(s / 5, 2) + " × 5 = " + s + " ✓. Esa vuelta al total es lo único que la mediana no puede hacer." };
    },
    function () {
      var base = [ale(4, 9), 0, ale(10, 16), ale(10, 16), ale(17, 25), ale(17, 25), ale(26, 34)];
      base[1] = base[0];
      while (base[3] === base[2]) base[3] = ale(10, 16);
      while (base[5] === base[4]) base[5] = ale(17, 25);
      var v = mezclar(base);
      var ord = base.slice().sort(function (a, b) { return a - b; });
      var med = ord[3];
      var cuenta = {}; ord.forEach(function (x) { cuenta[x] = (cuenta[x] || 0) + 1; });
      var moda = base[0];
      return { niv: "N1", e: "Halla la <b>mediana</b> y la <b>moda</b> de: <b>" + v.join(" · ") +
        "</b>. Cuidado: vienen desordenados.",
        s: "Ordenados: " + ord.join(" · ") + ". Son 7 datos, así que la mediana es el <b>cuarto</b>: <b>" + med +
           "</b>. La moda es el valor que más se repite: <b>" + moda + "</b> (aparece dos veces). " +
           (v[3] === med ? "Aquí el cuarto de la lista desordenada coincidió por casualidad con la mediana; casi nunca pasa. " :
              "Si tomaste el cuarto de la lista sin ordenar te dio " + v[3] + ", que no es la mediana. ") +
           "Ordenar es el paso 1, siempre." };
    },
    function () {
      var a = ale(20, 50) / 10, b = ale(20, 50) / 10, c = ale(20, 50) / 10;
      var pond = a * 0.6 + b * 0.25 + c * 0.15, simple = (a + b + c) / 3;
      return { niv: "N1", e: "En este curso el <b>parcial vale 60 %</b>, los <b>quices 25 %</b> y el <b>entregable de equipo 15 %</b>. " +
        "Sacaste <b>" + dec(a, 1) + "</b> en el parcial, <b>" + dec(b, 1) + "</b> en los quices y <b>" + dec(c, 1) +
        "</b> en el entregable. ¿Cuál es tu nota del corte?",
        s: "<b>" + limpio(pond, 2) + "</b>. La cuenta es " + dec(a, 1) + " × 0,60 + " + dec(b, 1) + " × 0,25 + " +
           dec(c, 1) + " × 0,15 = " + limpio(a * 0.6, 3) + " + " + limpio(b * 0.25, 3) + " + " + limpio(c * 0.15, 3) +
           ". Promediarlas por igual daría " + limpio(simple, 2) + ", que <b>no es tu nota</b>. Comprobación: los pesos suman 1 (0,60 + 0,25 + 0,15)." };
    },
    function () {
      var g = [], s = 0;
      for (var i = 0; i < 6; i++) { var x = ale(60, 90) * 10; g.push(x); s += x; }
      var extremo = elegir([3500, 4200, 5000, 6500]);
      g.push(extremo); s += extremo;
      var ord = g.slice().sort(function (a, b) { return a - b; });
      var med = ord[3], media = s / 7;
      return { niv: "N2", e: "Los arriendos de <b>siete</b> apartamentos de un barrio son, en miles de pesos: <b>" +
        g.join(" · ") + "</b>. Calcula la media y la mediana. ¿Cuál de las dos publicarías en un aviso que diga «cuánto cuesta vivir aquí»? Justifica.",
        s: "Media = " + limpio(media, 1) + " mil y mediana = <b>" + med + "</b> mil. Ordenados: " + ord.join(" · ") +
           ". Se publica la <b>mediana</b>: el arriendo de " + extremo + " es un valor extremo que arrastra la media hacia arriba, " +
           "y de hecho <b>seis de los siete</b> apartamentos cuestan menos que la media. En arriendos, precios de vivienda y salarios la mediana es siempre la medida honesta." };
    },
    function () {
      var n1 = elegir([20, 25, 30, 35, 40]), n2 = elegir([15, 18, 20, 24]);
      var m1 = ale(28, 38) / 10, m2 = ale(35, 46) / 10;
      var comb = (n1 * m1 + n2 * m2) / (n1 + n2), ingenuo = (m1 + m2) / 2;
      return { niv: "N2", e: "Un curso de <b>" + n1 + "</b> estudiantes promedia <b>" + dec(m1, 1) +
        "</b> y otro de <b>" + n2 + "</b> promedia <b>" + dec(m2, 1) + "</b>. ¿Cuál es el promedio de los <b>" +
        (n1 + n2) + "</b> juntos? (No es " + limpio(ingenuo, 2) + ".)",
        s: "<b>" + limpio(comb, 3) + "</b>. Hay que volver a los totales: " + n1 + " × " + dec(m1, 1) + " = " +
           dec(n1 * m1, 1) + " puntos y " + n2 + " × " + dec(m2, 1) + " = " + dec(n2 * m2, 1) + " puntos. " +
           "Se suman y se dividen entre " + (n1 + n2) + ". Promediar los dos promedios daría " + limpio(ingenuo, 2) +
           ", y eso solo sería correcto si los dos cursos tuvieran el mismo tamaño. Es una media <b>ponderada</b>, con los tamaños como pesos." };
    },
    function () {
      var m = ale(8, 16), d = elegir([1, 2, 3]);
      var v = [m - 2 * d, m - d, m, m + d, m + 2 * d];
      var varianza = (4 * d * d + d * d + 0 + d * d + 4 * d * d) / 5;
      var s = Math.sqrt(varianza);
      return { niv: "N3", e: "Calcula la <b>media</b>, el <b>rango</b> y la <b>desviación estándar</b> de: <b>" +
        v.join(" · ") + "</b>, siguiendo los cinco pasos del bloque 6. " +
        "Después inventa otro conjunto de <b>cinco datos con la misma media</b> pero con una desviación mucho menor, y explica en qué se diferencian los dos grupos.",
        s: "Media = <b>" + m + "</b> (los datos están simétricos alrededor de ella). Rango = " + (m + 2 * d) + " − " +
           (m - 2 * d) + " = <b>" + (4 * d) + "</b>. Desviaciones: −" + (2 * d) + ", −" + d + ", 0, " + d + ", " + (2 * d) +
           "; al cuadrado: " + (4 * d * d) + ", " + (d * d) + ", 0, " + (d * d) + ", " + (4 * d * d) + "; suman " +
           (10 * d * d) + ". Varianza = " + (10 * d * d) + " ÷ 5 = " + limpio(varianza, 2) + " y la desviación es su raíz: <b>" +
           limpio(s, 3) + "</b>. Un conjunto como " + [m, m, m, m, m].join(" · ") +
           " tiene la misma media y desviación <b>0</b>: mismo centro, grupos completamente distintos. Por eso un promedio nunca se reporta solo." };
    }
  ];

  /* ── API ── */
  RC.banco = function (cap, n) {
    var gens = G[cap];
    if (!gens) return [];
    var cuantos = n || 10, out = [], i = 0;
    var orden = mezclar(gens);
    while (out.length < cuantos) {
      out.push(orden[i % orden.length]());
      i++;
      if (i > cuantos * 4) break;
    }
    return out;
  };

  RC.pintarBanco = function (cap, destino, n) {
    var caja = document.getElementById(destino || "banco");
    if (!caja) return;
    var lista = RC.banco(cap, n);
    if (!lista.length) {
      caja.innerHTML = '<div class="vacio">Todavía no hay banco generado para este capítulo.</div>';
      return;
    }
    caja.innerHTML = lista.map(function (x, k) {
      return '<div class="ej"><div class="ej-cab"><span class="ej-n">' + (k + 1) +
        '</span><span class="ej-niv">' + x.niv + "</span></div><p>" + x.e + "</p>" +
        '<details class="sol"><summary>Ver la respuesta</summary><div class="cont">' + x.s + "</div></details></div>";
    }).join("");
  };
})();
