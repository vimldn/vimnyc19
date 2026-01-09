export type Service = {
  name: string
  slug: string
  /** Used for copy like "a moving company" */
  singular: string
}

export type Location = {
  name: string
  slug: string
  borough: 'Manhattan' | 'Brooklyn' | 'Queens' | 'Bronx' | 'Staten Island'
}

export const SERVICES: Service[] = [
  { name: 'Moving Companies', slug: 'moving-companies', singular: 'moving company' },
  { name: 'Tenant Lawyers', slug: 'tenant-lawyers', singular: 'tenant lawyer' },
  { name: 'Renters Insurance', slug: 'renters-insurance', singular: "renter's insurance" },
  { name: 'Pest Control', slug: 'pest-control', singular: 'pest control provider' },
  { name: 'Storage Facilities', slug: 'storage-facilities', singular: 'storage facility' },
  { name: 'Building Inspectors', slug: 'building-inspectors', singular: 'building inspector' },
]

export const LOCATIONS: Location[] = [
  // Manhattan
  { borough: 'Manhattan', name: 'Upper East Side', slug: 'upper-east-side' },
  { borough: 'Manhattan', name: 'Upper West Side', slug: 'upper-west-side' },
  { borough: 'Manhattan', name: 'Harlem', slug: 'harlem' },
  { borough: 'Manhattan', name: 'East Village', slug: 'east-village' },
  { borough: 'Manhattan', name: 'West Village', slug: 'west-village' },
  { borough: 'Manhattan', name: 'Chelsea', slug: 'chelsea' },
  { borough: 'Manhattan', name: 'Tribeca', slug: 'tribeca' },
  { borough: 'Manhattan', name: "Hell's Kitchen", slug: 'hells-kitchen' },

  // Brooklyn
  { borough: 'Brooklyn', name: 'Williamsburg', slug: 'williamsburg' },
  { borough: 'Brooklyn', name: 'Bushwick', slug: 'bushwick' },
  { borough: 'Brooklyn', name: 'Bedford-Stuyvesant', slug: 'bedford-stuyvesant' },
  { borough: 'Brooklyn', name: 'Park Slope', slug: 'park-slope' },
  { borough: 'Brooklyn', name: 'Downtown Brooklyn', slug: 'downtown-brooklyn' },
  { borough: 'Brooklyn', name: 'DUMBO', slug: 'dumbo' },
  { borough: 'Brooklyn', name: 'Crown Heights', slug: 'crown-heights' },
  { borough: 'Brooklyn', name: 'Greenpoint', slug: 'greenpoint' },

  // Queens
  { borough: 'Queens', name: 'Astoria', slug: 'astoria' },
  { borough: 'Queens', name: 'Long Island City', slug: 'long-island-city' },
  { borough: 'Queens', name: 'Flushing', slug: 'flushing' },
  { borough: 'Queens', name: 'Jackson Heights', slug: 'jackson-heights' },
  { borough: 'Queens', name: 'Ridgewood', slug: 'ridgewood' },
  { borough: 'Queens', name: 'Sunnyside', slug: 'sunnyside' },

  // Bronx
  { borough: 'Bronx', name: 'Fordham', slug: 'fordham' },
  { borough: 'Bronx', name: 'Kingsbridge', slug: 'kingsbridge' },
  { borough: 'Bronx', name: 'Riverdale', slug: 'riverdale' },
  { borough: 'Bronx', name: 'Mott Haven', slug: 'mott-haven' },
  { borough: 'Bronx', name: 'Pelham Bay', slug: 'pelham-bay' },

  // Staten Island
  { borough: 'Staten Island', name: 'St. George', slug: 'st-george' },
  { borough: 'Staten Island', name: 'Stapleton', slug: 'stapleton' },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug)
}

export function getLocationBySlug(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug)
}

export function getAllServiceLocationCombos() {
  return SERVICES.flatMap((service) =>
    LOCATIONS.map((location) => ({ service, location }))
  )
}
