import { TripPlan } from '../types/trip';

export const DEFAULT_TRIP_TOKYO: TripPlan = {
  id: 'trip-tokyo-demo',
  createdAt: new Date().toISOString(),
  title: 'Sensory Tokyo & Historic Traditions',
  destination: 'Tokyo',
  startingLocation: 'San Francisco (SFO)',
  country: 'Japan',
  summary: 'A curated 6-day journey balancing neon-lit futuristic districts, tranquil Edo shrines, world-class culinary masterpieces, and artisan neighborhoods.',
  startDate: '2026-10-10',
  endDate: '2026-10-15',
  durationDays: 6,
  travelers: 2,
  adults: 2,
  children: 0,
  budget: 4200,
  currency: 'USD',
  travelStyle: 'Standard',
  coordinates: { lat: 35.6762, lng: 139.6503 },
  weatherForecast: {
    summary: 'Mild autumn weather with crisp mornings and gentle evening breezes.',
    avgTempC: 19,
    avgTempF: 66,
    condition: 'Partly Cloudy & Pleasant',
    packingAdvice: 'Layered clothing, comfortable walking sneakers, and a light cardigan or trench coat for evenings.',
    daily: [
      { day: 1, condition: 'Clear Sky', highC: 21, lowC: 14, rainChance: 5, summary: 'Sunny and crisp' },
      { day: 2, condition: 'Partly Cloudy', highC: 20, lowC: 15, rainChance: 10, summary: 'Ideal sightseeing' },
      { day: 3, condition: 'Mild Breeze', highC: 19, lowC: 13, rainChance: 15, summary: 'Cool morning' },
      { day: 4, condition: 'Scattered Clouds', highC: 22, lowC: 16, rainChance: 20, summary: 'Warm afternoon' },
      { day: 5, condition: 'Light Mist', highC: 18, lowC: 14, rainChance: 30, summary: 'Carry pocket umbrella' },
      { day: 6, condition: 'Sunny', highC: 20, lowC: 13, rainChance: 10, summary: 'Crisp departure day' }
    ]
  },
  budgetBreakdown: {
    total: 4200,
    currency: 'USD',
    categories: {
      transportation: { estimated: 1400, planned: 1350, description: 'Roundtrip flights SFO to NRT/HND' },
      hotels: { estimated: 1300, planned: 1250, description: 'Boutique hotel in Shinjuku/Ginza (5 nights)' },
      food: { estimated: 650, planned: 600, description: 'Ramen, izakayas, matcha treats & omakase' },
      localTransport: { estimated: 180, planned: 160, description: 'Tokyo Metro Pass, Suica card & Keisei Skyliner' },
      activities: { estimated: 290, planned: 280, description: 'teamLab Borderless, Skytree, Shibuya Sky & temple entries' },
      shopping: { estimated: 200, planned: 200, description: 'Ceramics, Japanese stationery & souvenirs' },
      emergencyFund: { estimated: 120, planned: 120, description: 'Buffer for unforeseen medical or travel delays' },
      miscellaneous: { estimated: 60, planned: 60, description: 'Pocket Wi-Fi eSIM & luggage storage' }
    },
    expenses: [
      { id: 'exp-1', category: 'transportation', title: 'Roundtrip SFO - HND Flight', amount: 1350, date: '2026-10-01', notes: 'Booked with ANA' },
      { id: 'exp-2', category: 'hotels', title: 'Hotel Gracery Shinjuku Deposit', amount: 650, date: '2026-10-02', notes: 'First 3 nights' },
      { id: 'exp-3', category: 'activities', title: 'teamLab Planets tickets (2)', amount: 64, date: '2026-10-04', notes: 'Reserved for Day 2 morning' },
      { id: 'exp-4', category: 'miscellaneous', title: '7-Day Unlimited eSIM Data', amount: 28, date: '2026-10-05', notes: 'Ubigi eSIM' }
    ]
  },
  transportationOptions: [
    {
      id: 'trans-tokyo-1',
      type: 'Flight',
      title: 'Nonstop Flight: SFO ➔ Tokyo Haneda (HND)',
      provider: 'All Nippon Airways (ANA) / Japan Airlines',
      duration: '11h 15m outbound, 9h 40m return',
      estimatedCost: 1350,
      details: 'Direct flight into Haneda Airport. Includes 2 checked bags (23kg each) & in-flight meals.',
      localTransfer: 'Tokyo Monorail to Hamamatsucho Station (14 mins, $4.50) or Limousine Bus to Shinjuku ($9.00).',
      returnJourney: 'Depart HND Terminal 3 at 17:30. Monorail check-in opens 3 hours prior.',
      isPreferred: true,
      bookingRef: 'NH-871'
    },
    {
      id: 'trans-tokyo-2',
      type: 'Flight',
      title: '1-Stop Flight via Honolulu: SFO ➔ Narita (NRT)',
      provider: 'Hawaiian Airlines',
      duration: '14h 20m',
      estimatedCost: 1080,
      details: 'Budget-friendly alternative with a 2h layover in Honolulu.',
      localTransfer: 'Keisei Skyliner Express train into Ueno Station (41 mins, $18).',
      returnJourney: 'Depart Narita Terminal 1 at 19:40.',
      isPreferred: false
    }
  ],
  hotelOptions: [
    {
      id: 'hotel-tokyo-1',
      name: 'The Blossom Hibiya / Hotel Gracery',
      type: 'Boutique Hotel',
      rating: 4.85,
      costPerNight: 250,
      location: 'Hibiya / Shinjuku Central',
      coordinates: { lat: 35.6698, lng: 139.7561 },
      amenities: ['Panoramic Skyline Views', 'Complimentary High-Speed Wi-Fi', 'Rainfall Showers', 'Subway Direct Access', 'Currency Exchange'],
      description: 'Sophisticated modern sanctuary towering over central Tokyo with immediate walk to imperial gardens and JR transit.',
      isSelected: true,
      rooms: 1,
      guests: 2,
      bookingConfirmation: 'HTL-TYO-94819'
    },
    {
      id: 'hotel-tokyo-2',
      name: 'Trunk (Hotel) Shibuya',
      type: 'Boutique Eco-Lodge',
      rating: 4.7,
      costPerNight: 310,
      location: 'Jingumae, Shibuya',
      coordinates: { lat: 35.6644, lng: 139.7042 },
      amenities: ['Artisan Coffee Bar', 'Bicycle Rentals', 'Organic Toiletries', 'Terrace Garden'],
      description: 'Hip, design-forward social hub situated between Shibuya and Harajuku fashion lanes.',
      isSelected: false
    }
  ],
  itinerary: [
    {
      dayNumber: 1,
      title: 'Arrival & Neon Shinjuku Horizon',
      theme: 'City Orientation & Golden Gai',
      area: 'Shinjuku & Omoide Yokocho',
      estimatedDayCost: 55,
      morning: {
        time: '10:00 AM',
        activity: 'Touchdown at Haneda, pick up Suica transit card, and drop bags at hotel',
        location: 'Haneda Airport / Shinjuku',
        coordinates: { lat: 35.5494, lng: 139.7798 },
        cost: 15,
        tips: 'Get the digital Welcome Suica on Apple Wallet or pick up a physical card at airport station.'
      },
      breakfast: {
        name: 'Dean & Deluca Cafe Shinjuku',
        specialty: 'Matcha lattes and warm brioche buns',
        estimatedCost: 10
      },
      lunch: {
        name: 'Fuunji Ramen',
        specialty: 'Creamy dipping tsukemen noodles with rich chicken & fish broth',
        estimatedCost: 14
      },
      afternoon: {
        time: '02:30 PM',
        activity: 'Ascend Tokyo Metropolitan Government Building Observatory for 360-degree skyline views',
        location: 'Tokyo Metropolitan Govt Building',
        coordinates: { lat: 35.6896, lng: 139.6921 },
        cost: 0,
        tips: 'Admission is free; on clear days you can gaze at Mount Fuji in the west!'
      },
      evening: {
        time: '06:30 PM',
        activity: 'Stroll through glowing neon alleyways of Omoide Yokocho and Golden Gai',
        location: 'Shinjuku Golden Gai',
        coordinates: { lat: 35.6942, lng: 139.7047 },
        cost: 20,
        tips: 'Small bars have 4-6 seats and may charge a small cover fee ($5-$8).'
      },
      dinner: {
        name: 'Kushiyaki Nonki Shinjuku',
        specialty: 'Charcoal-grilled yakitori skewers and draft Suntory Highballs',
        estimatedCost: 28
      },
      transitNotes: 'Take the Yamanote Line or walk within 15 minutes across Shinjuku.',
      estimatedLocalTransitCost: 6
    },
    {
      dayNumber: 2,
      title: 'Digital Dreams & Waterfront Odaiba',
      theme: 'Art, Technology & Tokyo Bay',
      area: 'Toyosu & Odaiba',
      estimatedDayCost: 95,
      morning: {
        time: '09:30 AM',
        activity: 'Immerse in teamLab Planets interactive barefoot digital art exhibition',
        location: 'teamLab Planets Toyosu',
        coordinates: { lat: 35.6517, lng: 139.7897 },
        cost: 32,
        tips: 'Wear pants that can be rolled up above the knees, as you will wade through warm water installations.'
      },
      breakfast: {
        name: 'Uogashi Shokudo Toyosu',
        specialty: 'Fresh salmon roe & tuna chirashi breakfast bowls',
        estimatedCost: 18
      },
      lunch: {
        name: 'Tonkatsu Tonki Odaiba',
        specialty: 'Crispy panko Berkshire pork cutlet with shredded cabbage',
        estimatedCost: 20
      },
      afternoon: {
        time: '02:00 PM',
        activity: 'Explore Miraikan Museum of Emerging Science and photograph the life-sized Unicorn Gundam statue',
        location: 'Odaiba Waterfront',
        coordinates: { lat: 35.6244, lng: 139.7756 },
        cost: 12,
        tips: 'Watch the Unicorn Gundam transformation show at 15:00 and 17:00.'
      },
      evening: {
        time: '06:00 PM',
        activity: 'Catch Yurikamome elevated driverless monorail over Rainbow Bridge at dusk',
        location: 'Rainbow Bridge Observation Promenade',
        coordinates: { lat: 35.6366, lng: 139.7631 },
        cost: 5,
        tips: 'Sit in the very front row of the train for unobstructed roller-coaster city views.'
      },
      dinner: {
        name: 'Gonpachi Nishi-Azabu (Kill Bill Restaurant)',
        specialty: 'Fresh hand-pounded soba noodles and grilled wagyu beef skewers',
        estimatedCost: 40
      },
      transitNotes: 'Take Yurikamome automated monorail between Toyosu and Odaiba.',
      estimatedLocalTransitCost: 8
    },
    {
      dayNumber: 3,
      title: 'Ancient Zen & Old Edo Heritage',
      theme: 'Temples, Teahouses & Artisan Crafts',
      area: 'Asakusa & Ueno',
      estimatedDayCost: 60,
      morning: {
        time: '08:30 AM',
        activity: 'Pass through the iconic Thunder Gate (Kaminarimon) to visit Senso-ji, Tokyo’s oldest temple',
        location: 'Senso-ji Temple, Asakusa',
        coordinates: { lat: 35.7148, lng: 139.7967 },
        cost: 0,
        tips: 'Arrive before 9 AM to experience the peaceful incense ceremonies before tour crowds arrive.'
      },
      breakfast: {
        name: 'Asakusa Kagetsudo',
        specialty: 'Freshly baked jumbo melonpan with crispy crust and matcha gelato',
        estimatedCost: 7
      },
      lunch: {
        name: 'Daikokuya Tempura',
        specialty: 'Historic dark sesame-oil tempura bowl served over rice since 1887',
        estimatedCost: 22
      },
      afternoon: {
        time: '01:30 PM',
        activity: 'Browse traditional pottery along Kappabashi Kitchenware Street and walk Ueno Toshogu Shrine',
        location: 'Kappabashi Dougu Street',
        coordinates: { lat: 35.7135, lng: 139.7892 },
        cost: 15,
        tips: 'Fantastic place to buy authentic Japanese santoku chef knives with custom name engraving.'
      },
      evening: {
        time: '05:30 PM',
        activity: 'Tokyo Skytree Tembo Deck sunset viewing over the Kanto Plain',
        location: 'Tokyo Skytree',
        coordinates: { lat: 35.7101, lng: 139.8107 },
        cost: 21,
        tips: 'Book fast-track twilight ticket online to skip the main queue.'
      },
      dinner: {
        name: 'Monja Kura Tsukishima',
        specialty: 'Traditional Tokyo-style savory monjayaki pan-cooked at your table',
        estimatedCost: 24
      },
      transitNotes: 'Ginza Subway Line connects Asakusa and Ueno directly in 5 minutes.',
      estimatedLocalTransitCost: 7
    },
    {
      dayNumber: 4,
      title: 'Youth Culture, Shrines & Shibuya Scramble',
      theme: 'Pop Culture, Serenity & Neon Crossings',
      area: 'Harajuku, Omotesando & Shibuya',
      estimatedDayCost: 75,
      morning: {
        time: '09:00 AM',
        activity: 'Walk beneath towering cedar trees into the tranquil sacred forest of Meiji Jingu Shrine',
        location: 'Meiji Shrine, Shibuya',
        coordinates: { lat: 35.6764, lng: 139.6993 },
        cost: 0,
        tips: 'Write a wish on an Ema wooden tablet and hang it beneath the sacred camphor trees.'
      },
      breakfast: {
        name: 'Chatei Hatou Kissaten',
        specialty: 'Artisanal hand-drip charcoal-roasted coffee and chiffon cake',
        estimatedCost: 12
      },
      lunch: {
        name: 'Afuri Harajuku',
        specialty: 'Light, citrusy Yuzu Shio ramen with charcoal-grilled chashu',
        estimatedCost: 15
      },
      afternoon: {
        time: '01:30 PM',
        activity: 'Explore vibrant vintage boutiques in Takeshita Street and architectural flagships on Omotesando',
        location: 'Omotesando & Cat Street',
        coordinates: { lat: 35.6672, lng: 139.7065 },
        cost: 20,
        tips: 'Cat Street has the best independent denim shops, matcha stalls, and sneaker boutiques.'
      },
      evening: {
        time: '05:45 PM',
        activity: 'Stand atop Shibuya Sky open-air rooftop observatory and watch the world-famous Shibuya Scramble',
        location: 'Shibuya Sky Rooftop',
        coordinates: { lat: 35.6591, lng: 139.7016 },
        cost: 22,
        tips: 'Rooftop ticket includes glass corner photo deck. Lock all loose items in lockers before entry.'
      },
      dinner: {
        name: 'Uobei Conveyor Belt Sushi Shibuya',
        specialty: 'High-speed bullet train conveyor belt sushi ordered via tablet',
        estimatedCost: 22
      },
      transitNotes: 'Scenic 25-minute gentle walk down Cat Street connects Harajuku directly to Shibuya.',
      estimatedLocalTransitCost: 4
    },
    {
      dayNumber: 5,
      title: 'Artisan Coffee, Vintage Vinyl & Ginza Glamour',
      theme: 'Bohemian Neighborhoods & High Elegance',
      area: 'Shimokitazawa & Ginza',
      estimatedDayCost: 85,
      morning: {
        time: '09:30 AM',
        activity: 'Wander the cozy pedestrian alleyways and record shops of bohemian Shimokitazawa',
        location: 'Shimokitazawa Vintage District',
        coordinates: { lat: 35.6612, lng: 139.6667 },
        cost: 15,
        tips: 'Shops open around 10:30-11:00 AM; perfect for enjoying slow pour-over coffee first.'
      },
      breakfast: {
        name: 'Bear Pond Espresso',
        specialty: 'Legendary Angel Stain espresso shot and cinnamon pastries',
        estimatedCost: 9
      },
      lunch: {
        name: 'Rojiura Curry Samurai',
        specialty: 'Hokkaido-style rich soup curry packed with 20 flash-fried mountain vegetables',
        estimatedCost: 18
      },
      afternoon: {
        time: '02:30 PM',
        activity: 'Explore Ginza Six rooftop garden, multi-story stationery palace Itoya, and Kabukiza Theater',
        location: 'Ginza Chuo-dori',
        coordinates: { lat: 35.6719, lng: 139.7648 },
        cost: 10,
        tips: 'On weekends, Ginza’s main boulevard is closed to cars and becomes a pedestrian paradise.'
      },
      evening: {
        time: '06:30 PM',
        activity: 'Cocktail tasting at a master speakeasy cocktail laboratory',
        location: 'Bar High Five or Tender Bar Ginza',
        coordinates: { lat: 35.6695, lng: 139.7621 },
        cost: 35,
        tips: 'World-renowned ice-carving techniques and bespoke cocktails crafted to your flavor preferences.'
      },
      dinner: {
        name: 'Ginza Kagari Soba',
        specialty: 'Michelin Bib Gourmand Toripaitan chicken broth ramen with seasonal vegetables',
        estimatedCost: 20
      },
      transitNotes: 'Keio Inokashira Line to Shibuya, then Tokyo Metro Ginza Line to Ginza.',
      estimatedLocalTransitCost: 8
    },
    {
      dayNumber: 6,
      title: 'Imperial Gardens & Final Souvenir Stroll',
      theme: 'Tranquil Gardens & Farewell Feast',
      area: 'Marunouchi & Tokyo Station',
      estimatedDayCost: 50,
      morning: {
        time: '09:00 AM',
        activity: 'Peaceful morning stroll through the East Gardens of the Imperial Palace and Nijubashi Bridge',
        location: 'Tokyo Imperial Palace Gardens',
        coordinates: { lat: 35.6852, lng: 139.7528 },
        cost: 0,
        tips: 'Pick up free entry token at Otemon Gate; don’t miss the Ninomaru Japanese garden.'
      },
      breakfast: {
        name: 'The Tokyo Station Hotel Lobby Lounge',
        specialty: 'Japanese royal breakfast set and organic Darjeeling tea',
        estimatedCost: 22
      },
      lunch: {
        name: 'Tokyo Ramen Street (Station B1)',
        specialty: 'Rokurinsha legendary rich seafood tsukemen',
        estimatedCost: 16
      },
      afternoon: {
        time: '01:30 PM',
        activity: 'Pick up Tokyo Banana treats, matcha KitKats, and bento boxes at Tokyo Station Character Street',
        location: 'Tokyo Station Ichiban-gai',
        coordinates: { lat: 35.6812, lng: 139.7671 },
        cost: 25,
        tips: 'Tax-free counter available inside the station for purchases over 5,000 JPY.'
      },
      evening: {
        time: '04:30 PM',
        activity: 'Board express monorail to Haneda Airport for outbound departure flight',
        location: 'Haneda International Departure Gate',
        coordinates: { lat: 35.5494, lng: 139.7798 },
        cost: 8,
        tips: 'Complete duty-free shopping and return any pocket Wi-Fi units at terminal drop boxes.'
      },
      dinner: {
        name: 'Haneda Edo Market Hall',
        specialty: 'Last bowl of hot udon tempura soup before boarding',
        estimatedCost: 18
      },
      transitNotes: 'Direct Tokyo Monorail or Keikyu Line from Shinagawa/Tokyo to Haneda (20 mins).',
      estimatedLocalTransitCost: 8
    }
  ],
  attractionClusters: [
    {
      clusterName: 'Cluster 1: Shinjuku & Western Metropolis',
      description: 'Connected via Yamanote line; minimal transit required.',
      attractions: [
        { name: 'Tokyo Metropolitan Govt Building', lat: 35.6896, lng: 139.6921, day: 1, type: 'Observation' },
        { name: 'Omoide Yokocho & Golden Gai', lat: 35.6942, lng: 139.7047, day: 1, type: 'Nightlife' },
        { name: 'Meiji Jingu Shrine', lat: 35.6764, lng: 139.6993, day: 4, type: 'Cultural' },
        { name: 'Shibuya Scramble & Sky', lat: 35.6591, lng: 139.7016, day: 4, type: 'Landmark' }
      ]
    },
    {
      clusterName: 'Cluster 2: Historic Asakusa & Ueno Heritage',
      description: 'Northeastern traditional quarter; great walkability.',
      attractions: [
        { name: 'Senso-ji Temple', lat: 35.7148, lng: 139.7967, day: 3, type: 'Temple' },
        { name: 'Kappabashi Street', lat: 35.7135, lng: 139.7892, day: 3, type: 'Shopping' },
        { name: 'Tokyo Skytree', lat: 35.7101, lng: 139.8107, day: 3, type: 'Observation' }
      ]
    },
    {
      clusterName: 'Cluster 3: Tokyo Bay & Toyosu Waterfront',
      description: 'Modern reclaimed islands linked by automated monorail.',
      attractions: [
        { name: 'teamLab Planets Toyosu', lat: 35.6517, lng: 139.7897, day: 2, type: 'Art & Tech' },
        { name: 'Odaiba Gundam & Seaside', lat: 35.6244, lng: 139.7756, day: 2, type: 'Scenic' }
      ]
    },
    {
      clusterName: 'Cluster 4: Central Ginza & Imperial Gardens',
      description: 'Prestigious historic center and palaces.',
      attractions: [
        { name: 'East Gardens of Imperial Palace', lat: 35.6852, lng: 139.7528, day: 6, type: 'Historic' },
        { name: 'Ginza Chuo Boulevard', lat: 35.6719, lng: 139.7648, day: 5, type: 'Luxury Shopping' },
        { name: 'Tokyo Station Brick Terminal', lat: 35.6812, lng: 139.7671, day: 6, type: 'Architecture' }
      ]
    }
  ],
  packingList: [
    { id: 'p-1', category: 'Clothes', item: '4-5 breathable short & long sleeve shirts', checked: true, essential: true },
    { id: 'p-2', category: 'Clothes', item: '2 pairs comfortable trousers/chinos with stretch', checked: true, essential: true },
    { id: 'p-3', category: 'Clothes', item: 'Packable light waterproof jacket or trench coat', checked: false, essential: true },
    { id: 'p-4', category: 'Clothes', item: 'Easily slip-on walking shoes (for temple shoes-off rules)', checked: false, essential: true },
    { id: 'p-5', category: 'Clothes', item: '6 pairs clean, hole-free socks (shoes come off frequently)', checked: true, essential: true },
    { id: 'p-6', category: 'Toiletries', item: 'Travel size sunscreen SPF 50 & facial lotion', checked: false },
    { id: 'p-7', category: 'Toiletries', item: 'Compact travel hand towel / handkerchief (public restrooms often lack hand dryers)', checked: true, essential: true },
    { id: 'p-8', category: 'Toiletries', item: 'Pocket hand sanitizer & lip balm', checked: false },
    { id: 'p-9', category: 'Electronics', item: '10,000mAh portable power bank for daily phone navigation', checked: true, essential: true },
    { id: 'p-10', category: 'Electronics', item: 'Japan Type A 2-prong ungrounded plug adapter', checked: true, essential: true },
    { id: 'p-11', category: 'Electronics', item: 'Noise-canceling wireless headphones for long flight', checked: false },
    { id: 'p-12', category: 'Documents', item: 'Passport valid at least 6 months past return date', checked: true, essential: true },
    { id: 'p-13', category: 'Documents', item: 'Visit Japan Web QR code generated for fast customs/immigration', checked: true, essential: true },
    { id: 'p-14', category: 'Documents', item: 'Copy of hotel reservations and emergency contact sheet', checked: false },
    { id: 'p-15', category: 'Medicines', item: 'Personal prescription meds in original labeled bottles', checked: true, essential: true },
    { id: 'p-16', category: 'Medicines', item: 'Band-aids & blister prevention cushions for 18,000 steps/day', checked: false, essential: true },
    { id: 'p-17', category: 'Medicines', item: 'Antacid tablets and ibuprofen', checked: false },
    { id: 'p-18', category: 'Travel accessories', item: 'Small coin purse (Japan uses 1, 5, 10, 50, 100, 500 yen coins)', checked: false, essential: true },
    { id: 'p-19', category: 'Travel accessories', item: 'Compact foldable umbrella', checked: false },
    { id: 'p-20', category: 'Special items', item: 'Goshuincho stamp book (for temple & shrine calligraphy stamps)', checked: false }
  ],
  documents: [
    { id: 'doc-1', title: 'Passport (Valid 6+ Months)', status: 'ready', requirement: 'Must have at least 2 blank visa pages and 6 months validity.', notes: 'Expires Nov 2029' },
    { id: 'doc-2', title: 'Visit Japan Web Fast-Track Registration', status: 'ready', requirement: 'Complete customs and immigration online forms prior to boarding to receive entry QR codes.', notes: 'QR saved to phone photos' },
    { id: 'doc-3', title: 'Airline E-Tickets (ANA SFO-HND)', status: 'ready', requirement: 'Electronic boarding confirmation with barcode.', notes: 'Flight NH871 Confirmation #K89YTP' },
    { id: 'doc-4', title: 'Hotel Booking Confirmation Voucher', status: 'ready', requirement: 'Printed or saved digital voucher showing hotel phone and address in Japanese.', notes: 'Gracery Shinjuku, booking #94819' },
    { id: 'doc-5', title: 'Comprehensive Travel & Medical Insurance', status: 'ready', requirement: 'Policy covering emergency medical evacuation up to $100k+.', notes: 'Allianz Global Care Policy #ALZ-9938' },
    { id: 'doc-6', title: 'No-Fee International Credit/Debit Card', status: 'check', requirement: 'Ensure 0% foreign transaction fees and notify bank of travel.', notes: 'Notify Chase / Schwab before flight' }
  ],
  foodGuide: {
    foodPreference: 'Balanced & Local',
    dailyFoodBudgetEstimate: 50,
    signatureDishes: [
      { name: 'Edomae Sushi', description: 'Fresh vinegar-seasoned rice topped with caught-that-morning sashimi.', priceRange: '$$ - $$$$' },
      { name: 'Tonkotsu / Tsukemen Ramen', description: 'Rich, collagen-rich broth with firm wheat noodles and melted pork belly.', priceRange: '$' },
      { name: 'Charcoal Yakitori', description: 'Succulent chicken thighs and scallions glazed in savory tare glaze.', priceRange: '$$' },
      { name: 'Monjayaki & Okonomiyaki', description: 'Savory cabbage pancake griddled hot on an iron teppan grill.', priceRange: '$$' },
      { name: 'Matcha Soft Cream & Parfaits', description: 'Uji green tea ice cream topped with red bean paste and chewy mochi.', priceRange: '$' }
    ],
    diningTips: 'No tipping is accepted in Japan—excellent service is standard. Slurping noodles is considered a compliment to the chef! Stand-and-eat stalls expect you to eat in front of the shop rather than walking down the street.',
    recommendedSpots: [
      { name: 'Fuunji', type: 'Casual Tsukemen', neighborhood: 'Shinjuku', price: '$' },
      { name: 'Daikokuya', type: 'Historic Tempura', neighborhood: 'Asakusa', price: '$$' },
      { name: 'Afuri', type: 'Citrus Yuzu Ramen', neighborhood: 'Harajuku', price: '$' },
      { name: 'Ginza Kagari', type: 'Tori Paitan Ramen', neighborhood: 'Ginza', price: '$$' },
      { name: 'Kushiyaki Nonki', type: 'Izakaya Skewers', neighborhood: 'Yotsuya', price: '$$' }
    ]
  },
  safetyAndEmergency: {
    emergencyPhone: '110 (Police) / 119 (Fire & Ambulance)',
    police: '110',
    ambulance: '119',
    nearestHospital: 'St. Luke’s International Hospital (English spoken: +81 3-3541-5151)',
    safetyTips: [
      'Tokyo is one of the safest cities in the world, with minimal street crime.',
      'In the rare event of an earthquake, stay calm, protect your head under a sturdy desk or table, and follow train staff instructions.',
      'Keep your passport with you at all times as required by Japanese national immigration law.',
      'Tap water in Tokyo is completely safe and delicious to drink.'
    ]
  },
  reminders: [
    'Reserve teamLab Borderless / Planets at least 2 weeks in advance.',
    'Notify bank cards for international usage in Japan.',
    'Download Google Translate with offline Japanese language pack.',
    'Suica card can be reloaded with cash at any 7-Eleven ATM.'
  ]
};

