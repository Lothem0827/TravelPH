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
        subtext: "Agricultural hub with historic sites",
        whyLove: ["Historical Sites", "Rice Fields", "Aquino Heritage"],
        travelersGo: ["Tarlac City", "Capas", "Camiling"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[1], // PH-ZMB
        subtext: "Coastal province known for beaches",
        whyLove: ["White Beaches", "Surfing", "Mountain Trails"],
        travelersGo: ["Subic", "San Antonio", "Iba"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[2], // PH-ABR
        subtext: "Mountainous region with indigenous culture",
        whyLove: ["Mountains", "Indigenous Culture", "Trekking"],
        travelersGo: ["Bangued", "Tayum", "Lagayan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[3], // PH-APA
        subtext: "Remote frontier with pristine nature",
        whyLove: ["Pristine Nature", "Tribal Culture", "Waterfalls"],
        travelersGo: ["Luna", "Kabugao", "Calanasan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[4], // PH-AUR
        subtext: "Surfing haven with waterfalls",
        whyLove: ["Surfing", "Waterfalls", "Pristine Beaches"],
        travelersGo: ["Baler", "Dingalan", "Casiguran"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[5], // PH-BAN
        subtext: "World War II sites and beaches",
        whyLove: ["WWII Sites", "Mt. Samat", "Beaches"],
        travelersGo: ["Balanga", "Mariveles", "Bagac"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[6], // PH-BTN
        subtext: "Windy islands with stone houses",
        whyLove: ["Rolling Hills", "Stone Houses", "Scenic Views"],
        travelersGo: ["Basco", "Sabtang", "Itbayat"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[7], // PH-BEN
        subtext: "Cool climate, strawberries, pine trees",
        whyLove: ["Cool Climate", "Strawberries", "Pine Trees"],
        travelersGo: ["Baguio", "La Trinidad", "Itogon"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[8], // PH-BUL
        subtext: "Historical churches and festivals",
        whyLove: ["Historical Churches", "Festivals", "Heritage Sites"],
        travelersGo: ["Malolos", "Baliwag", "San Miguel"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[9], // PH-CAG
        subtext: "Adventure valley with rivers",
        whyLove: ["Beaches", "Caves", "River Rafting"],
        travelersGo: ["Tuguegarao", "Santa Ana", "Claveria"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[10], // PH-IFU
        subtext: "World‑famous rice terraces",
        whyLove: ["Banaue Terraces", "Indigenous Culture", "Hiking"],
        travelersGo: ["Banaue", "Batad", "Hungduan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[11], // PH-ILN
        subtext: "Windmills and sand dunes",
        whyLove: ["Sand Dunes", "Spanish Heritage", "Windmills"],
        travelersGo: ["Laoag", "Pagudpud", "Paoay"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[12], // PH-ILS
        subtext: "Heritage heartland with pottery",
        whyLove: ["Vigan Heritage", "Cobblestone Streets", "Pottery"],
        travelersGo: ["Vigan", "Santa Maria", "Candon"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[13], // PH-ISA
        subtext: "Corn capital with waterfalls",
        whyLove: ["Waterfalls", "Caves", "Nature Parks"],
        travelersGo: ["Ilagan", "Cauayan", "Santiago"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[14], // PH-KAL
        subtext: "Warrior province with tribal tattoos",
        whyLove: ["Tribal Tattoos", "Mountains", "Culture"],
        travelersGo: ["Tabuk", "Tinglayan", "Balbalan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[15], // PH-LUN
        subtext: "Surfing capital with grape harvest",
        whyLove: ["Surfing", "Beaches", "Grape Harvest"],
        travelersGo: ["San Juan", "Bauang", "San Fernando"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[16], // PH-MOU
        subtext: "Hanging coffins and cool climate",
        whyLove: ["Sagada Caves", "Hanging Coffins", "Cool Climate"],
        travelersGo: ["Sagada", "Bontoc", "Besao"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[17], // PH-NUE
        subtext: "Rice granary with waterfalls",
        whyLove: ["Rice Terraces", "Waterfalls", "Farm Tourism"],
        travelersGo: ["Cabanatuan", "Gapan", "San Jose"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[18], // PH-NUV
        subtext: "Nature sanctuary with mountains",
        whyLove: ["Mountains", "Waterfalls", "Cool Climate"],
        travelersGo: ["Bayombong", "Solano", "Bambang"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[19], // PH-PAM
        subtext: "Culinary capital with giant lanterns",
        whyLove: ["Sisig", "Giant Lanterns", "Food Heritage"],
        travelersGo: ["Angeles City", "San Fernando", "Mabalacat"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[20], // PH-PAN
        subtext: "Hundred Islands marine park",
        whyLove: ["Island Hopping", "Beaches", "Seafood"],
        travelersGo: ["Alaminos", "Bolinao", "Dagupan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[21], // PH-QUI
        subtext: "Forest sanctuary with eco‑tourism",
        whyLove: ["Waterfalls", "Forests", "Eco‑Tourism"],
        travelersGo: ["Cabarroguis", "Maddela", "Aglipay"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[22], // PH-ALB
        subtext: "Mayon Volcano iconic cone",
        whyLove: ["Perfect Cone", "Spicy Food", "Adventure"],
        travelersGo: ["Legazpi", "Daraga", "Camalig"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[23], // PH-BTG
        subtext: "Diving capital near Taal Volcano",
        whyLove: ["Diving", "Beaches", "Taal Volcano"],
        travelersGo: ["Batangas City", "Nasugbu", "Mabini"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[24], // PH-CAN
        subtext: "Pineapple paradise with islands",
        whyLove: ["Beaches", "Pineapples", "Islands"],
        travelersGo: ["Daet", "Mercedes", "Basud"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[25], // PH-CAS
        subtext: "Wakeboarding hub with whale sharks",
        whyLove: ["CWC", "Beaches", "Whale Sharks"],
        travelersGo: ["Naga", "Pili", "Caramoan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[26], // PH-CAT
        subtext: "Happy island with surf",
        whyLove: ["Surfing", "Beaches", "Laid-back Vibe"],
        travelersGo: ["Virac", "Baras", "Puraran"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[27], // PH-CAV
        subtext: "Historical cradle with coffee",
        whyLove: ["Coffee", "Historical Sites", "Tagaytay Views"],
        travelersGo: ["Tagaytay", "Cavite City", "Trece Martires"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[28], // PH-LAG
        subtext: "Hot springs and lake views",
        whyLove: ["Hot Springs", "Waterfalls", "Lake Views"],
        travelersGo: ["Los Baños", "Calamba", "Pagsanjan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[29], // PH-MAD
        subtext: "Heart of the Philippines festivals",
        whyLove: ["Moriones Festival", "Beaches", "Caves"],
        travelersGo: ["Boac", "Gasan", "Mogpog"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[30], // PH-MAS
        subtext: "Rodeo capital with beaches",
        whyLove: ["Rodeo", "Beaches", "Island Hopping"],
        travelersGo: ["Masbate City", "Ticao", "Burias"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[31], // PH-MNL
        subtext: "Urban hub with nightlife",
        whyLove: ["Urban Life", "Shopping", "Nightlife"],
        travelersGo: ["Makati", "BGC", "Manila"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[32], // PH-QUE
        subtext: "Coconut capital with festivals",
        whyLove: ["Islands", "Beaches", "Festivals"],
        travelersGo: ["Lucena", "Pagbilao", "Tayabas"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[33], // PH-RIZ
        subtext: "Art capital with waterfalls",
        whyLove: ["Art Scene", "Waterfalls", "Nature Parks"],
        travelersGo: ["Antipolo", "Tanay", "Angono"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[34], // PH-SOR
        subtext: "Whale shark capital with fireflies",
        whyLove: ["Whale Sharks", "Surfing", "Firefly Watching"],
        travelersGo: ["Donsol", "Sorsogon City", "Matnog"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[35], // PH-AKL
        subtext: "Boracay paradise with white beach",
        whyLove: ["Boracay", "White Beach", "Island Life"],
        travelersGo: ["Boracay", "Kalibo", "Caticlan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[36], // PH-ANT
        subtext: "Mountainous province with hot baths",
        whyLove: ["Mountains", "Beaches", "Kawa Hot Bath"],
        travelersGo: ["San Jose", "Culasi", "Tibiao"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[37], // PH-BIL
        subtext: "Island of fire with diving",
        whyLove: ["Beaches", "Diving", "Seafood"],
        travelersGo: ["Naval", "Almeria", "Kawayan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[38], // PH-BOH
        subtext: "Chocolate hills and tarsiers",
        whyLove: ["Chocolate Hills", "Tarsiers", "Beaches"],
        travelersGo: ["Panglao", "Tagbilaran", "Loboc"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[39], // PH-CAP
        subtext: "Seafood capital with festivals",
        whyLove: ["Seafood", "Festivals", "Island Hopping"],
        travelersGo: ["Roxas City", "Panay", "Pilar"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[40], // PH-CEB
        subtext: "White sand beaches and island hopping",
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
        subtext: "Surfing paradise with caves",
        whyLove: ["Surfing", "Caves", "Waterfalls"],
        travelersGo: ["Borongan", "Guiuan", "Sulat"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[42], // PH-GUI
        subtext: "Mango paradise with beaches",
        whyLove: ["Mangoes", "Beaches", "Trappist Monastery"],
        travelersGo: ["Jordan", "Nueva Valencia", "San Lorenzo"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[43], // PH-ILI
        subtext: "City of love with heritage sites",
        whyLove: ["Heritage Sites", "Food Scene", "Festivals"],
        travelersGo: ["Iloilo City", "Miagao", "Guimbal"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[44], // PH-LEY
        subtext: "MacArthur landing historic site",
        whyLove: ["WWII History", "Beaches", "Diving"],
        travelersGo: ["Tacloban", "Ormoc", "Palo"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[45], // PH-MAS_2
        subtext: "Rodeo capital with beaches",
        whyLove: ["Rodeo", "Beaches", "Island Hopping"],
        travelersGo: ["Masbate City", "Ticao", "Burias"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[46], // PH-NEC
        subtext: "Sugar bowl with heritage festivals",
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
        subtext: "Gentle people with diving",
        whyLove: ["Diving", "Dolphins", "Waterfalls"],
        travelersGo: ["Dumaguete", "Apo Island", "Siquijor"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[48], // PH-NSA
        subtext: "Adventure awaits with surf",
        whyLove: ["Surfing", "Caves", "Waterfalls"],
        travelersGo: ["Catarman", "Allen", "Biri"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[49], // PH-MDC
        subtext: "Wild West with beaches",
        whyLove: ["Beaches", "Diving", "Island Life"],
        travelersGo: ["Mamburao", "Sablayan", "San Jose"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[50], // PH-MDR
        subtext: "Island paradise with white beaches",
        whyLove: ["Puerto Galera", "Diving", "White Beaches"],
        travelersGo: ["Puerto Galera", "Calapan", "Roxas"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[51], // PH-PLW
        subtext: "Last frontier paradise with islands",
        whyLove: ["El Nido", "Underground River", "Island Hopping"],
        travelersGo: ["El Nido", "Coron", "Puerto Princesa"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[52], // PH-ROM
        subtext: "Marble capital with islands",
        whyLove: ["Marble Crafts", "Islands", "Beaches"],
        travelersGo: ["Romblon", "Sibuyan", "Tablas"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[53], // PH-WSA
        subtext: "Natural wonders with caves",
        whyLove: ["Caves", "Waterfalls", "Beaches"],
        travelersGo: ["Calbayog", "Catbalogan", "Basey"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[54], // PH-SIG
        subtext: "Mystic island with healing waters",
        whyLove: ["Healing", "Beaches", "Waterfalls"],
        travelersGo: ["Siquijor Town", "San Juan", "Lazi"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[55], // PH-SLE
        subtext: "Diving haven with whale sharks",
        whyLove: ["Diving", "Whale Sharks", "Beaches"],
        travelersGo: ["Maasin", "Padre Burgos", "Pintuyan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[56], // PH-SUR
        subtext: "Enchanted river with waterfalls",
        whyLove: ["Enchanted River", "Diving", "Waterfalls"],
        travelersGo: ["Bislig", "Tandag", "Hinatuan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[57], // PH-TAW
        subtext: "Southernmost province with islands",
        whyLove: ["Islands", "Diving", "Sama Culture"],
        travelersGo: ["Bongao", "Simunul", "Sitangkai"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[58], // PH-ZAN
        subtext: "Dapitan heritage with beaches",
        whyLove: ["Rizal Shrine", "Beaches", "Waterfalls"],
        travelersGo: ["Dipolog", "Dapitan", "Polanco"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[59], // PH-ZSI
        subtext: "Pearl farm paradise with islands",
        whyLove: ["Pearl Farms", "Beaches", "Island Hopping"],
        travelersGo: ["Ipil", "Buug", "Naga"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[60], // PH-AGN
        subtext: "Gateway to Caraga with surf",
        whyLove: ["Surfing", "Mangroves", "River Adventures"],
        travelersGo: ["Butuan", "Cabadbaran", "Buenavista"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[61], // PH-AGS
        subtext: "Timber capital with forests",
        whyLove: ["Waterfalls", "Forests", "Eco‑Tourism"],
        travelersGo: ["Bayugan", "Prosperidad", "San Francisco"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[62], // PH-BUK
        subtext: "Food basket with pineapples",
        whyLove: ["Pineapples", "Mountains", "Cool Climate"],
        travelersGo: ["Malaybalay", "Valencia", "Manolo Fortich"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[63], // PH-CAM
        subtext: "Island born of fire with volcanoes",
        whyLove: ["Volcanoes", "Hot Springs", "White Beaches"],
        travelersGo: ["Mambajao", "Catarman", "Guinsiliban"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[64], // PH-COM
        subtext: "Gold mining hub with mountains",
        whyLove: ["Mountains", "Mining Heritage", "Waterfalls"],
        travelersGo: ["Nabunturan", "Montevista", "Monkayo"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[65], // PH-DAV
        subtext: "Banana capital with beaches",
        whyLove: ["Beaches", "Samal Island", "Fruit Farms"],
        travelersGo: ["Tagum", "Samal", "Panabo"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[66], // PH-DAS
        subtext: "Mt. Apo gateway with trekking",
        whyLove: ["Mt. Apo", "Trekking", "Hot Springs"],
        travelersGo: ["Digos", "Bansalan", "Magsaysay"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[67], // PH-DAO
        subtext: "Surfing & diving with pristine beaches",
        whyLove: ["Surfing", "Diving", "Pristine Beaches"],
        travelersGo: ["Mati", "Baganga", "Caraga"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[68], // PH-DIN
        subtext: "Island paradise with surf",
        whyLove: ["Pristine Beaches", "Surfing", "Island Hopping"],
        travelersGo: ["San Jose", "Dinagat", "Basilisa"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[69], // PH-LAN
        subtext: "City of majestic waterfalls",
        whyLove: ["Waterfalls", "Beaches", "Festivals"],
        travelersGo: ["Iligan", "Tubod", "Kauswagan"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[70], // PH-LAS
        subtext: "Land of promise with lakes",
        whyLove: ["Lake Lanao", "Maranao Culture", "Mosques"],
        travelersGo: ["Marawi", "Iligan", "Malabang"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[71], // PH-MG
        subtext: "Cultural heritage with wetlands",
        whyLove: ["Maguindanao Culture", "Wetlands", "Crafts"],
        travelersGo: ["Cotabato City", "Datu Odin Sinsuat", "Sultan Kudarat"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[72], // PH-MSC
        subtext: "Sunset capital with marine sanctuary",
        whyLove: ["Sunsets", "Marine Sanctuary", "Beaches"],
        travelersGo: ["Oroquieta", "Ozamiz", "Tangub"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[73], // PH-MSR
        subtext: "Golden friendship city with rafting",
        whyLove: ["White Water Rafting", "Beaches", "Festivals"],
        travelersGo: ["Cagayan de Oro", "Jasaan", "Opol"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[74], // PH-NCO
        subtext: "Fruit basket with pineapples",
        whyLove: ["Pineapples", "Mountains", "Tribal Culture"],
        travelersGo: ["Kidapawan", "Midsayap", "Makilala"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[75], // PH-SAR
        subtext: "Tuna capital gateway with adventure",
        whyLove: ["Beaches", "Waterfalls", "Adventure"],
        travelersGo: ["Glan", "Maitum", "Alabel"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[76], // PH-SCO
        subtext: "Land of dreamweavers with lakes",
        whyLove: ["Lake Sebu", "Dreamweavers", "Waterfalls"],
        travelersGo: ["Lake Sebu", "Koronadal", "Surallah"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[77], // PH-SUK
        subtext: "Dreamweavers culture with waterfalls",
        whyLove: ["T'boli Culture", "Lake Sebu", "Waterfalls"],
        travelersGo: ["Tacurong", "Isulan", "Lake Sebu"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[78], // PH-SLU
        subtext: "Pearl of the Sulu Sea with diving",
        whyLove: ["Pearl Diving", "Islands", "Marine Life"],
        travelersGo: ["Jolo", "Panamao", "Patikul"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[79], // PH-SUN
        subtext: "Surfing capital with island hopping",
        whyLove: ["Cloud 9", "Surfing", "Island Hopping"],
        travelersGo: ["Siargao", "Surigao City", "Socorro"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[80], // PH-BAS
        subtext: "Steel city with beaches",
        whyLove: ["Beaches", "Yakan Culture", "Seafood"],
        travelersGo: ["Isabela", "Lamitan", "Maluso"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    },
    {
        id: PROVINCE_IDS[81], // PH-ZAS
        subtext: "Sardines capital with beaches",
        whyLove: ["Sardines", "Beaches", "Diving"],
        travelersGo: ["Pagadian", "Zamboanga City", "Molave"],
        images: [
            require('@/assets/images/provinces/cebu/cebu-1.jpg'),
            require('@/assets/images/provinces/cebu/cebu-2.jpg'),
            require('@/assets/images/provinces/cebu/cebu-3.jpg'),
        ]
    }
];
