export const menuCategories = [
  {
    id: 'buffet',
    name: 'BBQ Buffet',
    description: 'Friday, Saturday & Sunday',
    items: [
      {
        id: 'buffet-main',
        name: 'Buffet (Until 2PM)',
        description: 'All-you-can-eat BBQ buffet including ribs, smoked meats, chicken & sides',
        price: 20.99,
        image: '/images/menu/combo-dinner.jpg'
      },
      {
        id: 'buffet-ayce',
        name: 'All You Can Eat Ribs (After 2PM)',
        description: 'All-you-can-eat ribs',
        price: 35.00,
        image: '/images/menu/combo-dinner.jpg'
      },
      {
        id: 'buffet-ayce-premium',
        name: 'All You Can Eat Wet/Dry Ribs & 2 Sides (After 2PM)',
        description: 'All-you-can-eat wet & dry ribs with 2 sides',
        price: 35.99,
        image: '/images/menu/combo-dinner.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      }
    ]
  },
  {
    id: 'lunch-specials',
    name: 'Lunch Specials',
    description: 'Wednesday & Thursday, 10:00 AM - 2:00 PM',
    items: [
      {
        id: 'ls-ribs',
        name: 'Rib Lunch',
        description: '3 bones with 2 sides & bread',
        price: 12.00,
        image: '/images/menu/half-slab-ribs.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      },
      {
        id: 'ls-chicken',
        name: 'Chicken Lunch',
        description: 'Smoked chicken with 2 sides & bread',
        price: 10.00,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      },
      {
        id: 'ls-sausage',
        name: 'Smoked Country Links Lunch',
        description: 'Slowly smoked country links with 2 sides & bread',
        price: 10.00,
        image: '/images/menu/sausage-sandwich.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      }
    ]
  },
  {
    id: 'specialty-sandwiches',
    name: 'Specialty Sandwiches',
    description: 'Our signature sandwiches made fresh daily',
    items: [
      {
        id: 'ss-pork',
        name: 'Evans Pulled Pork On Bun',
        description: 'Pulled smoked pork lightly marinated with sauce',
        price: 7.99,
        image: '/images/menu/pulled-pork.jpg'
      },
      {
        id: 'ss-sausage',
        name: 'Sausage On A Bun',
        description: 'Sliced sausage lightly sauced',
        price: 6.99,
        image: '/images/menu/sausage-sandwich.jpg'
      },
      {
        id: 'ss-dog',
        name: 'Smoked Dog',
        description: 'Smoked sausage on bun with sauce',
        price: 5.99,
        image: '/images/menu/sausage-sandwich.jpg'
      },
      {
        id: 'ss-knuckle',
        name: 'Knuckle Sandwich',
        description: 'Our signature knuckle sandwich',
        price: 8.99,
        image: '/images/menu/pulled-pork.jpg'
      },
      {
        id: 'ss-rib-tip',
        name: 'Rib Tip Sandwich',
        description: 'Tender rib tips on a bun',
        price: 9.99,
        image: '/images/menu/fried-ribs.jpg'
      },
      {
        id: 'ss-loaded-potato',
        name: 'Loaded Baked Potato',
        description: 'Loaded baked potato with your choice of meat',
        price: 12.99,
        image: '/images/menu/combo-dinner.jpg'
      }
    ]
  },
  {
    id: 'sandwich-combos',
    name: 'Sandwich Combos',
    description: 'Sandwiches served with 2 sides & tea',
    items: [
      {
        id: 'sc-sausage',
        name: 'Smoked Sausage Sandwich Combo',
        description: 'With 2 sides & tea',
        price: 10.99,
        image: '/images/menu/sausage-sandwich.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      },
      {
        id: 'sc-pork',
        name: 'Evans Pulled Pork Sandwich Combo',
        description: 'With 2 sides & tea',
        price: 11.99,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      },
      {
        id: 'sc-rib-tip',
        name: 'Rib Tip Sandwich Combo',
        description: 'With 2 sides & tea',
        price: 13.99,
        image: '/images/menu/fried-ribs.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      },
      {
        id: 'sc-knuckle',
        name: 'Knuckle Sandwich Combo',
        description: 'With 2 sides & tea',
        price: 12.99,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      }
    ]
  },
  {
    id: 'bbq-ribs',
    name: 'J Rodgers BBQ Dinner',
    description: 'Our famous slow-smoked ribs',
    items: [
      {
        id: 'bbq-dinner',
        name: 'Rib Dinner',
        description: 'Delicious cut ribs with 2 sides & bread',
        price: 15.99,
        image: '/images/menu/half-slab-ribs.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      },
      {
        id: 'bbq-half',
        name: 'Half Slab',
        description: 'Half rack of mouth-watering pork ribs with bread',
        price: 24.99,
        image: '/images/menu/half-slab-ribs.jpg'
      },
      {
        id: 'bbq-full',
        name: 'Slab Ribs',
        description: 'Full rack of mouth-watering pork ribs with bread',
        price: 29.99,
        image: '/images/menu/half-slab-ribs.jpg'
      },
      {
        id: 'bbq-sandwich',
        name: 'Rib Sandwich',
        description: 'Mouth-watering pork ribs on bread',
        price: 13.99,
        image: '/images/menu/fried-ribs.jpg'
      },
      {
        id: 'bbq-combo',
        name: 'Combo Dinner',
        description: '3 different meats with 2 sides & bread',
        price: 18.99,
        image: '/images/menu/combo-dinner.jpg',
        customization: {
          sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] },
          meats: { count: 3, options: ['Ribs', 'Smoked Chicken', 'Sausage', 'Pulled Pork'] }
        }
      }
    ]
  },
  {
    id: 'chicken',
    name: 'Smoked Chicken',
    description: 'Tender smoked chicken',
    items: [
      {
        id: 'ch-whole',
        name: 'Whole Chicken',
        description: 'Delicious smoked chicken with bread',
        price: 16.99,
        image: '/images/menu/pulled-pork.jpg'
      },
      {
        id: 'ch-half',
        name: 'Half Chicken',
        description: 'Delicious smoked chicken with bread',
        price: 11.99,
        image: '/images/menu/pulled-pork.jpg'
      },
      {
        id: 'ch-dinner',
        name: 'Chicken Dinner',
        description: 'Half delicious smoked chicken with 2 sides & bread',
        price: 14.99,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      }
    ]
  },
  {
    id: 'sausage',
    name: 'Sausage',
    description: 'Slowly smoked country links',
    items: [
      {
        id: 'sau-pound',
        name: '1lb Sausage',
        description: 'A full pound of our smoked sausage',
        price: 14.99,
        image: '/images/menu/sausage-sandwich.jpg'
      },
      {
        id: 'sau-dinner',
        name: 'Sausage Dinner',
        description: 'Smoked sausage with 2 sides & bread',
        price: 16.99,
        image: '/images/menu/sausage-sandwich.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      }
    ]
  },
  {
    id: 'pork',
    name: 'Evans Pulled Pork',
    description: 'Tender pulled pork',
    items: [
      {
        id: 'pork-pound',
        name: '1lb Of Pulled Pork',
        description: 'A full pound of our tender pulled pork',
        price: 14.84,
        image: '/images/menu/pulled-pork.jpg'
      },
      {
        id: 'pork-dinner',
        name: 'Pulled Pork Dinner',
        description: 'Pulled pork with 2 sides & bread',
        price: 15.99,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      }
    ]
  },
  {
    id: 'sides',
    name: 'Sides',
    description: 'Homemade sides to complete your meal',
    items: [
      {
        id: 'side-beans-sm',
        name: 'YO - Jo Beans (Small)',
        description: 'Our famous baked beans',
        price: 4.99,
        image: '/images/menu/yo-jo-beans.jpg'
      },
      {
        id: 'side-beans-md',
        name: 'YO - Jo Beans (Medium)',
        description: 'Our famous baked beans',
        price: 6.99,
        image: '/images/menu/yo-jo-beans.jpg'
      },
      {
        id: 'side-beans-lg',
        name: 'YO - Jo Beans (Large)',
        description: 'Our famous baked beans',
        price: 9.99,
        image: '/images/menu/yo-jo-beans.jpg'
      },
      {
        id: 'side-slaw-sm',
        name: 'Cole Slaw (Small)',
        description: 'Creamy homemade coleslaw',
        price: 4.99,
        image: '/images/menu/cole-slaw.jpg'
      },
      {
        id: 'side-slaw-md',
        name: 'Cole Slaw (Medium)',
        description: 'Creamy homemade coleslaw',
        price: 6.99,
        image: '/images/menu/cole-slaw.jpg'
      },
      {
        id: 'side-slaw-lg',
        name: 'Cole Slaw (Large)',
        description: 'Creamy homemade coleslaw',
        price: 9.99,
        image: '/images/menu/cole-slaw.jpg'
      },
      {
        id: 'side-potato-sm',
        name: 'Potato Salad (Small)',
        description: 'Southern-style potato salad',
        price: 4.99,
        image: '/images/menu/potato-salad.jpg'
      },
      {
        id: 'side-potato-md',
        name: 'Potato Salad (Medium)',
        description: 'Southern-style potato salad',
        price: 6.99,
        image: '/images/menu/potato-salad.jpg'
      },
      {
        id: 'side-potato-lg',
        name: 'Potato Salad (Large)',
        description: 'Southern-style potato salad',
        price: 9.99,
        image: '/images/menu/potato-salad.jpg'
      },
      {
        id: 'side-fries-sm',
        name: 'French Fries (Small)',
        description: 'Crispy golden fries',
        price: 4.99,
        image: '/images/menu/fries.jpg'
      },
      {
        id: 'side-fries-md',
        name: 'French Fries (Medium)',
        description: 'Crispy golden fries',
        price: 6.99,
        image: '/images/menu/fries.jpg'
      },
      {
        id: 'side-fries-lg',
        name: 'French Fries (Large)',
        description: 'Crispy golden fries',
        price: 9.99,
        image: '/images/menu/fries.jpg'
      },
      {
        id: 'side-mac-sm',
        name: 'Mac and Cheese (Small)',
        description: 'Creamy homemade mac and cheese',
        price: 3.99,
        image: '/images/menu/mac-and-cheese.jpg'
      },
      {
        id: 'side-mac-md',
        name: 'Mac and Cheese (Medium)',
        description: 'Creamy homemade mac and cheese',
        price: 4.99,
        image: '/images/menu/mac-and-cheese.jpg'
      },
      {
        id: 'side-mac-lg',
        name: 'Mac and Cheese (Large)',
        description: 'Creamy homemade mac and cheese',
        price: 7.99,
        image: '/images/menu/mac-and-cheese.jpg'
      }
    ]
  },
  {
    id: 'children',
    name: 'Kids Menu',
    description: 'For our little guests (12 & under)',
    items: [
      {
        id: 'kid-chicken-1pc',
        name: '1pc Chicken',
        description: 'One piece of chicken',
        price: 5.99,
        image: '/images/menu/pulled-pork.jpg'
      },
      {
        id: 'kid-chicken-buffet',
        name: 'Chicken Buffet (2pc)',
        description: 'Two pieces of chicken',
        price: 7.99,
        image: '/images/menu/pulled-pork.jpg'
      },
      {
        id: 'kid-rib-sandwich',
        name: 'Rib Sandwich',
        description: 'Kid-sized rib sandwich',
        price: 7.99,
        image: '/images/menu/fried-ribs.jpg'
      }
    ]
  },
  {
    id: 'specials',
    name: 'Family Specials',
    description: 'Perfect for feeding the whole family',
    items: [
      {
        id: 'family-4',
        name: 'Family Of Four Special',
        description: '1 slab of barbecue, 1/2 chicken, 1lb smoked sausage & 2 large sides',
        price: 58.99,
        image: '/images/menu/combo-dinner.jpg',
        customization: { sides: { count: 2, options: ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens'] } }
      },
      {
        id: 'veggie',
        name: 'Vegetable of the Day',
        description: 'Ask about our daily vegetable selection',
        price: 3.99,
        image: '/images/menu/collard-greens.jpg'
      }
    ]
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet endings to your meal',
    items: [
      {
        id: 'dessert-banana-sm',
        name: 'Banana Pudding (Small)',
        description: 'Creamy homemade banana pudding',
        price: 5.99,
        image: '/images/menu/banana-pudding.jpg'
      },
      {
        id: 'dessert-banana-md',
        name: 'Banana Pudding (Medium)',
        description: 'Creamy homemade banana pudding',
        price: 6.99,
        image: '/images/menu/banana-pudding.jpg'
      },
      {
        id: 'dessert-banana-lg',
        name: 'Banana Pudding (Large)',
        description: 'Creamy homemade banana pudding',
        price: 10.99,
        image: '/images/menu/banana-pudding.jpg'
      },
      {
        id: 'dessert-peach-sm',
        name: 'Peach Cobbler (Small)',
        description: 'Warm peach cobbler with a flaky crust',
        price: 5.99,
        image: '/images/menu/peach-cobbler.jpg'
      },
      {
        id: 'dessert-peach-md',
        name: 'Peach Cobbler (Medium)',
        description: 'Warm peach cobbler with a flaky crust',
        price: 6.99,
        image: '/images/menu/peach-cobbler.jpg'
      },
      {
        id: 'dessert-peach-lg',
        name: 'Peach Cobbler (Large)',
        description: 'Warm peach cobbler with a flaky crust',
        price: 10.99,
        image: '/images/menu/peach-cobbler.jpg'
      },
      {
        id: 'dessert-pound',
        name: 'Pound Cake',
        description: 'Classic homemade pound cake',
        price: 3.99,
        image: '/images/menu/pound-cake-slice.jpg'
      },
      {
        id: 'dessert-redvelvet',
        name: 'Red Velvet Cake',
        description: 'Rich red velvet cake with cream cheese frosting',
        price: 4.99,
        image: '/images/menu/pound-cake-slice.jpg'
      },
      {
        id: 'dessert-cake',
        name: 'Cake Slice',
        description: 'Ask about our daily cake selection',
        price: 4.99,
        image: '/images/menu/pound-cake-slice.jpg'
      }
    ]
  },
  {
    id: 'drinks',
    name: 'Drinks',
    description: 'Refreshing beverages',
    items: [
      {
        id: 'drink-soft',
        name: 'Soft Drinks',
        description: 'Coke, Sprite, Dr Pepper, and more',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop'
      },
      {
        id: 'drink-tea',
        name: 'Sweet Tea',
        description: 'Southern sweet tea (one refill)',
        price: 2.99,
        image: '/images/menu/sweet-tea.jpg'
      },
      {
        id: 'drink-coffee',
        name: 'Coffee',
        description: 'Fresh brewed coffee',
        price: 1.99,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'
      }
    ]
  }
];

export const featuredItems = [
  menuCategories.find(c => c.id === 'bbq-ribs')?.items.find(i => i.id === 'bbq-full'),
  menuCategories.find(c => c.id === 'chicken')?.items.find(i => i.id === 'ch-dinner'),
  menuCategories.find(c => c.id === 'specials')?.items.find(i => i.id === 'family-4'),
  menuCategories.find(c => c.id === 'desserts')?.items.find(i => i.id === 'dessert-banana-sm')
].filter(Boolean);

export const restaurantInfo = {
  name: "J Rodgers BBQ & Soul Food",
  tagline: "Welcome Home",
  squarePaymentLink: "https://square.link/u/zwHlLC8u",
  address: "1444 Industrial Parkway",
  city: "Saraland",
  state: "AL",
  zip: "36571",
  phone: "(251) 675-3282",
  email: "info@jrodgersbbq.com",
  hours: {
    monday: "Closed (DoorDash Available)",
    tuesday: "Closed (DoorDash Available)",
    wednesday: "10:00 AM - 9:00 PM",
    thursday: "10:00 AM - 9:00 PM",
    friday: "10:00 AM - 9:00 PM",
    saturday: "10:00 AM - 9:00 PM",
    sunday: "11:00 AM - 5:00 PM"
  },
  socialMedia: {
    facebook: "https://facebook.com/jrodgersbbq",
    instagram: "https://instagram.com/jrodgersbbq"
  }
};