export const DEFAULT_PRESET_TRIPS: Record<string, Partial<TripPlan>> = {
  tokyo: DEFAULT_TRIP_TOKYO,
  paris: {
    id: 'trip-paris-demo',
    destination: 'Paris',
    startingLocation: 'New York (JFK)',
    country: 'France',
    title: 'Parisian Romance, Art & Gastronomy',
    summary: 'A 5-day voyage through timeless boulevards, iconic Impressionist galleries, quaint Marais bistros, and golden hour river cruises.',
    durationDays: 5,
    travelers: 2,
    adults: 2,
    children: 0,
    budget: 3800,
    currency: 'USD',
    travelStyle: 'Standard',
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  rome: {
    id: 'trip-rome-demo',
    destination: 'Rome',
    startingLocation: 'London (LHR)',
    country: 'Italy',
    title: 'Eternal Rome: Colosseum to Trastevere',
    summary: '4 unforgettable days exploring 2,000 years of antiquity, Vatican masterworks, authentic pasta carbonara, and Piazza sunsets.',
    durationDays: 4,
    travelers: 2,
    adults: 2,
    children: 0,
    budget: 2900,
    currency: 'EUR',
    travelStyle: 'Standard',
    coordinates: { lat: 41.9028, lng: 12.4964 }
  },
  bali: {
    id: 'trip-bali-demo',
    destination: 'Bali',
    startingLocation: 'Sydney (SYD)',
    country: 'Indonesia',
    title: 'Tropical Bali: Sacred Temples & Coastal Sunsets',
    summary: 'A 7-day tropical escape blending Ubud rainforest wellness, sacred waterfalls, lush rice terraces, and Uluwatu cliffside dining.',
    durationDays: 7,
    travelers: 2,
    adults: 2,
    children: 0,
    budget: 3200,
    currency: 'USD',
    travelStyle: 'Standard',
    coordinates: { lat: -8.4095, lng: 115.1889 }
  }
};
