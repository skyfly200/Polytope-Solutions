// Copy for /solutions and /solutions/:slug. Edit text here, not in the views.
// No prices or "starting at" bands: engagement models describe shape and
// duration only until pricing is decided.
//
// `caseStudy` is a slug from src/data/work.ts.

export interface EngagementOption {
  title: string;
  duration: string;
  text: string;
}

export interface SolutionFaq {
  q: string;
  a: string;
}

export interface Solution {
  slug: string;
  letter: string;
  icon: string;
  title: string;
  short: string;
  tagline: string;
  forWho: string[];
  youGet: string[];
  deliverables: string[];
  engagement: EngagementOption[];
  caseStudy: string;
  faqs: SolutionFaq[];
}

export const solutions: Solution[] = [
  {
    slug: "ai-harnesses",
    letter: "A",
    icon: "fa-robot",
    title: "AI Harnesses & Agentic Workflows",
    short: "Custom AI coding and agent setups that do real work and cost less to run.",
    tagline:
      "Custom AI coding and agent setups for teams and solo operators, built to ship work and shrink the bill.",
    forWho: [
      "Teams already paying for AI tools who suspect the spend is not matched by the results",
      "Solo founders and operators who want an agent or coding workflow they can trust",
      "Developers who want Claude Code wired into GitHub, deploys, and databases"
    ],
    youGet: [
      "Model routing that sends easy requests to cheap models and hard ones to frontier models, so you pay for intelligence only when you need it",
      "Claude Code workflows wired to GitHub, with Netlify or Vercel deploys and Supabase migrations",
      "MCP integrations for the tools you already use, plus local knowledge-baked systems",
      "Skills, advisor patterns, and subagent patterns for roadmap and planning work"
    ],
    deliverables: [
      "An inventory of your current AI spend and workflows",
      "An ROI map and routed-model savings estimate",
      "One production agent or coding workflow, documented and handed over",
      "Runbooks so your team can extend it without me"
    ],
    engagement: [
      {
        title: "Audit",
        duration: "About a week",
        text: "We inventory your AI spend and workflows and map where routing and automation pay off. The audit fee is credited toward a build."
      },
      {
        title: "Build sprint",
        duration: "2 to 6 weeks, fixed scope",
        text: "One production agent or coding workflow, shipped and documented."
      },
      {
        title: "Retainer",
        duration: "Month to month",
        text: "Ongoing tuning, new workflows, and keeping routing honest as your usage grows."
      }
    ],
    caseStudy: "polytope-platform",
    faqs: [
      {
        q: "How does model routing save money?",
        a: "Most requests do not need a frontier model. Routing sends simple work to cheaper models and reserves the expensive ones for hard problems. The audit estimates the saving before you commit to a build."
      },
      {
        q: "Do I need to switch tools?",
        a: "Usually not. The harness is built around the tools and repos you already have."
      },
      {
        q: "Will my team be able to maintain it?",
        a: "That is the goal. Every build ends with documentation and a handoff session."
      }
    ]
  },
  {
    slug: "business-systems",
    letter: "B",
    icon: "fa-diagram-project",
    title: "Business Systems & Automation",
    short: "Contact to quote to invoice in one flow, for operators who run on scattered docs and memory.",
    tagline:
      "Client and project management, quoting, and invoicing for small operators who currently run on scattered docs and memory.",
    forWho: [
      "Small businesses and production companies juggling leads in email, quotes in documents, and invoices in a spreadsheet",
      "Service businesses that lose follow-ups because nothing reminds anyone",
      "Owners who want one place to see every client, project, and open invoice"
    ],
    youGet: [
      "A single flow from first contact to quote to invoice, with follow-up built in",
      "A client and project record that holds notes, status, and history",
      "Quoting from a rate card so every quote is fast and consistent",
      "Time tracking and invoicing tied to the same records"
    ],
    deliverables: [
      "A working system set up around how your business actually runs",
      "Quote and invoice templates in your branding",
      "Automated follow-up emails",
      "A walkthrough and written guide for you and your team"
    ],
    engagement: [
      {
        title: "Discovery",
        duration: "A short call plus a written plan",
        text: "We walk through how work currently flows and decide what to build first."
      },
      {
        title: "Build",
        duration: "Fixed scope, a few weeks",
        text: "The system is built and loaded with your real clients and templates."
      },
      {
        title: "Support",
        duration: "Month to month, optional",
        text: "Adjustments and new automations as the business changes."
      }
    ],
    caseStudy: "polytope-platform",
    faqs: [
      {
        q: "Is this off-the-shelf software?",
        a: "It is built around your workflow, using solid existing parts where they fit. You own the result."
      },
      {
        q: "Can you see an example?",
        a: "Polytope's own client, quoting, and invoicing system is the live demo of this offering."
      }
    ]
  },
  {
    slug: "web-product",
    letter: "C",
    icon: "fa-code",
    title: "Web & Product Builds",
    short: "Websites, web apps, and data or mapping projects on a modern stack.",
    tagline:
      "Websites and web apps on a modern Vue, React, Netlify, and Supabase stack, plus data and geospatial work.",
    forWho: [
      "Founders and organizations who need a site or web app built and then maintained",
      "Groups with data that should be a map, a dashboard, or an automated pipeline",
      "Anyone with a prototype that needs to become a real product"
    ],
    youGet: [
      "A site or app designed, built, and deployed, with a clean handoff",
      "Data and geospatial work: mapping, ETL, and pipeline projects",
      "Open, portable code you fully own"
    ],
    deliverables: [
      "Deployed site or app with source and documentation",
      "Hosting, domain, and deploy pipeline set up",
      "Data pipelines or maps where the project calls for them"
    ],
    engagement: [
      {
        title: "Fixed-scope build",
        duration: "Weeks, scoped up front",
        text: "A clear scope, a clear deliverable, and a launch date."
      },
      {
        title: "Ongoing development",
        duration: "Month to month",
        text: "Continued features and maintenance after launch."
      }
    ],
    caseStudy: "ward-water-mapping",
    faqs: [
      {
        q: "What stack do you use?",
        a: "Mostly Vue or Nuxt and React, hosted on Netlify, with Supabase or Postgres for data. I will work in your stack when you already have one."
      },
      {
        q: "Can you take over an existing project?",
        a: "Yes. A short review comes first so we agree on what shape it is in."
      }
    ]
  },
  {
    slug: "networks-systems",
    letter: "D",
    icon: "fa-network-wired",
    title: "Networks & Systems",
    short: "Venue and business network upgrades, building control, and radio network automation.",
    tagline:
      "Business and venue network upgrades, systems design, and automation for the infrastructure other people forget about.",
    forWho: [
      "Venues, restaurants, and small businesses with fragile or shared networks",
      "Organizations running radio or wireless networks that need automation",
      "Owners who want lighting, payments, and networks designed as one system"
    ],
    youGet: [
      "Network upgrades with proper isolation, for example a separate point-of-sale network",
      "Building control integration such as Lutron RA3 lighting",
      "Radio and wireless network automation and systems design"
    ],
    deliverables: [
      "A documented network design and as-built diagram",
      "Installed and tested equipment configuration",
      "A handoff guide for whoever looks after it next"
    ],
    engagement: [
      {
        title: "Site assessment",
        duration: "A visit or remote review",
        text: "We review what is there and propose a design."
      },
      {
        title: "Implementation",
        duration: "Scoped per site",
        text: "The design is built, tested, and documented."
      }
    ],
    caseStudy: "caribou-room",
    faqs: [
      {
        q: "Why isolate the point-of-sale network?",
        a: "Payment hardware should not share a network with guests and general devices. Isolation reduces risk and makes problems easier to diagnose."
      },
      {
        q: "Do you work outside Colorado?",
        a: "Remote design and automation work can be done anywhere. On-site work is scoped by location."
      }
    ]
  }
];

export function findSolution(slug: string): Solution | undefined {
  return solutions.find(s => s.slug === slug);
}
