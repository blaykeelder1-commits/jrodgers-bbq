// EPOS Now Product ID mapping for J Rodgers BBQ website menu items
// Generated 2026-03-26 from EPOS Now API v4

// Simple 1:1 mapping: website menu item ID -> EPOS Now Product ID
export const eposProductMap = {
  // === BBQ Buffet ===
  'buffet-special':      34737052, // Buffet (Wed-Thurs) — $19.97
  'buffet-weekend':      35136985, // Buffet (Fri-Sun) — $20.97
  'buffet-ayce':         38876541, // All You Can Eat (FRIED RIBS) — $24.99
  'buffet-ayce-premium': 38925622, // ALL YOU CAN EAT (Wet or Dry Ribs) — $26.99

  // === Lunch Specials ===
  'ls-ribs':    34737253, // Smoked Ribs Lunch — $12.47
  'ls-chicken': 34737259, // Chicken Lunch — $12.47
  'ls-sausage': 34737258, // Smoked Sausage Lunch — $12.47

  // === Specialty Sandwiches ===
  'ss-pork':           34737286, // Evans Pulled Pork Sandwich — $7.99
  'ss-sausage':        34737298, // Sausage on Bun — $7.99
  'ss-dog':            34737304, // Smoked Dog — $7.99
  'ss-knuckle':        35100859, // Knuckle Sand — $8.18
  'ss-rib-tip':        null,     // No EPOS match (rib tip sandwich)
  'ss-loaded-potato':  null,     // No EPOS match (loaded baked potato)

  // === Sandwich Combos ===
  'sc-sausage': 34737309, // Smoked Sausage Sandwich (combo cat) — $10.49
  'sc-pork':    34737315, // Evans Pulled Pork Sandwich combo — $15.99
  'sc-rib-tip': null,     // No EPOS match (rib tip combo)
  'sc-knuckle': null,     // No EPOS match (knuckle combo)

  // === BBQ Ribs / Dinner ===
  'bbq-dinner':   34918774, // Dinner Ribs — $16.99
  'bbq-half':     34945962, // Half Slab — $18.75
  'bbq-full':     34946063, // Slab — $29.99
  'bbq-sandwich': 34946027, // Rib Sandwich — $13.50
  'bbq-combo':    34946016, // Combo Dinner — $17.99

  // === Smoked Chicken ===
  'ch-whole':  34737507, // Whole Chicken — $16.99
  'ch-half':   34737508, // Half Chicken — $11.99
  'ch-dinner': 34737515, // Chicken Dinner — $14.99

  // === Sausage ===
  'sau-pound':  34737234, // 1lb Sausage — $14.99
  'sau-dinner': 34737239, // Smoked Sausage Dinner — $16.99

  // === Pulled Pork ===
  'pork-pound':  34737170, // 1lb Pulled Pork — $17.99
  'pork-dinner': 34737174, // PP Dinner — $15.99

  // === Kids Menu ===
  'kid-chicken-1pc':    null,     // No EPOS match (1pc chicken $5.99)
  'kid-chicken-buffet': 35099710, // Kids Buffet(6 y/o & Under) — $7.99
  'kid-rib-sandwich':   null,     // No EPOS match (kid rib sandwich)

  // === Family Specials ===
  'family-4': 34737168, // Family of 4 — $58.99
  'veggie':   null,     // No EPOS match (vegetable of the day — note: 38187339 "Vegetable Plate" is $12.99, different item)

  // === Desserts (non-sized) ===
  'dessert-pound':     34740351, // Pound Cake (slice) — $3.00
  'dessert-redvelvet': 34740343, // Red Velvet Cake (slice) — $4.39
  'dessert-cake':      34740355, // Key Lime Cake (slice) — $4.39 (closest match for generic "Cake Slice")

  // === Drinks ===
  'drink-soft':   34737118, // Coke — $2.49 (generic soft drink entry)
  'drink-tea':    34737097, // Sweet Tea — $2.49
  'drink-coffee': null,     // No EPOS match (no coffee product in EPOS)

  // === Sauces ===
  'sauce-bk':      null, // No EPOS match (BK BBQ Sauce)
  'sauce-regular': null, // No EPOS match (BBQ Sauce)
};

// Sized items: website menu item ID -> { size label: EPOS Product ID }
export const eposSizedProductMap = {
  // === Sides ===
  'side-beans': {
    'Small':  34737087, // Yo-Jo Beans (small) — $4.99
    'Medium': 34737090, // Yo-Jo Beans (medium) — $6.99
    'Large':  34737095, // Yo-Jo Beans (large) — $9.99
  },
  'side-slaw': {
    'Small':  34737155, // Cole Slaw (small) — $4.99
    'Medium': 34737156, // Cole Slaw (medium) — $6.99
    'Large':  34737160, // Cole Slaw (large) — $9.99
  },
  'side-potato': {
    'Small':  34737129, // Potato Salad (small) — $4.99
    'Medium': 34737134, // Potato Salad (medium) — $6.99
    'Large':  34737139, // Potato Salad (large) — $9.99
  },
  'side-fries': {
    'Small':  34737161, // Fries (small) — $4.99
    'Medium': 34737162, // Fries (medium) — $6.99
    'Large':  34737164, // Fries (large) — $9.99
  },
  'side-mac': {
    'Small':  35550299, // Macaroni (small) — $6.64
    'Medium': 35550315, // Macaroni (Medium) — $7.89
    'Large':  35550325, // Macaroni (Large) — $11.74
  },

  // === Desserts (sized) ===
  'dessert-banana': {
    'Small':  34740305, // Banana Pudding (small) — $5.99
    'Medium': 34740314, // Banana Pudding (medium) — $6.99
    'Large':  34740337, // Banana Pudding (large) — $10.99
  },
  'dessert-peach': {
    'Small':  34740292, // Peach Cobbler (small) — $5.99
    'Medium': 34740298, // Peach Cobbler (medium) — $6.99
    'Large':  34740302, // Peach Cobbler (large) — $10.99
  },
};
