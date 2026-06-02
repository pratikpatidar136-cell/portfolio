import { list, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

// Check if Vercel Blob store token is active
const isBlobActive = () => !!process.env.BLOB_READ_WRITE_TOKEN;

// Fallback Local File Paths
const LOCAL_PORTFOLIO_PATH = path.join(process.cwd(), "src/data/portfolio.json");
const LOCAL_CONTACT_PATH = path.join(process.cwd(), "src/data/contact_messages.json");

// Portfolio JSON Operations
export async function readPortfolioData(): Promise<any> {
  if (isBlobActive()) {
    try {
      const response = await list({ prefix: "portfolio.json" });
      const blob = response.blobs.find((b) => b.pathname === "portfolio.json");

      if (blob) {
        const fetchRes = await fetch(blob.url, { cache: "no-store" });
        return await fetchRes.json();
      }

      // If not initialized in blob store, seed from local JSON
      const seedData = await fs.readFile(LOCAL_PORTFOLIO_PATH, "utf8");
      const parsed = JSON.parse(seedData);

      await put("portfolio.json", JSON.stringify(parsed, null, 2), {
        access: "public",
        addRandomSuffix: false,
      });

      return parsed;
    } catch (err) {
      console.error("Vercel Blob portfolio read error, falling back to local file:", err);
    }
  }

  // Local filesystem fallback
  const data = await fs.readFile(LOCAL_PORTFOLIO_PATH, "utf8");
  return JSON.parse(data);
}

export async function writePortfolioData(payload: any): Promise<void> {
  if (isBlobActive()) {
    try {
      await put("portfolio.json", JSON.stringify(payload, null, 2), {
        access: "public",
        addRandomSuffix: false,
      });
      return;
    } catch (err) {
      console.error("Vercel Blob portfolio write error:", err);
      if (process.env.VERCEL) {
        throw new Error(`Vercel Blob storage failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  await fs.writeFile(LOCAL_PORTFOLIO_PATH, JSON.stringify(payload, null, 2), "utf8");
}

// User Proposals Inbox Operations
export async function readContactSubmissions(): Promise<any[]> {
  if (isBlobActive()) {
    try {
      const response = await list({ prefix: "contact_messages.json" });
      const blob = response.blobs.find((b) => b.pathname === "contact_messages.json");

      if (blob) {
        const fetchRes = await fetch(blob.url, { cache: "no-store" });
        return await fetchRes.json();
      }

      // Seed with empty array
      await put("contact_messages.json", "[]", {
        access: "public",
        addRandomSuffix: false,
      });
      return [];
    } catch (err) {
      console.error("Vercel Blob contact messages read error, falling back to local file:", err);
    }
  }

  try {
    const data = await fs.readFile(LOCAL_CONTACT_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function writeContactSubmissions(payload: any[]): Promise<void> {
  if (isBlobActive()) {
    try {
      await put("contact_messages.json", JSON.stringify(payload, null, 2), {
        access: "public",
        addRandomSuffix: false,
      });
      return;
    } catch (err) {
      console.error("Vercel Blob contact messages write error:", err);
      if (process.env.VERCEL) {
        throw new Error(`Vercel Blob storage failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  await fs.writeFile(LOCAL_CONTACT_PATH, JSON.stringify(payload, null, 2), "utf8");
}
