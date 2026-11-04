// Single source of truth for every Solutions surface: the home page section,
// /solutions, /solutions/:slug, the /start dropdown,
// and case-study cross-links all derive from this file. Edit text here only.
//
// No prices or "starting at" bands: engagement models describe shape and
// duration only until pricing is decided.
//
// `short` is the one-line summary shown on the home page and /solutions.
// `caseStudy` is an optional slug from src/data/work.ts.
// `links` are extra pages shown on the solution's page (e.g. long-form /rng).
// `flags` lists claims that still need Skyler's confirmation; they render as a
// visible "Draft" note on the page. Remove entries once confirmed.

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
  caseStudy?: string;
  links?: SolutionLink[];
  faqs: SolutionFaq[];
  flags?: string[];
}

export interface SolutionLink {
  label: string;
  path: string;
}

export const solutions: Solution[] = [
  {
    slug: "ai-harnesses",
    letter: "A",
    icon: "fa-robot",
    title: "AI Harnesses & Model Routing",
    short: "Custom Claude Code setups and model routing that do real work for a smaller AI bill.",
    tagline:
      "Custom AI coding setups for teams and solo operators, built to ship work and shrink the bill.",
    forWho: [
      "Teams already paying for AI tools who suspect the spend is not matched by the results",
      "Solo founders and operators who want a coding workflow they can trust",
      "Developers who want Claude Code wired into GitHub, deploys, and databases"
    ],
    youGet: [
      "Model routing that sends easy requests to cheap models and hard ones to frontier models, so you pay for intelligence only when you need it",
      "Claude Code workflows wired to GitHub, with Netlify or Vercel deploys and Supabase migrations",
      "Model-level skills and advisor patterns tuned to your codebase",
      "A clear picture of what your AI spend buys today"
    ],
    deliverables: [
      "An inventory of your current AI spend and workflows",
      "An ROI map and routed-model savings estimate",
      "One production coding workflow, documented and handed over",
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
        text: "One production coding workflow with routing, shipped and documented."
      },
      {
        title: "Retainer",
        duration: "Month to month",
        text: "Ongoing tuning and keeping routing honest as your usage grows."
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
    slug: "agentic-workflows",
    letter: "B",
    icon: "fa-sitemap",
    title: "Agentic Workflows & MCP Integrations",
    short: "Agents wired to your tools through MCP, with subagent and planning patterns.",
    tagline:
      "Agents that connect to the tools you already use and carry real multi-step work, planned and checked along the way.",
    forWho: [
      "Operators with repeatable multi-step work that is eating hours every week",
      "Teams who want an agent connected to their own tools and knowledge, not a generic chatbot",
      "Builders who want roadmap and planning work split across subagents"
    ],
    youGet: [
      "MCP integrations for the tools you already use, such as Wolfram Alpha and other services",
      "Local, knowledge-baked systems that answer from your own material",
      "Subagent patterns for roadmap and planning work, including Wayfinder-style planning inside Claude",
      "Checkpoints so a person reviews anything that matters"
    ],
    deliverables: [
      "A mapped workflow with the steps worth automating marked",
      "Working integrations and one agentic workflow in production",
      "Documentation covering what the agent can and cannot touch",
      "A handoff session for your team"
    ],
    engagement: [
      {
        title: "Workflow scoping",
        duration: "A short call plus a written plan",
        text: "We pick one workflow where an agent clearly pays for itself."
      },
      {
        title: "Build",
        duration: "2 to 6 weeks, fixed scope",
        text: "Integrations and workflow built, tested against real tasks, and documented."
      },
      {
        title: "Support",
        duration: "Month to month, optional",
        text: "New integrations and tuning as your tools change."
      }
    ],
    caseStudy: "polytope-platform",
    flags: [
      "Engagement shapes and FAQ are adapted from the AI Harnesses offering; confirm they match how you want to sell agentic work",
      "No agentic-workflow case study exists yet, so this page links to the Polytope platform study as a stand-in"
    ],
    faqs: [
      {
        q: "What is MCP?",
        a: "Model Context Protocol is a standard way to give an AI model access to tools and data. It lets one agent work across your repos, databases, and services."
      },
      {
        q: "Can the agent act without me?",
        a: "Only where you decide. Anything consequential gets a human checkpoint by default."
      }
    ]
  },
  {
    slug: "business-systems",
    letter: "C",
    icon: "fa-project-diagram",
    title: "Business Systems & Automation",
    short: "Contact to quote to invoice in one flow, with client tracking and follow-up built in.",
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
    letter: "D",
    icon: "fa-code",
    title: "Web & Product Builds",
    short: "Websites and web apps on Vue, React, Netlify, and Supabase, built and managed.",
    tagline:
      "Websites and web apps on a modern Vue, React, Netlify, and Supabase stack, designed, built, and handed over.",
    forWho: [
      "Founders and organizations who need a site or web app built and then maintained",
      "Anyone with a prototype that needs to become a real product",
      "Groups taking over a site that has outgrown its first build"
    ],
    youGet: [
      "A site or app designed, built, and deployed, with a clean handoff",
      "Open, portable code you fully own",
      "Hosting, domain, and deploy pipeline set up properly"
    ],
    deliverables: [
      "Deployed site or app with source and documentation",
      "Hosting, domain, and deploy pipeline set up",
      "A short guide for updating content yourself"
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
    caseStudy: "frms-apps",
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
    slug: "data-geospatial",
    letter: "E",
    icon: "fa-map-marked-alt",
    title: "Data & Geospatial",
    short: "Mapping, ETL, and data pipelines that turn scattered records into maps and dashboards.",
    tagline:
      "Mapping, ETL, and automated data pipelines for groups whose data should be a map, a dashboard, or a feed that updates itself.",
    forWho: [
      "Organizations with spreadsheets, field data, or public records that nobody can see at a glance",
      "Groups that rebuild the same report by hand every month",
      "Projects that need a map people can actually use"
    ],
    youGet: [
      "Interactive maps built on your data, such as water or field-observation mapping",
      "Pipelines that collect, clean, and load data on a schedule",
      "Dashboards and exports sized to the people who read them"
    ],
    deliverables: [
      "A working map or dashboard, deployed",
      "Pipeline code with documentation and a run schedule",
      "A data dictionary so the next person can trust the numbers"
    ],
    engagement: [
      {
        title: "Data review",
        duration: "A short call and a look at your sources",
        text: "We check what data exists, its quality, and what question it should answer."
      },
      {
        title: "Build",
        duration: "Weeks, scoped after the review",
        text: "Pipeline and map built, loaded with your real data, and documented."
      }
    ],
    caseStudy: "ward-water-mapping",
    flags: [
      "Engagement shapes and FAQ are new copy; confirm they reflect how you scope data work",
      "Moved Ward water mapping here from Web & Product Builds; the FRMS apps study stays under Web"
    ],
    faqs: [
      {
        q: "Do you work with sensitive data?",
        a: "Yes, and we agree up front where data lives, who can see it, and what gets published."
      },
      {
        q: "Can the map update itself?",
        a: "Yes. Where the source data changes, a scheduled pipeline can refresh the map automatically."
      }
    ]
  },
  {
    slug: "networks-systems",
    letter: "F",
    icon: "fa-network-wired",
    title: "Networks & Systems",
    short: "Venue network upgrades, POS isolation, lighting control, and WISP and radio automation.",
    tagline:
      "Business and venue network upgrades, systems design, and automation for the infrastructure other people forget about.",
    forWho: [
      "Venues, restaurants, and small businesses with fragile or shared networks",
      "Organizations running radio or WISP networks that need automation",
      "Owners who want lighting, payments, and networks designed as one system"
    ],
    youGet: [
      "Network upgrades with proper isolation, for example a separate point-of-sale network",
      "Building control integration such as Lutron RA3 lighting",
      "Radio and WISP network automation and systems design, such as automating a large fleet of links instead of touching each one by hand"
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
    flags: ["WISP automation wording, based on the Nedernet case study; confirm scope and any link counts before quoting numbers"],
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
  },
  {
    slug: "smart-contracts",
    letter: "G",
    icon: "fa-cube",
    title: "Smart Contracts & On-Chain",
    short: "Smart contracts, on-chain randomness, and NFT drop consulting.",
    tagline:
      "Smart contract work and on-chain randomness, from the developer behind the RNG engine ArtBlocks uses.",
    forWho: [
      "Artists and developers planning an NFT drop",
      "Teams that need randomness or minting logic that cannot be gamed",
      "Projects that need a contract built or reviewed"
    ],
    youGet: [
      "Oracle-free on-chain randomness",
      "Smart contract development and review",
      "Consulting on drops and platforms"
    ],
    deliverables: [
      "Contracts with tests and documentation",
      "A written review of risks before launch",
      "A handoff session for your team"
    ],
    engagement: [
      {
        title: "Consulting",
        duration: "A call or a short review",
        text: "We look at your drop or contract and I tell you what I would change."
      },
      {
        title: "Build",
        duration: "Fixed scope, weeks",
        text: "Contracts built, tested, and documented."
      }
    ],
    caseStudy: "tinyboxes",
    links: [
      { label: "On-Chain RNG", path: "/rng" },
      { label: "NFT Consulting", path: "/consulting" }
    ],
    flags: [
      "Short placeholder copy; smart contract work is broadened beyond RNG and NFT consulting, so confirm you want to offer general contract development"
    ],
    faqs: [
      {
        q: "What is the Polytope Paradox?",
        a: "It is the random number generator I wrote that closes the minting exploits seen in early NFT drops. The RNG page has the full story."
      }
    ]
  },
  {
    slug: "hardware-iot",
    letter: "H",
    icon: "fa-microchip",
    title: "Hardware, Firmware & IoT",
    short: "Embedded devices, firmware, and connected hardware, from prototype to production.",
    tagline:
      "Embedded devices, firmware, sensors, and connected hardware, taken from prototype to production.",
    forWho: [
      "Founders with a hardware idea that needs a working prototype",
      "Teams that need firmware written, fixed, or cleaned up",
      "Anyone connecting sensors or devices to a cloud or app"
    ],
    youGet: [
      "Firmware for microcontrollers and embedded boards",
      "Sensor and device integration with cloud dashboards",
      "Prototyping and a path to production"
    ],
    deliverables: [
      "Working prototype or firmware with source",
      "Wiring and setup documentation",
      "A handoff guide for whoever maintains it next"
    ],
    engagement: [
      {
        title: "Feasibility review",
        duration: "A short call and a written plan",
        text: "We agree on what to build first and what it needs."
      },
      {
        title: "Prototype build",
        duration: "Weeks, scoped after the review",
        text: "A working device, tested and documented."
      }
    ],
    flags: [
      "Placeholder copy for this new area; rewrite the details, engagement shapes, and FAQ, and add a case study when one exists"
    ],
    faqs: [
      {
        q: "Do you design circuit boards?",
        a: "To be confirmed. This placeholder answer needs your real scope."
      }
    ]
  }
];

export function findSolution(slug: string): Solution | undefined {
  return solutions.find(s => s.slug === slug);
}

// One shape for every place that lists solutions in summary form.
export interface SolutionSummary {
  key: string;
  title: string;
  short: string;
  to: string;
  tag?: string;
}

export const summaries: SolutionSummary[] = solutions.map((s, i) => ({
  key: s.slug,
  title: s.title,
  short: s.short,
  to: "/solutions/" + s.slug,
  tag: i === 0 ? "Flagship" : undefined
}));

// Options for the /start solution-area dropdown.
export const startAreas: string[] = [...solutions.map(s => s.title), "Other"];
