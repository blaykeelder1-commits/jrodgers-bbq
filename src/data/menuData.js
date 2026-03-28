const sideOptions = ['Yo-Jo Beans', 'Cole Slaw', 'Potato Salad', 'French Fries', 'Mac and Cheese', 'Collard Greens', 'Candied Yams', 'Cabbage'];

export const menuCategories = [
  {
    id: 'buffet',
    name: 'BBQ Buffet',
    description: 'All-you-can-eat BBQ — Dine In Only',
    items: [
      {
        id: 'buffet-dinner',
        name: 'BBQ Buffet',
        description: 'All-you-can-eat BBQ buffet including ribs, smoked meats, chicken & sides',
        price: 21.99,
        image: '/images/menu/combo-dinner.jpg',
        dineInOnly: true
      },
      {
        id: 'buffet-ayce',
        name: 'All You Can Eat',
        description: 'All-you-can-eat ribs with 2 sides',
        price: 26.99,
        image: '/images/menu/combo-dinner.jpg',
        dineInOnly: true,
        customization: { sides: { count: 2, options: sideOptions } }
      }
    ]
  },
  {
    id: 'lunch-specials',
    name: 'Lunch Specials',
    description: 'Available 10:00 AM - 2:00 PM',
    timeRestricted: { start: 10, end: 14 },
    items: [
      {
        id: 'ls-ribs',
        name: 'Rib Lunch',
        description: '3 bones & 2 knuckles with 2 sides & bread',
        price: 14.49,
        image: '/images/menu/half-slab-ribs.jpg',
        customization: { sides: { count: 2, options: sideOptions } }
      },
      {
        id: 'ls-chicken',
        name: 'Chicken Lunch',
        description: 'Smoked chicken with 2 sides & bread',
        price: 14.49,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: sideOptions } }
      },
      {
        id: 'ls-sausage',
        name: 'Sausage Links Lunch',
        description: 'Slowly smoked country links with 2 sides & bread',
        price: 14.49,
        image: '/images/menu/sausage-sandwich.jpg',
        customization: { sides: { count: 2, options: sideOptions } }
      },
      {
        id: 'ls-rib-3meat',
        name: 'Rib Lunch Special (3 Meats)',
        description: '3 different meats with 2 sides & bread',
        price: 16.49,
        image: '/images/menu/combo-dinner.jpg',
        customization: {
          sides: { count: 2, options: sideOptions },
          meats: { count: 3, options: ['Ribs', 'Smoked Chicken', 'Sausage', 'Pulled Pork'] }
        }
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
        price: 7.99,
        image: '/images/menu/sausage-sandwich.jpg'
      },
      {
        id: 'ss-dog',
        name: 'Smoked Dog',
        description: 'Smoked sausage on bun with sauce',
        price: 7.99,
        image: '/images/menu/sausage-sandwich.jpg'
      },
      {
        id: 'ss-knuckle',
        name: 'Knuckle Sandwich',
        description: 'Our signature knuckle sandwich',
        price: 8.99,
        image: '/images/menu/pulled-pork.jpg',
        bogo: 'Buy One Get One Free (sandwich only)'
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
        customization: { sides: { count: 2, options: sideOptions } }
      },
      {
        id: 'sc-pork',
        name: 'Evans Pulled Pork Sandwich Combo',
        description: 'With 2 sides & tea',
        price: 11.99,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: sideOptions } }
      },
      {
        id: 'sc-knuckle',
        name: 'Knuckle Sandwich Combo',
        description: 'With 2 sides & tea',
        price: 12.99,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: sideOptions } }
      },
      {
        id: 'sc-dog-sausage',
        name: 'Smoked Dog & Smoked Sausage Sandwich Combo',
        description: 'With 2 sides & tea',
        price: 14.99,
        image: '/images/menu/sausage-sandwich.jpg',
        customization: { sides: { count: 2, options: sideOptions } }
      },
      {
        id: 'sc-chicken',
        name: 'Pulled Chicken Sandwich Combo',
        description: 'With 2 sides & tea',
        price: 12.99,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: sideOptions } }
      },
      {
        id: 'sc-pulled-pork',
        name: 'Pulled Pork Sandwich Combo',
        description: 'With 2 sides & tea',
        price: 15.99,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: sideOptions } },
        bogo: 'Buy One Combo, Get a Sandwich Free'
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
        description: '5 ribs and 3 knuckles with 2 sides & bread',
        price: 18.49,
        image: '/images/menu/half-slab-ribs.jpg',
        customization: { sides: { count: 2, options: sideOptions } }
      },
      {
        id: 'bbq-half',
        name: 'Half Slab',
        description: 'Half rack of mouth-watering pork ribs with bread',
        price: 19.99,
        image: '/images/menu/half-slab-ribs.jpg'
      },
      {
        id: 'bbq-full',
        name: 'Slab Ribs',
        description: 'Full rack of mouth-watering pork ribs with bread',
        price: 31.99,
        image: '/images/menu/half-slab-ribs.jpg'
      },
      {
        id: 'bbq-sandwich',
        name: 'Rib Sandwich',
        description: 'Mouth-watering pork ribs on bread',
        price: 15.99,
        image: '/images/menu/fried-ribs.jpg'
      },
      {
        id: 'bbq-combo',
        name: '3 Meat Combo Dinner',
        description: '3 different meats with 2 sides & bread',
        price: 21.99,
        image: '/images/menu/combo-dinner.jpg',
        customization: {
          sides: { count: 2, options: sideOptions },
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
        price: 18.69,
        image: '/images/menu/pulled-pork.jpg'
      },
      {
        id: 'ch-half',
        name: 'Half Chicken',
        description: 'Delicious smoked chicken with bread',
        price: 13.99,
        image: '/images/menu/pulled-pork.jpg'
      },
      {
        id: 'ch-dinner',
        name: 'Chicken Dinner',
        description: 'Half delicious smoked chicken with 2 sides & bread',
        price: 16.99,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: sideOptions } }
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
        customization: { sides: { count: 2, options: sideOptions } }
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
        price: 17.99,
        image: '/images/menu/pulled-pork.jpg'
      },
      {
        id: 'pork-dinner',
        name: 'Pulled Pork Dinner',
        description: 'Pulled pork with 2 sides & bread',
        price: 15.99,
        image: '/images/menu/pulled-pork.jpg',
        customization: { sides: { count: 2, options: sideOptions } }
      }
    ]
  },
  {
    id: 'sides',
    name: 'Sides',
    description: 'Homemade sides to complete your meal',
    items: [
      {
        id: 'side-beans',
        name: 'YO - Jo Beans',
        description: 'Our famous baked beans',
        price: 4.99,
        image: '/images/menu/yo-jo-beans.jpg',
        customization: {
          size: {
            options: [
              { label: 'Small', price: 4.99 },
              { label: 'Medium', price: 6.99 },
              { label: 'Large', price: 9.99 }
            ]
          }
        }
      },
      {
        id: 'side-slaw',
        name: 'Cole Slaw',
        description: 'Creamy homemade coleslaw',
        price: 4.99,
        image: '/images/menu/cole-slaw.jpg',
        customization: {
          size: {
            options: [
              { label: 'Small', price: 4.99 },
              { label: 'Medium', price: 6.99 },
              { label: 'Large', price: 9.99 }
            ]
          }
        }
      },
      {
        id: 'side-potato',
        name: 'Potato Salad',
        description: 'Southern-style potato salad',
        price: 4.99,
        image: '/images/menu/potato-salad.jpg',
        customization: {
          size: {
            options: [
              { label: 'Small', price: 4.99 },
              { label: 'Medium', price: 6.99 },
              { label: 'Large', price: 9.99 }
            ]
          }
        }
      },
      {
        id: 'side-fries',
        name: 'French Fries',
        description: 'Crispy golden fries',
        price: 4.99,
        image: '/images/menu/fries.jpg',
        customization: {
          size: {
            options: [
              { label: 'Small', price: 4.99 },
              { label: 'Medium', price: 6.99 },
              { label: 'Large', price: 9.99 }
            ]
          }
        }
      },
      {
        id: 'side-mac',
        name: 'Mac and Cheese',
        description: 'Creamy homemade mac and cheese',
        price: 6.99,
        image: '/images/menu/mac-and-cheese.jpg',
        customization: {
          size: {
            options: [
              { label: 'Small', price: 6.99 },
              { label: 'Medium', price: 7.99 },
              { label: 'Large', price: 11.99 }
            ]
          }
        }
      },
      {
        id: 'side-greens',
        name: 'Collard Greens',
        description: 'Slow-cooked southern collard greens',
        price: 6.99,
        image: '/images/menu/collard-greens.jpg',
        customization: {
          size: {
            options: [
              { label: 'Small', price: 6.99 },
              { label: 'Medium', price: 7.99 },
              { label: 'Large', price: 11.99 }
            ]
          }
        }
      },
      {
        id: 'side-yams',
        name: 'Candied Yams',
        description: 'Sweet and savory candied yams',
        price: 6.99,
        image: '/images/menu/collard-greens.jpg',
        customization: {
          size: {
            options: [
              { label: 'Small', price: 6.99 },
              { label: 'Medium', price: 7.99 },
              { label: 'Large', price: 11.99 }
            ]
          }
        }
      },
      {
        id: 'side-cabbage',
        name: 'Cabbage',
        description: 'Southern-style cooked cabbage',
        price: 6.99,
        image: '/images/menu/collard-greens.jpg',
        customization: {
          size: {
            options: [
              { label: 'Small', price: 6.99 },
              { label: 'Medium', price: 7.99 },
              { label: 'Large', price: 11.99 }
            ]
          }
        }
      }
    ]
  },
  {
    id: 'fish-wings',
    name: 'Fried Fish & Wings',
    description: 'Fried baskets and wings',
    items: [
      {
        id: 'fish-2pc',
        name: 'Fried Fish Basket (2pc)',
        description: '2 pieces of fried fish with a side',
        price: 14.99,
        image: '/images/menu/combo-dinner.jpg',
        customization: { sides: { count: 1, options: sideOptions } }
      },
      {
        id: 'fish-3pc',
        name: 'Fried Fish Basket (3pc)',
        description: '3 pieces of fried fish with a side',
        price: 16.99,
        image: '/images/menu/combo-dinner.jpg',
        customization: { sides: { count: 1, options: sideOptions } }
      },
      {
        id: 'wings-6pc',
        name: 'Fried Party Wing Basket',
        description: '6 piece party wings',
        price: 9.99,
        image: '/images/menu/combo-dinner.jpg'
      }
    ]
  },
  {
    id: 'children',
    name: 'Kids Menu',
    description: 'For our little guests (12 & under)',
    items: [
      {
        id: 'kid-hotdog',
        name: 'Hot Dog with Fries',
        description: 'Hot dog served with fries',
        price: 6.99,
        image: '/images/menu/sausage-sandwich.jpg'
      },
      {
        id: 'kid-chicken-fries',
        name: 'Chicken Fries with Fries',
        description: 'Chicken fries served with fries',
        price: 7.99,
        image: '/images/menu/pulled-pork.jpg'
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
        price: 62.99,
        image: '/images/menu/combo-dinner.jpg',
        customization: { sides: { count: 2, options: sideOptions } }
      },
    ]
  },
  {
    id: 'vegetable-plate',
    name: 'Vegetable Plate',
    description: 'Build your own plate with your favorite sides',
    items: [
      {
        id: 'veggie-plate',
        name: 'Vegetable Plate',
        description: 'Vegetable plate with 3 sides',
        price: 15.99,
        image: '/images/menu/collard-greens.jpg',
        customization: { sides: { count: 3, options: sideOptions } }
      }
    ]
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet endings to your meal',
    items: [
      {
        id: 'dessert-banana',
        name: 'Banana Pudding',
        description: 'Creamy homemade banana pudding',
        price: 5.99,
        image: '/images/menu/banana-pudding.jpg',
        customization: {
          size: {
            options: [
              { label: 'Small', price: 5.99 },
              { label: 'Medium', price: 6.99 },
              { label: 'Large', price: 10.99 }
            ]
          }
        }
      },
      {
        id: 'dessert-peach',
        name: 'Peach Cobbler',
        description: 'Warm peach cobbler with a flaky crust',
        price: 5.99,
        image: '/images/menu/peach-cobbler.jpg',
        customization: {
          size: {
            options: [
              { label: 'Small', price: 5.99 },
              { label: 'Medium', price: 6.99 },
              { label: 'Large', price: 10.99 }
            ]
          }
        }
      },
      {
        id: 'dessert-pound',
        name: 'Lemon Pound Cake',
        description: 'Classic homemade lemon pound cake',
        price: 3.00,
        image: '/images/menu/pound-cake-slice.jpg'
      },
      {
        id: 'dessert-redvelvet',
        name: 'Red Velvet Cake',
        description: 'Rich red velvet cake with cream cheese frosting',
        price: 4.39,
        image: '/images/menu/pound-cake-slice.jpg'
      },
      {
        id: 'dessert-chocolate',
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake',
        price: 4.39,
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
        price: 2.49,
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
  menuCategories.find(c => c.id === 'desserts')?.items.find(i => i.id === 'dessert-banana')
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
