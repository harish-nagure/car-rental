// Optional seed script — populates a default admin and a few cars
// Run: node seed.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Client = require("./models/Client");
const Car = require("./models/Car");

const cars = [
  { name: "Toyota Fortuner", nameplate: "MH12AB1234", image: "Fortuner.jpg",   acPrice: 18, nonAcPrice: 15, acPricePerDay: 3500, nonAcPricePerDay: 3000 },
  { name: "Audi A4",         nameplate: "MH12CD5678", image: "audi-a4.jpg",    acPrice: 25, nonAcPrice: 22, acPricePerDay: 5000, nonAcPricePerDay: 4500 },
  { name: "BMW 6 Series",    nameplate: "MH12EF9012", image: "bmw6.jpg",       acPrice: 30, nonAcPrice: 27, acPricePerDay: 6000, nonAcPricePerDay: 5500 },
  { name: "Hyundai Creta",   nameplate: "MH12GH3456", image: "creta.jpg",      acPrice: 14, nonAcPrice: 12, acPricePerDay: 2500, nonAcPricePerDay: 2000 },
  { name: "Ford EcoSport",   nameplate: "MH12IJ7890", image: "ecosport.jpg",   acPrice: 12, nonAcPrice: 10, acPricePerDay: 2200, nonAcPricePerDay: 1800 },
  { name: "Honda CR-V",      nameplate: "MH12KL1234", image: "hondacr.jpg",    acPrice: 20, nonAcPrice: 17, acPricePerDay: 4000, nonAcPricePerDay: 3500 },
  { name: "Jaguar XF",       nameplate: "MH12MN5678", image: "jaguarxf.jpg",   acPrice: 32, nonAcPrice: 28, acPricePerDay: 6500, nonAcPricePerDay: 6000 },
  { name: "Mercedes C-Class",nameplate: "MH12OP9012", image: "mcec.jpg",       acPrice: 28, nonAcPrice: 25, acPricePerDay: 5500, nonAcPricePerDay: 5000 },
  { name: "MG Hector",       nameplate: "MH12QR3456", image: "mghector.jpg",   acPrice: 16, nonAcPrice: 14, acPricePerDay: 3000, nonAcPricePerDay: 2700 },
  { name: "Tata Nexon",      nameplate: "MH12ST7890", image: "nexon.jpg",      acPrice: 13, nonAcPrice: 11, acPricePerDay: 2300, nonAcPricePerDay: 2000 },
  { name: "Range Rover",     nameplate: "MH12UV1234", image: "rangero.jpg",    acPrice: 35, nonAcPrice: 32, acPricePerDay: 7000, nonAcPricePerDay: 6500 },
  { name: "Mahindra XUV",    nameplate: "MH12WX5678", image: "Mahindra XUV.jpg", acPrice: 15, nonAcPrice: 13, acPricePerDay: 2800, nonAcPricePerDay: 2400 },
  { name: "Hyundai i20",     nameplate: "MH12YZ9012", image: "hyundai0.jpg",   acPrice: 11, nonAcPrice: 9,  acPricePerDay: 2000, nonAcPricePerDay: 1700 }
];

(async () => {
  await connectDB();
  await Client.deleteMany({});
  await Car.deleteMany({});

  const hashed = await bcrypt.hash("admin123", 10);
  await Client.create({
    username: "admin", name: "Default Admin", phone: "9999999999",
    email: "admin@cars.com", address: "HQ", password: hashed
  });

  const seeded = cars.map(c => ({ ...c, availability: "yes", clientUsername: "admin" }));
  await Car.insertMany(seeded);

  console.log("✅ Seeded admin (admin / admin123) and", seeded.length, "cars");
  process.exit(0);
})();
