# E. DE BOER — Studio setup

The website is now data-driven for portfolio projects.

## Editing projects

1. Open https://app.pagescms.org
2. Sign in with GitHub.
3. Install the Pages CMS GitHub App only for `vdb-chmp/e-deboer-web`.
4. Open the repository and select `Portfolio`.
5. Open `Projects` and use **New entry** to add a project, or open an existing entry to edit it.
6. Save. Pages CMS writes that project file to GitHub.
7. The included GitHub Action rebuilds `data/projects.json`, the EN/ES project detail pages and `sitemap.xml`.

### Safety choices already built in

- `Published` hides/shows a project without deleting it.
- Delete and rename are disabled for project entries in Pages CMS.
- Every project is a separate JSON file, so one bad edit cannot damage the whole archive.
- Projects have an explicit display order.
- Every published project receives its own measurable EN/ES URL.
- Project images are kept under `assets/images`.
- `.pages.yml` does not contain passwords or tokens.
- The Studio page has `noindex` and robots exclusion. This is privacy hygiene, not authentication.
- Git history provides rollback if content is changed accidentally.

## Recommended Cloudflare Access layer

When the final custom domain is active in Cloudflare:

1. Zero Trust → Access controls → Applications.
2. Create a Self-hosted application for the final domain path `/studio/*`.
3. Create an `Allow` policy with **one exact authorized email/identity**.
4. Use your normal identity provider or One-time PIN.
5. Do not create a broad OTP rule that accepts arbitrary email addresses.

Note: Cloudflare Access protects the local `/studio/` gateway. Pages CMS itself remains protected by GitHub authentication. Do not put GitHub tokens in website JavaScript.

## Content model

`content/projects/*.json` is the editable source for the gallery. `data/projects.json` is generated automatically for the public site. Each project supports:

- slug
- published / hidden
- featured on Home
- display order
- English and Spanish title
- English and Spanish category label
- English and Spanish description
- year and location
- cover image
- up to 16 additional gallery images
- English and Spanish alt text and caption
