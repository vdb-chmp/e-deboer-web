# E. DE BOER — portfolio website

Lightweight static portfolio prepared for GitHub Pages.

## Structure

- `index.html` — Home
- `work.html` — Work / personal and material studies
- `about.html` — About
- `contact.html` — Contact
- `es/` — Spanish versions of the four public pages
- `content/projects/` — Editable project source files
- `data/projects.json` — Generated public project index
- `projects/` and `es/projects/` — Generated, measurable project detail URLs
- `studio/` — Administration gateway (not authentication by itself)
- `.pages.yml` — Pages CMS configuration
- `sitemap.xml` and `robots.txt` — Search indexing configuration
- `404.html` — Not-found page
- `assets/` — Styles and provisional direction imagery

No framework is required. Publish the repository root from the `main` branch in GitHub Pages. The included workflow only rebuilds the generated project index after CMS edits.

## Before the final public launch

1. The EN/ES contact forms use Formspree for server-side delivery. The destination address remains private in Formspree, and Formshield plus a honeypot provide spam protection.
2. Replace provisional direction imagery progressively with photographs of physical E. DE BOER work.
3. Connect `e-deboer.com` in GitHub Pages and add a `CNAME` file containing that domain.
4. If `edeboer.com` is acquired later, make it canonical and configure a permanent 301 redirect from `e-deboer.com` at the DNS/edge layer.

## Cloudflare Web Analytics

The official manual Cloudflare beacon is prepared as a commented snippet near the closing `</body>` tag of every public EN/ES page. It is intentionally inactive until the real site token exists.

1. In Cloudflare, open **Web Analytics** and add the hostname `e-deboer.com`.
2. Open **Manage site** and copy the site token from the official JavaScript snippet.
3. Replace every `CLOUDFLARE_WEB_ANALYTICS_TOKEN` placeholder with the real token.
4. Uncomment each prepared beacon script and deploy.
5. Do not enable a second automatic beacon at the same time; Cloudflare supports one snippet per page.

Cloudflare Web Analytics reports page paths, referrers, countries, devices, browsers and operating systems. Each published project receives its own generated EN/ES URL, so project traffic can be filtered by path. Cloudflare currently does not record query strings or expose UTM parameters. UTM URLs still load normally, but their `utm_source` value will not appear as a separate Cloudflare dimension.

## Google Search Console

The final canonical hostname is already set to `https://e-deboer.com` and EN/ES pages include reciprocal `hreflang` plus `x-default` links.

1. Add the URL-prefix property `https://e-deboer.com/` in Search Console.
2. Choose **HTML tag** verification.
3. Copy only the verification value from the supplied meta tag.
4. Replace `GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE` in the root `index.html`.
5. Deploy, confirm the tag appears in the live page source, then select **Verify**.
6. Submit `https://e-deboer.com/sitemap.xml` in Search Console.

Do not remove the verification meta tag after verification.

## Private Studio security

`/studio/` contains no credentials or tokens and is marked `noindex`. Pages CMS still requires GitHub authentication. When the custom domain is proxied through Cloudflare, create a Cloudflare Access self-hosted application for the exact path `e-deboer.com/studio/*` and an **Allow** policy limited to the owner's exact identity. Access is deny-by-default for everyone else.

Cloudflare Access only protects requests passing through the custom domain. The underlying GitHub Pages URL may remain directly reachable, so Pages CMS/GitHub authentication remains the authorization boundary for repository changes. Never place a GitHub token in frontend code.
