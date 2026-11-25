/* JANO MOTORS — ავტოპარკის მონაცემები.
   სახელი/წელი/ფასი (₾ და $)/ძველი ფასი/ცხ.ძ./საწვავი/კარები — JANO-ს საჯარო ჩანაწერებიდან (jano-zeta.vercel.app/api/cars/{id}, janomotors.com).
   spec.* (0–100, ხარჯი, ძრავი, კოლოფი, წამყვანი) — მწარმოებლის ოფიციალური მონაცემები, წყარო spec.src-ში; null = უცნობია და ჩანს „—“.
   sound — ძრავის ხმის აუდიოფაილის გზა (ჯერ ცარიელია). */
window.FLEET=[
 {
  "id": "car1",
  "name": "Porsche Taycan 4",
  "year": 2023,
  "hp": 530,
  "fuel": "ელექტრო",
  "doors": "4/5",
  "gel": 980,
  "usd": 350,
  "oldGel": 1050,
  "oldUsd": 400,
  "img": "media/car1/01.jpg",
  "imgs": [
   "media/car1/01.jpg",
   "media/car1/02.jpg",
   "media/car1/03.jpg",
   "media/car1/04.jpg",
   "media/car1/05.jpg"
  ],
  "spec": {
   "engine": null,
   "trans": null,
   "drive": null,
   "acc": null,
   "cons": null,
   "consNote": "ელექტრომობილი — ლ/100კმ არ ეხება",
   "src": [],
   "mfrNote": "JANO-ს ჩანაწერში მოდელი „Taycan 4“ (530 ცხ.ძ.) ზუსტ ვერსიას ცალსახად არ ადგენს — ამიტომ მწარმოებლის მონაცემები არ არის ნაჩვენები."
  },
  "sound": ""
 },
 {
  "id": "car2",
  "name": "Mercedes-Benz G63 AMG",
  "year": 2023,
  "hp": 577,
  "fuel": "ბენზინი",
  "doors": "4/5",
  "gel": 1820,
  "usd": 650,
  "oldGel": null,
  "oldUsd": null,
  "img": "media/car2/01.jpg",
  "imgs": [
   "media/car2/01.jpg",
   "media/car2/02.jpg",
   "media/car2/03.jpg",
   "media/car2/04.jpg",
   "media/car2/05.jpg",
   "media/car2/06.jpg",
   "media/car2/07.jpg",
   "media/car2/08.jpg"
  ],
  "spec": {
   "engine": "4.0 ლ V8 ბიტურბო",
   "trans": "9-საფეხურიანი ავტომატიკა (AMG SPEEDSHIFT TCT 9G)",
   "drive": "სრული (AMG Performance 4MATIC)",
   "acc": "4.5",
   "cons": "13.1",
   "consStd": "NEDC",
   "src": [
    {
     "t": "Mercedes-Benz Media — Mercedes-AMG G 63 (W463), 2018",
     "u": "https://media.mercedes-benz.com/article/037b6d2e-9ce5-4029-aa98-9f7698bd6de1"
    }
   ]
  },
  "sound": ""
 },
 {
  "id": "car3",
  "name": "Range Rover Evoque",
  "year": 2022,
  "hp": 269,
  "fuel": "ბენზინი",
  "doors": "4/5",
  "gel": 560,
  "usd": 200,
  "oldGel": null,
  "oldUsd": null,
  "img": "media/car3/01.jpg",
  "imgs": [
   "media/car3/01.jpg",
   "media/car3/02.jpg",
   "media/car3/03.jpg",
   "media/car3/04.jpg",
   "media/car3/05.jpg"
  ],
  "spec": {
   "engine": null,
   "trans": null,
   "drive": null,
   "acc": null,
   "cons": null,
   "src": [],
   "mfrNote": "2022 წლის Evoque-ს რამდენიმე ძრავის ვერსია აქვს და JANO-ს მონაცემით (269 ცხ.ძ.) კონკრეტული ვერსია ცალსახად ვერ დგინდება."
  },
  "sound": ""
 },
 {
  "id": "car4",
  "name": "Mercedes-Benz Glc 200",
  "year": 2023,
  "hp": 255,
  "fuel": "ბენზინი",
  "doors": "4/5",
  "gel": 560,
  "usd": 200,
  "oldGel": null,
  "oldUsd": null,
  "img": "media/car4/01.jpg",
  "imgs": [
   "media/car4/01.jpg",
   "media/car4/02.jpg",
   "media/car4/03.jpg",
   "media/car4/04.jpg",
   "media/car4/05.jpg",
   "media/car4/06.jpg"
  ],
  "spec": {
   "engine": "2.0 ლ 4-ცილინდრიანი, მსუბუქი ჰიბრიდი",
   "trans": "9-საფეხურიანი ავტომატიკა (9G-TRONIC)",
   "drive": "სრული (4MATIC)",
   "acc": "7.8",
   "cons": "7.3",
   "consStd": "WLTP",
   "src": [
    {
     "t": "Mercedes-Benz Singapore — GLC 200 4MATIC (X254) technical data",
     "u": "https://www.mercedes-benz.com.sg/passengercars/models/suv/glc/overview.html"
    }
   ]
  },
  "sound": ""
 },
 {
  "id": "car5",
  "name": "Mercedes-Benz E53 AMG",
  "year": 2018,
  "hp": 429,
  "fuel": "ბენზინი",
  "doors": "4/5",
  "gel": 700,
  "usd": 250,
  "oldGel": 800,
  "oldUsd": 300,
  "img": "media/car5/01.jpg",
  "imgs": [
   "media/car5/01.jpg",
   "media/car5/02.jpg",
   "media/car5/03.jpg",
   "media/car5/04.jpg"
  ],
  "spec": {
   "engine": "3.0 ლ რიგითი 6-ცილინდრიანი ტურბო + EQ Boost",
   "trans": "9-საფეხურიანი ავტომატიკა (AMG SPEEDSHIFT TCT 9G)",
   "drive": "სრული (AMG Performance 4MATIC+)",
   "acc": "4.5",
   "cons": "8.7–8.6",
   "consStd": "NEDC",
   "src": [
    {
     "t": "autoevolution — Mercedes-AMG E 53 4Matic+ Sedan (Mercedes-AMG-ის ოფიციალური მონაცემები), 2018",
     "u": "https://www.autoevolution.com/news/mercedes-amg-e-53-4matic-goes-official-as-sedan-and-estate-125258.html"
    },
    {
     "t": "Mercedes-Benz UK — E-Class price & specification (E 53 4MATIC+)",
     "u": "https://mercedes-benz-media.co.uk/assets/documents/original/28690-EClassSEMYupdate1804180503v1030518chrome.pdf"
    }
   ]
  },
  "sound": ""
 },
 {
  "id": "car6",
  "name": "Ford Mustang",
  "year": 2014,
  "hp": 305,
  "fuel": "ბენზინი",
  "doors": "2/3",
  "gel": 560,
  "usd": 200,
  "oldGel": null,
  "oldUsd": null,
  "img": "media/car6/01.jpg",
  "imgs": [
   "media/car6/01.jpg",
   "media/car6/02.jpg",
   "media/car6/03.jpg",
   "media/car6/04.jpg",
   "media/car6/05.jpg",
   "media/car6/06.jpg"
  ],
  "spec": {
   "engine": "3.7 ლ V6",
   "trans": null,
   "drive": null,
   "acc": null,
   "cons": "10.1–10.6",
   "consStd": "EPA",
   "src": [
    {
     "t": "fueleconomy.gov (US EPA) — 2014 Ford Mustang 3.7 L V6",
     "u": "https://www.fueleconomy.gov/feg/bymodel/2014_Ford_Mustang.shtml"
    }
   ]
  },
  "sound": ""
 },
 {
  "id": "car7",
  "name": "Toyota Tacoma TRD",
  "year": 2023,
  "hp": 278,
  "fuel": "ბენზინი",
  "doors": "4/5",
  "gel": 560,
  "usd": 200,
  "oldGel": null,
  "oldUsd": null,
  "img": "media/car7/02.jpg",
  "imgs": [
   "media/car7/01.jpg",
   "media/car7/02.jpg",
   "media/car7/03.jpg",
   "media/car7/04.jpg",
   "media/car7/05.jpg",
   "media/car7/06.jpg",
   "media/car7/07.jpg"
  ],
  "spec": {
   "engine": "3.5 ლ V6",
   "trans": null,
   "drive": null,
   "acc": null,
   "cons": "11.3–13.2",
   "consStd": "EPA",
   "src": [
    {
     "t": "fueleconomy.gov (US EPA) — 2023 Toyota Tacoma 3.5 L V6",
     "u": "https://www.fueleconomy.gov/Feg/bymodel/2023_Toyota_Tacoma.shtml"
    }
   ]
  },
  "sound": ""
 },
 {
  "id": "car8",
  "name": "Land Cruiser 300",
  "year": 2022,
  "hp": 278,
  "fuel": "დიზელი",
  "doors": "4/5",
  "gel": 700,
  "usd": 250,
  "oldGel": null,
  "oldUsd": null,
  "img": "media/car8/06.jpg",
  "imgs": [
   "media/car8/01.jpg",
   "media/car8/02.jpg",
   "media/car8/03.jpg",
   "media/car8/04.jpg",
   "media/car8/05.jpg",
   "media/car8/06.jpg",
   "media/car8/07.jpg",
   "media/car8/08.jpg"
  ],
  "spec": {
   "engine": "3.3 ლ V6 ტყუპ-ტურბო დიზელი",
   "trans": "10-საფეხურიანი ავტომატიკა",
   "drive": "მუდმივი სრული (4WD)",
   "acc": null,
   "cons": "8.9",
   "consStd": "ADR",
   "src": [
    {
     "t": "Toyota Australia PressRoom — LandCruiser 300 Series (2021)",
     "u": "https://pressroom.toyota.com.au/PressKit?pk-code=6b9e6acf-e1fa-4b8a-8b18-d7fe160311ea"
    }
   ]
  },
  "sound": ""
 },
 {
  "id": "car9",
  "name": "BMW M8 Competition",
  "year": 2022,
  "hp": 640,
  "fuel": "ბენზინი",
  "doors": "4/5",
  "gel": 1400,
  "usd": 500,
  "oldGel": null,
  "oldUsd": null,
  "img": "media/car9/01.jpg",
  "imgs": [
   "media/car9/01.jpg",
   "media/car9/02.jpg",
   "media/car9/03.jpg",
   "media/car9/04.jpg",
   "media/car9/05.jpg",
   "media/car9/06.jpg",
   "media/car9/07.jpg",
   "media/car9/08.jpg",
   "media/car9/09.jpg",
   "media/car9/10.jpg",
   "media/car9/11.jpg",
   "media/car9/12.jpg"
  ],
  "spec": {
   "engine": "4.4 ლ V8 M TwinPower Turbo",
   "trans": "8-საფეხურიანი M Steptronic",
   "drive": "სრული (M xDrive)",
   "acc": "3.2",
   "cons": "11.6–11.2",
   "consStd": "WLTP",
   "src": [
    {
     "t": "BMW Group PressClub — BMW M8 Competition Gran Coupé (2022)",
     "u": "https://www.press.bmwgroup.com/global/article/detail/T0364657EN/the-new-bmw-m8-competition-coup%c3%a9-the-new-bmw-m8-competition-convertible-the-new-bmw-m8-competition-gran-coup%c3%a9"
    },
    {
     "t": "BMW South Africa — M8 Gran Coupé technical data",
     "u": "https://www.bmw.co.za/en/all-models/m-series/m8-gran-coupe/showroom/bmw-m8-gran-coupe-technical-data.html"
    }
   ]
  },
  "sound": ""
 },
 {
  "id": "car10",
  "name": "G63 AMG",
  "year": 2025,
  "hp": 577,
  "fuel": "ბენზინი",
  "doors": "4/5",
  "gel": 2170,
  "usd": 800,
  "oldGel": null,
  "oldUsd": null,
  "img": "media/car10/01.jpg",
  "imgs": [
   "media/car10/01.jpg",
   "media/car10/02.jpg",
   "media/car10/03.jpg",
   "media/car10/04.jpg",
   "media/car10/05.jpg"
  ],
  "spec": {
   "engine": "4.0 ლ V8 ბიტურბო + სტარტერ-გენერატორი",
   "trans": "9-საფეხურიანი ავტომატიკა (AMG SPEEDSHIFT TCT 9G)",
   "drive": "სრული (4x4)",
   "acc": "4.4",
   "cons": "15.7–14.7",
   "consStd": "WLTP",
   "src": [
    {
     "t": "Mercedes-AMG — G 63 (W465)",
     "u": "https://www.mercedes-amg.com/en/g-class-suv"
    },
    {
     "t": "Mercedes-Benz Malaysia — Mercedes-AMG G 63 technical data",
     "u": "https://www.mercedes-benz.com.my/passengercars/models/suv/g-class/amg.html"
    }
   ]
  },
  "sound": ""
 }
];
