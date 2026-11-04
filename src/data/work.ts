// Case studies for /work and /work/:slug. Edit text here, not in the views.
//
// `confirm` lists details that still need Skyler's confirmation. They render
// as a visible "Draft" note so unconfirmed numbers are never mistaken for
// fact. Remove an entry (and finally the whole list) once verified.
//
// `solution` is a slug from src/data/solutions.ts, or "specialty".

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  solution: string;
  tags: string[];
  summary: string;
  problem: string;
  built: string[];
  result: string[];
  confirm?: string[];
  link?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "polytope-platform",
    title: "Polytope's client and quoting system",
    client: "Polytope Solutions",
    solution: "business-systems",
    tags: ["Business systems", "AI workflow"],
    summary: "The system behind this site: contact to quote to invoice in one flow.",
    problem:
      "Small operators run leads, quotes, and invoices out of scattered documents and memory, and follow-ups fall through the cracks.",
    built: [
      "A client and project database with an admin API",
      "A lead intake flow and quoting and invoicing layer in progress",
      "Built with an AI-assisted coding workflow on GitHub and Netlify"
    ],
    result: [
      "A live demo of the Business Systems offering, built in the open"
    ],
    confirm: ["Final feature list and launch status"]
  },
  {
    slug: "caribou-room",
    title: "Caribou Room network and lighting",
    client: "Caribou Room",
    solution: "networks-systems",
    tags: ["Networking", "Building control"],
    summary: "A point-of-sale network upgrade and Lutron RA3 lighting control.",
    problem:
      "A busy venue needed payments on a dependable network, separate from everything else, and lighting that staff could control easily.",
    built: [
      "An isolated point-of-sale network",
      "Lutron RA3 lighting control"
    ],
    result: ["Payments run on their own network, and lighting is controlled from one system."],
    confirm: ["Equipment list", "Date of work", "Outcome quote or metrics"]
  },
  {
    slug: "nedernet",
    title: "Nedernet WISP automation",
    client: "Nedernet",
    solution: "networks-systems",
    tags: ["Automation", "Wireless"],
    summary: "Automation for a wireless ISP of roughly 500 links.",
    problem: "Managing a large fixed-wireless network by hand does not scale.",
    built: ["Automation across roughly 500 links"],
    result: ["Less manual work managing the network."],
    confirm: ["Exact link count", "What was automated", "Measured result"]
  },
  {
    slug: "ward-water-mapping",
    title: "Ward water mapping",
    client: "Ward",
    solution: "web-product",
    tags: ["Geospatial", "Mapping"],
    summary: "A mapping project for water infrastructure.",
    problem: "Water system data needed to be seen and used on a map.",
    built: ["A web map built on a data pipeline"],
    result: ["Water data available as an interactive map."],
    confirm: ["Scope and client wording", "Result"]
  },
  {
    slug: "pianos-for-humanity",
    title: "Pianos for Humanity",
    client: "Pianos for Humanity",
    solution: "business-systems",
    tags: ["Systems", "Payments"],
    summary: "Systems and payments for a nonprofit.",
    problem: "A nonprofit needed its operations and payments to work together.",
    built: ["Systems and payments setup"],
    result: ["Operations and payments handled in one place."],
    confirm: ["What was built", "Result"]
  },
  {
    slug: "frms-apps",
    title: "Front Range Mycological Society apps",
    client: "Front Range Mycological Society",
    solution: "web-product",
    tags: ["Web apps", "Community"],
    summary: "Apps built for a local mycology club.",
    problem: "A volunteer club needed simple tools for its members.",
    built: ["Web apps for the society"],
    result: ["Members use the tools day to day."],
    confirm: ["Which apps", "Usage numbers"]
  },
  {
    slug: "radio-network",
    title: "Colorado Community Radio Network automation",
    client: "Colorado Community Radio Network",
    solution: "networks-systems",
    tags: ["Radio", "Automation"],
    summary: "Radio network automation and systems design.",
    problem: "A multi-station radio network needed reliable, automated operation.",
    built: ["Automation and systems design for the network"],
    result: ["Less manual operation across stations."],
    confirm: ["Scope", "Result"]
  },
  {
    slug: "tinyboxes",
    title: "TinyBoxes",
    client: "TinyBoxes",
    solution: "specialty",
    tags: ["On-chain", "Generative art"],
    summary: "A fully on-chain generative art project built on the Polytope Paradox RNG.",
    problem: "Generative NFT drops were exposed to minting exploits that threatened their integrity.",
    built: ["The Polytope Paradox RNG at the foundation of the project"],
    result: ["A live on-chain drop."],
    confirm: ["Drop details and numbers"],
    link: "/rng"
  },
  {
    slug: "artblocks",
    title: "ArtBlocks randomness engine",
    client: "ArtBlocks",
    solution: "specialty",
    tags: ["On-chain", "RNG"],
    summary: "RNG code that became the foundation of ArtBlocks' generative engine.",
    problem: "Exploits like the Chainfaces token showed that on-chain randomness could be gamed.",
    built: ["The Polytope Paradox random number generator"],
    result: ["Now the foundation of the ArtBlocks engine for drops on the platform."],
    confirm: ["Exact wording for the ArtBlocks relationship"],
    link: "/rng"
  },
  {
    slug: "face-golf",
    title: "Face Golf",
    client: "Face Golf",
    solution: "specialty",
    tags: ["NFT", "Game"],
    summary: "An NFT project.",
    problem: "To be written.",
    built: ["To be written."],
    result: ["To be written."],
    confirm: ["Everything: this entry is a stub"]
  },
  {
    slug: "fine-nft",
    title: "The Fine NFT project",
    client: "Fine NFT",
    solution: "specialty",
    tags: ["NFT"],
    summary: "An NFT project.",
    problem: "To be written.",
    built: ["To be written."],
    result: ["To be written."],
    confirm: ["Everything: this entry is a stub, including the name"]
  }
];

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(c => c.slug === slug);
}
