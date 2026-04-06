const mockCombos = [
  {
    id: 'combo-rice-sowing',
    crop: 'Rice',
    cropIcon: '🍚',
    process: 'Sowing',
    benefit: 'Faster Setup',
    equipments: [
      { 
        id: 1,
        name: 'John Deere 5075E Tractor', 
        image: '/images/John Deere Tractors.jpg', 
        condition: 'Excellent', 
        available: true,
        owner: 'Rajesh Kumar',
        ownerPhone: '+91 98765 43210',
        specs: { hp: 75, year: 2020, hours: 1200 }
      },
      { 
        id: 5,
        name: 'Seed Drill 9-Tyne', 
        image: '/images/seed drill.jpg',  
        condition: 'Good', 
        available: true,
        owner: 'Prakash Jadhav',
        ownerPhone: '+91 95432 10876',
        specs: { tynes: 9, year: 2018, hours: 1500 }
      }
    ],
    duration: '1 Day',
    distance: 3.2,
    price: {
      combo: 1050,
      individual: 1150,
      savings: 100
    },
    rating: 4.7,
    usageCount: 24,
    insuranceIncluded: true,
    description: 'Complete rice sowing package with tractor and precision seed drill. Perfect for 5-10 acre farms.',
    availability: {
      nextAvailable: '2024-12-25',
      fullyBooked: ['2024-12-22', '2024-12-23']
    }
  },
  {
    id: 'combo-wheat-harvesting',
    crop: 'Wheat',
    cropIcon: '🌾',
    process: 'Harvesting',
    benefit: 'Complete Solution',
    equipments: [
      { 
        id: 6,
        name: 'Combine Harvester', 
        image: '/images/Combine Harvester.jpg', 
        condition: 'Excellent', 
        available: true,
        owner: 'Ramesh Gawande',
        ownerPhone: '+91 94321 09876',
        specs: { type: 'Wheat/Rice', year: 2021, hours: 600 }
      },
      { 
        id: 2,
        name: 'Mahindra 265 DI Tractor', 
        image: '/images/Mahindra 265 DI.jpg', 
        condition: 'Good', 
        available: true,
        owner: 'Suresh Patil',
        ownerPhone: '+91 98234 56789',
        specs: { hp: 50, year: 2019, hours: 2100 }
      }
    ],
    duration: '2 Days',
    distance: 8.5,
    price: {
      combo: 1950,
      individual: 2150,
      savings: 200
    },
    rating: 4.9,
    usageCount: 42,
    insuranceIncluded: true,
    description: 'Premium wheat harvesting combo with modern combine harvester and support tractor. Operator included.',
    availability: {
      nextAvailable: '2024-12-24',
      fullyBooked: ['2024-12-26', '2024-12-27', '2024-12-28']
    }
  },
  {
    id: 'combo-cotton-prep',
    crop: 'Cotton',
    cropIcon: '🌿',
    process: 'Land Preparation',
    benefit: 'Save Time',
    equipments: [
      { 
        id: 3,
        name: 'Swaraj 855 FE Tractor', 
        image: '/images/Swaraj.jpg', 
        condition: 'Excellent', 
        available: true,
        owner: 'Amit Deshmukh',
        ownerPhone: '+91 97654 32109',
        specs: { hp: 58, year: 2021, hours: 800 }
      },
      { 
        id: 4,
        name: 'Rotavator 7ft Standard', 
       image: '/images/Rotavator.jpg',  
        condition: 'Good', 
        available: true,
        owner: 'Vijay Singh',
        ownerPhone: '+91 96543 21087',
        specs: { width: '7ft', year: 2020, hours: 500 }
      }
    ],
    duration: '1 Day',
    distance: 5.8,
    price: {
      combo: 800,
      individual: 900,
      savings: 100
    },
    rating: 4.6,
    usageCount: 18,
    insuranceIncluded: false,
    description: 'Efficient land preparation combo for cotton farming. Deep plowing with rotavator for optimal soil condition.',
    availability: {
      nextAvailable: '2024-12-23',
      fullyBooked: ['2024-12-29', '2024-12-30']
    }
  }
];

export default mockCombos;