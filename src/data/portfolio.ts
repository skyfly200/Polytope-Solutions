// Content for the Services page, example projects, and testimonials.
//
// Anything with `placeholder: true` is sample copy and must be replaced
// with real content before it goes live. Placeholder items render with a
// visible "Sample" badge so they are never mistaken for real client work.

export interface Service {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  path?: string;
}

export interface Project {
  title: string;
  category: string;
  summary: string;
  role: string;
  outcomes: string[];
  tags: string[];
  img: string;
  link?: string;
  placeholder?: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  placeholder?: boolean;
}

export interface Step {
  icon: string;
  title: string;
  text: string;
}

export interface EngagementModel {
  title: string;
  icon: string;
  bestFor: string;
  points: string[];
  cta: string;
}

export interface Faq {
  q: string;
  a: string;
}

export const services: Service[] = [
  {
    id: "rng",
    icon: "fa-dice-d20",
    title: "On-Chain Randomness",
    tagline: "The Polytope Paradox™ RNG engine",
    description:
      "Secure, oracle-free random number generation for generative art and on-chain games, built on the same engine that powers ArtBlocks.",
    deliverables: [
      "RNG integration into your minting contract",
      "Exploit and front-running review of your mint flow",
      "Ongoing module updates as the engine evolves"
    ],
    path: "/rng"
  },
  {
    id: "contracts",
    icon: "fa-file-contract",
    title: "Smart Contract Engineering",
    tagline: "Contracts that are lean, safe, and readable",
    description:
      "Design and development of Solidity contracts for NFT collections, marketplaces, and token mechanics, with gas efficiency and security first.",
    deliverables: [
      "Contract architecture and implementation",
      "Test suites and testnet deployment",
      "Gas optimization and pre-audit hardening"
    ]
  },
  {
    id: "drops",
    icon: "fa-rocket",
    title: "NFT Drop Strategy",
    tagline: "From concept to a smooth mint day",
    description:
      "Hands-on consulting for artists and teams launching a collection: mechanics, rarity design, mint flow, and launch-day readiness.",
    deliverables: [
      "Drop mechanics and trait or rarity review",
      "Launch checklist and mint-day support",
      "Post-launch tooling and community handoff"
    ],
    path: "/consulting"
  },
  {
    id: "generative",
    icon: "fa-shapes",
    title: "Generative Art Tooling",
    tagline: "Code that makes art, and art that holds up",
    description:
      "Rendering pipelines, on-chain SVG generation, and deterministic art scripts that produce the same output from the same seed, everywhere.",
    deliverables: [
      "Deterministic art script development",
      "On-chain or off-chain rendering pipelines",
      "Preview and testing tools for artists"
    ]
  },
  {
    id: "web",
    icon: "fa-laptop-code",
    title: "Full-Stack Web Apps",
    tagline: "Fast, modern front ends wired to real back ends",
    description:
      "Web apps, dashboards, and dApp front ends with wallet connection, APIs, and serverless back ends, built to be maintained after handoff.",
    deliverables: [
      "Front end in Vue, React, or your stack",
      "Wallet, API, and serverless integrations",
      "Deployment, CI, and documentation"
    ]
  },
  {
    id: "advisory",
    icon: "fa-chess-knight",
    title: "Technical Advisory",
    tagline: "A senior engineer in your corner",
    description:
      "Architecture reviews, code reviews, and roadmap guidance for teams who want a second set of eyes before making a costly decision.",
    deliverables: [
      "Architecture and code review reports",
      "Technology selection and roadmap planning",
      "Hiring and vendor evaluation support"
    ]
  }
];

export const process: Step[] = [
  {
    icon: "fa-comments",
    title: "Discover",
    text: "A free intro call to understand your goals, constraints, and timeline."
  },
  {
    icon: "fa-drafting-compass",
    title: "Design",
    text: "A written proposal with scope, architecture, milestones, and a clear quote."
  },
  {
    icon: "fa-code",
    title: "Build",
    text: "Iterative delivery with regular check-ins, so you see progress every week."
  },
  {
    icon: "fa-shield-alt",
    title: "Launch & Support",
    text: "Testing, deployment, handoff docs, and support through launch and beyond."
  }
];

