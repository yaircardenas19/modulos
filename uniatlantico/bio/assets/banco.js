/* ─────────────────────────────────────────────────────────────────────────
   Banco renovable de ejercicios · Módulo de Bioestadística.
   Cada visita genera enunciados con números distintos. El QR impreso es el
   mismo; lo que hay detrás cambia.

   Reglas de este archivo:
   · Toda respuesta se CALCULA con estad.js a partir de los mismos números
     que se muestran en el enunciado (ya redondeados). Ninguna se escribe a mano.
   · Cuando el libro usa la tabla (Z redondeado a dos decimales, t y χ²
     críticos), el banco hace lo mismo, para que la respuesta coincida con lo
     que el estudiante obtiene en papel.
   · Funciona en el navegador (window.BIO) y en Node, para probarlo.
   ───────────────────────────────────────────────────────────────────────── */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica(require('./estad.js'));
  else raiz.BIO = fabrica(raiz.ESTAD);
})(typeof self !== 'undefined' ? self : this, function (E) {
  'use strict';

  /* ── utilidades ── */
  function ale(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function elegir(v) { return v[Math.floor(Math.random() * v.length)]; }
  function mezclar(v) { var a = v.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function red(n, d) { var f = Math.pow(10, d); return Math.round(n * f) / f; }
  function dec(n, d) { return red(n, d === undefined ? 2 : d).toFixed(d === undefined ? 2 : d).replace('.', ',').replace('-', '−'); }
  function mil(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ').replace('-', '−'); }
  function pct(p, d) { return dec(100 * p, d === undefined ? 1 : d) + ' %'; }
  function z2(z) { return red(z, 2); }                      // Z como se busca en la tabla
  function tabla(z) { return red(E.normCDF(z2(z)), 4); }    // lo que da la tabla con ese Z
  var ESTANQUES = ['estanque 1', 'estanque 2', 'estanque 3', 'estanque 4', 'estanque 5', 'estanque 6'];
  var ESPECIES = ['tilapia roja', 'cachama', 'tilapia nilótica', 'bocachico'];

  var G = {};

  /* ═══════════ C00 · Cómo se pregunta con datos ═══════════ */
  G.c00 = [
    function () {
      var q = elegir([
        ['«el alimento nuevo no sirve»', '¿La conversión alimenticia con el alimento nuevo es distinta de la del anterior, en estanques con la misma densidad y en las mismas semanas?', 'la conversión alimenticia', 'el alimento anterior'],
        ['«los alevinos de ese proveedor vienen malos»', '¿La sobrevivencia a los 30 días de los alevinos de ese proveedor es menor que la de los otros proveedores, sembrados en condiciones iguales?', 'la sobrevivencia a los 30 días', 'los otros proveedores'],
        ['«el estanque 4 siempre da problemas»', '¿La mortalidad diaria del estanque 4 es mayor que la de los otros estanques, en las mismas semanas?', 'la mortalidad diaria', 'los otros estanques en las mismas semanas'],
        ['«con este operario los peces crecen menos»', '¿La ganancia de peso en los turnos de ese operario es distinta de la de los otros turnos, con el mismo alimento?', 'la ganancia de peso', 'los otros turnos'],
        ['«el agua está peor que antes»', '¿El oxígeno disuelto de madrugada este mes es más bajo que el del mismo mes del año pasado?', 'el oxígeno de madrugada', 'el mismo mes del año pasado']
      ]);
      return { niv: 'N2', e: 'Convierte esta queja en una pregunta que se pueda responder con datos: ' + q[0] + '.',
        s: 'Una buena pregunta dice <b>qué se mide</b> y <b>con qué se compara</b>. Por ejemplo: «' + q[1] + '». Se mide <b>' + q[2] + '</b> y se compara con <b>' + q[3] + '</b>. Hay muchas respuestas válidas: la tuya sirve si tiene esas dos cosas.' };
    },
    function () {
      var q = elegir([
        ['los estanques con más aireadores producen más', 'el tamaño de la finca: las fincas grandes tienen más aireadores y también más capital para alimento y personal'],
        ['los días de más lluvia hay más mortalidad', 'la caída del oxígeno en los días nublados, que mueve las dos cosas: menos sol, menos fotosíntesis'],
        ['el estanque con el agua más verde es el de más muertos', 'el exceso de alimento sin comer, que enverdece el agua y también la ensucia'],
        ['los alevinos más caros crecen más', 'el manejo: quien paga alevinos caros suele cuidar mejor el agua y el alimento']
      ]);
      return { niv: 'N2', e: 'Alguien concluye: «' + q[0] + ', <b>así que</b> lo primero causa lo segundo». ¿Es válida la conclusión? Propón una tercera variable que explique las dos cosas.',
        s: '<b>No es válida:</b> que dos cosas aparezcan juntas no dice cuál causó a cuál, ni si hay una tercera detrás. Una tercera variable posible: <b>' + q[1] + '</b>. Para hablar de causa hay que comparar dejando todo lo demás igual.' };
    },
    function () {
      var N = ale(5, 12) * 1000, n = ale(3, 6) * 10;
      var sitio = elegir(['la orilla, donde el agua es baja', 'la esquina donde se pone el alimento', 'la salida del recambio']);
      return { niv: 'N1', e: 'Un estanque tiene <b>' + mil(N) + '</b> peces. Para saber el peso promedio, el operario saca <b>' + n + '</b> con la atarraya en ' + sitio + '. ¿Cuál es la población, cuál la muestra, y hay algún problema?',
        s: 'Población: los <b>' + mil(N) + '</b> peces del estanque. Muestra: los <b>' + n + '</b> pesados. <b>Sí hay problema:</b> los peces de ' + sitio.split(',')[0] + ' no son como los del resto del estanque, así que el promedio no lo representa. Y sacar más de ese mismo sitio no lo arregla: hay que repartir los lances por todo el estanque.' };
    },
    function () {
      var a = ale(4, 14), b = ale(1, a - 2);
      return { niv: 'N1', e: 'Ayer se murieron <b>' + a + '</b> peces y hoy <b>' + b + '</b>. ¿Se puede concluir que la situación está mejorando?',
        s: '<b>No.</b> Dos días no son una tendencia: la mortalidad sube y baja todos los días sin que nada cambie. Para hablar de mejoría hay que mirar varios días y compararlos con cuánto varía <b>normalmente</b>.' };
    },
    function () {
      var q = elegir([
        ['Decidir que se va a comparar la conversión de dos alimentos en estanques con la misma densidad.', 'Plan'],
        ['Pesar 40 peces de cada estanque, repartiendo los lances.', 'Datos'],
        ['Calcular el promedio y la desviación de cada estanque y graficarlos.', 'Análisis'],
        ['Escribir para el dueño si conviene cambiar de alimento y con qué margen.', 'Conclusión'],
        ['Convertir la queja del operario en una pregunta que se pueda medir.', 'Problema']
      ]);
      return { niv: 'N1', e: '¿En qué fase del ciclo de investigación con datos (Problema, Plan, Datos, Análisis, Conclusión) va esto? <i>' + q[0] + '</i>',
        s: 'Fase de <b>' + q[1] + '</b>.' };
    }
  ];

  /* ═══════════ C01 · Qué se mide y cómo se mide ═══════════ */
  var VARIABLES = [
    ['el peso de cada pez (g)', 'cuantitativa continua', 'de razón', 'se mide, admite decimales, y 0 g significa «nada»'],
    ['el número de peces muertos en el día', 'cuantitativa discreta', 'de razón', 'se cuenta, va de salto en salto, y 0 significa «ninguno»'],
    ['la especie cultivada', 'cualitativa', 'nominal', 'son categorías sin orden'],
    ['el estado sanitario: malo, regular, bueno o excelente', 'cualitativa', 'ordinal', 'tiene orden, pero los saltos no se pueden suponer iguales'],
    ['la temperatura del agua (°C)', 'cuantitativa continua', 'de intervalo', 'las diferencias tienen sentido, pero 0 °C no es «ausencia de calor»'],
    ['el número del estanque', 'cualitativa', 'nominal', 'es una etiqueta escrita con dígitos: no es una cantidad'],
    ['el oxígeno disuelto (mg/L)', 'cuantitativa continua', 'de razón', 'se mide y 0 mg/L significa «nada de oxígeno»'],
    ['la talla comercial: pequeña, mediana o grande', 'cualitativa', 'ordinal', 'tiene orden, pero no distancias iguales'],
    ['el número de alevinos con malformación en una caja', 'cuantitativa discreta', 'de razón', 'se cuenta y 0 significa «ninguno»'],
    ['el proveedor de los alevinos', 'cualitativa', 'nominal', 'son nombres, sin orden'],
    ['la longitud del pez (cm)', 'cuantitativa continua', 'de razón', 'se mide y 0 cm significa «nada»'],
    ['el pH del agua', 'cuantitativa continua', 'de intervalo', 'se mide, pero el 0 de la escala no es «ausencia» de algo']
  ];
  G.c01 = [
    function () {
      var v = elegir(VARIABLES);
      return { niv: 'N1', e: 'Clasifica esta variable: <b>' + v[0] + '</b>. ¿cualitativa o cuantitativa (discreta o continua)? ¿En qué escala?',
        s: 'Es <b>' + v[1] + '</b>, en escala <b>' + v[2] + '</b>: ' + v[3] + '. Las tres preguntas: ¿ordena?, ¿las distancias son iguales?, ¿el cero significa nada?' };
    },
    function () {
      var q = elegir([
        ['los números de los estanques (1, 2, 3, 4, 5, 6)', false, 'el número del estanque es una etiqueta: el «estanque 3,5» no existe'],
        ['las calificaciones de estado sanitario de 1 (malo) a 4 (excelente)', false, 'es ordinal: nadie garantiza que de 1 a 2 haya lo mismo que de 3 a 4. Se resume con la mediana o con porcentajes'],
        ['los pesos de 40 peces en gramos', true, 'es de razón: las distancias son iguales y el promedio tiene sentido'],
        ['las temperaturas de la madrugada en °C', true, 'es de intervalo: las distancias son iguales, así que el promedio sí tiene sentido (lo que no tiene sentido son las razones)'],
        ['las cédulas de los operarios', false, 'la cédula es un código, no una cantidad']
      ]);
      return { niv: 'N2', e: '¿Tiene sentido sacar el promedio de ' + q[0] + '? Justifica.',
        s: (q[1] ? '<b>Sí.</b> ' : '<b>No.</b> ') + q[2].charAt(0).toUpperCase() + q[2].slice(1) + '.' };
    },
    function () {
      var N = ale(6, 12) * 1000, n = ale(3, 8) * 10, x = ale(3600, 4400) / 10;
      return { niv: 'N1', e: 'En un estanque de <b>' + mil(N) + '</b> peces se pesan <b>' + n + '</b>, y su promedio da <b>' + dec(x, 1) + ' g</b>. ¿Ese ' + dec(x, 1) + ' es un parámetro o un estadístico? ¿Con qué letra se escribe? ¿Y el promedio de todo el estanque?',
        s: 'El ' + dec(x, 1) + ' g es un <b>estadístico</b>: sale de la muestra y se escribe <b>x̄</b>. El promedio de los ' + mil(N) + ' peces es el <b>parámetro</b>, <b>μ</b>, y no se conoce: el estadístico sirve para estimarlo.' };
    },
    function () {
      var t1 = ale(24, 29), d = ale(1, 4), t2 = t1 + d;
      return { niv: 'N2', e: 'La temperatura pasó de <b>' + t1 + ' °C</b> a <b>' + t2 + ' °C</b>. ¿Se puede decir que «aumentó ' + d + ' grados»? ¿Y que «está un ' + dec(100 * d / t1, 0) + ' % más caliente»?',
        s: '«Aumentó ' + d + ' grados»: <b>sí</b>, las diferencias tienen sentido. «Un ' + dec(100 * d / t1, 0) + ' % más caliente»: <b>no</b>. En Celsius el 0 no es «ausencia de calor», así que las razones no significan nada: es una escala de intervalo.' };
    }
  ];

  /* ═══════════ C02 · De la planilla a la tabla y al gráfico ═══════════ */
  G.c02 = [
    function () {
      var n = elegir([40, 50, 60, 80, 120]), k = ale(Math.round(n * 0.2), Math.round(n * 0.8));
      return { niv: 'N1', e: 'De <b>' + n + '</b> peces pesados, <b>' + k + '</b> pesan 400 g o más. ¿Qué porcentaje de la muestra es?',
        s: k + '/' + n + ' = ' + dec(k / n, 4) + ' → <b>' + pct(k / n) + '</b>.' };
    },
    function () {
      var f = [ale(1, 4), ale(6, 12), ale(12, 20), ale(8, 15), ale(2, 6)], n = E.suma(f), ini = elegir([325, 350]), a = 25;
      var clases = f.map(function (_, i) { return '[' + (ini + a * i) + '–' + (ini + a * (i + 1)) + ')'; });
      var j = ale(1, 3), F = E.suma(f.slice(0, j + 1));
      return { niv: 'N2', e: 'Tabla de frecuencias de <b>' + n + '</b> pesos: ' + clases.map(function (c, i) { return c + ' → ' + f[i]; }).join(' · ') +
          '. Calcula para la clase <b>' + clases[j] + '</b>: la relativa h, la acumulada F y la relativa acumulada H.',
        s: 'h = ' + f[j] + '/' + n + ' = <b>' + dec(f[j] / n, 3) + '</b> · F = ' + f.slice(0, j + 1).join(' + ') + ' = <b>' + F + '</b> · H = ' + F + '/' + n + ' = <b>' + dec(F / n, 3) +
          '</b>. Las relativas se dividen entre el total de datos (' + n + '), <b>nunca</b> entre el número de clases.' };
    },
    function () {
      var a = elegir([20, 25, 50]), lo = elegir([300, 350, 400]), b = lo + a;
      return { niv: 'N1', e: 'Las clases son <b>[' + (lo - a) + '–' + lo + ')</b> y <b>[' + lo + '–' + b + ')</b>. ¿En cuál cae un pez de exactamente <b>' + lo + ' g</b>?',
        s: 'En <b>[' + lo + '–' + b + ')</b>: el corchete incluye el borde y el paréntesis lo excluye. Se decide antes de contar para que ningún dato quede contado dos veces o ninguna.' };
    },
    function () {
      var q = elegir([
        ['la especie de cada estanque de la finca', 'barras separadas, o torta si se quiere mostrar cómo se reparte el total', 'es cualitativa nominal'],
        ['el peso de 60 peces', 'histograma (barras pegadas)', 'es cuantitativa continua: la torta no sirve'],
        ['el número de muertos por día durante un mes', 'barras separadas (una por valor) o una línea en el tiempo si interesa la evolución', 'es cuantitativa discreta'],
        ['el estado sanitario (malo, regular, bueno, excelente)', 'barras separadas, en ese orden', 'es ordinal: el orden del eje no se puede alterar']
      ]);
      return { niv: 'N2', e: '¿Qué gráfico usarías para mostrar ' + q[0] + '? ¿Por qué no otro?',
        s: '<b>' + q[1].charAt(0).toUpperCase() + q[1].slice(1) + '</b>, porque ' + q[2] + '. El gráfico lo decide la escala de la variable, no el gusto.' };
    },
    function () {
      var min = ale(320, 360), max = ale(460, 520), k = elegir([6, 7, 8]), R = max - min, a0 = R / k;
      var a = Math.ceil(a0 / 5) * 5;
      return { niv: 'N2', e: 'Los pesos van de <b>' + min + '</b> a <b>' + max + ' g</b> y quieres <b>' + k + '</b> clases. ¿Cuál es el rango, y qué amplitud usarías?',
        s: 'R = ' + max + ' − ' + min + ' = <b>' + R + ' g</b>. R/k = ' + R + '/' + k + ' = ' + dec(a0, 1) + ', que se redondea <b>hacia arriba</b> a un valor cómodo: <b>' + a + ' g</b>. Así ' + k + ' clases cubren ' + (k * a) + ' g, más que el rango: no queda ningún dato por fuera.' };
    }
  ];

  /* ═══════════ C03 · El centro, la dispersión y la forma ═══════════ */
  G.c03 = [
    function () {
      var n = elegir([7, 8]), v = []; for (var i = 0; i < n; i++) v.push(ale(360, 440));
      var s = E.ordenar(v), me = E.mediana(v);
      return { niv: 'N1', e: 'Pesos (g): <b>' + v.join(', ') + '</b>. Calcula la media y la mediana.',
        s: 'Media = ' + E.suma(v) + '/' + n + ' = <b>' + dec(E.media(v), 1) + ' g</b>. Ordenados: ' + s.join(', ') + '. Mediana = <b>' + dec(me, 1) + ' g</b>' +
          (n % 2 ? ' (el del medio).' : ' (el promedio de los dos del medio: ' + s[n / 2 - 1] + ' y ' + s[n / 2] + ').') };
    },
    function () {
      var n1 = ale(1, 4) * 100, n2 = ale(2, 6) * 100, x1 = ale(360, 400), x2 = ale(410, 450), m = (n1 * x1 + n2 * x2) / (n1 + n2);
      return { niv: 'N2', e: 'Un estanque de <b>' + n1 + '</b> peces promedia <b>' + x1 + ' g</b> y otro de <b>' + n2 + '</b> promedia <b>' + x2 + ' g</b>. ¿Cuál es el promedio de todos juntos?',
        s: 'Hay que ponderar: (' + n1 + '·' + x1 + ' + ' + n2 + '·' + x2 + ')/' + (n1 + n2) + ' = <b>' + dec(m, 1) + ' g</b>. Promediar los dos promedios daría ' + dec((x1 + x2) / 2, 1) + ' g: es el error de promediar promedios de grupos de distinto tamaño.' };
    },
    function () {
      var v = []; for (var i = 0; i < 5; i++) v.push(ale(370, 430));
      var m = E.media(v), sc = E.devsq(v), s = E.desvS(v);
      return { niv: 'N2', e: 'Cinco peces pesan <b>' + v.join(', ') + ' g</b>. Calcula la desviación estándar y el coeficiente de variación.',
        s: 'x̄ = ' + dec(m, 1) + ' g. Σ(x − x̄)² = ' + dec(sc, 1) + '. s² = ' + dec(sc, 1) + '/4 = ' + dec(sc / 4, 1) + ' g². s = <b>' + dec(s, 1) + ' g</b>. CV = s/x̄ = <b>' + pct(s / m) + '</b>. Se divide entre n − 1 = 4 porque es una muestra.' };
    },
    function () {
      var s = ale(3, 6) * 10, m1 = ale(35, 45) * 10, m2 = ale(10, 20) * 10;
      return { niv: 'N2', e: 'Dos estanques tienen la misma desviación estándar, <b>' + s + ' g</b>. Uno promedia <b>' + m1 + ' g</b> y el otro <b>' + m2 + ' g</b>. ¿Están igual de disparejos?',
        s: '<b>No.</b> CV del primero = ' + s + '/' + m1 + ' = ' + pct(s / m1) + '; del segundo = ' + s + '/' + m2 + ' = ' + pct(s / m2) + '. El segundo está mucho más disparejo: ' + s + ' g pesan más sobre peces de ' + m2 + ' g. Para comparar dispersión entre cosas de tamaño distinto se usa el CV.' };
    },
    function () {
      var m = ale(380, 420), s = ale(25, 45), c = ale(2, 6) * 10;
      return { niv: 'N2', e: 'Un lote tiene media <b>' + m + ' g</b> y desviación <b>' + s + ' g</b>. Si a cada pez se le suman <b>' + c + ' g</b>, ¿cuánto quedan la media y la desviación?',
        s: 'Media: ' + m + ' + ' + c + ' = <b>' + (m + c) + ' g</b>. Desviación: <b>' + s + ' g</b>, igual: todos se corrieron lo mismo, así que las distancias entre ellos no cambiaron.' };
    }
  ];

  /* ═══════════ C04 · Lo que puede pasar ═══════════ */
  G.c04 = [
    function () {
      var N = elegir([200, 250, 400, 500, 800]), k = ale(Math.round(N * 0.05), Math.round(N * 0.3));
      return { niv: 'N1', e: 'En un estanque de <b>' + N + '</b> peces, <b>' + k + '</b> están bajo talla. Se saca uno al azar. ¿Qué probabilidad hay de que esté bajo talla?',
        s: 'Asignación clásica, porque todos tienen la misma probabilidad de salir: ' + k + '/' + N + ' = <b>' + dec(k / N, 3) + '</b>.' };
    },
    function () {
      var p = ale(1, 20) / 100;
      return { niv: 'N1', e: 'La probabilidad de que un alevín venga infectado es <b>' + dec(p, 2) + '</b>. ¿Cuál es la probabilidad de que no venga infectado?',
        s: 'Complemento: 1 − ' + dec(p, 2) + ' = <b>' + dec(1 - p, 2) + '</b>.' };
    },
    function () {
      var N = 200, ab = ale(90, 130), a = ab + ale(10, 30), b = ab + ale(20, 40);
      if (a + b - ab > N) { b = N - a + ab; }
      var u = a + b - ab;
      return { niv: 'N2', e: 'De <b>' + N + '</b> peces: <b>' + a + '</b> están en talla (T), <b>' + b + '</b> están sanos (S) y <b>' + ab + '</b> cumplen las dos cosas. ¿Cuál es P(T o S)?',
        s: 'Regla de la suma: P(T o S) = P(T) + P(S) − P(T y S) = ' + dec(a / N, 3) + ' + ' + dec(b / N, 3) + ' − ' + dec(ab / N, 3) + ' = <b>' + dec(u / N, 3) + '</b>. Contando: ' + a + ' + ' + b + ' − ' + ab + ' = ' + u + ' peces de ' + N + '. Sin restar la parte común daría ' + dec((a + b) / N, 3) + (a + b > N ? ', más que 1: imposible.' : ': se estaría contando dos veces a los que cumplen las dos cosas.') };
    },
    function () {
      var dias = elegir([90, 120, 150, 180]), k = ale(Math.round(dias * 0.1), Math.round(dias * 0.35));
      return { niv: 'N1', e: 'En el registro de <b>' + dias + '</b> días, hubo problema de oxígeno en <b>' + k + '</b>. ¿Cuál es la probabilidad de que un día cualquiera haya problema de oxígeno? ¿Qué tipo de asignación es?',
        s: k + '/' + dias + ' = <b>' + dec(k / dias, 3) + '</b>. Es una asignación <b>frecuentista</b>: sale del registro, de lo que pasó muchas veces.' };
    }
  ];

  /* ═══════════ C05 · Contar sin contar uno por uno ═══════════ */
  G.c05 = [
    function () {
      var a = ale(2, 5), b = ale(2, 4), c = ale(2, 3);
      return { niv: 'N1', e: 'Un ensayo combina <b>' + a + '</b> dietas, <b>' + b + '</b> densidades y <b>' + c + '</b> frecuencias de alimentación. ¿Cuántos tratamientos distintos hay?',
        s: 'Principio multiplicativo: ' + a + ' × ' + b + ' × ' + c + ' = <b>' + (a * b * c) + '</b>. Se multiplica porque cada dieta va con cada densidad y cada frecuencia; sumar (' + (a + b + c) + ') sería el error.' };
    },
    function () {
      var n = ale(5, 10), r = ale(2, Math.min(4, n - 1));
      return { niv: 'N1', e: 'La finca tiene <b>' + n + '</b> estanques y va a escoger <b>' + r + '</b> para un ensayo. ¿De cuántas maneras puede escogerlos?',
        s: 'El orden no importa (el grupo es el mismo), sin reposición: combinación. C(' + n + ', ' + r + ') = ' + n + '!/(' + r + '!·' + (n - r) + '!) = <b>' + E.comb(n, r) + '</b>.' };
    },
    function () {
      var n = ale(4, 8), r = ale(2, 3);
      return { niv: 'N1', e: 'Entre <b>' + n + '</b> estanques se van a premiar el ' + (r === 3 ? 'primero, el segundo y el tercero' : 'primero y el segundo') + ' en rendimiento. ¿Cuántos resultados posibles hay?',
        s: 'El orden sí importa (quedar primero no es quedar segundo): permutación. P(' + n + ', ' + r + ') = ' + Array.apply(null, Array(r)).map(function (_, i) { return n - i; }).join(' × ') + ' = <b>' + E.perm(n, r) + '</b>.' };
    },
    function () {
      var N = elegir([40, 50, 60]), k = ale(3, 8), r = elegir([4, 5]);
      var p = E.comb(N - k, r) / E.comb(N, r);
      return { niv: 'N3', e: 'Un lote de <b>' + N + '</b> alevinos trae <b>' + k + '</b> infectados. El inspector revisa <b>' + r + '</b> al azar. ¿Qué probabilidad hay de que no encuentre ninguno infectado?',
        s: 'Muestras posibles: C(' + N + ', ' + r + ') = ' + mil(E.comb(N, r)) + '. Muestras sin infectados (todos de los ' + (N - k) + ' sanos): C(' + (N - k) + ', ' + r + ') = ' + mil(E.comb(N - k, r)) +
          '. P = <b>' + dec(p, 3) + '</b>. Aunque el ' + dec(100 * k / N, 0) + ' % del lote viene infectado, el control de ' + r + ' alevinos no ve ninguno ' + dec(100 * p, 0) + ' veces de cada 100.' };
    }
  ];

  /* ═══════════ C06 · Cuando una cosa cambia la otra ═══════════ */
  G.c06 = [
    function () {
      var a = ale(80, 160), b = ale(180, 320), la = ale(Math.round(a * 0.3), Math.round(a * 0.7)), lb = ale(Math.round(b * 0.05), Math.round(b * 0.3));
      return { niv: 'N1', e: 'Se revisaron <b>' + (a + b) + '</b> peces: <b>' + a + '</b> del estanque A (' + la + ' con lesión) y <b>' + b + '</b> del B (' + lb + ' con lesión). Calcula P(lesión | A) y P(A | lesión).',
        s: 'P(lesión | A) = ' + la + '/' + a + ' = <b>' + dec(la / a, 3) + '</b>: se mira solo el grupo de A. P(A | lesión) = ' + la + '/' + (la + lb) + ' = <b>' + dec(la / (la + lb), 3) + '</b>: se mira solo el grupo de los que tienen lesión. Cambiar lo que va después de la barra es cambiar de grupo.' };
    },
    function () {
      var p = elegir([1, 2, 3, 5, 10, 15]), se = elegir([80, 85, 90, 95]), sp = elegir([85, 90, 95, 98]), N = 10000;
      var inf = N * p / 100, tp = inf * se / 100, sanos = N - inf, fp = sanos * (100 - sp) / 100, vpp = tp / (tp + fp);
      return { niv: 'N3', e: 'En los despachos de un proveedor, el <b>' + p + ' %</b> de los alevinos viene infectado. La prueba marca al <b>' + se + ' %</b> de los infectados y deja pasar bien al <b>' + sp + ' %</b> de los sanos. Un alevín da positivo: ¿qué probabilidad hay de que esté infectado? Usa un árbol de ' + mil(N) + ' alevinos.',
        s: 'Infectados: ' + mil(inf) + ' → positivos ' + mil(tp) + '. Sanos: ' + mil(sanos) + ' → positivos falsos ' + mil(fp) + '. Positivos en total: ' + mil(tp + fp) + '. P(infectado | positivo) = ' + mil(tp) + '/' + mil(tp + fp) + ' = <b>' + dec(vpp, 3) + '</b>, o sea ' + pct(vpp) +
          '. Que la prueba marque al ' + se + ' % de los infectados no quiere decir que el ' + se + ' % de los positivos esté infectado: depende de cuántos infectados trae el lote.' };
    },
    function () {
      var N = 200, a = ale(80, 140), b = ale(60, 150);
      var indep = Math.random() < 0.5, ab = indep ? a * b / N : ale(Math.max(10, a + b - N + 5), Math.min(a, b) - 5);
      if (indep && ab !== Math.round(ab)) { a = 100; b = elegir([80, 120, 60]); ab = a * b / N; }
      var pa = a / N, pb = b / N, pab = ab / N;
      return { niv: 'N2', e: 'De <b>' + N + '</b> peces: <b>' + a + '</b> vienen del proveedor 1 (A), <b>' + b + '</b> tienen bajo peso (B) y <b>' + ab + '</b> cumplen las dos cosas. ¿A y B son independientes?',
        s: 'P(A)·P(B) = ' + dec(pa, 2) + ' · ' + dec(pb, 2) + ' = ' + dec(pa * pb, 4) + '; P(A y B) = ' + dec(pab, 4) + '. ' +
          (Math.abs(pab - pa * pb) < 1e-9 ? '<b>Son iguales: sí son independientes.</b> Saber el proveedor no cambia la probabilidad de bajo peso.' :
           '<b>Son distintos: no son independientes.</b> Saber el proveedor cambia la probabilidad de bajo peso: P(B | A) = ' + dec(ab / a, 3) + ' contra P(B) = ' + dec(pb, 3) + '.') };
    },
    function () {
      var p = elegir([2, 3, 4, 5]), L = elegir([1000, 2000, 5000]);
      return { niv: 'N1', e: 'Si el <b>' + p + ' %</b> de los alevinos de un despacho viene infectado, ¿cuántos infectados trae un lote de <b>' + mil(L) + '</b>?',
        s: mil(L) + ' × ' + dec(p / 100, 2) + ' = <b>' + mil(L * p / 100) + '</b> alevinos. Pensar en casos y no en porcentajes es la herramienta del capítulo.' };
    }
  ];

  /* ═══════════ C07 · Binomial y Poisson ═══════════ */
  G.c07 = [
    function () {
      var n = elegir([10, 15, 20, 25]), p = elegir([0.02, 0.05, 0.1]), k = ale(0, 2);
      return { niv: 'N1', e: 'Se revisan <b>' + n + '</b> alevinos de un lote con <b>' + dec(100 * p, 0) + ' %</b> de malformación. ¿Probabilidad de encontrar exactamente <b>' + k + '</b> con malformación?',
        s: 'Binomial (número fijo de intentos, independientes): P(X = ' + k + ') = C(' + n + ',' + k + ')·' + dec(p, 2) + '^' + k + '·' + dec(1 - p, 2) + '^' + (n - k) + ' = <b>' + dec(E.binomPMF(k, n, p), 4) + '</b>.' };
    },
    function () {
      var n = elegir([10, 20, 30]), p = elegir([0.03, 0.05, 0.08]);
      var q = Math.pow(1 - p, n);
      return { niv: 'N2', e: 'Se revisan <b>' + n + '</b> alevinos con <b>' + dec(100 * p, 0) + ' %</b> de malformación. ¿Qué probabilidad hay de encontrar <b>al menos uno</b> con malformación?',
        s: 'Por el complemento: 1 − P(ninguno) = 1 − ' + dec(1 - p, 2) + '^' + n + ' = 1 − ' + dec(q, 4) + ' = <b>' + dec(1 - q, 4) + '</b>. Sumar término a término también da, pero es el camino largo.' };
    },
    function () {
      var l = elegir([2, 3, 4, 5]), k = ale(0, l + 3);
      return { niv: 'N1', e: 'El promedio de muertos diarios es <b>' + l + '</b>. ¿Probabilidad de que un día haya exactamente <b>' + k + '</b> muertos?',
        s: 'Poisson (no hay número fijo de intentos): P(X = ' + k + ') = e^(−' + l + ')·' + l + '^' + k + '/' + k + '! = <b>' + dec(E.poissonPMF(k, l), 4) + '</b>.' };
    },
    function () {
      var l = elegir([2, 3, 4]), k = l + ale(3, 5);
      var p = 1 - E.poissonCDF(k - 1, l);
      return { niv: 'N2', e: 'Con un promedio de <b>' + l + '</b> muertos por día, ¿qué probabilidad hay de un día con <b>' + k + ' o más</b>? ¿Es un día para alarmarse?',
        s: 'P(X ≥ ' + k + ') = 1 − P(X ≤ ' + (k - 1) + ') = 1 − ' + dec(E.poissonCDF(k - 1, l), 4) + ' = <b>' + dec(p, 4) + '</b>: pasa unos ' + dec(1000 * p, 0) + ' días de cada 1 000. ' +
          (p < 0.01 ? 'Es muy raro: vale la pena revisar el estanque.' : 'Es llamativo pero no excepcional: conviene mirar si se repite.') };
    },
    function () {
      var q = elegir([
        ['contar cuántos de 25 alevinos revisados vienen con malformación', 'binomial', 'hay un número fijo de intentos (25) y cada uno es sí o no'],
        ['contar cuántos peces aparecen muertos en una mañana', 'Poisson', 'no hay intentos que contar: solo sucesos que ocurrieron en un intervalo'],
        ['contar cuántas de 12 jaulas superan el amonio permitido', 'binomial', 'son 12 intentos fijos, cada uno cumple o no'],
        ['contar cuántas fallas del aireador hay en un mes', 'Poisson', 'se cuentan sucesos raros en un periodo, sin número fijo de intentos']
      ]);
      return { niv: 'N1', e: '¿Binomial o Poisson? <i>' + q[0].charAt(0).toUpperCase() + q[0].slice(1) + '.</i>',
        s: '<b>' + q[1].charAt(0).toUpperCase() + q[1].slice(1) + '</b>: ' + q[2] + '.' };
    }
  ];

  /* ═══════════ C08 · La curva normal ═══════════ */
  G.c08 = [
    function () {
      var mu = elegir([380, 400, 420, 450]), s = elegir([25, 30, 35, 40]), x = mu + s * ale(-25, 25) / 10;
      var z = (x - mu) / s;
      return { niv: 'N1', e: 'Los pesos tienen promedio <b>' + mu + ' g</b> y desviación <b>' + s + ' g</b>. Un pez pesa <b>' + dec(x, 1) + ' g</b>. ¿A cuántas desviaciones del promedio está?',
        s: 'Z = (' + dec(x, 1) + ' − ' + mu + ')/' + s + ' = <b>' + dec(z, 2) + '</b>: ' + (z < 0 ? 'por debajo' : 'por encima') + ' del promedio. El signo dice el lado.' };
    },
    function () {
      var mu = elegir([380, 400, 420]), s = elegir([25, 30, 35, 40]), x = mu - ale(5, 70);
      var z = (x - mu) / s;
      return { niv: 'N2', e: 'Pesos con promedio <b>' + mu + ' g</b> y desviación <b>' + s + ' g</b>. El comprador paga completo desde <b>' + x + ' g</b>. ¿Qué porcentaje de la cosecha queda por debajo?',
        s: 'Z = (' + x + ' − ' + mu + ')/' + s + ' = ' + dec(z, 3) + ' ≈ ' + dec(z2(z), 2) + '. En la tabla: P(Z &lt; ' + dec(z2(z), 2) + ') = <b>' + dec(tabla(z), 4) + '</b>, o sea ' + pct(tabla(z)) + '. Dibuja y sombrea antes de buscar.' };
    },
    function () {
      var mu = elegir([380, 400, 420]), s = elegir([25, 30, 35]), x = mu + ale(10, 70);
      var z = (x - mu) / s;
      return { niv: 'N2', e: 'Pesos con promedio <b>' + mu + ' g</b> y desviación <b>' + s + ' g</b>. ¿Qué porcentaje de los peces pesa <b>más de ' + x + ' g</b>?',
        s: 'Z = ' + dec(z, 3) + ' ≈ ' + dec(z2(z), 2) + '. La tabla da el área a la <b>izquierda</b>: ' + dec(tabla(z), 4) + '. Lo que se pide está a la derecha: 1 − ' + dec(tabla(z), 4) + ' = <b>' + dec(1 - tabla(z), 4) + '</b>. Olvidar restar de 1 es el error más común.' };
    },
    function () {
      var mu = 400, s = elegir([30, 35, 40]), a = mu - ale(2, 6) * 10, b = mu + ale(2, 6) * 10;
      var za = (a - mu) / s, zb = (b - mu) / s;
      return { niv: 'N2', e: 'Pesos con promedio <b>' + mu + ' g</b> y desviación <b>' + s + ' g</b>. ¿Qué porcentaje queda entre <b>' + a + '</b> y <b>' + b + ' g</b>?',
        s: 'Z₁ ≈ ' + dec(z2(za), 2) + ' → ' + dec(tabla(za), 4) + '. Z₂ ≈ ' + dec(z2(zb), 2) + ' → ' + dec(tabla(zb), 4) + '. Entre los dos: ' + dec(tabla(zb), 4) + ' − ' + dec(tabla(za), 4) + ' = <b>' + dec(tabla(zb) - tabla(za), 4) + '</b>.' };
    },
    function () {
      var mu = elegir([380, 400, 420]), s = elegir([30, 35, 40]), k = elegir([1, 2, 3]), pc = { 1: '68 %', 2: '95 %', 3: '99,7 %' }[k];
      return { niv: 'N1', e: 'Pesos acampanados con promedio <b>' + mu + ' g</b> y desviación <b>' + s + ' g</b>. Sin tabla: ¿entre qué pesos está aproximadamente el ' + pc + ' central?',
        s: 'Regla 68-95-99,7: a ' + k + (k > 1 ? ' desviaciones' : ' desviación') + ' de cada lado. Entre <b>' + (mu - k * s) + '</b> y <b>' + (mu + k * s) + ' g</b>.' };
    }
  ];

  /* ═══════════ C09 · De la muestra al parámetro ═══════════ */
  G.c09 = [
    function () {
      var s = elegir([28, 30, 35, 40, 42]), n = elegir([16, 25, 36, 49, 64, 100]);
      return { niv: 'N1', e: 'Desviación de los pesos: <b>' + s + ' g</b>. Se pesan <b>' + n + '</b> peces. ¿Cuánto vale el error estándar del promedio?',
        s: 'EE = σ/√n = ' + s + '/√' + n + ' = ' + s + '/' + Math.sqrt(n) + ' = <b>' + dec(s / Math.sqrt(n), 2) + ' g</b>. Mide cuánto varía el <b>promedio</b> de una muestra a otra, no cuánto varían los peces.' };
    },
    function () {
      var x = ale(3800, 4200) / 10, s = elegir([30, 35, 40]), n = elegir([25, 36, 49, 64]), ee = s / Math.sqrt(n), m = 1.96 * ee;
      return { niv: 'N2', e: 'Biometría de <b>' + n + '</b> peces: promedio <b>' + dec(x, 1) + ' g</b>. La desviación, conocida por el ciclo anterior, es <b>' + s + ' g</b>. Construye el intervalo del 95 % para el peso promedio del estanque.',
        s: 'EE = ' + s + '/√' + n + ' = ' + dec(ee, 2) + '. Margen = 1,96 × ' + dec(ee, 2) + ' = ' + dec(m, 2) + '. IC 95 % = <b>(' + dec(x - m, 1) + ' ; ' + dec(x + m, 1) + ') g</b>. Es un intervalo para el <b>promedio</b> del estanque, no para el peso de cada pez.' };
    },
    function () {
      var n = elegir([400, 500, 600, 800]), x = ale(Math.round(n * 0.75), Math.round(n * 0.92)), p = x / n, ee = Math.sqrt(p * (1 - p) / n), m = 1.96 * ee;
      return { niv: 'N2', e: 'De <b>' + n + '</b> alevinos sembrados sobrevivieron <b>' + x + '</b>. Construye el intervalo del 95 % para la sobrevivencia.',
        s: 'p̂ = ' + x + '/' + n + ' = ' + dec(p, 3) + '. EE = √(p̂(1 − p̂)/n) = ' + dec(ee, 4) + '. Margen = 1,96 × ' + dec(ee, 4) + ' = ' + dec(m, 4) + '. IC 95 % = <b>(' + dec(p - m, 3) + ' ; ' + dec(p + m, 3) + ')</b>, o sea de ' + pct(p - m) + ' a ' + pct(p + m) + '.' };
    },
    function () {
      var n = elegir([10, 20, 25, 40]), m = elegir([6, 8, 10, 12]);
      return { niv: 'N2', e: 'Con <b>' + n + '</b> peces el margen del intervalo es <b>±' + m + ' g</b>. Si se pesan <b>' + 4 * n + '</b>, ¿cuánto queda el margen?',
        s: 'El margen va con 1/√n. Cuadruplicar n duplica √n, así que el margen queda a la mitad: <b>±' + dec(m / 2, 1) + ' g</b>. No a la cuarta parte.' };
    },
    function () {
      var a = ale(3800, 3900) / 10, b = a + ale(150, 250) / 10;
      var ops = mezclar([
        ['Si se repitiera el muestreo muchas veces, el 95 % de los intervalos así construidos atraparía el promedio verdadero.', true],
        ['Hay 95 % de probabilidad de que el promedio del estanque esté entre ' + dec(a, 1) + ' y ' + dec(b, 1) + ' g.', false],
        ['El 95 % de los peces pesa entre ' + dec(a, 1) + ' y ' + dec(b, 1) + ' g.', false]
      ]);
      return { niv: 'N3', e: 'El intervalo del 95 % dio <b>(' + dec(a, 1) + ' ; ' + dec(b, 1) + ') g</b>. ¿Cuál de estas frases lo interpreta bien? ' + ops.map(function (o, i) { return '<br>(' + (i + 1) + ') ' + o[0]; }).join(''),
        s: 'La correcta es la (' + (ops.findIndex(function (o) { return o[1]; }) + 1) + '). El promedio del estanque es un número fijo: está o no está en el intervalo. El 95 % habla del <b>procedimiento</b>. Y el intervalo es del promedio, no de los peces: el rango de los peces es mucho más ancho.' };
    }
  ];

  /* ═══════════ C10 · Tamaño de muestra ═══════════ */
  G.c10 = [
    function () {
      var s = elegir([20, 25, 30, 35, 40]), e = elegir([5, 8, 10]), n0 = Math.pow(1.96 * s / e, 2);
      return { niv: 'N1', e: 'Quieres estimar el peso promedio con un margen de <b>±' + e + ' g</b> y 95 % de confianza. Por el ciclo anterior se sabe que σ ≈ <b>' + s + ' g</b>. ¿Cuántos peces hay que pesar?',
        s: 'n = (z·σ/E)² = (1,96 × ' + s + '/' + e + ')² = ' + dec(n0, 2) + ' → <b>' + Math.ceil(n0) + ' peces</b>. Siempre se redondea hacia arriba: con uno menos, el margen quedaría más ancho del pedido.' };
    },
    function () {
      var p = elegir([0.8, 0.85, 0.9, 0.5]), e = elegir([0.03, 0.04, 0.05]), n0 = 1.96 * 1.96 * p * (1 - p) / (e * e);
      return { niv: 'N2', e: 'Quieres estimar la sobrevivencia con un margen de <b>±' + dec(100 * e, 0) + ' puntos</b> y 95 % de confianza. ' + (p === 0.5 ? 'No hay ningún estimado previo.' : 'El ciclo pasado dio <b>' + dec(100 * p, 0) + ' %</b>.') + ' ¿Cuántos alevinos hay que marcar y seguir?',
        s: (p === 0.5 ? 'Sin estimado se usa p = 0,5, el peor caso. ' : '') + 'n = z²·p(1 − p)/E² = 1,96² × ' + dec(p, 2) + ' × ' + dec(1 - p, 2) + '/' + dec(e, 2) + '² = ' + dec(n0, 1) + ' → <b>' + Math.ceil(n0) + ' alevinos</b>.' };
    },
    function () {
      var n = elegir([30, 40, 48, 62]), f = elegir([2, 3]);
      return { niv: 'N2', e: 'Con <b>' + n + '</b> peces el margen es de ±10 g. El dueño quiere ±' + dec(10 / f, 1) + ' g. ¿Cuántos peces hay que pesar ahora, aproximadamente?',
        s: 'El margen va con 1/√n: para dividirlo entre ' + f + ', n se multiplica por ' + f + '² = ' + f * f + '. Unos <b>' + n * f * f + ' peces</b>. La precisión se paga cara.' };
    },
    function () {
      var N = elegir([150, 200, 300]), n0 = ale(40, 90), nc = n0 / (1 + (n0 - 1) / N);
      return { niv: 'N3', e: 'La fórmula dio <b>n = ' + n0 + '</b>, pero el estanque solo tiene <b>' + N + '</b> peces. ¿Hace falta la corrección por población finita? ¿Cuánto da?',
        s: 'La muestra sería el ' + pct(n0 / N, 0) + ' del estanque, más del 5 %: <b>sí hace falta</b>. n = n₀/(1 + (n₀ − 1)/N) = ' + n0 + '/(1 + ' + (n0 - 1) + '/' + N + ') = ' + dec(nc, 2) + ' → <b>' + Math.ceil(nc) + ' peces</b>.' };
    }
  ];

  /* ═══════════ C11 · Poner una afirmación a prueba ═══════════ */
  G.c11 = [
    function () {
      var n = elegir([16, 25, 36]), s = ale(30, 45), mu0 = 400, x = mu0 + ale(-250, 120) / 10;
      var ee = s / Math.sqrt(n), t = (x - mu0) / ee, gl = n - 1, tc = red(E.tCrit2(0.05, gl), 3);
      var rechaza = Math.abs(t) > tc;
      return { niv: 'N2', e: 'El comprador exige un promedio de <b>' + mu0 + ' g</b>. Una biometría de <b>' + n + '</b> peces dio x̄ = <b>' + dec(x, 1) + ' g</b> y s = <b>' + s + ' g</b>. Con α = 0,05 a dos colas, ¿hay evidencia de que el estanque no promedia ' + mu0 + ' g?',
        s: 'H₀: μ = ' + mu0 + '. EE = ' + s + '/√' + n + ' = ' + dec(ee, 2) + '. t = (' + dec(x, 1) + ' − ' + mu0 + ')/' + dec(ee, 2) + ' = <b>' + dec(t, 2) + '</b>, con ' + gl + ' gl. t crítico = ±' + dec(tc, 3) + '. ' +
          (rechaza ? '|t| &gt; ' + dec(tc, 3) + ': <b>se rechaza H₀</b>. Hay evidencia de que el promedio no es ' + mu0 + ' g.' : '|t| ≤ ' + dec(tc, 3) + ': <b>no se rechaza H₀</b>. No hay evidencia suficiente; eso no demuestra que sí llegue a ' + mu0 + ' g.') };
    },
    function () {
      var n = elegir([20, 25, 30]), x1 = ale(200, 250) / 100, x2 = red(x1 - ale(5, 35) / 100, 2), s1 = ale(30, 50) / 100, s2 = ale(30, 50) / 100;
      var a = s1 * s1 / n, b = s2 * s2 / n, ee = Math.sqrt(a + b), t = (x1 - x2) / ee, gl = (a + b) * (a + b) / (a * a / (n - 1) + b * b / (n - 1));
      var tc = red(E.tCrit2(0.05, Math.floor(gl)), 3), rechaza = Math.abs(t) > tc;
      return { niv: 'N2', e: 'Ensayo con <b>' + n + '</b> peces por alimento. Alimento de siempre: x̄ = <b>' + dec(x1, 2) + '</b> g/día, s = <b>' + dec(s1, 2) + '</b>. Alimento nuevo: x̄ = <b>' + dec(x2, 2) + '</b>, s = <b>' + dec(s2, 2) + '</b>. ¿La diferencia es más grande de lo que el azar produciría (α = 0,05)?',
        s: 'EE = √(' + dec(s1, 2) + '²/' + n + ' + ' + dec(s2, 2) + '²/' + n + ') = ' + dec(ee, 3) + '. t = ' + dec(x1 - x2, 2) + '/' + dec(ee, 3) + ' = <b>' + dec(t, 2) + '</b>, con unos ' + Math.floor(gl) + ' gl. t crítico ≈ ' + dec(tc, 3) + '. ' +
          (rechaza ? '<b>Se rechaza H₀</b>: la diferencia es real. Si vale la pena cambiar, se decide en plata.' : '<b>No se rechaza H₀</b>: esa diferencia puede salir por azar. No quiere decir que los alimentos sean iguales.') };
    },
    function () {
      var p = elegir([0.03, 0.04, 0.12, 0.2, 0.35]);
      return { niv: 'N3', e: 'Una prueba dio p = <b>' + dec(p, 2) + '</b>. ¿Cuál es la frase correcta? (1) «La probabilidad de que H₀ sea cierta es ' + dec(p, 2) + '». (2) «Si H₀ fuera cierta, un resultado como este o más extremo saldría ' + dec(100 * p, 0) + ' veces de cada 100». (3) «Hay ' + dec(100 * (1 - p), 0) + ' % de probabilidad de que el efecto sea real».',
        s: 'La <b>(2)</b>. El valor p supone que H₀ es cierta y mide qué tan raro sería el dato. Nunca es la probabilidad de H₀. ' + (p < 0.05 ? 'Con α = 0,05, aquí se rechaza H₀.' : 'Con α = 0,05, aquí no se rechaza H₀ —lo que no demuestra que no haya efecto.') };
    },
    function () {
      var d = elegir([0.002, 0.005, 0.01]), N = elegir([200000, 500000]), dias = 180, precio = elegir([4000, 5000]);
      var gramos = d * dias * N;
      return { niv: 'N3', e: 'Con <b>' + mil(N) + '</b> peces medidos, un alimento da <b>' + dec(d, 3) + ' g/día</b> menos que otro, con p &lt; 0,001. ¿Vale la pena cambiar de alimento?',
        s: 'La diferencia es <b>real</b> (significativa), pero hay que traducirla: ' + dec(d, 3) + ' g/día × ' + dias + ' días = ' + dec(d * dias, 2) + ' g por pez al final del ciclo, algo que no se nota en ninguna báscula. Significativo no quiere decir importante: la decisión depende del precio del bulto, no del valor p.' };
    }
  ];

  /* ═══════════ C12 · Proporciones ═══════════ */
  G.c12 = [
    function () {
      var n = elegir([400, 600, 800, 900, 1000]), p0 = elegir([0.8, 0.85, 0.9]), x = Math.round(n * (p0 + ale(-60, 15) / 1000));
      var ph = x / n, ee = Math.sqrt(p0 * (1 - p0) / n), z = (ph - p0) / ee, pv = tabla(z), rechaza = pv < 0.05;
      return { niv: 'N2', e: 'El proveedor garantiza <b>' + dec(100 * p0, 0) + ' %</b> de sobrevivencia. De <b>' + n + '</b> alevinos sobrevivieron <b>' + x + '</b>. ¿Se puede reclamar (α = 0,05, una cola)?',
        s: 'p̂ = ' + x + '/' + n + ' = ' + dec(ph, 3) + '. Comprobación: ' + n + '·' + dec(p0, 2) + ' = ' + mil(n * p0) + ' y ' + n + '·' + dec(1 - p0, 2) + ' = ' + mil(n * (1 - p0)) + ', los dos ≥ 10 ✓. EE = √(' + dec(p0, 2) + '·' + dec(1 - p0, 2) + '/' + n + ') = ' + dec(ee, 4) + '. z = (' + dec(ph, 3) + ' − ' + dec(p0, 2) + ')/' + dec(ee, 4) + ' = <b>' + dec(z, 2) + '</b>. p = P(Z &lt; ' + dec(z2(z), 2) + ') = ' + dec(pv, 4) + '. ' +
          (rechaza ? '<b>Se rechaza H₀</b>: hay evidencia de que la sobrevivencia está por debajo de lo garantizado.' : '<b>No se rechaza H₀</b>: la diferencia puede ser azar; no alcanza para reclamar.') };
    },
    function () {
      var nA = elegir([800, 850, 900]), nB = elegir([800, 900, 1000]), pA = ale(82, 90) / 100, pB = pA - ale(0, 6) / 100;
      var xA = Math.round(nA * pA), xB = Math.round(nB * pB), a = xA / nA, b = xB / nB, pb = (xA + xB) / (nA + nB);
      var ee = Math.sqrt(pb * (1 - pb) * (1 / nA + 1 / nB)), z = (a - b) / ee, pv = 2 * (1 - tabla(Math.abs(z)));
      return { niv: 'N2', e: 'Proveedor A: <b>' + xA + '</b> vivos de <b>' + nA + '</b>. Proveedor B: <b>' + xB + '</b> de <b>' + nB + '</b>. ¿La diferencia es real (α = 0,05, dos colas)?',
        s: 'p̂A = ' + dec(a, 3) + ', p̂B = ' + dec(b, 3) + ': diferencia de ' + dec(100 * (a - b), 1) + ' puntos. p̄ = ' + (xA + xB) + '/' + (nA + nB) + ' = ' + dec(pb, 4) + '. EE = ' + dec(ee, 4) + '. z = <b>' + dec(z, 2) + '</b>, p ≈ ' + dec(pv, 3) + '. ' +
          (pv < 0.05 ? '<b>Se rechaza H₀</b>: la diferencia es real. Tradúcela a peces: ' + dec(a - b, 3) + ' × ' + nB + ' ≈ ' + Math.round((a - b) * nB) + ' peces por siembra.' : '<b>No se rechaza H₀</b>: podría ser azar. Eso no demuestra que los proveedores sean iguales.') };
    },
    function () {
      var p1 = ale(70, 92), p2 = p1 - ale(2, 8);
      return { niv: 'N1', e: 'La sobrevivencia bajó de <b>' + p1 + ' %</b> a <b>' + p2 + ' %</b>. ¿Cuántos puntos porcentuales bajó? ¿Y en qué porcentaje bajó?',
        s: 'Bajó <b>' + (p1 - p2) + ' puntos porcentuales</b> (' + p1 + ' − ' + p2 + '). En porcentaje, bajó ' + (p1 - p2) + '/' + p1 + ' = <b>' + dec(100 * (p1 - p2) / p1, 1) + ' %</b>. Son dos preguntas distintas y en un contrato no se pueden confundir.' };
    },
    function () {
      var n = elegir([10, 20, 30, 60, 200]), p = elegir([0.9, 0.95, 0.5]);
      var ok = n * p >= 10 && n * (1 - p) >= 10;
      return { niv: 'N1', e: '¿Se puede aplicar la prueba de una proporción con <b>n = ' + n + '</b> y p₀ = <b>' + dec(p, 2) + '</b>?',
        s: 'n·p₀ = ' + dec(n * p, 1) + ' y n·(1 − p₀) = ' + dec(n * (1 - p), 1) + '. ' + (ok ? '<b>Sí</b>: los dos son ≥ 10.' : '<b>No</b>: alguno es menor que 10, y la aproximación normal no sirve. Hace falta más muestra o una prueba exacta (binomial).') };
    },
    function () {
      var d = ale(2, 8), N = elegir([900, 1500, 3000, 5000]), precio = elegir([3500, 3800, 4200]);
      return { niv: 'N2', e: 'Un proveedor da <b>' + d + ' puntos</b> más de sobrevivencia que otro. En una siembra de <b>' + mil(N) + '</b> alevinos, ¿cuántos peces más son? ¿Cuánto valen, a $' + mil(precio) + ' cada uno?',
        s: dec(d / 100, 2) + ' × ' + mil(N) + ' = <b>' + mil(d * N / 100) + ' peces</b>, que valen <b>$' + mil(d * N / 100 * precio) + '</b>. Ese es el número que le importa al dueño.' };
    }
  ];

  /* ═══════════ C13 · Varianzas ═══════════ */
  G.c13 = [
    function () {
      var s = ale(12, 45);
      return { niv: 'N1', e: 'La desviación estándar de un lote es <b>' + s + ' g</b>. ¿Cuánto vale la varianza, y en qué unidades?',
        s: 's² = ' + s + '² = <b>' + mil(s * s) + ' g²</b>. Gramos al cuadrado: por eso se reporta la desviación, no la varianza. Pero las pruebas de este capítulo van con la varianza.' };
    },
    function () {
      var n = elegir([16, 21, 25, 31]), sA = ale(15, 25), sB = sA + ale(3, 22), F = (sB * sB) / (sA * sA), gl = n - 1, Fc = red(E.fCritDer(0.025, gl, gl), 2);
      return { niv: 'N2', e: 'Dos estanques, <b>' + n + '</b> peces muestreados en cada uno. Desviaciones: A = <b>' + sA + ' g</b>, B = <b>' + sB + ' g</b>. ¿B es más disparejo que A (α = 0,05, dos colas)?',
        s: 'F = s²B/s²A = ' + mil(sB * sB) + '/' + mil(sA * sA) + ' = <b>' + dec(F, 2) + '</b>, con (' + gl + ', ' + gl + ') gl. F crítico (0,025 a la derecha) = ' + dec(Fc, 2) + '. ' +
          (F > Fc ? '<b>Se rechaza H₀</b>: las dispersiones son distintas.' : '<b>No se rechaza H₀</b>: la diferencia de dispersión puede ser azar.') + ' Con las desviaciones sin elevar (' + dec(sB / sA, 2) + ') se habría subestimado la diferencia.' };
    },
    function () {
      var n = elegir([16, 21, 25]), s0 = elegir([20, 25, 30]), s = s0 + ale(-5, 15), chi = (n - 1) * s * s / (s0 * s0), c = red(E.chiCritDer(0.05, n - 1), 2);
      return { niv: 'N2', e: 'El contrato exige una desviación no mayor a <b>' + s0 + ' g</b>. Una muestra de <b>' + n + '</b> peces dio s = <b>' + s + ' g</b>. ¿Incumple el contrato (α = 0,05)?',
        s: 'H₀: σ ≤ ' + s0 + '. χ² = (n − 1)·s²/σ₀² = ' + (n - 1) + '·' + mil(s * s) + '/' + mil(s0 * s0) + ' = <b>' + dec(chi, 2) + '</b>, con ' + (n - 1) + ' gl. χ² crítico (0,05 a la derecha) = ' + dec(c, 2) + '. ' +
          (chi > c ? '<b>Se rechaza H₀</b>: hay evidencia de que incumple.' : '<b>No se rechaza H₀</b>: no hay evidencia suficiente de incumplimiento.') };
    },
    function () {
      var m = 400, d = ale(1, 3) * 10, s1 = ale(15, 25), s2 = s1 * 2, corte = 360;
      var p1 = tabla((corte - m) / s1), p2 = tabla((corte - (m + d)) / s2);
      return { niv: 'N3', e: 'Con el alimento actual: promedio <b>' + m + ' g</b>, desviación <b>' + s1 + ' g</b>. Con el nuevo: promedio <b>' + (m + d) + ' g</b>, desviación <b>' + s2 + ' g</b>. El comprador rechaza lo que pese menos de <b>' + corte + ' g</b>. ¿El nuevo es una mejora?',
        s: 'Actual: Z = (' + corte + ' − ' + m + ')/' + s1 + ' ≈ ' + dec(z2((corte - m) / s1), 2) + ' → ' + pct(p1) + ' rechazado. Nuevo: Z = (' + corte + ' − ' + (m + d) + ')/' + s2 + ' ≈ ' + dec(z2((corte - m - d) / s2), 2) + ' → ' + pct(p2) + ' rechazado. ' +
          (p2 > p1 ? '<b>No es una mejora</b> para este comprador: sube el promedio, pero la dispersión manda más peces bajo el corte.' : '<b>Sí es una mejora</b>: aunque la dispersión se duplicó, el promedio subió lo bastante.') };
    }
  ];

  /* ═══════════ C14 · Kruskal-Wallis ═══════════ */
  function kw(grupos) {
    var todos = [].concat.apply([], grupos), r = E.rangosMedios(todos), N = todos.length, R = [], k = 0;
    grupos.forEach(function (g) { R.push(E.suma(r.slice(k, k + g.length))); k += g.length; });
    var S = R.reduce(function (a, x, i) { return a + x * x / grupos[i].length; }, 0);
    return { r: r, R: R, N: N, H: 12 / (N * (N + 1)) * S - 3 * (N + 1) };
  }
  G.c14 = [
    function () {
      var v = []; for (var i = 0; i < 6; i++) v.push(ale(1, 9));
      var r = E.rangosMedios(v);
      return { niv: 'N1', e: 'Asigna el rango (1 = el más chico) a cada valor, promediando los empates: <b>' + v.join(', ') + '</b>.',
        s: v.map(function (x, i) { return x + ' → <b>' + dec(r[i], 1).replace(',0', '') + '</b>'; }).join(' · ') + '. Comprobación: la suma de los rangos da 21, que es 6·7/2 ✓.' };
    },
    function () {
      var n = 6, g = [[], [], []]; var base = [ale(1, 3), ale(3, 6), ale(5, 10)];
      for (var j = 0; j < 3; j++) for (var i = 0; i < n; i++) g[j].push(base[j] + ale(0, 4));
      var k = kw(g), crit = 5.99, rechaza = k.H > crit;
      return { niv: 'N2', e: 'Muertos por día con tres dietas, seis días cada una. A: <b>' + g[0].join(', ') + '</b>. B: <b>' + g[1].join(', ') + '</b>. C: <b>' + g[2].join(', ') + '</b>. Aplica Kruskal-Wallis con α = 0,05.',
        s: 'Rangos de los 18 datos juntos (empates promediados). Sumas: R_A = ' + dec(k.R[0], 1) + ', R_B = ' + dec(k.R[1], 1) + ', R_C = ' + dec(k.R[2], 1) + ' (total 171 ✓). H = 12/(18·19)·Σ(R²/6) − 3·19 = <b>' + dec(k.H, 2) + '</b>. Con k − 1 = 2 gl, el crítico es 5,99. ' +
          (rechaza ? '<b>Se rechaza H₀</b>: al menos una dieta se comporta distinto. La prueba no dice cuál.' : '<b>No se rechaza H₀</b>: las diferencias pueden ser azar.') };
    },
    function () {
      // con 6 datos por grupo y N = 18, cada suma de rangos va de 21 (1+…+6) a 93 (13+…+18)
      var n = 6, RA = ale(30, 50) + 0.5 * ale(0, 1), RB = ale(Math.max(40, Math.ceil(78 - RA)), 60), RC = 171 - RA - RB;
      var H = 12 / (18 * 19) * (RA * RA + RB * RB + RC * RC) / n - 57;
      return { niv: 'N2', e: 'Tres grupos de <b>6</b> datos cada uno. Sumas de rangos: R₁ = <b>' + dec(RA, 1) + '</b>, R₂ = <b>' + dec(RB, 1) + '</b>, R₃ = <b>' + dec(RC, 1) + '</b>. Calcula H y decide (α = 0,05).',
        s: 'Comprobación: ' + dec(RA, 1) + ' + ' + dec(RB, 1) + ' + ' + dec(RC, 1) + ' = 171 = 18·19/2 ✓. H = 12/342 × (' + dec(RA * RA / 6, 2) + ' + ' + dec(RB * RB / 6, 2) + ' + ' + dec(RC * RC / 6, 2) + ') − 57 = <b>' + dec(H, 2) + '</b>. Crítico con 2 gl: 5,99. ' +
          (H > 5.99 ? '<b>Se rechaza H₀.</b>' : '<b>No se rechaza H₀.</b>') };
    },
    function () {
      var k = elegir([3, 4, 5, 6]);
      return { niv: 'N2', e: 'Cada prueba tiene 5 % de dar un falso positivo. Si comparas los grupos de a pares con <b>' + k + '</b> pruebas independientes, ¿qué probabilidad hay de al menos un falso positivo?',
        s: '1 − 0,95^' + k + ' = 1 − ' + dec(Math.pow(0.95, k), 4) + ' = <b>' + dec(1 - Math.pow(0.95, k), 4) + '</b>, o sea ' + pct(1 - Math.pow(0.95, k)) + '. Por eso, con tres o más grupos, primero va una prueba global.' };
    },
    function () {
      var k = ale(3, 6), n = ale(4, 8);
      return { niv: 'N1', e: 'Kruskal-Wallis con <b>' + k + '</b> grupos de <b>' + n + '</b> datos cada uno. ¿Cuántos grados de libertad tiene H?',
        s: 'gl = k − 1 = <b>' + (k - 1) + '</b>. No N − 1 = ' + (k * n - 1) + ': los grados de libertad cuentan grupos, no datos.' };
    }
  ];

  /* ═══════════ C15 · Correlación ═══════════ */
  G.c15 = [
    function () {
      var sx = ale(10, 25) / 10, sy = ale(50, 120) / 10, r0 = ale(-95, 95) / 100, cov = red(r0 * sx * sy, 2), r = cov / (sx * sy);
      return { niv: 'N1', e: 'cov(x, y) = <b>' + dec(cov, 2) + '</b>, sₓ = <b>' + dec(sx, 1) + '</b>, s_y = <b>' + dec(sy, 1) + '</b>. Calcula r y descríbelo.',
        s: 'r = ' + dec(cov, 2) + '/(' + dec(sx, 1) + ' × ' + dec(sy, 1) + ') = <b>' + dec(r, 2) + '</b>: relación ' + (r > 0 ? 'positiva' : 'negativa') + ' ' +
          (Math.abs(r) >= 0.9 ? 'muy fuerte' : Math.abs(r) >= 0.7 ? 'fuerte' : Math.abs(r) >= 0.4 ? 'moderada' : Math.abs(r) >= 0.2 ? 'débil' : 'muy débil o nula') + '. Siempre entre −1 y 1.' };
    },
    function () {
      var x = [], y = [], b = elegir([4, 5, 6, -3]), a = 60;
      for (var i = 0; i < 6; i++) { var xi = 26 + i; x.push(xi); y.push(Math.round(a + b * (xi - 28) + ale(-4, 4))); }
      var r = E.correl(x, y);
      return { niv: 'N2', e: 'Temperatura (°C): <b>' + x.join(', ') + '</b>. Alimento consumido (kg): <b>' + y.join(', ') + '</b>. Calcula r.',
        s: 'x̄ = ' + dec(E.media(x), 2) + ', ȳ = ' + dec(E.media(y), 2) + '. Σ(x−x̄)(y−ȳ) = ' + dec(E.covS(x, y) * 5, 2) + '; Σ(x−x̄)² = ' + dec(E.devsq(x), 2) + '; Σ(y−ȳ)² = ' + dec(E.devsq(y), 2) + '. r = <b>' + dec(r, 2) + '</b>. Válido solo entre 26 y 31 °C.' };
    },
    function () {
      var q = elegir([
        ['en las fincas con más empleados hay más mortalidad', 'el tamaño de la finca: más estanques, más empleados y más peces que se pueden morir'],
        ['los estanques con más alimento suministrado tienen más amonio', 'aquí sí hay un mecanismo (el alimento sin comer se descompone), pero r solo no lo prueba: habría que variar el alimento dejando todo lo demás igual'],
        ['los meses con más ventas de hielo tienen más peces estresados', 'la temperatura, que mueve las dos cosas'],
        ['los pueblos con más droguerías tienen más enfermos', 'el tamaño del pueblo']
      ]);
      return { niv: 'N3', e: 'Un estudio encuentra r = 0,8 porque <b>' + q[0] + '</b>. ¿Se puede concluir que lo primero causa lo segundo?',
        s: '<b>No.</b> La correlación no establece causa. Explicación alternativa: ' + q[1] + '. Para afirmar causa hay que intervenir: cambiar una cosa a propósito, dejando todo lo demás igual.' };
    },
    function () {
      var cov = ale(80, 200) / 10, f = elegir([2.2, 1000, 0.001]), nom = { 2.2: 'de kilos a libras', 1000: 'de kilos a gramos', 0.001: 'de gramos a kilos' }[f];
      return { niv: 'N2', e: 'Entre temperatura y alimento, cov = <b>' + dec(cov, 1) + '</b> y r = <b>0,95</b>. Si cambias el alimento ' + nom + ', ¿qué pasa con la covarianza y con r?',
        s: 'La covarianza se multiplica por ' + String(f).replace('.', ',') + ': queda <b>' + dec(cov * f, f === 0.001 ? 4 : 1) + '</b>. r queda en <b>0,95</b>: no tiene unidades. Por eso se usa r para comparar, y no la covarianza.' };
    }
  ];

  /* ═══════════ C16 · Regresión ═══════════ */
  G.c16 = [
    function () {
      var Sxx = ale(180, 300) / 10, b0 = ale(40, 70) / 10, Sxy = red(b0 * Sxx, 1), mx = ale(2850, 2950) / 100, my = ale(5500, 6000) / 100;
      var b = red(Sxy / Sxx, 2), a = red(my - b * mx, 1), x0 = red(mx + ale(-10, 10) / 10, 1), yh = a + b * x0;
      return { niv: 'N2', e: 'Datos de temperatura (x) y alimento (y): Σ(x−x̄)(y−ȳ) = <b>' + dec(Sxy, 1) + '</b>, Σ(x−x̄)² = <b>' + dec(Sxx, 1) + '</b>, x̄ = <b>' + dec(mx, 2) + '</b>, ȳ = <b>' + dec(my, 2) + '</b>. Estima la recta y predice el consumo a <b>' + dec(x0, 1) + ' °C</b>.',
        s: 'b = ' + dec(Sxy, 1) + '/' + dec(Sxx, 1) + ' = <b>' + dec(b, 2) + ' kg por grado</b>. a = ' + dec(my, 2) + ' − ' + dec(b, 2) + '·' + dec(mx, 2) + ' = <b>' + dec(a, 1) + '</b>. ŷ = ' + dec(a, 1) + ' + ' + dec(b, 2) + 'x. Para x = ' + dec(x0, 1) + ': ŷ = <b>' + dec(yh, 1) + ' kg</b>. El intercepto no se interpreta: 0 °C está fuera del rango.' };
    },
    function () {
      var a = -ale(1000, 1300) / 10, b = ale(50, 70) / 10, lo = 26, hi = 31, x0 = elegir([27, 28.5, 30, 35, 22]);
      var fuera = x0 < lo || x0 > hi;
      return { niv: 'N2', e: 'La recta ajustada con datos entre <b>' + lo + ' y ' + hi + ' °C</b> es ŷ = <b>' + dec(a, 1) + ' + ' + dec(b, 1) + 'x</b>. ¿Cuánto alimento predice a <b>' + String(x0).replace('.', ',') + ' °C</b>? ¿Le crees?',
        s: 'ŷ = ' + dec(a, 1) + ' + ' + dec(b, 1) + '·' + String(x0).replace('.', ',') + ' = ' + dec(a + b * x0, 1) + ' kg. ' +
          (fuera ? '<b>No hay que creerle</b>: ' + String(x0).replace('.', ',') + ' °C está fuera del rango medido. Extrapolar es inventar; por encima de 34 °C, además, los peces se estresan y comen menos.' : '<b>Sí</b>: está dentro del rango medido.') };
    },
    function () {
      var yh = ale(500, 700) / 10, e = ale(-50, 50) / 10, y = red(yh + e, 1);
      return { niv: 'N1', e: 'La recta predice <b>' + dec(yh, 1) + ' kg</b> y en realidad se consumieron <b>' + dec(y, 1) + ' kg</b>. ¿Cuánto vale el residuo?',
        s: 'Residuo = real − predicho = ' + dec(y, 1) + ' − ' + dec(yh, 1) + ' = <b>' + dec(y - yh, 1) + ' kg</b>: la realidad quedó ' + (y > yh ? 'por encima' : 'por debajo') + ' de la recta.' };
    },
    function () {
      var n = elegir([10, 12, 15]), sct = ale(6000, 9000) / 10, r2 = ale(70, 97) / 100, scr = red(sct * r2, 1), sce = red(sct - scr, 1);
      var cme = sce / (n - 2), F = scr / cme, Fc = red(E.fCritDer(0.05, 1, n - 2), 2), se = Math.sqrt(cme);
      return { niv: 'N2', e: 'Regresión con <b>' + n + '</b> datos: SC total = <b>' + dec(sct, 1) + '</b>, SC regresión = <b>' + dec(scr, 1) + '</b>. Calcula r², sₑ y F. ¿La recta es más que azar (α = 0,05)?',
        s: 'SC error = ' + dec(sct, 1) + ' − ' + dec(scr, 1) + ' = ' + dec(sce, 1) + '. r² = ' + dec(scr, 1) + '/' + dec(sct, 1) + ' = <b>' + dec(scr / sct, 3) + '</b> (variación explicada, no porcentaje de aciertos). CM error = ' + dec(sce, 1) + '/' + (n - 2) + ' = ' + dec(cme, 2) + '; sₑ = <b>' + dec(se, 2) + '</b>. F = ' + dec(scr, 1) + '/' + dec(cme, 2) + ' = <b>' + dec(F, 1) + '</b> contra ' + dec(Fc, 2) + ' con (1, ' + (n - 2) + ') gl: ' +
          (F > Fc ? '<b>se rechaza H₀</b>, la pendiente no es cero.' : '<b>no se rechaza H₀</b>.') };
    }
  ];

  /* ── API ── */
  function banco(cap, n) {
    var gens = G[cap];
    if (!gens) return [];
    var cuantos = n || 8, out = [], orden = mezclar(gens), i = 0;
    while (out.length < cuantos && i < cuantos * 4) { out.push(orden[i % orden.length]()); i++; if (i % orden.length === 0) orden = mezclar(gens); }
    return out;
  }
  function pintarBanco(cap, destino, n) {
    var caja = document.getElementById(destino || 'banco');
    if (!caja) return;
    var lista = banco(cap, n);
    if (!lista.length) { caja.innerHTML = '<div class="caja"><p style="margin:0">Todavía no hay banco para este capítulo.</p></div>'; return; }
    caja.innerHTML = lista.map(function (x, k) {
      return '<div class="ej"><div class="ej-cab"><span class="ej-n">' + (k + 1) + '</span><span class="ej-niv">' + x.niv + '</span></div><p>' + x.e + '</p>' +
        '<details class="sol"><summary>Ver la respuesta</summary><div class="cont">' + x.s + '</div></details></div>';
    }).join('');
  }
  return { G: G, banco: banco, pintarBanco: pintarBanco };
});
