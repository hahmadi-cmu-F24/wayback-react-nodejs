import { useState } from "react";
import { db } from "./db";
import Popup from "./components/Popup";

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  function fetchViaProxy(url: string): Promise<Response> {
    const proxyUrl = "http://localhost:4000/proxy?url=" + encodeURIComponent(url);
    return fetch(proxyUrl);
  }

const fetchAsset = async (assetUrl: string, siteId: number, type: string) => {
  try {
    console.log("Fetching assetUrl:", assetUrl);
    // Pass raw assetUrl, NOT wrapped proxy URL
    const resp = await fetchViaProxy(assetUrl);
    const blob = await resp.blob();
    const blobUrl = URL.createObjectURL(blob);

    await db.assets.add({ siteId, type: type as "image" | "script" | "style", path: assetUrl, blob });
    return blobUrl;
  } catch (err) {
    console.warn("Failed to fetch asset:", assetUrl, err);
    return assetUrl; // fallback to original
  }
};


  const crawlPage = async (
    pageUrl: string,
    siteId: number,
    visited: Set<string>,
    baseDomain: string,
    depth: number
  ): Promise<void> => {
    if (visited.has(pageUrl) || depth > 2) return;
    visited.add(pageUrl);

    try {
      const resp = await fetchViaProxy(pageUrl);
      let htmlText = await resp.text();
      const doc = new DOMParser().parseFromString(htmlText, "text/html");

      // Fetch assets
      const assetSelectors = [
        { selector: "img[src]", attr: "src", type: "image" },
        { selector: "script[src]", attr: "src", type: "script" },
        { selector: "link[rel='stylesheet']", attr: "href", type: "style" }
      ];

      for (const { selector, attr, type } of assetSelectors) {
        const elements = Array.from(doc.querySelectorAll(selector));
        await Promise.all(elements.map(async (el) => {
          const assetLink = el.getAttribute(attr);
          if (assetLink) {
            const absoluteUrl = new URL(assetLink, pageUrl).href;
            if (absoluteUrl.startsWith(baseDomain)) {
              const blobUrl = await fetchAsset(absoluteUrl, siteId, type);
              el.setAttribute(attr, blobUrl);
            }
          }
        }));
      }

      htmlText = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;

      await db.assets.add({
        siteId,
        type: "html",
        path: pageUrl,
        blob: new Blob([htmlText], { type: "text/html" })
      });

      // Crawl links
      const links = Array.from(doc.querySelectorAll("a[href]"))
        .map(a => (a as HTMLAnchorElement).href)
        .filter(link => link.startsWith(baseDomain));

      await Promise.all(
        links.map(link => crawlPage(link, siteId, visited, baseDomain, depth + 1))
      );

    } catch (err) {
      console.warn("Failed to fetch page:", pageUrl, err);
    }
  };


  const saveSite = async () => {
    if (!url.startsWith("http")) {
      alert("Please enter a valid URL (http/https)");
      return;
    }

    setLoading(true);
    const timestamp = new Date().toISOString();
    const siteId = await db.sites.add({ url, timestamp });

    const baseDomain = new URL(url).origin;
    const visited = new Set<string>();

    await crawlPage(url, siteId, visited, baseDomain, 0);

    setLoading(false);

    setShowPopup(true);

    setUrl("");

  };

  return (
    <div className="container">
      <h1>Web Archiver</h1>
      <div className="input-button-group">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button onClick={saveSite} disabled={loading} className="button">
          {loading ? "Archiving..." : "Save Site"}
        </button>
      </div>
      
      {showPopup && (
        <Popup
          message="Site Archived! :)"
          onClose={() => setShowPopup(false)}
        />
      )}

    </div>
  );
}
