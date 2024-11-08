import mongoose from "mongoose";
import BidAlert from "../models/BidAlert";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const testBids = [
  {
    source: "Ministry of Finance",
    title: "Tender for Mobile Communication Services",
    description:
      "Provision of mobile and CUG services for government departments",
    url: "https://mof.gov.sl/tenders/123",
    bidCategory: "Communication",
    services: ["mobile", "cug"],
    publishDate: new Date(),
    closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    notified: false,
  },
  {
    source: "NPPA",
    title: "Internet and VPN Services Procurement",
    description: "National procurement for dedicated internet and VPN services",
    url: "https://nppa.gov.sl/tenders/456",
    bidCategory: "Connectivity",
    services: ["internet", "vpn"],
    publishDate: new Date(),
    closingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    notified: false,
  },
  {
    source: "Ministry of Health",
    title: "ICT Infrastructure Setup",
    description:
      "Implementation of network infrastructure and security systems",
    url: "https://mohs.gov.sl/tenders/789",
    bidCategory: "ICT",
    services: ["networking", "security"],
    publishDate: new Date(),
    closingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    notified: false,
  },
];

async function seedTestData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");

    // Clear existing test data
    await BidAlert.deleteMany({});
    console.log("Cleared existing bid alerts");

    // Insert test bids
    const result = await BidAlert.insertMany(testBids);
    console.log(`Inserted ${result.length} test bid alerts`);
  } catch (error) {
    console.error("Error seeding test data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedTestData();
