import { config } from "dotenv";
import path from "path";
import mongoose from "mongoose";
import BidAlert from "../models/BidAlert";
import { sendBidAlert } from "../lib/emailService";

// Load test environment variables
config({ path: path.resolve(__dirname, "../.env.test") });

const testBids = [
  {
    source: "Ministry of Finance",
    title: "[TEST] Mobile Network Infrastructure Tender",
    description: "Test bid for mobile network infrastructure and CUG services",
    url: "https://mof.gov.sl/test-tender-123",
    bidCategory: "Communication",
    services: ["mobile", "cug"],
    publishDate: new Date(),
    closingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    notified: false,
  },
  {
    source: "NPPA",
    title: "[TEST] Enterprise Internet Services",
    description: "Test bid for dedicated internet and VPN services",
    url: "https://nppa.gov.sl/test-tender-456",
    bidCategory: "Connectivity",
    services: ["internet", "vpn"],
    publishDate: new Date(),
    closingDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    notified: false,
  },
  {
    source: "Ministry of Health",
    title: "[TEST] Healthcare Communication System",
    description: "Test bid for integrated healthcare communication platform",
    url: "https://mohs.gov.sl/test-tender-789",
    bidCategory: "ICT",
    services: ["networking", "security", "cloud"],
    publishDate: new Date(),
    closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    notified: false,
  },
];

async function runBidAlertTest() {
  try {
    // Connect to test database
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not set in test environment");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to test database");

    // Clear existing test data
    await BidAlert.deleteMany({});
    console.log("Cleared existing test bid alerts");

    // Insert test bids
    const savedBids = await BidAlert.insertMany(testBids);
    console.log(`Inserted ${savedBids.length} test bid alerts`);

    // Test email notification
    console.log("Testing email notification...");
    await sendBidAlert(savedBids);
    console.log("Test email sent successfully");

    // Verify bid alerts in database
    const alerts = await BidAlert.find({});
    console.log("\nStored Bid Alerts:");
    alerts.forEach((alert) => {
      console.log(`- ${alert.title}`);
      console.log(`  Category: ${alert.bidCategory}`);
      console.log(`  Services: ${alert.services.join(", ")}`);
      console.log(`  URL: ${alert.url}\n`);
    });
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Test completed");
  }
}

// Run the test
runBidAlertTest();
