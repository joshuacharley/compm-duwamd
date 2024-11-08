import axios from "axios";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import BidAlert from "../models/BidAlert";
import { sendBidAlert } from "../lib/emailService";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Service categories and keywords
const serviceCategories = {
  Communication: [
    "mobile",
    "postpaid",
    "prepaid",
    "cug",
    "group communication",
    "telecom",
  ],
  Connectivity: [
    "internet",
    "vpn",
    "speedbox",
    "airbox",
    "m2m",
    "connectivity",
    "network",
  ],
  Collaboration: ["sms", "toll free", "short code", "ussd", "apn", "pabx"],
  ICT: [
    "security",
    "networking",
    "virtualization",
    "it services",
    "cloud",
    "infrastructure",
  ],
};

const websites = [
  { url: "https://mof.gov.sl/", name: "Ministry of Finance" },
  { url: "https://mowpa.gov.sl/", name: "Ministry of Works" },
  { url: "https://mohs.gov.sl/", name: "Ministry of Health" },
  { url: "https://mbsse.gov.sl/", name: "Ministry of Education" },
  { url: "https://mlgrd.gov.sl/", name: "Local Government" },
  { url: "https://nppa.gov.sl/", name: "NPPA" },
  {
    url: "https://www.tendersinfo.com/global-sierra-leone-tenders.php",
    name: "TendersInfo",
  },
];

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI environment variable is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

function categorizeContent(
  text: string
): { category: string; services: string[] } | null {
  text = text.toLowerCase();

  for (const [category, keywords] of Object.entries(serviceCategories)) {
    const matchedServices = keywords.filter((keyword) =>
      text.includes(keyword.toLowerCase())
    );
    if (matchedServices.length > 0) {
      return { category, services: matchedServices };
    }
  }

  return null;
}

async function scrapeWebsite(website: { url: string; name: string }) {
  try {
    const response = await axios.get(website.url);
    const $ = cheerio.load(response.data);
    const bids: any[] = [];

    // Adjust selectors based on each website's structure
    $("a").each((_, element) => {
      const href = $(element).attr("href");
      const text = $(element).text().trim();

      if (
        href &&
        text &&
        (text.toLowerCase().includes("tender") ||
          text.toLowerCase().includes("bid") ||
          text.toLowerCase().includes("procurement"))
      ) {
        const categorization = categorizeContent(text);
        if (categorization) {
          bids.push({
            source: website.name,
            title: text,
            url: new URL(href, website.url).toString(),
            bidCategory: categorization.category,
            services: categorization.services,
            publishDate: new Date(),
          });
        }
      }
    });

    return bids;
  } catch (error) {
    console.error(`Error scraping ${website.name}:`, error);
    return [];
  }
}

async function monitorBids() {
  await connectDB();

  try {
    const newBids: any[] = [];

    for (const website of websites) {
      const bids = await scrapeWebsite(website);
      newBids.push(...bids);
    }

    // Filter and save new bids
    const savedBids = [];
    for (const bid of newBids) {
      try {
        const savedBid = await BidAlert.create(bid);
        savedBids.push(savedBid);
      } catch (error: any) {
        // Skip duplicate bids (due to unique index)
        if (error.code !== 11000) {
          console.error("Error saving bid:", error);
        }
      }
    }

    // Send email alert if new bids were found
    if (savedBids.length > 0) {
      await sendBidAlert(savedBids);
    }

    console.log(`Monitoring complete. Found ${savedBids.length} new bids.`);
  } catch (error) {
    console.error("Error in bid monitoring:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the monitoring process
monitorBids();
