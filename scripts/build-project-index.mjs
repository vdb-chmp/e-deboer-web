import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";

const projectDir = new URL("../content/projects/", import.meta.url);
const outputDir = new URL("../data/", import.meta.url);
const outputFile = new URL("../data/projects.json", import.meta.url);
const englishProjectDir = new URL("../projects/", import.meta.url);
const spanishProjectDir = new URL("../es/projects/", import.meta.url);
const sitemapFile = new URL("../sitemap.xml", import.meta.url);
const siteUrl = "https://e-deboer.com";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const localized = (project, field, lang) => project[`${field}_${lang}`] || project[`${field}_en`] || "";
const galleryImages = (value) => Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
const assetPath = (value, lang) => `${lang === "es" ? "../../" : "../"}${String(value || "").replace(/^\//, "")}`;

const filenames = (await readdir(projectDir))
  .filter(name => name.endsWith(".json"))
  .sort();

const projects = [];
for (const filename of filenames) {
  const raw = await readFile(new URL(filename, projectDir), "utf8");
  projects.push(JSON.parse(raw));
}

projects.sort((a, b) => {
  const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : 9999;
  const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : 9999;
  return orderA - orderB || String(a.title_en || a.slug || "").localeCompare(String(b.title_en || b.slug || ""));
});

const renderProjectPage = (project, lang) => {
  const isSpanish = lang === "es";
  const title = localized(project, "title", lang);
  const label = localized(project, "label", lang);
  const summary = localized(project, "summary", lang);
  const alt = localized(project, "alt", lang) || title;
  const caption = localized(project, "caption", lang);
  const metadata = [project.year, project.location].filter(Boolean).join(" · ");
  const gallery = galleryImages(project.gallery);
  const canonical = `${siteUrl}/${isSpanish ? "es/" : ""}projects/${encodeURIComponent(project.slug)}.html`;
  const englishUrl = `${siteUrl}/projects/${encodeURIComponent(project.slug)}.html`;
  const spanishUrl = `${siteUrl}/es/projects/${encodeURIComponent(project.slug)}.html`;
  const prefix = "../";
  const root = isSpanish ? "../../" : "../";
  const galleryMarkup = gallery.length ? `
    <section class="project-detail__gallery" aria-label="${isSpanish ? "Galería del proyecto" : "Project gallery"}">
      ${gallery.map((image, index) => `<figure><img src="${escapeHtml(assetPath(image, lang))}" alt="${escapeHtml(`${alt} ${index + 2}`)}" loading="lazy"></figure>`).join("\n      ")}
    </section>` : "";

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(summary)}">
  <meta name="theme-color" content="#ebe6dc">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en" href="${englishUrl}">
  <link rel="alternate" hreflang="es" href="${spanishUrl}">
  <link rel="alternate" hreflang="x-default" href="${englishUrl}">
  <title>${escapeHtml(title)} — E. DE BOER</title>
  <link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${root}assets/styles.css">
</head>
<body>
  <a class="skip-link" href="#main-content">${isSpanish ? "Saltar al contenido" : "Skip to content"}</a>
  <header class="site-header">
    <a class="brand" href="${prefix}index.html" aria-label="E. DE BOER">E. DE BOER</a>
    <div class="header-actions">
      <nav class="site-nav" aria-label="${isSpanish ? "Navegación principal" : "Primary navigation"}">
        <a href="${prefix}index.html">${isSpanish ? "Inicio" : "Home"}</a>
        <a href="${prefix}work.html" aria-current="page">${isSpanish ? "Trabajo" : "Work"}</a>
        <a href="${prefix}about.html">${isSpanish ? "Acerca" : "About"}</a>
        <a href="${prefix}contact.html">${isSpanish ? "Contacto" : "Contact"}</a>
      </nav>
      <div class="language-switch" aria-label="${isSpanish ? "Idioma" : "Language"}"><a href="${isSpanish ? `../../projects/${escapeHtml(project.slug)}.html` : `${escapeHtml(project.slug)}.html`}" lang="en"${isSpanish ? "" : ' aria-current="true"'}>EN</a><span aria-hidden="true">/</span><a href="${isSpanish ? `${escapeHtml(project.slug)}.html` : `../es/projects/${escapeHtml(project.slug)}.html`}" lang="es"${isSpanish ? ' aria-current="true"' : ""}>ES</a></div>
    </div>
  </header>

  <main class="project-detail page-shell" id="main-content">
    <section class="project-detail__intro intro-motion">
      <p class="project-label">${escapeHtml(label)}</p>
      <h1>${escapeHtml(title)}</h1>
      ${metadata ? `<p class="project-meta">${escapeHtml(metadata)}</p>` : ""}
      <p class="project-detail__summary">${escapeHtml(summary)}</p>
    </section>
    <figure class="project-detail__cover intro-motion intro-motion--delay">
      <img src="${escapeHtml(assetPath(project.cover, lang))}" alt="${escapeHtml(alt)}">
      ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}
    </figure>${galleryMarkup}
    <a class="text-link project-detail__back" href="${prefix}work.html">${isSpanish ? "Volver a Trabajo" : "Back to Work"} <span aria-hidden="true">↗</span></a>
  </main>

  <footer class="site-footer"><span>E. DE BOER</span><span>${isSpanish ? "Objetos · Materiales · Entornos" : "Objects · Materials · Environments"}</span><span>${isSpanish ? "España / Europa" : "Spain / Europe"}</span><a class="studio-access" href="${root}studio/" rel="nofollow">Studio <span aria-hidden="true">↗</span></a></footer>
  <!-- Cloudflare Web Analytics: replace CLOUDFLARE_WEB_ANALYTICS_TOKEN, then uncomment the script.
  <script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"CLOUDFLARE_WEB_ANALYTICS_TOKEN"}'></script>
  -->
</body>
</html>
`;
};

await mkdir(outputDir, { recursive: true });
await writeFile(outputFile, `${JSON.stringify({ projects }, null, 2)}\n`, "utf8");

await rm(englishProjectDir, { recursive: true, force: true });
await rm(spanishProjectDir, { recursive: true, force: true });
await mkdir(englishProjectDir, { recursive: true });
await mkdir(spanishProjectDir, { recursive: true });

const publishedProjects = projects.filter(project => project && project.published !== false);
for (const project of publishedProjects) {
  await writeFile(new URL(`${project.slug}.html`, englishProjectDir), renderProjectPage(project, "en"), "utf8");
  await writeFile(new URL(`${project.slug}.html`, spanishProjectDir), renderProjectPage(project, "es"), "utf8");
}

const fixedPairs = [
  ["/", "/es/"],
  ["/work.html", "/es/work.html"],
  ["/about.html", "/es/about.html"],
  ["/contact.html", "/es/contact.html"],
];
const projectPairs = publishedProjects.map(project => [
  `/projects/${encodeURIComponent(project.slug)}.html`,
  `/es/projects/${encodeURIComponent(project.slug)}.html`,
]);
const sitemapEntries = [...fixedPairs, ...projectPairs].flatMap(([enPath, esPath]) => [enPath, esPath].map(path => `  <url>
    <loc>${escapeHtml(siteUrl + path)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeHtml(siteUrl + enPath)}" />
    <xhtml:link rel="alternate" hreflang="es" href="${escapeHtml(siteUrl + esPath)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(siteUrl + enPath)}" />
  </url>`));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.join("\n")}
</urlset>
`;
await writeFile(sitemapFile, sitemap, "utf8");

console.log(`Built project data, ${publishedProjects.length * 2} localized project pages and sitemap from ${projects.length} project file(s).`);
