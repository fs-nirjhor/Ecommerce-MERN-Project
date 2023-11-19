// random user data

const fakeData = {
  users: [
    {
      name: "Mr. Adman",
      email: "adman@example.com",
      password: "Adman$1234",
      address: "Dhaka",
      phone: "01712345678",
      isAdmin: true,
    },
    {
      name: "Mr. Bandon",
      email: "bandon@example.com",
      password: "Bandon$1234",
      address: "New York",
      phone: "1234567890",
      isBanned: true,
    },
    {
      name: "Mr. Usu",
      email: "usu@example.com",
      password: "Usu$1234",
      address: "Los Angeles",
      phone: "9876543210",
    },
    {
      name: "David Wilson",
      email: "david.wilson@example.com",
      password: "DWilson$qwerty",
      address: "London",
      phone: "5555555555",
    },
    {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      password: "EDavis$p@ssw0rd",
      address: "Paris",
      phone: "5551234567",
    },
    {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      password: "MBrown$12345",
      address: "Berlin",
      phone: "1234567890",
    },
    {
      name: "Sarah Smith",
      email: "sarah.smith@example.com",
      password: "SSmith$abcde",
      address: "Sydney",
      phone: "9876543210",
    },
    {
      name: "Daniel Johnson",
      email: "daniel.johnson@example.com",
      password: "DJohnson$pass123",
      address: "Toronto",
      phone: "5555555555",
    },
    {
      name: "Olivia Wilson",
      email: "olivia.wilson@example.com",
      password: "OWilson$secret",
      address: "Tokyo",
      phone: "5551234567",
    },
    {
      name: "William Davis",
      email: "william.davis@example.com",
      password: "WDavis$password",
      address: "Beijing",
      phone: "1234567890",
    },
    {
      name: "Sophia Brown",
      email: "sophia.brown@example.com",
      password: "SBrown$5678",
      address: "Moscow",
      phone: "9876543210",
    },
    {
      name: "James Smith",
      email: "james.smith@example.com",
      password: "JSmith$abcd",
      address: "Rio de Janeiro",
      phone: "5555555555",
    },
    {
      name: "Emma Johnson",
      email: "emma.johnson@example.com",
      password: "EJohnson$qwerty",
      address: "Cape Town",
      phone: "5551234567",
    },
    {
      name: "Benjamin Wilson",
      email: "benjamin.wilson@example.com",
      password: "BWilson$p@ssw0rd",
      address: "Hong Kong",
      phone: "1234567890",
    },
    {
      name: "Mia Davis",
      email: "mia.davis@example.com",
      password: "MDavis$12345",
      address: "Singapore",
      phone: "9876543210",
    },
    {
      name: "Liam Brown",
      email: "liam.brown@example.com",
      password: "LBrown$abcde",
      address: "Dubai",
      phone: "5555555555",
    },
    {
      name: "Ava Smith",
      email: "ava.smith@example.com",
      password: "ASmith$pass123",
      address: "Istanbul",
      phone: "5551234567",
    },
    {
      name: "Logan Johnson",
      email: "logan.johnson@example.com",
      password: "LJohnson$secret",
      address: "Mumbai",
      phone: "1234567890",
    },
    {
      name: "Ella Wilson",
      email: "ella.wilson@example.com",
      password: "EWilson$password",
      address: "Seoul",
      phone: "9876543210",
    },
    {
      name: "Noah Davis",
      email: "noah.davis@example.com",
      password: "NDavis$5678",
      address: "Mexico City",
      phone: "5555555555",
    },
  ],
  categories: [
    { name: "Mobile Phone" },
    { name: "Laptop" },
    { name: "Smart Watch" },
    { name: "Android TV" },
    { name: "Smart Gadgets" },
  ],
  products: [
    {
      name: "I-Phone 12 Pro",
      slug: "i-phone-12-pro",
      description:
        "The iPhone 12 Pro is a smartphone with a 6.1-inch OLED screen, a triple 12MP camera system, and an Apple A14 processor. It has a matte back with a shiny stainless-steel band, and comes in four colors. It has 6GB RAM and starts at 128GB of storage. It can record HDR video with Dolby Vision up to 60 fps, and has improved low-light performance and Smart HDR 3 for photos. It is water and dust resistant (rated IP68). It was released in 2020, October 23.",
      price: 700.5,
      quantity: 80,
      sold: 20,
      shipping: 15,
      category: "9555e3f485e9675f5b1324b9", // ObjectId
    },
    {
      name: "Samsung Galaxy S21 Ultra",
      slug: "samsung-galaxy-s21-ultra",
      description:
        "The Samsung Galaxy S21 Ultra is a smartphone with a 6.8-inch Dynamic AMOLED 2X screen, a quad 108MP camera system, and an Exynos 2100 processor. It has a glass back with a metal frame, and comes in Phantom Black and Phantom Silver. It has 12GB RAM and starts at 128GB of storage. It can record 8K video at 24 fps, and has improved low-light performance and 100x Space Zoom for photos. It is water and dust resistant (rated IP68). It was released in 2021, January 29.",
      price: 899.99,
      quantity: 50,
      //sold: 10,
      //shipping: 20,
      category: "6555e3f485e9675f5b1324b9",
    },
    {
      name: "Google Pixel 5",
      slug: "google-pixel-5",
      description:
        "The Google Pixel 5 is a smartphone with a 6.0-inch OLED screen, a dual 12.2MP camera system, and a Snapdragon 765G processor. It has a recycled aluminum back with a matte finish, and comes in Just Black and Sorta Sage. It has 8GB RAM and starts at 128GB of storage. It can record 4K video at 60 fps, and has Night Sight and Portrait Light for photos. It is water and dust resistant (rated IP68). It was released in 2020, October 15.",
      price: 699,
      quantity: 100,
      sold: 30,
      shipping: 10,
      category: "6555e3f485e9675f5b1324b9",
    },
    {
      name: "OnePlus 9 Pro",
      slug: "oneplus-9-pro",
      description:
        "The OnePlus 9 Pro is a smartphone with a 6.7-inch Fluid AMOLED screen, a quad 48MP camera system, and a Snapdragon 888 processor. It has a glass back with a metal frame, and comes in Morning Mist, Pine Green, and Stellar Black. It has 12GB RAM and starts at 128GB of storage. It can record 8K video at 30 fps, and has Hasselblad Color Calibration and Nightscape for photos. It is water and dust resistant (rated IP68). It was released in 2021, March 23.",
      price: 969,
      quantity: 70,
      sold: 15,
      shipping: 25,
      category: "6555e3f485e9675f5b1324b9",
    },
    {
      name: "Xiaomi Mi 11",
      slug: "xiaomi-mi-11",
      description:
        "The Xiaomi Mi 11 is a smartphone with a 6.81-inch AMOLED screen, a triple 108MP camera system, and a Snapdragon 888 processor. It has a glass back with an aluminum frame, and comes in Midnight Gray, Horizon Blue, and Frost White. It has 8GB RAM and starts at 128GB of storage. It can record 8K video at 30 fps, and has Night mode 2.0 and Magic Zoom for photos. It is water and dust resistant (rated IP68). It was released in 2021, January 01.",
      price: 749,
      quantity: 90,
      sold: 25,
      shipping: 15,
      category: "6555e3f485e9675f5b1324b9",
    },
  ],
};

module.exports = fakeData;