export const engagementModels: EngagementModel[] = [
  {
    title: "Strategy Session",
    icon: "fa-lightbulb",
    bestFor: "Quick answers and a second opinion",
    points: [
      "One focused working session",
      "Review of your plan, code, or contracts",
      "Written summary with next steps"
    ],
    cta: "Book a session"
  },
  {
    title: "Fixed-Scope Project",
    icon: "fa-cubes",
    bestFor: "Well-defined builds with a clear finish line",
    points: [
      "Detailed proposal and fixed quote",
      "Milestone-based delivery and billing",
      "Handoff docs and launch support"
    ],
    cta: "Request a quote"
  },
  {
    title: "Ongoing Retainer",
    icon: "fa-sync-alt",
    bestFor: "Teams that need a senior engineer on call",
    points: [
      "Reserved monthly hours",
      "Priority response and planning input",
      "Flexible across build, review, and advisory work"
    ],
    cta: "Discuss a retainer"
  }
];

export const projects: Project[] = [
  {
    title: "ArtBlocks RNG Engine",
    category: "On-Chain Randomness",
    summary:
      "Developed the random number generator code that ArtBlocks uses as the foundation of its generative art engine.",
    role: "RNG design and implementation",
    outcomes: [
      "Foundation of every generative drop on the platform",
      "Oracle-free, with entropy drawn from the blockchain"
    ],
    tags: ["Solidity", "RNG", "Generative Art"],
    img: "/img/data-wave.jpg",
    placeholder: true
  },
  {
    title: "TinyBoxes",
    category: "Generative NFT Collection",
    summary:
      "An original generative art NFT project, built end to end on the Polytope Paradox™ RNG engine.",
    role: "Concept, contracts, art engine, and launch",
    outcomes: [
      "Fully on-chain generative artwork",
      "Proving ground for the RNG engine"
    ],
    tags: ["Solidity", "On-Chain SVG", "Vue"],
    img: "/img/spider-web.jpg",
    placeholder: true
  },
  {
    title: "Sample: Marketplace dApp",
    category: "Full-Stack Web App",
    summary:
      "Placeholder project. Replace with a real client build, such as a marketplace or minting front end.",
    role: "Front end, wallet integration, serverless API",
    outcomes: ["Replace with a measurable result", "Replace with a second result"],
    tags: ["Vue", "Web3", "Serverless"],
    img: "/img/desk.jpg",
    placeholder: true
  }
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Placeholder testimonial. Replace with a real quote from a client about the RNG integration or a drop you supported.",
    name: "Client Name",
    title: "Founder",
    company: "Sample NFT Project",
    placeholder: true
  },
  {
    quote:
      "Placeholder testimonial. Replace with a real quote about working together, communication, and the results delivered.",
    name: "Client Name",
    title: "Generative Artist",
    company: "Sample Studio",
    placeholder: true
  },
  {
    quote:
      "Placeholder testimonial. Replace with a real quote from a team you advised or built a web app for.",
    name: "Client Name",
    title: "CTO",
    company: "Sample Company",
    placeholder: true
  }
];

export const faqs: Faq[] = [
  {
    q: "How does pricing work?",
    a: "Every engagement starts with a free intro call. After that you get a written proposal with a fixed quote for scoped projects, or a monthly rate for retainers. No surprises."
  },
  {
    q: "Do you work with non-technical founders and artists?",
    a: "Yes. Many clients are artists or founders without an engineering team. We explain trade-offs in plain language and handle the technical details."
  },
  {
    q: "Can you work alongside my existing developers?",
    a: "Absolutely. We regularly review code, pair with in-house teams, and hand off well-documented work your team can own."
  },
  {
    q: "What happens after launch?",
    a: "Every project includes handoff documentation and a support window. Ongoing maintenance and new features are available on retainer."
  }
];
