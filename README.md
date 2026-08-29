# Módulos

Micrositio de apoyo de los módulos de José Jair Cárdenas Cardona.
Publicado con GitHub Pages en <https://yaircardenas19.github.io/modulos/>.

## Cómo está organizado

```
/                                  índice general
/uniatlantico/                    Universidad del Atlántico
/uniatlantico/rc/                 Razonamiento Cuantitativo
/uniatlantico/rc/cXX/             capítulo
/uniatlantico/rc/cXX/<ruta>/      RUTA PERMANENTE — es la que va impresa en el QR
/uniatlantico/rc/v/<semestre>/    contenido de cada semestre
/config/semestre.json              qué versión está activa
```

Las rutas permanentes **nunca cambian**: son páginas mínimas que leen
`config/semestre.json` y redirigen a la versión activa. Por eso un módulo
impreso hace dos años sigue llevando al contenido de este semestre.

## Renovar el semestre

1. En `03-MICROSITIO/datos.js`, cambiar `SITIO.semestre`.
2. `node sitio.js` — genera `/v/<nuevo semestre>/` completo.
3. Confirmar que `config/semestre.json` apunta al nuevo valor.
4. `git add -A && git commit -m "semestre <nuevo>" && git push`

Los QR impresos no se tocan.

## Agregar otra materia o universidad

En `03-MICROSITIO/datos.js`, añadir una entrada a `SECCIONES` o a
`materias` y volver a correr el generador. La estructura de carpetas
soporta varias universidades y varias materias por universidad.

## No editar a mano

Todo lo que hay en este repositorio se genera con
`03-MICROSITIO/sitio.js`. Los cambios manuales se pierden en la
siguiente generación: hay que editar `datos.js` o `assets-src/`.
