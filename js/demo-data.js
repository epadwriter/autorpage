// Datos de ejemplo: se usan solo cuando no hay enlace de Google Sheets en config.js
const p = (s, w, h) => `https://picsum.photos/seed/${s}/${w}/${h}`;
window.DEMO_DATA = {
  perfil: [
    { clave: "nombre", valor: "Nombre del Autor" },
    { clave: "titulo", valor: "Escritor · Creador de contenido" },
    { clave: "lema", valor: "Historias que se quedan contigo." },
    { clave: "foto", valor: p("autor", 600, 600) },
    { clave: "bio", valor: "Escribe aquí la biografía del autor.\n\nPuedes usar varios párrafos separándolos con una línea en blanco." },
    { clave: "redes", valor: "Instagram|https://instagram.com; YouTube|https://youtube.com; TikTok|https://tiktok.com" }
  ],
  libros: [
    { titulo: "Libro Uno", anio: "2022", portada: p("l1", 400, 600), sinopsis: "Sinopsis del primer libro. Una historia de aventuras, misterio y descubrimiento.", enlaces: "Amazon|https://amazon.com; Google Books|https://books.google.com" },
    { titulo: "Libro Dos", anio: "2024", portada: p("l2", 400, 600), sinopsis: "Sinopsis del segundo libro. La saga continúa con nuevos retos.", enlaces: "Amazon|https://amazon.com" }
  ],
  personajes: [
    { nombre: "Personaje A", foto: p("pa", 500, 500), descripcion: "Valiente y testarudo; protagonista de la saga.", aparece_en: "Libro Uno" },
    { nombre: "Personaje B", foto: p("pb", 500, 500), descripcion: "Misteriosa guardiana del bosque.", aparece_en: "Libro Dos · Cortometraje" }
  ],
  galeria: [
    { foto: p("g1", 800, 600), descripcion: "Presentación del libro" },
    { foto: p("g2", 600, 800), descripcion: "Feria del libro" },
    { foto: p("g3", 800, 800), descripcion: "Proceso creativo" },
    { foto: p("g4", 900, 600), descripcion: "Firma de ejemplares" }
  ],
  videos: [
    { titulo: "Cortometraje de ejemplo", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", descripcion: "Descripción del cortometraje." }
  ],
  blog: [
    { titulo: "Primera entrada", fecha: "2026-01-15", foto: p("b1", 900, 500), texto: "Texto de la entrada.\n\nSegundo párrafo de la entrada del blog." },
    { titulo: "Opinión sobre escribir", fecha: "2026-02-20", foto: p("b2", 900, 500), texto: "Una reflexión sobre el oficio de escribir." }
  ]
};
