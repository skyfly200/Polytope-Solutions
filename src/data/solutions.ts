// Offerings shown in the home page Solutions section. Edit this file to
// change what the section lists; nothing else needs touching.
// Prices are intentionally not shown here.

export interface SolutionLink {
  label: string;
  path: string;
}

export interface Solution {
  title: string;
  // Small tag shown beside the title, e.g. "Flagship" or "Specialty".
  tag?: string;
  // One or two sentences, shown under the title.
  description: string;
  // Optional pages with more detail.
  links?: SolutionLink[];
}

export const solutions: Solution[] = [
  {
    title: "AI Harnesses & Agentic Workflows",
    tag: "Flagship",
    description:
      "Custom Claude Code and agent setups wired to your repos and deploys, with model routing that sends easy requests to cheap models and hard ones to frontier models, for a smaller AI bill."
  },
  {
    title: "Business Systems & Automation",
    description:
      "Contact, quote, and invoice in one flow, with client and project tracking and follow-up built in, for small operators running on scattered docs and memory."
  },
  {
    title: "Web & Product Builds",
    description:
      "Websites and web apps on Vue, React, Netlify, and Supabase, plus data and geospatial mapping and pipeline projects."
  },
  {
    title: "Networks & Systems",
    description:
      "Business and venue network upgrades, isolated POS networks, lighting control, and radio network automation and systems design."
  },
  {
    title: "On-Chain RNG & NFT Consulting",
    tag: "Specialty",
    description:
      "Oracle-free randomness and drop consulting for generative art, from the engine behind ArtBlocks.",
    links: [
      { label: "On-Chain RNG", path: "/rng" },
      { label: "NFT Consulting", path: "/consulting" }
    ]
  }
];
