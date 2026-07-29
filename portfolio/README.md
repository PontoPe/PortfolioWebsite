# Pedro Martins - DevSecOps & Cloud Security Portfolio

Source code for [pedromartins.tech](https://pedromartins.tech), an interactive portfolio focused on secure automation, cloud infrastructure, production operations, and security engineering.

The site connects Pedro's professional experience with technical evidence: project case studies, architecture decisions, security write-ups, an interactive terminal, and small browser experiments.

## Highlights

- Production case studies covering BRASILCON, Hyundai, JBS, and a confidential fintech engagement
- Security and infrastructure work spanning AWS, Linux, Docker, Kubernetes, Terraform, Cloudflare Tunnel, and CI/CD
- Project pages for the BNPL platform, Docker Email Tracker, CowRec, TourneySys, and other selected work
- Technical write-ups on secure onboarding automation, zero-open-port publishing infrastructure, and home-server hardening
- Markdown-powered blog and project routes
- Responsive, accessible interface with an optional terminal experience

## Stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- `gray-matter`, `react-markdown`, and GitHub Flavored Markdown
- Lucide icons

## Local development

Requirements:

- Node.js 24 or newer
- npm

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scheduled blog publishing

Blog post frontmatter uses an ISO publication date:

```yaml
date: "2026-09-02"
```

Future-dated posts are excluded from both the blog index and the generated
static routes. The deployment workflow rebuilds the site every day at 00:17 in
`America/Sao_Paulo`, so a scheduled post is published on its date even when the
content repository receives no new commit that day.

## Quality checks

```bash
npm run lint
npm run build
```

## Project structure

```text
app/                 Next.js routes and page metadata
components/          Shared interactive components
lib/                 Content and virtual filesystem helpers
public/projects/     Project imagery
public/stack/        Technology icons
public/write-ups/    Long-form case studies
```

## Security notes

- No secrets or API keys are stored in the repository.
- External links opened in a new tab use `noopener noreferrer`.
- Contact form data is submitted over HTTPS to the configured form service.
- Content paths should be treated as untrusted input and validated before any future dynamic file lookup is added.

## Roadmap

- [ ] Move professional content into typed data files so CV, project pages, and profile summaries remain synchronized.
- [ ] Add automated checks for broken links and Markdown content.
- [ ] Add end-to-end tests for navigation, forms, and interactive terminal commands.
- [ ] Add a dedicated page for cloud security and software supply-chain projects.

<!-- TODO: Update this README when the deployment, content model, or security controls change. -->
