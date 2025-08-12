const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing url parameter");

  console.log(`Proxy fetching: ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (ArchiverBot/1.0)"
      },
    });

    if (!response.ok) {
      console.error(`Fetch failed with status ${response.status} for ${targetUrl}`);
      return res.status(response.status).send(`Failed to fetch URL: ${targetUrl}`);
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    res.set("Content-Type", contentType);
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Proxy fetch error:", error);
    res.status(500).send("Failed to fetch URL");
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});
