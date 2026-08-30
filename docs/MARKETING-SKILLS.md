# Marketing / Growth Skills — Reference Index

> All skills from `/Users/user/.claude/skills/` and `/Users/user/.config/opencode/skills/`
> Installed globally; no additional setup needed.

---

## Programmatic / Content / SEO Cluster (USED in this project)

| Skill | When triggered | Applied here |
|---|---|---|
| `programmatic-seo` | "programmatic SEO", "pages at scale" | 📄 matrix 370 pages, sitemap split |
| `content-decomposer` | "content strategy", "content calendar" | 📄 blog-plan.json (25 тем) |
| `content-factory` | "content factory", "контент-фабрика" | 📄 370 .md страниц, 3000+ симв. |
| `seo-optimizer` | "SEO", "search engine" | 📄 title/desc/H1-4, JSON-LD, sitemap |
| `ai-seo` | "AI SEO", "AEO", "GEO", "LLMs" | 📄 llms.txt, llms-full.txt, .md twin |
| `landing-builder` | "landing page", "сайт для услуги" | 📄 лендинги с CTA + sticky bar |

## Marketing / Conversion / Growth Cluster (INSTALLED — available)

| Skill | When triggered | What it produces |
|---|---|---|
| `marketing-plan` | "marketing plan", "GTM" | 📄 AARRR plan, 90-day roadmap, ops stack |
| `marketing-council` | "marketing council", "board of advisors" | 📄 multi-perspective strategic memo |
| `growth-hacker` | "growth", "funnel", "conversion rate" | 📄 funnel analysis, experiment backlog |
| `launch` | "product launch", "go to market" | 📄 GTM checklist, launch assets, PR |
| `free-tools` | "free tool", "calculator", "generator" | 📄 marketing-engineering tool spec |
| `offers` | "offer design", "pricing strategy" | 📄 value stack, guarantee, scarcity |
| `pricing` | "pricing", "monetization", "pricing page" | 📄 pricing tier audit, value metric |
| `referrals` | "referral program", "word of mouth" | 📄 viral loop design, incentive structure |
| `public-relations` | "PR", "press" | 📄 media list, pitch templates, HARO/Qwoted |

## Content / Writing / Quality Cluster (INSTALLED)

| Skill | Trigger | Output |
|---|---|---|
| `content-strategy` | "content strategy", "topic clusters" | 📄 pillar + cluster map, editorial calendar |
| `copywriter` | "landing page", "sales copy" | 📄 persuasive copy with frameworks |
| `copy-editing` | "polish copy", "tighten" | 📄 tightened marketing text |
| `email-writer` | "professional email" | 📄 strategic email variants |
| `technical-writing` | "technical docs", "README" | 📄 structured docs (Google style) |
| `documentation-writer` | "README", "API docs" | 📄 scannable docs with examples |

---

## How to invoke (non-interactively)

```bash
# Example: get marketing council recommendations for this site
opencode run ...  # or invoke via skill router: ask "find marketing skills for electrician site"

# Example: generate pricing audit of pricing page
opencode skills/mat ... 'pricing' 'pricing page audit for electrician site' ...

# Example: build landing page variation
opencode landing-builder 'landing for electrician service in Kyrgyzstan'
```

## Applied to this project (potential follow-ups)

| Marketing skill | Potential application | Priority |
|---|---|---|
| `free-tools` | Interactive calculator for price estimation (already built) — could be expanded with lead capture | ✅ Done (`/kalkulyator/`) |
| `offers` | Structure offer: "Free diagnosis + 1-year guarantee + 15% first visit" — add as CTA variant | ⚠️ Can add now |
| `pricing` | Audit pricing page against Van Westendorp / competitor range — add analysis doc | ⚠️ Next |
| `growth-hacker` | Funnel: Service → Geo → Calculator → WhatsApp → Conversion tracking plan | ⚠️ Plan ready (`ANALYTICS-TRACKING.md`) |
| `referrals` | "Refer neighbor, get 15% off next call" — add referral mechanism | ⚠️ Roadmap v2 |
| `launch` | Launch checklist for Product Hunt / local directories | ⚠️ Launch phase |
| `marketing-council` | Get strategic recommendations: pricing, positioning, channels for this service site | ⚠️ Use for investor pack |
| `public-relations` | Pitch to local media: "New electrician service for 32 Issyk-Kul villages" | ⚠️ PR stage |
| `content-strategy` | Expand blog plan to 30+ articles with pillar + cluster model | ⚠️ Pipeline ready (`fetch-blog` available) |
| `social` | Social media post templates for Telegram / VK for this brand | ⚠️ Optional |

---

## Integration points

- `docs/roadmap.md` — growth tasks mapped to marketing skills
- `docs/ANALYTICS-TRACKING.md` — conversion tracking tied to `growth-hacker` framework
- `/kalkulyator/` — `free-tools` applied (calculator as marketing tool)
- `docs/BLUEPRINT.md` — includes reference to `free-tools`, `offers`, `pricing`, `launch` for new projects
- `docs/content-factory/` and `docs/content-decomposer/` — available in global skills

---

*Marketing skills index v1.2 — ready for agent invocation via `opencode` or skill router*
