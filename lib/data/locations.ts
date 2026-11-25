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

export type LocationContent = {
  intro: string;
  description: string;
  county: string;
  zipSample: string;
  localSoilAndWater: string;
  housingProfile: string;
};

export const locationContent: Record<string, LocationContent> = {
  houston: {
    intro:
      "Explore plumbing service information and independent contractor referrals for homeowners across Houston, Texas.",
    description:
      "Find information about emergency plumbing, drain cleaning, hydro-jetting, water heater repair, slab leak detection, and sewer line repair in Houston.",
    county: "Harris County",
    zipSample: "77001–77099",
    localSoilAndWater:
      "Expansive Beaumont Formation clay shifts foundations seasonally while surface water from Lake Houston and the Trinity River drives calcium scale in water heaters.",
    housingProfile:
      "Inner-loop neighborhoods mix pre-1975 cast-iron sewer laterals and galvanized piping with modern outer-ring PEX repipes and attic tank installations.",
  },

  katy: {
    intro:
      "Explore plumbing service information and independent contractor referrals for homeowners across Katy, Texas.",
    description:
      "Connect with independent local plumbers serving Katy for emergency leaks, drain clearing, hard-water heater descaling, and sewer diagnostics.",
    county: "Fort Bend, Harris & Waller Counties",
    zipSample: "77449, 77450, 77493, 77494",
    localSoilAndWater:
      "West Houston/Katy Municipal Utility Districts (MUDs) supply groundwater and blended surface water with notable hardness minerals and fluctuating static pressure across expanding subdivisions.",
    housingProfile:
      "Many 1990s–2020s master-planned slab homes feature copper slab loops or PEX manifolds, attic-mounted gas water heaters requiring drain-pan compliance, and backyard sewer cleanouts.",
  },

  "sugar-land": {
    intro:
      "Explore plumbing service information and independent contractor referrals for homeowners in Sugar Land, Texas.",
    description:
      "Find independent Sugar Land plumbing professionals for slab leak detection, sewer camera checks, water heater repair, and drain cleaning.",
    county: "Fort Bend County",
    zipSample: "77478, 77479, 77498",
    localSoilAndWater:
      "Alluvial Brazos River valley clay soils and mature live oaks place lateral stress on buried PVC and older sewer cleanouts throughout First Colony and Greatwood.",
    housingProfile:
      "1980s–2000s two-story slab foundations commonly experience copper pinhole leaks beneath slabs or thermal-expansion dripping on closed municipal water loops.",
  },

  cypress: {
    intro:
      "Explore plumbing service information and independent contractor referrals for homeowners across Cypress, Texas.",
    description:
      "Connect with independent local plumbers in Cypress, TX for high water pressure PRV fixes, attic water heaters, slab leaks, and drain cleaning.",
    county: "Harris County",
    zipSample: "77410, 77429, 77433",
    localSoilAndWater:
      "Northwest Harris County MUD water systems frequently deliver elevated static supply pressures above 75–80 PSI alongside mineral hardness that shortens anode rod and PRV lifespans.",
    housingProfile:
      "Rapidly built master-planned communities combine attic water heaters, irrigation backflow preventers, and early-generation PEX/CPVC runs vulnerable to hard winter freezes.",
  },

  spring: {
    intro:
      "Explore plumbing service information and independent contractor referrals for homeowners in Spring, Texas.",
    description:
      "Reach independent plumbers serving Spring, TX for tree-root sewer backups, freeze burst pipes, drain jetting, and tankless water heater repair.",
    county: "Harris & Montgomery Counties",
    zipSample: "77373, 77379, 77386, 77388",
    localSoilAndWater:
      "Sandy-clay soil transitions and dense pine and oak canopies along Spring Creek accelerate root intrusion into residential sewer lateral joints.",
    housingProfile:
      "Established 1970s–1990s subdivisions and newer northern corridors contain mixed galvanized/copper water lines, aging cast-iron branch drains, and garage or attic water heaters.",
  },

  pearland: {
    intro:
      "Explore plumbing service information and independent contractor referrals for homeowners in Pearland, Texas.",
    description:
      "Connect with independent plumbing contractors serving Pearland, TX for soil-shift sewer line issues, slab leaks, drain cleaning, and water heaters.",
    county: "Brazoria County",
    zipSample: "77581, 77584, 77588",
    localSoilAndWater:
      "Coastal plains Gulf clay retains groundwater moisture around buried pipes, contributing to external soil-line settling and bellies on long residential sewer laterals.",
    housingProfile:
      "A blend of older Brazoria County ranch homes and newer Shadow Creek developments requires both aging drain rehabilitation and closed-loop thermal expansion protection.",
  },

  pasadena: {
    intro:
      "Explore plumbing service information and independent contractor referrals for homeowners in Pasadena, Texas.",
    description:
      "Find independent local plumbers in Pasadena, TX for corroded galvanized pipe replacement, sewer backups, leak detection, and water heater service.",
    county: "Harris County",
    zipSample: "77502, 77503, 77504, 77505",
    localSoilAndWater:
      "Coastal humidity near the Ship Channel and Southeast Harris County clay soils accelerate atmospheric corrosion on exterior hose bibbs and aging metallic drain fittings.",
    housingProfile:
      "Significant inventory of 1950s–1970s residences means cast-iron under-slab drain corrosion, low water pressure from rusted galvanized lines, and sewer cleanout upgrades are common needs.",
  },

  richmond: {
    intro:
      "Explore plumbing service information and independent contractor referrals for homeowners in Richmond, Texas.",
    description:
      "Connect with independent plumbers serving Richmond, TX for leak detection, drain clearing, sewer camera checks, and water heater repairs.",
    county: "Fort Bend County",
    zipSample: "77406, 77407, 77469",
    localSoilAndWater:
      "Fort Bend MUD water supply and shrinking-swelling clay soils near the Brazos River create seasonal foundation movement and elevated mineral buildup in tank water heaters.",
    housingProfile:
      "Mix of historic downtown structures and expansive master-planned developments requiring pressure-reducing valve maintenance, PEX freeze repairs, and sewer cleanout access.",
  },

  "missouri-city": {
    intro:
      "Explore plumbing service information and independent contractor referrals for homeowners in Missouri City, Texas.",
    description:
      "Connect with independent Missouri City plumbers for sewer cleanout clearing, root intrusion hydro-jetting, slab leak tests, and water heater repair.",
    county: "Fort Bend & Harris Counties",
    zipSample: "77459, 77489",
    localSoilAndWater:
      "Mature neighborhood landscaping and expansive clay soils around Quail Valley and Sienna create recurring sewer joint offsets and root infiltration.",
    housingProfile:
      "Late-1970s to contemporary slab construction frequently benefits from video camera sewer checks, slab leak acoustic pinpointing, and PRV calibration.",
  },

  "the-woodlands": {
    intro:
      "Explore plumbing service information and independent contractor referrals for homeowners in The Woodlands, Texas.",
    description:
      "Find independent plumbing contractors serving The Woodlands, TX for pine-root drain jetting, tankless descaling, leak detection, and pipe repairs.",
    county: "Montgomery County",
    zipSample: "77380, 77381, 77382, 77384",
    localSoilAndWater:
      "Heavy pine and oak root systems combined with Montgomery County groundwater minerals drive root-related main sewer slowdowns and tankless heat-exchanger scale.",
    housingProfile:
      "Multi-story custom homes and wooded-lot estates often rely on tankless water heaters, recirculating hot-water pumps, and backflow preventer assemblies.",
  },
};
