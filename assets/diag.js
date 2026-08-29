/* ─────────────────────────────────────────────────────────
   Motor de autoevaluación del micrositio.
   La página define window.RC_DIAG = { items:[...] } y aquí
   se renderiza, se califica y se da retroalimentación por error.
   ───────────────────────────────────────────────────────── */
(function () {
  "use strict";
  var D = window.RC_DIAG;
  if (!D || !D.items || !D.items.length) return;
  var cont = document.getElementById("quiz");
  if (!cont) return;

  var LETRAS = ["a", "b", "c", "d", "e"];
  var revisado = false;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* Acepta coma o punto decimal, y separadores de miles con punto o espacio. */
  function aNumero(txt) {
    if (txt === null || txt === undefined) return NaN;
    var s = String(txt).trim().replace(/\s/g, "");
    if (!s) return NaN;
    s = s.replace(/[$%]/g, "");
    var tieneComa = s.indexOf(",") >= 0;
    var tienePunto = s.indexOf(".") >= 0;
    if (tieneComa && tienePunto) {
      // 1.234,56 → el último separador manda como decimal
      if (s.lastIndexOf(",") > s.lastIndexOf(".")) s = s.replace(/\./g, "").replace(",", ".");
      else s = s.replace(/,/g, "");
    } else if (tieneComa) {
      // puede ser decimal (0,25) o miles (12,600): si hay 3 dígitos después, son miles
      var p = s.split(",");
      if (p.length === 2 && p[1].length === 3 && p[0].length <= 3) s = s.replace(",", "");
      else s = s.replace(",", ".");
    } else if (tienePunto) {
      var q = s.split(".");
      if (q.length === 2 && q[1].length === 3 && q[0].length <= 3) s = s.replace(".", "");
      else if (q.length > 2) s = s.replace(/\./g, "");
    }
    var n = Number(s);
    return isNaN(n) ? NaN : n;
  }

  function cerca(a, b, tol) {
    if (isNaN(a)) return false;
    var t = (tol === undefined) ? Math.max(Math.abs(b) * 0.005, 0.0005) : tol;
    return Math.abs(a - b) <= t;
  }

  /* ── Render ── */
  cont.innerHTML = D.items.map(function (it, i) {
    var cuerpo;
    if (it.tipo === "num") {
      cuerpo = '<div><input class="num-in" type="text" inputmode="decimal" ' +
               'data-i="' + i + '" aria-label="Respuesta de la pregunta ' + (i + 1) + '" ' +
               'placeholder="tu respuesta">' +
               (it.unidad ? '<span class="unidad">' + esc(it.unidad) + "</span>" : "") + "</div>";
    } else {
      cuerpo = '<div class="ops" role="radiogroup" aria-label="Opciones de la pregunta ' + (i + 1) + '">' +
        it.ops.map(function (o, j) {
          return '<label class="op" data-i="' + i + '" data-j="' + j + '">' +
                 '<input type="radio" name="q' + i + '" value="' + j + '">' +
                 '<span class="let">' + LETRAS[j] + "</span>" +
                 "<span>" + o + "</span></label>";
        }).join("") + "</div>";
    }
    return '<div class="item" id="item' + i + '">' +
           '<p class="item-n">Pregunta ' + (i + 1) + " de " + D.items.length + "</p>" +
           '<p class="item-p">' + it.p + "</p>" + cuerpo +
           '<div class="fb" id="fb' + i + '" hidden></div></div>';
  }).join("");

  /* ── Calificar ── */
  function calificar() {
    var buenas = 0;
    D.items.forEach(function (it, i) {
      var fb = document.getElementById("fb" + i);
      var acerto = false, textoFb = "";

      if (it.tipo === "num") {
        var inp = cont.querySelector('input[data-i="' + i + '"]');
        var v = aNumero(inp.value);
        acerto = cerca(v, it.resp, it.tol);
        inp.classList.remove("ok", "mal");
        inp.classList.add(acerto ? "ok" : "mal");
        textoFb = acerto
          ? (it.fbOk || "Correcto.")
          : "<b>La respuesta es " + esc(it.respTexto || it.resp) + "</b>" + (it.fbMal ? it.fbMal : "");
      } else {
        var sel = cont.querySelector('input[name="q' + i + '"]:checked');
        var j = sel ? Number(sel.value) : -1;
        acerto = j === it.correcta;
        cont.querySelectorAll('.op[data-i="' + i + '"]').forEach(function (lb) {
          lb.classList.remove("ok", "mal");
          var jj = Number(lb.getAttribute("data-j"));
          if (jj === it.correcta) lb.classList.add("ok");
          else if (jj === j) lb.classList.add("mal");
        });
        if (acerto) {
          textoFb = (it.fb && it.fb[j]) || "Correcto.";
        } else if (j < 0) {
          textoFb = "<b>Sin responder.</b> La correcta es la <b>" + LETRAS[it.correcta] + "</b>. " +
                    ((it.fb && it.fb[it.correcta]) || "");
        } else {
          textoFb = "<b>La correcta es la " + LETRAS[it.correcta] + ".</b> " +
                    ((it.fb && it.fb[j]) || "");
        }
      }

      if (acerto) buenas++;
      fb.className = "fb " + (acerto ? "ok" : "mal");
      fb.innerHTML = textoFb;
      fb.hidden = false;
    });

    var marc = document.getElementById("marcador");
    var res = document.getElementById("resultado");
    res.innerHTML = buenas + " de " + D.items.length + "<small>" +
      (buenas === D.items.length ? "todas correctas"
        : buenas >= D.items.length - 1 ? "casi"
        : "lleva a clase las que fallaste") + "</small>";
    marc.hidden = false;
    revisado = true;
    document.getElementById("btRevisar").textContent = "Revisar otra vez";
    marc.scrollIntoView({ block: "nearest" });
  }

  function reiniciar() {
    cont.querySelectorAll("input").forEach(function (i) {
      if (i.type === "radio") i.checked = false; else i.value = "";
      i.classList.remove("ok", "mal");
    });
    cont.querySelectorAll(".op").forEach(function (o) { o.classList.remove("ok", "mal"); });
    cont.querySelectorAll(".fb").forEach(function (f) { f.hidden = true; });
    document.getElementById("marcador").hidden = true;
    document.getElementById("btRevisar").textContent = "Revisar mis respuestas";
    revisado = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.getElementById("btRevisar").addEventListener("click", calificar);
  var btR = document.getElementById("btReiniciar");
  if (btR) btR.addEventListener("click", reiniciar);
})();
