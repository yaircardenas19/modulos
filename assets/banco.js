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
  function mcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
  function mcm(a, b) { return a * b / mcd(a, b); }
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
