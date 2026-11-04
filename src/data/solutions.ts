// Offerings shown in the home page Solutions section. Edit this file to
// change what the section lists; nothing else needs touching.
//
// `confirmed: false` marks an offering taken from the services page that the
// owner has not yet signed off on. It still renders normally; the flag only
// exists so unconfirmed items are easy to find and review.

export interface Solution {
  title: string;
  // One or two sentences, shown under the title.
  description: string;
  // Optional page with more detail.
  path?: string;
  confirmed: boolean;
}

export const solutions: Solution[] = [
  {
    title: "On-Chain RNG",
    description:
      "Oracle-free randomness for generative art and on-chain games, with the same security and dependability as ArtBlocks, on your own platform.",
    path: "/rng",
    confirmed: true
  },
  {
    title: "NFT Consulting",
    description:
      "Optimize your upcoming generative art drop for security, efficiency, and success with one of the space's leading innovators.",
    path: "/consulting",
    confirmed: true
  },
  {
    title: "Generative Art Tooling",
    description:
      "Deterministic art scripts, on-chain SVG, and rendering pipelines that give the same output from the same seed, everywhere.",
    confirmed: false
  },
  {
    title: "Smart Contract Engineering",
    description:
      "Lean, safe Solidity for collections, marketplaces, and token mechanics, with gas efficiency and security first.",
    confirmed: false
  },
  {
    title: "Full-Stack Web Apps",
    description:
      "Fast front ends, wallet connection, and serverless back ends, built to be maintained after handoff.",
    confirmed: false
  },
  {
    title: "Technical Advisory",
    description:
      "Architecture and code reviews and roadmap guidance, a senior second opinion before a costly decision.",
    confirmed: false
  }
];
