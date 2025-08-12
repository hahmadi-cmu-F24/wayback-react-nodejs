# wayback-react-nodejs
End-to-end web archiving tool similar to the Wayback Machine. Given a URL, the application fetches that page (and related pages) and preserves them so that they can be accessed as snapshots later. 

# Setup Instructions
Prerequisites
Node.js (v16 or newer recommended)

npm or yarn package manager

Git (optional, for cloning)

1. Clone the Repository

  $ git clone https://github.com/hahmadi-cmu-F24/wayback-react-nodejs
  $ cd YOUR_REPO

2. Setup Backend Proxy Server
   
  $ cd backend

  $ npm install

  Run the backend server (proxy)

  $ node server.js

  The proxy server will listen on http://localhost:4000.

3. Setup React Frontend
   
In a new terminal window/tab:
  $ cd frontend
  $ npm install
  $ npm run dev
  By default, the React app will run at http://localhost:5173 (or similar, as Vite chooses).

5. How to Use
  
  Open the React app in your browser at http://localhost:5173.
  
  Enter a URL you want to archive, e.g. https://example.com.
  
  Click Save Site to archive the page and related assets.
  
  View saved archives under View Archives.
  
  Download full archives as ZIP files.

6. Notes
   
  The proxy server is required to bypass CORS restrictions when fetching external sites.
  
  Make sure both backend and frontend servers are running simultaneously.
  
  The app uses IndexedDB for local storage of archives.
  
  Troubleshooting
  If you get CORS errors, verify the proxy server is running and your URLs are correct.
  
  If downloads fail, ensure the ZIP generation libraries (jszip, file-saver) are installed in frontend.
  
  For any issues, check your browser console and terminal output.


# URL Archiving:

User enters any URL, and the app crawls that page plus linked pages on the same domain (up to a depth limit), grabbing HTML, images, stylesheets, and scripts.

Proxy Fetching to Avoid CORS:

Uses a local Node.js proxy server to fetch content, bypassing CORS restrictions browsers have.

IndexedDB Storage:

Stores crawled site data (pages, assets) locally in IndexedDB for offline viewing and persistence.

Archive Listing:

Shows a list of all saved sites with their URLs and timestamps.

View Saved Archives:

Loads archived pages inside an iframe to allow offline browsing of saved content.

Download Archive as ZIP:

Bundles all assets of a saved site into a ZIP file for download, letting users export their archives.

Popup Confirmation:

Custom popup component used for confirmations or alerts, with flexible buttons.

# Notes
I coded this in JavaScript and CSS, implementing Node.JS. One of the most important decisions I made was the naming and structure of the files and folders. I made sure to use client and server because this is common in many web development projects. I also split the folders into components pages, public itemsm, and styling. I made sure to use as little in-line style as possible in order to make future development on this simpler. I reused the pop-up components twice. With more time I would work on mockups for the UI. I would also implement a search feature in the archive URL page. I would also focus on the various views for this page, making sure that any dimension would work with our Web App. to make this more scalable, I would switch the storage option from Dexie.js to a third-party server that can host terabytes of data. This would allow our clients to store many more URLs and pages. I would also increase accessibility by implementing a speech to text control so users can use our website without needing to type or click. Lastly, since our clients would be financial firms, I would implement a feature that would provide the user with insight data about the pages that are being stored using a machine learning model. This can hold financial information for their clients, or business related data such as statistics on the case that they were working based on previous pages archived. It can also suggest related archived pages from the url they just archived or downloaded. 

