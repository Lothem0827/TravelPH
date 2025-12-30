import { PROVINCE_IDS } from './ProvinceIds';

export interface ProvinceContent {
    id: string;
    subtext: string | null;
    whyLove: string[]; // 3 tags
    travelersGo: string[]; // 3 city names
    images: any[]; // array of asset paths (require) or URIs
}

export const PROVINCE_CONTENT: ProvinceContent[] = [
    {
        id: PROVINCE_IDS[0], // PH-TAR
        subtext: "Melting Pot of Cultures",
        whyLove: ["Historical Sites", "Rice Fields", "Aquino Heritage"],
        travelersGo: ["Tarlac City", "Capas", "Camiling"],
        images: []
    },
    {
        id: PROVINCE_IDS[1], // PH-ZMB
        subtext: "Beach Paradise & Adventure",
        whyLove: ["White Beaches", "Surfing", "Mountain Trails"],
        travelersGo: ["Subic", "San Antonio", "Iba"],
        images: []
    },
    {
        id: PROVINCE_IDS[2], // PH-ABR
        subtext: "Sleeping Beauty",
        whyLove: ["Mountains", "Indigenous Culture", "Trekking"],
        travelersGo: ["Bangued", "Tayum", "Lagayan"],
        images: []
    },
    {
        id: PROVINCE_IDS[3], // PH-APA
        subtext: "Last Frontier",
        whyLove: ["Pristine Nature", "Tribal Culture", "Waterfalls"],
        travelersGo: ["Luna", "Kabugao", "Calanasan"],
        images: []
    },
    {
        id: PROVINCE_IDS[4], // PH-AUR
        subtext: "Surfing Haven",
        whyLove: ["Surfing", "Waterfalls", "Pristine Beaches"],
        travelersGo: ["Baler", "Dingalan", "Casiguran"],
        images: []
    },
    {
        id: PROVINCE_IDS[5], // PH-BAN
        subtext: "Valor & History",
        whyLove: ["WWII Sites", "Mt. Samat", "Beaches"],
        travelersGo: ["Balanga", "Mariveles", "Bagac"],
        images: []
    },
    {
        id: PROVINCE_IDS[6], // PH-BTN
        subtext: "Home of the Winds",
        whyLove: ["Rolling Hills", "Stone Houses", "Scenic Views"],
        travelersGo: ["Basco", "Sabtang", "Itbayat"],
        images: []
    },
    {
        id: PROVINCE_IDS[7], // PH-BEN
        subtext: "Salad Bowl",
        whyLove: ["Cool Climate", "Strawberries", "Pine Trees"],
        travelersGo: ["Baguio", "La Trinidad", "Itogon"],
        images: []
    },
    {
        id: PROVINCE_IDS[8], // PH-BUL
        subtext: "Gateway to the North",
        whyLove: ["Historical Churches", "Festivals", "Heritage Sites"],
        travelersGo: ["Malolos", "Baliwag", "San Miguel"],
        images: []
    },
    {
        id: PROVINCE_IDS[9], // PH-CAG
        subtext: "Valley of Adventures",
        whyLove: ["Beaches", "Caves", "River Rafting"],
        travelersGo: ["Tuguegarao", "Santa Ana", "Claveria"],
        images: []
    },
    {
        id: PROVINCE_IDS[10], // PH-IFU
        subtext: "Rice Terraces Wonder",
        whyLove: ["Banaue Terraces", "Indigenous Culture", "Hiking"],
        travelersGo: ["Banaue", "Batad", "Hungduan"],
        images: []
    },
    {
        id: PROVINCE_IDS[11], // PH-ILN
        subtext: "Land of Windmills",
        whyLove: ["Sand Dunes", "Spanish Heritage", "Windmills"],
        travelersGo: ["Laoag", "Pagudpud", "Paoay"],
        images: []
    },
    {
        id: PROVINCE_IDS[12], // PH-ILS
        subtext: "Heritage Heartland",
        whyLove: ["Vigan Heritage", "Cobblestone Streets", "Pottery"],
        travelersGo: ["Vigan", "Santa Maria", "Candon"],
        images: []
    },
    {
        id: PROVINCE_IDS[13], // PH-ISA
        subtext: "Corn Capital",
        whyLove: ["Waterfalls", "Caves", "Nature Parks"],
        travelersGo: ["Ilagan", "Cauayan", "Santiago"],
        images: []
    },
    {
        id: PROVINCE_IDS[14], // PH-KAL
        subtext: "Warrior Province",
        whyLove: ["Tribal Tattoos", "Mountains", "Culture"],
        travelersGo: ["Tabuk", "Tinglayan", "Balbalan"],
        images: []
    },
    {
        id: PROVINCE_IDS[15], // PH-LUN
        subtext: "Surfing Capital",
        whyLove: ["Surfing", "Beaches", "Grape Harvest"],
        travelersGo: ["San Juan", "Bauang", "San Fernando"],
        images: []
    },
    {
        id: PROVINCE_IDS[16], // PH-MOU
        subtext: "Hanging Coffins",
        whyLove: ["Sagada Caves", "Hanging Coffins", "Cool Climate"],
        travelersGo: ["Sagada", "Bontoc", "Besao"],
        images: []
    },
    {
        id: PROVINCE_IDS[17], // PH-NUE
        subtext: "Rice Granary",
        whyLove: ["Rice Terraces", "Waterfalls", "Farm Tourism"],
        travelersGo: ["Cabanatuan", "Gapan", "San Jose"],
        images: []
    },
    {
        id: PROVINCE_IDS[18], // PH-NUV
        subtext: "Nature's Sanctuary",
        whyLove: ["Mountains", "Waterfalls", "Cool Climate"],
        travelersGo: ["Bayombong", "Solano", "Bambang"],
        images: []
    },
    {
        id: PROVINCE_IDS[19], // PH-PAM
        subtext: "Culinary Capital",
        whyLove: ["Sisig", "Giant Lanterns", "Food Heritage"],
        travelersGo: ["Angeles City", "San Fernando", "Mabalacat"],
        images: []
    },
    {
        id: PROVINCE_IDS[20], // PH-PAN
        subtext: "Hundred Islands",
        whyLove: ["Island Hopping", "Beaches", "Seafood"],
        travelersGo: ["Alaminos", "Bolinao", "Dagupan"],
        images: []
    },
    {
        id: PROVINCE_IDS[21], // PH-QUI
        subtext: "Forest Sanctuary",
        whyLove: ["Waterfalls", "Forests", "Eco-Tourism"],
        travelersGo: ["Cabarroguis", "Maddela", "Aglipay"],
        images: []
    },
    {
        id: PROVINCE_IDS[22], // PH-ALB
        subtext: "Mayon Volcano",
        whyLove: ["Perfect Cone", "Spicy Food", "Adventure"],
        travelersGo: ["Legazpi", "Daraga", "Camalig"],
        images: []
    },
    {
        id: PROVINCE_IDS[23], // PH-BTG
        subtext: "Dive Capital",
        whyLove: ["Diving", "Beaches", "Taal Volcano"],
        travelersGo: ["Batangas City", "Nasugbu", "Mabini"],
        images: []
    },
    {
        id: PROVINCE_IDS[24], // PH-CAN
        subtext: "Pineapple Paradise",
        whyLove: ["Beaches", "Pineapples", "Islands"],
        travelersGo: ["Daet", "Mercedes", "Basud"],
        images: []
    },
    {
        id: PROVINCE_IDS[25], // PH-CAS
        subtext: "Wakeboarding Capital",
        whyLove: ["CWC", "Beaches", "Whale Sharks"],
        travelersGo: ["Naga", "Pili", "Caramoan"],
        images: []
    },
    {
        id: PROVINCE_IDS[26], // PH-CAT
        subtext: "Happy Island",
        whyLove: ["Surfing", "Beaches", "Laid-back Vibe"],
        travelersGo: ["Virac", "Baras", "Puraran"],
        images: []
    },
    {
        id: PROVINCE_IDS[27], // PH-CAV
        subtext: "Historical Cradle",
        whyLove: ["Coffee", "Historical Sites", "Tagaytay Views"],
        travelersGo: ["Tagaytay", "Cavite City", "Trece Martires"],
        images: []
    },
    {
        id: PROVINCE_IDS[28], // PH-LAG
        subtext: "Hot Springs Haven",
        whyLove: ["Hot Springs", "Waterfalls", "Lake Views"],
        travelersGo: ["Los Baños", "Calamba", "Pagsanjan"],
        images: []
    },
    {
        id: PROVINCE_IDS[29], // PH-MAD
        subtext: "Heart of the Philippines",
        whyLove: ["Moriones Festival", "Beaches", "Caves"],
        travelersGo: ["Boac", "Gasan", "Mogpog"],
        images: []
    },
    {
        id: PROVINCE_IDS[30], // PH-MAS
        subtext: "Rodeo Capital",
        whyLove: ["Rodeo", "Beaches", "Island Hopping"],
        travelersGo: ["Masbate City", "Ticao", "Burias"],
        images: []
    },
    {
        id: PROVINCE_IDS[31], // PH-MNL
        subtext: "Pearl of the Orient",
        whyLove: ["Urban Life", "Shopping", "Nightlife"],
        travelersGo: ["Makati", "BGC", "Manila"],
        images: []
    },
    {
        id: PROVINCE_IDS[32], // PH-QUE
        subtext: "Coconut Capital",
        whyLove: ["Islands", "Beaches", "Festivals"],
        travelersGo: ["Lucena", "Pagbilao", "Tayabas"],
        images: []
    },
    {
        id: PROVINCE_IDS[33], // PH-RIZ
        subtext: "Art Capital",
        whyLove: ["Art Scene", "Waterfalls", "Nature Parks"],
        travelersGo: ["Antipolo", "Tanay", "Angono"],
        images: []
    },
    {
        id: PROVINCE_IDS[34], // PH-SOR
        subtext: "Whale Shark Capital",
        whyLove: ["Whale Sharks", "Surfing", "Firefly Watching"],
        travelersGo: ["Donsol", "Sorsogon City", "Matnog"],
        images: []
    },
    {
        id: PROVINCE_IDS[35], // PH-AKL
        subtext: "Boracay Paradise",
        whyLove: ["Boracay", "White Beach", "Island Life"],
        travelersGo: ["Boracay", "Kalibo", "Caticlan"],
        images: []
    },
    {
        id: PROVINCE_IDS[36], // PH-ANT
        subtext: "Land of Mountains",
        whyLove: ["Mountains", "Beaches", "Kawa Hot Bath"],
        travelersGo: ["San Jose", "Culasi", "Tibiao"],
        images: []
    },
    {
        id: PROVINCE_IDS[37], // PH-BIL
        subtext: "Island of Fire",
        whyLove: ["Beaches", "Diving", "Seafood"],
        travelersGo: ["Naval", "Almeria", "Kawayan"],
        images: []
    },
    {
        id: PROVINCE_IDS[38], // PH-BOH
        subtext: "Chocolate Hills",
        whyLove: ["Chocolate Hills", "Tarsiers", "Beaches"],
        travelersGo: ["Panglao", "Tagbilaran", "Loboc"],
        images: []
    },
    {
        id: PROVINCE_IDS[39], // PH-CAP
        subtext: "Seafood Capital",
        whyLove: ["Seafood", "Festivals", "Island Hopping"],
        travelersGo: ["Roxas City", "Panay", "Pilar"],
        images: []
    },
    {
        id: PROVINCE_IDS[40], // PH-CEB
        subtext: "Queen City of the South",
        whyLove: ["Lechon", "Beaches", "Diving"],
        travelersGo: ["Cebu City", "Moalboal", "Oslob"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[41], // PH-EAS
        subtext: "Surfing Paradise",
        whyLove: ["Surfing", "Caves", "Waterfalls"],
        travelersGo: ["Borongan", "Guiuan", "Sulat"],
        images: []
    },
    {
        id: PROVINCE_IDS[42], // PH-GUI
        subtext: "Mango Paradise",
        whyLove: ["Mangoes", "Beaches", "Trappist Monastery"],
        travelersGo: ["Jordan", "Nueva Valencia", "San Lorenzo"],
        images: []
    },
    {
        id: PROVINCE_IDS[43], // PH-ILI
        subtext: "City of Love",
        whyLove: ["Heritage Sites", "Food Scene", "Festivals"],
        travelersGo: ["Iloilo City", "Miagao", "Guimbal"],
        images: []
    },
    {
        id: PROVINCE_IDS[44], // PH-LEY
        subtext: "MacArthur Landing",
        whyLove: ["WWII History", "Beaches", "Diving"],
        travelersGo: ["Tacloban", "Ormoc", "Palo"],
        images: []
    },
    {
        id: PROVINCE_IDS[45], // PH-MAS_2
        subtext: "Rodeo Capital",
        whyLove: ["Rodeo", "Beaches", "Island Hopping"],
        travelersGo: ["Masbate City", "Ticao", "Burias"],
        images: []
    },
    {
        id: PROVINCE_IDS[46], // PH-NEC
        subtext: "Sugar Bowl",
        whyLove: ["Ruins", "Sugar Heritage", "Festivals"],
        travelersGo: ["Bacolod", "Silay", "Talisay"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[47], // PH-NER
        subtext: "Gentle People",
        whyLove: ["Diving", "Dolphins", "Waterfalls"],
        travelersGo: ["Dumaguete", "Apo Island", "Siquijor"],
        images: []
    },
    {
        id: PROVINCE_IDS[48], // PH-NSA
        subtext: "Adventure Awaits",
        whyLove: ["Surfing", "Caves", "Waterfalls"],
        travelersGo: ["Catarman", "Allen", "Biri"],
        images: []
    },
    {
        id: PROVINCE_IDS[49], // PH-MDC
        subtext: "Wild West",
        whyLove: ["Beaches", "Diving", "Island Life"],
        travelersGo: ["Mamburao", "Sablayan", "San Jose"],
        images: []
    },
    {
        id: PROVINCE_IDS[50], // PH-MDR
        subtext: "Island Paradise",
        whyLove: ["Puerto Galera", "Diving", "White Beaches"],
        travelersGo: ["Puerto Galera", "Calapan", "Roxas"],
        images: []
    },
    {
        id: PROVINCE_IDS[51], // PH-PLW
        subtext: "Last Frontier Paradise",
        whyLove: ["El Nido", "Underground River", "Island Hopping"],
        travelersGo: ["El Nido", "Coron", "Puerto Princesa"],
        images: []
    },
    {
        id: PROVINCE_IDS[52], // PH-ROM
        subtext: "Marble Capital",
        whyLove: ["Marble Crafts", "Islands", "Beaches"],
        travelersGo: ["Romblon", "Sibuyan", "Tablas"],
        images: []
    },
    {
        id: PROVINCE_IDS[53], // PH-WSA
        subtext: "Natural Wonders",
        whyLove: ["Caves", "Waterfalls", "Beaches"],
        travelersGo: ["Calbayog", "Catbalogan", "Basey"],
        images: []
    },
    {
        id: PROVINCE_IDS[54], // PH-SIG
        subtext: "Mystic Island",
        whyLove: ["Healing", "Beaches", "Waterfalls"],
        travelersGo: ["Siquijor Town", "San Juan", "Lazi"],
        images: []
    },
    {
        id: PROVINCE_IDS[55], // PH-SLE
        subtext: "Diving Haven",
        whyLove: ["Diving", "Whale Sharks", "Beaches"],
        travelersGo: ["Maasin", "Padre Burgos", "Pintuyan"],
        images: []
    },
    {
        id: PROVINCE_IDS[56], // PH-SUR
        subtext: "Enchanted River",
        whyLove: ["Enchanted River", "Diving", "Waterfalls"],
        travelersGo: ["Bislig", "Tandag", "Hinatuan"],
        images: []
    },
    {
        id: PROVINCE_IDS[57], // PH-TAW
        subtext: "Southernmost Province",
        whyLove: ["Islands", "Diving", "Sama Culture"],
        travelersGo: ["Bongao", "Simunul", "Sitangkai"],
        images: []
    },
    {
        id: PROVINCE_IDS[58], // PH-ZAN
        subtext: "Dapitan Heritage",
        whyLove: ["Rizal Shrine", "Beaches", "Waterfalls"],
        travelersGo: ["Dipolog", "Dapitan", "Polanco"],
        images: []
    },
    {
        id: PROVINCE_IDS[59], // PH-ZSI
        subtext: "Pearl Farm Paradise",
        whyLove: ["Pearl Farms", "Beaches", "Island Hopping"],
        travelersGo: ["Ipil", "Buug", "Naga"],
        images: []
    },
    {
        id: PROVINCE_IDS[60], // PH-AGN
        subtext: "Gateway to Caraga",
        whyLove: ["Surfing", "Mangroves", "River Adventures"],
        travelersGo: ["Butuan", "Cabadbaran", "Buenavista"],
        images: []
    },
    {
        id: PROVINCE_IDS[61], // PH-AGS
        subtext: "Timber Capital",
        whyLove: ["Waterfalls", "Forests", "Eco-Tourism"],
        travelersGo: ["Bayugan", "Prosperidad", "San Francisco"],
        images: []
    },
    {
        id: PROVINCE_IDS[62], // PH-BUK
        subtext: "Food Basket",
        whyLove: ["Pineapples", "Mountains", "Cool Climate"],
        travelersGo: ["Malaybalay", "Valencia", "Manolo Fortich"],
        images: []
    },
    {
        id: PROVINCE_IDS[63], // PH-CAM
        subtext: "Island Born of Fire",
        whyLove: ["Volcanoes", "Hot Springs", "White Beaches"],
        travelersGo: ["Mambajao", "Catarman", "Guinsiliban"],
        images: []
    },
    {
        id: PROVINCE_IDS[64], // PH-COM
        subtext: "Gold Mining Hub",
        whyLove: ["Mountains", "Mining Heritage", "Waterfalls"],
        travelersGo: ["Nabunturan", "Montevista", "Monkayo"],
        images: []
    },
    {
        id: PROVINCE_IDS[65], // PH-DAV
        subtext: "Banana Capital",
        whyLove: ["Beaches", "Samal Island", "Fruit Farms"],
        travelersGo: ["Tagum", "Samal", "Panabo"],
        images: []
    },
    {
        id: PROVINCE_IDS[66], // PH-DAS
        subtext: "Mt. Apo Gateway",
        whyLove: ["Mt. Apo", "Trekking", "Hot Springs"],
        travelersGo: ["Digos", "Bansalan", "Magsaysay"],
        images: []
    },
    {
        id: PROVINCE_IDS[67], // PH-DAO
        subtext: "Surfing & Diving",
        whyLove: ["Surfing", "Diving", "Pristine Beaches"],
        travelersGo: ["Mati", "Baganga", "Caraga"],
        images: []
    },
    {
        id: PROVINCE_IDS[68], // PH-DIN
        subtext: "Island Paradise",
        whyLove: ["Pristine Beaches", "Surfing", "Island Hopping"],
        travelersGo: ["San Jose", "Dinagat", "Basilisa"],
        images: []
    },
    {
        id: PROVINCE_IDS[69], // PH-LAN
        subtext: "City of Majestic Waterfalls",
        whyLove: ["Waterfalls", "Beaches", "Festivals"],
        travelersGo: ["Iligan", "Tubod", "Kauswagan"],
        images: []
    },
    {
        id: PROVINCE_IDS[70], // PH-LAS
        subtext: "Land of Promise",
        whyLove: ["Lake Lanao", "Maranao Culture", "Mosques"],
        travelersGo: ["Marawi", "Iligan", "Malabang"],
        images: []
    },
    {
        id: PROVINCE_IDS[71], // PH-MG
        subtext: "Cultural Heritage",
        whyLove: ["Maguindanao Culture", "Wetlands", "Crafts"],
        travelersGo: ["Cotabato City", "Datu Odin Sinsuat", "Sultan Kudarat"],
        images: []
    },
    {
        id: PROVINCE_IDS[72], // PH-MSC
        subtext: "Sunset Capital",
        whyLove: ["Sunsets", "Marine Sanctuary", "Beaches"],
        travelersGo: ["Oroquieta", "Ozamiz", "Tangub"],
        images: []
    },
    {
        id: PROVINCE_IDS[73], // PH-MSR
        subtext: "City of Golden Friendship",
        whyLove: ["White Water Rafting", "Beaches", "Festivals"],
        travelersGo: ["Cagayan de Oro", "Jasaan", "Opol"],
        images: []
    },
    {
        id: PROVINCE_IDS[74], // PH-NCO
        subtext: "Fruit Basket",
        whyLove: ["Pineapples", "Mountains", "Tribal Culture"],
        travelersGo: ["Kidapawan", "Midsayap", "Makilala"],
        images: []
    },
    {
        id: PROVINCE_IDS[75], // PH-SAR
        subtext: "Tuna Capital Gateway",
        whyLove: ["Beaches", "Waterfalls", "Adventure"],
        travelersGo: ["Glan", "Maitum", "Alabel"],
        images: []
    },
    {
        id: PROVINCE_IDS[76], // PH-SCO
        subtext: "Land of Dreamweavers",
        whyLove: ["Lake Sebu", "Dreamweavers", "Waterfalls"],
        travelersGo: ["Lake Sebu", "Koronadal", "Surallah"],
        images: []
    },
    {
        id: PROVINCE_IDS[77], // PH-SUK
        subtext: "Land of Dreamweavers",
        whyLove: ["T'boli Culture", "Lake Sebu", "Waterfalls"],
        travelersGo: ["Tacurong", "Isulan", "Lake Sebu"],
        images: []
    },
    {
        id: PROVINCE_IDS[78], // PH-SLU
        subtext: "Pearl of the Sulu Sea",
        whyLove: ["Pearl Diving", "Islands", "Marine Life"],
        travelersGo: ["Jolo", "Panamao", "Patikul"],
        images: []
    },
    {
        id: PROVINCE_IDS[79], // PH-SUN
        subtext: "Surfing Capital",
        whyLove: ["Cloud 9", "Surfing", "Island Hopping"],
        travelersGo: ["Siargao", "Surigao City", "Socorro"],
        images: []
    },
    {
        id: PROVINCE_IDS[80], // PH-BAS
        subtext: "Steel City",
        whyLove: ["Beaches", "Yakan Culture", "Seafood"],
        travelersGo: ["Isabela", "Lamitan", "Maluso"],
        images: []
    },
    {
        id: PROVINCE_IDS[81], // PH-ZAS
        subtext: "Sardines Capital",
        whyLove: ["Sardines", "Beaches", "Diving"],
        travelersGo: ["Pagadian", "Zamboanga City", "Molave"],
        images: []
    }
];
