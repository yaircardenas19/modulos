/* ─────────────────────────────────────────────────────────────────────────
   Biblioteca estadística mínima del micrositio de Bioestadística.
   Sirve en el navegador (window.ESTAD) y en Node (require).
   La usan: hojas.js, para dejar calculados los resultados de las hojas de
   Excel, y banco.js, para calcular las respuestas del banco de ejercicios.

   Las respuestas de un ejercicio publicado salen de aquí: por eso cada
   función está comprobada contra valores de tabla en probar-estad.js.
   ───────────────────────────────────────────────────────────────────────── */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.ESTAD = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ── funciones especiales ── */
  function lnGamma(x) {                              // Lanczos, g = 7
    var c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x);
    x -= 1;
    var a = c[0], t = x + 7.5;
    for (var i = 1; i < 9; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function betacf(a, b, x) {                         // fracción continua (Numerical Recipes)
    var MAXIT = 300, EPS = 3e-14, FPMIN = 1e-300;
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d; var h = d;
    for (var m = 1; m <= MAXIT; m++) {
      var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; var del = d * c; h *= del;
      if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  }
  function ibeta(x, a, b) {                          // beta incompleta regularizada I_x(a,b)
    if (x <= 0) return 0; if (x >= 1) return 1;
    var bt = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  function gammaP(a, x) {                            // gamma incompleta regularizada inferior
    if (x <= 0) return 0;
    var gln = lnGamma(a);
    if (x < a + 1) {
      var ap = a, sum = 1 / a, del = sum;
      for (var n = 0; n < 500; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 3e-15) break; }
      return sum * Math.exp(-x + a * Math.log(x) - gln);
    }
    var b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
    for (var i = 1; i < 500; i++) {
      var an = -i * (i - a); b += 2;
      d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
      c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; var dl = d * c; h *= dl; if (Math.abs(dl - 1) < 3e-15) break;
    }
    return 1 - Math.exp(-x + a * Math.log(x) - gln) * h;
  }
  function biseccion(f, lo, hi, obj) {               // f creciente en [lo,hi]
    for (var i = 0; i < 200; i++) { var m = (lo + hi) / 2; if (f(m) < obj) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  /* ── normal ── */
  function normCDF(z) {                              // Φ(z) vía erfc de alta precisión
    var t = 1 / (1 + 0.5 * Math.abs(z / Math.SQRT2));
    var y = t * Math.exp(-(z * z / 2) - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 +
      t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
      t * (-0.82215223 + t * 0.17087277)))))))));
    return z >= 0 ? 1 - y / 2 : y / 2;
  }
  function normInv(p) {                              // Acklam, error relativo < 1,2e-9
    if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
    var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00],
        b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01],
        c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00],
        d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    var q, r, pl = 0.02425;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
    if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
    q = p - 0.5; r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q / (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  }

  /* ── t, ji-cuadrado, F ── */
  function tCDF(t, df) { var x = df / (df + t * t), p = 0.5 * ibeta(x, df / 2, 0.5); return t >= 0 ? 1 - p : p; }
  function t2colas(t, df) { return ibeta(df / (df + t * t), df / 2, 0.5); }          // P(|T| > |t|)
  function tCrit2(alfa, df) { return biseccion(function (t) { return 1 - t2colas(t, df); }, 0, 200, 1 - alfa); }
  function chiDer(x, k) { return 1 - gammaP(k / 2, x / 2); }                          // P(χ² > x)
  function chiCritDer(alfa, k) { return biseccion(function (x) { return 1 - chiDer(x, k); }, 0, 2000, 1 - alfa); }
  function fDer(f, d1, d2) { return f <= 0 ? 1 : ibeta(d2 / (d2 + d1 * f), d2 / 2, d1 / 2); } // P(F > f)
  function fCritDer(alfa, d1, d2) { return biseccion(function (f) { return 1 - fDer(f, d1, d2); }, 0, 1e5, 1 - alfa); }

  /* ── discretas ── */
  function comb(n, r) { if (r < 0 || r > n) return 0; r = Math.min(r, n - r); var c = 1; for (var i = 1; i <= r; i++) c = c * (n - r + i) / i; return Math.round(c); }
  function perm(n, r) { var p = 1; for (var i = 0; i < r; i++) p *= (n - i); return p; }
  function fact(n) { var f = 1; for (var i = 2; i <= n; i++) f *= i; return f; }
  function binomPMF(x, n, p) { return comb(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x); }
  function binomCDF(x, n, p) { var s = 0; for (var i = 0; i <= x; i++) s += binomPMF(i, n, p); return s; }
  function poissonPMF(x, l) { return Math.exp(-l + x * Math.log(l) - lnGamma(x + 1)); }
  function poissonCDF(x, l) { var s = 0; for (var i = 0; i <= x; i++) s += poissonPMF(i, l); return s; }

  /* ── descriptivas (con las mismas convenciones de Excel) ── */
  function suma(v) { return v.reduce(function (a, b) { return a + b; }, 0); }
  function media(v) { return suma(v) / v.length; }
  function devsq(v) { var m = media(v); return suma(v.map(function (x) { return (x - m) * (x - m); })); }
  function varS(v) { return devsq(v) / (v.length - 1); }
  function desvS(v) { return Math.sqrt(varS(v)); }
  function ordenar(v) { return v.slice().sort(function (a, b) { return a - b; }); }
  function mediana(v) { var s = ordenar(v), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
  function cuartilInc(v, k) { var s = ordenar(v), h = (s.length - 1) * k / 4, i = Math.floor(h); return i + 1 < s.length ? s[i] + (h - i) * (s[i + 1] - s[i]) : s[i]; }
  function covS(x, y) { var mx = media(x), my = media(y), s = 0; for (var i = 0; i < x.length; i++) s += (x[i] - mx) * (y[i] - my); return s / (x.length - 1); }
  function correl(x, y) { return covS(x, y) / (desvS(x) * desvS(y)); }
  function pendiente(x, y) { return covS(x, y) / varS(x); }
  function interseccion(x, y) { return media(y) - pendiente(x, y) * media(x); }
  function rangosMedios(v) {                         // JERARQUIA.MEDIA ascendente
    var idx = v.map(function (x, i) { return [x, i]; }).sort(function (a, b) { return a[0] - b[0]; });
    var r = new Array(v.length), i = 0;
    while (i < idx.length) {
      var j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
      var rm = (i + j + 2) / 2; for (var k = i; k <= j; k++) r[idx[k][1]] = rm; i = j + 1;
    }
    return r;
  }

  return {
    lnGamma: lnGamma, ibeta: ibeta, gammaP: gammaP,
    normCDF: normCDF, normInv: normInv,
    tCDF: tCDF, t2colas: t2colas, tCrit2: tCrit2,
    chiDer: chiDer, chiCritDer: chiCritDer, fDer: fDer, fCritDer: fCritDer,
    comb: comb, perm: perm, fact: fact,
    binomPMF: binomPMF, binomCDF: binomCDF, poissonPMF: poissonPMF, poissonCDF: poissonCDF,
    suma: suma, media: media, devsq: devsq, varS: varS, desvS: desvS, ordenar: ordenar,
    mediana: mediana, cuartilInc: cuartilInc, covS: covS, correl: correl,
    pendiente: pendiente, interseccion: interseccion, rangosMedios: rangosMedios
  };
});
