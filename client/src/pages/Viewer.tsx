import { useEffect, useState } from "react";
import { db } from "../db";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "../index.css";
import Popup from "../components/Popup";

interface Site {
  id: number;
  url: string;
  timestamp: string;
}

export default function Viewer() {
  const [sites, setSites] = useState<Site[]>([]);
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    db.sites.toArray().then((data: Site[]) => setSites(data));
  }, []);

  const loadSite = async (siteId: number) => {
    const htmlAsset = await db.assets
      .where({ siteId, type: "html" })
      .first();

    if (!htmlAsset) {
      alert("No HTML found for this site");
      return;
    }

    const htmlBlobUrl = URL.createObjectURL(htmlAsset.blob);
    setIframeSrc(htmlBlobUrl);
  };

  const downloadSiteZip = async (siteId: number, siteUrl: string) => {
    const assets = await db.assets.where({ siteId }).toArray();
    const zip = new JSZip();

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      let filename = `file_${i}`;

      try {
        const urlPath = new URL(asset.path).pathname;
        filename = urlPath.split("/").filter(Boolean).pop() || filename;
      } catch {}

      if (asset.type === "html" && !filename.endsWith(".html")) {
        filename += ".html";
      }

      zip.file(filename, asset.blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    const safeName = siteUrl.replace(/(^\w+:|^)\/\//, "").replace(/[^\w.-]/g, "_");
    saveAs(content, `${safeName}.zip`);
  };

  return (
    <div className="viewer-container">
      <h1>Saved Archives</h1>
      {sites.length === 0 && <p>No sites archived yet.</p>}

      <ul className="site-list">
        {sites.map((site) => (
          <li key={site.id} className="site-list-item">
            <div className="site-list-item-content">
              <button
                className="site-load-button"
                onClick={() => loadSite(site.id)}
              >
                {site.url} ({new Date(site.timestamp).toLocaleString()})
              </button>
            </div>
            <button
              className="site-download-button"
              onClick={() => setShowPopup(true)}
              title="Download as ZIP"
            >
              ⬇️
            </button>
            {showPopup && (
              <Popup
                message="Save files to zip?"
                onConfirm={() => downloadSiteZip(site.id, site.url)}
                onCancel={() => setShowPopup(false)}
                onClose={() => setShowPopup(false)}
                confirmText="Yes"
                cancelText="No"
              />
            )}
          </li>
        ))}
      </ul>

      {iframeSrc && (
        <iframe
          src={iframeSrc}
          title="Archived Site"
          className="archived-iframe"
        />
      )}
    </div>
  );
}
