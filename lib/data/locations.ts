export interface Location {
  slug: string;
  city: string;
  state: string;
  stateCode: string;
}

export const locations: Location[] = [
  {
    slug: "houston",
    city: "Houston",
    state: "Texas",
    stateCode: "TX",
  },
  {
    slug: "katy",
    city: "Katy",
    state: "Texas",
    stateCode: "TX",
  },
  {
    slug: "sugar-land",
    city: "Sugar Land",
    state: "Texas",
    stateCode: "TX",
  },
  {
    slug: "cypress",
    city: "Cypress",
    state: "Texas",
    stateCode: "TX",
  },
  {
    slug: "spring",
    city: "Spring",
    state: "Texas",
    stateCode: "TX",
  },
  {
    slug: "pearland",
    city: "Pearland",
    state: "Texas",
    stateCode: "TX",
  },
  {
    slug: "pasadena",
    city: "Pasadena",
    state: "Texas",
    stateCode: "TX",
  },
  {
    slug: "richmond",
    city: "Richmond",
    state: "Texas",
    stateCode: "TX",
  },
  {
    slug: "missouri-city",
    city: "Missouri City",
    state: "Texas",
    stateCode: "TX",
  },
  {
    slug: "the-woodlands",
    city: "The Woodlands",
    state: "Texas",
    stateCode: "TX",
  },
];
// Location-specific content is intentionally kept neutral unless
// repository-verified facts are available for that city.

export type LocationContent = {
  intro: string;
  description: string;
};

export const locationContent: Record<string, LocationContent> = {
  houston: {
    intro:
      "Explore plumbing service information for homeowners and property owners in Houston, Texas.",
    description:
      "Find information about emergency plumbing, drain cleaning, water heater repair, leak detection, and other plumbing services available in Houston.",
  },

  katy: {
    intro:
      "Explore plumbing service information for homeowners and property owners in Katy, Texas.",
    description:
      "Find information about emergency plumbing, drain cleaning, water heater repair, leak detection, and other plumbing services available in Katy.",
  },

  "sugar-land": {
    intro:
      "Explore plumbing service information for homeowners and property owners in Sugar Land, Texas.",
    description:
      "Find information about emergency plumbing, drain cleaning, water heater repair, leak detection, and other plumbing services available in Sugar Land.",
  },

  cypress: {
    intro:
      "Explore plumbing service information for homeowners and property owners in Cypress, Texas.",
    description:
      "Find information about emergency plumbing, drain cleaning, water heater repair, leak detection, and other plumbing services available in Cypress.",
  },

  spring: {
    intro:
      "Explore plumbing service information for homeowners and property owners in Spring, Texas.",
    description:
      "Find information about emergency plumbing, drain cleaning, water heater repair, leak detection, and other plumbing services available in Spring.",
  },

  pearland: {
    intro:
      "Explore plumbing service information for homeowners and property owners in Pearland, Texas.",
    description:
      "Find information about emergency plumbing, drain cleaning, water heater repair, leak detection, and other plumbing services available in Pearland.",
  },

  pasadena: {
    intro:
      "Explore plumbing service information for homeowners and property owners in Pasadena, Texas.",
    description:
      "Find information about emergency plumbing, drain cleaning, water heater repair, leak detection, and other plumbing services available in Pasadena.",
  },

  richmond: {
    intro:
      "Explore plumbing service information for homeowners and property owners in Richmond, Texas.",
    description:
      "Find information about emergency plumbing, drain cleaning, water heater repair, leak detection, and other plumbing services available in Richmond.",
  },

  "missouri-city": {
    intro:
      "Explore plumbing service information for homeowners and property owners in Missouri City, Texas.",
    description:
      "Find information about emergency plumbing, drain cleaning, water heater repair, leak detection, and other plumbing services available in Missouri City.",
  },

  "the-woodlands": {
    intro:
      "Explore plumbing service information for homeowners and property owners in The Woodlands, Texas.",
    description:
      "Find information about emergency plumbing, drain cleaning, water heater repair, leak detection, and other plumbing services available in The Woodlands.",
  },
};
