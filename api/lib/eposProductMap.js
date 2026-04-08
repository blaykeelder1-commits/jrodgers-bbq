// EPOS Now Product ID mapping for J Rodgers BBQ website menu items
// Generated 2026-03-26 from EPOS Now API v4

// Simple 1:1 mapping: website menu item ID -> EPOS Now Product ID
export const eposProductMap = {
  // === BBQ Buffet ===
  'buffet-dinner':     34737052, // BBQ Buffet — $21.99
  'buffet-ayce':       38876541, // All You Can Eat — $26.99

  // === Lunch Specials ===
  'ls-ribs':    34737253, // Rib Lunch — $14.49
  'ls-chicken': 34737259, // Chicken Lunch — $14.49
  'ls-sausage': 34737258, // Sausage Links Lunch — $14.49
  'ls-rib-3meat': null,   // No EPOS match (Rib Lunch Special 3 Meats)

  // === Specialty Sandwiches ===
  'ss-pork':           34737286, // Evans Pulled Pork Sandwich — $7.99
  'ss-sausage':        34737298, // Sausage on Bun — $7.99
  'ss-dog':            34737304, // Smoked Dog — $7.99
  'ss-knuckle':        35100859, // Knuckle Sandwich — $8.99

  // === Sandwich Combos ===
  'sc-sausage':     34737309, // Smoked Sausage Sandwich Combo — $10.99
  'sc-pork':        34737315, // Evans Pulled Pork Sandwich Combo — $11.99
  'sc-knuckle':     null,     // No EPOS match (Knuckle Sandwich Combo)
  'sc-dog-sausage': null,     // No EPOS match (Smoked Dog & Sausage Combo)
  'sc-chicken':     null,     // No EPOS match (Pulled Chicken Sandwich Combo)
  'sc-pulled-pork': null,     // No EPOS match (Pulled Pork Sandwich Combo)

  // === BBQ Ribs / Dinner ===
  'bbq-dinner':   34918774, // Rib Dinner — $18.49
  'bbq-half':     34945962, // Half Slab — $19.99
  'bbq-full':     34946063, // Slab Ribs — $31.99
  'bbq-sandwich': 34946027, // Rib Sandwich — $15.99
  'bbq-combo':    34946016, // 3 Meat Combo Dinner — $21.99

  // === Smoked Chicken ===
  'ch-whole':  34737507, // Whole Chicken — $18.69
  'ch-half':   34737508, // Half Chicken — $13.99
  'ch-dinner': 34737515, // Chicken Dinner — $16.99

  // === Sausage ===
  'sau-pound':  34737234, // 1lb Sausage — $14.99
  'sau-dinner': 34737239, // Smoked Sausage Dinner — $16.99

  // === Pulled Pork ===
  'pork-pound':  34737170, // 1lb Pulled Pork — $17.99
  'pork-dinner': 34737174, // Pulled Pork Dinner — $15.99

  // === Fried Fish & Wings ===
  'fish-2pc':   null, // No EPOS match (Fried Fish Basket 2pc)
  'fish-3pc':   null, // No EPOS match (Fried Fish Basket 3pc)
  'wings-6pc':  null, // No EPOS match (Fried Party Wing Basket)

  // === Kids Menu ===
  'kid-hotdog':        null, // No EPOS match (Hot Dog with Fries)
  'kid-chicken-fries': null, // No EPOS match (Chicken Fries with Fries)

  // === Family Specials ===
  'family-4':     34737168, // Family of 4 — $62.99
  'veggie-plate': null,     // No EPOS match (Vegetable Plate)

  // === Desserts (non-sized) ===
  'dessert-pound':     34740351, // Lemon Pound Cake — $3.00
  'dessert-redvelvet': 34740343, // Red Velvet Cake — $4.39
  'dessert-chocolate': 34740355, // Chocolate Cake — $4.39

  // === Drinks ===
  'drink-soft':   34737118, // Soft Drinks — $2.49
  'drink-tea':    34737097, // Sweet Tea — $2.99
  'drink-coffee': null,     // No EPOS match (no coffee product in EPOS)

  // === Sauces ===
  'sauce-bk':      39332879, // BK BBQ Sauce — $0.01
  'sauce-regular': 39332880, // BBQ Sauce — $0.01
  'test-xl-drink':   39336526, // XL Drink (Test) — $0.01
  'test-rib-dinner': 39336527, // Rib Dinner (Test) — $0.01
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
    'Small':  35550299, // Mac and Cheese (small) — $6.99
    'Medium': 35550315, // Mac and Cheese (medium) — $7.99
    'Large':  35550325, // Mac and Cheese (large) — $11.99
  },
  'side-greens': {
    'Small':  36162376, // Greens (small) — $6.49
    'Medium': 36162382, // Greens (medium) — $7.89
    'Large':  36162404, // Greens (large) — $11.24
  },
  'side-yams': {
    'Small':  39096845, // YAMS (SMALL) — $6.49
    'Medium': 39096928, // YAMS (MEDIUM) — $7.89
    'Large':  39096858, // YAMS (LARGE) — $11.24
  },
  'side-cabbage': {
    'Small':  39160147, // Cabbage (SMALL) — $6.49
    'Medium': null, // Cabbage (medium) — not in EPOS yet
    'Large':  null, // Cabbage (large) — not in EPOS yet
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
  'test-baked-beans': {
    'Small':  39336528, // Baked Beans S (Test) — $0.01
    'Medium': 39336529, // Baked Beans M (Test) — $0.01
    'Large':  39336530, // Baked Beans L (Test) — $0.01
  },
  'test-apple-pie': {
    'Small':  39336531, // Apple Pie S (Test) — $0.01
    'Medium': 39336532, // Apple Pie M (Test) — $0.01
    'Large':  39336533, // Apple Pie L (Test) — $0.01
  },
};
