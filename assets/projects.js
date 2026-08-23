(() => {
  "use strict";

  const lang = document.documentElement.lang === "es" ? "es" : "en";
  const root = lang === "es" ? "../" : "";

  const text = (project, field) => project[`${field}_${lang}`] || project[`${field}_en`] || "";
  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const assetUrl = (value = "") => {
    if (!value) return "";
    if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) return value;
    return root + value.replace(/^\//, "");
  };

  const normalizeGallery = (value) => {
    if (!value) return [];
    return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
  };

  const metadata = (project) => [project.year, project.location].filter(Boolean).join(" · ");
  const projectHref = (project) => `projects/${encodeURIComponent(project.slug)}.html`;

  async function loadProjects() {
    const response = await fetch(`${root}data/projects.json`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Projects request failed: ${response.status}`);
    const payload = await response.json();
    const projects = Array.isArray(payload) ? payload : payload.projects;
    if (!Array.isArray(projects)) throw new Error("Invalid projects data");
    return projects
      .filter(project => project && project.published !== false)
      .sort((a, b) => Number(a.order || 9999) - Number(b.order || 9999));
  }

  function renderFeatured(projects) {
    const grid = document.querySelector("[data-projects-featured]");
    if (!grid) return;

    const featured = projects.filter(project => project.featured).slice(0, 4);
    const chosen = featured.length ? featured : projects.slice(0, 4);
    if (!chosen.length) return;

    grid.innerHTML = chosen.map(project => `
      <a class="study" href="${escapeHtml(projectHref(project))}">
        <figure>
          <div class="image-frame"><img src="${escapeHtml(assetUrl(project.cover))}" alt="${escapeHtml(text(project, "alt") || text(project, "title"))}" loading="lazy"></div>
          <figcaption><span>${escapeHtml(text(project, "title"))}</span><small>${escapeHtml(text(project, "label"))}</small></figcaption>
        </figure>
      </a>
    `).join("");
  }

  function renderWork(projects) {
    const list = document.querySelector("[data-projects-list]");
    if (!list) return;
    if (!projects.length) {
      list.innerHTML = `<p class="projects-empty">${lang === "es" ? "Próximamente." : "More work coming soon."}</p>`;
      return;
    }

    list.innerHTML = projects.map((project, index) => {
      const gallery = normalizeGallery(project.gallery);
      const meta = metadata(project);
      const galleryMarkup = gallery.length ? `
        <div class="project-gallery" aria-label="${lang === "es" ? "Galería adicional" : "Additional project gallery"}">
          ${gallery.map((image, imageIndex) => `
            <figure class="project-gallery__item">
              <img src="${escapeHtml(assetUrl(image))}" alt="${escapeHtml((text(project, "alt") || text(project, "title")) + ` ${imageIndex + 2}`)}" loading="lazy">
            </figure>
          `).join("")}
        </div>` : "";

      return `
        <article class="work-project" id="${escapeHtml(project.slug)}">
          <p class="project-number">${String(index + 1).padStart(2, "0")}</p>
          <div class="project-copy">
            <p class="project-label">${escapeHtml(text(project, "label"))}</p>
            <h2><a href="${escapeHtml(projectHref(project))}">${escapeHtml(text(project, "title"))}</a></h2>
            ${meta ? `<p class="project-meta">${escapeHtml(meta)}</p>` : ""}
            <p>${escapeHtml(text(project, "summary"))}</p>
          </div>
          <figure class="project-figure">
            <img src="${escapeHtml(assetUrl(project.cover))}" alt="${escapeHtml(text(project, "alt") || text(project, "title"))}" loading="lazy">
            ${text(project, "caption") ? `<figcaption>${escapeHtml(text(project, "caption"))}</figcaption>` : ""}
          </figure>
          ${galleryMarkup}
        </article>
      `;
    }).join("");
  }

  loadProjects()
    .then(projects => {
      renderFeatured(projects);
      renderWork(projects);
      document.documentElement.classList.add("projects-loaded");
    })
    .catch(error => {
      console.warn("E. DE BOER portfolio data could not be loaded; static fallback remains visible.", error);
    });
})();
