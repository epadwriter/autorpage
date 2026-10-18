(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const paragraphs = t => esc(t).split(/\n\s*\n|\\n/).map(x => `<p>${x.replace(/\n/g, "<br>")}</p>`).join("");
  const safeUrl = u => /^https?:\/\//i.test(u || "") ? u : "";

  // Convierte enlaces de Google Drive a URL de imagen directa
  function img(u) {
    u = (u || "").trim();
    const m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/) || u.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([\w-]+)/);
    if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1600`;
    return safeUrl(u);
  }
  function ytId(u = "") {
    const m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  // "Etiqueta|url; Etiqueta2|url2"
  function links(s = "") {
    return s.split(/;|\n/).map(x => x.trim()).filter(Boolean).map(x => {
      const [a, b] = x.includes("|") ? x.split("|") : [x, x];
      return { label: a.trim(), url: safeUrl((b || "").trim()) };
    }).filter(l => l.url);
  }

  // CSV parser (soporta comillas y saltos de línea)
  function parseCSV(text) {
    const rows = []; let row = [], f = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n") { row.push(f); rows.push(row); row = []; f = ""; }
      else if (c !== "\r") f += c;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    const norm = h => h.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
    const head = (rows.shift() || []).map(norm);
    return rows.filter(r => r.some(x => x.trim())).map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
  }

  async function load(name) {
    const url = window.SITE_CONFIG.sheets[name];
    if (!url) return window.DEMO_DATA[name];
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(r.status);
      return parseCSV(await r.text());
    } catch (e) {
      console.warn("No se pudo cargar", name, e);
      return [];
    }
  }

  const empty = '<p class="empty">Pronto habrá contenido aquí.</p>';

  const renderers = {
    perfil(rows) {
      const d = Object.fromEntries(rows.map(r => [r.clave, r.valor]));
      document.title = d.nombre || "Autor";
      $("#brand").textContent = d.nombre || "Autor";
      $("#footer-name").textContent = d.nombre || "";
      const soc = links(d.redes).map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("");
      $("#perfil").innerHTML = `
        <div class="author">
          ${img(d.foto) ? `<img class="author-photo" src="${esc(img(d.foto))}" alt="${esc(d.nombre)}">` : ""}
          <div>
            <p class="eyebrow">${esc(d.titulo)}</p>
            <h1>${esc(d.nombre)}</h1>
            ${d.lema ? `<p class="lema">${esc(d.lema)}</p>` : ""}
            <div class="bio">${paragraphs(d.bio || "")}</div>
            <div class="social">${soc}</div>
          </div>
        </div>`;
    },
    libros(rows) {
      $("#libros").innerHTML = rows.length ? rows.map(b => `
        <article class="book">
          ${img(b.portada) ? `<img src="${esc(img(b.portada))}" alt="Portada de ${esc(b.titulo)}" loading="lazy">` : ""}
          <div>
            <h3>${esc(b.titulo)} ${b.anio ? `<small>${esc(b.anio)}</small>` : ""}</h3>
            <div>${paragraphs(b.sinopsis)}</div>
            <div class="buy">${links(b.enlaces).map(l => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}</div>
          </div>
        </article>`).join("") : empty;
    },
    personajes(rows) {
      $("#personajes").innerHTML = rows.length ? rows.map(c => `
        <article class="card">
          ${img(c.foto) ? `<img src="${esc(img(c.foto))}" alt="${esc(c.nombre)}" loading="lazy">` : ""}
          <div class="card-body"><h3>${esc(c.nombre)}</h3>
          ${c.aparece_en ? `<span class="tag">${esc(c.aparece_en)}</span>` : ""}
          <p>${esc(c.descripcion)}</p></div>
        </article>`).join("") : empty;
    },
    galeria(rows) {
      $("#galeria").innerHTML = rows.length ? rows.map((g, i) => `
        <button class="thumb" data-i="${i}" aria-label="Ampliar: ${esc(g.descripcion)}">
          <img src="${esc(img(g.foto))}" alt="${esc(g.descripcion)}" loading="lazy">
        </button>`).join("") : empty;
      $("#galeria").onclick = e => {
        const b = e.target.closest(".thumb"); if (!b) return;
        const g = rows[b.dataset.i];
        openLightbox(`<img src="${esc(img(g.foto))}" alt="${esc(g.descripcion)}"><p>${esc(g.descripcion)}</p>`, b);
      };
    },
    videos(rows) {
      $("#videos").innerHTML = rows.length ? rows.map(v => {
        const id = ytId(v.url);
        return `<article class="card">
          ${id ? `<div class="video" data-id="${id}" role="button" tabindex="0" aria-label="Reproducir ${esc(v.titulo)}">
            <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><span class="play">▶</span></div>` : ""}
          <div class="card-body"><h3>${esc(v.titulo)}</h3><p>${esc(v.descripcion)}</p></div>
        </article>`;
      }).join("") : empty;
      const play = el => {
        el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${el.dataset.id}?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe>`;
      };
      $("#videos").onclick = e => { const v = e.target.closest(".video"); if (v && !v.querySelector("iframe")) play(v); };
      $("#videos").onkeydown = e => { const v = e.target.closest(".video"); if (v && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); if (!v.querySelector("iframe")) play(v); } };
    },
    blog(rows) {
      const sorted = [...rows].sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));
      $("#blog").innerHTML = sorted.length ? sorted.map(p => `
        <article class="post">
          ${img(p.foto) ? `<img src="${esc(img(p.foto))}" alt="" loading="lazy">` : ""}
          <h3>${esc(p.titulo)}</h3>
          ${p.fecha ? `<time>${esc(p.fecha)}</time>` : ""}
          <div class="post-text">${paragraphs(p.texto)}</div>
        </article>`).join("") : empty;
    }
  };

  // Lightbox
  const lb = $("#lightbox"); let lastFocus;
  function openLightbox(html, from) {
    lastFocus = from;
    $("#lb-content").innerHTML = html;
    lb.hidden = false; document.body.style.overflow = "hidden";
    $("#lb-close").focus();
  }
  function closeLightbox() {
    if (lb.hidden) return;
    lb.hidden = true; document.body.style.overflow = ""; $("#lb-content").innerHTML = "";
    lastFocus && lastFocus.focus();
  }
  $("#lb-close").onclick = closeLightbox;
  lb.onclick = e => { if (e.target === lb) closeLightbox(); };
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  // Pestañas
  const tabs = ["inicio", "personajes", "galeria", "videos", "blog"];
  function show() {
    const h = location.hash.slice(1);
    const t = tabs.includes(h) ? h : "inicio";
    tabs.forEach(n => {
      $("#tab-" + n).hidden = n !== t;
      $(`[data-tab="${n}"]`).classList.toggle("active", n === t);
      $(`[data-tab="${n}"]`).setAttribute("aria-current", n === t ? "page" : "false");
    });
    document.body.classList.remove("menu-open");
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", show);
  $("#menu-btn").onclick = () => document.body.classList.toggle("menu-open");

  Promise.all(Object.keys(renderers).map(async k => renderers[k](await load(k)))).then(() => {
    $("#loading").hidden = true;
  });
  show();
})();
