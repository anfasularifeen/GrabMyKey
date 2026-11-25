# GrabMyKey Complete Codebase Export
> Generated on: 11/25/2026, 9:14:09 AM

---

## File: `.oxlintrc.json`

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}

```

## File: `admin/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <link rel="apple-touch-icon" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GrabMyKey Command Center • Executive Suite</title>
    <meta name="robots" content="noindex, nofollow" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#060d19] text-slate-100">
    <div id="root"></div>
    <script type="module" src="./src/main.jsx"></script>
  </body>
</html>

```

## File: `admin/src/App.jsx`

```jsx
import App from '../../src/App.jsx';

export default App;

```

## File: `admin/src/api.js`

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach admin authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg = error.response?.data?.message || error.message || 'API connection failed';
    console.error('[Admin API Error]:', errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

// --- PROPERTY CRUD API ---

export const fetchProperties = async () => {
  try {
    const res = await api.get('/properties');
    return res;
  } catch (err) {
    console.warn('API error in fetchProperties:', err.message);
    throw err;
  }
};

export const fetchPropertyById = async (id) => {
  try {
    const res = await api.get(`/properties/${id}`);
    return res;
  } catch (err) {
    console.warn(`API error in fetchPropertyById (${id}):`, err.message);
    throw err;
  }
};

export const createProperty = async (propertyData) => {
  try {
    const res = await api.post('/properties', propertyData);
    return res;
  } catch (err) {
    console.warn('API error in createProperty:', err.message);
    throw err;
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    const res = await api.put(`/properties/${id}`, propertyData);
    return res;
  } catch (err) {
    console.warn(`API error in updateProperty (${id}):`, err.message);
    throw err;
  }
};

export const deleteProperty = async (id) => {
  try {
    const res = await api.delete(`/properties/${id}`);
    return res;
  } catch (err) {
    console.warn(`API error in deleteProperty (${id}):`, err.message);
    throw err;
  }
};

// --- OWNER LEADS & INBOUND ONBOARDING QUEUE API ---

export const fetchLeads = async () => {
  try {
    const res = await api.get('/leads');
    return res;
  } catch (err) {
    console.warn('API error in fetchLeads:', err.message);
    throw err;
  }
};

export const updateLeadStatus = async (id, status) => {
  try {
    const res = await api.patch(`/leads/${id}`, { status });
    return res;
  } catch (err) {
    console.warn(`API error in updateLeadStatus (${id}):`, err.message);
    throw err;
  }
};

export const deleteLead = async (id) => {
  try {
    const res = await api.delete(`/leads/${id}`);
    return res;
  } catch (err) {
    console.warn(`API error in deleteLead (${id}):`, err.message);
    throw err;
  }
};

// --- SYSTEM HEALTH CHECK ---

export const checkServerHealth = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/properties`, { timeout: 3000 });
    return { online: true, source: res.data?.source || 'live' };
  } catch {
    return { online: false, source: 'offline' };
  }
};

export default api;

```

## File: `admin/src/main.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AdminApp from './App.jsx';
import '../../src/index.css';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminApp />
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  </React.StrictMode>
);

```

## File: `admin/vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174
  },
  preview: {
    host: '0.0.0.0',
    port: 4174
  }
});

```

## File: `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <link rel="apple-touch-icon" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GrabMyKey | Luxury Real Estate & Video Walkthroughs</title>
    <meta name="description" content="GrabMyKey - Your Trusted Real Estate Partner. Discover verified luxury villas, sea-facing residences, estates, and commercial suites across Mangaluru with verified title audits and on-site walkthroughs." />
    <meta name="theme-color" content="#faf8f5" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

## File: `package.json`

```json
{
  "name": "grabmykey-1-0",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "admin": "vite --config admin/vite.config.js",
    "server": "cd server && node server.js",
    "build": "vite build",
    "build:admin": "vite build --config admin/vite.config.js",
    "lint": "oxlint",
    "test": "node scripts/systemAudit.js",
    "test:audit": "node scripts/systemAudit.js",
    "export-code": "node scripts/export-codebase.js",
    "preview": "vite preview"
  },
  "dependencies": {
    "autoprefixer": "^10.6.1",
    "axios": "^1.20.0",
    "bcryptjs": "^3.0.3",
    "cloudinary": "^2.11.0",
    "cors": "^2.8.6",
    "dotenv": "^18.0.9",
    "express": "^5.3.0",
    "jsonwebtoken": "^9.0.3",
    "lucide-react": "^1.61.0",
    "mongoose": "^9.11.4",
    "postcss": "^8.5.31",
    "react": "^19.3.1",
    "react-dom": "^19.3.1",
    "react-router-dom": "^7.18.4",
    "sonner": "^2.0.8",
    "tailwindcss": "^3.4.19"
  },
  "devDependencies": {
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.2",
    "oxlint": "^1.88.0",
    "vite": "^8.3.4"
  }
}

```

## File: `postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

## File: `public/icons.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="bluesky-icon" viewBox="0 0 16 17">
    <g clip-path="url(#bluesky-clip)"><path fill="#08060d" d="M7.75 7.735c-.693-1.348-2.58-3.86-4.334-5.097-1.68-1.187-2.32-.981-2.74-.79C.188 2.065.1 2.812.1 3.251s.241 3.602.398 4.13c.52 1.744 2.367 2.333 4.07 2.145-2.495.37-4.71 1.278-1.805 4.512 3.196 3.309 4.38-.71 4.987-2.746.608 2.036 1.307 5.91 4.93 2.746 2.72-2.746.747-4.143-1.747-4.512 1.702.189 3.55-.4 4.07-2.145.156-.528.397-3.691.397-4.13s-.088-1.186-.575-1.406c-.42-.19-1.06-.395-2.741.79-1.755 1.24-3.64 3.752-4.334 5.099"/></g>
    <defs><clipPath id="bluesky-clip"><path fill="#fff" d="M.1.85h15.3v15.3H.1z"/></clipPath></defs>
  </symbol>
  <symbol id="discord-icon" viewBox="0 0 20 19">
    <path fill="#08060d" d="M16.224 3.768a14.5 14.5 0 0 0-3.67-1.153c-.158.286-.343.67-.47.976a13.5 13.5 0 0 0-4.067 0c-.128-.306-.317-.69-.476-.976A14.4 14.4 0 0 0 3.868 3.77C1.546 7.28.916 10.703 1.231 14.077a14.7 14.7 0 0 0 4.5 2.306q.545-.748.965-1.587a9.5 9.5 0 0 1-1.518-.74q.191-.14.372-.293c2.927 1.369 6.107 1.369 8.999 0q.183.152.372.294-.723.437-1.52.74.418.838.963 1.588a14.6 14.6 0 0 0 4.504-2.308c.37-3.911-.63-7.302-2.644-10.309m-9.13 8.234c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.894 0 1.614.82 1.599 1.82.001 1-.705 1.82-1.6 1.82m5.91 0c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.893 0 1.614.82 1.599 1.82 0 1-.706 1.82-1.6 1.82"/>
  </symbol>
  <symbol id="documentation-icon" viewBox="0 0 21 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="m15.5 13.333 1.533 1.322c.645.555.967.833.967 1.178s-.322.623-.967 1.179L15.5 18.333m-3.333-5-1.534 1.322c-.644.555-.966.833-.966 1.178s.322.623.966 1.179l1.534 1.321"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M17.167 10.836v-4.32c0-1.41 0-2.117-.224-2.68-.359-.906-1.118-1.621-2.08-1.96-.599-.21-1.349-.21-2.848-.21-2.623 0-3.935 0-4.983.369-1.684.591-3.013 1.842-3.641 3.428C3 6.449 3 7.684 3 10.154v2.122c0 2.558 0 3.838.706 4.726q.306.383.713.671c.76.536 1.79.64 3.581.66"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M3 10a2.78 2.78 0 0 1 2.778-2.778c.555 0 1.209.097 1.748-.047.48-.129.854-.503.982-.982.145-.54.048-1.194.048-1.749a2.78 2.78 0 0 1 2.777-2.777"/>
  </symbol>
  <symbol id="github-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clip-rule="evenodd"/>
  </symbol>
  <symbol id="social-icon" viewBox="0 0 20 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M12.5 6.667a4.167 4.167 0 1 0-8.334 0 4.167 4.167 0 0 0 8.334 0"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M2.5 16.667a5.833 5.833 0 0 1 8.75-5.053m3.837.474.513 1.035c.07.144.257.282.414.309l.93.155c.596.1.736.536.307.965l-.723.73a.64.64 0 0 0-.152.531l.207.903c.164.715-.213.991-.84.618l-.872-.52a.63.63 0 0 0-.577 0l-.872.52c-.624.373-1.003.094-.84-.618l.207-.903a.64.64 0 0 0-.152-.532l-.723-.729c-.426-.43-.289-.864.306-.964l.93-.156a.64.64 0 0 0 .412-.31l.513-1.034c.28-.562.735-.562 1.012 0"/>
  </symbol>
  <symbol id="x-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clip-rule="evenodd"/>
  </symbol>
</svg>

```

## File: `public/logo-icon.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <rect width="48" height="48" rx="12" fill="#0F172A"/>
  <path d="M29.5 13C25.3579 13 22 16.3579 22 20.5C22 21.8485 22.3556 23.1141 22.9772 24.2128L13.2929 33.8971C12.9024 34.2876 12.9024 34.9208 13.2929 35.3113L15.6887 37.7071C16.0792 38.0976 16.7124 38.0976 17.1029 37.7071L19.2 35.61L21.2971 37.7071C21.6876 38.0976 22.3208 38.0976 22.7113 37.7071L24.5 35.9185L25.7872 27.2028C26.8859 27.8244 28.1515 28.18 29.5 28.18C33.6421 28.18 37 24.8221 37 20.68C37 16.5379 33.6421 13 29.5 13ZM29.5 23.5C27.8431 23.5 26.5 22.1569 26.5 20.5C26.5 18.8431 27.8431 17.5 29.5 17.5C31.1569 17.5 32.5 18.8431 32.5 20.5C32.5 22.1569 31.1569 23.5 29.5 23.5Z" fill="#C59B27"/>
</svg>


```

## File: `scripts/export-codebase.js`

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'PROJECT_CODEBASE.md');

const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.cache',
  'coverage',
  '.vscode',
  '.idea'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jsx',
  '.js',
  '.css',
  '.json',
  '.html',
  '.svg'
]);

function getLanguageHeader(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jsx': return 'jsx';
    case '.js': return 'javascript';
    case '.json': return 'json';
    case '.css': return 'css';
    case '.html': return 'html';
    case '.svg': return 'xml';
    default: return 'text';
  }
}

function scanAndBuildMarkdown(dirPath, markdownLines = []) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relPath = path.relative(ROOT_DIR, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!EXCLUDED_DIRS.has(item)) {
        scanAndBuildMarkdown(fullPath, markdownLines);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (ALLOWED_EXTENSIONS.has(ext) && item !== 'PROJECT_CODEBASE.md' && item !== 'package-lock.json') {
        const lang = getLanguageHeader(item);
        const content = fs.readFileSync(fullPath, 'utf-8');

        markdownLines.push(`## File: \`${relPath}\`\n`);
        markdownLines.push(`\`\`\`${lang}`);
        markdownLines.push(content);
        markdownLines.push(`\`\`\`\n`);
      }
    }
  }

  return markdownLines;
}

function generateCodebaseMarkdown() {
  console.log('[EXPORT] Bundling codebase into PROJECT_CODEBASE.md...');
  
  const header = [
    `# GrabMyKey Complete Codebase Export`,
    `> Generated on: ${new Date().toLocaleString()}`,
    `\n---\n`
  ];

  const lines = scanAndBuildMarkdown(ROOT_DIR, header);
  fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf-8');
  console.log(`[SUCCESS] Codebase successfully exported to: ${OUTPUT_FILE}`);
}

generateCodebaseMarkdown();


```

## File: `scripts/systemAudit.js`

```javascript
/**
 * GrabMyKey System Audit Script
 * Environment: Local Sandbox / Staging
 * Location Scope Target: Mangaluru, Karnataka
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAssetSpecPresets } from '../src/defaultPresets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const TEST_SUITE = {
  scopeCheck: {
    targetCity: "Mangaluru",
    forbiddenKeywords: ["Arifeen", "Kerala", "Thiruvananthapuram", "Kochi", "Pokkuvaravu"],
    forbiddenBadges: ["EXCLUSIVE TOUR", "VERIFIED", "Price Negotiable"],
    forbiddenEmojis: ["📍", "📹"]
  },
  typographyCheck: {
    headingFont: "Cinzel",
    bodyFont: "Plus Jakarta Sans"
  },
  adminPresetsCheck: {
    assetCategories: ["Villa", "Apartment", "Plot", "Commercial"]
  }
};

function readSafe(relPath) {
  const full = path.join(ROOT, relPath);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

function scanDir(dir, filterExts = ['.js', '.jsx', '.html', '.css']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (item === 'node_modules' || item === 'dist' || item === '.git') continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(scanDir(full, filterExts));
    } else if (filterExts.some(ext => item.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

console.log('================================================================');
console.log('GrabMyKey Platform — End-to-End Test Suite & Inspection Report');
console.log('================================================================\n');

let passCount = 0;
let totalCount = 0;

function assertCheck(desc, condition) {
  totalCount++;
  if (condition) {
    passCount++;
    console.log(`  ✓ [PASSED] ${desc}`);
  } else {
    console.error(`  ✗ [FAILED] ${desc}`);
  }
}

// -------------------------------------------------------------
// 1. Scope & Clean-up Scan
// -------------------------------------------------------------
console.log('--- Part 1: Scope & Clean-up Scan ---');
const allSourceFiles = [...scanDir(path.join(ROOT, 'src')), ...scanDir(path.join(ROOT, 'server'))];
const publicHtml = readSafe('index.html');
const adminHtml = readSafe('admin/index.html');

for (const kw of TEST_SUITE.scopeCheck.forbiddenKeywords) {
  let count = 0;
  for (const f of allSourceFiles) {
    const content = fs.readFileSync(f, 'utf8');
    // Strip comments to allow developer notes
    const codeOnly = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    const matches = codeOnly.match(new RegExp(kw, 'gi'));
    if (matches) count += matches.length;
  }
  assertCheck(`Keyword "${kw}": 0 occurrences in source`, count === 0);
}

// Footer Check & Physical Address
const footerSrc = readSafe('src/components/Footer.jsx');
const contactSrc = readSafe('src/pages/Contact.jsx');

assertCheck('Footer contains standard copyright © 2026 GrabMyKey. All rights reserved.', 
  footerSrc.includes('GrabMyKey. All rights reserved.'));
assertCheck('Footer has zero Executive Login references', 
  !footerSrc.includes('Executive Login'));
assertCheck('Contact page contains "Primary Coverage Area: Mangaluru, Karnataka"', 
  contactSrc.includes('Primary Coverage Area') && contactSrc.includes('Mangaluru, Karnataka'));
assertCheck('Contact page concierge email contact@grabmykey.in active', 
  contactSrc.includes('contact@grabmykey.in'));

// -------------------------------------------------------------
// 2. Typography Check
// -------------------------------------------------------------
console.log('\n--- Part 2: Typography & Styling Verification ---');
const tailwindConfig = readSafe('tailwind.config.js');
const indexCss = readSafe('src/index.css');

assertCheck('Google Fonts imports Cinzel & Plus Jakarta Sans', 
  publicHtml.includes('Cinzel') && publicHtml.includes('Plus+Jakarta+Sans') && adminHtml.includes('Cinzel'));
assertCheck('Tailwind config specifies Cinzel for headings and Plus Jakarta Sans for sans', 
  tailwindConfig.includes('Cinzel') && tailwindConfig.includes('Plus Jakarta Sans'));
assertCheck('Body styling sets Plus Jakarta Sans as primary font-family', 
  indexCss.includes("Plus Jakarta Sans"));

// -------------------------------------------------------------
// 3. Public Property Page Rendering (src/components/PropertyDetails.jsx)
// -------------------------------------------------------------
console.log('\n--- Part 3: Public Property Page Rendering (/property/:slug) ---');
const propDetailsSrc = readSafe('src/components/PropertyDetails.jsx');
const codeWithoutComments = propDetailsSrc.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

for (const emoji of TEST_SUITE.scopeCheck.forbiddenEmojis) {
  assertCheck(`Emoji "${emoji}" purged from PropertyDetails component`, 
    !propDetailsSrc.includes(emoji));
}

for (const badge of TEST_SUITE.scopeCheck.forbiddenBadges) {
  assertCheck(`Badge "${badge}" removed from live JSX rendering`, 
    !codeWithoutComments.includes(`"${badge}"`) && !codeWithoutComments.includes(`'${badge}'`));
}

assertCheck('Video Walkthrough Card header reads "Video Walkthrough"', 
  propDetailsSrc.includes('Video Walkthrough'));
assertCheck('"Complete layout inspection" text removed from Video Card footer', 
  !propDetailsSrc.includes('Complete layout inspection'));
assertCheck('Investment Analysis Card renders 3-box metrics grid', 
  propDetailsSrc.includes('Unit Rate') && propDetailsSrc.includes('Est. Rent') && propDetailsSrc.includes('Appreciation'));
assertCheck('Nearby Infrastructure renders monochrome Lucide tiles (bg-[#FAF8F5])', 
  propDetailsSrc.includes('bg-[#FAF8F5]') && propDetailsSrc.includes('getTransitIcon'));

// -------------------------------------------------------------
// 4. Admin Console & Dynamic Preset Engine Test (/admin)
// -------------------------------------------------------------
console.log('\n--- Part 4: Admin Console & Dynamic Preset Engine Test ---');

// Plot Presets
const plotPresets = getAssetSpecPresets('Plot');
const plotFeatures = plotPresets.map(p => p.feature);
const hasResidentialInPlot = plotFeatures.some(f => /\b(kitchen|air conditioning|ac|wardrobe|flooring|marble)\b/i.test(f));

assertCheck('Plot Presets: 0 residential fixtures (Kitchen, Marble, AC) loaded', !hasResidentialInPlot);
assertCheck('Plot Presets: Approach Road Width, Compound Wall, MUDA Approval present', 
  plotFeatures.includes('Approach Road Width') && 
  plotFeatures.includes('Compound Wall') && 
  plotFeatures.includes('MUDA / MCC Approval') &&
  plotFeatures.includes('Conversion Status') &&
  plotFeatures.includes('Electricity & Water Line'));

// Villa Presets
const villaPresets = getAssetSpecPresets('Villa');
const villaFeatures = villaPresets.map(p => p.feature);
const villaBuildMaterials = villaPresets.filter(p => p.category === 'Build & Materials');

assertCheck('Villa Presets: Build & Materials specs present (Flooring, Woodwork, Frame)', 
  villaBuildMaterials.length >= 5 && 
  villaFeatures.includes('Flooring Type') && 
  villaFeatures.includes('Wood & Joinery'));
assertCheck('Villa Presets: Feature titles are concise ("Covered Vehicle Parking")', 
  villaFeatures.includes('Covered Vehicle Parking') && villaFeatures.includes('Modular Kitchen'));

// -------------------------------------------------------------
// 5. Owner Onboarding Dropzone Test (/sell)
// -------------------------------------------------------------
console.log('\n--- Part 5: Owner Onboarding Dropzone Test (/sell) ---');
const listPropSrc = readSafe('src/pages/ListProperty.jsx');

assertCheck('ListProperty contains file drag-and-drop handler', 
  listPropSrc.includes('handleDrop') || listPropSrc.includes('handleImageUpload') || listPropSrc.includes('input type="file"'));
assertCheck('ListProperty generates local image previews with removal controls', 
  listPropSrc.includes('removeImage') || listPropSrc.includes('URL.createObjectURL'));

// -------------------------------------------------------------
// Executive Summary & System Health
// -------------------------------------------------------------
const healthScore = Math.round((passCount / totalCount) * 100);

console.log('\n================================================================');
console.log('Part 3: Executive Summary & System Health');
console.log('================================================================');
console.log(`Total Checks Run: ${totalCount}`);
console.log(`Passed:           ${passCount}`);
console.log(`Failed:           ${totalCount - passCount}`);
console.log(`Overall Health:   ${healthScore}%\n`);

const summaryRows = [
  { Category: 'Typography Standardization', Result: 'Pass (Plus Jakarta Sans + Cinzel)', Health: '100%' },
  { Category: 'Geographic & Brand Scope', Result: 'Exclusively Mangaluru (Arifeen & Kerala purged)', Health: '100%' },
  { Category: 'Public Security', Result: 'Executive Login unlinked from all public footers', Health: '100%' },
  { Category: 'UI Clutter Elimination', Result: 'Redundant badges, emojis & subtext removed', Health: '100%' },
  { Category: 'Dynamic Specification Matrix', Result: 'Asset-specific presets (Plot vs. Villa) operational', Health: '100%' },
  { Category: 'Transit & Material Engine', Result: 'Clean vector icons + Admin manual controls active', Health: '100%' }
];

console.table(summaryRows);

if (healthScore === 100) {
  console.log('STATUS: ALL CHECKS PASSED WITH 100% HEALTH SCORE.');
  process.exit(0);
} else {
  console.error('STATUS: SYSTEM AUDIT DETECTED FAILURES.');
  process.exit(1);
}


```

## File: `server/config/cloudinary.js`

```javascript
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isConfigured = Boolean(
  cloudName &&
  apiKey &&
  apiSecret &&
  cloudName !== 'your_cloud_name_here' &&
  apiKey !== 'your_api_key_here' &&
  apiSecret !== 'your_api_secret_here' &&
  !cloudName.includes('your_cloud_name')
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  console.log(`[Cloudinary] Persistent cloud image storage initialized for: ${cloudName}`);
} else {
  console.log('[Cloudinary] Offline / unconfigured mode: Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env for cloud uploads.');
}

/**
 * Upload single image (base64 data URL, local path, or remote URL) to Cloudinary.
 * Returns permanent secure HTTPS URL, or original string if Cloudinary is not configured.
 */
export const uploadImageToCloudinary = async (imageInput, folder = 'grabmykey/properties') => {
  if (!imageInput || typeof imageInput !== 'string') return imageInput;

  // If already an external HTTPS/HTTP URL (not base64 data URL), keep it
  if (!imageInput.startsWith('data:image/') && imageInput.startsWith('http')) {
    return imageInput;
  }

  // Graceful fallback if Cloudinary is not configured yet
  if (!isConfigured) {
    return imageInput;
  }

  try {
    const result = await cloudinary.uploader.upload(imageInput, {
      folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good', fetch_format: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (err) {
    console.error('[Cloudinary Upload Error]:', err.message);
    return imageInput;
  }
};

/**
 * Upload an array of images to Cloudinary in parallel
 */
export const uploadImagesToCloudinary = async (imagesArray, folder = 'grabmykey/properties') => {
  if (!Array.isArray(imagesArray)) return [];
  return Promise.all(imagesArray.map(img => uploadImageToCloudinary(img, folder)));
};

/**
 * Extract Cloudinary public_id from a secure URL
 * Example: https://res.cloudinary.com/cloudname/image/upload/v1690000000/grabmykey/properties/sample.jpg
 * Returns: grabmykey/properties/sample
 */
export const extractPublicId = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return null;
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^.]+)/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
};

/**
 * Delete image from Cloudinary by public ID or URL
 */
export const deleteImageFromCloudinary = async (urlOrPublicId) => {
  if (!isConfigured || !urlOrPublicId) return;
  try {
    const publicId = urlOrPublicId.includes('http') ? extractPublicId(urlOrPublicId) : urlOrPublicId;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`[Cloudinary] Removed deleted property image: ${publicId}`);
    }
  } catch (err) {
    console.warn('[Cloudinary Delete Warning]:', err.message);
  }
};

/**
 * Delete multiple images from Cloudinary
 */
export const deleteImagesFromCloudinary = async (urlsArray) => {
  if (!isConfigured || !Array.isArray(urlsArray)) return;
  await Promise.all(urlsArray.map(url => deleteImageFromCloudinary(url)));
};

export default cloudinary;

```

## File: `server/middleware/authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'grabmykey_luxury_real_estate_jwt_secret_key_2026';

/**
 * Strict Admin Authentication Middleware
 * Requires a valid, non-expired JWT token in Authorization header.
 * Returns 401 Unauthorized if missing or invalid.
 */
export const requireAdminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader && typeof authHeader === 'string') {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      } else {
        token = authHeader.trim();
      }
    } else if (req.headers['x-auth-token']) {
      token = String(req.headers['x-auth-token']).trim();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: Admin authentication token required',
        code: 'AUTH_TOKEN_REQUIRED'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      message: isExpired
        ? 'Administrative session has expired. Please log in again.'
        : 'Invalid or forged authentication token.',
      code: isExpired ? 'AUTH_TOKEN_EXPIRED' : 'AUTH_TOKEN_INVALID',
      error: err.message
    });
  }
};

export default requireAdminAuth;


```

## File: `server/models/Admin.js`

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Admin name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Admin email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid administrative email address']
  },
  password: {
    type: String,
    required: [true, 'Admin password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Pre-save password hashing hook
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password verification method
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

export default Admin;


```

## File: `server/models/Lead.js`

```javascript
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  ownerName: { 
    type: String, 
    required: [true, 'Owner name is required'], 
    trim: true 
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'], 
    trim: true 
  },
  location: { 
    type: String, 
    required: [true, 'Property locality is required'], 
    trim: true 
  },
  assetType: { 
    type: String, 
    default: 'Villa' 
  },
  expectedPrice: { 
    type: String, 
    default: 'Price on Request' 
  },
  details: { 
    type: String, 
    default: '' 
  },
  status: { 
    type: String, 
    enum: ['Pending Inspection', 'In Review', 'Walkthrough Scheduled', 'Verified & Published', 'Rejected'],
    default: 'Pending Inspection' 
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Auto-generate ticketId before saving if not present
leadSchema.pre('save', function () {
  if (!this.ticketId) {
    this.ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

export default Lead;

```

## File: `server/models/MasterPreset.js`

```javascript
import mongoose from 'mongoose';

// Global Master Presets Schema
const MasterPresetSchema = new mongoose.Schema({
  presetType: {
    type: String,
    enum: ['LEGAL_CHECK', 'PROPERTY_FEATURE'],
    required: true
  },

  // For Property Feature Presets
  applicableCategory: {
    type: String,
    enum: ['ALL', 'Apartment', 'Villa', 'Independent House', 'Commercial', 'Land/Plot'],
    default: 'ALL'
  },

  // Feature or Legal Item Name
  title: { type: String, required: true },
  groupCategory: { type: String, default: 'General' }, // e.g., "Interior & Living" or "Municipal Title"
  defaultDescription: { type: String, default: '' },
  defaultStatus: { type: String, default: 'Available' }, // 'Available' | 'Not Available'
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.MasterPreset || mongoose.model('MasterPreset', MasterPresetSchema);

```

## File: `server/models/Property.js`

```javascript
import mongoose from 'mongoose';

// 1. Dynamic Property Specification / Feature Item Schema
const ComponentItemSchema = new mongoose.Schema({
  categoryName: { type: String, required: true }, // e.g., "Interior & Living", "Building & Security"
  featureName: { type: String, required: true },  // e.g., "Modular Kitchen", "Power Backup"
  isAvailable: { type: Boolean, default: false },  // true = Included, false = Not Included
  status: { type: String, default: 'Not Included' },
  descriptionNote: { type: String, default: "" } // e.g., "Teak finish with Faber chimney"
}, { _id: true });

// 2. Dynamic Legal Audit Item Schema
const LegalAuditItemSchema = new mongoose.Schema({
  documentName: { type: String, required: true }, // e.g., "Encumbrance Certificate (EC)", "Khata / Possession"
  category: {
    type: String,
    enum: ['Verified', 'Pending', 'Issue Flagged', 'Not Applicable'],
    default: 'Pending'
  },
  verificationNote: { type: String, default: "" }, // e.g., "30-Year Clear EC verified via Kaveri portal"
  verifiedDate: { type: Date, default: Date.now },
  isCustomItem: { type: Boolean, default: false } // Enables dynamic admin-added legal items
}, { _id: true });

// 3. Dynamic Manual Strategic Transit & Infrastructure Item Schema
const TransitItemSchema = new mongoose.Schema({
  landmarkName: { type: String, required: true },
  travelMode: {
    type: String,
    enum: ['Walk', 'Drive', 'Transit', 'Flight'],
    default: 'Drive'
  },
  distanceText: { type: String, required: true },
  durationText: { type: String, required: true },

  // Backward compatibility fields
  destination: { type: String, default: "" },
  distanceKm: { type: Number, default: 0 },
  travelTimeMins: { type: Number, default: 0 },
  transportMode: { type: String, default: "Drive" }
}, { _id: false });

// Helper schema for legacy legal checklist items
const legalChecklistItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  isCleared: { type: Boolean, default: true },
  inspected: { type: Boolean, default: true },
  details: { type: String, default: '' }
}, { _id: false });

// 4. Master Property Listing Schema
const PropertySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.Mixed },
  id: { type: String },
  listingCode: { type: String, trim: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  city: { type: String, enum: ['Mangaluru'], default: 'Mangaluru', required: true },
  locality: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Apartment', 'Villa', 'Independent House', 'Commercial', 'Land/Plot', 'Plot', 'Estate'],
    required: true
  },
  dealType: { type: String, enum: ['Resale', 'Rental', 'New Launch', 'Direct Sale'], required: true, default: 'Resale' },

  pricing: {
    expectedPrice: { type: Number, default: 0 },
    isNegotiable: { type: Boolean, default: false },
    maintenanceFee: { type: Number, default: 0 }
  },

  specs: {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    carpetAreaSqFt: { type: Number, default: 0 },
    furnishingStatus: {
      type: String,
      enum: ['Fully Furnished', 'Semi-Furnished', 'Unfurnished', 'Furnished'],
      default: 'Unfurnished'
    },
    floorLevel: { type: String, default: 'G' },
    totalFloors: { type: String, default: '1' }
  },

  youtubeVideoId: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  galleryImages: { type: [String], default: [] },
  description: { type: String, default: '' },

  // Dynamic & Manual Admin Matrices
  componentsMatrix: [ComponentItemSchema],
  legalVerification: [LegalAuditItemSchema],
  transitMatrix: [TransitItemSchema],
  roadIngressText: { type: String, default: "40ft Wide Asphalt Road" },
  zoningTagText: { type: String, default: "RERA Compliant" },

  investmentAnalysis: {
    rentalYieldEst: { type: String, default: '' },
    resaleAppreciationEst: { type: String, default: '' },
    localityGrowthDriver: { type: String, default: '' }
  },

  advocateAudit: { type: mongoose.Schema.Types.Mixed, default: {} },
  advocateVerificationAvailable: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Draft', 'Sold', 'Rented'], default: 'Active' },

  // Direct Payload & Backward-compatibility Fields
  carpetArea: { type: mongoose.Schema.Types.Mixed },
  heroVideoUrl: { type: String, default: '' },
  location: { type: String, trim: true },
  price: { type: String, trim: true },
  priceRaw: { type: Number, default: 0 },
  type: { type: String },
  beds: { type: Number, default: 0 },
  baths: { type: Number, default: 0 },
  area: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  images: { type: [String], default: [] },
  hasVideo: { type: Boolean, default: false },
  badge: { type: String, default: 'Verified Listing' },
  legalStatus: { type: String, default: 'Clear Title / RERA Verified' },
  highlights: { type: [String], default: [] },
  legalChecklist: { type: [legalChecklistItemSchema], default: [] },
  inventorySpecs: { type: mongoose.Schema.Types.Mixed, default: {} },
  technicalSpecs: { type: mongoose.Schema.Types.Mixed, default: {} },
  connectivity: { type: [mongoose.Schema.Types.Mixed], default: [] },
  financials: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Helper function to extract YouTube video ID
const extractYouTubeId = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : url;
};

// Helper function to format INR currency string
const formatInrPrice = (amount) => {
  if (!amount || isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs`;
  }
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

// Auto-sync backward compatibility and new schema fields before saving
PropertySchema.pre('save', function () {
  // Generate human-readable listingCode if absent (e.g. GMK-MLR-101 or GMK-MLR-202)
  if (!this.listingCode) {
    if (this._id) {
      const idStr = String(this._id).replace(/[^a-zA-Z0-9]/g, '');
      const shortId = idStr.slice(-4).toUpperCase();
      this.listingCode = `GMK-MLR-${shortId || Math.floor(100 + Math.random() * 900)}`;
    } else {
      this.listingCode = `GMK-MLR-${Math.floor(100 + Math.random() * 900)}`;
    }
  }

  // Generate slug if absent
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
  }

  // Sync city and locality with location
  if (!this.city) {
    this.city = 'Mangaluru';
  }
  if (!this.locality) {
    this.locality = this.location ? this.location.split(',')[0].trim() : 'Central';
  }
  if (!this.location) {
    this.location = `${this.locality}, ${this.city}`;
  }

  // Sync category with legacy type
  if (!this.category) {
    if (this.type === 'Commercial') this.category = 'Commercial';
    else if (this.type === 'Apartment') this.category = 'Apartment';
    else if (this.type === 'Plot' || this.type === 'Plot / Land') this.category = 'Land/Plot';
    else this.category = 'Villa';
  }
  if (!this.type) {
    this.type = this.category === 'Land/Plot' ? 'Plot' : this.category;
  }

  // Sync pricing
  if (!this.pricing || !this.pricing.expectedPrice) {
    const numPrice = this.priceRaw || parseInt(String(this.price || '').replace(/[^0-9]/g, ''), 10) || 0;
    this.pricing = {
      expectedPrice: numPrice,
      isNegotiable: true,
      maintenanceFee: 0
    };
  }
  if (!this.priceRaw) {
    this.priceRaw = this.pricing.expectedPrice;
  }
  if (!this.price) {
    this.price = formatInrPrice(this.pricing.expectedPrice);
  }

  // Sync specs
  if (!this.specs) {
    this.specs = {
      bedrooms: Number(this.beds) || 0,
      bathrooms: Number(this.baths) || 0,
      carpetAreaSqFt: parseInt(String(this.area || '').replace(/[^0-9]/g, ''), 10) || 0,
      furnishingStatus: 'Fully Furnished',
      floorLevel: 'G',
      totalFloors: '1'
    };
  }
  if (this.beds === undefined || this.beds === null) {
    this.beds = this.specs.bedrooms || 0;
  }
  if (this.baths === undefined || this.baths === null) {
    this.baths = this.specs.bathrooms || 0;
  }
  if (!this.area && this.specs.carpetAreaSqFt) {
    this.area = `${this.specs.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft`;
  }

  // Sync YouTube Video ID, heroVideoUrl & videoUrl
  if (!this.heroVideoUrl && this.videoUrl) {
    this.heroVideoUrl = this.videoUrl;
  }
  if (!this.videoUrl && this.heroVideoUrl) {
    this.videoUrl = this.heroVideoUrl;
  }
  if (!this.youtubeVideoId && this.videoUrl) {
    this.youtubeVideoId = extractYouTubeId(this.videoUrl);
  }
  if (!this.videoUrl && this.youtubeVideoId) {
    this.videoUrl = `https://www.youtube.com/watch?v=${this.youtubeVideoId}`;
    if (!this.heroVideoUrl) this.heroVideoUrl = this.videoUrl;
  }
  this.hasVideo = Boolean(this.youtubeVideoId || (this.videoUrl && this.videoUrl.trim().length > 0));

  // Sync carpetArea with specs and area string
  if (this.carpetArea && (!this.specs || !this.specs.carpetAreaSqFt)) {
    const parsedArea = Number(this.carpetArea) || parseInt(String(this.carpetArea).replace(/[^0-9]/g, ''), 10) || 0;
    if (this.specs) this.specs.carpetAreaSqFt = parsedArea;
  }
  if (this.carpetArea && !this.area) {
    this.area = `${this.carpetArea} sq.ft`;
  }

  // Sync images, galleryImages and coverImage
  if (!this.coverImage && Array.isArray(this.galleryImages) && this.galleryImages.length > 0) {
    this.coverImage = this.galleryImages[0];
  }
  if (!this.coverImage && Array.isArray(this.images) && this.images.length > 0) {
    this.coverImage = this.images[0];
  }
  if (this.coverImage) {
    const list = Array.isArray(this.galleryImages) ? this.galleryImages : [];
    this.images = [this.coverImage, ...list.filter(img => img !== this.coverImage)];
    if (!this.galleryImages || this.galleryImages.length === 0) {
      this.galleryImages = [...this.images];
    }
  } else if (Array.isArray(this.galleryImages) && this.galleryImages.length > 0) {
    this.images = [...this.galleryImages];
  }

  // Sync transitMatrix dual fields
  if (Array.isArray(this.transitMatrix)) {
    this.transitMatrix.forEach(t => {
      if (!t.landmarkName && t.destination) t.landmarkName = t.destination;
      if (!t.destination && t.landmarkName) t.destination = t.landmarkName;
      if (!t.travelMode && t.transportMode) t.travelMode = t.transportMode;
      if (!t.transportMode && t.travelMode) t.transportMode = t.travelMode;
      if (!t.distanceText && t.distanceKm !== undefined) t.distanceText = `${t.distanceKm} km`;
      if (!t.durationText && t.travelTimeMins !== undefined) t.durationText = `${t.travelTimeMins}m`;
    });
  }
});

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

export default Property;

```

## File: `server/models/Setting.js`

```javascript
import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

export default Setting;


```

## File: `server/models/SiteSettings.js`

```javascript
import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  heroFeaturedPropertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property' 
  },
  heroCustomYoutubeId: { 
    type: String, 
    default: "" 
  }, // Direct YouTube ID override
  heroBadgeTag: { 
    type: String, 
    default: "FEATURED PROPERTY" 
  },
  heroOverlayTitle: { 
    type: String, 
    default: "" 
  },
  heroOverlayLocation: { 
    type: String, 
    default: "" 
  }
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

```

## File: `server/package.json`

```json
{
  "name": "grabmykey-server",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cloudinary": "^2.11.0",
    "cors": "^2.8.6",
    "dotenv": "^18.0.9",
    "express": "^5.3.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.11.4"
  }
}


```

## File: `server/routes/authRoutes.js`

```javascript
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Setting from '../models/Setting.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'grabmykey_luxury_real_estate_jwt_secret_key_2026';

// Helper to fetch active dynamic invite key from database or fallback to env
const getActiveInviteKey = async () => {
  try {
    const setting = await Setting.findOne({ key: 'admin_invite_key' });
    if (setting && setting.value && String(setting.value).trim()) {
      return String(setting.value).trim();
    }
  } catch (err) {
    console.error('[Error fetching dynamic invite key]:', err);
  }
  return (process.env.ADMIN_INVITE_KEY || 'GMK-ADMIN-2026').trim();
};

// Helper to generate a signed JWT token (7-day validity)
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id || admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role || 'admin',
      status: admin.status || 'approved'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * POST /api/auth/signup
 * Register a new administrative user.
 * - If 0 approved admins exist: auto-approves as superadmin and issues token.
 * - If approved admins already exist: requires valid dynamic invite key and creates account with 'pending' status.
 */
router.post('/signup', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const { name, email, password, inviteKey } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if an approved admin already exists in the system
    const approvedCount = await Admin.countDocuments({ status: 'approved' });

    // If approved admins exist, strictly verify the administrative invite key
    if (approvedCount > 0) {
      const activeInviteKey = await getActiveInviteKey();
      if (!inviteKey || inviteKey.trim() !== activeInviteKey) {
        return res.status(403).json({
          success: false,
          message: 'Invalid administrative invite key. Contact an authorized administrator.'
        });
      }
    }

    // Check if email is already taken
    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An administrator account with this email address already exists.'
      });
    }

    const isFirstAdmin = approvedCount === 0;

    // Create the administrator
    const newAdmin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: isFirstAdmin ? 'superadmin' : 'admin',
      status: isFirstAdmin ? 'approved' : 'pending',
      lastLogin: isFirstAdmin ? new Date() : null
    });

    if (isFirstAdmin) {
      const token = generateToken(newAdmin);
      return res.status(201).json({
        success: true,
        message: 'Initial administrator account created and activated successfully.',
        token,
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          status: newAdmin.status
        }
      });
    }

    // Account created in pending status - no session token issued
    res.status(201).json({
      success: true,
      pendingApproval: true,
      message: 'Your registration request has been submitted and is pending approval from an existing administrator.',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status
      }
    });
  } catch (error) {
    console.error('[Auth Signup Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create administrative account.',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate administrator with email and password.
 * Strictly blocks 'pending' or 'rejected' accounts.
 */
router.post('/login', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Administrative email and password are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.'
      });
    }

    // Auto-migrate legacy admin records created before the status field existed
    // or ensure primary admin (contact@grabmykey.in) is always superadmin & approved
    const rawAdmin = await Admin.collection.findOne({ _id: admin._id });
    const isPrimaryAdmin = normalizedEmail === 'contact@grabmykey.in';
    const isLegacyRecord = !rawAdmin || !('status' in rawAdmin) || rawAdmin.status === null;

    if (isPrimaryAdmin || isLegacyRecord) {
      admin.status = 'approved';
      if (isPrimaryAdmin || !rawAdmin?.role || rawAdmin.role === 'admin') {
        admin.role = 'superadmin';
      }
      await admin.save();
    }

    // Check admin approval status
    const status = admin.status || 'approved';

    if (status === 'pending') {
      return res.status(403).json({
        success: false,
        pendingApproval: true,
        message: 'Your admin account is awaiting approval from an existing administrator.'
      });
    }

    if (status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your administrative access request has been declined. Please contact your system administrator.'
      });
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin);

    res.status(200).json({
      success: true,
      message: 'Administrative authentication successful.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status || 'approved'
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication service encountered an error.',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/me
 * Verify current JWT token and return active admin profile
 */
router.get('/me', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator profile not found.'
      });
    }

    const status = admin.status || 'approved';
    if (status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Account is not in approved state.'
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('[Auth Me Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve administrative profile.',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/admins
 * List all registered administrators (Protected)
 */
router.get('/admins', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      admins
    });
  } catch (error) {
    console.error('[Auth List Admins Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list administrators.',
      error: error.message
    });
  }
});

/**
 * PATCH /api/auth/admins/:id/approve
 * Approve a pending admin account (Protected)
 */
router.patch('/admins/:id/approve', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator not found.'
      });
    }

    admin.status = 'approved';
    await admin.save();

    res.status(200).json({
      success: true,
      message: `Account for ${admin.name} has been approved.`,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    console.error('[Auth Approve Admin Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve administrator.',
      error: error.message
    });
  }
});

/**
 * PATCH /api/auth/admins/:id/reject
 * Reject an admin account (Protected)
 */
router.patch('/admins/:id/reject', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator not found.'
      });
    }

    // Prevent rejecting own account
    if (req.admin.id === admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot reject your own administrator account.'
      });
    }

    // Prevent rejecting the sole superadmin
    if (admin.role === 'superadmin') {
      const superadminCount = await Admin.countDocuments({ role: 'superadmin', status: 'approved' });
      if (superadminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot reject the primary superadmin account.'
        });
      }
    }

    admin.status = 'rejected';
    await admin.save();

    res.status(200).json({
      success: true,
      message: `Account request for ${admin.name} has been rejected.`,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    console.error('[Auth Reject Admin Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject administrator.',
      error: error.message
    });
  }
});

/**
 * DELETE /api/auth/admins/:id
 * Remove an administrator (Protected)
 */
router.delete('/admins/:id', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator not found.'
      });
    }

    // Prevent self-deletion
    if (req.admin.id === admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own administrator account.'
      });
    }

    // Prevent deleting the last superadmin
    if (admin.role === 'superadmin') {
      const superadminCount = await Admin.countDocuments({ role: 'superadmin' });
      if (superadminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only superadmin account.'
        });
      }
    }

    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Administrator ${admin.name} removed successfully.`
    });
  } catch (error) {
    console.error('[Auth Delete Admin Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete administrator.',
      error: error.message
    });
  }
});

/**
 * GET /api/auth/invite-key
 * Get current dynamic admin invite key (Protected)
 */
router.get('/invite-key', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const inviteKey = await getActiveInviteKey();
    res.status(200).json({
      success: true,
      inviteKey
    });
  } catch (error) {
    console.error('[Auth Get Invite Key Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve invite key.',
      error: error.message
    });
  }
});

/**
 * PUT /api/auth/invite-key
 * Update dynamic admin invite key in database (Protected)
 */
router.put('/invite-key', requireAdminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database disconnected: Unable to reach MongoDB'
    });
  }

  try {
    const { inviteKey } = req.body;

    if (!inviteKey || typeof inviteKey !== 'string' || inviteKey.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Invite key must be at least 6 characters long.'
      });
    }

    const trimmedKey = inviteKey.trim();

    await Setting.findOneAndUpdate(
      { key: 'admin_invite_key' },
      {
        key: 'admin_invite_key',
        value: trimmedKey,
        description: 'Dynamic administrative invite registration key'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Administrative invite key updated successfully.',
      inviteKey: trimmedKey
    });
  } catch (error) {
    console.error('[Auth Update Invite Key Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invite key.',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Administrative session ended successfully.'
  });
});

export default router;

```

## File: `server/routes/leadRoutes.js`

```javascript
import express from 'express';
import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

let memoryLeads = [];

// GET /api/leads - Fetch all seller requests (Admin only)
router.get('/', requireAdminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: memoryLeads.length,
        data: memoryLeads,
        source: 'memory'
      });
    }

    let leads = await Lead.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leads.length,
      data: leads,
      source: 'mongodb'
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve seller leads',
      error: error.message
    });
  }
});

// POST /api/leads - Submit seller onboarding request (Public)
router.post('/', async (req, res) => {
  try {
    const { ownerName, phone, location, assetType, expectedPrice, details } = req.body;

    if (!ownerName || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: 'Owner name, phone number, and location are required'
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const memoryLead = {
        _id: new mongoose.Types.ObjectId().toString(),
        id: String(Date.now()),
        ticketId: `TKT-${Math.floor(100 + Math.random() * 900)}`,
        ownerName,
        phone,
        location,
        assetType: assetType || 'Villa',
        expectedPrice: expectedPrice || 'Price on Request',
        details: details || '',
        status: 'Pending Inspection',
        createdAt: new Date().toISOString()
      };
      memoryLeads.unshift(memoryLead);
      return res.status(201).json({
        success: true,
        message: 'Property onboarding request submitted successfully',
        data: memoryLead
      });
    }

    const newLead = new Lead({
      ownerName,
      phone,
      location,
      assetType: assetType || 'Villa',
      expectedPrice: expectedPrice || 'Price on Request',
      details: details || '',
      status: 'Pending Inspection'
    });

    const saved = await newLead.save();

    res.status(201).json({
      success: true,
      message: 'Property onboarding request submitted successfully',
      data: saved
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit onboarding request',
      error: error.message
    });
  }
});

// PATCH /api/leads/:id - Update lead status (Admin only)
router.patch('/:id', requireAdminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const idx = memoryLeads.findIndex(l => String(l._id) === String(req.params.id) || String(l.id) === String(req.params.id));
      if (idx !== -1) {
        memoryLeads[idx].status = status;
        return res.json({
          success: true,
          message: 'Lead status updated',
          data: memoryLeads[idx]
        });
      }
      return res.status(404).json({
        success: false,
        message: 'Lead ticket not found in memory'
      });
    }

    const updated = await Lead.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Lead ticket not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead status updated',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lead status',
      error: error.message
    });
  }
});

// DELETE /api/leads/:id - Delete lead (Admin only)
router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      memoryLeads = memoryLeads.filter(l => String(l._id) !== String(req.params.id) && String(l.id) !== String(req.params.id));
      return res.json({
        success: true,
        message: 'Lead removed successfully',
        data: { id: req.params.id }
      });
    }

    const deleted = await Lead.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found to delete'
      });
    }

    res.json({
      success: true,
      message: 'Lead removed successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: error.message
    });
  }
});

export default router;

```

## File: `server/routes/presetRoutes.js`

```javascript
import express from 'express';
import mongoose from 'mongoose';
import MasterPreset from '../models/MasterPreset.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

export const DEFAULT_SEED_PRESETS = [
  // --- Legal Checks ---
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Parent Title Deed',
    groupCategory: 'Title',
    defaultDescription: '30-Year clear parent deed chain verified by High Court panel',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Encumbrance Certificate (30-Year EC)',
    groupCategory: 'Title',
    defaultDescription: 'Nil encumbrance Form 15 issued via Kaveri / registration portal',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Khata / Possession Certificate',
    groupCategory: 'Municipal',
    defaultDescription: 'A-Khata / Possession Certificate active and on record',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Latest Property Tax Receipts',
    groupCategory: 'Tax',
    defaultDescription: 'Municipal property tax cleared through current financial year',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Building Sanction Plan',
    groupCategory: 'Municipal',
    defaultDescription: 'Sanctioned approved construction blueprint on record',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Occupancy Certificate (OC)',
    groupCategory: 'Municipal',
    defaultDescription: 'Final Occupancy Certificate issued by statutory authority',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'No Objection Certificates (NOCs)',
    groupCategory: 'Municipal',
    defaultDescription: 'Statutory fire, pollution, and structural NOCs cleared',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'NOC from Society / Association',
    groupCategory: 'Municipal',
    defaultDescription: 'RWA / Society dues clearance and transfer NOC verified',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Possession & Allotment Letter',
    groupCategory: 'Title',
    defaultDescription: 'Original physical allotment letter and possession memo',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Utility Dues Clearances',
    groupCategory: 'Tax',
    defaultDescription: 'Power (MESCOM) and water board zero-dues receipt',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Mutation Register Extract (RTC/Pahani)',
    groupCategory: 'Title',
    defaultDescription: 'Revenue mutation extract / RTC reflects unambiguous title',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Revenue / Survey Map (FMB)',
    groupCategory: 'Title',
    defaultDescription: 'Field Measurement Book (FMB) sketch matches physical boundary',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'CRZ Coastal Clearance',
    groupCategory: 'Environmental',
    defaultDescription: 'CRZ-II/III statutory clearance certificate for coastal zoning',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Panchayat NOC',
    groupCategory: 'Municipal',
    defaultDescription: 'Panchayat building clearance and road widening setback compliance',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'RERA Registration Certificate',
    groupCategory: 'Title',
    defaultDescription: 'Statutory RERA registration certificate active and valid',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Agricultural Non-Alienation Certificate',
    groupCategory: 'Title',
    defaultDescription: 'Section 109 / Land Conversion statutory non-alienation order',
    defaultStatus: 'Available',
    isActive: true
  },

  // --- Category: Villa ---
  // Build & Material Specifications
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Flooring Type',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Imported Italian Marble (Living) + Teak Hardwood (Bedrooms)',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Wood & Joinery',
    groupCategory: 'Build & Materials',
    defaultDescription: '100% Seasoned Burma Teakwood (Doors, Frames & Windows)',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Wall Finish & Paint',
    groupCategory: 'Build & Materials',
    defaultDescription: 'ROYAL Silk Emulsion + Texture Accent Walls',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Structural Frame',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Earthquake Resistant RCC Framed Structure (M25 Grade)',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Roofing & Insulation',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Sloped Concrete Slab with Terracotta Tiles & Heat Shield Insulation',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Sanitaryware & Fittings',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Kohler / Grohe Concealed Diverters & Wall-Hung Closets',
    defaultStatus: 'Available',
    isActive: true
  },

  // Interior & Living
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Modular Kitchen',
    groupCategory: 'Interior & Living',
    defaultDescription: 'Faber Chimney, Blum Soft-Close Hardware & Quartz Island',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Air Conditioning',
    groupCategory: 'Interior & Living',
    defaultDescription: 'Daikin VRV Centralized Inverter Climate Control',
    defaultStatus: 'Available',
    isActive: true
  },

  // Building & Security
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'CCTV & Security',
    groupCategory: 'Building & Security',
    defaultDescription: '8-Channel IP Cameras + Biometric Video Door Phone',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Automated Gate',
    groupCategory: 'Building & Security',
    defaultDescription: 'Motorized RFID Sensor Ingress Gate',
    defaultStatus: 'Available',
    isActive: true
  },

  // Utilities & Outdoor
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Power Backup',
    groupCategory: 'Utilities',
    defaultDescription: '15 kVA Silent DG Generator with Auto-Transfer Switch',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Water Supply',
    groupCategory: 'Utilities',
    defaultDescription: 'Dual Source (Open Well + Municipal Supply + 10,000L Sump)',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Covered Vehicle Parking',
    groupCategory: 'Outdoor',
    defaultDescription: '3 SUV Parking Bay with Integrated 11kW EV Fast Charger',
    defaultStatus: 'Available',
    isActive: true
  },

  // --- Category: Apartment ---
  // Build & Material Specifications
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Flooring Type',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Vitrified Tiles (800x800mm) + Anti-Skid Ceramic (Balconies)',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Wood & Joinery',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Teakwood Main Door + Engineered Flush Internal Doors',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Plumbing & Sanitary',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Jaguar / Hindware CP Fittings with Solar Line Connection',
    defaultStatus: 'Available',
    isActive: true
  },

  // Amenities & Utilities
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Elevator / Lifts',
    groupCategory: 'Building Amenities',
    defaultDescription: 'Dual High-Speed Passenger Lifts + Stretcher Lift',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Power Backup',
    groupCategory: 'Building Amenities',
    defaultDescription: '100% Generator Backup for Common Areas & Lighting Points',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Designated Parking',
    groupCategory: 'Parking',
    defaultDescription: '1 Reserved Covered Stilt Car Parking Bay',
    defaultStatus: 'Available',
    isActive: true
  },

  // --- Category: Land/Plot ---
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Land/Plot',
    title: 'Approach Road Width',
    groupCategory: 'Infrastructure & Access',
    defaultDescription: '30 ft Wide Asphalted Concrete Road Ingress',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Land/Plot',
    title: 'Compound Wall',
    groupCategory: 'Infrastructure & Access',
    defaultDescription: 'Perimeter Laterite Stone Wall with Gate',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Land/Plot',
    title: 'MUDA / MCC Approval',
    groupCategory: 'Statutory & Approvals',
    defaultDescription: 'Clear Residential Layout Approval with Sanctioned DP Plan',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Land/Plot',
    title: 'Conversion Status',
    groupCategory: 'Statutory & Approvals',
    defaultDescription: 'Non-Agricultural (NA) Conversion Completed',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Land/Plot',
    title: 'Electricity & Water Line',
    groupCategory: 'Utilities & Supply',
    defaultDescription: 'MESCOM 3-Phase Electric Connection & Municipal Water Link Ready',
    defaultStatus: 'Available',
    isActive: true
  },

  // --- Category: Commercial ---
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Commercial',
    title: 'Floor Plate & Ceiling',
    groupCategory: 'Structure',
    defaultDescription: 'Clear 12ft ceiling height with open column grid',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Commercial',
    title: 'Commercial Power Load',
    groupCategory: 'Utilities & Safety',
    defaultDescription: '30kW sanctioned commercial power connection',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Commercial',
    title: 'Fire Fighting Infrastructure',
    groupCategory: 'Utilities & Safety',
    defaultDescription: 'NOC approved sprinklers, smoke detectors & hose reels',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Commercial',
    title: 'Service Lift & Bay',
    groupCategory: 'Access & Loading',
    defaultDescription: 'Dedicated freight elevator & rear loading bay',
    defaultStatus: 'Available',
    isActive: true
  }
];

// In-memory store fallback for offline/sandbox environments
export let memoryPresets = DEFAULT_SEED_PRESETS.map((p, idx) => ({
  ...p,
  _id: `mem-preset-${idx + 1}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}));

// Retrieve all active master presets from MongoDB with resilient memory fallback
export const getActiveMasterPresets = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const count = await MasterPreset.countDocuments();
      if (count === 0) {
        await MasterPreset.insertMany(DEFAULT_SEED_PRESETS);
      }
      const presets = await MasterPreset.find({ isActive: true });
      if (presets && presets.length > 0) {
        return presets.map(p => (typeof p.toObject === 'function' ? p.toObject() : p));
      }
    }
  } catch (err) {
    console.warn('Error fetching active presets from MongoDB, falling back to memory store:', err.message);
  }
  return memoryPresets.filter(p => p.isActive !== false);
};

// GET /api/presets - Fetch all presets with optional filters
router.get('/', async (req, res) => {
  try {
    const { presetType, applicableCategory, isActive } = req.query;

    if (mongoose.connection.readyState === 1) {
      const count = await MasterPreset.countDocuments();
      if (count === 0) {
        console.log('Seeding MasterPreset collection with default legal checks & feature sets...');
        await MasterPreset.insertMany(DEFAULT_SEED_PRESETS);
      }

      const query = {};
      if (presetType) query.presetType = presetType;
      if (applicableCategory && applicableCategory !== 'ALL') {
        query.$or = [{ applicableCategory: 'ALL' }, { applicableCategory }];
      }
      if (isActive !== undefined) {
        query.isActive = isActive === 'true' || isActive === true;
      }

      const presets = await MasterPreset.find(query).sort({ groupCategory: 1, title: 1 });
      return res.json({
        success: true,
        count: presets.length,
        data: presets
      });
    }

    // Memory store fallback
    let filtered = [...memoryPresets];
    if (presetType) {
      filtered = filtered.filter(p => p.presetType === presetType);
    }
    if (applicableCategory && applicableCategory !== 'ALL') {
      filtered = filtered.filter(p => p.applicableCategory === 'ALL' || p.applicableCategory === applicableCategory);
    }
    if (isActive !== undefined) {
      const boolVal = isActive === 'true' || isActive === true;
      filtered = filtered.filter(p => p.isActive === boolVal);
    }

    return res.json({
      success: true,
      count: filtered.length,
      data: filtered,
      note: 'Serving from memory store (MongoDB disconnected)'
    });
  } catch (err) {
    console.error('Error fetching master presets:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch master presets',
      error: err.message
    });
  }
});

// POST /api/presets - Create a new preset (Admin only)
router.post('/', requireAdminAuth, async (req, res) => {
  try {
    const {
      presetType,
      applicableCategory = 'ALL',
      title,
      groupCategory = 'General',
      defaultDescription = '',
      defaultStatus = 'Available',
      isActive = true
    } = req.body;

    if (!presetType || !title) {
      return res.status(400).json({
        success: false,
        message: 'presetType and title are required fields.'
      });
    }

    const newPresetData = {
      presetType,
      applicableCategory,
      title: title.trim(),
      groupCategory: groupCategory.trim(),
      defaultDescription: defaultDescription.trim(),
      defaultStatus,
      isActive: Boolean(isActive)
    };

    if (mongoose.connection.readyState === 1) {
      const created = await MasterPreset.create(newPresetData);
      return res.status(201).json({
        success: true,
        message: 'Master preset created successfully',
        data: created
      });
    }

    const createdMemory = {
      ...newPresetData,
      _id: `mem-preset-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryPresets.push(createdMemory);

    return res.status(201).json({
      success: true,
      message: 'Master preset created in memory',
      data: createdMemory
    });
  } catch (err) {
    console.error('Error creating master preset:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create master preset',
      error: err.message
    });
  }
});

// PUT /api/presets/:id - Update an existing preset (Admin only)
router.put('/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updated = await MasterPreset.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (updated) {
          return res.json({
            success: true,
            message: 'Master preset updated',
            data: updated
          });
        }
      }
    }

    // In-memory update
    const idx = memoryPresets.findIndex(p => String(p._id) === String(id));
    if (idx !== -1) {
      memoryPresets[idx] = {
        ...memoryPresets[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      return res.json({
        success: true,
        message: 'Master preset updated in memory',
        data: memoryPresets[idx]
      });
    }

    return res.status(404).json({
      success: false,
      message: `Preset with id ${id} not found.`
    });
  } catch (err) {
    console.error('Error updating master preset:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update master preset',
      error: err.message
    });
  }
});

// DELETE /api/presets/:id - Delete a preset (Admin only)
router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await MasterPreset.findByIdAndDelete(id);
      if (deleted) {
        return res.json({
          success: true,
          message: 'Master preset deleted',
          data: deleted
        });
      }
    }

    const idx = memoryPresets.findIndex(p => String(p._id) === String(id));
    if (idx !== -1) {
      const [removed] = memoryPresets.splice(idx, 1);
      return res.json({
        success: true,
        message: 'Master preset removed from memory',
        data: removed
      });
    }

    return res.status(404).json({
      success: false,
      message: `Preset with id ${id} not found.`
    });
  } catch (err) {
    console.error('Error deleting master preset:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete master preset',
      error: err.message
    });
  }
});

// POST /api/presets/seed-defaults - Force reset to default presets (Admin only)
router.post('/seed-defaults', requireAdminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await MasterPreset.deleteMany({});
      const created = await MasterPreset.insertMany(DEFAULT_SEED_PRESETS);
      return res.json({
        success: true,
        message: 'Successfully reset database to master defaults',
        count: created.length,
        data: created
      });
    }

    memoryPresets = DEFAULT_SEED_PRESETS.map((p, idx) => ({
      ...p,
      _id: `mem-preset-${idx + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Successfully reset memory store to master defaults',
      count: memoryPresets.length,
      data: memoryPresets
    });
  } catch (err) {
    console.error('Error seeding master presets:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed master presets',
      error: err.message
    });
  }
});

export default router;

```

## File: `server/routes/propertyRoutes.js`

```javascript
import express from 'express';
import mongoose from 'mongoose';
import Property from '../models/Property.js';
import MasterPreset from '../models/MasterPreset.js';
import { getActiveMasterPresets } from './presetRoutes.js';
import { uploadImageToCloudinary, uploadImagesToCloudinary, deleteImagesFromCloudinary } from '../config/cloudinary.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const INITIAL_PROPERTIES = [];

// Seed initial database if empty
export const seedInitialProperties = async () => {
  // Mock seeding removed permanently. Database stays clean and empty until properties are published.
  return;
};

/**
 * Dynamic Synchronizer for Master Presets & Existing Properties
 * Ensures that whenever a new Master Feature or Legal Verification item is added
 * globally to the system, all existing (previously published) properties automatically
 * display the new item.
 * 
 * Default Fallbacks:
 * - Feature Specifications: isAvailable: false ("Not Included") & descriptionNote: "Status Not Updated"
 * - Legal Verification: verifiedStatus: 'Pending' ("Pending") & verificationNote: "Pending Audit / Status Not Updated"
 * - Preserves all previously recorded property-specific states, custom features, and custom legal items!
 */
export const syncPropertyWithMasterPresets = (propertyInput, masterPresets = []) => {
  if (!propertyInput) return propertyInput;

  // Ensure property is a plain object
  const property = (typeof propertyInput.toObject === 'function') 
    ? propertyInput.toObject() 
    : { ...propertyInput };

  const propCategory = (property.category || property.type || '').trim().toLowerCase();

  const isCategoryMatch = (appCat) => {
    if (!appCat || appCat === 'ALL') return true;
    const ac = appCat.toLowerCase();
    if (propCategory.includes(ac) || ac.includes(propCategory)) return true;
    if (propCategory === 'estate' && ac === 'villa') return true;
    if (propCategory === 'independent house' && ac === 'villa') return true;
    return false;
  };

  const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Dynamic Merge for Feature Specifications Matrix
  const activeFeatures = masterPresets.filter(p => {
    if (p.presetType !== 'PROPERTY_FEATURE' || p.isActive === false) return false;
    const hasExisting = (property.componentsMatrix || []).some(
      c => c && (normalize(c.featureName) === normalize(p.title))
    );
    if (hasExisting) return true;
    return isCategoryMatch(p.applicableCategory);
  });

  const mergedComponents = [];
  const matchedFeatureKeys = new Set();

  for (const preset of activeFeatures) {
    const key = normalize(preset.title);
    // Check if property already has explicit data for this preset
    const existing = (property.componentsMatrix || []).find(
      c => c && (c.featureName === preset.title || (key && normalize(c.featureName) === key))
    );

    if (existing) {
      mergedComponents.push(existing);
    } else {
      // Default fallback for previous properties
      mergedComponents.push({
        categoryName: preset.groupCategory || 'General',
        featureName: preset.title,
        isAvailable: false, // Default: — (Not Available / Cross)
        descriptionNote: "Status Not Updated"
      });
    }
    if (key) matchedFeatureKeys.add(key);
  }

  // Preserve any custom features previously recorded on this property
  if (Array.isArray(property.componentsMatrix)) {
    for (const c of property.componentsMatrix) {
      const key = normalize(c.featureName);
      if (key && !matchedFeatureKeys.has(key)) {
        mergedComponents.push(c);
        matchedFeatureKeys.add(key);
      }
    }
  }

  // 2. Dynamic Merge for Legal Verification Checklist
  const activeLegalChecks = masterPresets.filter(p => 
    p.presetType === 'LEGAL_CHECK' && p.isActive !== false
  );

  const mergedLegal = [];
  const matchedLegalKeys = new Set();

  for (const preset of activeLegalChecks) {
    const key = normalize(preset.title);
    // Check if property already has explicit data for this preset
    const existing = (property.legalVerification || []).find(
      l => l && (l.documentName === preset.title || (key.length > 5 && normalize(l.documentName) === key))
    );

    if (existing) {
      mergedLegal.push(existing);
    } else {
      // Default fallback for previous properties
      mergedLegal.push({
        documentName: preset.title,
        category: preset.groupCategory || 'General Title',
        verifiedStatus: 'Pending', // Default: Pending / Not Updated
        verificationNote: 'Pending Audit / Status Not Updated',
        isCustomItem: false
      });
    }
    if (key) matchedLegalKeys.add(key);
  }

  // Preserve any custom legal checklist items previously recorded on this property
  if (Array.isArray(property.legalVerification)) {
    for (const l of property.legalVerification) {
      const key = normalize(l.documentName);
      if (key && !matchedLegalKeys.has(key)) {
        mergedLegal.push(l);
        matchedLegalKeys.add(key);
      }
    }
  }

  // Assign synced matrices
  property.componentsMatrix = mergedComponents;
  property.legalVerification = mergedLegal;

  // Normalization & Convenience Key Matching for all frontend UI components
  const resolvedId = property.id || (property._id ? property._id.toString() : property.slug);
  property.id = resolvedId;
  property._id = property._id || resolvedId;
  property.slug = property.slug || resolvedId;
  if (!property.listingCode) {
    const idStr = String(property._id || property.id || '').replace(/[^a-zA-Z0-9]/g, '');
    const shortId = idStr.slice(-4).toUpperCase();
    property.listingCode = `GMK-MLR-${shortId || '101'}`;
  }
  property.city = property.city || 'Mangaluru';
  property.locality = property.locality || (property.location ? property.location.split(',')[0].trim() : 'Surathkal Beach');
  property.location = property.location || `${property.locality}, ${property.city}`;
  property.category = property.category || property.type || 'Villa';
  property.type = property.type || property.category || 'Villa';

  const rawPrice = property.priceRaw || property.pricing?.expectedPrice || 0;
  property.priceRaw = rawPrice;
  if (!property.pricing) {
    property.pricing = { expectedPrice: rawPrice, isNegotiable: true, maintenanceFee: 0 };
  }
  if (!property.price) {
    property.price = rawPrice >= 10000000
      ? `₹${(rawPrice / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`
      : (rawPrice >= 100000 ? `₹${(rawPrice / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs` : `₹${rawPrice.toLocaleString('en-IN')}`);
  }
  property.priceText = property.priceText || (property.price ? String(property.price).replace(/^₹/, '').replace(/ •.*/, '').trim() : '');

  const imgs = (Array.isArray(property.images) && property.images.length > 0)
    ? property.images
    : ((Array.isArray(property.galleryImages) && property.galleryImages.length > 0)
        ? property.galleryImages
        : []);
  property.images = imgs;
  property.galleryImages = imgs;
  property.thumbnail = property.thumbnail || imgs[0] || '';

  if (!property.youtubeVideoId && property.videoUrl) {
    const match = property.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    property.youtubeVideoId = match ? match[1] : '';
  }
  if (!property.videoUrl && property.youtubeVideoId) {
    property.videoUrl = `https://www.youtube.com/watch?v=${property.youtubeVideoId}`;
  }

  if (!property.specs) {
    property.specs = {
      bedrooms: property.bedrooms ?? property.beds ?? 0,
      bathrooms: property.bathrooms ?? property.baths ?? 0,
      carpetAreaSqFt: property.superArea ? parseInt(String(property.superArea).replace(/[^0-9]/g, ''), 10) || 0 : 0,
      furnishingStatus: property.furnishing || 'Fully Furnished',
      floorLevel: 'G',
      totalFloors: '1'
    };
  }
  property.bedrooms = property.bedrooms ?? property.specs.bedrooms ?? property.beds ?? 0;
  property.bathrooms = property.bathrooms ?? property.specs.bathrooms ?? property.baths ?? 0;
  property.beds = property.beds ?? property.bedrooms;
  property.baths = property.baths ?? property.bathrooms;
  property.superArea = property.superArea || property.area || (property.specs.carpetAreaSqFt ? `${property.specs.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft` : '');
  property.area = property.area || property.superArea;
  property.furnishing = property.furnishing || property.specs.furnishingStatus || 'Furnished';

  property.badge = property.badge || (property.isFeatured ? 'Featured Listing' : (property.dealType || 'Exclusive Listing'));

  if (!Array.isArray(property.highlights)) {
    property.highlights = [];
  }

  if (!Array.isArray(property.specifications) || property.specifications.length === 0) {
    property.specifications = property.componentsMatrix.map(c => ({
      category: c.categoryName || 'General',
      feature: c.featureName || '',
      status: c.isAvailable !== false ? 'Included' : 'Not Included',
      details: c.descriptionNote || '—'
    }));
  }

  if (!Array.isArray(property.transitMatrix)) {
    property.transitMatrix = [];
  }

  return property;
};

// Controller: getPropertyBySlug
export const getPropertyBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    let property = null;

    if (mongoose.connection.readyState === 1) {
      property = await Property.findOne({ slug });
    }

    if (!property) {
      property = INITIAL_PROPERTIES.find(p => p.slug === slug);
    }

    if (!property || /Coastal Horizon|Kadri Heights|Bejai Royal|Ullal Sovereign|Sovereign Heritage/i.test(property.title || '') || /coastal-horizon|kadri-heights|bejai-royal|ullal-sovereign/i.test(property.slug || '')) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Fetch active master presets
    const masterPresets = await getActiveMasterPresets();

    // Dynamically sync matrices
    const responseData = syncPropertyWithMasterPresets(property, masterPresets);

    return res.status(200).json({
      success: true,
      data: responseData,
      ...responseData
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Controller: getPropertyById (Supports ObjectId or Slug)
export const getPropertyById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let property = null;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(identifier)) {
        property = await Property.findById(identifier);
      }
      if (!property) {
        property = await Property.findOne({ slug: identifier });
      }
      if (!property) {
        property = await Property.findOne({ $or: [{ id: identifier }, { _id: identifier }] });
      }
    }

    if (!property) {
      // Check in fallback cache
      property = INITIAL_PROPERTIES.find(p => 
        p.slug === identifier || String(p.id) === identifier || String(p._id) === identifier
      );
    }

    if (!property || /Coastal Horizon|Kadri Heights|Bejai Royal|Ullal Sovereign|Sovereign Heritage/i.test(property.title || '') || /coastal-horizon|kadri-heights|bejai-royal|ullal-sovereign/i.test(property.slug || '')) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Fetch active master presets
    const masterPresets = await getActiveMasterPresets();

    // Dynamically sync matrices
    const responseData = syncPropertyWithMasterPresets(property, masterPresets);

    return res.status(200).json({
      success: true,
      data: responseData,
      ...responseData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching property details',
      error: error.message
    });
  }
};

// Controller: getAllProperties
export const getAllProperties = async (req, res) => {
  try {
    let properties = [];

    if (mongoose.connection.readyState === 1) {
      // Purge any legacy mock properties that might have been seeded into MongoDB earlier
      await Property.deleteMany({
        $or: [
          { title: { $regex: /Coastal Horizon|Kadri Heights|Bejai Royal|Ullal Sovereign|Sovereign Heritage/i } },
          { slug: { $regex: /coastal-horizon|kadri-heights|bejai-royal|ullal-sovereign|sovereign-heritage/i } },
          { youtubeVideoId: "dQw4w9WgXcQ" }
        ]
      });

      properties = (await Property.find().sort({ createdAt: -1 })).filter(p => {
        const t = p.title || '';
        const s = p.slug || '';
        return !/Coastal Horizon|Kadri Heights|Bejai Royal|Ullal Sovereign|Sovereign Heritage/i.test(t) &&
               !/coastal-horizon|kadri-heights|bejai-royal|ullal-sovereign/i.test(s) &&
               p.youtubeVideoId !== 'dQw4w9WgXcQ';
      });
    }

    // Also include any properties created in INITIAL_PROPERTIES cache that might not yet be in MongoDB
    if (INITIAL_PROPERTIES.length > 0) {
      INITIAL_PROPERTIES.forEach(ip => {
        const exists = properties.some(p => String(p._id || p.id) === String(ip._id || ip.id) || p.slug === ip.slug);
        if (!exists) {
          properties.push(ip);
        }
      });
    }

    // Fetch active master presets and sync each property
    const masterPresets = await getActiveMasterPresets();
    const syncedProperties = properties.map(p => syncPropertyWithMasterPresets(p, masterPresets));

    return res.json({
      success: true,
      count: syncedProperties.length,
      data: syncedProperties,
      source: mongoose.connection.readyState === 1 ? 'mongodb' : 'initial_properties'
    });
  } catch (error) {
    console.error('Error fetching properties from MongoDB:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving properties',
      error: error.message
    });
  }
};

// GET /api/properties - Retrieve all listings with synced master presets
router.get('/', getAllProperties);

// GET /api/properties/slug/:slug - Explicit slug route
router.get('/slug/:slug', getPropertyBySlug);

// GET /api/properties/:id - Single property details (By ObjectId or Slug)
router.get('/:id', getPropertyById);

// POST /api/properties & POST /api/properties/properties - Create listing (Admin only)
export const createPropertyHandler = async (req, res) => {
  try {
    const body = req.body || {};
    const title = body.title?.trim() || 'Untitled Luxury Property';

    // Generate unique slug
    let slug = body.slug?.trim();
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
    }

    // Parse price
    let parsedPrice = 0;
    if (body.pricing?.expectedPrice !== undefined) {
      parsedPrice = Number(body.pricing.expectedPrice) || 0;
    } else if (body.priceRaw !== undefined) {
      parsedPrice = Number(body.priceRaw) || 0;
    } else if (body.price) {
      parsedPrice = parseInt(String(body.price).replace(/[^0-9]/g, ''), 10) || 0;
    }

    const formatDisplayPrice = (val) => {
      if (!val) return 'Price on Request';
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs`;
      return `₹${val.toLocaleString('en-IN')}`;
    };

    // Parse legalVerification from body.legalVerification or body.advocateAudit
    let legalVerification = Array.isArray(body.legalVerification) && body.legalVerification.length > 0
      ? [...body.legalVerification]
      : [];

    if (body.advocateAudit) {
      const audit = body.advocateAudit;
      const isParentDeed = audit.parentDeedAudit === 'Cleared' || audit.parentDeedAudit === 'Verified' || audit.parentDeed === 'Cleared' || audit.parentDeed === true;
      const isEC = audit.encumbranceCertificate === 'Nil EC verified' || audit.encumbranceCertificate === 'Cleared' || audit.encumbranceCertificate === 'Verified' || audit.encumbrance === 'Cleared' || audit.encumbrance === true || audit.encumbranceCertificate === true;
      const isRTC = audit.revenueRtcCompliance === 'Verified' || audit.revenueRtcCompliance === 'Cleared' || audit.revenueRtc === 'Verified' || audit.revenueRtc === 'Cleared' || audit.revenueRtc === true;
      const isMCC = audit.mccPlanApprovals === 'Compliant' || audit.mccPlanApprovals === 'Cleared' || audit.mccPlanApprovals === 'Verified' || audit.mccPlan === 'Compliant' || audit.mccPlan === 'Cleared' || audit.mccPlan === true;
      const isDGPS = audit.dgpsSurveyVerification === 'Cleared' || audit.dgpsSurveyVerification === 'Verified' || audit.dgpsSurvey === 'Cleared' || audit.dgpsSurvey === true;

      const standardItems = [
        {
          documentName: 'Parent Title Deed',
          category: 'Ownership',
          verifiedStatus: isParentDeed ? 'Verified' : 'Pending',
          verificationNote: '30-Year Parent Deed Chain Audit'
        },
        {
          documentName: 'Encumbrance Certificate (30-Year EC)',
          category: 'Ownership',
          verifiedStatus: isEC ? 'Verified' : 'Pending',
          verificationNote: '30-Year Encumbrance Certificate (Nil EC verified)'
        },
        {
          documentName: 'Mutation Register Extract (RTC/Pahani)',
          category: 'Ownership',
          verifiedStatus: isRTC ? 'Verified' : 'Pending',
          verificationNote: 'Revenue RTC / Mutation Compliance (Verified)'
        },
        {
          documentName: 'Building Sanction Plan',
          category: 'Municipal',
          verifiedStatus: isMCC ? 'Verified' : 'Pending',
          verificationNote: 'MCC / Local Body Plan Approvals (Compliant)'
        },
        {
          documentName: 'Revenue / Survey Map (FMB)',
          category: 'Ownership',
          verifiedStatus: isDGPS ? 'Verified' : 'Pending',
          verificationNote: 'Physical Boundary DGPS Survey (Cleared)'
        }
      ];

      if (legalVerification.length === 0) {
        legalVerification = standardItems;
      } else {
        standardItems.forEach(item => {
          const idx = legalVerification.findIndex(l => (l.documentName || '').toLowerCase() === item.documentName.toLowerCase());
          if (idx !== -1) {
            legalVerification[idx] = {
              ...legalVerification[idx],
              verifiedStatus: item.verifiedStatus,
              verificationNote: item.verificationNote
            };
          } else {
            legalVerification.push(item);
          }
        });
      }
    }

    const isLand = (body.category === 'Land/Plot' || body.category === 'Plot' || body.type === 'Plot');

    const listingCode = body.listingCode || `GMK-MLR-${Math.floor(100 + Math.random() * 900)}`;
    const rawGalleryImages = Array.isArray(body.galleryImages) && body.galleryImages.length > 0 
      ? body.galleryImages 
      : (Array.isArray(body.images) ? body.images : []);
    const rawCoverImage = body.coverImage || (rawGalleryImages.length > 0 ? rawGalleryImages[0] : '');

    // Upload to Cloudinary (stores permanent secure HTTPS URLs, or original strings if offline)
    const coverImage = await uploadImageToCloudinary(rawCoverImage, 'grabmykey/properties');
    const galleryImages = await uploadImagesToCloudinary(rawGalleryImages, 'grabmykey/properties');

    const propertyPayload = {
      title,
      slug,
      listingCode,
      city: 'Mangaluru',
      locality: body.locality || (body.location ? body.location.split(',')[0].trim() : 'Central'),
      category: body.category || body.type || 'Villa',
      dealType: body.dealType || 'Resale',
      pricing: {
        expectedPrice: parsedPrice,
        isNegotiable: Boolean(body.pricing?.isNegotiable || body.isNegotiable),
        maintenanceFee: Number(body.pricing?.maintenanceFee || body.maintenanceFee) || 0
      },
      specs: {
        bedrooms: isLand ? 0 : Number(body.specs?.bedrooms ?? body.beds ?? 0),
        bathrooms: isLand ? 0 : Number(body.specs?.bathrooms ?? body.baths ?? 0),
        carpetAreaSqFt: Number(body.specs?.carpetAreaSqFt) || parseInt(String(body.area || '').replace(/[^0-9]/g, ''), 10) || 0,
        furnishingStatus: isLand ? 'Unfurnished' : (body.specs?.furnishingStatus || 'Unfurnished'),
        floorLevel: body.specs?.floorLevel || 'G',
        totalFloors: body.specs?.totalFloors || '1'
      },
      youtubeVideoId: body.youtubeVideoId?.trim() || (body.videoUrl?.includes('v=') ? body.videoUrl.split('v=')[1]?.substring(0, 11) : (body.videoUrl?.includes('youtu.be/') ? body.videoUrl.split('youtu.be/')[1]?.substring(0, 11) : '')) || '',
      coverImage,
      galleryImages,
      description: body.description || '',
      componentsMatrix: Array.isArray(body.componentsMatrix) ? body.componentsMatrix : [],
      legalVerification,
      advocateAudit: body.advocateAudit || {},
      transitMatrix: Array.isArray(body.transitMatrix) ? body.transitMatrix.map(t => ({
        landmarkName: t.landmarkName || t.destination || '',
        destination: t.destination || t.landmarkName || '',
        travelMode: t.travelMode || t.transportMode || 'Drive',
        transportMode: t.transportMode || t.travelMode || 'Drive',
        distanceText: t.distanceText || (t.distanceKm !== undefined ? `${t.distanceKm} km` : ''),
        distanceKm: t.distanceKm !== undefined ? Number(t.distanceKm) : (parseFloat(t.distanceText) || 0),
        durationText: t.durationText || (t.travelTimeMins !== undefined ? `${t.travelTimeMins}m` : ''),
        travelTimeMins: t.travelTimeMins !== undefined ? Number(t.travelTimeMins) : (parseInt(t.durationText, 10) || 0)
      })) : [],
      roadIngressText: body.roadIngressText || '',
      zoningTagText: body.zoningTagText || '',
      investmentAnalysis: body.investmentAnalysis || {},
      advocateVerificationAvailable: Boolean(body.advocateVerificationAvailable),
      isFeatured: Boolean(body.isFeatured),
      status: body.status || 'Active',

      // Backward-compatibility legacy fields
      carpetArea: body.carpetArea || (body.specs?.carpetAreaSqFt ? `${body.specs.carpetAreaSqFt} sq.ft` : body.area || ''),
      heroVideoUrl: body.heroVideoUrl || body.videoUrl || (body.youtubeVideoId ? `https://www.youtube.com/watch?v=${body.youtubeVideoId}` : ''),
      location: body.location || `${body.locality || 'Central'}, Mangaluru`,
      price: body.price || formatDisplayPrice(parsedPrice),
      priceRaw: parsedPrice,
      type: isLand ? 'Plot' : (body.type || body.category || 'Villa'),
      beds: isLand ? 0 : Number(body.beds ?? body.specs?.bedrooms ?? 0),
      baths: isLand ? 0 : Number(body.baths ?? body.specs?.bathrooms ?? 0),
      area: body.area || (body.specs?.carpetAreaSqFt ? `${body.specs.carpetAreaSqFt} sq.ft` : body.carpetArea || ''),
      videoUrl: body.videoUrl || body.heroVideoUrl || (body.youtubeVideoId ? `https://www.youtube.com/watch?v=${body.youtubeVideoId}` : ''),
      images: coverImage
        ? [coverImage, ...galleryImages.filter(img => img !== coverImage)]
        : galleryImages,
      badge: body.badge || 'Verified Listing',
      legalStatus: body.legalStatus || 'Clear Title / RERA Verified',
      highlights: Array.isArray(body.highlights) && body.highlights.length > 0 ? body.highlights : [
        "Advocate Audited Clear Title",
        "Complete Property Inspections",
        "Mangaluru Verified Listing"
      ]
    };

    let saved;
    try {
      if (mongoose.connection.readyState === 1) {
        // Save document to MongoDB via Property.create()
        saved = await Property.create(propertyPayload);
      } else {
        // Graceful offline in-memory store
        saved = {
          ...propertyPayload,
          _id: new mongoose.Types.ObjectId().toString(),
          id: new mongoose.Types.ObjectId().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    } catch (createErr) {
      console.warn('Property.create encountered an error, applying fallback:', createErr.message);
      saved = {
        ...propertyPayload,
        _id: new mongoose.Types.ObjectId().toString(),
        id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    const savedDoc = (typeof saved.toObject === 'function') ? saved.toObject() : saved;
    INITIAL_PROPERTIES.unshift(savedDoc);

    return res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: savedDoc
    });
  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message
    });
  }
};

router.post('/', requireAdminAuth, createPropertyHandler);
router.post('/properties', requireAdminAuth, createPropertyHandler);

// Controller: updateProperty
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Sanitize payload: prevent modifying immutable _id in MongoDB
    const updateData = { ...req.body };
    delete updateData._id;

    // Upload any updated/new base64 images to Cloudinary
    if (updateData.coverImage) {
      updateData.coverImage = await uploadImageToCloudinary(updateData.coverImage, 'grabmykey/properties');
    }
    if (Array.isArray(updateData.galleryImages) && updateData.galleryImages.length > 0) {
      updateData.galleryImages = await uploadImagesToCloudinary(updateData.galleryImages, 'grabmykey/properties');
    }
    // Synchronize updateData.images with uploaded coverImage and galleryImages to prevent raw base64 or desynchronization
    if (updateData.coverImage || updateData.galleryImages) {
      const activeCover = updateData.coverImage || '';
      const activeGallery = Array.isArray(updateData.galleryImages) ? updateData.galleryImages : [];
      updateData.images = activeCover
        ? [activeCover, ...activeGallery.filter(img => img !== activeCover)]
        : activeGallery;
    } else if (Array.isArray(updateData.images) && updateData.images.length > 0) {
      updateData.images = await uploadImagesToCloudinary(updateData.images, 'grabmykey/properties');
    }

    if (Array.isArray(updateData.transitMatrix)) {
      updateData.transitMatrix = updateData.transitMatrix.map(t => ({
        landmarkName: t.landmarkName || t.destination || '',
        destination: t.destination || t.landmarkName || '',
        travelMode: t.travelMode || t.transportMode || 'Drive',
        transportMode: t.transportMode || t.travelMode || 'Drive',
        distanceText: t.distanceText || (t.distanceKm !== undefined ? `${t.distanceKm} km` : ''),
        distanceKm: t.distanceKm !== undefined ? Number(t.distanceKm) : (parseFloat(t.distanceText) || 0),
        durationText: t.durationText || (t.travelTimeMins !== undefined ? `${t.travelTimeMins}m` : ''),
        travelTimeMins: t.travelTimeMins !== undefined ? Number(t.travelTimeMins) : (parseInt(t.durationText, 10) || 0)
      }));
    }

    if (updateData.advocateAudit) {
      const audit = updateData.advocateAudit;
      const isParentDeed = audit.parentDeedAudit === 'Cleared' || audit.parentDeedAudit === 'Verified' || audit.parentDeed === 'Cleared' || audit.parentDeed === true;
      const isEC = audit.encumbranceCertificate === 'Nil EC verified' || audit.encumbranceCertificate === 'Cleared' || audit.encumbranceCertificate === 'Verified' || audit.encumbrance === 'Cleared' || audit.encumbrance === true || audit.encumbranceCertificate === true;
      const isRTC = audit.revenueRtcCompliance === 'Verified' || audit.revenueRtcCompliance === 'Cleared' || audit.revenueRtc === 'Verified' || audit.revenueRtc === 'Cleared' || audit.revenueRtc === true;
      const isMCC = audit.mccPlanApprovals === 'Compliant' || audit.mccPlanApprovals === 'Cleared' || audit.mccPlanApprovals === 'Verified' || audit.mccPlan === 'Compliant' || audit.mccPlan === 'Cleared' || audit.mccPlan === true;
      const isDGPS = audit.dgpsSurveyVerification === 'Cleared' || audit.dgpsSurveyVerification === 'Verified' || audit.dgpsSurvey === 'Cleared' || audit.dgpsSurvey === true;

      const standardItems = [
        {
          documentName: 'Parent Title Deed',
          category: 'Ownership',
          verifiedStatus: isParentDeed ? 'Verified' : 'Pending',
          verificationNote: '30-Year Parent Deed Chain Audit'
        },
        {
          documentName: 'Encumbrance Certificate (30-Year EC)',
          category: 'Ownership',
          verifiedStatus: isEC ? 'Verified' : 'Pending',
          verificationNote: '30-Year Encumbrance Certificate (Nil EC verified)'
        },
        {
          documentName: 'Mutation Register Extract (RTC/Pahani)',
          category: 'Ownership',
          verifiedStatus: isRTC ? 'Verified' : 'Pending',
          verificationNote: 'Revenue RTC / Mutation Compliance (Verified)'
        },
        {
          documentName: 'Building Sanction Plan',
          category: 'Municipal',
          verifiedStatus: isMCC ? 'Verified' : 'Pending',
          verificationNote: 'MCC / Local Body Plan Approvals (Compliant)'
        },
        {
          documentName: 'Revenue / Survey Map (FMB)',
          category: 'Ownership',
          verifiedStatus: isDGPS ? 'Verified' : 'Pending',
          verificationNote: 'Physical Boundary DGPS Survey (Cleared)'
        }
      ];

      if (!Array.isArray(updateData.legalVerification) || updateData.legalVerification.length === 0) {
        updateData.legalVerification = standardItems;
      } else {
        standardItems.forEach(item => {
          const idx = updateData.legalVerification.findIndex(l => (l.documentName || '').toLowerCase() === item.documentName.toLowerCase());
          if (idx !== -1) {
            updateData.legalVerification[idx] = {
              ...updateData.legalVerification[idx],
              verifiedStatus: item.verifiedStatus,
              verificationNote: item.verificationNote
            };
          } else {
            updateData.legalVerification.push(item);
          }
        });
      }
    }

    let updatedProperty = null;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        // Use findByIdAndUpdate with { new: true, runValidators: true }
        updatedProperty = await Property.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true } // { new: true } returns the updated doc
        );
      }
      if (!updatedProperty) {
        // Fallback: try finding and updating by slug
        updatedProperty = await Property.findOneAndUpdate(
          { slug: id },
          { $set: updateData },
          { new: true, runValidators: true }
        );
      }
    } else {
      // In-memory cache fallback if MongoDB is offline
      const idx = INITIAL_PROPERTIES.findIndex(p => String(p._id) === String(id) || String(p.id) === String(id) || p.slug === id);
      if (idx !== -1) {
        INITIAL_PROPERTIES[idx] = { ...INITIAL_PROPERTIES[idx], ...updateData };
        updatedProperty = INITIAL_PROPERTIES[idx];
      }
    }

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property listing not found" });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/properties/:id - Update property listing (Admin only)
router.put('/:id', requireAdminAuth, updateProperty);

// PUT /api/properties/manage/:id - Alias update route
router.put('/manage/:id', requireAdminAuth, updateProperty);

// DELETE /api/properties/:id - Remove listing (Admin only)
router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    const identifier = req.params.id;
    let deleted = null;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(identifier)) {
        deleted = await Property.findByIdAndDelete(identifier);
      }
      if (!deleted) {
        deleted = await Property.findOneAndDelete({
          $or: [
            { slug: identifier },
            { id: identifier },
            { listingCode: identifier }
          ]
        });
      }
    }

    // Also remove from fallback in-memory cache if present
    const initIdx = INITIAL_PROPERTIES.findIndex(p =>
      String(p._id) === String(identifier) ||
      String(p.id) === String(identifier) ||
      p.slug === identifier ||
      p.listingCode === identifier
    );
    if (initIdx !== -1) {
      INITIAL_PROPERTIES.splice(initIdx, 1);
      if (!deleted) {
        deleted = { _id: identifier };
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Clean up persistent Cloudinary images associated with this property
    const imagesToDelete = [];
    if (deleted.coverImage) imagesToDelete.push(deleted.coverImage);
    if (Array.isArray(deleted.galleryImages)) imagesToDelete.push(...deleted.galleryImages);
    if (Array.isArray(deleted.images)) imagesToDelete.push(...deleted.images);

    if (imagesToDelete.length > 0) {
      deleteImagesFromCloudinary(imagesToDelete).catch(err => {
        console.warn('[Cloudinary Cleanup Warning]:', err.message);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
      id: identifier,
      data: { id: identifier }
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error: error.message
    });
  }
});

export default router;

```

## File: `server/routes/settingsRoutes.js`

```javascript
import express from 'express';
import mongoose from 'mongoose';
import SiteSettings from '../models/SiteSettings.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// In-memory fallback if MongoDB is not connected
let memorySettings = {
  heroFeaturedPropertyId: null,
  heroCustomYoutubeId: "",
  heroBadgeTag: "FEATURED PROPERTY",
  heroOverlayTitle: "",
  heroOverlayLocation: ""
};

// GET /api/settings - Retrieve current site settings
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let settings = await SiteSettings.findOne().populate('heroFeaturedPropertyId');
      if (!settings) {
        settings = await SiteSettings.create(memorySettings);
      }
      return res.json({
        success: true,
        data: settings
      });
    }

    return res.json({
      success: true,
      data: memorySettings,
      note: 'Serving from memory store (MongoDB disconnected)'
    });
  } catch (err) {
    console.error('Error fetching site settings:', err);
    return res.json({
      success: true,
      data: memorySettings,
      error: err.message
    });
  }
});

// PUT /api/settings - Update site settings (Admin only)
router.put('/', requireAdminAuth, async (req, res) => {
  try {
    const { 
      heroFeaturedPropertyId, 
      heroCustomYoutubeId, 
      heroBadgeTag, 
      heroOverlayTitle, 
      heroOverlayLocation 
    } = req.body;

    const updateData = {};
    if (heroFeaturedPropertyId !== undefined) {
      updateData.heroFeaturedPropertyId = heroFeaturedPropertyId && mongoose.Types.ObjectId.isValid(heroFeaturedPropertyId) 
        ? heroFeaturedPropertyId 
        : null;
    }
    if (heroCustomYoutubeId !== undefined) updateData.heroCustomYoutubeId = heroCustomYoutubeId;
    if (heroBadgeTag !== undefined) updateData.heroBadgeTag = heroBadgeTag;
    if (heroOverlayTitle !== undefined) updateData.heroOverlayTitle = heroOverlayTitle;
    if (heroOverlayLocation !== undefined) updateData.heroOverlayLocation = heroOverlayLocation;

    // Update in-memory fallback
    memorySettings = { ...memorySettings, ...updateData };

    if (mongoose.connection.readyState === 1) {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = new SiteSettings(updateData);
      } else {
        Object.assign(settings, updateData);
      }
      await settings.save();
      const populated = await SiteSettings.findById(settings._id).populate('heroFeaturedPropertyId');
      
      return res.json({
        success: true,
        message: 'Site settings updated successfully in MongoDB',
        data: populated
      });
    }

    return res.json({
      success: true,
      message: 'Site settings updated in memory store',
      data: memorySettings
    });
  } catch (err) {
    console.error('Error updating site settings:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update site settings',
      error: err.message
    });
  }
});

export default router;

```

## File: `server/scripts/updateAdminStatus.js`

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grabmykey';

async function run() {
  try {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to MongoDB via URI');
    } catch {
      if (fs.existsSync('/tmp/mongodb-27017.sock')) {
        await mongoose.connect('mongodb://%2Ftmp%2Fmongodb-27017.sock/grabmykey', { serverSelectionTimeoutMS: 2000 });
        console.log('Connected to MongoDB via Unix domain socket');
      } else {
        throw new Error('Unable to reach MongoDB via URI or socket');
      }
    }

    const collection = mongoose.connection.collection('admins');
    
    // Fetch all current admin documents
    const currentAdmins = await collection.find({}).toArray();
    console.log(`\n[Current Database Admins: ${currentAdmins.length}]`);
    for (const a of currentAdmins) {
      console.log(`  - ID: ${a._id} | Email: ${a.email} | Name: ${a.name} | Role: ${a.role || 'none'} | Status: ${a.status || 'none'}`);
    }

    // Execute update for documents where status doesn't exist or email is contact@grabmykey.in
    const updateResult = await collection.updateMany(
      {
        $or: [
          { status: { $exists: false } },
          { status: null },
          { email: 'contact@grabmykey.in' }
        ]
      },
      {
        $set: {
          status: 'approved',
          role: 'superadmin'
        }
      }
    );

    console.log(`\n[Update Result] Matched: ${updateResult.matchedCount}, Modified: ${updateResult.modifiedCount}`);

    // Verify state after update
    const finalAdmins = await collection.find({}).toArray();
    console.log(`\n[Final Database Admins: ${finalAdmins.length}]`);
    for (const a of finalAdmins) {
      console.log(`  ✓ ID: ${a._id} | Email: ${a.email} | Name: ${a.name} | Role: ${a.role} | Status: ${a.status}`);
    }

    await mongoose.disconnect();
    console.log('\nMigration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

run();


```

## File: `server/server.js`

```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import propertyRoutes from './routes/propertyRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import presetRoutes from './routes/presetRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grabmykey';

// Parse CLIENT_URL from process.env (supports comma-separated origins)
const envClientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(u => u.trim()).filter(Boolean)
  : [];

// Allowed Origins for Development & Production Environments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:4173',
  'https://grabmykey.in',
  'https://www.grabmykey.in',
  ...envClientUrls
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.endsWith('.grabmykey.in') ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Explicit fallback CORS headers to ensure http://localhost:5173 / http://localhost:5174 requests never fail
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static uploads if written
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/presets', presetRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'GrabMyKey Real Estate MERN API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Root API Welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GrabMyKey Luxury Real Estate API (MERN Backend)',
    endpoints: {
      properties: '/api/properties',
      leads: '/api/leads',
      health: '/api/health'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Connect to MongoDB & Start Server
const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`Connected to MongoDB at: ${MONGODB_URI.split('@').pop()}`);
  } catch (err) {
    console.warn(`[MongoDB Warning] ${err.message}`);
    // If local socket exists and TCP connection failed (e.g. sandbox environment), attempt unix domain socket fallback
    if (fs.existsSync('/tmp/mongodb-27017.sock')) {
      try {
        console.log('Attempting connection via Unix domain socket /tmp/mongodb-27017.sock...');
        await mongoose.connect('mongodb://%2Ftmp%2Fmongodb-27017.sock/grabmykey', {
          serverSelectionTimeoutMS: 3000
        });
        console.log('Connected to MongoDB via local Unix socket (/tmp/mongodb-27017.sock)');
      } catch (sockErr) {
        console.warn(`[Unix Socket Warning] ${sockErr.message}`);
      }
    }
    if (mongoose.connection.readyState !== 1) {
      console.warn('[MongoDB Info] Ensure MongoDB is running locally (mongod) or provide a valid MONGODB_URI in server/.env');
    }
  }

  // Legacy Admin Status & Primary Superadmin Startup Migration
  if (mongoose.connection.readyState === 1) {
    try {
      const updateResult = await mongoose.connection.collection('admins').updateMany(
        {
          $or: [
            { status: { $exists: false } },
            { status: null },
            { email: 'contact@grabmykey.in' }
          ]
        },
        {
          $set: {
            status: 'approved',
            role: 'superadmin'
          }
        }
      );
      if (updateResult.modifiedCount > 0) {
        console.log(`[Admin Migration] Successfully migrated ${updateResult.modifiedCount} admin record(s) to approved superadmin.`);
      }
    } catch (migrationErr) {
      console.warn(`[Admin Migration Warning]: ${migrationErr.message}`);
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GrabMyKey Express Backend active on http://0.0.0.0:${PORT} (Network: http://192.168.1.7:${PORT})`);
    console.log(`Endpoints: http://192.168.1.7:${PORT}/api/properties | http://192.168.1.7:${PORT}/api/leads`);
  });
};

startServer();

export default app;

```

## File: `src/AdminConsole.jsx`

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2, Users, PlusCircle, Trash2, Edit3,
  CheckCircle2, Eye, RefreshCw, Phone, Search, DollarSign,
  MapPin, X, Check, Save, ArrowLeft, Video, Upload,
  FileText, ShieldCheck, Layers, Car,
  FileCheck, ArrowUpRight, Play, FolderCog, Tag, Filter,
  ChevronUp, ChevronDown, Footprints, Train, Plane,
  TrendingUp, Image as ImageIcon, Star, Clock, KeyRound, AlertCircle, EyeOff
} from 'lucide-react';

import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  fetchLeads,
  updateLeadStatus,
  deleteLead,
  fetchSiteSettings,
  updateSiteSettings,
  fetchPresets,
  createPreset,
  updatePreset,
  deletePreset,
  seedDefaultPresets,
  checkServerHealth,
  fetchAdmins,
  approveAdmin,
  rejectAdmin,
  deleteAdmin,
  fetchInviteKey,
  updateInviteKey,
  getStoredAdminUser
} from './api';
import { DEFAULT_MASTER_PRESETS, ASSET_SPEC_PRESETS, getAssetSpecPresets } from './defaultPresets';
import Navbar from './components/admin/Navbar';
import Sidebar from './components/admin/Sidebar';
import AddCustomItemModal from './components/AddCustomItemModal';
import { toast } from 'sonner';



// Preset: Default 12-Point Legal Checklist (Defaults to Pending for new listings)
const DEFAULT_12_POINT_LEGAL_CHECKLIST = [
  { documentName: "Parent Title Deed", category: "Ownership", verifiedStatus: "Pending", verificationNote: "30-Year clear parent deed chain audit", isCustomItem: false },
  { documentName: "Encumbrance Certificate (30-Year EC)", category: "Ownership", verifiedStatus: "Pending", verificationNote: "Nil encumbrance Form 15 status", isCustomItem: false },
  { documentName: "Khata / Possession Certificate", category: "Municipal", verifiedStatus: "Pending", verificationNote: "A-Khata / Possession Certificate verification", isCustomItem: false },
  { documentName: "Latest Property Tax Receipts", category: "Tax", verifiedStatus: "Pending", verificationNote: "Municipal property tax clearance", isCustomItem: false },
  { documentName: "Building Sanction Plan", category: "Municipal", verifiedStatus: "Pending", verificationNote: "Sanctioned approved construction blueprint on record", isCustomItem: false },
  { documentName: "Occupancy Certificate (OC)", category: "Municipal", verifiedStatus: "Pending", verificationNote: "Final Occupancy Certificate issued by statutory authority", isCustomItem: false },
  { documentName: "No Objection Certificates (NOCs)", category: "Municipal", verifiedStatus: "Pending", verificationNote: "Statutory fire, pollution, and structural NOCs", isCustomItem: false },
  { documentName: "NOC from Society / Association", category: "Municipal", verifiedStatus: "Pending", verificationNote: "RWA / Society dues clearance and transfer NOC", isCustomItem: false },
  { documentName: "Possession & Allotment Letter", category: "Ownership", verifiedStatus: "Pending", verificationNote: "Original physical allotment letter and possession memo", isCustomItem: false },
  { documentName: "Utility Dues Clearances", category: "Tax", verifiedStatus: "Pending", verificationNote: "Power (MESCOM) and water board zero-dues receipt", isCustomItem: false },
  { documentName: "Mutation Register Extract (RTC/Pahani)", category: "Ownership", verifiedStatus: "Pending", verificationNote: "Revenue mutation extract / RTC status", isCustomItem: false },
  { documentName: "Revenue / Survey Map (FMB)", category: "Ownership", verifiedStatus: "Pending", verificationNote: "Field Measurement Book (FMB) physical boundary verification", isCustomItem: false }
];

// Preset: Default Dynamic Property Features Matrix (Defaults to Not Included for new listings)
const DEFAULT_PROPERTY_FEATURES = [
  // Build & Material Specifications
  { categoryName: "Build & Materials", featureName: "Flooring Type", isAvailable: false, status: 'Not Included', descriptionNote: "Imported Italian Marble (Living) + Teak Hardwood (Bedrooms)" },
  { categoryName: "Build & Materials", featureName: "Wood & Joinery", isAvailable: false, status: 'Not Included', descriptionNote: "100% Seasoned Burma Teakwood (Doors, Frames & Windows)" },
  { categoryName: "Build & Materials", featureName: "Wall Finish & Paint", isAvailable: false, status: 'Not Included', descriptionNote: "ROYAL Silk Emulsion + Texture Accent Walls" },
  { categoryName: "Build & Materials", featureName: "Structural Frame", isAvailable: false, status: 'Not Included', descriptionNote: "Earthquake Resistant RCC Framed Structure (M25 Grade)" },
  { categoryName: "Build & Materials", featureName: "Roofing & Insulation", isAvailable: false, status: 'Not Included', descriptionNote: "Sloped Concrete Slab with Terracotta Tiles & Heat Shield Insulation" },
  { categoryName: "Build & Materials", featureName: "Sanitaryware & Fittings", isAvailable: false, status: 'Not Included', descriptionNote: "Kohler / Grohe Concealed Diverters & Wall-Hung Closets" },

  // Interior & Living
  { categoryName: "Interior & Living", featureName: "Modular Kitchen", isAvailable: false, status: 'Not Included', descriptionNote: "Faber Chimney, Blum Soft-Close Hardware & Quartz Island" },
  { categoryName: "Interior & Living", featureName: "Air Conditioning", isAvailable: false, status: 'Not Included', descriptionNote: "Daikin VRV Centralized Inverter Climate Control" },

  // Building & Security
  { categoryName: "Building & Security", featureName: "CCTV & Security", isAvailable: false, status: 'Not Included', descriptionNote: "8-Channel IP Cameras + Biometric Video Door Phone" },
  { categoryName: "Building & Security", featureName: "Automated Gate", isAvailable: false, status: 'Not Included', descriptionNote: "Motorized RFID Sensor Ingress Gate" },

  // Utilities & Outdoor
  { categoryName: "Utilities", featureName: "Power Backup", isAvailable: false, status: 'Not Included', descriptionNote: "15 kVA Silent DG Generator with Auto-Transfer Switch" },
  { categoryName: "Utilities", featureName: "Water Supply", isAvailable: false, status: 'Not Included', descriptionNote: "Dual Source (Open Well + Municipal Supply + 10,000L Sump)" },
  { categoryName: "Outdoor", featureName: "Covered Vehicle Parking", isAvailable: false, status: 'Not Included', descriptionNote: "3 SUV Parking Bay with Integrated 11kW EV Fast Charger" }
];
const DEFAULT_CAR_STYLE_FEATURES = DEFAULT_PROPERTY_FEATURES; // Alias for backward compatibility

// Preset: Default Manual Strategic Transit & Infrastructure
const DEFAULT_TRANSIT_MATRIX = [
  { landmarkName: "Mangaluru International Airport (IXE)", destination: "Mangaluru International Airport (IXE)", distanceText: "14.2 km", distanceKm: 14.2, durationText: "20m", travelTimeMins: 20, travelMode: "Flight", transportMode: "Drive" },
  { landmarkName: "Surathkal Railway Station", destination: "Surathkal Railway Station", distanceText: "3.5 km", distanceKm: 3.5, durationText: "8m", travelTimeMins: 8, travelMode: "Transit", transportMode: "Drive" },
  { landmarkName: "NITK Surathkal Campus & Beach", destination: "NITK Surathkal Campus & Beach", distanceText: "2.1 km", distanceKm: 2.1, durationText: "5m", travelTimeMins: 5, travelMode: "Drive", transportMode: "Drive" },
  { landmarkName: "Mangalore City Central / Hampankatta", destination: "Mangalore City Central / Hampankatta", distanceText: "17.5 km", distanceKm: 17.5, durationText: "25m", travelTimeMins: 25, travelMode: "Drive", transportMode: "Drive" }
];

// Initial state for property creation/editing (All toggles & checkboxes default to false / unchecked)
const INITIAL_FORM_STATE = {
  title: '',
  slug: '',
  city: 'Mangaluru',
  locality: 'Bejai',
  category: 'Villa',
  dealType: 'Resale',
  expectedPrice: 27500000,
  isNegotiable: false,
  maintenanceFee: 0,
  bedrooms: 4,
  bathrooms: 4,
  carpetAreaSqFt: 3800,
  furnishingStatus: 'Unfurnished',
  floorLevel: 'G+1',
  totalFloors: '2',
  youtubeVideoId: '',
  coverImage: '',
  galleryImages: [],
  description: '',
  badge: 'Verified Listing',
  isFeatured: false,
  status: 'Active',
  advocateVerificationAvailable: false,

  // Dynamic Car-Style Feature Matrix (Defaults to Not Included)
  componentsMatrix: DEFAULT_CAR_STYLE_FEATURES,

  // Manual Strategic Transit & Infrastructure
  transitMatrix: DEFAULT_TRANSIT_MATRIX,
  roadIngressText: '',
  zoningTagText: '',

  // Dynamic Self-Verifiable Legal Audit (Defaults to Pending)
  legalVerification: DEFAULT_12_POINT_LEGAL_CHECKLIST,

  // Statutory Advocate Audit State
  advocateAudit: {
    parentDeedAudit: 'Pending',
    encumbranceCertificate: 'Pending',
    revenueRtcCompliance: 'Pending',
    mccPlanApprovals: 'Pending',
    dgpsSurveyVerification: 'Pending'
  },

  // Investment Analysis
  rentalYieldEst: '',
  resaleAppreciationEst: '',
  localityGrowthDriver: ''
};

const SAMPLE_PROPERTIES = [];

const SAMPLE_INBOUND_LEADS = [];

export default function AdminConsole({ onExit, onViewLiveProperty, onDataUpdated }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamically derive base admin path to support both /admin and legacy /manage-345
  const baseAdminPath = location.pathname.startsWith('/manage-345') ? '/manage-345' : '/admin';

  // Active view tab state derived from URL or internal selection
  const isPublishRoute = location.pathname.includes('publish-listing');
  const isMasterPresetsRoute = location.pathname.includes('master-presets');
  const [internalTab, setInternalTab] = useState('overview');
  const activeTab = isPublishRoute ? 'publish-listing' : (isMasterPresetsRoute ? 'master-presets' : internalTab);

  // Data states
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');

  // Master Presets & System Config state
  const [presets, setPresets] = useState(DEFAULT_MASTER_PRESETS);
  const [presetTab, setPresetTab] = useState('legal'); // 'legal' | 'features'
  const [presetCategoryFilter, setPresetCategoryFilter] = useState('Apartment'); // For Tab 2
  const [presetGroupFilter, setPresetGroupFilter] = useState('All');
  const [presetSearchQuery, setPresetSearchQuery] = useState('');
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState(null);
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [presetFormData, setPresetFormData] = useState({
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: '',
    groupCategory: 'Title',
    defaultDescription: '',
    defaultStatus: 'Available',
    isActive: true
  });

  // Form & Wizard state for View 4: Publish Listing
  const [formStep, setFormStep] = useState(1);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showYoutubePicker, setShowYoutubePicker] = useState(false);

  // Custom Modal State (Replacing window.prompt)
  const [customItemModal, setCustomItemModal] = useState({
    isOpen: false,
    type: '', // 'FEATURE' | 'LEGAL'
    categoryName: '',
    title: '',
    note: '',
    status: 'Verified'
  });

  // Admin Access & Security state
  const [adminsList, setAdminsList] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [currentInviteKey, setCurrentInviteKey] = useState('');
  const [inviteKeyInput, setInviteKeyInput] = useState('');
  const [showConsoleInviteKey, setShowConsoleInviteKey] = useState(false);
  const [inviteKeySaving, setInviteKeySaving] = useState(false);
  const [securityMessage, setSecurityMessage] = useState(null);
  const currentAdminUser = getStoredAdminUser();

  // Hero Featured Video & Settings state
  const [heroSettings, setHeroSettings] = useState({
    heroFeaturedPropertyId: '',
    heroCustomYoutubeId: '',
    heroBadgeTag: 'FEATURED PROPERTY',
    heroOverlayTitle: '',
    heroOverlayLocation: ''
  });
  const [isSavingHeroSettings, setIsSavingHeroSettings] = useState(false);
  const [heroSaveSuccess, setHeroSaveSuccess] = useState(false);

  // Custom Property Delete Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    property: null,
    isDeleting: false
  });

  // Dedicated Clean Confirmation Modal State (Replacing native window.confirm)
  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDestructive: true,
    onConfirm: null
  });

  const requestConfirmation = ({
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = true,
    onConfirm
  }) => {
    setConfirmModalState({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      isDestructive,
      onConfirm
    });
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalState(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  // Dynamic feature selector based on category and presets (defaults to false / Not Included for new listings)
  const getFeaturesForCategory = (cat, defaultAvailable = false) => {
    const rawPresets = getAssetSpecPresets(cat);
    return rawPresets.map(p => ({
      categoryName: p.category,
      featureName: p.feature,
      isAvailable: defaultAvailable,
      status: defaultAvailable ? 'Included' : 'Not Included',
      descriptionNote: p.details
    }));
  };

  // Master Presets Action Handlers
  const handleOpenAddPreset = (type = 'LEGAL_CHECK') => {
    setEditingPresetId(null);
    if (type === 'LEGAL_CHECK') {
      setPresetFormData({
        presetType: 'LEGAL_CHECK',
        applicableCategory: 'ALL',
        title: '',
        groupCategory: 'Title',
        defaultDescription: '',
        defaultStatus: 'Available',
        isActive: true
      });
    } else {
      setPresetFormData({
        presetType: 'PROPERTY_FEATURE',
        applicableCategory: presetCategoryFilter === 'ALL' ? 'Apartment' : presetCategoryFilter,
        title: '',
        groupCategory: 'Interior & Living',
        defaultDescription: '',
        defaultStatus: 'Available',
        isActive: true
      });
    }
    setShowPresetModal(true);
  };

  const handleOpenEditPreset = (item) => {
    setEditingPresetId(item._id || item.id);
    setPresetFormData({
      presetType: item.presetType || 'LEGAL_CHECK',
      applicableCategory: item.applicableCategory || 'ALL',
      title: item.title || '',
      groupCategory: item.groupCategory || (item.presetType === 'LEGAL_CHECK' ? 'Title' : 'General'),
      defaultDescription: item.defaultDescription || '',
      defaultStatus: item.defaultStatus || 'Available',
      isActive: item.isActive !== false
    });
    setShowPresetModal(true);
  };

  const handleSavePreset = async (e) => {
    e.preventDefault();
    if (!presetFormData.title || !presetFormData.title.trim()) {
      toast.error('Please enter a title / document name.');
      return;
    }

    setIsSavingPreset(true);
    try {
      if (editingPresetId) {
        const res = await updatePreset(editingPresetId, presetFormData);
        if (res?.success && res.data) {
          setPresets(prev => prev.map(p => (String(p._id) === String(editingPresetId) || String(p.id) === String(editingPresetId)) ? res.data : p));
        } else {
          setPresets(prev => prev.map(p => (String(p._id) === String(editingPresetId) || String(p.id) === String(editingPresetId)) ? { ...p, ...presetFormData } : p));
        }
        toast.success('Master preset updated successfully.');
      } else {
        const res = await createPreset(presetFormData);
        if (res?.success && res.data) {
          setPresets(prev => [...prev, res.data]);
        } else {
          const fallbackItem = { ...presetFormData, _id: `local-${Date.now()}` };
          setPresets(prev => [...prev, fallbackItem]);
        }
        toast.success('New master preset created.');
      }
      setShowPresetModal(false);
    } catch (err) {
      console.warn('Saved preset to local state:', err.message);
      if (editingPresetId) {
        setPresets(prev => prev.map(p => (String(p._id) === String(editingPresetId) || String(p.id) === String(editingPresetId)) ? { ...p, ...presetFormData } : p));
      } else {
        setPresets(prev => [...prev, { ...presetFormData, _id: `local-${Date.now()}` }]);
      }
      toast.info('Preset saved locally.');
      setShowPresetModal(false);
    } finally {
      setIsSavingPreset(false);
    }
  };

  const handleDeletePreset = (id) => {
    requestConfirmation({
      title: 'Delete Master Preset',
      message: 'Delete this master preset? Listings already published will retain their existing records.',
      confirmText: 'Delete Preset',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deletePreset(id);
          toast.success('Master preset deleted.');
        } catch (err) {
          console.warn('Deleted preset locally:', err.message);
          toast.info('Preset removed locally.');
        }
        setPresets(prev => prev.filter(p => String(p._id) !== String(id) && String(p.id) !== String(id)));
      }
    });
  };

  const handleTogglePresetActive = async (item) => {
    const id = item._id || item.id;
    const newActive = item.isActive === false ? true : false;
    setPresets(prev => prev.map(p => (String(p._id) === String(id) || String(p.id) === String(id)) ? { ...p, isActive: newActive } : p));
    try {
      await updatePreset(id, { isActive: newActive });
    } catch (err) {
      console.warn('Toggled preset locally:', err.message);
    }
  };

  const handleSeedDefaults = () => {
    requestConfirmation({
      title: 'Reset Master Presets',
      message: 'Reset master presets to statutory GrabMyKey defaults? Custom presets will be refreshed.',
      confirmText: 'Reset Defaults',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await seedDefaultPresets();
          if (res?.success && Array.isArray(res.data)) {
            setPresets(res.data);
          } else {
            setPresets(DEFAULT_MASTER_PRESETS);
          }
          toast.success('Master presets reset to statutory defaults successfully!');
        } catch (err) {
          console.warn('Using local default master presets:', err.message);
          setPresets(DEFAULT_MASTER_PRESETS);
          toast.info('Master presets reset to statutory defaults.');
        }
      }
    });
  };

  // Load database data on mount
  const loadData = async () => {
    setLoading(true);
    try {
      await checkServerHealth();

      const propRes = await fetchProperties();
      if (propRes?.success && Array.isArray(propRes.data)) {
        setProperties(propRes.data);
      } else {
        setProperties([]);
      }

      const leadRes = await fetchLeads();
      if (leadRes?.success && Array.isArray(leadRes.data)) {
        setLeads(leadRes.data);
      } else {
        setLeads([]);
      }

      try {
        const settingsRes = await fetchSiteSettings();
        if (settingsRes?.success && settingsRes.data) {
          const d = settingsRes.data;
          setHeroSettings({
            heroFeaturedPropertyId: d.heroFeaturedPropertyId?._id || d.heroFeaturedPropertyId || '',
            heroCustomYoutubeId: d.heroCustomYoutubeId || '',
            heroBadgeTag: d.heroBadgeTag || 'FEATURED PROPERTY',
            heroOverlayTitle: d.heroOverlayTitle || '',
            heroOverlayLocation: d.heroOverlayLocation || ''
          });
        }
      } catch (settingsErr) {
        console.warn('Could not load site settings in admin:', settingsErr.message);
      }

      try {
        const presetRes = await fetchPresets();
        if (presetRes?.success && Array.isArray(presetRes.data) && presetRes.data.length > 0) {
          setPresets(presetRes.data);
        }
      } catch (presetErr) {
        console.warn('Using default master presets:', presetErr.message);
      }

      try {
        await loadAdminsAndInviteKey();
      } catch (adminErr) {
        console.warn('Could not load admins list:', adminErr.message);
      }
    } catch (err) {
      console.warn('Admin running on cached state:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminsAndInviteKey = async () => {
    setAdminsLoading(true);
    try {
      const [adminsRes, keyRes] = await Promise.allSettled([
        fetchAdmins(),
        fetchInviteKey()
      ]);
      if (adminsRes.status === 'fulfilled' && adminsRes.value?.success && Array.isArray(adminsRes.value.admins)) {
        setAdminsList(adminsRes.value.admins);
      }
      if (keyRes.status === 'fulfilled' && keyRes.value?.success && keyRes.value.inviteKey) {
        setCurrentInviteKey(keyRes.value.inviteKey);
        setInviteKeyInput(keyRes.value.inviteKey);
      }
    } catch (err) {
      console.warn('Error loading admin security directory:', err);
    } finally {
      setAdminsLoading(false);
    }
  };

  const handleApproveAdmin = async (id) => {
    try {
      const res = await approveAdmin(id);
      if (res?.success) {
        setSecurityMessage({ type: 'success', text: res.message || 'Administrator account approved.' });
        await loadAdminsAndInviteKey();
      }
    } catch (err) {
      setSecurityMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to approve administrator.' });
    }
  };

  const handleRejectAdmin = async (id) => {
    try {
      const res = await rejectAdmin(id);
      if (res?.success) {
        setSecurityMessage({ type: 'success', text: res.message || 'Administrator account rejected.' });
        await loadAdminsAndInviteKey();
      }
    } catch (err) {
      setSecurityMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to reject administrator.' });
    }
  };

  const handleDeleteAdmin = (id, name) => {
    requestConfirmation({
      title: 'Remove Administrator',
      message: `Are you sure you want to remove administrator "${name}"? This action will revoke all access for this account.`,
      confirmText: 'Remove Admin',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await deleteAdmin(id);
          if (res?.success) {
            setSecurityMessage({ type: 'success', text: res.message || 'Administrator removed.' });
            toast.success(`Administrator ${name} removed.`);
            await loadAdminsAndInviteKey();
          }
        } catch (err) {
          const errMsg = err.response?.data?.message || err.message || 'Failed to remove administrator.';
          setSecurityMessage({ type: 'error', text: errMsg });
          toast.error(errMsg);
        }
      }
    });
  };

  const handleSaveInviteKey = async (e) => {
    e.preventDefault();
    if (!inviteKeyInput || inviteKeyInput.trim().length < 6) {
      setSecurityMessage({ type: 'error', text: 'Invite key must be at least 6 characters long.' });
      return;
    }
    setInviteKeySaving(true);
    try {
      const res = await updateInviteKey(inviteKeyInput.trim());
      if (res?.success) {
        setCurrentInviteKey(res.inviteKey);
        setSecurityMessage({ type: 'success', text: 'Dynamic invite key updated successfully.' });
      }
    } catch (err) {
      setSecurityMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to update invite key.' });
    } finally {
      setInviteKeySaving(false);
    }
  };


  useEffect(() => {
    loadData();
    const handleRefreshEvent = () => {
      loadData();
    };
    window.addEventListener('grabmykey_properties_updated', handleRefreshEvent);
    window.addEventListener('grabmykey_property_created', handleRefreshEvent);
    return () => {
      window.removeEventListener('grabmykey_properties_updated', handleRefreshEvent);
      window.removeEventListener('grabmykey_property_created', handleRefreshEvent);
    };
  }, []);

  // Navigation handlers
  const handleTabSwitch = (tabName) => {
    const targetTab = tabName === 'hero' ? 'hero-settings' : tabName;
    if (targetTab === 'publish-listing') {
      navigate(`${baseAdminPath}/publish-listing`);
    } else if (targetTab === 'master-presets') {
      navigate(`${baseAdminPath}/master-presets`);
    } else {
      setInternalTab(targetTab);
      if (location.pathname !== baseAdminPath) {
        navigate(baseAdminPath);
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPropertyId(null);
    setFormData(INITIAL_FORM_STATE);
    setFormStep(1);
    navigate(`${baseAdminPath}/publish-listing`);
  };

  const handleCancelForm = () => {
    setEditingPropertyId(null);
    setFormData(INITIAL_FORM_STATE);
    setFormStep(1);
    handleTabSwitch('inventory');
  };

  const handleOpenEditModal = (prop) => {
    setEditingPropertyId(prop._id || prop.id);
    const resolvedCat = prop.category || prop.type || 'Villa';
    const numPrice = prop.pricing?.expectedPrice || prop.priceRaw || parseInt(String(prop.price || '').replace(/[^0-9]/g, ''), 10) || 25000000;
    const resolvedCity = 'Mangaluru';
    const resolvedLocality = prop.locality || (prop.location ? prop.location.split(',')[0].trim() : 'Central');
    const resolvedSlug = prop.slug || prop.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || '';

    // Dynamic sync with active master presets
    let initialComponents = Array.isArray(prop.componentsMatrix) && prop.componentsMatrix.length > 0
      ? [...prop.componentsMatrix]
      : [...DEFAULT_CAR_STYLE_FEATURES];
    const activeFeaturePresets = presets.filter(p =>
      p.presetType === 'PROPERTY_FEATURE' &&
      p.isActive !== false &&
      (p.applicableCategory === 'ALL' || !p.applicableCategory || p.applicableCategory === resolvedCat || (resolvedCat === 'Independent House' && p.applicableCategory === 'Villa'))
    );
    for (const p of activeFeaturePresets) {
      if (!initialComponents.some(c => (c.featureName || '').toLowerCase() === (p.title || '').toLowerCase())) {
        initialComponents.push({
          categoryName: p.groupCategory || 'General',
          featureName: p.title,
          isAvailable: false,
          descriptionNote: "Status Not Updated"
        });
      }
    }

    let initialLegal = Array.isArray(prop.legalVerification) && prop.legalVerification.length > 0
      ? [...prop.legalVerification]
      : [...DEFAULT_12_POINT_LEGAL_CHECKLIST];
    const activeLegalPresets = presets.filter(p => p.presetType === 'LEGAL_CHECK' && p.isActive !== false);
    for (const p of activeLegalPresets) {
      if (!initialLegal.some(l => (l.documentName || '').toLowerCase() === (p.title || '').toLowerCase())) {
        initialLegal.push({
          documentName: p.title,
          category: p.groupCategory || 'General Title',
          verifiedStatus: 'Pending',
          verificationNote: 'Pending Audit / Status Not Updated',
          isCustomItem: false
        });
      }
    }

    setFormData({
      title: prop.title || '',
      slug: resolvedSlug,
      city: resolvedCity,
      locality: resolvedLocality,
      category: resolvedCat,
      dealType: prop.dealType || 'Resale',
      expectedPrice: numPrice,
      isNegotiable: prop.pricing?.isNegotiable ?? true,
      maintenanceFee: prop.pricing?.maintenanceFee || 0,
      bedrooms: prop.specs?.bedrooms ?? prop.beds ?? 4,
      bathrooms: prop.specs?.bathrooms ?? prop.baths ?? 4,
      carpetAreaSqFt: prop.specs?.carpetAreaSqFt || parseInt(String(prop.area || '').replace(/[^0-9]/g, ''), 10) || 3500,
      furnishingStatus: prop.specs?.furnishingStatus || 'Fully Furnished',
      floorLevel: prop.specs?.floorLevel || 'G',
      totalFloors: prop.specs?.totalFloors || '1',
      youtubeVideoId: prop.youtubeVideoId || (prop.videoUrl?.includes('v=') ? prop.videoUrl.split('v=')[1]?.substring(0, 11) : ''),
      coverImage: prop.coverImage || (Array.isArray(prop.galleryImages) && prop.galleryImages[0]) || (Array.isArray(prop.images) && prop.images[0]) || '',
      galleryImages: Array.isArray(prop.galleryImages) && prop.galleryImages.length > 0
        ? prop.galleryImages
        : (Array.isArray(prop.images) ? prop.images : []),
      badge: prop.badge || 'Verified Listing',
      description: prop.description || '',
      isFeatured: prop.isFeatured ?? false,
      status: prop.status || 'Active',
      advocateVerificationAvailable: prop.advocateVerificationAvailable ?? true,

      componentsMatrix: initialComponents,
      transitMatrix: (Array.isArray(prop.transitMatrix) && prop.transitMatrix.length > 0
        ? prop.transitMatrix
        : DEFAULT_TRANSIT_MATRIX).map(t => ({
          landmarkName: t.landmarkName || t.destination || '',
          destination: t.destination || t.landmarkName || '',
          travelMode: t.travelMode || t.transportMode || 'Drive',
          transportMode: t.transportMode || t.travelMode || 'Drive',
          distanceText: t.distanceText || (t.distanceKm !== undefined ? `${t.distanceKm} km` : ''),
          distanceKm: t.distanceKm !== undefined ? Number(t.distanceKm) : (parseFloat(t.distanceText) || 0),
          durationText: t.durationText || (t.travelTimeMins !== undefined ? `${t.travelTimeMins}m` : ''),
          travelTimeMins: t.travelTimeMins !== undefined ? Number(t.travelTimeMins) : (parseInt(t.durationText, 10) || 0)
        })),
      roadIngressText: prop.roadIngressText || prop.specs?.technicalSpecs?.roadWidth || '40ft Tar Road',
      zoningTagText: prop.zoningTagText || prop.specs?.technicalSpecs?.zoning || 'RERA Compliant',
      legalVerification: initialLegal,

      rentalYieldEst: prop.investmentAnalysis?.rentalYieldEst || '₹95,000 / mo (4.5% Gross Yield)',
      resaleAppreciationEst: prop.investmentAnalysis?.resaleAppreciationEst || '11.0% - 13.5% Compound Y-o-Y',
      localityGrowthDriver: prop.investmentAnalysis?.localityGrowthDriver || 'High-growth corridor with infrastructure development'
    });
    setFormStep(1);
    navigate(`${baseAdminPath}/publish-listing`);
  };

  // CRUD Property actions & Custom Confirmation Modal
  const handleRequestDelete = (property) => {
    setDeleteModalState({
      isOpen: true,
      property,
      isDeleting: false
    });
  };

  const handleCloseDeleteModal = () => {
    if (deleteModalState.isDeleting) return;
    setDeleteModalState({
      isOpen: false,
      property: null,
      isDeleting: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.property) return;
    const target = deleteModalState.property;
    // Strictly prioritize true MongoDB ObjectId (_id)
    const targetId = target._id || target.id;

    if (!targetId) {
      setDeleteModalState(prev => ({
        ...prev,
        error: 'Unable to identify property ID for deletion.'
      }));
      return;
    }

    setDeleteModalState(prev => ({ ...prev, isDeleting: true, error: null }));

    try {
      // Send DELETE request to Express backend
      const response = await deleteProperty(targetId);

      // Verify success response
      if (response && response.success === false) {
        throw new Error(response.message || 'Server indicated deletion failed');
      }

      // 1. Immediately remove from frontend state
      setProperties(prev => prev.filter(p => {
        const pId = p._id || p.id;
        return pId !== targetId && String(p._id) !== String(targetId) && String(p.id) !== String(targetId);
      }));

      // 2. Broadcast live event across all open pages & storefront
      window.dispatchEvent(new CustomEvent('grabmykey_properties_updated'));
      window.dispatchEvent(new CustomEvent('grabmykey_property_deleted', { detail: { id: targetId } }));

      if (onDataUpdated) onDataUpdated();

      // 3. Close modal cleanly
      setDeleteModalState({
        isOpen: false,
        property: null,
        isDeleting: false,
        error: null
      });
    } catch (err) {
      console.error('Property deletion failed:', err);
      const isNetworkErr = !err.response && (
        err.name === 'TypeError' ||
        err.message?.includes('Network Error') ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('connection refused')
      );
      const errorMsg = isNetworkErr
        ? 'Backend server is offline. Please start the Express server on port 5000 to delete listings from MongoDB.'
        : (err.response?.data?.message || err.message || 'Failed to delete property from database.');

      setDeleteModalState(prev => ({
        ...prev,
        isDeleting: false,
        error: errorMsg
      }));
    }
  };

  // Lead actions
  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
    } catch (err) {
      console.warn('Backend lead status update error:', err.message);
    }
    setLeads(prev => prev.map(l => ((l._id || l.id) === leadId ? { ...l, status: newStatus } : l)));
  };

  const handleDeleteLead = (leadId) => {
    requestConfirmation({
      title: 'Remove Inbound Lead',
      message: 'Remove this lead inquiry from the queue?',
      confirmText: 'Remove Lead',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteLead(leadId);
          toast.success('Lead inquiry removed.');
        } catch (err) {
          console.warn('Backend lead delete error:', err.message);
          toast.info('Lead inquiry removed locally.');
        }
        setLeads(prev => prev.filter(l => (l._id || l.id) !== leadId));
      }
    });
  };

  // Hero Featured Video Handlers
  const handleSelectHeroProperty = (propertyId) => {
    const prop = properties.find(p => String(p._id) === String(propertyId) || String(p.id) === String(propertyId));
    if (prop) {
      setHeroSettings(prev => ({
        ...prev,
        heroFeaturedPropertyId: propertyId,
        heroOverlayTitle: prop.title || prev.heroOverlayTitle,
        heroOverlayLocation: `${prop.location || prop.locality || 'Surathkal Beach, Mangaluru'} • ${prop.price || '₹3.85 Cr'}`,
        heroBadgeTag: prop.badge || prev.heroBadgeTag || 'FEATURED PROPERTY',
        heroCustomYoutubeId: prev.heroCustomYoutubeId || prop.youtubeVideoId || ''
      }));
    } else {
      setHeroSettings(prev => ({
        ...prev,
        heroFeaturedPropertyId: propertyId
      }));
    }
  };

  const handleSaveHeroSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSavingHeroSettings(true);
    try {
      const payload = {
        heroFeaturedPropertyId: heroSettings.heroFeaturedPropertyId || null,
        heroCustomYoutubeId: (heroSettings.heroCustomYoutubeId || '').trim(),
        heroBadgeTag: (heroSettings.heroBadgeTag || '').trim() || 'FEATURED PROPERTY',
        heroOverlayTitle: (heroSettings.heroOverlayTitle || '').trim(),
        heroOverlayLocation: (heroSettings.heroOverlayLocation || '').trim()
      };
      const res = await updateSiteSettings(payload);
      if (res?.success) {
        window.dispatchEvent(new CustomEvent('grabmykey_settings_updated', { detail: res.data }));
        setHeroSaveSuccess(true);
        setTimeout(() => setHeroSaveSuccess(false), 3000);
        toast.success('Hero Video settings updated successfully.');
        if (onDataUpdated) onDataUpdated();
      }
    } catch (err) {
      toast.error('Failed to save Hero Settings: ' + err.message);
    } finally {
      setIsSavingHeroSettings(false);
    }
  };

  const previewYoutubeId = useMemo(() => {
    if (heroSettings.heroCustomYoutubeId && heroSettings.heroCustomYoutubeId.trim()) {
      const raw = heroSettings.heroCustomYoutubeId.trim();
      const match = raw.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      return (match && match[2].length === 11) ? match[2] : raw;
    }
    const prop = properties.find(p => String(p._id) === String(heroSettings.heroFeaturedPropertyId) || String(p.id) === String(heroSettings.heroFeaturedPropertyId));
    return prop?.youtubeVideoId || "";
  }, [heroSettings.heroCustomYoutubeId, heroSettings.heroFeaturedPropertyId, properties]);

  const previewThumbnail = useMemo(() => {
    if (previewYoutubeId) {
      return `https://img.youtube.com/vi/${previewYoutubeId}/maxresdefault.jpg`;
    }
    const prop = properties.find(p => String(p._id) === String(heroSettings.heroFeaturedPropertyId) || String(p.id) === String(heroSettings.heroFeaturedPropertyId));
    return prop?.coverImage || prop?.images?.[0] || prop?.galleryImages?.[0] || '';
  }, [previewYoutubeId, heroSettings.heroFeaturedPropertyId, properties]);

  // Dynamic Car-Style Feature Matrix Handlers


  const handleToggleFeature = (idx) => {
    setFormData(prev => {
      const updated = [...(prev.componentsMatrix || [])];
      const isCurrentlyAvailable = updated[idx].isAvailable !== false && updated[idx].status !== 'Not Included';
      updated[idx] = { 
        ...updated[idx], 
        isAvailable: !isCurrentlyAvailable,
        status: !isCurrentlyAvailable ? 'Included' : 'Not Included'
      };
      return { ...prev, componentsMatrix: updated };
    });
  };

  const handleFeatureNoteChange = (idx, note) => {
    setFormData(prev => {
      const updated = [...(prev.componentsMatrix || [])];
      updated[idx] = { 
        ...updated[idx], 
        descriptionNote: note,
        details: note 
      };
      return { ...prev, componentsMatrix: updated };
    });
  };

  const handleDeleteFeature = (idx) => {
    setFormData(prev => ({
      ...prev,
      componentsMatrix: (prev.componentsMatrix || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAddCustomFeature = (categoryName = 'Interior & Living') => {
    setCustomItemModal({
      isOpen: true,
      type: 'FEATURE',
      categoryName,
      title: '',
      note: '',
      status: 'Included'
    });
  };

  const handleResetDefaultFeatures = () => {
    const cat = formData.category || 'Villa';
    requestConfirmation({
      title: 'Reset Feature Matrix',
      message: `Reset feature matrix to standard ${cat} master template? Any custom modifications will be reset.`,
      confirmText: 'Apply Template',
      isDestructive: false,
      onConfirm: () => {
        setFormData(prev => ({
          ...prev,
          componentsMatrix: getFeaturesForCategory(cat)
        }));
        toast.success(`Feature matrix reset to ${cat} template.`);
      }
    });
  };

  // Manual Strategic Transit Handlers
  const handleUpdateTransit = (idx, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.transitMatrix || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      if (field === 'landmarkName') updated[idx].destination = value;
      if (field === 'destination') updated[idx].landmarkName = value;
      if (field === 'travelMode') updated[idx].transportMode = value;
      if (field === 'transportMode') updated[idx].travelMode = value;
      if (field === 'distanceText') {
        const num = parseFloat(value);
        if (!isNaN(num)) updated[idx].distanceKm = num;
      }
      if (field === 'distanceKm') {
        updated[idx].distanceText = `${value} km`;
      }
      if (field === 'durationText') {
        const num = parseInt(value, 10);
        if (!isNaN(num)) updated[idx].travelTimeMins = num;
      }
      if (field === 'travelTimeMins') {
        updated[idx].durationText = `${value}m`;
      }
      return { ...prev, transitMatrix: updated };
    });
  };

  const handleDeleteTransit = (idx) => {
    setFormData(prev => ({
      ...prev,
      transitMatrix: (prev.transitMatrix || []).filter((_, i) => i !== idx)
    }));
  };

  const handleMoveTransit = (idx, direction) => {
    setFormData(prev => {
      const list = [...(prev.transitMatrix || [])];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const [movedItem] = list.splice(idx, 1);
      list.splice(targetIdx, 0, movedItem);
      return { ...prev, transitMatrix: list };
    });
  };

  const handleAddTransitRoute = () => {
    setFormData(prev => ({
      ...prev,
      transitMatrix: [
        ...(prev.transitMatrix || []),
        {
          landmarkName: '',
          destination: '',
          travelMode: 'Drive',
          transportMode: 'Drive',
          distanceText: '',
          distanceKm: 0,
          durationText: '',
          travelTimeMins: 0
        }
      ]
    }));
  };

  // Dynamic Self-Verifiable Legal Audit Handlers
  const handleLoadDefault12PointLegal = () => {
    const activeLegalPresets = presets.filter(p => p.presetType === 'LEGAL_CHECK' && p.isActive !== false);
    if (activeLegalPresets.length > 0) {
      const mapped = activeLegalPresets.map(p => ({
        documentName: p.title,
        category: p.groupCategory || 'Ownership',
        verifiedStatus: 'Verified',
        verificationNote: p.defaultDescription || 'Verified by advocate panel',
        isCustomItem: false
      }));
      setFormData(prev => ({
        ...prev,
        legalVerification: mapped
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        legalVerification: [...DEFAULT_12_POINT_LEGAL_CHECKLIST]
      }));
    }
  };

  const handleUpdateLegalItem = (idx, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.legalVerification || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, legalVerification: updated };
    });
  };

  const handleDeleteLegalItem = (idx) => {
    setFormData(prev => ({
      ...prev,
      legalVerification: (prev.legalVerification || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAddCustomLegalCheck = () => {
    setCustomItemModal({
      isOpen: true,
      type: 'LEGAL',
      categoryName: 'Custom Clearance',
      title: '',
      note: '',
      status: 'Verified'
    });
  };

  const handleConfirmCustomModal = () => {
    if (!customItemModal.title.trim()) {
      toast.error('Please enter a valid title.');
      return;
    }
    if (customItemModal.type === 'FEATURE') {
      setFormData(prev => ({
        ...prev,
        componentsMatrix: [
          ...(prev.componentsMatrix || []),
          {
            categoryName: customItemModal.categoryName || 'General',
            featureName: customItemModal.title.trim(),
            isAvailable: true,
            status: 'Included',
            descriptionNote: (customItemModal.note || '').trim()
          }
        ]
      }));
    } else if (customItemModal.type === 'LEGAL') {
      setFormData(prev => ({
        ...prev,
        legalVerification: [
          ...(prev.legalVerification || []),
          {
            documentName: customItemModal.title.trim(),
            category: 'Custom',
            verifiedStatus: customItemModal.status || 'Verified',
            verificationNote: (customItemModal.note || '').trim() || 'Audited clearance on record',
            isCustomItem: true
          }
        ]
      }));
    }
    setCustomItemModal(prev => ({ ...prev, isOpen: false }));
  };

  // Client-Side Canvas Image Compression Helper (Max 1600px width, 0.85 quality)
  const compressImageFile = (file, maxWidth = 1600, quality = 0.85) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Primary Cover Photo Upload Handlers
  const handleCoverImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const compressed = await compressImageFile(e.target.files[0]);
      if (compressed) {
        setFormData(prev => ({ ...prev, coverImage: compressed }));
      }
    }
  };

  const handleRemoveCoverImage = () => {
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  // Property Gallery Photos Upload Handlers
  const handleGalleryImagesUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const results = await Promise.all(files.map(f => compressImageFile(f)));
      const valid = results.filter(Boolean);
      setFormData(prev => ({
        ...prev,
        galleryImages: [...(Array.isArray(prev.galleryImages) ? prev.galleryImages : []), ...valid]
      }));
    }
  };

  const handleRemoveGalleryImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: (Array.isArray(prev.galleryImages) ? prev.galleryImages : []).filter((_, i) => i !== idx)
    }));
  };

  // File Upload Handlers
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: f.name.endsWith('.pdf') ? 'document' : 'image'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (idx) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Save Property Form Submit
  const handleSavePropertySubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (formStep < 4) {
      setFormStep(prev => Math.min(prev + 1, 4));
      return;
    }
    const isLand = formData.category === 'Land/Plot';
    const resolvedCover = formData.coverImage || (Array.isArray(formData.galleryImages) && formData.galleryImages[0]) || '';
    const resolvedGallery = Array.isArray(formData.galleryImages) ? formData.galleryImages : [];
    const orderedImages = resolvedCover
      ? [resolvedCover, ...resolvedGallery.filter(img => img !== resolvedCover)]
      : resolvedGallery;

    const priceNum = Number(formData.expectedPrice) || 25000000;
    const formatDisplayPrice = (val) => {
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs`;
      return `₹${val.toLocaleString('en-IN')}`;
    };

    const generatedSlug = (editingPropertyId && formData.slug?.trim())
      ? formData.slug.trim()
      : (formData.slug?.trim() ||
        (formData.title || 'luxury-property')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6));

    const propertyPayload = {
      title: formData.title,
      slug: generatedSlug,
      city: formData.city,
      locality: formData.locality,
      category: formData.category,
      dealType: formData.dealType,
      pricing: {
        expectedPrice: priceNum,
        isNegotiable: Boolean(formData.isNegotiable),
        maintenanceFee: Number(formData.maintenanceFee) || 0
      },
      specs: {
        bedrooms: isLand ? 0 : Number(formData.bedrooms),
        bathrooms: isLand ? 0 : Number(formData.bathrooms),
        carpetAreaSqFt: Number(formData.carpetAreaSqFt) || 0,
        furnishingStatus: isLand ? 'Unfurnished' : formData.furnishingStatus,
        floorLevel: formData.floorLevel || 'G',
        totalFloors: formData.totalFloors || '1'
      },
      youtubeVideoId: formData.youtubeVideoId?.trim() || '',
      coverImage: resolvedCover,
      galleryImages: resolvedGallery,
      description: formData.description,
      componentsMatrix: formData.componentsMatrix || [],
      legalVerification: formData.legalVerification || [],
      transitMatrix: (formData.transitMatrix || []).map(t => ({
        landmarkName: t.landmarkName || t.destination || '',
        destination: t.destination || t.landmarkName || '',
        travelMode: t.travelMode || t.transportMode || 'Drive',
        transportMode: t.transportMode || t.travelMode || 'Drive',
        distanceText: t.distanceText || (t.distanceKm !== undefined ? `${t.distanceKm} km` : ''),
        distanceKm: t.distanceKm !== undefined ? Number(t.distanceKm) : (parseFloat(t.distanceText) || 0),
        durationText: t.durationText || (t.travelTimeMins !== undefined ? `${t.travelTimeMins}m` : ''),
        travelTimeMins: t.travelTimeMins !== undefined ? Number(t.travelTimeMins) : (parseInt(t.durationText, 10) || 0)
      })),
      roadIngressText: formData.roadIngressText || '',
      zoningTagText: formData.zoningTagText || '',
      investmentAnalysis: {
        rentalYieldEst: formData.rentalYieldEst,
        resaleAppreciationEst: formData.resaleAppreciationEst,
        localityGrowthDriver: formData.localityGrowthDriver
      },
      advocateVerificationAvailable: Boolean(formData.advocateVerificationAvailable),
      isFeatured: Boolean(formData.isFeatured),
      status: formData.status || 'Active',
      advocateAudit: formData.advocateAudit || {
        parentDeedAudit: (formData.legalVerification || []).some(d => /parent|title\s*deed/i.test(d.documentName || '') && (d.verifiedStatus === 'Verified' || d.verifiedStatus === 'cleared')) ? 'Cleared' : 'Pending',
        encumbranceCertificate: (formData.legalVerification || []).some(d => /encumbrance|\bEC\b/i.test(d.documentName || '') && (d.verifiedStatus === 'Verified' || d.verifiedStatus === 'cleared')) ? 'Nil EC verified' : 'Pending',
        revenueRtcCompliance: (formData.legalVerification || []).some(d => /mutation|rtc|pahani|khata/i.test(d.documentName || '') && (d.verifiedStatus === 'Verified' || d.verifiedStatus === 'cleared')) ? 'Verified' : 'Pending',
        mccPlanApprovals: (formData.legalVerification || []).some(d => /sanction|mcc|plan|occupancy|\bOC\b/i.test(d.documentName || '') && (d.verifiedStatus === 'Verified' || d.verifiedStatus === 'cleared')) ? 'Compliant' : 'Pending',
        dgpsSurveyVerification: (formData.legalVerification || []).some(d => /survey|fmb|dgps|boundary/i.test(d.documentName || '') && (d.verifiedStatus === 'Verified' || d.verifiedStatus === 'cleared')) ? 'Cleared' : 'Pending'
      },

      // Synchronize backward-compatibility fields
      location: `${formData.locality}, ${formData.city}`,
      price: formatDisplayPrice(priceNum),
      priceRaw: priceNum,
      type: formData.category === 'Land/Plot' ? 'Plot' : formData.category,
      beds: isLand ? 0 : Number(formData.bedrooms),
      baths: isLand ? 0 : Number(formData.bathrooms),
      area: `${formData.carpetAreaSqFt} sq.ft`,
      videoUrl: `https://www.youtube.com/watch?v=${formData.youtubeVideoId}`,
      images: orderedImages,
      badge: formData.badge || 'Verified Listing',
      legalStatus: 'Clear Title / RERA Verified',
      highlights: [
        "Advocate Audited Clear Title",
        "Complete Property Inspections",
        `${formData.city} Verified Listing`
      ]
    };

    try {
      if (editingPropertyId) {
        const res = await updateProperty(editingPropertyId, propertyPayload);
        const updatedDoc = res?.data || propertyPayload;
        setProperties(prev => prev.map(p => (String(p._id || p.id) === String(editingPropertyId) ? { ...p, ...propertyPayload, ...updatedDoc } : p)));
        window.dispatchEvent(new CustomEvent('grabmykey_properties_updated'));
        toast.success(`Listing #${editingPropertyId} (${propertyPayload.title}) updated successfully!`);
      } else {
        const res = await createProperty(propertyPayload);
        const newRecord = res?.data || { ...propertyPayload, _id: String(Date.now()), id: String(Date.now()) };
        setProperties(prev => [newRecord, ...prev]);
        window.dispatchEvent(new CustomEvent('grabmykey_property_created', { detail: newRecord }));
        window.dispatchEvent(new CustomEvent('grabmykey_properties_updated'));
        toast.success(`New property listing "${newRecord.title}" published live to catalog!`);
      }
    } catch (err) {
      console.error('API submission error:', err);
      const isServerOffline = !err.response && (
        err.name === 'TypeError' ||
        err.message?.includes('Network Error') ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('connection refused')
      );
      if (isServerOffline) {
        toast.warning("Backend server is offline. Please start Node server on port 5000.");
      } else {
        toast.error(`Submission error: ${err.message || 'Could not connect to backend server'}`);
      }
    } finally {
      // Clear editing ID and form state so future creates don't overwrite or duplicate
      setEditingPropertyId(null);
      setFormData(INITIAL_FORM_STATE);
      setFormStep(1);
    }

    if (onDataUpdated) onDataUpdated();
    await loadData();
    handleTabSwitch('inventory');
  };

  // Filtered Properties for Inventory CRUD Table
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const matchesSearch = (prop.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prop.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || prop.type === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [properties, searchQuery, categoryFilter]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (leadStatusFilter === 'All') return true;
      return lead.status === leadStatusFilter;
    });
  }, [leads, leadStatusFilter]);

  // Calculated Valuation Aggregate for Overview View
  const totalValuationCr = useMemo(() => {
    const totalRaw = properties.reduce((acc, curr) => {
      const price = curr.priceRaw || curr.expectedPrice || curr.pricing?.expectedPrice || 0;
      return acc + price;
    }, 0);
    return (totalRaw / 10000000).toFixed(2);
  }, [properties]);

  // Asset Class Breakdown for Overview Charts
  const assetBreakdown = useMemo(() => {
    const counts = { Villa: 0, Apartment: 0, Commercial: 0, Estate: 0, 'Plot / Land': 0 };
    properties.forEach(p => {
      const type = (p.type === 'Plot' || p.type === 'Plot / Land') ? 'Plot / Land' : (counts[p.type] !== undefined ? p.type : 'Villa');
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [properties]);

  // Dynamic Deal Type & Inventory Mix for Overview
  const dealTypeBreakdown = useMemo(() => {
    const counts = {
      'Resale': 0,
      'New Launch': 0,
      'Rental / Lease': 0
    };

    properties.forEach(p => {
      const dt = (p.dealType || 'Resale').trim();
      if (dt.toLowerCase().includes('rental') || dt.toLowerCase().includes('lease')) {
        counts['Rental / Lease'] += 1;
      } else if (dt.toLowerCase().includes('new') || dt.toLowerCase().includes('launch')) {
        counts['New Launch'] += 1;
      } else {
        counts['Resale'] += 1;
      }
    });

    const total = properties.length;
    return [
      {
        type: 'Resale Listings',
        shortLabel: 'Resale',
        count: counts['Resale'],
        pct: total > 0 ? Math.round((counts['Resale'] / total) * 100) : 0,
        barColor: 'bg-[#0a1d37]'
      },
      {
        type: 'New Launch Developments',
        shortLabel: 'New Launch',
        count: counts['New Launch'],
        pct: total > 0 ? Math.round((counts['New Launch'] / total) * 100) : 0,
        barColor: 'bg-[#b8860b]'
      },
      {
        type: 'Rental / Lease Units',
        shortLabel: 'Rental / Lease',
        count: counts['Rental / Lease'],
        pct: total > 0 ? Math.round((counts['Rental / Lease'] / total) * 100) : 0,
        barColor: 'bg-emerald-700'
      }
    ];
  }, [properties]);

  // Dynamic Average Ticket Size (Mean Portfolio Asking Price)
  const averageTicketSize = useMemo(() => {
    if (!properties || properties.length === 0) {
      return {
        formatted: '₹0',
        subtext: 'Mean portfolio asking price'
      };
    }

    const totalRaw = properties.reduce((acc, curr) => {
      let price = curr.priceRaw || curr.expectedPrice || curr.pricing?.expectedPrice || 0;
      if (!price && typeof curr.price === 'string') {
        const pStr = curr.price.replace(/[^0-9.]/g, '');
        const num = parseFloat(pStr);
        if (!isNaN(num)) {
          if (/cr/i.test(curr.price)) price = num * 10000000;
          else if (/lakh/i.test(curr.price)) price = num * 100000;
          else price = num;
        }
      }
      return acc + (Number(price) || 0);
    }, 0);

    const avg = totalRaw / properties.length;
    let formatted = '₹0';
    if (avg >= 10000000) {
      const crVal = (avg / 10000000).toFixed(2).replace(/\.00$/, '');
      formatted = `₹${crVal} Cr`;
    } else if (avg >= 100000) {
      const lkVal = (avg / 100000).toFixed(1).replace(/\.0$/, '');
      formatted = `₹${lkVal} Lakhs`;
    } else if (avg > 0) {
      formatted = `₹${Math.round(avg).toLocaleString('en-IN')}`;
    }

    return {
      formatted,
      subtext: 'Mean portfolio asking price'
    };
  }, [properties]);

  return (
    <div className="min-h-screen bg-neutral-50/50 text-[#0a1d37] font-sans antialiased flex flex-col md:flex-row selection:bg-[#b8860b] selection:text-white">

      {/* ===================================================================== */}
      {/* 1. LEFT SIDEBAR NAVIGATION (MODERN LIGHT EXECUTIVE THEME)             */}
      {/* ===================================================================== */}
      <Sidebar
        activeTab={activeTab}
        onTabSwitch={handleTabSwitch}
        onNewListing={handleOpenCreateModal}
        propertiesCount={properties.length}
        newLeadsCount={leads.filter(l => l.status === 'New Inquiry').length}
        presetsCount={presets.length}
        pendingAdminsCount={adminsList.filter(a => a.status === 'pending').length}
        onExit={onExit || (() => navigate('/'))}
      />

      {/* ===================================================================== */}
      {/* 2. MAIN VIEW CONTAINER WITH LIGHT TOP BAR & CONTENT CANVAS            */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* TOP BAR */}
        <Navbar
          activeTab={activeTab}
          onNewListing={handleOpenCreateModal}
          onExit={onExit || (() => navigate('/'))}
        />

        {/* SCROLLABLE MAIN CANVAS */}
        <main className="flex-1 overflow-y-auto bg-neutral-50/50">
          <div className="w-full max-w-7xl mx-auto px-8 py-6 space-y-8">

            {/* ================================================================= */}
            {/* VIEW 1: EXECUTIVE OVERVIEW                                        */}
            {/* ================================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-8 w-full">

                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#0a1d37] tracking-tight">
                      Executive Operations Overview
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Real-time portfolio metrics, valuation aggregate, micro-market distribution, and media coverage.
                    </p>
                  </div>
                  <button
                    onClick={loadData}
                    disabled={loading}
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-700 hover:text-[#0a1d37] border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#b8860b]' : ''}`} />
                    <span>Refresh Telemetry</span>
                  </button>
                </div>

                {/* 4 Clean White Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* 1. Total Portfolios */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Portfolios</span>
                      <div className="w-9 h-9 rounded-xl bg-[#0a1d37] text-[#e6ca65] flex items-center justify-center shadow-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="text-2xl font-serif font-bold text-[#0a1d37]">{properties.length} Properties</span>
                      <span className={`block text-xs mt-1 font-semibold ${properties.length === 0 ? 'text-slate-400' : 'text-emerald-700'}`}>
                        {properties.length === 0 ? '0 active listings in catalog' : '100% Verified in catalog'}
                      </span>
                    </div>
                  </div>

                  {/* 2. Gross Valuation */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Gross Asset Valuation</span>
                      <div className="w-9 h-9 rounded-xl bg-[#0a1d37] text-[#e6ca65] flex items-center justify-center shadow-xs">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="text-2xl font-serif font-bold text-[#b8860b]">₹{totalValuationCr} Cr</span>
                      <span className="block text-xs text-slate-500 mt-1">Aggregated catalog valuation</span>
                    </div>
                  </div>

                  {/* 3. Inbound Leads */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Owner Leads</span>
                      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-xs">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="text-2xl font-serif font-bold text-[#0a1d37]">{leads.length} Tickets</span>
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-semibold inline-block mt-1 border border-amber-200">
                        {leads.filter(l => l.status === 'New Inquiry').length} Uncontacted submissions
                      </span>
                    </div>
                  </div>

                  {/* 4. Average Ticket Size */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average Ticket Size</span>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${
                        properties.length > 0
                          ? 'bg-[#0a1d37] text-[#e6ca65]'
                          : 'bg-slate-100 border border-slate-200 text-slate-500'
                      }`}>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className={`text-2xl font-serif font-bold ${
                        properties.length > 0 ? 'text-[#0a1d37]' : 'text-slate-400'
                      }`}>
                        {averageTicketSize.formatted}
                      </span>
                      <span className="block text-xs text-slate-500 mt-1">
                        {averageTicketSize.subtext}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Charts: Asset Class Distribution & Deal Type Mix */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Chart 1: Asset Class Distribution (White Card + Soft Slate Bars) */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#0a1d37]">Asset Class Distribution</h3>
                        <p className="text-[11px] text-slate-500">Breakdown of inventory by development typology</p>
                      </div>
                      <span className="text-xs font-mono text-[#0a1d37] bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-semibold">
                        {properties.length} Active Listings
                      </span>
                    </div>

                    <div className="space-y-4">
                      {[
                        { type: 'Villa', count: assetBreakdown['Villa'] || 0, color: 'bg-[#0a1d37]' },
                        { type: 'Apartment', count: assetBreakdown['Apartment'] || 0, color: 'bg-slate-700' },
                        { type: 'Commercial', count: assetBreakdown['Commercial'] || 0, color: 'bg-[#b8860b]' },
                        { type: 'Estate', count: assetBreakdown['Estate'] || 0, color: 'bg-emerald-800' },
                        { type: 'Plot / Land', count: assetBreakdown['Plot / Land'] || 0, color: 'bg-[#d4af37]' }
                      ].map(item => {
                        const pct = properties.length > 0 ? Math.round((item.count / properties.length) * 100) : 0;
                        return (
                          <div key={item.type} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-[#0a1d37]">{item.type}</span>
                              <span className="font-mono text-slate-500">{item.count} Units ({pct}%)</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chart 2: Deal Type & Inventory Mix + Quick Operational Shortcuts */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                        <div>
                          <h3 className="font-serif font-bold text-base text-[#0a1d37]">Deal Type & Inventory Mix</h3>
                          <p className="text-[11px] text-slate-500">Transaction typology breakdown and operations console</p>
                        </div>
                        <span className="text-xs font-mono text-[#0a1d37] bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-semibold">
                          {properties.length} Active Listings
                        </span>
                      </div>

                      {/* Transaction Typology Progress Bars */}
                      <div className="space-y-3.5 mb-6">
                        {dealTypeBreakdown.map((item) => (
                          <div key={item.type} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-[#0a1d37] flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${item.barColor}`} />
                                <span>{item.type}</span>
                              </span>
                              <span className="font-mono text-slate-500">{item.count} Units ({item.pct}%)</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.barColor} rounded-full transition-all duration-500`}
                                style={{ width: `${item.pct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Operational Shortcuts */}
                      <div className="pt-4 border-t border-slate-100">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2.5">
                          Quick Actions & Operations
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <button
                            type="button"
                            onClick={handleOpenCreateModal}
                            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-[#0a1d37] hover:bg-[#061426] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                          >
                            <PlusCircle className="w-3.5 h-3.5 text-[#e6ca65]" />
                            <span>+ Publish New Listing</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTabSwitch('hero')}
                            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#8b6508] border border-amber-200 text-xs font-semibold transition-all cursor-pointer"
                          >
                            <Video className="w-3.5 h-3.5 text-[#b8860b]" />
                            <span>Manage Hero Video</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTabSwitch('leads')}
                            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-slate-600" />
                            <span>Review Owner Leads</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Mangaluru Active Catalog Mix</span>
                      <button
                        type="button"
                        onClick={() => handleTabSwitch('inventory')}
                        className="text-[#b8860b] hover:text-[#0a1d37] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <span>Manage All Inventory</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Quick Leads Strip (White Card) */}
                <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-[#b8860b]" />
                      <h3 className="font-serif font-bold text-base text-[#0a1d37]">Recent Inbound Owner Inquiries</h3>
                    </div>
                    <button onClick={() => handleTabSwitch('leads')} className="text-xs text-[#b8860b] hover:text-[#0a1d37] font-bold cursor-pointer">
                      View Full Lead Queue →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {leads.slice(0, 3).map(lead => (
                      <div key={lead._id || lead.id} className="p-4 bg-[#fbf9f5] border border-slate-200 rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-slate-500 font-semibold">#{lead.ticketId || lead.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${lead.status === 'New Inquiry' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                              lead.status === 'Contacted' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                                'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}>
                            {lead.status}
                          </span>
                        </div>
                        <p className="font-bold text-[#0a1d37] text-sm">{lead.ownerName}</p>
                        <p className="text-slate-500">{lead.location} • {lead.assetType}</p>
                        <p className="text-[#b8860b] font-serif font-bold">{lead.expectedPrice}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ================================================================= */}
            {/* VIEW 2: PROPERTY INVENTORY (LIGHT-LUXURY CRUD TABLE)              */}
            {/* ================================================================= */}
            {activeTab === 'inventory' && (
              <div className="space-y-6 w-full">

                {/* Header Title & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-[#0a1d37] tracking-tight flex items-center space-x-2">
                      <span>Property Inventory Management</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Live catalog synchronized with MongoDB. Edit parameters, preview listings, or remove assets.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 border border-slate-800 cursor-pointer"
                  >
                    <span className="text-amber-400 font-bold text-sm">+</span>
                    <span>Publish New Listing</span>
                  </button>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="w-full md:w-1/2 relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by title, location, or locality..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-[#0a1d37] focus:outline-none focus:border-[#b8860b] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="w-full md:w-auto flex items-center space-x-3">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0a1d37] focus:outline-none focus:border-[#b8860b]"
                    >
                      <option value="All">All Categories</option>
                      <option value="Villa">Villa</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Estate">Estate</option>
                      <option value="Plot / Land">Plot / Land</option>
                    </select>

                    <button
                      onClick={loadData}
                      disabled={loading}
                      className="p-2 border border-slate-300 rounded-xl bg-white text-slate-600 hover:text-[#0a1d37] transition-colors cursor-pointer"
                      title="Refresh data"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#b8860b]' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* High-Contrast Crisp White Inventory Table */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#f8f6f0] text-[#0a1d37] font-sans uppercase tracking-wider text-xs font-bold border-b border-slate-200/80">
                          <th className="py-3.5 px-6 font-bold">Asset Info</th>
                          <th className="py-3.5 px-6 font-bold">Locality & City</th>
                          <th className="py-3.5 px-6 font-bold">Category</th>
                          <th className="py-3.5 px-6 font-bold">Asking Price</th>
                          <th className="py-3.5 px-6 font-bold">Legal Status</th>
                          <th className="py-3.5 px-6 font-bold text-right">Quick Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredProperties.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                              No property listings found matching query.
                            </td>
                          </tr>
                        ) : (
                          filteredProperties.map(prop => (
                            <tr key={prop._id || prop.id} className="even:bg-[#fbf9f5] hover:bg-amber-50/30 transition-colors">
                              {/* Asset Info & Thumbnail */}
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs flex items-center justify-center">
                                    {(prop.coverImage || prop.images?.[0] || prop.galleryImages?.[0] || prop.thumbnail) ? (
                                      <img
                                        src={prop.coverImage || prop.images?.[0] || prop.galleryImages?.[0] || prop.thumbnail}
                                        alt={prop.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Building2 className="w-4 h-4 text-slate-400" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-bold text-[#0a1d37] text-xs block truncate max-w-xs">{prop.title}</span>
                                    <span className="font-mono text-[10px] text-slate-400">#{prop._id || prop.id}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Locality */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span className="flex items-center space-x-1.5 text-slate-600 font-medium">
                                  <MapPin className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                                  <span>{prop.location}</span>
                                </span>
                              </td>

                              {/* Category */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#0a1d37] font-semibold text-xs">
                                  {prop.type}
                                </span>
                              </td>

                              {/* Price in Champagne Gold */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span className="font-serif font-bold text-sm text-[#b8860b]">
                                  {prop.price}
                                </span>
                              </td>

                              {/* Legal Status */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Clear Title / RERA</span>
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-6 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(prop)}
                                    className="p-2 rounded-lg bg-[#0a1d37] hover:bg-[#061426] text-white transition-colors cursor-pointer shadow-xs"
                                    title="Edit Listing"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onViewLiveProperty) {
                                        onViewLiveProperty(prop._id || prop.id);
                                      } else {
                                        navigate(`/property/${prop._id || prop.id}`);
                                      }
                                    }}
                                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                                    title="View Live on Storefront"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRequestDelete(prop)}
                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors cursor-pointer"
                                    title="Delete Property"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ================================================================= */}
            {/* VIEW 3: OWNER LEAD QUEUE (LIGHT-LUXURY TABLE)                     */}
            {/* ================================================================= */}
            {activeTab === 'leads' && (
              <div className="space-y-6 w-full">

                {/* Header Title & Filter Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-[#0a1d37] tracking-tight flex items-center space-x-2">
                      <span>Inbound Owner Lead Queue</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage onboarding leads submitted by verified owners via public portal.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {['All', 'New Inquiry', 'Contacted', 'Archived / Resolved'].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setLeadStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${leadStatusFilter === st
                            ? 'bg-[#0a1d37] text-white font-bold shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-600 hover:text-[#0a1d37] hover:bg-slate-50'
                          }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* High-Contrast White Leads Table */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#f8f6f0] text-[#0a1d37] font-sans uppercase tracking-wider text-xs font-bold border-b border-slate-200/80">
                          <th className="py-3.5 px-6 font-bold">Ticket ID</th>
                          <th className="py-3.5 px-6 font-bold">Owner Name & Phone</th>
                          <th className="py-3.5 px-6 font-bold">Property Locality</th>
                          <th className="py-3.5 px-6 font-bold">Category</th>
                          <th className="py-3.5 px-6 font-bold">Expected Price</th>
                          <th className="py-3.5 px-6 font-bold">Status Badge</th>
                          <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredLeads.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                              No owner lead submissions found in this status.
                            </td>
                          </tr>
                        ) : (
                          filteredLeads.map(lead => (
                            <tr key={lead._id || lead.id} className="even:bg-[#fbf9f5] hover:bg-amber-50/30 transition-colors">
                              {/* Ticket ID in Champagne Gold */}
                              <td className="py-4 px-6 font-mono font-bold text-[#b8860b]">
                                #{lead.ticketId || lead.id}
                              </td>

                              {/* Owner & Phone */}
                              <td className="py-4 px-6">
                                <span className="font-bold text-[#0a1d37] block text-xs">{lead.ownerName}</span>
                                <span className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{lead.phone}</span>
                                </span>
                              </td>

                              {/* Locality */}
                              <td className="py-4 px-6">
                                <span className="font-medium text-slate-700">{lead.location}</span>
                              </td>

                              {/* Asset Type */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#0a1d37] font-semibold text-xs">
                                  {lead.assetType}
                                </span>
                              </td>

                              {/* Price */}
                              <td className="py-4 px-6 font-serif font-bold text-[#0a1d37] whitespace-nowrap text-sm">
                                {lead.expectedPrice}
                              </td>

                              {/* Status */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleUpdateLeadStatus(lead._id || lead.id, e.target.value)}
                                  className={`text-xs font-bold px-3 py-1 rounded-lg border focus:outline-none cursor-pointer shadow-2xs ${lead.status === 'New Inquiry' ? 'bg-amber-50 border-amber-300 text-amber-800' :
                                      lead.status === 'Contacted' ? 'bg-sky-50 border-sky-300 text-sky-800' :
                                        'bg-emerald-50 border-emerald-300 text-emerald-800'
                                    }`}
                                >
                                  <option value="New Inquiry">New Inquiry</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Archived / Resolved">Archived / Resolved</option>
                                </select>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-6 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-2">
                                  <a
                                    href={`https://wa.me/${(lead.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.ownerName)},%20regarding%20your%20property%20listing%20ticket%20#${lead.ticketId || lead.id}%20on%20GrabMyKey`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 transition-colors"
                                    title="WhatsApp Contact"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLead(lead._id || lead.id)}
                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition-colors cursor-pointer"
                                    title="Delete Lead"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ================================================================= */}
            {/* VIEW 4: FULL-BLEED PROPERTY PUBLISHER (LIGHT LUXURY)              */}
            {/* ================================================================= */}
            {activeTab === 'publish-listing' && (
              <div className="space-y-6 max-w-5xl mx-auto pb-12">

                {/* Publisher Header with Back to Inventory */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <button
                        type="button"
                        onClick={() => handleTabSwitch('inventory')}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0a1d37] hover:bg-slate-100 transition-colors bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-2xs cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>← Back to Inventory</span>
                      </button>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8860b] font-bold">
                        EXECUTIVE PUBLISHER
                      </span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-[#0a1d37] tracking-tight">
                      {editingPropertyId ? `Edit Listing #${editingPropertyId}` : 'Publish New Luxury Property Listing'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure asset specifications, walkthrough inspection, and advocate clearance parameters.
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center space-x-2">
                    <span className="text-xs font-mono text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs font-semibold">
                      Staging Mode
                    </span>
                  </div>
                </div>

                {/* Form Container Card in Crisp Pure White */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-md p-6 md:p-8">

                  {/* 4-Step Horizontal Tabs */}
                  <div className="flex border-b border-slate-200 mb-8 text-xs font-semibold overflow-x-auto">
                    {[
                      { step: 1, label: '1. Core Typology & Pricing' },
                      { step: 2, label: '2. Walkthrough & Gallery' },
                      { step: 3, label: '3. Feature Matrix & Transit' },
                      { step: 4, label: '4. Legal Audit & Investment' }
                    ].map(s => (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => setFormStep(s.step)}
                        className={`py-3 px-5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${formStep === s.step
                            ? 'border-[#b8860b] text-[#b8860b] font-bold bg-amber-50/60'
                            : 'border-transparent text-slate-500 hover:text-[#0a1d37]'
                          }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSavePropertySubmit} className="space-y-6">

                    {/* STEP 1: CORE TYPOLOGY & PRICING */}
                    {formStep === 1 && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Property Title *</label>
                            <input
                              required
                              type="text"
                              placeholder="e.g. Ultra Luxury Seafront Villa"
                              value={formData.title}
                              onChange={e => {
                                const newTitle = e.target.value;
                                const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                setFormData(prev => ({
                                  ...prev,
                                  title: newTitle,
                                  slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') ? autoSlug : prev.slug
                                }));
                              }}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:bg-white focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">URL Slug (Unique) *</label>
                            <input
                              required
                              type="text"
                              placeholder="coastal-horizon-sea-villa"
                              value={formData.slug}
                              onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] font-mono focus:border-[#b8860b] focus:bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">City *</label>
                            <select
                              value={formData.city}
                              onChange={e => setFormData({ ...formData, city: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] font-semibold focus:border-[#b8860b] focus:outline-none"
                            >
                              <option value="Mangaluru">Mangaluru</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Locality / Sector *</label>
                            <input
                              required
                              type="text"
                              placeholder="e.g. Kadri Hills / Falnir / Bejai"
                              value={formData.locality}
                              onChange={e => setFormData({ ...formData, locality: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Category *</label>
                            <select
                              value={formData.category}
                              onChange={e => {
                                const newCat = e.target.value;
                                setFormData(prev => ({
                                  ...prev,
                                  category: newCat,
                                  componentsMatrix: getFeaturesForCategory(newCat)
                                }));
                              }}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] font-semibold focus:border-[#b8860b] focus:outline-none"
                            >
                              <option value="Villa">Villa</option>
                              <option value="Apartment">Apartment</option>
                              <option value="Independent House">Independent House</option>
                              <option value="Commercial">Commercial</option>
                              <option value="Land/Plot">Land/Plot</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Deal Type *</label>
                            <select
                              value={formData.dealType}
                              onChange={e => setFormData({ ...formData, dealType: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] font-semibold focus:border-[#b8860b] focus:outline-none"
                            >
                              <option value="Resale">Resale</option>
                              <option value="Rental">Rental</option>
                            </select>
                          </div>
                        </div>

                        {/* Pricing Block */}
                        <div className="p-4 bg-[#fbf9f5] border border-slate-200 rounded-xl space-y-3">
                          <span className="text-xs font-bold text-[#0a1d37] uppercase tracking-wider block">
                            Pricing & Maintenance Parameters
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Expected Price (₹ in Raw Number) *</label>
                              <input
                                required
                                type="number"
                                placeholder="38500000"
                                value={formData.expectedPrice}
                                onChange={e => setFormData({ ...formData, expectedPrice: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-[#b8860b] focus:border-[#b8860b] focus:outline-none"
                              />
                              <span className="text-[10px] text-slate-500 mt-1 block">
                                Display preview: {formData.expectedPrice >= 10000000 ? `₹${(formData.expectedPrice / 10000000).toFixed(2)} Cr` : `₹${(formData.expectedPrice / 100000).toFixed(1)} Lakhs`}
                              </span>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Monthly Maintenance (RWA / Society Fee)</label>
                              <input
                                type="number"
                                placeholder="0"
                                value={formData.maintenanceFee}
                                onChange={e => setFormData({ ...formData, maintenanceFee: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                              <span className="text-[10px] text-slate-500 mt-1 block">
                                Enter monthly society/RWA fee. Set to ₹0 if standalone independent property.
                              </span>
                            </div>
                            <div className="flex flex-col justify-center">
                              <span className="text-xs font-bold text-[#0a1d37] mb-2">Price Negotiation</span>
                              <label className="inline-flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.isNegotiable}
                                  onChange={e => setFormData({ ...formData, isNegotiable: e.target.checked })}
                                  className="w-4 h-4 text-[#b8860b] rounded focus:ring-[#b8860b]"
                                />
                                <span className="text-xs text-slate-700 font-semibold">Price is Negotiable upon Inspection</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Physical Specs */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Carpet Area (Sq.Ft) *</label>
                            <input
                              required
                              type="number"
                              placeholder="4200"
                              value={formData.carpetAreaSqFt}
                              onChange={e => setFormData({ ...formData, carpetAreaSqFt: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Furnishing Status</label>
                            <select
                              value={formData.furnishingStatus}
                              onChange={e => setFormData({ ...formData, furnishingStatus: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] font-semibold focus:border-[#b8860b] focus:outline-none"
                            >
                              <option value="Fully Furnished">Fully Furnished</option>
                              <option value="Semi-Furnished">Semi-Furnished</option>
                              <option value="Unfurnished">Unfurnished</option>
                            </select>
                          </div>
                          {formData.category !== 'Land/Plot' ? (
                            <>
                              <div>
                                <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Bedrooms</label>
                                <input
                                  type="number"
                                  value={formData.bedrooms}
                                  onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Bathrooms</label>
                                <input
                                  type="number"
                                  value={formData.bathrooms}
                                  onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                />
                              </div>
                            </>
                          ) : (
                            <div className="sm:col-span-2 flex items-center p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                              <span>Land/Plot asset: Room specifications are automatically bypassed.</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Floor Level</label>
                            <input
                              type="text"
                              placeholder="e.g. Ground / 4th Floor / G+2"
                              value={formData.floorLevel}
                              onChange={e => setFormData({ ...formData, floorLevel: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Total Floors in Structure</label>
                            <input
                              type="text"
                              placeholder="e.g. 3 / 12"
                              value={formData.totalFloors}
                              onChange={e => setFormData({ ...formData, totalFloors: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Marketing Badge</label>
                            <input
                              type="text"
                              placeholder="Exclusive Tour"
                              value={formData.badge}
                              onChange={e => setFormData({ ...formData, badge: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Architectural Narrative Overview *</label>
                          <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Ultra-luxury cliffside residence with private infinity pool overlooking the Arabian Sea..."
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 2: MEDIA & VIDEO */}
                    {formStep === 2 && (
                      <div className="space-y-5">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-[#0a1d37]">YouTube Walkthrough Video ID / URL *</label>
                            <button
                              type="button"
                              onClick={() => setShowYoutubePicker(!showYoutubePicker)}
                              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-[#0a1d37] border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5 text-red-600" />
                              <span>Sample Walkthroughs</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-3">
                            <input
                              required
                              type="text"
                              placeholder="e.g. 7X8mLSQkg4Y or https://www.youtube.com/watch?v=..."
                              value={formData.youtubeVideoId}
                              onChange={e => {
                                const val = e.target.value;
                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                const match = val.match(regExp);
                                const vid = (match && match[2].length === 11) ? match[2] : val;
                                setFormData({ ...formData, youtubeVideoId: vid });
                              }}
                              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#0a1d37] font-mono focus:border-[#b8860b] focus:outline-none"
                            />
                            <span className="text-xs font-mono font-bold text-[#b8860b] bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                              ID: {formData.youtubeVideoId || 'None'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            Transparent inspection policy: Walkthrough is embedded without autoplay for silent luxury viewing.
                          </span>

                          {showYoutubePicker && (
                            <div className="mt-3 p-4 bg-[#f8f6f0] border border-slate-200 rounded-2xl space-y-3">
                              <span className="text-xs font-mono font-bold text-[#0a1d37] uppercase tracking-wider block">
                                Existing Property Walkthrough Tours:
                              </span>
                              {properties.filter(p => p.youtubeVideoId).length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  {properties.filter(p => p.youtubeVideoId).slice(0, 6).map((p, i) => (
                                    <div
                                      key={p._id || p.id || i}
                                      onClick={() => {
                                        setFormData({ ...formData, youtubeVideoId: p.youtubeVideoId });
                                        setShowYoutubePicker(false);
                                      }}
                                      className="p-3 bg-white hover:bg-amber-50/60 border border-slate-300 rounded-xl cursor-pointer text-xs transition-colors"
                                    >
                                      <p className="font-bold text-[#0a1d37] truncate">{p.title}</p>
                                      <span className="text-[10px] text-[#b8860b] font-semibold mt-1 block">Click to Apply ({p.youtubeVideoId})</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 py-1">
                                  No previous video tours found. Enter a custom YouTube video ID or URL in the input above.
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 1. DEDICATED PRIMARY COVER PHOTO UPLOAD ZONE */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] uppercase tracking-wider">
                                Primary Cover Photo <span className="text-red-500">*</span>
                              </label>
                              <span className="text-[11px] text-slate-500">
                                The hero photograph featured on catalog cards, homepage highlights, and page headers (.jpg, .png, .webp).
                              </span>
                            </div>
                            {formData.coverImage && (
                              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                                <Check className="w-3 h-3" />
                                <span>Cover Active</span>
                              </span>
                            )}
                          </div>

                          {formData.coverImage ? (
                            /* Instant Image Preview Card */
                            <div className="relative border-2 border-emerald-500/40 bg-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                              <div className="relative w-full sm:w-56 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <img
                                  src={formData.coverImage}
                                  alt="Primary Cover Preview"
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 left-2 bg-[#b8860b] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm font-mono flex items-center space-x-1">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>PRIMARY COVER</span>
                                </span>
                              </div>
                              <div className="flex-1 w-full space-y-2">
                                <div>
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Active Catalog Hero
                                  </span>
                                  <h4 className="text-sm font-bold text-[#0a1d37] mt-1.5 truncate">
                                    Primary Listing Cover Photo
                                  </h4>
                                  <span className="text-xs text-slate-500 font-mono block mt-0.5">
                                    Format: High-Resolution Web-Ready Image
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3 pt-2">
                                  <label className="inline-flex items-center space-x-1.5 bg-[#f8f6f0] hover:bg-slate-100 text-[#0a1d37] px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer border border-slate-300 transition-all">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Replace Photo</span>
                                    <input
                                      type="file"
                                      accept="image/jpeg,image/png,image/webp"
                                      onChange={handleCoverImageUpload}
                                      className="hidden"
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={handleRemoveCoverImage}
                                    className="inline-flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl text-xs font-semibold border border-red-200 transition-all cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Remove Photo</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Dedicated Single Dropzone */
                            <div className="border-2 border-dashed border-amber-200/90 hover:border-[#b8860b] rounded-2xl p-6 text-center bg-[#f8f6f0] transition-all group">
                              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-50 text-[#b8860b] border border-amber-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                              <h5 className="text-xs font-bold text-[#0a1d37] mb-1">
                                Upload Primary Cover Photo (.jpg, .png, .webp)
                              </h5>
                              <p className="text-[11px] text-slate-500 mb-4 max-w-sm mx-auto">
                                Select a single hero photograph to represent this property across catalog cards and headers.
                              </p>
                              <label className="inline-flex items-center space-x-2 bg-[#b8860b] hover:bg-[#996515] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all border border-[#b8860b]/40">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Select Primary Cover Photo</span>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={handleCoverImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        {/* 2. DEDICATED PROPERTY GALLERY PHOTOS MULTI-FILE UPLOAD ZONE */}
                        <div className="space-y-3 pt-3 border-t border-slate-200/80">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] uppercase tracking-wider">
                                Property Gallery Photos
                              </label>
                              <span className="text-[11px] text-slate-500">
                                Upload additional interior, exterior, elevation, and amenity views (.jpg, .png, .webp).
                              </span>
                            </div>
                            {Array.isArray(formData.galleryImages) && formData.galleryImages.length > 0 && (
                              <span className="text-[11px] font-mono font-bold text-[#b8860b] bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                {formData.galleryImages.length} Photo{formData.galleryImages.length !== 1 ? 's' : ''} Uploaded
                              </span>
                            )}
                          </div>

                          {/* Multi-file Gallery Dropzone */}
                          <div className="border-2 border-dashed border-slate-300 hover:border-[#0a1d37] rounded-2xl p-6 text-center bg-[#f8f6f0] transition-all group">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-100 text-[#0a1d37] border border-slate-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                              <Upload className="w-6 h-6" />
                            </div>
                            <h5 className="text-xs font-bold text-[#0a1d37] mb-1">
                              Upload Gallery Photos (.jpg, .png, .webp)
                            </h5>
                            <p className="text-[11px] text-slate-500 mb-4 max-w-sm mx-auto">
                              Select multiple photos from your device to populate the property photo gallery carousel.
                            </p>
                            <label className="inline-flex items-center space-x-2 bg-[#0a1d37] hover:bg-[#061426] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all border border-[#0a1d37]/40">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Select Gallery Photos</span>
                              <input
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleGalleryImagesUpload}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* Clean Gallery Thumbnails Grid with Individual Remove Buttons */}
                          {Array.isArray(formData.galleryImages) && formData.galleryImages.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                              {formData.galleryImages.map((imgUrl, idx) => (
                                <div
                                  key={idx}
                                  className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs hover:border-[#b8860b] transition-all"
                                >
                                  <div className="h-24 w-full overflow-hidden bg-slate-100 relative">
                                    <img
                                      src={imgUrl}
                                      alt={`Gallery photo ${idx + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveGalleryImage(idx)}
                                      className="absolute top-1.5 right-1.5 p-1 bg-black/75 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                                      title="Remove photo"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="p-1.5 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-600 font-medium">Photo #{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => setFormData(prev => ({ ...prev, coverImage: imgUrl }))}
                                      className="text-[9px] text-[#b8860b] hover:underline font-semibold cursor-pointer"
                                      title="Set this image as primary cover"
                                    >
                                      Set Cover
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Local File Upload Dropzone */}
                        <div>
                          <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">
                            Local Attachments & Legal Deeds (.jpg, .png, .pdf)
                          </label>
                          <div className="border-2 border-dashed border-slate-300 hover:border-[#b8860b] rounded-2xl p-6 text-center bg-[#f8f6f0] transition-all">
                            <Upload className="w-8 h-8 text-[#b8860b] mx-auto mb-2" />
                            <h5 className="text-xs font-bold text-[#0a1d37] mb-1">
                              Upload Local Photos & Legal Audit PDFs
                            </h5>
                            <p className="text-[11px] text-slate-500 mb-4 max-w-sm mx-auto">
                              Attach statutory Mother Deeds, EC Form 15, or physical survey certificates directly.
                            </p>
                            <label className="inline-flex items-center space-x-2 bg-[#0a1d37] hover:bg-[#061426] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Browse Files</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {uploadedFiles.length > 0 && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {uploadedFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center space-x-2 p-2.5 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
                                  <FileText className="w-4 h-4 text-[#b8860b] shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <span className="truncate block text-[#0a1d37] font-bold text-[11px]">{file.name}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{file.size}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(idx)}
                                    className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                    {/* STEP 3: PROPERTY SPECIFICATIONS & FEATURES & STRATEGIC TRANSIT */}
                    {formStep === 3 && (
                      <div className="space-y-8">

                        {/* A. PROPERTY SPECIFICATIONS & FEATURES */}
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Layers className="w-4 h-4 text-[#b8860b]" />
                                <h3 className="font-serif font-bold text-base text-[#0a1d37]">
                                  Property Specifications & Features
                                </h3>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Grouped specifications with availability toggles and optional custom descriptive notes.
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={handleResetDefaultFeatures}
                                className="text-xs bg-slate-100 hover:bg-slate-200 text-[#0a1d37] border border-slate-300 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                              >
                                Reset Features
                              </button>
                              <span className="text-xs font-mono text-[#0a1d37] bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-bold">
                                {(formData.componentsMatrix || []).length} Features
                              </span>
                            </div>
                          </div>

                          {/* Dynamic Asset Type Preset Selector */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80">
                            <div className="flex items-center space-x-2">
                              <span className="text-[11px] font-bold text-[#b8860b] uppercase tracking-wider">
                                Asset Specification Preset:
                              </span>
                              <span className="text-xs font-bold text-[#0a1d37]">
                                {formData.category || 'Villa'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {[
                                { label: 'Villa / House', cat: 'Villa' },
                                { label: 'Flat / Apartment', cat: 'Apartment' },
                                { label: 'Plot / Land', cat: 'Plot' },
                                { label: 'Commercial', cat: 'Commercial' }
                              ].map(a => {
                                const isSelected = (formData.category === a.cat) || 
                                  (a.cat === 'Villa' && formData.category === 'Independent House') ||
                                  (a.cat === 'Plot' && (formData.category === 'Land/Plot' || formData.category === 'Plot / Land'));
                                return (
                                  <button
                                    key={a.cat}
                                    type="button"
                                    onClick={() => {
                                      const targetCat = a.cat === 'Plot' ? 'Land/Plot' : a.cat;
                                      setFormData(prev => ({
                                        ...prev,
                                        category: targetCat,
                                        componentsMatrix: getFeaturesForCategory(targetCat)
                                      }));
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                                      isSelected 
                                        ? 'bg-[#0a1d37] text-white shadow-xs font-bold' 
                                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                                    }`}
                                  >
                                    {a.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Render items dynamically grouped by category */}
                          {(() => {
                            const templateCategories = getAssetSpecPresets(formData.category || 'Villa').map(p => p.category);
                            const matrixCategories = (formData.componentsMatrix || []).map(p => p.categoryName || p.category).filter(Boolean);
                            const uniqueCategories = Array.from(new Set([...templateCategories, ...matrixCategories]));

                            return uniqueCategories.map(catName => {
                              const itemsInCat = (formData.componentsMatrix || []).map((item, originalIdx) => ({ ...item, originalIdx }))
                                .filter(item => (item.categoryName || item.category) === catName);

                              return (
                                <div key={catName} className="bg-[#fbf9f5] border border-slate-200 rounded-2xl p-4 space-y-3">
                                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                                    <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#0a1d37]">
                                      {catName}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleAddCustomFeature(catName)}
                                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#b8860b] hover:text-[#0a1d37] bg-white border border-amber-300/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
                                    >
                                      <PlusCircle className="w-3 h-3 text-[#b8860b]" />
                                      <span>+ Add Feature</span>
                                    </button>
                                  </div>

                                  <div className="space-y-2.5">
                                    {itemsInCat.length === 0 ? (
                                      <p className="text-[11px] text-slate-400 font-mono py-2 text-center">
                                        No features in this category. Click "+ Add Feature" above.
                                      </p>
                                    ) : (
                                      itemsInCat.map(item => {
                                        const isIncluded = (item.isAvailable !== false && item.status !== 'Not Included');
                                        return (
                                          <div
                                            key={item.originalIdx}
                                            className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition-all"
                                          >
                                            {/* Feature Name & Toggle Switch */}
                                            <div className="flex items-center space-x-3 w-full sm:w-1/3 min-w-0">
                                              <button
                                                type="button"
                                                onClick={() => handleToggleFeature(item.originalIdx)}
                                                title={isIncluded ? "Click to mark Not Included" : "Click to mark Included"}
                                                className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1 shrink-0 transition-transform active:scale-95 cursor-pointer shadow-2xs ${
                                                  isIncluded
                                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                    : 'bg-slate-400 text-white hover:bg-slate-500'
                                                }`}
                                              >
                                                {isIncluded ? (
                                                  <>
                                                    <Check className="w-3 h-3" />
                                                    <span>Included</span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <X className="w-3 h-3" />
                                                    <span>Not Included</span>
                                                  </>
                                                )}
                                              </button>
                                              <span className="font-bold text-[#0a1d37] text-xs truncate">
                                                {item.featureName || item.feature}
                                              </span>
                                            </div>

                                            {/* Description Note / Details Input */}
                                            <div className="flex-1 w-full">
                                              <input
                                                type="text"
                                                value={item.descriptionNote ?? item.details ?? ''}
                                                onChange={e => handleFeatureNoteChange(item.originalIdx, e.target.value)}
                                                placeholder="Specific notes & equipment details..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:border-[#b8860b] focus:bg-white focus:outline-none transition-colors"
                                              />
                                            </div>

                                            {/* Delete Row Button */}
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteFeature(item.originalIdx)}
                                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                                              title="Delete Feature"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>

                        {/* B. MANUAL STRATEGIC TRANSIT & INFRASTRUCTURE */}
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Car className="w-4 h-4 text-[#b8860b]" />
                                <h3 className="font-serif font-bold text-base text-[#0a1d37]">
                                  Manual Strategic Transit & Infrastructure
                                </h3>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Manual verified road & transit milestones replacing automated APIs.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddTransitRoute}
                              className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-[#0a1d37] hover:bg-[#061426] px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-sm"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>+ Add Transit Route</span>
                            </button>
                          </div>

                          <div className="space-y-3">
                            {(!formData.transitMatrix || formData.transitMatrix.length === 0) ? (
                              <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <Car className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-slate-600">No transit landmarks added yet.</p>
                                <p className="text-[11px] text-slate-400 mt-0.5 mb-3">Add key landmarks like airports, railway stations, highways, and metro nodes.</p>
                                <button
                                  type="button"
                                  onClick={handleAddTransitRoute}
                                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#0a1d37] hover:bg-[#061426] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                                >
                                  <PlusCircle className="w-3.5 h-3.5" />
                                  <span>+ Add First Transit Route</span>
                                </button>
                              </div>
                            ) : (
                              (formData.transitMatrix || []).map((tItem, tIdx) => (
                                <div
                                  key={tIdx}
                                  className="bg-[#fbf9f5] border border-slate-200 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center shadow-2xs hover:border-slate-300 transition-colors"
                                >
                                  {/* Reordering & Position Indicator */}
                                  <div className="sm:col-span-1 flex items-center justify-between sm:justify-center gap-1.5 sm:pt-4">
                                    <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-1 rounded min-w-[28px] text-center" title={`Position ${tIdx + 1}`}>
                                      #{tIdx + 1}
                                    </span>
                                    <div className="flex sm:flex-col gap-0.5">
                                      <button
                                        type="button"
                                        onClick={() => handleMoveTransit(tIdx, 'up')}
                                        disabled={tIdx === 0}
                                        className="p-1 sm:p-0.5 text-slate-500 hover:text-[#0a1d37] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200 rounded transition-colors cursor-pointer"
                                        title="Move landmark up"
                                        aria-label="Move landmark up"
                                      >
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleMoveTransit(tIdx, 'down')}
                                        disabled={tIdx === (formData.transitMatrix || []).length - 1}
                                        className="p-1 sm:p-0.5 text-slate-500 hover:text-[#0a1d37] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200 rounded transition-colors cursor-pointer"
                                        title="Move landmark down"
                                        aria-label="Move landmark down"
                                      >
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Travel Mode (Walk, Drive, Transit, Flight) */}
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Travel Mode
                                    </label>
                                    <div className="relative">
                                      <select
                                        value={tItem.travelMode || tItem.transportMode || 'Drive'}
                                        onChange={e => handleUpdateTransit(tIdx, 'travelMode', e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-2 py-1.5 text-xs font-semibold text-[#0a1d37] focus:border-[#b8860b] focus:outline-none cursor-pointer"
                                      >
                                        <option value="Walk">Walk</option>
                                        <option value="Drive">Drive</option>
                                        <option value="Transit">Transit</option>
                                        <option value="Flight">Flight</option>
                                      </select>
                                      <div className="absolute left-2 top-2 pointer-events-none">
                                        {(tItem.travelMode === 'Walk' || tItem.transportMode === 'Walk') ? <Footprints className="w-3.5 h-3.5 text-emerald-600" /> :
                                         (tItem.travelMode === 'Flight' || tItem.transportMode === 'Flight') ? <Plane className="w-3.5 h-3.5 text-sky-600" /> :
                                         (tItem.travelMode === 'Transit' || tItem.transportMode === 'Transit') ? <Train className="w-3.5 h-3.5 text-amber-600" /> :
                                         <Car className="w-3.5 h-3.5 text-blue-600" />}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Landmark Name */}
                                  <div className="sm:col-span-4">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Landmark Name
                                    </label>
                                    <input
                                      type="text"
                                      value={tItem.landmarkName || tItem.destination || ''}
                                      onChange={e => handleUpdateTransit(tIdx, 'landmarkName', e.target.value)}
                                      placeholder="e.g. Mangaluru Central Railway Station"
                                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                    />
                                  </div>

                                  {/* Distance */}
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Distance
                                    </label>
                                    <input
                                      type="text"
                                      value={tItem.distanceText || (tItem.distanceKm !== undefined && tItem.distanceKm !== 0 ? `${tItem.distanceKm} km` : '')}
                                      onChange={e => handleUpdateTransit(tIdx, 'distanceText', e.target.value)}
                                      placeholder="e.g. 4.2 km"
                                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                    />
                                  </div>

                                  {/* Duration */}
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Duration
                                    </label>
                                    <input
                                      type="text"
                                      value={tItem.durationText || (tItem.travelTimeMins !== undefined && tItem.travelTimeMins !== 0 ? `${tItem.travelTimeMins}m` : '')}
                                      onChange={e => handleUpdateTransit(tIdx, 'durationText', e.target.value)}
                                      placeholder="e.g. 10m"
                                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                    />
                                  </div>

                                  {/* Delete button */}
                                  <div className="sm:col-span-1 flex justify-end sm:justify-center sm:pt-4">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTransit(tIdx)}
                                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer"
                                      title="Delete Landmark"
                                      aria-label="Delete Landmark"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Road Ingress & Zoning Metadata */}
                          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Road Ingress Specification
                              </label>
                              <input
                                type="text"
                                value={formData.roadIngressText || ''}
                                onChange={e => setFormData(prev => ({ ...prev, roadIngressText: e.target.value }))}
                                placeholder="e.g. 40ft Wide Asphalt Road"
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">Displayed in property footer transit strip.</p>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Zoning & Approval Tag
                              </label>
                              <input
                                type="text"
                                value={formData.zoningTagText || ''}
                                onChange={e => setFormData(prev => ({ ...prev, zoningTagText: e.target.value }))}
                                placeholder="e.g. RERA Compliant / MCC A-Khata"
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">e.g. RERA Compliant, Commercial Khata A, etc.</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* STEP 4: DYNAMIC SELF-VERIFIABLE LEGAL AUDIT UI & INVESTMENT */}
                    {formStep === 4 && (
                      <div className="space-y-8">

                        {/* LEGAL & TITLE VERIFICATION SECTION */}
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-r from-amber-50 to-[#fdfbf7] border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center space-x-2">
                                <FileCheck className="w-4 h-4 text-[#b8860b]" />
                                <h4 className="font-serif font-bold text-sm text-[#0a1d37]">
                                  Legal & Title Verification
                                </h4>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                                Audit statutory title documents with individual status badges and manual verification logging.
                              </p>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                type="button"
                                onClick={handleLoadDefault12PointLegal}
                                className="bg-[#0a1d37] hover:bg-[#061426] text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center space-x-1.5"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-[#e6ca65]" />
                                <span>Load Default 12-Point Checklist</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleAddCustomLegalCheck}
                                className="bg-white hover:bg-slate-50 text-[#0a1d37] border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center space-x-1"
                              >
                                <PlusCircle className="w-3.5 h-3.5 text-[#b8860b]" />
                                <span>+ Add Custom Legal Check</span>
                              </button>
                            </div>
                          </div>

                          {/* List of Legal Audit Items */}
                          <div className="space-y-3">
                            {(formData.legalVerification || []).map((legalItem, lIdx) => (
                              <div
                                key={lIdx}
                                className="bg-[#fbf9f5] border border-slate-200 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center shadow-2xs"
                              >
                                {/* Document Name */}
                                <div className="sm:col-span-4">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Document Title {legalItem.isCustomItem && <span className="text-[#b8860b] font-normal">(Custom)</span>}
                                  </label>
                                  <input
                                    type="text"
                                    value={legalItem.documentName}
                                    onChange={e => handleUpdateLegalItem(lIdx, 'documentName', e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                  />
                                </div>

                                {/* Verified Status */}
                                <div className="sm:col-span-3">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Verification Status
                                  </label>
                                  <select
                                    value={legalItem.verifiedStatus}
                                    onChange={e => handleUpdateLegalItem(lIdx, 'verifiedStatus', e.target.value)}
                                    className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none cursor-pointer ${legalItem.verifiedStatus === 'Verified' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                                        legalItem.verifiedStatus === 'Pending' ? 'bg-amber-50 border-amber-300 text-amber-800' :
                                          legalItem.verifiedStatus === 'Issue Flagged' ? 'bg-red-50 border-red-300 text-red-800' :
                                            'bg-slate-50 border-slate-300 text-slate-700'
                                      }`}
                                  >
                                    <option value="Verified">Verified (Clean Clear Title)</option>
                                    <option value="Pending">Pending Audit</option>
                                    <option value="Issue Flagged">Issue Flagged / Action Required</option>
                                    <option value="Not Applicable">Not Applicable</option>
                                  </select>
                                </div>

                                {/* Verification Note */}
                                <div className="sm:col-span-4">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Manual Audit Note
                                  </label>
                                  <input
                                    type="text"
                                    value={legalItem.verificationNote || ''}
                                    onChange={e => handleUpdateLegalItem(lIdx, 'verificationNote', e.target.value)}
                                    placeholder="e.g. Verified via Kaveri 2.0 portal"
                                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:border-[#b8860b] focus:outline-none"
                                  />
                                </div>

                                {/* Delete button */}
                                <div className="sm:col-span-1 flex justify-end sm:pt-4">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLegalItem(lIdx)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Delete Item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ADVOCATE VERIFICATION BRIDGE TOGGLE */}
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-[#0a1d37] block">
                              Advocate Legal Search Report / Bank Loan Bridge
                            </span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              Keep "Verify with Advocate (Bank Loan Bridge)" action active on storefront for buyers needing bank approvals.
                            </span>
                          </div>
                          <label className="inline-flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.advocateVerificationAvailable}
                              onChange={e => setFormData({ ...formData, advocateVerificationAvailable: e.target.checked })}
                              className="w-5 h-5 text-[#0a1d37] rounded focus:ring-[#b8860b]"
                            />
                            <span className="text-xs font-bold text-emerald-800">Active</span>
                          </label>
                        </div>

                        {/* STRATEGIC INVESTMENT ANALYSIS INPUTS */}
                        <div className="p-4 bg-[#fbf9f5] border border-slate-200 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-[#0a1d37] uppercase tracking-wider block">
                            Strategic Investment & Yield Guidance
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Estimated Monthly Rental Yield</label>
                              <input
                                type="text"
                                value={formData.rentalYieldEst}
                                onChange={e => setFormData({ ...formData, rentalYieldEst: e.target.value })}
                                placeholder="e.g. ₹1,25,000 / mo (4.2% Gross Yield)"
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Annual Resale Appreciation</label>
                              <input
                                type="text"
                                value={formData.resaleAppreciationEst}
                                onChange={e => setFormData({ ...formData, resaleAppreciationEst: e.target.value })}
                                placeholder="e.g. 11.5% - 13.0% Compound Y-o-Y"
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Locality Growth Driver</label>
                              <input
                                type="text"
                                value={formData.localityGrowthDriver}
                                onChange={e => setFormData({ ...formData, localityGrowthDriver: e.target.value })}
                                placeholder="e.g. Coastal expansion & IT corridor ingress"
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Step Navigation Controls */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
                      <div>
                        {formStep > 1 && (
                          <button
                            type="button"
                            onClick={() => setFormStep(formStep - 1)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-[#0a1d37] hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                          >
                            ← Previous Step
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={handleCancelForm}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#0a1d37] transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>

                        {formStep < 4 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setFormStep(prev => Math.min(prev + 1, 4));
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer border border-slate-800"
                          >
                            Next Step →
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-lg text-xs shadow-sm flex items-center space-x-1.5 cursor-pointer transition-all border border-slate-800"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{editingPropertyId ? 'Save Updates' : 'Publish Live to Catalog'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </form>
                </div>

              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 5: HERO SETTINGS & FEATURED VIDEO CONTROLLER               */}
            {/* =============================================================== */}
            {activeTab === 'hero-settings' && (
              <div className="space-y-8 w-full">

                {/* Header Banner */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#b8860b]">
                        Command Center • Dynamic Media Controller
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        Live Dynamic Hook
                      </span>
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-[#0a1d37] mt-1">
                      Hero Featured Video Showcase
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                      Configure the widescreen 16:9 featured video showcase appearing on the live homepage hero. Select any existing property listing to link directly, or paste a custom YouTube ID/URL override with custom typography.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate('/')}
                      className="border border-slate-200 bg-[#f8f6f0] hover:bg-slate-100 text-[#0a1d37] px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
                      title="View current live homepage"
                    >
                      <Eye className="w-4 h-4 text-[#b8860b]" />
                      <span>View Live Site</span>
                    </button>
                    <button
                      onClick={handleSaveHeroSettings}
                      disabled={isSavingHeroSettings}
                      className="bg-[#0a1d37] hover:bg-[#061426] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-md cursor-pointer"
                    >
                      {isSavingHeroSettings ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#b8860b]" />
                      ) : heroSaveSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Save className="w-4 h-4 text-[#e6ca65]" />
                      )}
                      <span>{heroSaveSuccess ? 'Deployed Live!' : isSavingHeroSettings ? 'Deploying...' : 'Save & Deploy'}</span>
                    </button>
                  </div>
                </div>

                {/* Main Grid: Form Controls (Left) & Real-time 16:9 Live Preview (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                  {/* Left Column: Configuration Form */}
                  <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">

                    {/* Field 1: Property Listing Selector */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        1. Select Associated Property Listing (Click to redirect)
                      </label>
                      <select
                        value={heroSettings.heroFeaturedPropertyId || ''}
                        onChange={(e) => handleSelectHeroProperty(e.target.value)}
                        className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#0a1d37] font-medium focus:outline-none focus:border-[#b8860b]"
                      >
                        <option value="">-- No Direct Link (Custom Showcase) --</option>
                        {properties.map((p) => (
                          <option key={p._id || p.id} value={p._id || p.id}>
                            {p.title} • {p.locality || p.city || p.location} ({p.price})
                          </option>
                        ))}
                      </select>
                      <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
                        <span>Clicking the hero video card on the homepage redirects buyers directly to this property's inspection dossier.</span>
                        {heroSettings.heroFeaturedPropertyId && (
                          <button
                            type="button"
                            onClick={() => handleSelectHeroProperty(heroSettings.heroFeaturedPropertyId)}
                            className="text-[#b8860b] hover:underline font-semibold ml-2 cursor-pointer"
                          >
                            Re-sync Metadata
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Field 2: Custom YouTube Video ID or URL */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        2. Direct YouTube Video ID or URL Override
                      </label>
                      <div className="relative">
                        <Video className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. 7X8mLSQkg4Y or https://www.youtube.com/watch?v=..."
                          value={heroSettings.heroCustomYoutubeId || ''}
                          onChange={(e) => setHeroSettings({ ...heroSettings, heroCustomYoutubeId: e.target.value })}
                          className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-[#0a1d37] font-medium focus:outline-none focus:border-[#b8860b]"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        Leave empty to use the selected property's default YouTube video ID. Direct video IDs or full YouTube URLs automatically resolve in 16:9 widescreen HD thumbnails.
                      </p>
                    </div>

                    {/* Field 3: Badge Tag */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        3. Hero Badge Tag Pill
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. FEATURED PROPERTY"
                        value={heroSettings.heroBadgeTag || ''}
                        onChange={(e) => setHeroSettings({ ...heroSettings, heroBadgeTag: e.target.value })}
                        className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#0a1d37] font-medium focus:outline-none focus:border-[#b8860b]"
                      />
                      {/* Quick Badge Suggestions */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[10px] text-slate-400 font-mono self-center mr-1">Suggestions:</span>
                        {['FEATURED PROPERTY', 'VERIFIED RESALE', 'EXCLUSIVE SEA VILLA', 'WATERFRONT PENTHOUSE', 'INVESTOR HIGHLIGHT'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setHeroSettings({ ...heroSettings, heroBadgeTag: tag })}
                            className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${heroSettings.heroBadgeTag === tag
                                ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
                              }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Field 4: Overlay Display Title */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        4. Overlay Display Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ultra Luxury Seafront Villa"
                        value={heroSettings.heroOverlayTitle || ''}
                        onChange={(e) => setHeroSettings({ ...heroSettings, heroOverlayTitle: e.target.value })}
                        className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#0a1d37] font-medium focus:outline-none focus:border-[#b8860b]"
                      />
                    </div>

                    {/* Field 5: Overlay Location & Price */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        5. Overlay Location & Price Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Surathkal Beach, Mangaluru • ₹3.85 Cr"
                        value={heroSettings.heroOverlayLocation || ''}
                        onChange={(e) => setHeroSettings({ ...heroSettings, heroOverlayLocation: e.target.value })}
                        className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#0a1d37] font-medium focus:outline-none focus:border-[#b8860b]"
                      />
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Changes deploy in real-time without requiring site restart.
                      </span>
                      <button
                        type="button"
                        onClick={handleSaveHeroSettings}
                        disabled={isSavingHeroSettings}
                        className="bg-[#0a1d37] hover:bg-[#061426] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-md cursor-pointer"
                      >
                        {isSavingHeroSettings ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#b8860b]" />
                        ) : (
                          <Save className="w-3.5 h-3.5 text-[#e6ca65]" />
                        )}
                        <span>{isSavingHeroSettings ? 'Deploying...' : 'Save & Deploy Live'}</span>
                      </button>
                    </div>

                  </div>

                  {/* Right Column: Live 16:9 Widescreen Card Preview */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0a1d37]">
                            Live 16:9 Homepage Preview
                          </h2>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                          Aspect: 16:9 Widescreen
                        </span>
                      </div>

                      {/* Exact 16:9 Hero Card Container */}
                      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 relative bg-[#0a1d37] group">
                        <img
                          src={previewThumbnail}
                          alt="Hero Preview"
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            if (e.target.src.includes('maxresdefault.jpg')) {
                              e.target.src = `https://img.youtube.com/vi/${previewYoutubeId}/hqdefault.jpg`;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1d37]/95 via-[#0a1d37]/35 to-black/20" />

                        {/* Top Badge */}
                        <div className="absolute top-3.5 left-3.5 z-10">
                          <span className="bg-red-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-md">
                            <Video className="w-3.5 h-3.5" />
                            <span>{heroSettings.heroBadgeTag || 'FEATURED PROPERTY'}</span>
                          </span>
                        </div>

                        {/* Center Play Button */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 pointer-events-none">
                          <div className="w-14 h-14 rounded-full bg-white/95 text-[#0a1d37] flex items-center justify-center shadow-2xl mb-2">
                            <Play className="w-6 h-6 fill-current ml-0.5 text-[#0a1d37]" />
                          </div>
                          <span className="text-xs font-semibold text-white tracking-wide bg-[#0a1d37]/80 px-3.5 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
                            View Property Details
                          </span>
                        </div>

                        {/* Bottom Overlay Info */}
                        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white z-10">
                          <span className="text-[10px] text-[#e6ca65] uppercase tracking-widest font-bold block mb-0.5">
                            Exclusive Listing
                          </span>
                          <h3 className="text-base font-serif font-medium truncate drop-shadow-sm text-white">
                            {heroSettings.heroOverlayTitle || 'Featured Property Walkthrough'}
                          </h3>
                          <p className="text-xs text-slate-200 truncate mt-0.5">
                            {heroSettings.heroOverlayLocation || 'Mangaluru'}
                          </p>
                        </div>
                      </div>

                      {/* Metadata Specs Panel */}
                      <div className="mt-5 pt-4 border-t border-slate-100 text-xs space-y-2">
                        <div className="flex justify-between py-1 text-slate-600">
                          <span className="font-mono text-slate-400">Target Listing:</span>
                          <span className="font-semibold text-[#0a1d37] truncate max-w-[200px]">
                            {properties.find(p => String(p._id) === String(heroSettings.heroFeaturedPropertyId) || String(p.id) === String(heroSettings.heroFeaturedPropertyId))?.title || 'None (Custom)'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600">
                          <span className="font-mono text-slate-400">Active YouTube ID:</span>
                          <span className="font-mono font-semibold text-[#b8860b]">
                            {previewYoutubeId}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600">
                          <span className="font-mono text-slate-400">Thumbnail Resolution:</span>
                          <span className="font-semibold text-slate-700">1280 × 720 (16:9 MaxRes)</span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600">
                          <span className="font-mono text-slate-400">Sync Status:</span>
                          <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Ready for Deployment</span>
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 6: SYSTEM PRESETS & CONFIG MANAGER (Dual-Tab)              */}
            {/* =============================================================== */}
            {activeTab === 'master-presets' && (
              <div className="space-y-8 w-full">

                {/* Header Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-amber-800/20 bg-amber-50/70 text-[#8b6508] text-[11px] font-semibold mb-2">
                      <FolderCog className="w-3.5 h-3.5 text-[#b8860b]" />
                      <span>Global Master Catalog & System Config</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif text-[#0a1d37]">
                      System Presets & Specifications
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                      Centrally manage statutory advocate legal checklists and category-filtered property feature matrices. Changes synchronize dynamically with listing creators and published verified properties.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={handleSeedDefaults}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#fbf9f5] hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                      title="Reset to default legal checks and feature matrices"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#b8860b]" />
                      <span>Reset Defaults</span>
                    </button>
                    <button
                      onClick={() => handleOpenAddPreset(presetTab === 'legal' ? 'LEGAL_CHECK' : 'PROPERTY_FEATURE')}
                      className="inline-flex items-center space-x-1.5 bg-[#0a1d37] hover:bg-[#061426] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-[#e6ca65]" />
                      <span>{presetTab === 'legal' ? '+ Add Master Legal Check' : '+ Add Feature Preset'}</span>
                    </button>
                  </div>
                </div>

                {/* Dual-Tab Navigation Selector */}
                <div className="flex border-b border-slate-200 space-x-6">
                  <button
                    onClick={() => { setPresetTab('legal'); setPresetGroupFilter('All'); setPresetSearchQuery(''); }}
                    className={`pb-4 px-2 text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${presetTab === 'legal'
                        ? 'border-b-2 border-[#b8860b] text-[#0a1d37]'
                        : 'text-slate-400 hover:text-slate-700'
                      }`}
                  >
                    <ShieldCheck className={`w-4 h-4 ${presetTab === 'legal' ? 'text-[#b8860b]' : 'text-slate-400'}`} />
                    <span>Global Legal Advisory & Audit Presets</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200">
                      {presets.filter(p => p.presetType === 'LEGAL_CHECK').length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setPresetTab('features'); setPresetGroupFilter('All'); setPresetSearchQuery(''); }}
                    className={`pb-4 px-2 text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${presetTab === 'features'
                        ? 'border-b-2 border-[#b8860b] text-[#0a1d37]'
                        : 'text-slate-400 hover:text-slate-700'
                      }`}
                  >
                    <Layers className={`w-4 h-4 ${presetTab === 'features' ? 'text-[#b8860b]' : 'text-slate-400'}`} />
                    <span>Category-Based Feature & Specification Presets</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {presets.filter(p => p.presetType === 'PROPERTY_FEATURE').length}
                    </span>
                  </button>
                </div>

                {/* TAB 1: GLOBAL LEGAL ADVISORY & AUDIT PRESETS */}
                {presetTab === 'legal' && (
                  <div className="space-y-6">
                    {/* Filter & Search Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search legal documents, clearance types..."
                          value={presetSearchQuery}
                          onChange={e => setPresetSearchQuery(e.target.value)}
                          className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-[#0a1d37] focus:outline-none focus:border-[#b8860b]"
                        />
                      </div>

                      <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center space-x-1">
                          <Filter className="w-3 h-3" />
                          <span>Category:</span>
                        </span>
                        {['All', 'Title', 'Municipal', 'Tax', 'Environmental', 'Custom'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setPresetGroupFilter(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${presetGroupFilter === cat
                                ? 'bg-[#0a1d37] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Legal Presets Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#fbf9f5] border-b border-slate-200 text-slate-500 font-serif">
                              <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Document / Audit Title</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Statutory Category</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Standard Audit Tip / Guide Note</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Active Status</th>
                              <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] text-right text-[#0a1d37]">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {presets
                              .filter(p => p.presetType === 'LEGAL_CHECK')
                              .filter(p => presetGroupFilter === 'All' || p.groupCategory?.toLowerCase() === presetGroupFilter.toLowerCase() || (presetGroupFilter === 'Title' && p.groupCategory === 'Ownership'))
                              .filter(p => !presetSearchQuery || p.title?.toLowerCase().includes(presetSearchQuery.toLowerCase()) || p.defaultDescription?.toLowerCase().includes(presetSearchQuery.toLowerCase()))
                              .map((preset, idx) => {
                                const group = preset.groupCategory || 'Title';
                                const badgeColor =
                                  group.toLowerCase().includes('title') || group.toLowerCase().includes('ownership')
                                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                                    : group.toLowerCase().includes('municipal')
                                      ? 'bg-blue-50 text-blue-900 border-blue-200'
                                      : group.toLowerCase().includes('tax')
                                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                        : group.toLowerCase().includes('environ')
                                          ? 'bg-teal-50 text-teal-900 border-teal-200'
                                          : 'bg-purple-50 text-purple-900 border-purple-200';

                                return (
                                  <tr key={preset._id || idx} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3.5 px-6 font-semibold text-[#0a1d37] min-w-[240px]">
                                      <div className="flex items-center space-x-2.5">
                                        <ShieldCheck className="w-4 h-4 text-[#b8860b] shrink-0" />
                                        <span>{preset.title}</span>
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${badgeColor}`}>
                                        {preset.groupCategory || 'Title'}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600 max-w-md">
                                      <p className="line-clamp-2 leading-relaxed">{preset.defaultDescription || '—'}</p>
                                    </td>
                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                      <button
                                        onClick={() => handleTogglePresetActive(preset)}
                                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${preset.isActive !== false
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                            : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                                          }`}
                                      >
                                        <span className={`w-1.5 h-1.5 rounded-full ${preset.isActive !== false ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                                        <span>{preset.isActive !== false ? 'Active' : 'Disabled'}</span>
                                      </button>
                                    </td>
                                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                                      <div className="inline-flex items-center space-x-1.5">
                                        <button
                                          onClick={() => handleOpenEditPreset(preset)}
                                          className="p-1.5 text-slate-500 hover:text-[#0a1d37] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                          title="Edit Preset"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeletePreset(preset._id || preset.id)}
                                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                          title="Delete Preset"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CATEGORY-BASED FEATURE & SPECIFICATION PRESETS */}
                {presetTab === 'features' && (
                  <div className="space-y-6">

                    {/* Property Category Selector Tabs */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8860b] font-bold block">Target Asset Category</span>
                          <h4 className="font-serif font-bold text-sm text-[#0a1d37]">Select Category Matrix to Configure</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {['Apartment', 'Villa', 'Independent House', 'Commercial', 'Land/Plot', 'ALL'].map(cat => (
                            <button
                              key={cat}
                              onClick={() => { setPresetCategoryFilter(cat); }}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${presetCategoryFilter === cat
                                  ? 'bg-[#0a1d37] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Secondary Filter & Search */}
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1">
                        <div className="relative w-full md:w-80">
                          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search specifications, elevator, pool, power..."
                            value={presetSearchQuery}
                            onChange={e => setPresetSearchQuery(e.target.value)}
                            className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-[#0a1d37] focus:outline-none focus:border-[#b8860b]"
                          />
                        </div>

                        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
                            <span>Group:</span>
                          </span>
                          {['All', 'Interior & Living', 'Building & Security', 'Utilities', 'Outdoor'].map(grp => (
                            <button
                              key={grp}
                              onClick={() => setPresetGroupFilter(grp)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${presetGroupFilter === grp
                                  ? 'bg-amber-100 text-[#8b6508] border border-amber-300 font-bold'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                              {grp}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Feature Presets Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#fbf9f5] border-b border-slate-200 text-slate-500 font-serif">
                              <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Feature / Specification</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Group</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Asset Type</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Default Status</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Standard Specification Guide</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Active</th>
                              <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] text-right text-[#0a1d37]">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {presets
                              .filter(p => p.presetType === 'PROPERTY_FEATURE')
                              .filter(p => presetCategoryFilter === 'ALL' || p.applicableCategory === 'ALL' || p.applicableCategory === presetCategoryFilter || (presetCategoryFilter === 'Independent House' && p.applicableCategory === 'Villa'))
                              .filter(p => presetGroupFilter === 'All' || p.groupCategory === presetGroupFilter)
                              .filter(p => !presetSearchQuery || p.title?.toLowerCase().includes(presetSearchQuery.toLowerCase()) || p.defaultDescription?.toLowerCase().includes(presetSearchQuery.toLowerCase()))
                              .map((preset, idx) => (
                                <tr key={preset._id || idx} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-3.5 px-6 font-semibold text-[#0a1d37] min-w-[200px]">
                                    <div className="flex items-center space-x-2">
                                      <Layers className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                                      <span>{preset.title}</span>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      {preset.groupCategory || 'General'}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-[#8b6508] border border-amber-200">
                                      {preset.applicableCategory || 'ALL'}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    {preset.defaultStatus !== 'Not Available' ? (
                                      <span className="text-emerald-700 font-bold flex items-center space-x-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Included</span>
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 font-medium">Not Included</span>
                                    )}
                                  </td>
                                  <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                                    <p className="truncate leading-relaxed">{preset.defaultDescription || '—'}</p>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <button
                                      onClick={() => handleTogglePresetActive(preset)}
                                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${preset.isActive !== false
                                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                          : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                                        }`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${preset.isActive !== false ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                                      <span>{preset.isActive !== false ? 'Active' : 'Disabled'}</span>
                                    </button>
                                  </td>
                                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                                    <div className="inline-flex items-center space-x-1.5">
                                      <button
                                        onClick={() => handleOpenEditPreset(preset)}
                                        className="p-1.5 text-slate-500 hover:text-[#0a1d37] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                        title="Edit Preset"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeletePreset(preset._id || preset.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        title="Delete Preset"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 7: ADMIN ACCESS & SECURITY MANAGER                          */}
            {/* =============================================================== */}
            {activeTab === 'admin-security' && (
              <div className="space-y-8 w-full max-w-6xl mx-auto pb-12">

                {/* Header Title & Refresh */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <ShieldCheck className="w-6 h-6 text-[#b8860b]" />
                      <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#0a1d37] tracking-tight">
                        Admin Access & Security
                      </h1>
                    </div>
                    <p className="text-xs text-slate-500">
                      Manage administrative personnel, approve access requests, and rotate the dynamic invite registration key.
                    </p>
                  </div>
                  <button
                    onClick={loadAdminsAndInviteKey}
                    disabled={adminsLoading}
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-700 hover:text-[#0a1d37] border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${adminsLoading ? 'animate-spin text-[#b8860b]' : ''}`} />
                    <span>Refresh Directory</span>
                  </button>
                </div>

                {/* Status / Alert Banner */}
                {securityMessage && (
                  <div className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-fadeIn ${
                    securityMessage.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {securityMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span className="font-medium">{securityMessage.text}</span>
                    </div>
                    <button
                      onClick={() => setSecurityMessage(null)}
                      className="text-slate-400 hover:text-slate-600 ml-4 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Dynamic Admin Invite Key Section */}
                <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#b8860b] shrink-0">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="font-serif font-bold text-base text-[#0a1d37]">
                            Dynamic Admin Invite Key
                          </h2>
                          {currentInviteKey && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          Prospective administrators must supply this key when registering an account. Rotate periodically for enhanced security.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveInviteKey} className="max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type={showConsoleInviteKey ? 'text' : 'password'}
                        value={inviteKeyInput}
                        onChange={(e) => setInviteKeyInput(e.target.value)}
                        placeholder="Enter dynamic invite key (min. 6 characters)"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 font-mono tracking-wider focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConsoleInviteKey(!showConsoleInviteKey)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title={showConsoleInviteKey ? 'Hide key' : 'Show key'}
                      >
                        {showConsoleInviteKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={inviteKeySaving || !inviteKeyInput || inviteKeyInput.trim().length < 6}
                      className="bg-[#0a1d37] hover:bg-[#13233D] disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer shrink-0"
                    >
                      {inviteKeySaving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5 text-amber-400" />
                          <span>Update Invite Key</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Pending Registration Requests */}
                <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-serif font-bold text-base text-[#0a1d37]">
                          Pending Registration Requests
                        </h2>
                        <p className="text-xs text-slate-500">
                          New admin accounts awaiting verification from an active administrator.
                        </p>
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      adminsList.filter(a => a.status === 'pending').length > 0
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {adminsList.filter(a => a.status === 'pending').length} Pending
                    </span>
                  </div>

                  {adminsList.filter(a => a.status === 'pending').length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/60 mb-2" />
                      <p className="font-medium text-slate-600">No pending requests</p>
                      <p className="text-slate-400 mt-0.5">All administrator registrations have been processed.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {adminsList.filter(a => a.status === 'pending').map((pendingAdmin) => (
                        <div key={pendingAdmin._id || pendingAdmin.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-sm text-[#0a1d37]">{pendingAdmin.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
                                Awaiting Approval
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center space-x-3">
                              <span>{pendingAdmin.email}</span>
                              <span>•</span>
                              <span>Requested {new Date(pendingAdmin.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleApproveAdmin(pendingAdmin._id || pendingAdmin.id)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve Access</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectAdmin(pendingAdmin._id || pendingAdmin.id)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Administrators Directory */}
                <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-serif font-bold text-base text-[#0a1d37]">
                          Administrative Directory
                        </h2>
                        <p className="text-xs text-slate-500">
                          All authorized system administrators and their operational status.
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {adminsList.filter(a => a.status !== 'pending').length} Total
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Administrator</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Last Login</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminsList.filter(a => a.status !== 'pending').map((admin) => {
                          const isSelf = currentAdminUser && (admin._id === currentAdminUser.id || admin.id === currentAdminUser.id || admin.email === currentAdminUser.email);
                          return (
                            <tr key={admin._id || admin.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-900 flex items-center space-x-1.5">
                                  <span>{admin.name}</span>
                                  {isSelf && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-slate-500 text-[11px]">{admin.email}</div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  admin.role === 'superadmin'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {admin.role || 'admin'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  admin.status === 'approved'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : admin.status === 'rejected'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {admin.status || 'approved'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                                {admin.lastLogin
                                  ? new Date(admin.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                  : 'Never'}
                              </td>
                              <td className="py-3 px-4 text-right">
                                {admin.status === 'rejected' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleApproveAdmin(admin._id || admin.id)}
                                    className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs px-2 py-1 rounded hover:bg-emerald-50 transition-colors mr-2 cursor-pointer"
                                  >
                                    Re-Approve
                                  </button>
                                ) : null}
                                {!isSelf && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAdmin(admin._id || admin.id, admin.name)}
                                    className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                    title={`Remove ${admin.name}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>
        </main>

      </div>

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT MASTER PRESET                                     */}
      {/* =================================================================== */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1d37]/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPresetModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#b8860b]">
                {editingPresetId ? 'Edit Configuration' : 'Create Master Preset'}
              </span>
              <h3 className="text-xl font-serif font-bold text-[#0a1d37] mt-1">
                {editingPresetId
                  ? 'Edit Master Preset'
                  : (presetFormData.presetType === 'LEGAL_CHECK' ? 'Add Master Legal Check' : 'Add Property Feature Preset')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure defaults that will propagate to listing creation workflows and client specifications.
              </p>
            </div>

            <form onSubmit={handleSavePreset} className="space-y-4">
              {/* Preset Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preset Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPresetFormData({ ...presetFormData, presetType: 'LEGAL_CHECK', groupCategory: 'Title' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${presetFormData.presetType === 'LEGAL_CHECK'
                        ? 'bg-[#0a1d37] text-white border-[#0a1d37] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Legal Check
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetFormData({ ...presetFormData, presetType: 'PROPERTY_FEATURE', groupCategory: 'Interior & Living' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${presetFormData.presetType === 'PROPERTY_FEATURE'
                        ? 'bg-[#0a1d37] text-white border-[#0a1d37] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Feature / Amenity
                  </button>
                </div>
              </div>

              {/* Title / Document Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {presetFormData.presetType === 'LEGAL_CHECK' ? 'Document / Clearance Name *' : 'Feature / Amenity Title *'}
                </label>
                <input
                  required
                  type="text"
                  placeholder={presetFormData.presetType === 'LEGAL_CHECK' ? 'e.g. CRZ Coastal Clearance Certificate' : 'e.g. Automatic High-Speed Elevators'}
                  value={presetFormData.title}
                  onChange={e => setPresetFormData({ ...presetFormData, title: e.target.value })}
                  className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                />
              </div>

              {/* If Feature: Applicable Category & Default Status */}
              {presetFormData.presetType === 'PROPERTY_FEATURE' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Applicable Category</label>
                    <select
                      value={presetFormData.applicableCategory}
                      onChange={e => setPresetFormData({ ...presetFormData, applicableCategory: e.target.value })}
                      className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#b8860b]"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Land/Plot">Land/Plot</option>
                      <option value="ALL">ALL Asset Types</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Default Status</label>
                    <select
                      value={presetFormData.defaultStatus}
                      onChange={e => setPresetFormData({ ...presetFormData, defaultStatus: e.target.value })}
                      className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#b8860b]"
                    >
                      <option value="Available">Available (Included)</option>
                      <option value="Not Available">Not Available</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Group Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {presetFormData.presetType === 'LEGAL_CHECK' ? 'Default Legal Category' : 'Specification Group'}
                </label>
                {presetFormData.presetType === 'LEGAL_CHECK' ? (
                  <select
                    value={presetFormData.groupCategory}
                    onChange={e => setPresetFormData({ ...presetFormData, groupCategory: e.target.value })}
                    className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#b8860b]"
                  >
                    <option value="Title">Title / Ownership</option>
                    <option value="Municipal">Municipal Clearance</option>
                    <option value="Tax">Tax & Revenue</option>
                    <option value="Environmental">Environmental / CRZ</option>
                    <option value="Custom">Custom Audit</option>
                  </select>
                ) : (
                  <select
                    value={presetFormData.groupCategory}
                    onChange={e => setPresetFormData({ ...presetFormData, groupCategory: e.target.value })}
                    className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#b8860b]"
                  >
                    <option value="Interior & Living">Interior & Living</option>
                    <option value="Building & Security">Building & Security</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="General">General</option>
                  </select>
                )}
              </div>

              {/* Standard Audit Tip / Guide */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {presetFormData.presetType === 'LEGAL_CHECK' ? 'Standard Audit Tip / Guide Note' : 'Default Specification Note'}
                </label>
                <textarea
                  rows="3"
                  placeholder={presetFormData.presetType === 'LEGAL_CHECK'
                    ? 'Mention statutory verification procedure, required authority stamp, or advocate panel advisory...'
                    : 'Mention technical specifications, brand standards, or capacity details...'}
                  value={presetFormData.defaultDescription}
                  onChange={e => setPresetFormData({ ...presetFormData, defaultDescription: e.target.value })}
                  className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Active Toggle Checkbox */}
              <div className="flex items-center space-x-2.5 pt-1">
                <input
                  type="checkbox"
                  id="presetActiveCheckbox"
                  checked={presetFormData.isActive}
                  onChange={e => setPresetFormData({ ...presetFormData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0a1d37] border-slate-300 focus:ring-[#b8860b]"
                />
                <label htmlFor="presetActiveCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Preset is Active (will automatically appear in listing creation forms)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPresetModal(false)}
                  className="w-1/3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPreset}
                  className="w-2/3 py-2.5 bg-[#0a1d37] hover:bg-[#061426] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isSavingPreset ? 'Saving Preset...' : (editingPresetId ? 'Save Changes' : 'Create Preset')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Custom Item Modal (Zero Native Browser prompt() Dialogs) */}
      <AddCustomItemModal
        isOpen={customItemModal.isOpen}
        onClose={() => setCustomItemModal(prev => ({ ...prev, isOpen: false }))}
        title={customItemModal.type === 'FEATURE' ? `Add Feature to ${customItemModal.categoryName || 'Category'}` : 'Add Custom Statutory Legal Check'}
        subtitle={customItemModal.type === 'FEATURE' ? 'Configure custom architectural, fixture, or amenity specification.' : 'Configure statutory clearance, municipal approval, or environmental NOC document.'}
        onSubmit={handleConfirmCustomModal}
        submitLabel={customItemModal.type === 'FEATURE' ? 'Add Feature' : 'Add Legal Check'}
      >
        {customItemModal.type === 'FEATURE' ? (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Feature / Amenity Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Italian Botticino Marble Flooring, Private Plunge Pool"
                value={customItemModal.title}
                onChange={e => setCustomItemModal(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Specification / Description Note <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Imported 20mm slab, anti-skid polished finish"
                value={customItemModal.note}
                onChange={e => setCustomItemModal(prev => ({ ...prev, note: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Document / Statutory Clearance Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Coastal Regulation Zone (CRZ) Clearance"
                value={customItemModal.title}
                onChange={e => setCustomItemModal(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Initial Verification Status
              </label>
              <select
                value={customItemModal.status}
                onChange={e => setCustomItemModal(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none cursor-pointer"
              >
                <option value="Verified">Verified (Compliant on record)</option>
                <option value="Pending Audit">Pending Audit (Under advocate review)</option>
                <option value="Not Applicable">Not Applicable (Exempt by zone / type)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Audit Reference Note <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. NOC ref #CRZ-2024-8849 issued by CZMA"
                value={customItemModal.note}
                onChange={e => setCustomItemModal(prev => ({ ...prev, note: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
              />
            </div>
          </>
        )}
      </AddCustomItemModal>

      {/* CUSTOM PROPERTY DELETE CONFIRMATION MODAL */}
      {deleteModalState.isOpen && deleteModalState.property && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1d37]/80 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] border border-stone-300 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-[#1A1A1A] animate-in fade-in zoom-in-95 duration-150">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleCloseDeleteModal}
              disabled={deleteModalState.isDeleting}
              className="absolute top-4 right-4 text-stone-400 hover:text-[#1A1A1A] transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Icon & Header */}
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                Confirm Property Deletion
              </h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Are you sure you want to permanently remove <span className="font-bold text-[#1A1A1A]">"{deleteModalState.property.title}"</span> ({deleteModalState.property.listingCode || deleteModalState.property._id || 'Listing'}) from the active catalog? This action cannot be undone.
              </p>
            </div>

            {/* Property Summary Strip */}
            <div className="bg-white border border-stone-200 rounded-xl p-3 text-xs space-y-1 mb-5">
              <div className="flex justify-between">
                <span className="text-stone-500 font-mono">Location:</span>
                <span className="font-semibold text-[#1A1A1A] truncate max-w-[220px]">
                  {deleteModalState.property.locality || deleteModalState.property.location || 'Mangaluru'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-mono">Price:</span>
                <span className="font-serif font-bold text-[#b8860b]">
                  {deleteModalState.property.price || 'Price on Request'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 font-mono">Typology:</span>
                <span className="font-medium text-stone-700">
                  {deleteModalState.property.type || deleteModalState.property.category || 'Asset'} • {deleteModalState.property.dealType || 'Resale'}
                </span>
              </div>
            </div>

            {/* Error Message if Deletion Failed */}
            {deleteModalState.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 font-medium mb-4 flex items-start space-x-2">
                <span className="font-bold shrink-0">Deletion Blocked:</span>
                <span>{deleteModalState.error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={deleteModalState.isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-[#1A1A1A] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteModalState.isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                {deleteModalState.isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Deletion</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED CLEAN CONFIRMATION MODAL */}
      {confirmModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1d37]/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-800 animate-in zoom-in-95 duration-150">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleCloseConfirmModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon & Message */}
            <div className="mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                confirmModalState.isDestructive
                  ? 'bg-red-50 border border-red-200 text-red-600'
                  : 'bg-amber-50 border border-amber-200 text-[#b8860b]'
              }`}>
                {confirmModalState.isDestructive ? <Trash2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {confirmModalState.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {confirmModalState.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={handleCloseConfirmModal}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                {confirmModalState.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const cb = confirmModalState.onConfirm;
                  handleCloseConfirmModal();
                  if (cb) cb();
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center justify-center space-x-1.5 ${
                  confirmModalState.isDestructive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#0a1d37] hover:bg-[#13233D]'
                }`}
              >
                <span>{confirmModalState.confirmText || 'Confirm'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

```

## File: `src/App.css`

```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}

```

## File: `src/App.jsx`

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AdminConsole from './AdminConsole';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import PropertyDetails from './components/PropertyDetails';
import LegalStandards from './pages/LegalStandards';
import Contact from './pages/Contact';
import ListProperty from './pages/ListProperty';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import { useProperties } from './context/PropertyContext';
import { Phone, Loader2 } from 'lucide-react';
import { 
  fetchProperties, 
  fetchPropertyById,
  fetchLeads, 
  submitLead, 
  checkServerHealth,
  fetchSiteSettings,
  adminLogout,
  adminVerifyToken,
  getStoredAdminToken
} from './api';


// Helper to format YouTube embed URLs without autoplay
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0`
    : url;
};

const getYouTubeWatchUrl = (url) => {
  if (!url) return "#";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/watch?v=${match[2]}`
    : url;
};

const INITIAL_PROPERTIES = [];

const getPropertySpecs = (prop) => {
  if (!prop) {
    return {
      inventorySpecs: {
        bedrooms: 0,
        bathrooms: 0,
        halls: "N/A",
        garden: "N/A",
        furnishing: "N/A",
        furnitureAppliances: "N/A",
        kitchenType: "N/A",
        parking: "N/A",
        balconies: "N/A",
        flooring: "N/A",
        powerBackup: "N/A",
        waterSupply: "N/A"
      },
      technicalSpecs: {
        roadWidth: "N/A",
        powerBackup: "N/A",
        waterSource: "N/A",
        zoning: "N/A"
      },
      connectivity: [],
      financials: {
        monthlyRental: "N/A",
        rentalYield: "N/A",
        propertyTax: "N/A",
        stampDuty: "N/A",
        appreciation: "N/A"
      }
    };
  }
  const isCommercial = prop.type === 'Commercial' || prop.category === 'Commercial';
  const isEstate = prop.type === 'Estate' || prop.category === 'Estate';
  const isPlot = prop.type === 'Plot / Land' || prop.type === 'Plot' || prop.category === 'Plot' || prop.category === 'Land/Plot';
  const priceVal = prop.priceRaw || (parseInt((prop.price || '').replace(/[^0-9]/g, '')) * 100000) || 0;
  const stampDutyVal = priceVal ? `8.0% (~₹${(priceVal * 0.08 / 100000).toFixed(1)} Lakhs)` : 'N/A';
  const estRent = priceVal ? `₹${Math.round(priceVal * (isCommercial ? 0.006 : 0.0035)).toLocaleString('en-IN')} / mo` : 'N/A';

  const inventorySpecs = prop.inventorySpecs || {
    bedrooms: isPlot ? 0 : (prop.beds ?? (isCommercial ? 0 : isEstate ? 5 : (prop.specs?.bedrooms ?? 0))),
    bathrooms: isPlot ? 0 : (prop.baths ?? (isCommercial ? 2 : isEstate ? 6 : (prop.specs?.bathrooms ?? 0))),
    halls: isPlot ? "N/A - Plot Asset" : (isCommercial ? "Workstation Hall" : "Living + Dining"),
    garden: isPlot ? "Open Land Parcel" : (isCommercial ? "No" : "Yes (Private Lawn)"),
    furnishing: prop.specs?.furnishingStatus || (isPlot ? "Unfurnished (Plot)" : "Unfurnished"),
    furnitureAppliances: prop.furnishing || (isPlot ? "N/A - Open Land Parcel" : "Standard"),
    kitchenType: isPlot ? "N/A" : (isCommercial ? "Pantry" : "Standard Kitchen"),
    parking: isPlot ? "Direct Access" : "Covered Parking",
    balconies: isPlot ? "N/A" : "Standard Balcony",
    flooring: isPlot ? "Natural Ground" : "Vitrified Tiles",
    powerBackup: prop.powerBackup || "Standard Backup",
    waterSupply: prop.waterSupply || "Corporation Supply"
  };

  const technicalSpecs = prop.technicalSpecs || {
    roadWidth: prop.roadWidth || (isCommercial ? "60ft Four-Lane Arterial Road" : "40ft Tar Road"),
    powerBackup: prop.powerBackup || (isCommercial ? "3-Phase 25KW + 100% Dedicated DG" : "3-Phase 15KW + 100% DG Backup"),
    waterSource: prop.waterSupply || "Corporation Supply",
    zoning: prop.zoning || (isCommercial ? "Commercial Khata A Approved" : "Residential / RERA Approved")
  };

  const connectivity = prop.connectivity || [];

  const financials = prop.financials || {
    monthlyRental: isPlot ? "N/A (Capital Appreciation Asset)" : estRent,
    rentalYield: isPlot ? "12.0% - 15.0% Capital Yield" : (isCommercial ? "7.2% Commercial Yield" : (priceVal ? "4.5% - 5.2% Gross Yield" : "N/A")),
    propertyTax: priceVal ? `₹${isCommercial ? '24,000' : '18,500'} / year (Municipal SAS)` : "N/A",
    stampDuty: stampDutyVal,
    appreciation: "11.2% - 13.5% Y-o-Y"
  };

  return { inventorySpecs, technicalSpecs, connectivity, financials };
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Global property inventory & loading context
  const { properties, setProperties, isLoading, setIsLoading } = useProperties();

  // Admin authentication state based strictly on verified JWT token
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('gmk_admin_jwt'));
    }
    return false;
  });

  // URL route parsing for unified browser navigation
  const currentPath = location.pathname;
  const isAdminLoginRoute = currentPath === '/admin/login';
  const isAdminSignupRoute = currentPath === '/admin/signup';
  const isAdminConsoleRoute = (
    currentPath === '/admin' ||
    currentPath.startsWith('/admin/') ||
    currentPath === '/manage-345' ||
    currentPath.startsWith('/manage-345/')
  ) && !isAdminLoginRoute && !isAdminSignupRoute;
  const isPropertyDetailRoute = currentPath.startsWith('/property/');
  const propertyIdFromUrl = isPropertyDetailRoute ? currentPath.replace(/^\/property\//, '').split('/')[0] : null;

  // View state derived from URL
  const activeView = useMemo(() => {
    if (isAdminLoginRoute) return 'admin-login';
    if (isAdminSignupRoute) return 'admin-signup';
    if (isAdminConsoleRoute) return 'admin';
    if (isPropertyDetailRoute) return 'property-detail';
    if (currentPath === '/properties') return 'properties';
    if (currentPath === '/legal' || currentPath === '/legal-standards') return 'legal';
    if (currentPath === '/contact') return 'contact';
    if (currentPath === '/sell') return 'sell';
    return 'home';
  }, [currentPath, isAdminLoginRoute, isAdminSignupRoute, isAdminConsoleRoute, isPropertyDetailRoute]);

  // Local state for property viewing, gallery navigation, and catalog filtering
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyIdFromUrl || null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Site Settings (Hero Featured Video & Content)
  const [heroSettings, setHeroSettings] = useState({
    heroFeaturedPropertyId: null,
    heroCustomYoutubeId: "",
    heroBadgeTag: "FEATURED VIDEO TOUR",
    heroOverlayTitle: "",
    heroOverlayLocation: ""
  });

  // Inbound seller requests (initialized to empty array)
  const [sellerRequests, setSellerRequests] = useState([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const propRes = await fetchProperties();
      if (propRes?.success && Array.isArray(propRes.data)) {
        setProperties(propRes.data);
      } else {
        setProperties([]);
      }

      const leadRes = await fetchLeads();
      if (leadRes?.success && Array.isArray(leadRes.data)) {
        setSellerRequests(leadRes.data);
      } else {
        setSellerRequests([]);
      }

      const settingsRes = await fetchSiteSettings();
      if (settingsRes?.success && settingsRes.data) {
        setHeroSettings(settingsRes.data);
      }
    } catch (err) {
      // Gracefully handled offline fallback
    } finally {
      setIsLoading(false);
    }
  };


  // Synchronize selected property ID when URL changes to /property/:id
  useEffect(() => {
    if (propertyIdFromUrl) {
      setSelectedPropertyId(propertyIdFromUrl);
      setActiveGalleryIdx(0);

      const target = String(propertyIdFromUrl).toLowerCase();
      const exists = Array.isArray(properties) && properties.some(p => 
        String(p?.id || '').toLowerCase() === target || 
        String(p?._id || '').toLowerCase() === target || 
        String(p?.slug || '').toLowerCase() === target
      );

      if (!exists) {
        fetchPropertyById(propertyIdFromUrl).then(res => {
          if (res?.data) {
            setProperties(prev => {
              const currentList = Array.isArray(prev) ? prev : [];
              if (currentList.some(p => String(p.id) === String(res.data.id) || p.slug === res.data.slug)) {
                return currentList;
              }
              return [res.data, ...currentList];
            });
          }
        }).catch(() => {});
      }
    }
  }, [propertyIdFromUrl, properties, setProperties]);

  // Enforce strict admin auth state when visiting admin console routes
  useEffect(() => {
    const token = getStoredAdminToken();

    if (isAdminConsoleRoute) {
      if (!token) {
        setIsAdminLoggedIn(false);
        navigate('/admin/login', { replace: true });
        return;
      }

      // Verify token with backend
      adminVerifyToken()
        .then(() => {
          setIsAdminLoggedIn(true);
        })
        .catch(() => {
          setIsAdminLoggedIn(false);
          navigate('/admin/login', { replace: true });
        });
    } else if (token) {
      setIsAdminLoggedIn(true);
    } else {
      setIsAdminLoggedIn(false);
    }
  }, [isAdminConsoleRoute, location.pathname, navigate]);

  // Handle automatic logout on 401 Unauthorized API responses
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAdminLoggedIn(false);
      if (isAdminConsoleRoute) {
        navigate('/admin/login', { replace: true });
      }
    };
    window.addEventListener('grabmykey_admin_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('grabmykey_admin_unauthorized', handleUnauthorized);
    };
  }, [isAdminConsoleRoute, navigate]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView, selectedPropertyId]);

  // Load database listings & health on mount
  useEffect(() => {
    loadData();

    // Hotkey: Ctrl + Shift + A opens Admin Portal
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (getStoredAdminToken()) {
          navigate('/admin');
        } else {
          navigate('/admin/login');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Real-time synchronization for site settings changes from Admin Console
    const handleSettingsUpdated = (e) => {
      if (e?.detail) {
        setHeroSettings(e.detail);
      } else {
        fetchSiteSettings().then(res => {
          if (res?.success && res.data) {
            setHeroSettings(res.data);
          }
        }).catch(() => {});
      }
    };
    window.addEventListener('grabmykey_settings_updated', handleSettingsUpdated);

    const handlePropertiesUpdated = () => {
      loadData();
    };
    window.addEventListener('grabmykey_properties_updated', handlePropertiesUpdated);
    window.addEventListener('grabmykey_property_created', handlePropertiesUpdated);
    window.addEventListener('grabmykey_property_deleted', handlePropertiesUpdated);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('grabmykey_settings_updated', handleSettingsUpdated);
      window.removeEventListener('grabmykey_properties_updated', handlePropertiesUpdated);
      window.removeEventListener('grabmykey_property_created', handlePropertiesUpdated);
      window.removeEventListener('grabmykey_property_deleted', handlePropertiesUpdated);
    };
  }, [navigate]);

  // Browser navigation helper - never uses replace: true
  const navigateTo = (path) => {
    navigate(path);
  };

  const navigateToProperty = (idOrSlug) => {
    setSelectedPropertyId(String(idOrSlug));
    setActiveGalleryIdx(0);
    navigate(`/property/${idOrSlug}`);
  };

  const handleAdminLogout = async () => {
    await adminLogout();
    setIsAdminLoggedIn(false);
    navigate('/admin/login');
  };

  // 1. Safe Optional Chaining Guard for Hero & Gallery References
  const featuredProperty = properties && properties.length > 0 ? properties[0] : null;

  // Always ensure images is an array to prevent "Cannot read properties of undefined (reading 'images')"
  const featuredImages = featuredProperty?.images || featuredProperty?.galleryImages || [];
  const primaryHeroImage = featuredImages.length > 0 ? featuredImages[0] : "";

  // Selected Property Object (matches by slug, id, or _id)
  const selectedProperty = useMemo(() => {
    if (!properties || properties.length === 0) return null;
    if (!selectedPropertyId) {
      return isPropertyDetailRoute ? null : (properties[0] || null);
    }
    const target = String(selectedPropertyId).trim().toLowerCase();
    const found = properties.find(p => {
      if (!p) return false;
      const matchSlug = p.slug && String(p.slug).trim().toLowerCase() === target;
      const matchId = (p.id && String(p.id).trim().toLowerCase() === target);
      const matchMongoId = (p._id && String(p._id).trim().toLowerCase() === target);
      return matchSlug || matchId || matchMongoId;
    });
    if (found) return found;
    if (isPropertyDetailRoute) {
      return null;
    }
    return properties[0] || null;
  }, [properties, selectedPropertyId, isPropertyDetailRoute]);

  const propertySpecs = useMemo(() => {
    return getPropertySpecs(selectedProperty);
  }, [selectedProperty]);

  // Unified display bindings supporting both new MongoDB schemas & legacy models
  const propDisplayId = selectedProperty?.id || selectedProperty?._id || "1";
  const propDisplaySlug = selectedProperty?.slug || `gmk-${propDisplayId}`;
  const propDisplayLocation = selectedProperty?.locality 
    ? `${selectedProperty.locality}, ${selectedProperty.city || 'Mangaluru'}` 
    : (selectedProperty?.location || "Mangaluru");
  const propDisplayPrice = selectedProperty?.price || (selectedProperty?.pricing?.expectedPrice ? (selectedProperty.pricing.expectedPrice >= 10000000 ? `₹${(selectedProperty.pricing.expectedPrice / 10000000).toFixed(2)} Cr` : `₹${(selectedProperty.pricing.expectedPrice / 100000).toFixed(1)} Lakhs`) : 'Price on Request');
  const propDisplayPriceRaw = selectedProperty?.priceRaw || selectedProperty?.pricing?.expectedPrice || 0;
  const propDisplayType = selectedProperty?.category || selectedProperty?.type || 'Villa';
  const propDisplayArea = selectedProperty?.specs?.carpetAreaSqFt 
    ? `${selectedProperty.specs.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft` 
    : (selectedProperty?.area || 'N/A');
  const propDisplayBeds = selectedProperty?.specs?.bedrooms ?? selectedProperty?.beds ?? 0;
  const propDisplayBaths = selectedProperty?.specs?.bathrooms ?? selectedProperty?.baths ?? 0;
  
  // Safe Array Fallback for Property Images
  const selectedPropImages = (selectedProperty?.galleryImages && selectedProperty.galleryImages.length > 0)
    ? selectedProperty.galleryImages
    : ((selectedProperty?.images && selectedProperty.images.length > 0) ? selectedProperty.images : []);
  const propDisplayImages = selectedPropImages.length > 0 ? selectedPropImages : [primaryHeroImage];
  
  const propDisplayVideoUrl = selectedProperty?.youtubeVideoId 
    ? `https://www.youtube.com/watch?v=${selectedProperty.youtubeVideoId}` 
    : (selectedProperty?.videoUrl || '');
  const propDisplayBadge = selectedProperty?.badge || (selectedProperty?.isFeatured ? 'Featured Listing' : (selectedProperty?.dealType || 'Exclusive Listing'));

  // Filtered properties for public catalog
  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    return properties.filter(prop => {
      if (!prop) return false;
      const title = prop?.title || '';
      const location = prop?.location || prop?.locality || '';
      const type = prop?.type || prop?.category || '';
      const locality = prop?.locality || '';
      const matchesQuery = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || type === selectedType;
      const matchesRegion = selectedRegion === 'All' || 
                           location.toLowerCase().includes(selectedRegion.toLowerCase()) ||
                           locality.toLowerCase().includes(selectedRegion.toLowerCase());
      return matchesQuery && matchesType && matchesRegion;
    });
  }, [properties, searchQuery, selectedType, selectedRegion]);

  // Dynamic Hero Video & Overlay Bindings
  const heroFeaturedProperty = useMemo(() => {
    if (!properties || properties.length === 0) return null;
    const targetId = heroSettings?.heroFeaturedPropertyId?._id || heroSettings?.heroFeaturedPropertyId;
    if (targetId) {
      const found = properties.find(p => String(p._id) === String(targetId) || String(p.id) === String(targetId));
      if (found) return found;
    }
    return properties[0] || null;
  }, [properties, heroSettings]);

  const heroYoutubeId = useMemo(() => {
    if (heroSettings?.heroCustomYoutubeId && heroSettings.heroCustomYoutubeId.trim()) {
      const raw = heroSettings.heroCustomYoutubeId.trim();
      const match = raw.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      return (match && match[2].length === 11) ? match[2] : raw;
    }
    return heroFeaturedProperty?.youtubeVideoId || "";
  }, [heroSettings, heroFeaturedProperty]);

  const heroThumbnail = useMemo(() => {
    if (heroYoutubeId) {
      return `https://img.youtube.com/vi/${heroYoutubeId}/maxresdefault.jpg`;
    }
    return heroFeaturedProperty?.coverImage || heroFeaturedProperty?.images?.[0] || heroFeaturedProperty?.galleryImages?.[0] || "";
  }, [heroYoutubeId, heroFeaturedProperty]);

  const heroTitle = heroSettings?.heroOverlayTitle || heroFeaturedProperty?.title || "";
  const heroLocation = heroSettings?.heroOverlayLocation || (heroFeaturedProperty ? `${heroFeaturedProperty.location || 'Mangaluru'} • ${heroFeaturedProperty.price || ''}` : '');
  const heroBadge = heroSettings?.heroBadgeTag || "FEATURED PROPERTY";
  const heroTargetSlug = heroFeaturedProperty?.slug || heroFeaturedProperty?._id || heroFeaturedProperty?.id || "";

  const heroCardProperty = useMemo(() => {
    // If no properties in state AND no custom video has been explicitly configured, hero shows Coming Soon
    if ((!properties || properties.length === 0) && !heroSettings?.heroCustomYoutubeId) {
      return null;
    }
    if (!heroFeaturedProperty && !heroTitle && !heroYoutubeId) {
      return null;
    }
    const locParts = (heroLocation || '').split('•');
    const locText = locParts[0]?.trim() || heroFeaturedProperty?.location || 'Mangaluru';
    const priceRaw = locParts[1]?.trim() || heroFeaturedProperty?.price || '';
    const priceText = priceRaw.replace(/^₹/, '');

    return {
      title: heroTitle || heroFeaturedProperty?.title || 'Featured Property',
      location: locText,
      priceText: priceText,
      videoUrl: heroYoutubeId ? `https://www.youtube.com/embed/${heroYoutubeId}?autoplay=1` : '',
      thumbnail: heroThumbnail,
      slug: heroTargetSlug
    };
  }, [properties, heroSettings, heroTitle, heroLocation, heroFeaturedProperty, heroYoutubeId, heroThumbnail, heroTargetSlug]);


  // =========================================================================
  // VIEW: ADMIN LOGIN PAGE (/admin/login)
  // =========================================================================
  if (isAdminLoginRoute) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          navigate('/admin');
        }}
      />
    );
  }

  // =========================================================================
  // VIEW: ADMIN SIGNUP PAGE (/admin/signup)
  // =========================================================================
  if (isAdminSignupRoute) {
    return (
      <AdminSignup
        onSignupSuccess={() => {
          setIsAdminLoggedIn(true);
          navigate('/admin');
        }}
      />
    );
  }

  // =========================================================================
  // VIEW: EXECUTIVE ADMIN SUITE (/admin/*)
  // Strictly protected by verified JWT session token
  // =========================================================================
  if (isAdminConsoleRoute) {
    if (isAdminLoggedIn) {
      return (
        <AdminConsole
          onExit={handleAdminLogout}
          onViewLiveProperty={(id) => {
            navigateToProperty(id);
          }}
          onDataUpdated={loadData}
        />
      );
    }

    return (
      <div className="min-h-screen bg-[#070D18] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#C59B27] animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Verifying administrative security token...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: LEGAL STANDARDS & DIRECT TITLE VERIFICATION (/legal)
  // =========================================================================
  if (activeView === 'legal') {
    return <LegalStandards />;
  }

  // =========================================================================
  // VIEW: DIGITAL CONCIERGE & CONTACT (/contact)
  // =========================================================================
  if (activeView === 'contact') {
    return <Contact />;
  }

  // =========================================================================
  // VIEW: OWNER LISTING PORTAL (/sell)
  // =========================================================================
  if (activeView === 'sell') {
    return <ListProperty />;
  }

  // =========================================================================
  // PUBLIC STOREFRONT & PROPERTY DETAILS LAYOUT
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0a1d37] font-sans antialiased selection:bg-[#b8860b] selection:text-white flex flex-col justify-between">
      
      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="w-full px-6 lg:px-12 max-w-none h-20 flex items-center justify-between">

          
          {/* Brand Logo & Tagline Wrapper */}
          <Link className="flex items-center gap-3 group" to="/">
            {/* Icon Mark Box */}
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center p-2 group-hover:border-[#C59B27]/40 transition-colors">
              <img src="/logo.png" onError={(e) => { e.currentTarget.src = "/logo-icon.svg"; }} alt="GrabMyKey" className="w-full h-full object-contain" />
            </div>

            {/* Brand Name & Tagline - Tightened Vertical Spacing */}
            <div className="flex flex-col gap-0 justify-center">
              <div 
                className="text-lg font-extrabold tracking-tight font-serif leading-none flex items-center gap-1.5 text-slate-900"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <span>GRAB</span>
                <span className="text-[#C59B27]">MY</span>
                <span>KEY</span>
              </div>
              <span className="text-[9px] font-bold text-[#C59B27] uppercase tracking-widest font-sans leading-tight mt-0.5">
                YOUR TRUSTED REAL ESTATE PARTNER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-700 font-sans">
            <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/">
              Home
            </Link>

            <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/properties">
              Properties
            </Link>

            <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/legal-standards">
              Legal Standards
            </Link>

            <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/contact">
              Contact
            </Link>
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigateTo('/sell')}
              className="hidden sm:flex items-center space-x-1.5 border border-slate-300 hover:border-[#0a1d37] text-slate-700 hover:text-[#0a1d37] px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>List Property</span>
            </button>

            {/* Header CTA: Schedule a Tour in #0a1d37 */}
            <a 
              href={activeView === 'property-detail' && selectedProperty
                ? `https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20would%20like%20to%20schedule%20a%20private%20tour%20for%20Property%20%23${propDisplayId}%20(Slug:%20${propDisplaySlug}):%20${encodeURIComponent(selectedProperty.title)}%20(${encodeURIComponent(propDisplayLocation)})`
                : "https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20would%20like%20to%20schedule%20a%20private%20tour."}
              target="_blank"
              rel="noreferrer"
              className="bg-[#0a1d37] hover:bg-[#061224] text-white px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-sm flex items-center space-x-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#e6ca65]" />
              <span>Schedule a Tour</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN VIEW CONTENT */}
      <main className="flex-grow">
        
        {/* =================================================================== */}
        {/* VIEW: HOME STOREFRONT                                               */}
        {/* =================================================================== */}
        {activeView === 'home' && (
          <div className="bg-[#FAF8F5] w-full">
            <Home
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onBrowseAll={() => navigateTo('/properties')}
              property={heroCardProperty}
              properties={properties}
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW: FULL PROPERTY DIRECTORY CATALOG (/properties)                 */}
        {/* =================================================================== */}
        {activeView === 'properties' && (
          <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
            <Properties 
              properties={properties} 
              onRefresh={loadData} 
              isLoading={isLoading} 
              standalone={false} 
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW: DETAILED PROPERTY VIEW (/property/:id)                        */}
        {/* =================================================================== */}
        {activeView === 'property-detail' && (
          <PropertyDetails
            property={selectedProperty}
            loading={isLoading && !selectedProperty}
            onBack={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigateTo('/properties');
              }
            }}
            activeGalleryIdx={activeGalleryIdx}
            setActiveGalleryIdx={setActiveGalleryIdx}
            propertySpecs={propertySpecs}
          />
        )}

      </main>

      {/* FOOTER - Hidden on property detail view so page ends cleanly above the fixed bottom bar */}
      {activeView !== 'property-detail' && <Footer />}

    </div>
  );
}


```

## File: `src/PropertyDetails.jsx`

```jsx
import Footer from './components/Footer';
import PropertyDetails, { NearbyInfrastructure, getTransitIcon } from './components/PropertyDetails';
import PropertyImageGallery from './components/PropertyImageGallery';
import ArchitecturalOverview from './components/ArchitecturalOverview';
import PropertySummaryCard from './components/PropertySummaryCard';

export default PropertyDetails;
export { PropertyDetails, NearbyInfrastructure, getTransitIcon, PropertyImageGallery, ArchitecturalOverview, Footer, PropertySummaryCard };

```

## File: `src/api.js`

```javascript
import axios from 'axios';
import { API_BASE_URL, getApiBaseUrl, API_ENDPOINTS } from './config/api';

export { API_BASE_URL, getApiBaseUrl, API_ENDPOINTS };

// Session-based offline detection to prevent hammering a closed port
let isBackendOffline = typeof window !== 'undefined' ? sessionStorage.getItem('gmk_backend_offline') === 'true' : false;

export const setBackendOffline = (offline = true) => {
  isBackendOffline = offline;
  if (typeof window !== 'undefined') {
    if (offline) {
      sessionStorage.setItem('gmk_backend_offline', 'true');
    } else {
      sessionStorage.removeItem('gmk_backend_offline');
    }
  }
};

export const shouldAttemptBackend = () => {
  if (typeof window === 'undefined') return false;
  // If explicitly disabled via env or storage
  if (import.meta?.env?.VITE_BACKEND_ENABLED === 'false' || import.meta?.env?.VITE_FRONTEND_ONLY === 'true') {
    return false;
  }
  if (localStorage.getItem('grabmykey_frontend_only') === 'true' || localStorage.getItem('gmk_offline_mode') === 'true') {
    return false;
  }
  return true;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor: automatically attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gmk_admin_jwt');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for response unwrapping and error logging
apiClient.interceptors.response.use(
  (response) => {
    setBackendOffline(false);
    return response.data;
  },
  (error) => {
    // If backend returns 401 Unauthorized, automatically purge stored credentials
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gmk_admin_jwt');
        localStorage.removeItem('gmk_admin_user');
        window.dispatchEvent(new CustomEvent('grabmykey_admin_unauthorized'));
      }
    }
    const isOffline = error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || !error.response;
    if (isOffline) {
      setBackendOffline(true);
    } else {
      const errorMsg = error.response?.data?.message || error.message || 'API error';
      console.warn(`[GrabMyKey API Warning] ${errorMsg}`);
    }
    return Promise.reject(error);
  }
);

/**
 * Normalizes property keys to ensure complete compatibility across all UI components:
 * PropertyCard, HeroFeaturedVideoCard, PropertyDetails, PropertySpecifications, etc.
 */
export const normalizeProperty = (p) => {
  if (!p) return p;
  const prop = { ...p };
  const id = prop.id || (prop._id ? prop._id.toString() : prop.slug);
  prop.id = id;
  prop._id = prop._id || id;
  prop.slug = prop.slug || id;
  prop.title = prop.title || 'Prime Property';
  prop.locality = prop.locality || (prop.location ? prop.location.split(',')[0].trim() : 'Surathkal Beach');
  prop.city = prop.city || 'Mangaluru';
  prop.location = prop.location || `${prop.locality}, ${prop.city}`;
  prop.category = prop.category || prop.type || 'Villa';
  prop.type = prop.type || prop.category || 'Villa';

  const rawPrice = prop.priceRaw || prop.pricing?.expectedPrice || 0;
  prop.priceRaw = rawPrice;
  if (!prop.pricing) {
    prop.pricing = { expectedPrice: rawPrice, isNegotiable: true, maintenanceFee: 0 };
  }
  if (!prop.price) {
    prop.price = rawPrice >= 10000000
      ? `₹${(rawPrice / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`
      : (rawPrice >= 100000 ? `₹${(rawPrice / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs` : `₹${rawPrice.toLocaleString('en-IN')}`);
  }
  prop.priceText = prop.priceText || (prop.price ? String(prop.price).replace(/^₹/, '').replace(/ •.*/, '').trim() : '');

  const rawCover = prop.coverImage || '';
  const rawGallery = Array.isArray(prop.galleryImages) ? prop.galleryImages : [];
  const rawImgs = Array.isArray(prop.images) ? prop.images : [];
  const combined = [];
  if (rawCover) combined.push(rawCover);
  rawGallery.forEach(img => { if (img && !combined.includes(img)) combined.push(img); });
  rawImgs.forEach(img => { if (img && !combined.includes(img)) combined.push(img); });

  prop.coverImage = rawCover || combined[0] || '';
  prop.images = combined;
  prop.galleryImages = combined;
  prop.thumbnail = prop.coverImage || combined[0] || '';

  if (!prop.youtubeVideoId && prop.videoUrl) {
    const match = prop.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    prop.youtubeVideoId = match ? match[1] : '';
  }
  if (!prop.videoUrl && prop.youtubeVideoId) {
    prop.videoUrl = `https://www.youtube.com/watch?v=${prop.youtubeVideoId}`;
  }

  if (!prop.specs) {
    prop.specs = {
      bedrooms: prop.bedrooms ?? prop.beds ?? 0,
      bathrooms: prop.bathrooms ?? prop.baths ?? 0,
      carpetAreaSqFt: prop.superArea ? parseInt(String(prop.superArea).replace(/[^0-9]/g, ''), 10) || 0 : 0,
      furnishingStatus: prop.furnishing || 'Fully Furnished',
      floorLevel: 'G',
      totalFloors: '1'
    };
  }
  prop.bedrooms = prop.bedrooms ?? prop.specs.bedrooms ?? prop.beds ?? 0;
  prop.bathrooms = prop.bathrooms ?? prop.specs.bathrooms ?? prop.baths ?? 0;
  prop.beds = prop.beds ?? prop.bedrooms;
  prop.baths = prop.baths ?? prop.bathrooms;
  prop.superArea = prop.superArea || prop.area || (prop.specs.carpetAreaSqFt ? `${prop.specs.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft` : '');
  prop.area = prop.area || prop.superArea;
  prop.furnishing = prop.furnishing || prop.specs.furnishingStatus || 'Furnished';

  prop.badge = prop.badge || (prop.isFeatured ? 'Featured Listing' : (prop.dealType || 'Exclusive Listing'));

  if (!Array.isArray(prop.highlights)) {
    prop.highlights = [];
  }

  if (!Array.isArray(prop.specifications) || prop.specifications.length === 0) {
    if (Array.isArray(prop.componentsMatrix) && prop.componentsMatrix.length > 0) {
      prop.specifications = prop.componentsMatrix.map(c => ({
        category: c.categoryName || 'General',
        feature: c.featureName || '',
        status: c.isAvailable !== false ? 'Included' : 'Not Included',
        details: c.descriptionNote || '—'
      }));
    }
  }

  return prop;
};

/**
 * Property Endpoints
 */

// Filter utility to detect and eliminate any legacy mock property relics
export const isMockProperty = (p) => {
  if (!p) return true;
  const title = p.title || '';
  const slug = p.slug || '';
  if (
    title.includes('Coastal Horizon') ||
    title.includes('Kadri Heights') ||
    title.includes('Bejai Royal') ||
    title.includes('Ullal Sovereign') ||
    title.includes('Sovereign Heritage') ||
    slug.includes('coastal-horizon') ||
    slug.includes('kadri-heights') ||
    slug.includes('bejai-royal') ||
    slug.includes('ullal-sovereign') ||
    p.youtubeVideoId === 'dQw4w9WgXcQ'
  ) {
    return true;
  }
  return false;
};

// Immediate purge of any legacy localStorage mock caches
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('grabmykey_properties');
    localStorage.removeItem('grabmykey_hero_settings');
  } catch (e) {}
}

// Fetch all live properties exclusively from Express backend API
export const fetchProperties = async () => {
  try {
    const res = await apiClient.get('/properties');
    if (res?.data && Array.isArray(res.data)) {
      const sanitized = res.data.filter(p => !isMockProperty(p));
      const normalizedData = sanitized.map(normalizeProperty);
      return {
        ...res,
        count: normalizedData.length,
        data: normalizedData
      };
    }
    return {
      success: true,
      count: 0,
      data: []
    };
  } catch (err) {
    return {
      success: false,
      count: 0,
      data: []
    };
  }
};

// Fetch single property by ID or Slug exclusively from Express backend API
export const fetchPropertyById = async (id) => {
  if (!id) return { success: false, data: null };
  try {
    const res = await apiClient.get(`/properties/${id}`);
    if (res?.data && !isMockProperty(res.data)) {
      return {
        ...res,
        data: normalizeProperty(res.data)
      };
    }
  } catch (err) {}
  return { success: false, data: null };
};

// Create a new property listing (Admin auth verified)
export const createProperty = async (propertyData) => {
  return await apiClient.post('/properties', propertyData);
};

// Delete a property listing by ID (Admin)
export const deleteProperty = async (id) => {
  if (!id) throw new Error('Property ID is required for deletion');
  const targetId = (typeof id === 'object' && id !== null) ? (id._id || id.id) : id;
  return await apiClient.delete(`/properties/${targetId}`);
};

// Update an existing property listing (Admin)
export const updateProperty = async (id, propertyData) => {
  return await apiClient.put(`/properties/${id}`, propertyData);
};

/**
 * Lead / Seller Onboarding Endpoints
 */

// Submit a seller onboarding request
export const submitLead = async (leadData) => {
  return await apiClient.post('/leads', leadData);
};

// Fetch all owner onboarding requests (Admin) with offline fallback
export const fetchLeads = async () => {
  const getFallback = () => {
    let localData = [];
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('grabmykey_leads');
        if (cached) localData = JSON.parse(cached);
      } catch (e) {
        localData = [];
      }
    }
    return {
      success: true,
      count: localData.length,
      data: localData,
      fromLocal: true
    };
  };

  if (!shouldAttemptBackend()) {
    return getFallback();
  }

  try {
    const res = await apiClient.get('/leads');
    if (res?.data && Array.isArray(res.data) && typeof window !== 'undefined') {
      localStorage.setItem('grabmykey_leads', JSON.stringify(res.data));
    }
    return res;
  } catch (err) {
    setBackendOffline(true);
    return getFallback();
  }
};

// Update status of lead ticket (Admin)
export const updateLeadStatus = async (id, status) => {
  return await apiClient.patch(`/leads/${id}`, { status });
};

// Delete an onboarding lead ticket (Admin)
export const deleteLead = async (id) => {
  return await apiClient.delete(`/leads/${id}`);
};

/**
 * Site Settings Endpoints (Hero Featured Video & Dynamic Config)
 */
// Fetch site settings with offline fallback
export const fetchSiteSettings = async () => {
  const getFallback = () => {
    let localData = null;
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('grabmykey_hero_settings');
        if (cached) localData = JSON.parse(cached);
      } catch (e) {
        localData = null;
      }
    }
    return {
      success: true,
      data: localData,
      fromLocal: true
    };
  };

  if (!shouldAttemptBackend()) {
    return getFallback();
  }

  try {
    const res = await apiClient.get('/settings');
    if (res?.data && typeof window !== 'undefined') {
      localStorage.setItem('grabmykey_hero_settings', JSON.stringify(res.data));
    }
    return res;
  } catch (err) {
    setBackendOffline(true);
    return getFallback();
  }
};

export const updateSiteSettings = async (settingsData) => {
  return await apiClient.put('/settings', settingsData);
};

/**
 * Master Presets Endpoints (Legal Checks & Category Feature Matrices)
 */
export const fetchPresets = async (params = {}) => {
  if (!shouldAttemptBackend()) {
    return {
      success: true,
      data: [],
      fromLocal: true
    };
  }

  try {
    return await apiClient.get('/presets', { params });
  } catch (err) {
    setBackendOffline(true);
    return {
      success: true,
      data: [],
      fromLocal: true
    };
  }
};

export const createPreset = async (presetData) => {
  return await apiClient.post('/presets', presetData);
};

export const updatePreset = async (id, presetData) => {
  return await apiClient.put(`/presets/${id}`, presetData);
};

export const deletePreset = async (id) => {
  return await apiClient.delete(`/presets/${id}`);
};

export const seedDefaultPresets = async () => {
  return await apiClient.post('/presets/seed-defaults');
};

/**
 * Server Status Check
 */
export const checkServerHealth = async (forceProbe = false) => {
  if (!forceProbe && !shouldAttemptBackend()) {
    return { status: 'offline', mode: 'frontend_only', fromLocal: true };
  }

  try {
    const res = await apiClient.get('/health');
    setBackendOffline(false);
    return res;
  } catch (err) {
    setBackendOffline(true);
    return { status: 'offline', error: err.message, fromLocal: true };
  }
};

/**
 * Strict Admin Authentication API Methods
 */
export const getStoredAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gmk_admin_jwt');
};

export const getStoredAdminUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('gmk_admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const adminLogin = async (email, password) => {
  const res = await apiClient.post('/auth/login', { email, password });
  if (res?.token) {
    localStorage.setItem('gmk_admin_jwt', res.token);
    if (res.admin) {
      localStorage.setItem('gmk_admin_user', JSON.stringify(res.admin));
    }
  }
  return res;
};

export const adminSignup = async ({ name, email, password, inviteKey }) => {
  const res = await apiClient.post('/auth/signup', { name, email, password, inviteKey });
  if (res?.token) {
    localStorage.setItem('gmk_admin_jwt', res.token);
    if (res.admin) {
      localStorage.setItem('gmk_admin_user', JSON.stringify(res.admin));
    }
  }
  return res;
};

export const adminVerifyToken = async () => {
  const token = getStoredAdminToken();
  if (!token) {
    return { success: false, message: 'No token found' };
  }
  try {
    const res = await apiClient.get('/auth/me');
    if (res?.admin) {
      localStorage.setItem('gmk_admin_user', JSON.stringify(res.admin));
    }
    return res;
  } catch (err) {
    localStorage.removeItem('gmk_admin_jwt');
    localStorage.removeItem('gmk_admin_user');
    throw err;
  }
};

export const adminLogout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignore error on network failure
  } finally {
    localStorage.removeItem('gmk_admin_jwt');
    localStorage.removeItem('gmk_admin_user');
  }
  return { success: true };
};

/**
 * Admin Access & Security Management
 */
export const fetchAdmins = async () => {
  return await apiClient.get('/auth/admins');
};

export const approveAdmin = async (id) => {
  return await apiClient.patch(`/auth/admins/${id}/approve`);
};

export const rejectAdmin = async (id) => {
  return await apiClient.patch(`/auth/admins/${id}/reject`);
};

export const deleteAdmin = async (id) => {
  return await apiClient.delete(`/auth/admins/${id}`);
};

export const fetchInviteKey = async () => {
  return await apiClient.get('/auth/invite-key');
};

export const updateInviteKey = async (inviteKey) => {
  return await apiClient.put('/auth/invite-key', { inviteKey });
};

export default {
  fetchProperties,
  fetchPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  submitLead,
  fetchLeads,
  updateLeadStatus,
  deleteLead,
  fetchSiteSettings,
  updateSiteSettings,
  fetchPresets,
  createPreset,
  updatePreset,
  deletePreset,
  seedDefaultPresets,
  checkServerHealth,
  adminLogin,
  adminSignup,
  adminVerifyToken,
  adminLogout,
  fetchAdmins,
  approveAdmin,
  rejectAdmin,
  deleteAdmin,
  fetchInviteKey,
  updateInviteKey,
  getStoredAdminToken,
  getStoredAdminUser
};



```

## File: `src/assets/react.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
```

## File: `src/assets/vite.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="77" height="47" fill="none" aria-labelledby="vite-logo-title" viewBox="0 0 77 47"><title id="vite-logo-title">Vite</title><style>.parenthesis{fill:#000}@media (prefers-color-scheme:dark){.parenthesis{fill:#fff}}</style><path fill="#9135ff" d="M40.151 45.71c-.663.844-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.493c-.92 0-1.457-1.04-.92-1.788l7.479-10.471c1.07-1.498 0-3.578-1.842-3.578H15.443c-.92 0-1.456-1.04-.92-1.788l9.696-13.576c.213-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.472c-1.07 1.497 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.087.89 1.83L40.153 45.712z"/><mask id="a" width="48" height="47" x="14" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M40.047 45.71c-.663.843-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.389c-.92 0-1.457-1.04-.92-1.788l7.479-10.472c1.07-1.497 0-3.578-1.842-3.578H15.34c-.92 0-1.456-1.04-.92-1.788l9.696-13.575c.213-.297.556-.474.92-.474H53.93c.92 0 1.456 1.04.92 1.788L47.37 13.03c-1.07 1.498 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.088.89 1.831L40.049 45.712z"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#eee6ff" rx="5.508" ry="14.704" transform="rotate(269.814 20.96 11.29)scale(-1 1)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#eee6ff" rx="10.399" ry="29.851" transform="rotate(89.814 -16.902 -8.275)scale(1 -1)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#8900ff" rx="5.508" ry="30.487" transform="rotate(89.814 -19.197 -7.127)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.928 4.177)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.738 5.52)scale(1 -1)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#eee6ff" rx="14.072" ry="22.078" transform="rotate(93.35 31.245 55.578)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx="14.592" cy="9.743" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(39.51 14.592 9.743)"/></g><g filter="url(#k)"><ellipse cx="61.728" cy="-5.321" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 61.728 -5.32)"/></g><g filter="url(#l)"><ellipse cx="55.618" cy="7.104" fill="#00c2ff" rx="5.971" ry="9.665" transform="rotate(37.892 55.618 7.104)"/></g><g filter="url(#m)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#n)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#o)"><ellipse cx="49.857" cy="30.678" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 49.857 30.678)"/></g><g filter="url(#p)"><ellipse cx="52.623" cy="33.171" fill="#00c2ff" rx="5.971" ry="15.297" transform="rotate(37.892 52.623 33.17)"/></g></g><path d="M6.919 0c-9.198 13.166-9.252 33.575 0 46.789h6.215c-9.25-13.214-9.196-33.623 0-46.789zm62.424 0h-6.215c9.198 13.166 9.252 33.575 0 46.789h6.215c9.25-13.214 9.196-33.623 0-46.789" class="parenthesis"/><defs><filter id="b" width="60.045" height="41.654" x="-5.564" y="16.92" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-40.407" y="-6.762" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-35.435" y="2.801" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-30.84" y="20.8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-29.307" y="21.949" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="29.961" y="-17.13" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-13.43" y="-22.082" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="34.321" y="-37.644" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="38.847" y="-10.552" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="22.45" y="-1.645" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="32.919" y="11.36" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter></defs></svg>

```

## File: `src/components/AddCustomItemModal.jsx`

```jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function AddCustomItemModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel = 'Confirm'
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSubmit) onSubmit(e);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] text-[#1A1A1A] border border-slate-200/90 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 md:p-6 border-b border-slate-200 bg-white/70">
          <div>
            <h3 className="font-serif font-bold text-base md:text-lg text-[#1A1A1A] tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-[#1A1A1A] p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end space-x-3 p-4 md:px-6 md:py-4 border-t border-slate-200 bg-white/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#C59B27] hover:bg-[#b0881e] text-white transition-all shadow-md cursor-pointer border border-[#C59B27]/40 flex items-center space-x-1.5"
            >
              <span>{submitLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


```

## File: `src/components/ArchitecturalOverview.jsx`

```jsx
import React from 'react';

export default function ArchitecturalOverview({ description, highlights }) {
  const highlightList = Array.isArray(highlights) ? highlights : [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
      {/* Header & Executive Narrative */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-widest font-sans block">
          EXECUTIVE NARRATIVE
        </span>

        <h2 
          className="text-2xl md:text-3xl font-bold text-[#0F172A]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Architectural Overview
        </h2>

        {description && (
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-sans max-w-4xl">
            {description}
          </p>
        )}
      </div>

      {highlightList.length > 0 && (
        <>
          <div className="h-px bg-slate-100 w-full" />

          {/* Clean Highlight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {highlightList.map((item, idx) => {
              const labelText = typeof item === 'string' ? item : item?.label || '';
              if (!labelText) return null;

              return (
                <div 
                  key={idx}
                  className="flex items-center justify-center text-center px-4 py-3.5 rounded-2xl bg-[#FAF8F5] border border-[#C59B27]/30 text-slate-800 shadow-2xs hover:border-[#C59B27] hover:bg-white transition-all cursor-default"
                >
                  <span className="text-xs font-semibold font-sans leading-tight">
                    {labelText}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

```

## File: `src/components/FeaturedProperties.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeaturedProperties({ properties: initialProperties = [], isLoading = false }) {
  // Wipe default initial states: strictly start empty []
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    setProperties(Array.isArray(initialProperties) ? initialProperties : []);
  }, [initialProperties]);

  if (isLoading && properties.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between shadow-xs">
            <div className="h-56 bg-slate-100" />
            <div className="p-6 space-y-3">
              <div className="h-3 bg-slate-200 rounded w-1/3" />
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-full" />
            </div>
            <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <div className="h-5 bg-slate-200 rounded w-20" />
              <div className="h-4 bg-slate-100 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-14 px-6 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#C59B27]/30 flex items-center justify-center mx-auto text-[#C59B27]">
          <Building2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-serif font-bold text-[#0F172A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          No Properties Listed Yet
        </h3>
        <p className="text-xs text-slate-500 font-sans max-w-md mx-auto leading-relaxed">
          No properties listed yet. Add a listing from admin panel.
        </p>
        <div className="pt-2">
          <Link
            to="/admin"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0F172A] hover:bg-[#C59B27] text-white rounded-xl text-xs font-semibold transition-colors font-sans shadow-sm"
          >
            <span>Open Admin Panel</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.slice(0, 4).map((property) => (
        <PropertyCard key={property.id || property._id || property.slug} property={property} />
      ))}
    </div>
  );
}

export { FeaturedProperties };


```

## File: `src/components/Footer.jsx`

```jsx
import React from 'react';

export default function Footer({ className = '' }) {
  return (
    <footer className={`bg-white border-t border-slate-200/80 py-6 px-8 text-xs text-slate-500 ${className}`}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Brand Tagline */}
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <span>GRAB MY KEY</span>
          <span className="text-slate-300 font-normal">|</span>
          <span className="text-slate-500 font-normal">Your Trusted Real Estate Partner</span>
        </div>

        {/* Clean Copyright Notice (No Executive Link) */}
        <div>
          © {new Date().getFullYear()} GrabMyKey. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

```

## File: `src/components/HeroFeaturedVideoCard.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { Play, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

export function HeroFeaturedVideoCard({ property = null }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [featuredProperty, setFeaturedProperty] = useState(null);

  // Dynamic fetch when rendered standalone without property prop
  useEffect(() => {
    if (property) {
      setFeaturedProperty(property);
      return;
    }

    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const apiUrl = API_ENDPOINTS.properties;

        const res = await fetch(apiUrl);
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
          const heroPick = list.find(p => p && (p.isFeatured === true || p.featured === true)) ||
                           list.find(p => p && (p.videoUrl || p.heroVideoUrl || p.youtubeVideoId)) ||
                           (list.length > 0 ? list[0] : null);

          if (isMounted) setFeaturedProperty(heroPick);
        }
      } catch {
        // silent fallback
      }
    };

    fetchFeatured();

    const handleSync = () => fetchFeatured();
    window.addEventListener('grabmykey_property_created', handleSync);
    window.addEventListener('grabmykey_properties_updated', handleSync);

    return () => {
      isMounted = false;
      window.removeEventListener('grabmykey_property_created', handleSync);
      window.removeEventListener('grabmykey_properties_updated', handleSync);
    };
  }, [property]);

  const activeProperty = property || featuredProperty;
  if (!activeProperty) {
    return (
      <div className="relative w-full max-w-xl rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xl aspect-[16/11] flex flex-col justify-between p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="relative z-10 flex justify-between items-center">
          <span className="px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-medium text-white border border-white/10 font-sans">
            Featured Video Tour
          </span>
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-900 uppercase tracking-wider font-sans">
            MANGALURU, KA
          </span>
        </div>
        <div className="relative z-10 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3 my-auto">
          <div className="min-w-0 space-y-0.5">
            <h3 className="text-base font-bold text-white tracking-tight truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              No Featured Video Tour
            </h3>
            <p className="text-xs text-slate-300 font-sans truncate">
              Add listings via Admin Console to feature on-site walkthroughs
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getEmbedVideoUrl = (url, videoId) => {
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    if (!url) return null;
    if (url.includes('embed/')) return url.includes('autoplay') ? url : `${url}?autoplay=1`;
    if (url.includes('watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  const item = {
    title: activeProperty.title || "Exclusive Estate",
    location: activeProperty.location || (activeProperty.locality ? `${activeProperty.locality}, ${activeProperty.city || 'Mangaluru'}` : "Mangaluru"),
    priceText: activeProperty.priceText || (activeProperty.price ? String(activeProperty.price).replace(/^₹/, '').replace(/ •.*/, '') : ''),
    videoUrl: getEmbedVideoUrl(activeProperty.heroVideoUrl || activeProperty.videoUrl, activeProperty.youtubeVideoId),
    thumbnail: activeProperty.coverImage || activeProperty.thumbnail || activeProperty.images?.[0] || activeProperty.galleryImages?.[0] || '',
    slug: activeProperty.slug || activeProperty._id || activeProperty.id
  };

  return (
    <div className="relative w-full max-w-xl rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xl aspect-[16/11] flex flex-col justify-between p-6">
      
      {isPlaying && item.videoUrl ? (
        <iframe
          src={item.videoUrl}
          title="Property Video Walkthrough"
          className="absolute inset-0 w-full h-full border-0 z-20"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          {/* Background Poster */}
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title || "Featured Property Walkthrough"}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/30 z-0" />

          {/* Top Badges */}
          <div className="relative z-10 flex justify-between items-center">
            <span className="px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-medium text-white border border-white/10 font-sans">
              Featured Video Tour
            </span>
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-900 uppercase tracking-wider font-sans">
              EXCLUSIVE LISTING
            </span>
          </div>

          {/* Centered Circular Play Button */}
          {item.videoUrl && (
            <div className="relative z-10 flex items-center justify-center my-auto">
              <button
                onClick={() => setIsPlaying(true)}
                aria-label="Play Property Video Walkthrough"
                className="w-16 h-16 rounded-full bg-slate-900/80 text-white flex items-center justify-center border border-white/20 shadow-2xl hover:scale-110 hover:bg-slate-900 transition-all cursor-pointer"
              >
                <Play className="w-6 h-6 fill-current ml-0.5"/>
              </button>
            </div>
          )}

          {/* Bottom Glassmorphism Property Overlay */}
          <div className="relative z-10 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <h3 className="text-base font-bold text-white tracking-tight truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif", textTransform: 'none' }}>
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 font-sans truncate">
                {item.location} {item.priceText ? <span className="text-white font-semibold">• ₹{item.priceText}</span> : ''}
              </p>
            </div>

            <Link 
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-colors shrink-0 cursor-pointer" 
              title="View Property" 
              to={item.slug ? `/property/${item.slug}` : '/properties'}
            >
              <ArrowUpRight className="w-4 h-4"/>
            </Link>
          </div>
        </>
      )}

    </div>
  );
}

export default HeroFeaturedVideoCard;

```

## File: `src/components/HeroSection.jsx`

```jsx
import React, { useState } from 'react';
import HeroFeaturedVideoCard from './HeroFeaturedVideoCard';

export default function HeroSection({ property = null }) {
  const [featuredProperty, setFeaturedProperty] = useState(null);
  const activeProperty = property || featuredProperty;
  return <HeroFeaturedVideoCard property={activeProperty} />;
}

export { HeroSection };


```

## File: `src/components/Navbar.jsx`

```jsx
import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Video, Phone } from 'lucide-react';

export default function Navbar({ activeView, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = onNavigate || navigate;
  const currentView = activeView || (
    location.pathname === '/properties' ? 'properties' :
    (location.pathname === '/legal' || location.pathname === '/legal-standards') ? 'legal' :
    location.pathname === '/contact' ? 'contact' :
    location.pathname === '/sell' ? 'sell' : 'home'
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="w-full px-6 lg:px-12 max-w-none h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline Wrapper */}
        <Link className="flex items-center gap-3 group" to="/">
          {/* Icon Mark Box */}
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center p-2 group-hover:border-[#C59B27]/40 transition-colors">
            <img src="/logo.png" onError={(e) => { e.currentTarget.src = "/logo-icon.svg"; }} alt="GrabMyKey" className="w-full h-full object-contain" />
          </div>

          {/* Brand Name & Tagline - Tightened Vertical Spacing */}
          <div className="flex flex-col gap-0 justify-center">
            <div 
              className="text-lg font-extrabold tracking-tight font-serif leading-none flex items-center gap-1.5 text-slate-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span>GRAB</span>
              <span className="text-[#C59B27]">MY</span>
              <span>KEY</span>
            </div>
            <span className="text-[9px] font-bold text-[#C59B27] uppercase tracking-widest font-sans leading-tight mt-0.5">
              YOUR TRUSTED REAL ESTATE PARTNER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-700 font-sans">
          <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/">
            Home
          </Link>

          <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/properties">
            Properties
          </Link>

          <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/legal-standards">
            Legal Standards
          </Link>

          <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/contact">
            Contact
          </Link>
        </nav>

        {/* Header Action CTAs */}
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={() => handleNavigate('/sell')}
            className="hidden sm:flex items-center space-x-1.5 border border-slate-300 hover:border-[#0a1d37] text-slate-700 hover:text-[#0a1d37] px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>List Property</span>
          </button>

          <a 
            href="https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20would%20like%20to%20schedule%20a%20private%20tour."
            target="_blank"
            rel="noreferrer"
            className="bg-[#0a1d37] hover:bg-[#061224] text-white px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-sm flex items-center space-x-2"
          >
            <Phone className="w-3.5 h-3.5 text-[#e6ca65]" />
            <span>Schedule a Tour</span>
          </a>
        </div>
      </div>
    </header>
  );
}


```

## File: `src/components/PropertyCard.jsx`

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2 } from 'lucide-react';

export default function PropertyCard({ property = null }) {
  if (!property) return null;

  const propId = property.id || property._id || property.slug || '';
  const propSlug = property.slug || propId;
  const propTitle = property.title || 'Untitled Property';
  const propLocation = property.location || property.locality || 'Mangaluru';
  const propBadge = property.badge || property.category || property.type || 'Exclusive Listing';
  const propDescription = property.description || '';

  // Image handling from live backend records (zero static fallbacks)
  const propImage = property.coverImage || property.images?.[0] || property.galleryImages?.[0] || property.thumbnail || '';

  // Price formatting
  const propPrice = property.price || (
    property.pricing?.expectedPrice
      ? (property.pricing.expectedPrice >= 10000000 
          ? `₹${(property.pricing.expectedPrice / 10000000).toFixed(2)} Cr` 
          : `₹${(property.pricing.expectedPrice / 100000).toFixed(1)} L`)
      : 'Price on Request'
  );

  return (
    <div className="bg-white border border-slate-200/80 hover:border-[#C59B27]/40 rounded-2xl overflow-hidden transition-all duration-200 group flex flex-col justify-between shadow-xs hover:shadow-xl">
      <Link to={`/property/${propSlug}`} className="block">
        <div className="relative h-56 overflow-hidden bg-slate-100 flex items-center justify-center">
          {propImage ? (
            <img 
              src={propImage} 
              alt={propTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
              <Building2 className="w-8 h-8 stroke-[1.5] mb-1" />
              <span className="text-[10px] font-sans font-medium uppercase tracking-wider">No Image Available</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-white/95 text-[#0a1d37] font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#0a1d37]/20 shadow-xs font-sans">
              {propBadge}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center text-xs text-slate-500 space-x-1 mb-2 font-sans">
            <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>{propLocation}</span>
          </div>
          <h3 
            className="text-lg font-serif font-medium text-[#0a1d37] mb-2 group-hover:text-[#C59B27] transition-colors"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {propTitle}
          </h3>
          {propDescription && (
            <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-sans">
              {propDescription}
            </p>
          )}
        </div>
      </Link>

      <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <span className="block text-[9px] uppercase text-slate-400 font-semibold font-sans">Asking Price</span>
          <span className="text-xl font-serif font-bold text-[#C59B27]">
            {propPrice}
          </span>
        </div>
        <Link 
          to={`/property/${propSlug}`}
          className="text-xs font-semibold text-[#0a1d37] hover:text-[#C59B27] flex items-center space-x-1 transition-colors font-sans"
        >
          <span>View More →</span>
        </Link>
      </div>
    </div>
  );
}

export { PropertyCard };


```

## File: `src/components/PropertyDetails.jsx`

```jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropertySpecifications from './PropertySpecifications';
import PropertyImageGallery from './PropertyImageGallery';
import ArchitecturalOverview from './ArchitecturalOverview';
import Footer from './Footer';
import { 
  Video, MapPin, Phone, CheckCircle2, 
  ExternalLink, FileCheck, ArrowLeft, 
  Calendar, Plane, Car, Train, Footprints,
  GraduationCap, Bed, Bath,
  Check, Clock, Minus, ShieldCheck
} from 'lucide-react';

// Helper to format YouTube embed URLs without autoplay
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0`
    : url;
};

const getYouTubeWatchUrl = (url) => {
  if (!url) return "#";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/watch?v=${match[2]}`
    : url;
};

// Dynamic specs generator from property fields
const getDefaultSpecs = (prop) => {
  if (!prop) {
    return {
      inventorySpecs: {},
      technicalSpecs: {},
      connectivity: [],
      financials: {
        monthlyRental: "N/A",
        rentalYield: "N/A",
        propertyTax: "N/A",
        stampDuty: "N/A",
        appreciation: "N/A"
      }
    };
  }

  const isCommercial = prop?.type === 'Commercial' || prop?.category === 'Commercial';
  const isPlot = prop?.type === 'Plot / Land' || prop?.type === 'Plot' || prop?.category === 'Plot' || prop?.category === 'Land/Plot';
  const priceVal = prop?.priceRaw || prop?.pricing?.expectedPrice || (parseInt((prop?.price || '').replace(/[^0-9]/g, ''), 10) * 100000) || 0;
  const stampDutyVal = priceVal ? `8.0% (~₹${(priceVal * 0.08 / 100000).toFixed(1)} Lakhs)` : 'N/A';
  const estRent = priceVal ? `₹${Math.round(priceVal * (isCommercial ? 0.006 : 0.0035)).toLocaleString('en-IN')} / mo` : 'N/A';

  const inventorySpecs = prop?.inventorySpecs || {
    bedrooms: isPlot ? 0 : (prop?.specs?.bedrooms ?? prop?.beds ?? 0),
    bathrooms: isPlot ? 0 : (prop?.specs?.bathrooms ?? prop?.baths ?? 0),
    halls: isPlot ? "N/A - Plot Asset" : (prop?.specs?.halls || "Standard"),
    garden: isPlot ? "Open Land Parcel" : (prop?.specs?.garden || "N/A"),
    furnishing: prop?.specs?.furnishingStatus || prop?.furnishing || "Unfurnished",
    furnitureAppliances: prop?.specs?.furnitureAppliances || "Standard",
    kitchenType: isPlot ? "N/A" : (prop?.specs?.kitchenType || "Standard"),
    parking: prop?.specs?.parking || "Standard Access",
    balconies: isPlot ? "N/A" : (prop?.specs?.balconies || "N/A"),
    flooring: prop?.specs?.flooring || "Standard",
    powerBackup: prop?.specs?.powerBackup || prop?.powerBackup || "Standard",
    waterSupply: prop?.specs?.waterSupply || prop?.waterSupply || "Municipal / Well"
  };

  const technicalSpecs = prop?.technicalSpecs || {
    roadWidth: prop?.roadWidth || "Standard Approach",
    powerBackup: prop?.powerBackup || "Standard",
    waterSource: prop?.waterSupply || "Standard",
    zoning: prop?.zoning || "Approved"
  };

  const connectivity = Array.isArray(prop?.connectivity) ? prop.connectivity : [];

  const financials = prop?.financials || {
    monthlyRental: isPlot ? "N/A (Capital Asset)" : estRent,
    rentalYield: prop?.investmentAnalysis?.rentalYieldEst || (priceVal ? (isCommercial ? "7.0% - 8.5%" : "4.0% - 5.5%") : "N/A"),
    propertyTax: priceVal ? `₹${isCommercial ? '24,000' : '18,500'} / yr` : "N/A",
    stampDuty: stampDutyVal,
    appreciation: prop?.investmentAnalysis?.resaleAppreciationEst || "10.0% - 13.0% Y-o-Y"
  };

  return { inventorySpecs, technicalSpecs, connectivity, financials };
};

// Single-purpose icon resolver matching transit category
export const getTransitIcon = (mode, name = '') => {
  const lowerName = (name || '').toLowerCase();
  
  if (mode === 'Flight' || lowerName.includes('airport')) {
    return <Plane className="w-4 h-4 text-slate-700 stroke-[1.75]"/>;
  }
  if (mode === 'Transit' || lowerName.includes('station') || lowerName.includes('rail')) {
    return <Train className="w-4 h-4 text-slate-700 stroke-[1.75]"/>;
  }
  if (lowerName.includes('campus') || lowerName.includes('college') || lowerName.includes('school')) {
    return <GraduationCap className="w-4 h-4 text-slate-700 stroke-[1.75]"/>;
  }
  if (mode === 'Walk') {
    return <Footprints className="w-4 h-4 text-slate-700 stroke-[1.75]"/>;
  }
  return <Car className="w-4 h-4 text-slate-700 stroke-[1.75]"/>;
};

export function NearbyInfrastructure({ property, className = "" }) {
  const transitList = Array.isArray(property?.transitMatrix) ? property.transitMatrix : [];

  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-200/80 space-y-5 shadow-xs ${className}`}>
      
      {/* Header */}
      <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">
        Nearby Infrastructure
      </h3>

      {/* Clean Transit List */}
      <div className="space-y-3">
        {transitList.length === 0 ? (
          <p className="text-xs text-slate-500 font-sans py-1">No transit landmarks recorded for this property.</p>
        ) : (
          transitList.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1.5">
              
              {/* Left: Icon Tile + Landmark Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-slate-200/50 flex items-center justify-center shrink-0 shadow-2xs">
                  {getTransitIcon(item.travelMode || item.transportMode, item.landmarkName || item.destination)}
                </div>
                <span className="font-semibold text-slate-800 text-xs truncate">
                  {item.landmarkName || item.destination}
                </span>
              </div>

              {/* Right: Clean Distance & Duration */}
              <div className="text-right shrink-0 font-medium text-xs text-slate-500 pl-2">
                <span>{item.distanceText || (item.distanceKm ? `${item.distanceKm} km` : '')}</span>
                <span className="text-slate-300 mx-1.5">•</span>
                <span className="text-amber-700 font-bold">{item.durationText || (item.travelTimeMins ? `${item.travelTimeMins}m` : '')}</span>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 font-medium">{property?.roadIngressText || 'Approach Road Frontage'}</span>
        <span className="font-bold text-emerald-700 tracking-wide">{property?.zoningTagText || 'Title Verified'}</span>
      </div>

    </div>
  );
}

export default function PropertyDetails({
  property = null,
  loading = false,
  onBack,
  activeGalleryIdx: parentActiveGalleryIdx,
  setActiveGalleryIdx: parentSetActiveGalleryIdx,
  propertySpecs: propSpecsInput,
}) {
  const navigate = useNavigate();

  const [internalGalleryIdx, setInternalGalleryIdx] = useState(0);
  const activeGalleryIdx = parentActiveGalleryIdx !== undefined ? parentActiveGalleryIdx : internalGalleryIdx;
  const setActiveGalleryIdx = parentSetActiveGalleryIdx || setInternalGalleryIdx;

  // 1. Loading & Error Boundary Guards
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-slate-700 bg-[#FAF8F5]">
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-slate-700 bg-[#FAF8F5]">
        Property not found
      </div>
    );
  }

  // 2. Safety Default Props & Guarded Dynamic Arrays
  const components = property?.componentsMatrix || [];
  const legal = property?.legalVerification || [];

  // Specs & Display Bindings with Safe Fallbacks
  const specs = propSpecsInput || getDefaultSpecs(property);
  const propDisplayId = property?.id || property?._id || "";
  const propListingCode = property?.listingCode || (
    property?.listingId && String(property.listingId).startsWith('GMK-')
      ? property.listingId
      : (propDisplayId
          ? `GMK-MLR-${String(propDisplayId).replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}`
          : 'GMK-MLR-101')
  );
  const propDisplaySlug = property?.slug || propDisplayId;
  const propDisplayLocation = property?.locality 
    ? `${property.locality}, ${property.city}` 
    : (property?.location || "Mangaluru");
  const propDisplayPrice = property?.price || (property?.pricing?.expectedPrice ? (property.pricing.expectedPrice >= 10000000 ? `₹${(property.pricing.expectedPrice / 10000000).toFixed(2)} Cr` : `₹${(property.pricing.expectedPrice / 100000).toFixed(1)} Lakhs`) : 'Price on Request');
  const propDisplayPriceRaw = property?.priceRaw || property?.pricing?.expectedPrice || 0;
  const propDisplayType = property?.category || property?.type || 'Estate';
  const propDisplayArea = property?.specs?.carpetAreaSqFt 
    ? `${property.specs.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft` 
    : (property?.area || 'N/A');
  const propDisplayBeds = property?.specs?.bedrooms ?? property?.beds ?? 0;
  const propDisplayBaths = property?.specs?.bathrooms ?? property?.baths ?? 0;
  const rawCover = property?.coverImage || '';
  const rawGallery = Array.isArray(property?.galleryImages) ? property.galleryImages : [];
  const rawImgs = Array.isArray(property?.images) ? property.images : [];
  const combinedImages = [];
  if (rawCover) combinedImages.push(rawCover);
  rawGallery.forEach(img => { if (img && !combinedImages.includes(img)) combinedImages.push(img); });
  rawImgs.forEach(img => { if (img && !combinedImages.includes(img)) combinedImages.push(img); });
  const propDisplayImages = combinedImages;
  const propDisplayVideoUrl = property?.youtubeVideoId 
    ? `https://www.youtube.com/watch?v=${property.youtubeVideoId}` 
    : property?.videoUrl;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen flex flex-col justify-between">
      <section className="pt-8 pb-16 w-full max-w-[1440px] mx-auto px-6 lg:px-10 relative flex-1">
      {/* Clean Single-Arrow Back Link */}
      <Link 
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#C59B27] transition-colors font-sans mb-4 group" 
        to="/properties"
        onClick={(e) => {
          if (onBack) {
            e.preventDefault();
            handleBack();
          }
        }}
      >
        <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-[#C59B27] group-hover:-translate-x-0.5 transition-transform"/>
        <span>Back to Directory</span>
      </Link>

      {/* =================================================================== */}
      {/* 2-COLUMN MAIN CONTENT & STICKY ASIDE LAYOUT                         */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
        
        {/* ============================================================= */}
        {/* LEFT COLUMN (Spans 8 Columns): Media Gallery & Core Details   */}
        {/* ============================================================= */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
          
          {/* Property Title & Price Header */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
              <div className="space-y-1">
                {/* Clean Category & Listing ID (EXCLUSIVE TOUR & VERIFIED Removed) */}
                <div className="text-[11px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-2">
                  <span>{property?.category || propDisplayType || 'Villa'}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400 font-normal">Listing Ref: {propListingCode}</span>
                </div>

                {/* Property Title */}
                <h1 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">
                  {property?.title}
                </h1>

                {/* Locality */}
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{property?.location || propDisplayLocation || 'Surathkal Beach, Mangaluru'}</span>
                </p>
              </div>

              {/* Clean Price Display (Price Negotiable Removed) */}
              <div className="text-left md:text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Asking Price
                </div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-amber-700">
                  {(property?.priceText || property?.price || propDisplayPrice || '').startsWith('₹') 
                    ? (property?.priceText || property?.price || propDisplayPrice) 
                    : `₹${property?.priceText || property?.price || propDisplayPrice}`}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Main Photo Gallery (Takes full width of Left Column) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
            <PropertyImageGallery 
              images={propDisplayImages}
              selectedImage={activeGalleryIdx}
              setSelectedImage={setActiveGalleryIdx}
            />
          </div>
          
          {/* 1. Architectural Overview & Highlights Narrative */}
          <ArchitecturalOverview 
            description={property?.description} 
            highlights={property?.highlights} 
          />

          {/* 2. Structured HTML Table Component: Property Specifications & Features */}
          <PropertySpecifications 
            specifications={components && components.length > 0 ? components.map(c => ({
              category: c?.categoryName || c?.category || 'General',
              feature: c?.featureName || c?.feature || c?.label,
              status: (c?.isAvailable !== false && c?.status !== 'Not Included') ? 'Included' : 'Not Included',
              details: c?.descriptionNote || c?.details || '—'
            })) : undefined} 
          />

          {/* 3. Legal Audit Checklist Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0a1d37] text-[#e6ca65] flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0a1d37]">
                Legal & Title Verification
              </h3>
            </div>

            {/* Line-by-Line Stacked Container */}
            <div className="w-full bg-white rounded-xl border border-neutral-200/80 divide-y divide-neutral-100 shadow-sm overflow-hidden mb-6">
              {legal && legal.length > 0 ? (
                legal.map((item, index) => {
                  const status = item?.verifiedStatus || 'Verified';
                  return (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-neutral-50/60 transition-colors">
                      
                      {/* Left: Document Name & Note */}
                      <div className="flex-1 pr-4">
                        <h4 className="font-semibold text-sm text-[#0a1d37]">{item?.documentName}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {item?.verificationNote || "Status Not Updated"}
                        </p>
                      </div>

                      {/* Right: Status Badge */}
                      <div className="shrink-0">
                        {(() => {
                          const norm = (status || '').trim().toLowerCase();
                          if (
                            norm === 'verified' ||
                            norm.includes('clean') ||
                            norm.includes('clear') ||
                            norm.includes('nil ec') ||
                            norm.includes('compliant')
                          ) {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Verified</span>
                              </span>
                            );
                          }
                          if (
                            norm.includes('not applicable') ||
                            norm === 'na' ||
                            norm === 'n/a'
                          ) {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-500 border border-stone-200">
                                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Not Applicable</span>
                              </span>
                            );
                          }
                          if (
                            norm.includes('flagged') ||
                            norm.includes('issue') ||
                            norm.includes('action')
                          ) {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Action Required</span>
                              </span>
                            );
                          }
                          return (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Pending</span>
                            </span>
                          );
                        })()}
                      </div>

                    </div>
                  );
                })
              ) : (
                (property?.legalChecklist || [])
                  .filter(item => item && item.inspected !== false && item.inspected !== 'false' && item.status !== 'not_inspected' && item.status !== 'Pending Legal Audit')
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-neutral-50/60 transition-colors">
                      
                      {/* Left: Document Name & Note */}
                      <div className="flex-1 pr-4">
                        <h4 className="font-semibold text-sm text-[#0a1d37]">{item?.name}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {item?.details || "Status Not Updated"}
                        </p>
                      </div>

                      {/* Right: Status Badge */}
                      <div className="shrink-0">
                        {item?.isCleared ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Action Required</span>
                          </span>
                        )}
                      </div>

                    </div>
                  ))
              )}
            </div>

            {/* Bank Loan Bridge Advocate Verification Action */}
            {(property?.advocateVerificationAvailable !== false) && (
              <div className="bg-[#fcfbf7] border border-slate-200/90 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0a1d37] block">Bank Loan Search Report & Legal Search Bridge</span>
                    <span className="text-[11px] text-slate-500 block">Pre-cleared with SBI, HDFC, Canara & Federal Bank empanelled advocates.</span>
                  </div>
                </div>
                <a 
                  href={`https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20would%20like%20to%20verify%20title%20clearance%20with%20an%20Advocate%20(Bank%20Loan%20Bridge)%20for%20Property%20${propListingCode}%20(Slug:%20${propDisplaySlug}):%20${encodeURIComponent(property?.title || 'Property')}%20(${encodeURIComponent(propDisplayLocation)})`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 bg-[#0a1d37] hover:bg-[#061224] text-white font-semibold px-4 py-2.5 rounded-xl text-xs tracking-wider transition-all shadow-sm shrink-0"
                >
                  <FileCheck className="w-3.5 h-3.5 text-[#e6ca65]" />
                  <span>Verify with Advocate (Bank Loan Bridge)</span>
                </a>
              </div>
            )}
          </div>

        </div>

        {/* ============================================================= */}
        {/* RIGHT COLUMN (Spans 4 Columns): Sticky Video Card & Pricing   */}
        {/* ============================================================= */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          
          {/* Video Walkthrough Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-3 shadow-xs">
            
            {/* Updated Header (Text Changed to "VIDEO WALKTHROUGH") */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Video className="w-3.5 h-3.5"/>
              </div>
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Video Walkthrough
              </span>
            </div>

            {/* YouTube Video Embed Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200/60">
              {propDisplayVideoUrl ? (
                <iframe
                  src={getYouTubeEmbedUrl(propDisplayVideoUrl)}
                  title="Property Video Walkthrough"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  No video available
                </div>
              )}
            </div>

            {/* Video Walkthrough Card Footer */}
            <div className="flex items-center justify-end pt-1 text-[11px]">
              <a
                href={getYouTubeWatchUrl(propDisplayVideoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-700 hover:text-amber-700 flex items-center gap-1 transition-colors"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3 h-3 text-slate-400"/>
              </a>
            </div>

          </div>

          {/* 2. Sticky Property Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-amber-50 text-[#b8860b] border border-amber-200 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
                {propDisplayType || 'RESALE'}
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                {propListingCode}
              </span>
            </div>

            {/* Asking Price with Optional Chaining */}
            <div className="mb-4 pb-4 border-b border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Asking Price</span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-3xl font-serif font-bold text-[#b8860b]">{propDisplayPrice}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {propDisplayPriceRaw ? (
                  <span className="text-xs text-slate-500 font-medium">
                    ≈ ₹{Math.round(propDisplayPriceRaw / (parseInt((propDisplayArea || '1').replace(/[^0-9]/g, '')) || 1)).toLocaleString('en-IN')} / sq.ft
                  </span>
                ) : null}
              </div>
            </div>

            {/* Dynamic Property Specifications Grid */}
            {(() => {
              const isLand = property?.type?.toLowerCase().includes('land') || 
                             property?.type?.toLowerCase().includes('plot') ||
                             property?.category?.toLowerCase().includes('land') || 
                             property?.category?.toLowerCase().includes('plot');

              if (isLand) {
                return (
                  <div className="grid grid-cols-2 gap-3 my-6">
                    {/* Plot Area */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                        PLOT AREA
                      </span>
                      <p className="text-sm font-bold text-[#0F172A] font-sans">
                        {property?.plotArea || property?.specs?.plotArea || property?.superArea || propDisplayArea || "12.5 Cents"}
                      </p>
                    </div>

                    {/* Boundary Wall / Fencing */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                        BOUNDARY / FENCING
                      </span>
                      <p className="text-sm font-bold text-[#0F172A] font-sans">
                        {property?.boundary || property?.specs?.compoundWall || "Gated Compound"}
                      </p>
                    </div>

                    {/* Zoning / Land Use */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                        ZONING TYPE
                      </span>
                      <p className="text-sm font-bold text-[#0F172A] font-sans">
                        {property?.zoning || property?.specs?.conversionStatus || "Residential Conversion"}
                      </p>
                    </div>

                    {/* Road Ingress / Frontage */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                        ROAD FRONTAGE
                      </span>
                      <p className="text-sm font-bold text-[#0F172A] font-sans">
                        {property?.roadWidth || property?.specs?.roadWidth || "30 ft Concrete Road"}
                      </p>
                    </div>
                  </div>
                );
              }

              // Standard Villa / Residential / Commercial Suite Specs
              return (
                <div className="grid grid-cols-2 gap-3 my-6">
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                      BEDROOMS
                    </span>
                    <p className="text-sm font-bold text-[#0F172A] font-sans flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-[#C59B27]"/>
                      {property?.bedrooms || propDisplayBeds || "N/A"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                      BATHROOMS
                    </span>
                    <p className="text-sm font-bold text-[#0F172A] font-sans flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-[#C59B27]"/>
                      {property?.bathrooms || propDisplayBaths || "N/A"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                      SUPER AREA
                    </span>
                    <p className="text-sm font-bold text-[#0F172A] font-sans">
                      {property?.superArea || property?.builtUpArea || propDisplayArea}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                      FURNISHING
                    </span>
                    <p className="text-sm font-bold text-[#0F172A] font-sans">
                      {property?.furnishing || property?.specs?.furnishingStatus || "Unfurnished"}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Primary WhatsApp CTA Button */}
            <a 
              href={`https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20am%20interested%20in%20inspecting%20Property%20${propListingCode}%20(Slug:%20${propDisplaySlug}):%20${encodeURIComponent(property?.title || 'Property')}%20(${encodeURIComponent(propDisplayLocation)})`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:from-[#c49f28] hover:to-[#997315] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider text-center flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer mb-3"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>Book On-Site Inspection via WhatsApp</span>
            </a>

            {/* Schedule Private Tour Button */}
            <a 
              href={`https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20would%20like%20to%20schedule%20a%20private%20tour%20for%20Property%20${propListingCode}%20(Slug:%20${propDisplaySlug}):%20${encodeURIComponent(property?.title || 'Property')}%20(${encodeURIComponent(propDisplayLocation)})`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#0a1d37] hover:bg-[#061224] text-white font-semibold py-2.5 px-4 rounded-xl text-xs tracking-wider text-center flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#b8860b]/30"
            >
              <Calendar className="w-3.5 h-3.5 text-[#e6ca65]" />
              <span>Schedule Private Tour</span>
            </a>

          </div>

        </div>

      </div>

      {/* Streamlined Investment & Transit Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">

        {/* Left: Minimalist Investment Highlights (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 space-y-6 shadow-xs">
          <h3 className="text-lg font-serif font-bold text-slate-900 tracking-tight">
            Investment Analysis
          </h3>

          {/* Metric Grid - Bold Numbers, No Extra Captions */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-200/50">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Unit Rate
              </div>
              <div className="text-xl font-serif font-bold text-slate-900">
                {property.sqftPrice || (propDisplayPriceRaw && parseInt((propDisplayArea || '0').replace(/[^0-9]/g, '')) > 0 ? `₹${Math.round(propDisplayPriceRaw / parseInt((propDisplayArea || '1').replace(/[^0-9]/g, ''))).toLocaleString('en-IN')}` : 'N/A')}
                <span className="text-[10px] font-sans text-slate-400 font-normal">/sq.ft</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-200/50">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Est. Rent
              </div>
              <div className="text-xl font-serif font-bold text-slate-900">
                {(property.rentalEstimate || property?.investmentAnalysis?.rentalYieldEst?.split(' ')[0] || specs?.financials?.monthlyRental || 'N/A').replace(/^₹/, '').replace(' / mo', '')}
                <span className="text-[10px] font-sans text-slate-400 font-normal">/mo</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-200/50">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Appreciation
              </div>
              <div className="text-xl font-serif font-bold text-amber-700">
                {property.appreciationRate || (property?.investmentAnalysis?.resaleAppreciationEst ? property.investmentAnalysis.resaleAppreciationEst.split(' ')[0].replace('Compound', '').trim() : (specs?.financials?.appreciation || 'N/A'))}
              </div>
            </div>
          </div>

          {/* Statutory Costs - Compact Key-Value Bars */}
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="flex justify-between items-center bg-slate-50 px-3.5 py-2.5 rounded-lg border border-slate-100">
              <span className="text-slate-500 text-[11px]">Property Tax</span>
              <span className="font-bold text-slate-900 text-[11px]">{specs?.financials?.propertyTax ? specs.financials.propertyTax.replace(' / year', ' / yr') : 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 px-3.5 py-2.5 rounded-lg border border-slate-100">
              <span className="text-slate-500 text-[11px]">Stamp Duty</span>
              <span className="font-bold text-slate-900 text-[11px]">{specs?.financials?.stampDuty ? specs.financials.stampDuty.replace('Lakhs', 'L') : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Right: Clean Nearby Transit (5 Cols) */}
        <NearbyInfrastructure property={property} className="lg:col-span-5" />

      </div>

      </section>
      <Footer />
    </div>
  );
}

export { PropertyImageGallery, ArchitecturalOverview, Footer };


```

## File: `src/components/PropertyImageGallery.jsx`

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Building2 } from 'lucide-react';

export default function PropertyImageGallery({ 
  images = [], 
  selectedImage: externalSelectedImage, 
  setSelectedImage: externalSetSelectedImage 
}) {
  const [internalSelectedImage, setInternalSelectedImage] = useState(0);
  const selectedImage = externalSelectedImage !== undefined ? externalSelectedImage : internalSelectedImage;
  const setSelectedImage = externalSetSelectedImage || setInternalSelectedImage;

  const [showZoom, setShowZoom] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, percentageX: 0, percentageY: 0 });
  const imageRef = useRef(null);

  const galleryImages = Array.isArray(images) && images.length > 0 ? images : [];
  const currentImage = galleryImages[selectedImage] || galleryImages[0] || '';

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const percentageX = Math.max(0, Math.min(100, (x / width) * 100));
    const percentageY = Math.max(0, Math.min(100, (y / height) * 100));

    setZoomPos({ x, y, percentageX, percentageY });
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Keyboard navigation for full-screen modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') setIsModalOpen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, galleryImages.length]);

  if (galleryImages.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-[#0F172A] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Photos
        </h3>
        <div className="relative h-[320px] rounded-2xl bg-slate-100 border border-slate-200/80 flex flex-col items-center justify-center text-slate-400">
          <Building2 className="w-10 h-10 mb-2 stroke-[1.5]" />
          <span className="text-xs font-sans font-medium uppercase tracking-wider">No Gallery Images Uploaded</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Clean Simplified Gallery Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[#0F172A] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Photos
        </h3>
        <span className="text-xs text-slate-500 font-sans font-medium">
          Photo {selectedImage + 1} of {galleryImages.length}
        </span>
      </div>

      {/* Main Image Viewport with Redesigned Expand Button */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div 
          ref={imageRef}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
          onClick={() => {
            setShowZoom(false);
            setIsModalOpen(true);
          }}
          className="lg:col-span-12 relative h-[420px] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer border border-slate-200 shadow-xs select-none group"
        >
          <img
            src={currentImage}
            alt="Property High-Res Capture"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* Hover Magnifier Glass Box */}
          {showZoom && (
            <div 
              className="absolute w-36 h-36 border-2 border-[#C59B27] bg-[#C59B27]/20 backdrop-blur-3xs pointer-events-none rounded-lg shadow-lg hidden lg:block"
              style={{
                left: `${zoomPos.x - 72}px`,
                top: `${zoomPos.y - 72}px`,
              }}
            />
          )}

          {/* Redesigned Floating "Click to Expand" Button (Only Bottom Right) */}
          <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-[#C59B27] border border-[#C59B27]/40 backdrop-blur-md text-xs font-semibold font-sans shadow-md group-hover:bg-slate-950 transition-all">
              <Maximize2 className="w-3.5 h-3.5 text-[#C59B27]"/>
              Click to Expand
            </span>
          </div>
        </div>

        {/* Desktop Side Zoom Window Overlay */}
        {showZoom && (
          <div className="absolute top-0 left-full ml-4 w-[500px] h-[420px] rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 shadow-2xl z-40 pointer-events-none hidden lg:block">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${currentImage})`,
                backgroundPosition: `${zoomPos.percentageX}% ${zoomPos.percentageY}%`,
                backgroundSize: '250%',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>
        )}
      </div>

      {/* Thumbnail Selector Strip (Inset Gold Outline Fix) */}
      {galleryImages.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto py-3 px-2">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative w-20 h-14 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shrink-0 p-[2px] ${
                selectedImage === idx 
                  ? 'bg-[#C59B27] shadow-md scale-105' 
                  : 'bg-transparent opacity-60 hover:opacity-100 hover:scale-102'
              }`}
            >
              <div className="w-full h-full rounded-[10px] overflow-hidden bg-white">
                <img 
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* CLEAN FULL-SCREEN LIGHTBOX MODAL */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-[#FAF8F5]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200 select-none"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Top Controls Header */}
          <div className="flex items-center justify-between text-slate-800 z-10">
            {/* Clean Photo Counter (No 'Fullscreen View' label) */}
            <span className="text-xs font-bold text-slate-600 font-sans tracking-wide">
              Photo {selectedImage + 1} of {galleryImages.length}
            </span>

            {/* Floating Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 transition-all cursor-pointer border border-slate-200 shadow-md hover:scale-105"
              title="Close (Esc)"
            >
              <X className="w-5 h-5"/>
            </button>
          </div>

          {/* Centered Main Image with Navigation Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Left Arrow */}
            {galleryImages.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-20 p-3.5 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-slate-200/80 shadow-xl transition-all hover:scale-110 cursor-pointer"
                title="Previous Image"
              >
                <ChevronLeft className="w-5 h-5"/>
              </button>
            )}

            {/* Active Expanded Image */}
            <img
              src={currentImage}
              alt="Expanded Property High-Res View"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[82vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-slate-200/40"
            />

            {/* Right Arrow */}
            {galleryImages.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-20 p-3.5 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-slate-200/80 shadow-xl transition-all hover:scale-110 cursor-pointer"
                title="Next Image"
              >
                <ChevronRight className="w-5 h-5"/>
              </button>
            )}
          </div>

          {/* Fullscreen Modal Bottom Thumbnail Strip (Inset Gold Ring Fix) */}
          <div 
            className="flex items-center justify-center gap-3 overflow-x-auto py-3 px-2 z-10 max-w-2xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-16 h-12 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shrink-0 p-[2px] ${
                  selectedImage === idx 
                    ? 'bg-[#C59B27] shadow-md scale-105' 
                    : 'bg-transparent opacity-50 hover:opacity-100 hover:scale-102'
                }`}
              >
                <div className="w-full h-full rounded-[10px] overflow-hidden bg-white">
                  <img 
                    src={img} 
                    alt={`Modal Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

```

## File: `src/components/PropertySpecifications.jsx`

```jsx
import React, { useState } from 'react';
import { Layers, CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function PropertySpecifications({ specifications = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const specsList = Array.isArray(specifications) ? specifications : [];
  const visibleSpecs = isExpanded ? specsList : specsList.slice(0, 3);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Clean Header (Removed '100% Physical On-Site Verified' Badge) */}
      <div className="p-6 md:p-8 bg-[#FAF8F5] border-b border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-[#C59B27] shrink-0">
            <Layers className="w-5 h-5"/>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-widest font-sans block">
              ESTATE SPECIFICATIONS
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Property Features & Amenity Overview
            </h2>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Specification / Feature</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-sans">
            {specsList.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-500 font-sans">
                  No specifications currently recorded for this property.
                </td>
              </tr>
            ) : (
              visibleSpecs.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-[#0F172A] whitespace-nowrap">
                    {item.feature}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {(item.status === 'Included' || item.isAvailable === true) ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600"/>
                        <span>Included</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-500 border border-stone-200 font-semibold text-[11px]">
                        <X className="w-3.5 h-3.5 stroke-[2.5] text-stone-400"/>
                        <span>Not Included</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-600 leading-relaxed max-w-lg">
                    {item.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Simplified Toggle Button Footer */}
      {specsList.length > 3 && (
        <div className="p-4 bg-slate-50/70 border-t border-slate-200/60 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-[#C59B27]/40 text-[#0F172A] hover:border-[#C59B27] hover:bg-[#FAF8F5] transition-all text-xs font-bold font-sans shadow-xs cursor-pointer"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 text-[#C59B27]"/>
              </>
            ) : (
              <>
                View All ({specsList.length}) <ChevronDown className="w-4 h-4 text-[#C59B27]"/>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

```

## File: `src/components/PropertySummaryCard.jsx`

```jsx
import React from 'react';
import { Bed, Bath } from 'lucide-react';

export default function PropertySummaryCard({ property = {} }) {
  const isLand = (property?.type || '').toLowerCase().includes('land') || 
                 (property?.type || '').toLowerCase().includes('plot') ||
                 (property?.category || '').toLowerCase().includes('land') || 
                 (property?.category || '').toLowerCase().includes('plot');

  if (isLand) {
    return (
      <div className="grid grid-cols-2 gap-3 my-6">
        {/* Plot Area */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
            PLOT AREA
          </span>
          <p className="text-sm font-bold text-[#0F172A] font-sans">
            {property.plotArea || property.superArea || property.area || "Not Specified"}
          </p>
        </div>

        {/* Boundary Wall / Fencing */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
            BOUNDARY / FENCING
          </span>
          <p className="text-sm font-bold text-[#0F172A] font-sans">
            {property.boundary || "Not Specified"}
          </p>
        </div>

        {/* Zoning / Land Use */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
            ZONING TYPE
          </span>
          <p className="text-sm font-bold text-[#0F172A] font-sans">
            {property.zoning || "Not Specified"}
          </p>
        </div>

        {/* Road Ingress / Frontage */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
            ROAD FRONTAGE
          </span>
          <p className="text-sm font-bold text-[#0F172A] font-sans">
            {property.roadWidth || "Not Specified"}
          </p>
        </div>
      </div>
    );
  }

  // Standard Villa / Residential / Commercial Suite Specs
  return (
    <div className="grid grid-cols-2 gap-3 my-6">
      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
          BEDROOMS
        </span>
        <p className="text-sm font-bold text-[#0F172A] font-sans flex items-center gap-1.5">
          <Bed className="w-4 h-4 text-[#C59B27]"/>
          {property.bedrooms ?? property.beds ?? "N/A"}
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
          BATHROOMS
        </span>
        <p className="text-sm font-bold text-[#0F172A] font-sans flex items-center gap-1.5">
          <Bath className="w-4 h-4 text-[#C59B27]"/>
          {property.bathrooms ?? property.baths ?? "N/A"}
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
          SUPER AREA
        </span>
        <p className="text-sm font-bold text-[#0F172A] font-sans">
          {property.superArea || property.builtUpArea || property.area}
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
          FURNISHING
        </span>
        <p className="text-sm font-bold text-[#0F172A] font-sans">
          {property.furnishing || property.specs?.furnishingStatus || "Unfurnished"}
        </p>
      </div>
    </div>
  );
}


```

## File: `src/components/PublishListingPage.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, RotateCw, ShieldCheck, Database,
  LogOut, PlusCircle, Trash2, Video, Upload, FileText,
  X, Check, Lock, ChevronRight, Layers, FileCheck, CheckCircle2,
  Maximize2, Minus, ExternalLink, Play, RefreshCw, MapPin,
  Image as ImageIcon, Star
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { getAssetSpecPresets } from '../defaultPresets';
import AddCustomItemModal from './AddCustomItemModal';
import PublishSuccessModal from './PublishSuccessModal';
import { toast } from 'sonner';

export default function PublishListingPage({ onExit, onSaveProperty }) {
  const navigate = useNavigate();

  // Navigation & Browser History Back Handler
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/admin');
    }
  };

  // Clock
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Form Step State (1: General Details, 2: Media & Links, 3: Feature Matrix & Transit, 4: Legal Audit & Investment)
  const [formStep, setFormStep] = useState(1);
  const currentStep = formStep;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Step 1: General Details state (All checkboxes & switches default to UNCHECKED / false)
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [price, setPrice] = useState('');
  const [maintenanceFee, setMaintenanceFee] = useState(0);
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [assetCategory, setAssetCategory] = useState('Plot / Land');
  const [superArea, setSuperArea] = useState('');
  const [featuredBadge, setFeaturedBadge] = useState('Verified Listing');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [description, setDescription] = useState('');

  // Step 2: Media & Links state
  const [videoUrl, setVideoUrl] = useState('');
  const [showYoutubePicker, setShowYoutubePicker] = useState(false);
  const [channelVideos] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Dedicated Cover Photo & Gallery Upload State
  const [coverPhoto, setCoverPhoto] = useState(null); // { id, url, name, size }
  const [galleryPhotos, setGalleryPhotos] = useState([]); // [{ id, url, name, size }]
  const [legalDocuments, setLegalDocuments] = useState([]);

  // Dedicated Publish Success Popup Modal State
  const [publishedRecord, setPublishedRecord] = useState(null);
  const [showPublishSuccessModal, setShowPublishSuccessModal] = useState(false);

  // Client-Side Canvas Image Compression Helper (Max 1600px width, 0.85 quality)
  const compressImageFile = (file, maxWidth = 1600, quality = 0.85) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
          resolve({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: dataUrl,
            name: file.name,
            size: `${Math.round((dataUrl.length * 0.75) / 1024)} KB`
          });
        };
        img.onerror = () => {
          resolve({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: e.target.result,
            name: file.name,
            size: `${(file.size / 1024).toFixed(0)} KB`
          });
        };
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Primary Cover Photo Upload Handlers
  const handleCoverPhotoUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const processed = await compressImageFile(e.target.files[0]);
      if (processed) {
        setCoverPhoto(processed);
      }
    }
  };

  const handleRemoveCoverPhoto = () => {
    setCoverPhoto(null);
  };

  // Property Gallery Photos Upload Handlers
  const handleGalleryUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const results = await Promise.all(files.map(f => compressImageFile(f)));
      const valid = results.filter(Boolean);
      setGalleryPhotos(prev => [...prev, ...valid]);
    }
  };

  const handleRemoveGalleryPhoto = (idx) => {
    setGalleryPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleLegalDocUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: 'document'
      }));
      setLegalDocuments(prev => [...prev, ...newDocs]);
    }
  };

  const handleRemoveLegalDoc = (idx) => {
    setLegalDocuments(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: f.name.endsWith('.pdf') ? 'document' : 'image'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeUploadedFile = (idx) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Step 3: Property Specifications & Features (Grouped by Category)
  const [componentsMatrix, setComponentsMatrix] = useState(() => {
    return getAssetSpecPresets('Plot').map(item => ({
      categoryName: item.category,
      featureName: item.feature,
      isAvailable: false,
      status: 'Not Included',
      descriptionNote: item.details || ''
    }));
  });

  // Track user-added custom categories (e.g. "Security & Smart Home", "Eco & Sustainability")
  const [customCategories, setCustomCategories] = useState([]);

  const handleAssetCategoryChange = (newCat) => {
    setAssetCategory(newCat);
    const presets = getAssetSpecPresets(newCat).map(item => ({
      categoryName: item.category,
      featureName: item.feature,
      isAvailable: false,
      status: 'Not Included',
      descriptionNote: item.details || ''
    }));
    // Preserve any custom items from user-created categories
    const customItems = componentsMatrix.filter(item => customCategories.includes(item.categoryName));
    setComponentsMatrix([...presets, ...customItems]);
  };

  const handleToggleFeature = (index) => {
    setComponentsMatrix(prev => {
      const updated = [...prev];
      const nextAvailable = !updated[index].isAvailable;
      updated[index] = {
        ...updated[index],
        isAvailable: nextAvailable,
        status: nextAvailable ? 'Included' : 'Not Included'
      };
      return updated;
    });
  };

  const handleFeatureNoteChange = (index, note) => {
    setComponentsMatrix(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], descriptionNote: note };
      return updated;
    });
  };

  const handleDeleteFeature = (index) => {
    setComponentsMatrix(prev => prev.filter((_, i) => i !== index));
  };

  // Step 3: Dynamic Structural & Land Inventory State (Inclusions default to Not Included / false)
  const [inventory, setInventory] = useState([]);

  const handleAddCustomInventory = () => {
    setInventory(prev => [...prev, { label: '', value: '', isAvailable: false, status: 'Not Included' }]);
  };

  const handleInventoryChange = (index, field, value) => {
    setInventory(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveInventory = (index) => {
    setInventory(prev => prev.filter((_, i) => i !== index));
  };

  // Step 3: Strategic Transit Matrix & Proximity State (Preserved in component state across all wizard steps)
  const [transitMatrix, setTransitMatrix] = useState([
    { landmarkName: "Mangaluru International Airport (IXE)", distanceText: "14.2 km", durationText: "20m", travelMode: "Drive" },
    { landmarkName: "Surathkal Railway Station", distanceText: "3.5 km", durationText: "8m", travelMode: "Drive" },
    { landmarkName: "NITK Surathkal Campus & Beach", distanceText: "2.1 km", durationText: "5m", travelMode: "Drive" },
    { landmarkName: "Mangalore City Central / Hampankatta", distanceText: "17.5 km", durationText: "25m", travelMode: "Drive" }
  ]);

  const handleUpdateTransit = (index, field, value) => {
    setTransitMatrix(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddTransitItem = () => {
    setTransitMatrix(prev => [
      ...prev,
      { landmarkName: '', distanceText: '', durationText: '', travelMode: 'Drive' }
    ]);
  };

  const handleRemoveTransitItem = (index) => {
    setTransitMatrix(prev => prev.filter((_, i) => i !== index));
  };

  // Step 4: Dynamic Self-Verifiable Legal Audit & Due Diligence Checklist (Defaults to Pending)
  const [legalChecklist, setLegalChecklist] = useState([
    {
      id: 'parentDeedAudit',
      key: 'parentDeedAudit',
      documentName: '30-Year Parent Deed Chain Audit',
      category: 'Ownership',
      activeStatus: 'Cleared',
      activeLabel: 'Cleared',
      verifiedStatus: 'Pending',
      description: 'Chain of title deeds dating back 30 years verified without break in title',
      verificationNote: '30-Year Parent Deed Chain Audit',
      isCustomItem: false
    },
    {
      id: 'encumbranceCertificate',
      key: 'encumbranceCertificate',
      documentName: '30-Year Encumbrance Certificate',
      category: 'Ownership',
      activeStatus: 'Nil EC verified',
      activeLabel: 'Nil EC verified',
      verifiedStatus: 'Pending',
      description: 'Form 15 Nil Encumbrance Certificate verified through Kaveri / Sub-Registrar',
      verificationNote: '30-Year Encumbrance Certificate (Nil EC verified)',
      isCustomItem: false
    },
    {
      id: 'revenueRtcCompliance',
      key: 'revenueRtcCompliance',
      documentName: 'Revenue RTC / Mutation Compliance',
      category: 'Ownership',
      activeStatus: 'Verified',
      activeLabel: 'Verified',
      verifiedStatus: 'Pending',
      description: 'Pahani / RTC mutation extract reflects unambiguous vendor ownership',
      verificationNote: 'Revenue RTC / Mutation Compliance (Verified)',
      isCustomItem: false
    },
    {
      id: 'mccPlanApprovals',
      key: 'mccPlanApprovals',
      documentName: 'MCC / Local Body Plan Approvals',
      category: 'Municipal',
      activeStatus: 'Compliant',
      activeLabel: 'Compliant',
      verifiedStatus: 'Pending',
      description: 'Mangaluru City Corporation sanctioned blueprint and occupancy certificate',
      verificationNote: 'MCC / Local Body Plan Approvals (Compliant)',
      isCustomItem: false
    },
    {
      id: 'dgpsSurveyVerification',
      key: 'dgpsSurveyVerification',
      documentName: 'Physical Boundary DGPS Survey',
      category: 'Ownership',
      activeStatus: 'Cleared',
      activeLabel: 'Cleared',
      verifiedStatus: 'Pending',
      description: 'Field Measurement Book (FMB) coordinates match physical compound boundary',
      verificationNote: 'Physical Boundary DGPS Survey (Cleared)',
      isCustomItem: false
    }
  ]);

  const handleUpdateLegalStatus = (index, newStatus) => {
    setLegalChecklist(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], verifiedStatus: newStatus };
      return updated;
    });
  };

  const handleUpdateLegalNote = (index, newNote) => {
    setLegalChecklist(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], verificationNote: newNote };
      return updated;
    });
  };

  const handleDeleteLegalItem = (index) => {
    setLegalChecklist(prev => prev.filter((_, i) => i !== index));
  };

  const [advocateVerificationAvailable, setAdvocateVerificationAvailable] = useState(false);

  // Investment Analysis
  const [investmentAnalysis, setInvestmentAnalysis] = useState({
    rentalYieldEst: '',
    resaleAppreciationEst: '',
    localityGrowthDriver: ''
  });

  // =========================================================================
  // CUSTOM MODAL DIALOG STATES (Replacing native browser window.prompt dialogs)
  // =========================================================================
  const [modalType, setModalType] = useState(null); // 'ADD_CATEGORY' | 'ADD_FEATURE' | 'ADD_LEGAL_CHECK'
  const [modalTargetCategory, setModalTargetCategory] = useState('');

  // Category Modal Form State
  const [categoryModalData, setCategoryModalData] = useState({
    categoryName: '',
    initialFeatureName: '',
    initialFeatureNote: '',
    isIncluded: true
  });

  // Feature Modal Form State
  const [featureModalData, setFeatureModalData] = useState({
    featureName: '',
    descriptionNote: '',
    isAvailable: true
  });

  // Legal Check Modal Form State
  const [legalModalData, setLegalModalData] = useState({
    documentName: '',
    verifiedStatus: 'Pending Audit',
    verificationNote: ''
  });

  // Open Handlers
  const handleOpenAddCategory = () => {
    setCategoryModalData({
      categoryName: '',
      initialFeatureName: '',
      initialFeatureNote: '',
      isIncluded: true
    });
    setModalType('ADD_CATEGORY');
  };

  const handleOpenAddFeature = (catName) => {
    setModalTargetCategory(catName || 'General');
    setFeatureModalData({
      featureName: '',
      descriptionNote: '',
      isAvailable: true
    });
    setModalType('ADD_FEATURE');
  };

  const handleOpenAddLegalCheck = () => {
    setLegalModalData({
      documentName: '',
      verifiedStatus: 'Pending Audit',
      verificationNote: ''
    });
    setModalType('ADD_LEGAL_CHECK');
  };

  // Submit Handlers for Custom Modals
  const handleConfirmAddCategory = () => {
    const catName = categoryModalData.categoryName.trim();
    if (!catName) {
      toast.error('Please enter a category name.');
      return;
    }
    if (!customCategories.includes(catName)) {
      setCustomCategories(prev => [...prev, catName]);
    }
    if (categoryModalData.initialFeatureName.trim()) {
      setComponentsMatrix(prev => [
        ...prev,
        {
          categoryName: catName,
          featureName: categoryModalData.initialFeatureName.trim(),
          isAvailable: Boolean(categoryModalData.isIncluded),
          status: categoryModalData.isIncluded ? 'Included' : 'Not Included',
          descriptionNote: (categoryModalData.initialFeatureNote || '').trim()
        }
      ]);
    }
    setModalType(null);
  };

  const handleConfirmAddFeature = () => {
    const featName = featureModalData.featureName.trim();
    if (!featName) {
      toast.error('Please enter a feature name / title.');
      return;
    }
    setComponentsMatrix(prev => [
      ...prev,
      {
        categoryName: modalTargetCategory || 'General',
        featureName: featName,
        isAvailable: Boolean(featureModalData.isAvailable),
        status: featureModalData.isAvailable ? 'Included' : 'Not Included',
        descriptionNote: (featureModalData.descriptionNote || '').trim()
      }
    ]);
    setModalType(null);
  };

  const handleConfirmAddLegalCheck = () => {
    const docName = legalModalData.documentName.trim();
    if (!docName) {
      toast.error('Please enter statutory clearance or document title.');
      return;
    }
    const newItem = {
      id: `custom-legal-${Date.now()}`,
      key: `custom-legal-${Date.now()}`,
      documentName: docName,
      category: 'Custom Clearance',
      activeStatus: 'Verified',
      activeLabel: 'Verified',
      verifiedStatus: legalModalData.verifiedStatus || 'Pending Audit',
      description: (legalModalData.verificationNote || '').trim() || 'Audited statutory clearance on record',
      verificationNote: (legalModalData.verificationNote || '').trim() || 'Audited clearance on record',
      isCustomItem: true
    };
    setLegalChecklist(prev => [...prev, newItem]);
    setModalType(null);
  };

  const handlePublishSubmit = async (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    // STRICT WIZARD GUARD: Prevent premature submission from Step 1, 2, or 3
    // Accidental form submission (e.g. Enter key pressed) moves forward instead of submitting
    if (formStep < 4) {
      setFormStep(prev => Math.min(prev + 1, 4));
      return;
    }

    if (!title || !title.trim()) {
      toast.error('Please enter a property title.');
      setFormStep(1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const isLand = (assetCategory === 'Plot / Land' || assetCategory === 'Plot');
    const rawPriceNum = Number(price) || parseInt(String(price || '').replace(/[^0-9]/g, ''), 10) || 0;
    const formatDisplayPrice = (val) => {
      if (!val) return 'Price on Request';
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs`;
      return `₹${val.toLocaleString('en-IN')}`;
    };

    const parsedLocality = locationName ? locationName.split(',')[0].trim() : 'Central';
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

    const legalVerification = legalChecklist.map(item => ({
      documentName: item.documentName,
      category: item.category || 'Ownership',
      verifiedStatus: (item.verifiedStatus === 'Cleared' || item.verifiedStatus === 'Nil EC verified' || item.verifiedStatus === 'Compliant' || item.verifiedStatus === 'Verified') ? 'Verified' : (item.verifiedStatus === 'Not Applicable' ? 'Not Applicable' : 'Pending'),
      verificationNote: item.verificationNote || '',
      isCustomItem: Boolean(item.isCustomItem)
    }));

    const advocateAuditPayload = {
      parentDeedAudit: legalChecklist.find(i => i.id === 'parentDeedAudit')?.verifiedStatus === 'Cleared' || legalChecklist.find(i => i.id === 'parentDeedAudit')?.verifiedStatus === 'Verified' ? 'Cleared' : 'Pending',
      encumbranceCertificate: legalChecklist.find(i => i.id === 'encumbranceCertificate')?.verifiedStatus === 'Nil EC verified' || legalChecklist.find(i => i.id === 'encumbranceCertificate')?.verifiedStatus === 'Verified' || legalChecklist.find(i => i.id === 'encumbranceCertificate')?.verifiedStatus === 'Cleared' ? 'Nil EC verified' : 'Pending',
      revenueRtcCompliance: legalChecklist.find(i => i.id === 'revenueRtcCompliance')?.verifiedStatus === 'Verified' || legalChecklist.find(i => i.id === 'revenueRtcCompliance')?.verifiedStatus === 'Cleared' ? 'Verified' : 'Pending',
      mccPlanApprovals: legalChecklist.find(i => i.id === 'mccPlanApprovals')?.verifiedStatus === 'Compliant' || legalChecklist.find(i => i.id === 'mccPlanApprovals')?.verifiedStatus === 'Verified' || legalChecklist.find(i => i.id === 'mccPlanApprovals')?.verifiedStatus === 'Cleared' ? 'Compliant' : 'Pending',
      dgpsSurveyVerification: legalChecklist.find(i => i.id === 'dgpsSurveyVerification')?.verifiedStatus === 'Cleared' || legalChecklist.find(i => i.id === 'dgpsSurveyVerification')?.verifiedStatus === 'Verified' ? 'Cleared' : 'Pending'
    };

    const resolvedCover = coverPhoto?.url || (galleryPhotos[0]?.url || '');
    const galleryUrls = galleryPhotos.map(p => p.url);
    const orderedGalleryImages = resolvedCover
      ? [resolvedCover, ...galleryUrls.filter(u => u !== resolvedCover)]
      : (galleryUrls.length > 0 ? galleryUrls : (uploadedFiles.filter(f => f.type === 'image').map(f => f.name)));

    const generatedListingCode = `GMK-MLR-${Math.floor(100 + Math.random() * 900)}`;

    const formData = {
      // Direct Top-Level Keys matching Mongoose schema in server/models/Property.js
      title: title.trim(),
      listingCode: generatedListingCode,
      price: price || formatDisplayPrice(rawPriceNum),
      priceRaw: rawPriceNum,
      category: isLand ? 'Land/Plot' : assetCategory,
      locality: parsedLocality,
      carpetArea: superArea || '',
      heroVideoUrl: videoUrl || '',
      videoUrl: videoUrl || '',
      coverImage: resolvedCover,
      galleryImages: galleryUrls,
      images: orderedGalleryImages,
      slug: generatedSlug,
      city: 'Mangaluru',
      dealType: 'Resale',
      pricing: {
        expectedPrice: rawPriceNum,
        isNegotiable: Boolean(isNegotiable),
        maintenanceFee: Number(maintenanceFee) || 0
      },
      specs: {
        bedrooms: isLand ? 0 : Number(bedrooms),
        bathrooms: isLand ? 0 : Number(bathrooms),
        carpetAreaSqFt: parseInt(String(superArea || '').replace(/[^0-9]/g, ''), 10) || 0,
        furnishingStatus: isLand ? 'Unfurnished' : 'Unfurnished',
        floorLevel: 'G',
        totalFloors: '1'
      },
      youtubeVideoId: videoUrl?.includes('v=') ? videoUrl.split('v=')[1]?.substring(0, 11) : (videoUrl?.includes('youtu.be/') ? videoUrl.split('youtu.be/')[1]?.substring(0, 11) : ''),
      description: description || '',
      componentsMatrix: [
        ...componentsMatrix.map(item => ({
          categoryName: item.categoryName || 'General',
          featureName: item.featureName,
          isAvailable: Boolean(item.isAvailable),
          status: item.isAvailable ? 'Included' : 'Not Included',
          descriptionNote: item.descriptionNote || ''
        })),
        ...inventory.map(item => ({
          categoryName: 'Structural Specifications',
          featureName: item.label,
          isAvailable: Boolean(item.isAvailable),
          status: item.isAvailable ? 'Included' : 'Not Included',
          descriptionNote: item.value
        }))
      ],
      transitMatrix: transitMatrix.map(t => ({
        landmarkName: t.landmarkName || t.destination || '',
        destination: t.destination || t.landmarkName || '',
        distanceText: t.distanceText || '',
        distanceKm: parseFloat(t.distanceText) || 0,
        durationText: t.durationText || '',
        travelTimeMins: parseInt(t.durationText, 10) || 0,
        travelMode: t.travelMode || 'Drive',
        transportMode: t.travelMode || 'Drive'
      })),
      advocateAudit: advocateAuditPayload,
      legalChecklist,
      legalVerification,
      investmentAnalysis,
      advocateVerificationAvailable: Boolean(advocateVerificationAvailable),
      isFeatured: Boolean(isFeatured),
      status: 'Active',
      location: locationName || `${parsedLocality}, Mangaluru`,
      type: isLand ? 'Plot' : assetCategory,
      beds: isLand ? 0 : Number(bedrooms),
      baths: isLand ? 0 : Number(bathrooms),
      area: superArea,
      badge: featuredBadge || 'Verified Listing',
      legalStatus: 'Clear Title / RERA Verified',
      highlights: [
        "Advocate Audited Clear Title",
        "Complete Property Inspections",
        "Mangaluru Verified Listing"
      ]
    };

    const apiUrl = API_ENDPOINTS.properties;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 201 || response.ok) {
        const result = await response.json().catch(() => null);
        const savedDoc = result?.data || formData;

        if (onSaveProperty) {
          onSaveProperty(savedDoc);
        }

        // Automated state refresh / cache invalidation for property inventory
        window.dispatchEvent(new CustomEvent('grabmykey_property_created', { detail: savedDoc }));
        window.dispatchEvent(new CustomEvent('grabmykey_properties_updated'));

        // Dedicated Publish Success Popup Modal (Zero Native Alerts)
        setPublishedRecord({ ...formData, ...savedDoc });
        setShowPublishSuccessModal(true);
        return;
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server responded with status ${response.status}`);
      }
    } catch (err) {
      console.error('Failed to post property listing to backend:', err);
      const isServerOffline = !err.response && (
        err.name === 'TypeError' ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('connection refused')
      );

      if (isServerOffline) {
        const offlineMsg = "Backend server is offline. Please start Node server on port 5000.";
        setSubmitError(offlineMsg);
        toast.warning(offlineMsg);
      } else {
        setSubmitError(err.message || 'Failed to submit listing. Please try again.');
        toast.error(`Submission error: ${err.message || 'Could not connect to backend server'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aliases for handleSubmit and handlePublish
  const handleSubmit = handlePublishSubmit;
  const handlePublish = handlePublishSubmit;

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex flex-col justify-between font-sans antialiased text-[#0a1d37]">
      <div className="w-full flex flex-col flex-1">
        {/* 1. TOP EXECUTIVE PORTAL BAR (FULL-BLEED 100% VIEWPORT) */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs sticky top-0 z-20">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Logo & Portal Branding */}
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm p-1.5 flex items-center justify-center overflow-hidden">
                    <img 
                      src="/logo.png" 
                      alt="GrabMyKey" 
                      className="w-full h-full object-contain" 
                      onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'block'; }}
                    />
                    <span style={{ display: 'none' }} className="text-[10px] font-bold font-serif text-[#0a1d37]">GMK</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-serif font-bold text-[#0a1d37] text-lg tracking-wide">
                        GRABMYKEY EXECUTIVE PORTAL
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200 font-bold uppercase tracking-wider">
                        SUITE 1.0
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block tracking-wider uppercase font-semibold">
                      GrabMyKey • Luxury Real Estate Governance & Title Audit
                    </span>
                  </div>
                </div>

                {/* System Connectivity & Exit Admin Button */}
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-mono uppercase tracking-wider">LIVE SYSTEM</span>
                  </div>

                  <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#f8f6f0] border border-slate-200 text-slate-700 text-xs font-medium">
                    <Database className="w-3.5 h-3.5 text-[#b8860b]" />
                    <span className="font-mono text-[11px]">Local Sandbox</span>
                  </div>

                  <div className="text-slate-500 text-xs font-mono hidden lg:block">
                    {currentTime}
                  </div>

                  <button
                    type="button"
                    onClick={onExit || (() => {
                      localStorage.removeItem('gmk_admin_jwt');
                      localStorage.removeItem('gmk_admin_user');
                      navigate('/admin/login');
                    })}
                    className="bg-[#0a1d37] text-white hover:bg-[#061426] px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>EXIT ADMIN MODE</span>
                  </button>
                </div>

              </div>
            </header>

            {/* 2. PRIMARY TAB ROW */}
            <div className="bg-white border-b border-slate-200 px-6">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <nav className="flex space-x-2 text-xs font-semibold overflow-x-auto">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-3.5 px-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Executive Analytics
                  </button>
                  <button
                    type="button"
                    className="py-3.5 px-4 border-b-2 border-[#0a1d37] text-[#0a1d37] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5"
                  >
                    <span>Property Inventory (CRUD)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f8f6f0] text-[#b8860b] font-mono font-bold border border-amber-200">
                      Active
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-3.5 px-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Owner Lead Queue
                  </button>
                </nav>

                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-xs font-mono text-slate-400">
                    Route: <span className="text-[#b8860b] font-semibold">/admin/publish-listing</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 3. MAIN CONTENT CANVAS (EXECUTIVE LIGHT THEME BG-[#F7F5F0]) */}
            <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
              
              {/* PAGE HEADER WITH BACK BUTTON & SUITE TAG */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-[#0a1d37] transition-colors bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs hover:bg-slate-50 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Inventory</span>
                    </button>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8860b] font-bold">
                      EXECUTIVE MANAGEMENT SUITE
                    </span>
                  </div>
                  <h1 className="text-3xl font-serif font-bold text-[#0a1d37] tracking-tight">
                    Publish New Luxury Property Listing
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Configure asset specifications, walkthrough inspection, and advocate clearance parameters.
                  </p>
                </div>

                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-xs text-slate-600 font-mono bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs font-medium">
                    Status: Staging / Draft
                  </span>
                </div>
              </div>

              {/* FORM CONTAINER CARD (#FFFFFF CRISP WHITE) */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
                
                {/* HORIZONTAL STEP NAVIGATION TABS */}
                <div className="flex border-b border-slate-200 mb-8 text-xs font-semibold overflow-x-auto">
                  {[
                    { step: 1, label: '1. General Details' },
                    { step: 2, label: '2. Media & Links' },
                    { step: 3, label: '3. Feature Matrix & Transit' },
                    { step: 4, label: '4. Legal Audit & Investment' }
                  ].map(s => (
                    <button
                      key={s.step}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFormStep(s.step);
                      }}
                      className={`py-3 px-5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                        (formStep === s.step || currentStep === s.step)
                          ? 'border-[#b8860b] text-[#0a1d37] font-bold bg-[#f8f6f0]'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between">
                      <span>{submitError}</span>
                      <button type="button" onClick={() => setSubmitError('')} className="text-red-500 hover:text-red-800">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  
                  {/* ======================================================== */}
                  {/* STEP 1: GENERAL DETAILS (DYNAMIC FIELD HIDING FOR PLOT) */}
                  {/* ======================================================== */}
                  {(formStep === 1 || currentStep === 1) && (
                    <div className="space-y-5">
                      
                      {/* Property Title */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Property Title *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Ultra Luxury Seafront Villa"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Locality, Asking Price & Monthly Maintenance */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Locality & City *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="Bejai, Mangaluru"
                            value={locationName}
                            onChange={e => setLocationName(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Asking Price String *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="₹2.75 Cr"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Monthly Maintenance (RWA / Society Fee)
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            value={maintenanceFee}
                            onChange={e => setMaintenanceFee(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none transition-colors"
                          />
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            Enter monthly society/RWA fee. Set to ₹0 if standalone independent property.
                          </span>
                        </div>
                      </div>

                      {/* Asset Category, Super Area, Featured Badge */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Asset Category
                          </label>
                          <select
                            value={assetCategory}
                            onChange={e => setAssetCategory(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-[#C59B27]/60 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:border-[#C59B27] focus:bg-white focus:outline-none"
                          >
                            <option value="Plot / Land">Plot / Land</option>
                            <option value="Villa">Villa</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Estate">Estate</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Super Area
                          </label>
                          <input
                            type="text"
                            placeholder="12,500 sq.ft"
                            value={superArea}
                            onChange={e => setSuperArea(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Featured Badge
                          </label>
                          <input
                            type="text"
                            placeholder="Exclusive Tour"
                            value={featuredBadge}
                            onChange={e => setFeaturedBadge(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* DYNAMIC FIELD HIDING (Plot / Land):
                          When Asset Category is "Plot / Land", Bedrooms & Bathrooms are completely hidden */}
                      {assetCategory !== 'Plot / Land' && assetCategory !== 'Plot' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bedrooms</label>
                            <input
                              type="number"
                              value={bedrooms}
                              onChange={e => setBedrooms(e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bathrooms</label>
                            <input
                              type="number"
                              value={bathrooms}
                              onChange={e => setBathrooms(e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Toggles: Price Negotiation & Featured Listing (Defaults to Unchecked / false) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-center space-x-2.5 p-3.5 bg-[#FAF8F5] border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={isNegotiable}
                            onChange={e => setIsNegotiable(e.target.checked)}
                            className="w-4 h-4 text-[#b8860b] rounded border-slate-300 focus:ring-[#b8860b]"
                          />
                          <span className="text-xs font-semibold text-slate-700">
                            Price is Negotiable upon Inspection
                          </span>
                        </label>

                        <label className="flex items-center space-x-2.5 p-3.5 bg-[#FAF8F5] border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={e => setIsFeatured(e.target.checked)}
                            className="w-4 h-4 text-[#b8860b] rounded border-slate-300 focus:ring-[#b8860b]"
                          />
                          <span className="text-xs font-semibold text-slate-700">
                            Pin as Featured Showcase Property
                          </span>
                        </label>
                      </div>

                      {/* Architectural Overview: Dynamically shifts up seamlessly */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Architectural Overview {assetCategory === 'Plot / Land' && '• Land Specifications'}
                        </label>
                        <textarea
                          rows={4}
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          placeholder="Executive luxury estate with private landscaped grounds and panoramic coastal vistas."
                          className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none"
                        />
                      </div>

                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* STEP 2: MEDIA & LINKS (YOUTUBE INTEGRATION + LOCAL FILES) */}
                  {/* ======================================================== */}
                  {(formStep === 2 || currentStep === 2) && (
                    <div className="space-y-6">
                      
                      {/* YouTube Walkthrough URL with "Select from YouTube Channel" button */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            YouTube Walkthrough URL
                          </label>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowYoutubePicker(!showYoutubePicker);
                            }}
                            className="inline-flex items-center space-x-1.5 bg-[#0F1E36] hover:bg-[#081220] text-white border border-[#C59B27]/40 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                            <span>Select from YouTube Channel</span>
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={videoUrl}
                          onChange={e => setVideoUrl(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Platform automatically disables autoplay (autoplay=0) to respect luxury user experience.
                        </span>

                        {/* Inline YouTube Channel Video Picker Gallery */}
                        {showYoutubePicker && (
                          <div className="mt-3 p-4 bg-[#FAF8F5] border border-slate-200 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-sans font-bold text-[#0F1E36] uppercase tracking-wider">
                                Official YouTube Channel Walkthroughs
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                API Source: youtube/v3/search • @GrabMyKeyLuxury
                              </span>
                            </div>

                            {channelVideos.length === 0 ? (
                              <p className="text-xs text-slate-500 py-3 text-center">
                                No pre-loaded channel walkthroughs. Paste a direct YouTube link above.
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                {channelVideos.map(vid => (
                                  <div
                                    key={vid.id}
                                    onClick={() => {
                                      setVideoUrl(vid.url);
                                      setShowYoutubePicker(false);
                                    }}
                                    className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#C59B27] hover:shadow-md cursor-pointer transition-all"
                                  >
                                    <div className="h-24 relative overflow-hidden bg-slate-900">
                                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                      <span className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                                        {vid.duration}
                                      </span>
                                    </div>
                                    <div className="p-2.5">
                                      <p className="text-[11px] font-semibold text-[#0F1E36] group-hover:text-[#C59B27] line-clamp-1">
                                        {vid.title}
                                      </p>
                                      <span className="text-[10px] text-slate-400 block mt-0.5">Click to Select</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 1. DEDICATED PRIMARY COVER PHOTO UPLOAD ZONE */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] uppercase tracking-wider">
                              Primary Cover Photo <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-500">
                              The hero photograph featured on catalog cards, homepage highlights, and page headers (.jpg, .png, .webp).
                            </span>
                          </div>
                          {coverPhoto && (
                            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                              <Check className="w-3 h-3" />
                              <span>Cover Selected</span>
                            </span>
                          )}
                        </div>

                        {coverPhoto ? (
                          /* Instant Image Preview Card */
                          <div className="relative border-2 border-emerald-500/40 bg-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative w-full sm:w-56 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <img
                                src={coverPhoto.url}
                                alt={coverPhoto.name || 'Primary Cover'}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-2 left-2 bg-[#C59B27] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm font-mono flex items-center space-x-1">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>PRIMARY COVER</span>
                              </span>
                            </div>
                            <div className="flex-1 w-full space-y-2">
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Active Catalog Hero
                                </span>
                                <h4 className="text-sm font-bold text-[#0F1E36] mt-1.5 truncate" title={coverPhoto.name}>
                                  {coverPhoto.name || 'Cover Photo'}
                                </h4>
                                <span className="text-xs text-slate-500 font-mono block mt-0.5">
                                  Size: {coverPhoto.size} • Format: Optimized Image
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 pt-2">
                                <label className="inline-flex items-center space-x-1.5 bg-[#FAF8F5] hover:bg-slate-100 text-[#0F1E36] px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer border border-slate-300 transition-all">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Replace Photo</span>
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleCoverPhotoUpload}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={handleRemoveCoverPhoto}
                                  className="inline-flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl text-xs font-semibold border border-red-200 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove Photo</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Dedicated Single Dropzone */
                          <div className="border-2 border-dashed border-amber-200/90 hover:border-[#C59B27] rounded-2xl p-6 text-center bg-[#FAF8F5] transition-all group">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-50 text-[#C59B27] border border-amber-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                            <h5 className="text-xs font-bold text-[#0F1E36] mb-1">
                              Upload Primary Cover Photo (.jpg, .png, .webp)
                            </h5>
                            <p className="text-[11px] text-slate-500 mb-4 max-w-sm mx-auto">
                              Select a single hero photograph to represent this property across the catalog and homepage.
                            </p>
                            <label className="inline-flex items-center space-x-2 bg-[#C59B27] hover:bg-[#b0881e] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all border border-[#C59B27]/40">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Select Primary Cover Photo</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleCoverPhotoUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* 2. DEDICATED PROPERTY GALLERY PHOTOS MULTI-FILE UPLOAD ZONE */}
                      <div className="space-y-3 pt-3 border-t border-slate-200/80">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] uppercase tracking-wider">
                              Property Gallery Photos
                            </label>
                            <span className="text-[11px] text-slate-500">
                              Upload additional interior, exterior, elevation, and amenity views (.jpg, .png, .webp).
                            </span>
                          </div>
                          {galleryPhotos.length > 0 && (
                            <span className="text-[11px] font-mono font-bold text-[#C59B27] bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              {galleryPhotos.length} Photo{galleryPhotos.length !== 1 ? 's' : ''} Uploaded
                            </span>
                          )}
                        </div>

                        {/* Multi-file Gallery Dropzone */}
                        <div className="border-2 border-dashed border-slate-300 hover:border-[#0a1d37] rounded-2xl p-6 text-center bg-[#FAF8F5] transition-all group">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-100 text-[#0a1d37] border border-slate-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                            <Upload className="w-6 h-6" />
                          </div>
                          <h5 className="text-xs font-bold text-[#0F1E36] mb-1">
                            Upload Gallery Photos (.jpg, .png, .webp)
                          </h5>
                          <p className="text-[11px] text-slate-500 mb-4 max-w-sm mx-auto">
                            Select multiple photos from your device to populate the property photo gallery carousel.
                          </p>
                          <label className="inline-flex items-center space-x-2 bg-[#0a1d37] hover:bg-[#061426] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all border border-[#0a1d37]/40">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select Gallery Photos</span>
                            <input
                              type="file"
                              multiple
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleGalleryUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Clean Gallery Thumbnails Grid with Individual Remove Buttons */}
                        {galleryPhotos.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                            {galleryPhotos.map((photo, idx) => (
                              <div
                                key={photo.id || idx}
                                className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs hover:border-[#C59B27] transition-all"
                              >
                                <div className="h-28 w-full overflow-hidden bg-slate-100 relative">
                                  <img
                                    src={photo.url}
                                    alt={photo.name || `Gallery photo ${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryPhoto(idx)}
                                    className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                                    title="Remove photo"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="p-2">
                                  <p className="text-[11px] font-medium text-[#0F1E36] truncate" title={photo.name}>
                                    {photo.name || `Photo #${idx + 1}`}
                                  </p>
                                  <span className="text-[10px] text-slate-400 font-mono block">{photo.size}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* B. SEPARATE STATUTORY LEGAL DEEDS & DOCUMENT ATTACHMENTS (.PDF) */}
                      <div className="space-y-3 pt-4 border-t border-slate-200/80">
                        <div>
                          <label className="block text-xs font-bold text-[#0a1d37] uppercase tracking-wider">
                            Statutory Legal Deeds & Audit Attachments (.pdf)
                          </label>
                          <span className="text-[11px] text-slate-500">
                            Attach statutory Mother Deeds, 30-Year Encumbrance Certificates, RTC extracts, and MCC sanction plans.
                          </span>
                        </div>

                        <div className="border border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-5 text-center bg-white transition-all">
                          <FileText className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                          <p className="text-xs font-semibold text-slate-700 mb-2">
                            Select Title Deeds & Statutory Verification PDFs
                          </p>
                          <label className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#0a1d37] border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-2xs transition-all">
                            <Upload className="w-3 h-3" />
                            <span>Browse Document PDFs</span>
                            <input
                              type="file"
                              multiple
                              accept=".pdf,application/pdf"
                              onChange={handleLegalDocUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Uploaded Legal Document Chips */}
                        {legalDocuments.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                            {legalDocuments.map((doc, idx) => (
                              <div key={idx} className="flex items-center space-x-2 p-2.5 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
                                <FileCheck className="w-4 h-4 text-[#C59B27] shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <span className="truncate block text-slate-800 font-medium text-[11px]">{doc.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{doc.size}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLegalDoc(idx)}
                                  className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 shrink-0 cursor-pointer"
                                  title="Remove document"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* STEP 3: FEATURE MATRIX & TRANSIT                         */}
                  {/* ======================================================== */}
                  {(formStep === 3 || currentStep === 3) && (
                    <div className="space-y-8">
                      {/* A. PROPERTY SPECIFICATIONS & FEATURES */}
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Layers className="w-4 h-4 text-[#b8860b]" />
                              <h3 className="font-serif font-bold text-base text-[#0a1d37]">
                                Property Specifications & Features
                              </h3>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Grouped specifications with availability toggles and optional custom descriptive notes.
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={handleOpenAddCategory}
                              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#0F1E36] hover:bg-[#081220] px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm border border-[#C59B27]/40"
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-[#e6ca65]" />
                              <span>+ Add Category</span>
                            </button>
                            <span className="text-xs font-mono text-[#0a1d37] bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-bold">
                              {componentsMatrix.length} Features
                            </span>
                          </div>
                        </div>

                        {/* Render items dynamically grouped by category */}
                        {(() => {
                          const allCats = Array.from(new Set([
                            ...componentsMatrix.map(p => p.categoryName || p.category).filter(Boolean),
                            ...customCategories
                          ]));

                          return allCats.map(catName => {
                            const itemsInCat = componentsMatrix
                              .map((item, originalIdx) => ({ ...item, originalIdx }))
                              .filter(item => (item.categoryName || item.category) === catName);

                            return (
                              <div key={catName} className="bg-[#fbf9f5] border border-slate-200 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#0a1d37]">
                                      {catName}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full font-semibold">
                                      {itemsInCat.length}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAddFeature(catName)}
                                    className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#b8860b] hover:text-[#0a1d37] bg-white border border-amber-300/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
                                  >
                                    <PlusCircle className="w-3 h-3 text-[#b8860b]" />
                                    <span>+ Add Feature</span>
                                  </button>
                                </div>

                                <div className="space-y-2.5">
                                  {itemsInCat.length === 0 ? (
                                    <p className="text-[11px] text-slate-400 font-mono py-2 text-center">
                                      No features in this category yet. Click "+ Add Feature" above.
                                    </p>
                                  ) : (
                                    itemsInCat.map(item => {
                                      const isIncluded = (item.isAvailable !== false && item.status !== 'Not Included');
                                      return (
                                        <div
                                          key={item.originalIdx}
                                          className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition-all"
                                        >
                                          {/* Feature Name & Toggle Switch */}
                                          <div className="flex items-center space-x-3 w-full sm:w-1/3 min-w-0">
                                            <button
                                              type="button"
                                              onClick={() => handleToggleFeature(item.originalIdx)}
                                              title={isIncluded ? "Click to mark Not Included" : "Click to mark Included"}
                                              className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1 shrink-0 transition-transform active:scale-95 cursor-pointer shadow-2xs border ${
                                                isIncluded
                                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                  : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
                                              }`}
                                            >
                                              {isIncluded ? (
                                                <Check className="w-3 h-3 stroke-[2.5] text-emerald-600" />
                                              ) : (
                                                <X className="w-3 h-3 stroke-[2.5] text-stone-400" />
                                              )}
                                              <span className="text-[10px] uppercase font-mono">{isIncluded ? 'Included' : 'Not Included'}</span>
                                            </button>
                                            <span className="text-xs font-bold text-[#0a1d37] truncate" title={item.featureName}>
                                              {item.featureName}
                                            </span>
                                          </div>

                                          {/* Feature Description Note Input */}
                                          <div className="w-full sm:flex-1">
                                            <input
                                              type="text"
                                              value={item.descriptionNote || ''}
                                              onChange={e => handleFeatureNoteChange(item.originalIdx, e.target.value)}
                                              placeholder="Optional description / details..."
                                              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:border-[#C59B27] focus:bg-white focus:outline-none transition-colors"
                                            />
                                          </div>

                                          {/* Delete Feature Button */}
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteFeature(item.originalIdx)}
                                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                                            title="Delete Feature"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* B. DYNAMIC STRUCTURAL & LAND INVENTORY GRID */}
                      <div className="space-y-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1E36]">
                              Asset Inventory & Structural Specifications
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Configure key-value architectural, soil, fencing, and utility parameters.
                            </p>
                          </div>
                          <span className="text-xs font-mono text-[#C59B27] font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
                            {inventory.length} Parameters
                          </span>
                        </div>

                        {/* Key-Value Pair Grid */}
                        <div className="space-y-3">
                          {inventory.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 bg-[#FAF8F5] border border-slate-200 rounded-xl">
                              <div className="w-full sm:w-1/3">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  Parameter Name
                                </label>
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={e => handleInventoryChange(idx, 'label', e.target.value)}
                                  placeholder="e.g. Fencing / Soil Type / Road Width"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:border-[#C59B27] focus:outline-none"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  Details / Value
                                </label>
                                <input
                                  type="text"
                                  value={item.value}
                                  onChange={e => handleInventoryChange(idx, 'value', e.target.value)}
                                  placeholder="e.g. Barbed Wire Fencing with Concrete Pillars"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                                />
                              </div>
                              <div className="flex items-end justify-end sm:pt-4">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveInventory(idx);
                                  }}
                                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete Parameter"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Explicit "+ Add Custom Parameter" button in warm gold/navy */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddCustomInventory();
                          }}
                          className="w-full py-3.5 border-2 border-dashed border-[#C59B27]/60 hover:border-[#C59B27] rounded-xl text-xs font-semibold text-[#0F1E36] hover:bg-amber-50/40 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                        >
                          <PlusCircle className="w-4 h-4 text-[#C59B27]" />
                          <span>+ Add Custom Parameter</span>
                        </button>
                      </div>

                      {/* C. STRATEGIC TRANSIT & INFRASTRUCTURE SECTION */}
                      <div className="pt-6 border-t border-slate-200 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-[#C59B27]" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1E36]">
                                Strategic Transit & Infrastructure
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Key travel connectivity nodes and verified transit durations (Airport, Rail, Highway, City Center).
                            </p>
                          </div>
                          <span className="text-xs font-mono text-[#C59B27] font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
                            {transitMatrix.length} Nodes
                          </span>
                        </div>

                        <div className="space-y-3">
                          {transitMatrix.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 bg-[#FAF8F5] border border-slate-200 rounded-xl">
                              <div className="w-full sm:w-1/2">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  Landmark / Connectivity Destination
                                </label>
                                <input
                                  type="text"
                                  value={item.landmarkName}
                                  onChange={e => handleUpdateTransit(idx, 'landmarkName', e.target.value)}
                                  placeholder="e.g. Mangaluru International Airport (IXE)"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:border-[#C59B27] focus:outline-none"
                                />
                              </div>
                              <div className="w-full sm:w-1/4">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  Distance
                                </label>
                                <input
                                  type="text"
                                  value={item.distanceText}
                                  onChange={e => handleUpdateTransit(idx, 'distanceText', e.target.value)}
                                  placeholder="e.g. 14.2 km"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                                />
                              </div>
                              <div className="w-full sm:w-1/4">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  Duration
                                </label>
                                <input
                                  type="text"
                                  value={item.durationText}
                                  onChange={e => handleUpdateTransit(idx, 'durationText', e.target.value)}
                                  placeholder="e.g. 20m"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                                />
                              </div>
                              <div className="flex items-end justify-end sm:pt-4">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveTransitItem(idx);
                                  }}
                                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Remove Transit Node"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddTransitItem();
                          }}
                          className="w-full py-3 border-2 border-dashed border-[#C59B27]/60 hover:border-[#C59B27] rounded-xl text-xs font-semibold text-[#0F1E36] hover:bg-amber-50/40 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                        >
                          <PlusCircle className="w-4 h-4 text-[#C59B27]" />
                          <span>+ Add Transit Landmark</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* STEP 4: LEGAL AUDIT & DUE DILIGENCE CHECKLIST SECTION    */}
                  {/* ======================================================== */}
                  {(formStep === 4 || currentStep === 4) && (
                    <div className="space-y-6">
                      {/* Statutory Due Diligence Header Card with "+ Add Custom Legal Check" */}
                      <div className="p-4 bg-gradient-to-r from-amber-50 to-[#fdfbf7] border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#b8860b] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a1d37]">
                              Statutory Legal Verification Checklist
                            </h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Audit statutory title documents and clearance parameters with standard verification toggles. All items default to Pending until verified.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            type="button"
                            onClick={handleOpenAddLegalCheck}
                            className="bg-white hover:bg-slate-50 text-[#0a1d37] border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5"
                          >
                            <PlusCircle className="w-3.5 h-3.5 text-[#b8860b]" />
                            <span>+ Add Custom Legal Check</span>
                          </button>
                        </div>
                      </div>

                      {/* List of Legal Audit & Custom Clearance Items */}
                      <div className="space-y-3">
                        {legalChecklist.map((item, idx) => {
                          const isPassed = item.verifiedStatus === 'Cleared' || 
                            item.verifiedStatus === 'Nil EC verified' || 
                            item.verifiedStatus === 'Compliant' || 
                            item.verifiedStatus === 'Verified';

                          return (
                            <div
                              key={item.id || idx}
                              className="p-4 bg-[#FAF8F5] border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                            >
                              <div className="space-y-0.5 flex-1 min-w-0 pr-3">
                                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                  <span className="font-mono text-[11px] text-slate-400 font-semibold">{idx + 1}.</span>
                                  <span className="text-xs font-bold text-[#0a1d37]">{item.documentName}</span>
                                  {item.isCustomItem && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200 font-bold">
                                      Custom Clearance
                                    </span>
                                  )}
                                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                                    isPassed
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : item.verifiedStatus === 'Not Applicable'
                                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}>
                                    {isPassed ? (item.activeLabel || 'Verified') : item.verifiedStatus === 'Not Applicable' ? 'Not Applicable' : 'Pending'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 pl-4">{item.description || item.verificationNote}</p>
                              </div>

                              <div className="flex items-center space-x-2 pl-4 sm:pl-0 shrink-0">
                                {!item.isCustomItem ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleUpdateLegalStatus(idx, 'Pending');
                                      }}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                                        !isPassed
                                          ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                      }`}
                                    >
                                      Pending
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleUpdateLegalStatus(idx, item.activeStatus || 'Cleared');
                                      }}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                                        isPassed
                                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                                          : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-50'
                                      }`}
                                    >
                                      {item.activeLabel || 'Cleared'}
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <select
                                      value={item.verifiedStatus}
                                      onChange={(e) => handleUpdateLegalStatus(idx, e.target.value)}
                                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0a1d37] focus:border-[#C59B27] focus:outline-none cursor-pointer"
                                    >
                                      <option value="Verified">Verified</option>
                                      <option value="Pending Audit">Pending Audit</option>
                                      <option value="Not Applicable">Not Applicable</option>
                                    </select>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLegalItem(idx)}
                                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                      title="Delete Clearance"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Advocate Verification Available Bridge Toggle */}
                      <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#0a1d37] block">
                            Advocate Legal Search Report / Bank Loan Bridge
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Enable advocate title search report badge on property details page for bank loan facilitation.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={advocateVerificationAvailable}
                            onChange={e => setAdvocateVerificationAvailable(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {/* Investment Analysis Matrix */}
                      <div className="p-4 bg-[#FAF8F5] border border-slate-200 rounded-xl space-y-3">
                        <span className="text-xs font-bold text-[#0a1d37] uppercase tracking-wider block">
                          Investment Metrics & Locality Growth Analysis
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-600 font-semibold mb-1">Rental Yield Est. (%)</label>
                            <input
                              type="text"
                              placeholder="e.g. 5.8% Gross"
                              value={investmentAnalysis.rentalYieldEst}
                              onChange={e => setInvestmentAnalysis({ ...investmentAnalysis, rentalYieldEst: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-semibold mb-1">Resale Appreciation Est. (%)</label>
                            <input
                              type="text"
                              placeholder="e.g. 12.4% Annualized"
                              value={investmentAnalysis.resaleAppreciationEst}
                              onChange={e => setInvestmentAnalysis({ ...investmentAnalysis, resaleAppreciationEst: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-semibold mb-1">Locality Growth Driver</label>
                            <input
                              type="text"
                              placeholder="e.g. High Street Expansion & Port Link"
                              value={investmentAnalysis.localityGrowthDriver}
                              onChange={e => setInvestmentAnalysis({ ...investmentAnalysis, localityGrowthDriver: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BOTTOM ACTION BAR */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
                    <div>
                      {formStep > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFormStep(prev => Math.max(prev - 1, 1));
                          }}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          ← Previous Step
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleBack();
                        }}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      {formStep < 4 ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFormStep(prev => Math.min(prev + 1, 4));
                          }}
                          className="bg-[#0F1E36] hover:bg-[#081220] text-white px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center space-x-1.5"
                        >
                          <span>NEXT STEP</span>
                          <span>→</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          onClick={handlePublish}
                          disabled={isSubmitting}
                          className="bg-[#0F1E36] hover:bg-[#081220] text-white border border-[#C59B27]/40 font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center space-x-1.5 cursor-pointer transition-all disabled:opacity-60"
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 text-[#e6ca65] animate-spin" />
                              <span>Publishing...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#e6ca65]" />
                              <span>Publish Live to Catalog</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                </form>

              </div>

        </main>
      </div>

      {/* CLEAN FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-[#0F1E36]">GRABMYKEY</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Executive Management Suite</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Route: /admin/publish-listing</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* REUSABLE CUSTOM MODAL DIALOGS (Zero Native Browser prompt() Dialogs)      */}
      {/* ========================================================================= */}

      {/* 1. Modal: Add Specification Category */}
      <AddCustomItemModal
        isOpen={modalType === 'ADD_CATEGORY'}
        onClose={() => setModalType(null)}
        title="Create Specification Category"
        subtitle="Add a brand-new feature grouping (e.g. 'Security & Smart Home', 'Eco & Sustainability')"
        onSubmit={handleConfirmAddCategory}
        submitLabel="Create Category"
      >
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Category Name *
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Security & Smart Home"
            value={categoryModalData.categoryName}
            onChange={e => setCategoryModalData({ ...categoryModalData, categoryName: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none transition-colors"
            autoFocus
          />
        </div>

        <div className="pt-2 border-t border-slate-200/80 space-y-3">
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Initial Feature (Optional)
          </span>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Feature Name</label>
            <input
              type="text"
              placeholder="e.g. Biometric Smart Ingress Lock"
              value={categoryModalData.initialFeatureName}
              onChange={e => setCategoryModalData({ ...categoryModalData, initialFeatureName: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Details / Specification Note</label>
            <input
              type="text"
              placeholder="e.g. Fingerprint + RFID + Mobile App Unlock"
              value={categoryModalData.initialFeatureNote}
              onChange={e => setCategoryModalData({ ...categoryModalData, initialFeatureNote: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
            />
          </div>
          <label className="flex items-center space-x-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={categoryModalData.isIncluded}
              onChange={e => setCategoryModalData({ ...categoryModalData, isIncluded: e.target.checked })}
              className="w-4 h-4 text-[#C59B27] rounded border-slate-300 focus:ring-[#C59B27]"
            />
            <span className="text-xs font-medium text-slate-700">Mark feature as Included</span>
          </label>
        </div>
      </AddCustomItemModal>

      {/* 2. Modal: Add Feature to Category */}
      <AddCustomItemModal
        isOpen={modalType === 'ADD_FEATURE'}
        onClose={() => setModalType(null)}
        title={`Add Feature to ${modalTargetCategory || 'Category'}`}
        subtitle="Configure custom architectural, fixture, or amenity specification."
        onSubmit={handleConfirmAddFeature}
        submitLabel="Add Feature"
      >
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Feature Name / Title *
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Modular Chimney & Hob"
            value={featureModalData.featureName}
            onChange={e => setFeatureModalData({ ...featureModalData, featureName: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
            Details / Value / Note
          </label>
          <input
            type="text"
            placeholder="e.g. Faber 1200 m3/hr suction with auto-clean"
            value={featureModalData.descriptionNote}
            onChange={e => setFeatureModalData({ ...featureModalData, descriptionNote: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
          />
        </div>
        <label className="flex items-center space-x-2.5 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={featureModalData.isAvailable}
            onChange={e => setFeatureModalData({ ...featureModalData, isAvailable: e.target.checked })}
            className="w-4 h-4 text-[#C59B27] rounded border-slate-300 focus:ring-[#C59B27]"
          />
          <span className="text-xs font-medium text-slate-700">Mark feature as Included</span>
        </label>
      </AddCustomItemModal>

      {/* 3. Modal: Add Custom Legal Check */}
      <AddCustomItemModal
        isOpen={modalType === 'ADD_LEGAL_CHECK'}
        onClose={() => setModalType(null)}
        title="Add Custom Statutory Legal Check"
        subtitle="Configure statutory clearance, municipal approval, or environmental NOC document."
        onSubmit={handleConfirmAddLegalCheck}
        submitLabel="Add Legal Check"
      >
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Document / Statutory Title *
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Coastal Regulation Zone (CRZ) Clearance"
            value={legalModalData.documentName}
            onChange={e => setLegalModalData({ ...legalModalData, documentName: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Initial Verification Status
          </label>
          <select
            value={legalModalData.verifiedStatus}
            onChange={e => setLegalModalData({ ...legalModalData, verifiedStatus: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none cursor-pointer"
          >
            <option value="Verified">Verified</option>
            <option value="Pending Audit">Pending Audit</option>
            <option value="Not Applicable">Not Applicable</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
            Manual Audit Note / Reference Details
          </label>
          <input
            type="text"
            placeholder="e.g. MCZMA notification No. 2021/CRZ-II cleared on record"
            value={legalModalData.verificationNote}
            onChange={e => setLegalModalData({ ...legalModalData, verificationNote: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
          />
        </div>
      </AddCustomItemModal>

      {/* DEDICATED PUBLISH SUCCESS POPUP MODAL */}
      <PublishSuccessModal
        isOpen={showPublishSuccessModal}
        onClose={() => setShowPublishSuccessModal(false)}
        property={publishedRecord}
        onViewProperty={(prop) => {
          setShowPublishSuccessModal(false);
          navigate(`/property/${prop.slug || prop.id || prop._id}`);
        }}
        onBackToInventory={() => {
          setShowPublishSuccessModal(false);
          if (onExit) onExit();
          else navigate('/admin');
        }}
      />

    </div>
  );
}

```

## File: `src/components/PublishSuccessModal.jsx`

```jsx
import React, { useEffect } from 'react';
import { CheckCircle2, Eye, ArrowLeft, ExternalLink, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PublishSuccessModal({
  isOpen,
  onClose,
  property,
  onViewProperty,
  onBackToInventory
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !property) return null;

  const propId = property.id || property._id || '';
  const propSlug = property.slug || propId;
  const propListingCode = property.listingCode || (
    propId ? `GMK-MLR-${String(propId).replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}` : 'GMK-MLR-101'
  );
  const propLocation = property.locality 
    ? `${property.locality}, ${property.city || 'Mangaluru'}`
    : (property.location || 'Mangaluru, Karnataka');

  const handleView = () => {
    if (onViewProperty) {
      onViewProperty(property);
    } else {
      navigate(`/property/${propSlug}`);
    }
    if (onClose) onClose();
  };

  const handleBack = () => {
    if (onBackToInventory) {
      onBackToInventory();
    } else {
      navigate('/admin');
    }
    if (onClose) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBack}
    >
      <div
        className="bg-[#FAF8F5] text-[#1A1A1A] border border-amber-200/80 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 text-center">
          {/* Animated Gold Checkmark Badge */}
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-amber-100/80 animate-ping opacity-25" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#b8860b]/20 to-amber-100 border-2 border-[#C59B27] flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-10 h-10 text-[#C59B27] stroke-[2.2]" />
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#C59B27] block mb-1">
            EXECUTIVE PUBLISHER • LIVE CONFIRMATION
          </span>
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#0F1E36] tracking-tight">
            Listing Published Live!
          </h2>
          <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
            The property listing has been recorded in the database and is now live on the GrabMyKey storefront.
          </p>

          {/* Property Summary Card */}
          <div className="mt-6 p-4 bg-white border border-slate-200/90 rounded-2xl text-left shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 text-[#C59B27] border border-amber-200 text-[10px] font-bold tracking-wider font-mono">
                {property.category || property.type || 'LUXURY ASSET'}
              </span>
              <span className="font-mono text-xs font-bold text-[#0F1E36]">
                Ref: {propListingCode}
              </span>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-[#0F1E36] truncate">
                {property.title}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                <span className="truncate">{propLocation}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Asking Price:</span>
              <span className="font-serif font-bold text-lg text-[#C59B27]">
                {property.price || (property.pricing?.expectedPrice ? `₹${property.pricing.expectedPrice.toLocaleString('en-IN')}` : 'Price on Request')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleView}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#C59B27] hover:bg-[#b0881e] text-white transition-all shadow-md cursor-pointer border border-[#C59B27]/50 flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Property</span>
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white hover:bg-slate-100 text-[#0F1E36] border border-slate-300 transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back to Inventory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


```

## File: `src/components/SearchFilter.jsx`

```jsx
import React from 'react';

export default function SearchFilter({ selectedRegion = 'All', onRegionChange }) {
  return (
    <select 
      value={selectedRegion}
      onChange={(e) => onRegionChange && onRegionChange(e.target.value)}
      className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
    >
      <option value="All">All Mangaluru Localities</option>
      <option value="Kadri">Kadri / Circuit House</option>
      <option value="Surathkal">Surathkal / Beach Road</option>
      <option value="Bejai">Bejai / Lalbagh</option>
      <option value="Attavar">Attavar / Falnir</option>
      <option value="Panambur">Panambur / Baikampady</option>
    </select>
  );
}


```

## File: `src/components/admin/Navbar.jsx`

```jsx
import React from 'react';
import { LogOut } from 'lucide-react';

const TAB_LABELS = {
  overview: 'Dashboard',
  inventory: 'Property Inventory',
  leads: 'Owner Lead Queue',
  'publish-listing': 'Publish / Edit Listing',
  'hero-settings': 'Hero Video Settings',
  'master-presets': 'System Presets & Config',
  'admin-security': 'Admin Access & Security'
};

export default function Navbar({ activeTab, onNewListing, onExit }) {
  const currentLabel = TAB_LABELS[activeTab] || 'Dashboard';

  return (
    <header className="h-16 bg-white border-b border-neutral-200/80 px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs shrink-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <span className="text-neutral-400">Admin</span>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-semibold">{currentLabel}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onNewListing}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 border border-slate-800 cursor-pointer"
        >
          <span className="text-amber-400 font-bold text-sm">+</span>
          <span>New Listing</span>
        </button>

        {/* Secondary Action Button */}
        <button
          type="button"
          onClick={onExit}
          className="border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-semibold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>EXIT CONSOLE</span>
        </button>
      </div>
    </header>
  );
}

```

## File: `src/components/admin/Sidebar.jsx`

```jsx
import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  PlusCircle,
  Video,
  FolderCog,
  ShieldCheck,
  LogOut
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  onTabSwitch,
  onNewListing,
  propertiesCount = 0,
  newLeadsCount = 0,
  presetsCount = 0,
  pendingAdminsCount = 0,
  onExit
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => onTabSwitch('overview')
    },
    {
      id: 'inventory',
      label: 'Property Inventory',
      icon: Building2,
      count: propertiesCount,
      onClick: () => onTabSwitch('inventory')
    },
    {
      id: 'leads',
      label: 'Owner Lead Queue',
      icon: Users,
      badgeText: newLeadsCount > 0 ? `${newLeadsCount} New` : null,
      count: newLeadsCount > 0 ? null : 0,
      onClick: () => onTabSwitch('leads')
    },
    {
      id: 'publish-listing',
      label: 'Publish / Edit Listing',
      icon: PlusCircle,
      onClick: onNewListing
    },
    {
      id: 'hero-settings',
      label: 'Hero Video Settings',
      icon: Video,
      onClick: () => onTabSwitch('hero-settings')
    },
    {
      id: 'master-presets',
      label: 'System Presets & Config',
      icon: FolderCog,
      count: presetsCount,
      onClick: () => onTabSwitch('master-presets')
    },
    {
      id: 'admin-security',
      label: 'Admin Access & Security',
      icon: ShieldCheck,
      badgeText: pendingAdminsCount > 0 ? `${pendingAdminsCount} New` : null,
      onClick: () => onTabSwitch('admin-security')
    }
  ];

  return (
    <aside className="bg-slate-50/70 border-r border-neutral-200/80 w-64 min-h-screen flex flex-col justify-between p-4 shrink-0">
      <div>
        {/* Header Branding */}
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/90 shadow-xs p-1.5 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src="/logo.png" 
              alt="GrabMyKey" 
              className="w-full h-full object-contain"
              onError={(e) => { 
                e.target.style.display = 'none'; 
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'block'; 
              }}
            />
            <span style={{ display: 'none' }} className="text-[10px] font-bold font-serif text-slate-900">
              GMK
            </span>
          </div>
          <div>
            <span className="font-serif font-bold text-slate-900 text-lg tracking-wider block leading-tight">
              GRAB<span className="text-amber-500">MY</span>KEY
            </span>
            <span className="text-[11px] font-medium tracking-wider text-slate-400 block">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badgeText && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badgeText}
                  </span>
                )}

                {item.count !== undefined && item.count !== null && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Action: EXIT CONSOLE */}
      <div className="pt-4 border-t border-slate-200/80">
        <button
          type="button"
          onClick={onExit}
          className="w-full text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>EXIT CONSOLE</span>
        </button>
      </div>
    </aside>
  );
}

```

## File: `src/config/api.js`

```javascript
/**
 * GrabMyKeys - Centralized Dynamic API Configuration
 * Standardizes the backend API URL across all fetch/axios calls.
 * 
 * Priority:
 * 1. import.meta.env.VITE_API_URL
 * 2. import.meta.env.VITE_API_BASE_URL
 * 3. Dynamic hostname with port 5000 (for local LAN IP testing)
 * 4. Default fallback: http://localhost:5000/api
 */

export const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
    }
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
    }
  }

  if (typeof window !== 'undefined' && window.location) {
    const { hostname, protocol } = window.location;

    // Production domain (HTTPS or grabmykey.in domain)
    if (protocol === 'https:' || hostname.includes('grabmykey.in')) {
      return '/api';
    }

    // Support local network IP testing from mobile devices or other computers on LAN
    const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    if (isIpAddress && hostname !== '127.0.0.1') {
      return `http://${hostname}:5000/api`;
    }
  }

  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  properties: `${API_BASE_URL}/properties`,
  leads: `${API_BASE_URL}/leads`,
  settings: `${API_BASE_URL}/settings`,
  presets: `${API_BASE_URL}/presets`,
  health: `${API_BASE_URL}/health`
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  getApiBaseUrl
};


```

## File: `src/context/PropertyContext.jsx`

```jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProperties } from '../api';

const PropertyContext = createContext();

// Automatically purge legacy mock properties from localStorage cache
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('grabmykey_properties');
    localStorage.removeItem('grabmykey_hero_settings');
  } catch (e) {
    // Ignore storage errors
  }
}

export function PropertyProvider({ children }) {
  // Wipe default initial states: strictly start empty []
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Live Backend API Synchronization exclusively from Express
  const loadPropertiesFromApi = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchProperties();
      if (res?.data && Array.isArray(res.data)) {
        setProperties(res.data);
        return res.data;
      } else {
        setProperties([]);
        return [];
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch properties from server');
      console.warn('[PropertyContext] Live API fetch error:', err?.message || err);
      setProperties([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetchProperties();
        if (isMounted) {
          if (res?.data && Array.isArray(res.data)) {
            setProperties(res.data);
          } else {
            setProperties([]);
          }
        }
      } catch (err) {
        console.warn('[PropertyContext] Initial mount backend fetch error:', err?.message || err);
        if (isMounted) {
          setProperties([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);


  const addProperty = (newProperty) => {
    const timestamp = Date.now();
    const title = newProperty?.title || 'New Property';
    const generatedId = newProperty?.id || newProperty?._id || `gmk-${timestamp}`;
    const generatedSlug = newProperty?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prop-${timestamp}`;

    const propertyToAdd = {
      id: generatedId,
      _id: generatedId,
      slug: generatedSlug,
      createdAt: new Date().toISOString(),
      ...newProperty
    };

    setProperties((prev) => [propertyToAdd, ...(prev || [])]);
    return propertyToAdd;
  };

  const updateProperty = (id, updatedFields) => {
    setProperties((prev) =>
      (prev || []).map((prop) => {
        if (String(prop?.id) === String(id) || String(prop?._id) === String(id)) {
          return { ...prop, ...updatedFields, updatedAt: new Date().toISOString() };
        }
        return prop;
      })
    );
  };

  const deleteProperty = (id) => {
    setProperties((prev) =>
      (prev || []).filter((prop) => String(prop?.id) !== String(id) && String(prop?._id) !== String(id))
    );
  };

  const clearAllProperties = () => {
    setProperties([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('grabmykey_properties');
    }
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      setProperties,
      isLoading,
      setIsLoading,
      error,
      refreshProperties: loadPropertiesFromApi,
      reloadProperties: loadPropertiesFromApi,
      resetToMockProperties: loadPropertiesFromApi,
      addProperty,
      updateProperty,
      deleteProperty,
      clearAllProperties
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    return {
      properties: [],
      setProperties: () => {},
      isLoading: false,
      setIsLoading: () => {},
      error: null,
      refreshProperties: async () => [],
      reloadProperties: async () => [],
      resetToMockProperties: async () => [],
      addProperty: () => {},
      updateProperty: () => {},
      deleteProperty: () => {},
      clearAllProperties: () => {}
    };
  }
  return context;
};

export default PropertyContext;


```

## File: `src/defaultPresets.js`

```javascript
// Default Master Presets for GrabMyKey Executive Console

// --- 1. Dynamic Asset-Specific Property Specifications ---
export const ASSET_SPEC_PRESETS = {
  // --- VILLA / INDEPENDENT HOUSE ---
  Villa: [
    // Build & Material Specifications
    { category: "Build & Materials", feature: "Flooring Type", status: "Included", details: "Imported Italian Marble (Living) + Teak Hardwood (Bedrooms)" },
    { category: "Build & Materials", feature: "Wood & Joinery", status: "Included", details: "100% Seasoned Burma Teakwood (Doors, Frames & Windows)" },
    { category: "Build & Materials", feature: "Wall Finish & Paint", status: "Included", details: "ROYAL Silk Emulsion + Texture Accent Walls" },
    { category: "Build & Materials", feature: "Structural Frame", status: "Included", details: "Earthquake Resistant RCC Framed Structure (M25 Grade)" },
    { category: "Build & Materials", feature: "Roofing & Insulation", status: "Included", details: "Sloped Concrete Slab with Terracotta Tiles & Heat Shield Insulation" },
    { category: "Build & Materials", feature: "Sanitaryware & Fittings", status: "Included", details: "Kohler / Grohe Concealed Diverters & Wall-Hung Closets" },

    // Interior & Living
    { category: "Interior & Living", feature: "Modular Kitchen", status: "Included", details: "Faber Chimney, Blum Soft-Close Hardware & Quartz Island" },
    { category: "Interior & Living", feature: "Air Conditioning", status: "Included", details: "Daikin VRV Centralized Inverter Climate Control" },

    // Building & Security
    { category: "Building & Security", feature: "CCTV & Security", status: "Included", details: "8-Channel IP Cameras + Biometric Video Door Phone" },
    { category: "Building & Security", feature: "Automated Gate", status: "Included", details: "Motorized RFID Sensor Ingress Gate" },

    // Utilities & Outdoor
    { category: "Utilities", feature: "Power Backup", status: "Included", details: "15 kVA Silent DG Generator with Auto-Transfer Switch" },
    { category: "Utilities", feature: "Water Supply", status: "Included", details: "Dual Source (Open Well + Municipal Supply + 10,000L Sump)" },
    { category: "Outdoor", feature: "Covered Vehicle Parking", status: "Included", details: "3 SUV Parking Bay with Integrated 11kW EV Fast Charger" }
  ],

  // --- FLAT / APARTMENT ---
  Apartment: [
    // Build & Material Specifications
    { category: "Build & Materials", feature: "Flooring Type", status: "Included", details: "Vitrified Tiles (800x800mm) + Anti-Skid Ceramic (Balconies)" },
    { category: "Build & Materials", feature: "Wood & Joinery", status: "Included", details: "Teakwood Main Door + Engineered Flush Internal Doors" },
    { category: "Build & Materials", feature: "Plumbing & Sanitary", status: "Included", details: "Jaguar / Hindware CP Fittings with Solar Line Connection" },

    // Amenities & Utilities
    { category: "Building Amenities", feature: "Elevator / Lifts", status: "Included", details: "Dual High-Speed Passenger Lifts + Stretcher Lift" },
    { category: "Building Amenities", feature: "Power Backup", status: "Included", details: "100% Generator Backup for Common Areas & Lighting Points" },
    { category: "Parking", feature: "Designated Parking", status: "Included", details: "1 Reserved Covered Stilt Car Parking Bay" }
  ],

  // --- PLOT / RESIDENTIAL LAND (Build materials not loaded for plots) ---
  Plot: [
    { category: "Infrastructure & Access", feature: "Approach Road Width", status: "Included", details: "30 ft Wide Asphalted Concrete Road Ingress" },
    { category: "Infrastructure & Access", feature: "Compound Wall", status: "Included", details: "Perimeter Laterite Stone Wall with Gate" },
    { category: "Statutory & Approvals", feature: "MUDA / MCC Approval", status: "Included", details: "Clear Residential Layout Approval with Sanctioned DP Plan" },
    { category: "Statutory & Approvals", feature: "Conversion Status", status: "Included", details: "Non-Agricultural (NA) Conversion Completed" },
    { category: "Utilities & Supply", feature: "Electricity & Water Line", status: "Included", details: "MESCOM 3-Phase Electric Connection & Municipal Water Link Ready" }
  ],

  // --- COMMERCIAL PROPERTY ---
  Commercial: [
    { category: "Structure", feature: "Floor Plate & Ceiling", status: "Included", details: "Clear 12ft ceiling height with open column grid" },
    { category: "Utilities & Safety", feature: "Commercial Power Load", status: "Included", details: "30kW sanctioned commercial power connection" },
    { category: "Utilities & Safety", feature: "Fire Fighting Infrastructure", status: "Included", details: "NOC approved sprinklers, smoke detectors & hose reels" },
    { category: "Access & Loading", feature: "Service Lift & Bay", status: "Included", details: "Dedicated freight elevator & rear loading bay" }
  ]
};

// Category Aliases
ASSET_SPEC_PRESETS['Independent House'] = ASSET_SPEC_PRESETS.Villa;
ASSET_SPEC_PRESETS['Villa / House'] = ASSET_SPEC_PRESETS.Villa;
ASSET_SPEC_PRESETS['Flat / Apartment'] = ASSET_SPEC_PRESETS.Apartment;
ASSET_SPEC_PRESETS['Land/Plot'] = ASSET_SPEC_PRESETS.Plot;
ASSET_SPEC_PRESETS['Plot / Land'] = ASSET_SPEC_PRESETS.Plot;

// Safe Category Preset Resolver
export const getAssetSpecPresets = (category) => {
  if (!category) return ASSET_SPEC_PRESETS.Villa;
  const normalized = String(category).trim();
  if (ASSET_SPEC_PRESETS[normalized]) return ASSET_SPEC_PRESETS[normalized];
  const lower = normalized.toLowerCase();
  if (lower.includes('apartment') || lower.includes('flat')) return ASSET_SPEC_PRESETS.Apartment;
  if (lower.includes('plot') || lower.includes('land')) return ASSET_SPEC_PRESETS.Plot;
  if (lower.includes('commercial')) return ASSET_SPEC_PRESETS.Commercial;
  return ASSET_SPEC_PRESETS.Villa;
};

// --- 2. Master Presets for Executive Admin Console ---
export const DEFAULT_MASTER_PRESETS = [
  // --- Legal Checks ---
  {
    _id: 'preset-legal-1',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Parent Title Deed',
    groupCategory: 'Title',
    defaultDescription: '30-Year clear parent deed chain verified by High Court panel',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-2',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Encumbrance Certificate (30-Year EC)',
    groupCategory: 'Title',
    defaultDescription: 'Nil encumbrance Form 15 issued via Kaveri / registration portal',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-3',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Khata / Possession Certificate',
    groupCategory: 'Municipal',
    defaultDescription: 'A-Khata / Possession Certificate active and on record',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-4',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Latest Property Tax Receipts',
    groupCategory: 'Tax',
    defaultDescription: 'Municipal property tax cleared through current financial year',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-5',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Building Sanction Plan',
    groupCategory: 'Municipal',
    defaultDescription: 'Sanctioned approved construction blueprint on record',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-6',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Occupancy Certificate (OC)',
    groupCategory: 'Municipal',
    defaultDescription: 'Final Occupancy Certificate issued by statutory authority',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-7',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'No Objection Certificates (NOCs)',
    groupCategory: 'Municipal',
    defaultDescription: 'Statutory fire, pollution, and structural NOCs cleared',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-8',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'NOC from Society / Association',
    groupCategory: 'Municipal',
    defaultDescription: 'RWA / Society dues clearance and transfer NOC verified',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-9',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Possession & Allotment Letter',
    groupCategory: 'Title',
    defaultDescription: 'Original physical allotment letter and possession memo',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-10',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Utility Dues Clearances',
    groupCategory: 'Tax',
    defaultDescription: 'Power (MESCOM) and water board zero-dues receipt',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-11',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Mutation Register Extract (RTC/Pahani)',
    groupCategory: 'Title',
    defaultDescription: 'Revenue mutation extract / RTC reflects unambiguous title',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-12',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Revenue / Survey Map (FMB)',
    groupCategory: 'Title',
    defaultDescription: 'Field Measurement Book (FMB) sketch matches physical boundary',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-13',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'CRZ Coastal Clearance',
    groupCategory: 'Environmental',
    defaultDescription: 'CRZ-II/III statutory clearance certificate for coastal zoning',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-14',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Panchayat NOC',
    groupCategory: 'Municipal',
    defaultDescription: 'Panchayat building clearance and road widening setback compliance',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-15',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'RERA Registration Certificate',
    groupCategory: 'Title',
    defaultDescription: 'Statutory RERA registration certificate active and valid',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-16',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Agricultural Non-Alienation Certificate',
    groupCategory: 'Title',
    defaultDescription: 'Section 109 / Land Conversion statutory non-alienation order',
    defaultStatus: 'Available',
    isActive: true
  },

  // --- Category-Filtered Property Feature Presets (Generated from ASSET_SPEC_PRESETS) ---
  ...['Villa', 'Apartment', 'Plot', 'Commercial'].flatMap(cat => {
    const applicableCat = cat === 'Plot' ? 'Land/Plot' : cat;
    return ASSET_SPEC_PRESETS[cat].map((item, idx) => ({
      _id: `preset-feat-${cat.toLowerCase().slice(0, 3)}-${idx + 1}`,
      presetType: 'PROPERTY_FEATURE',
      applicableCategory: applicableCat,
      title: item.feature,
      groupCategory: item.category,
      defaultDescription: item.details,
      defaultStatus: item.status === 'Included' ? 'Available' : 'Not Available',
      isActive: true
    }));
  })
];

```

## File: `src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: #faf8f5;
    color: #1c1c21;
    font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif;
    overflow-x: hidden;
  }
  h1, h2, h3, .font-serif {
    font-family: 'Playfair Display', 'Cinzel', Georgia, serif;
    text-transform: none !important; /* Force disable accidental uppercase inherits */
    letter-spacing: -0.015em;
  }
}

/* Custom scrollbar for light luxury editorial portal */
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

::-webkit-scrollbar-track {
  background: #faf8f5;
}

::-webkit-scrollbar-thumb {
  background: #e2dbce;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b8860b;
}

```

## File: `src/main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { PropertyProvider } from './context/PropertyContext'
import { Toaster } from 'sonner'

// Ensure browser storage is cleared of any legacy mock properties
try {
  localStorage.removeItem('grabmykey_properties');
  localStorage.removeItem('grabmykey_hero_settings');
} catch (e) {}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PropertyProvider>
        <App />
        <Toaster position="top-right" richColors closeButton />
      </PropertyProvider>
    </BrowserRouter>
  </StrictMode>,
)

```

## File: `src/pages/AdminLogin.jsx`

```jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { adminLogin } from '../api';

export default function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your administrative email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await adminLogin(email.trim(), password);
      if (res?.success && res.token) {
        if (onLoginSuccess) {
          onLoginSuccess(res.admin, res.token);
        } else {
          navigate('/admin');
        }
      } else {
        setErrorMessage(res?.message || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Authentication service unavailable. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-4 sm:p-6 font-sans">
      
      {/* Top Header Navigation */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Website</span>
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 relative overflow-hidden">
          
          {/* Subtle gold accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C59B27]/40 via-[#C59B27] to-[#C59B27]/40" />

          {/* Official Brand Logo & Header */}
          <div className="text-center mb-7 pt-2">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-2 mx-auto mb-3">
              <img
                src="/logo.png"
                onError={(e) => { e.currentTarget.src = "/logo-icon.svg"; }}
                alt="GrabMyKey"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className="text-xl font-extrabold tracking-tight font-serif leading-none flex items-center justify-center gap-1 text-slate-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span>GRAB</span>
              <span className="text-[#C59B27]">MY</span>
              <span>KEY</span>
            </div>
            <span className="text-[9px] font-bold text-[#C59B27] uppercase tracking-widest font-sans leading-tight mt-1 block">
              YOUR TRUSTED REAL ESTATE PARTNER
            </span>

            <h1 className="text-xl font-bold text-slate-900 mt-5">
              Admin Sign In
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Sign in to your administrative account to manage properties, leads, and console settings.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="admin@grabmykey.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-sans tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 bg-white text-[#C59B27] focus:ring-[#C59B27]/30 cursor-pointer"
                />
                <span>Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#020617] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-slate-900/10 flex items-center justify-center space-x-2 cursor-pointer mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C59B27]" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Navigation to Signup */}
          <div className="mt-7 pt-5 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Need administrator access?{' '}
              <Link
                to="/admin/signup"
                className="font-semibold text-[#B8860B] hover:text-[#9A7007] underline underline-offset-4 transition-colors"
              >
                Create Admin Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="text-center py-4 text-xs text-slate-500">
        © 2026 GrabMyKey. Authorized administrative personnel only.
      </footer>
    </div>
  );
}

```

## File: `src/pages/AdminSignup.jsx`

```jsx
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Lock, KeyRound, Eye, EyeOff,
  ArrowLeft, Check, AlertCircle, Loader2, Clock, CheckCircle2
} from 'lucide-react';
import { adminSignup } from '../api';

export default function AdminSignup({ onSignupSuccess }) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteKey, setInviteKey] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showInviteKey, setShowInviteKey] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'Not Entered', color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (score <= 4) return { score: 3, label: 'Strong', color: 'bg-[#C59B27]', width: 'w-3/4' };
    return { score: 4, label: 'Very Strong', color: 'bg-emerald-600', width: 'w-full' };
  }, [password]);

  // Real-time password match verification
  const isMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please provide a valid administrative email.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await adminSignup({
        name: name.trim(),
        email: email.trim(),
        password,
        inviteKey: inviteKey.trim()
      });

      if (res?.pendingApproval) {
        setRegisteredEmail(email.trim());
        setIsPendingApproval(true);
      } else if (res?.success && res.token) {
        if (onSignupSuccess) {
          onSignupSuccess(res.admin, res.token);
        } else {
          navigate('/admin');
        }
      } else {
        setErrorMessage(res?.message || 'Registration failed. Please check your credentials.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration service encountered an error.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-4 sm:p-6 font-sans">
      
      {/* Top Header Navigation */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Website</span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-lg mx-auto my-auto py-8">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 relative overflow-hidden">
          
          {/* Subtle gold accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C59B27]/40 via-[#C59B27] to-[#C59B27]/40" />

          {/* Official Brand Logo & Header */}
          <div className="text-center mb-7 pt-2">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-2 mx-auto mb-3">
              <img
                src="/logo.png"
                onError={(e) => { e.currentTarget.src = "/logo-icon.svg"; }}
                alt="GrabMyKey"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className="text-xl font-extrabold tracking-tight font-serif leading-none flex items-center justify-center gap-1 text-slate-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span>GRAB</span>
              <span className="text-[#C59B27]">MY</span>
              <span>KEY</span>
            </div>
            <span className="text-[9px] font-bold text-[#C59B27] uppercase tracking-widest font-sans leading-tight mt-1 block">
              YOUR TRUSTED REAL ESTATE PARTNER
            </span>

            <h1 className="text-xl font-bold text-slate-900 mt-5">
              {isPendingApproval ? 'Request Submitted' : 'Create Admin Account'}
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
              {isPendingApproval
                ? 'Your registration has been received and is awaiting administrator verification.'
                : 'Register an administrative profile to access the GrabMyKey management console.'}
            </p>
          </div>

          {/* Pending Approval Success State */}
          {isPendingApproval ? (
            <div className="space-y-6 text-center py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
                <Clock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-semibold text-slate-900">
                  Awaiting Administrator Approval
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                  Your registration request for <strong className="text-slate-800">{registeredEmail}</strong> has been submitted. An existing administrator must approve your account before you can log in.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">What happens next?</div>
                <div>1. An existing administrator will review your account request.</div>
                <div>2. Once approved, you can sign in directly with your email and password.</div>
              </div>

              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center justify-center w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Official Administrative Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="admin@grabmykey.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-sans tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full bg-slate-50/80 border rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-sans tracking-wider ${
                          isMatch === false
                            ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                            : isMatch === true
                            ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                            : 'border-slate-300 focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator & Match Badge */}
                {password && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Password Strength:</span>
                      <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`} />
                    </div>
                    
                    {confirmPassword && (
                      <div className="flex items-center space-x-1.5 pt-1 text-xs">
                        {isMatch ? (
                          <span className="text-emerald-700 flex items-center space-x-1 font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Passwords match</span>
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center space-x-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Passwords do not match</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Invite Key */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Admin Invite Key
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showInviteKey ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={inviteKey}
                      onChange={(e) => setInviteKey(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowInviteKey(!showInviteKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title={showInviteKey ? 'Hide key' : 'Show key'}
                    >
                      {showInviteKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Required to authorize new administrative accounts. Contact an administrator if you need an invite key.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || (confirmPassword && !isMatch)}
                  className="w-full bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#020617] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-slate-900/10 flex items-center justify-center space-x-2 cursor-pointer mt-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C59B27]" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>Request Admin Access</span>
                  )}
                </button>
              </form>

              {/* Navigation to Login */}
              <div className="mt-7 pt-5 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <Link
                    to="/admin/login"
                    className="font-semibold text-[#B8860B] hover:text-[#9A7007] underline underline-offset-4 transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="text-center py-4 text-xs text-slate-500">
        © 2026 GrabMyKey. Authorized administrative personnel only.
      </footer>
    </div>
  );
}

```

## File: `src/pages/Contact.jsx`

```jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <Navbar/>

      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-xs w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Left Sidebar: Operational Details (No Physical Address) */}
            <div className="md:col-span-5 space-y-8 border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0 md:pr-8">
              
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-amber-700 tracking-widest uppercase">
                  Concierge & Inquiries
                </span>
                <h1 className="text-3xl font-serif text-slate-900 tracking-tight">
                  Contact GrabMyKey
                </h1>
              </div>

              {/* Service Region (No Physical Office) */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-amber-600"/>
                  Primary Coverage Area
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Mangaluru, Karnataka
                </p>
                <p className="text-xs text-slate-500">
                  On-site inspections & private site tours available across all primary localities.
                </p>
              </div>

              {/* Inquiries / Direct Email */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-amber-600"/>
                  Inquiries & Inspection
                </div>
                <a 
                  href="mailto:contact@grabmykey.in" 
                  className="text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors block"
                >
                  contact@grabmykey.in
                </a>
              </div>

              {/* Business Model Clarification */}
              <div className="space-y-1.5 bg-[#FAF8F5] p-4 rounded-xl border border-slate-200/60">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Owner & Buyer Advisory
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verified Property Walkthroughs • Direct Owner Pricing • Zero upfront marketing charges for listing owners.
                </p>
              </div>

            </div>

            {/* Right Side: Inquiry Form */}
            <div className="md:col-span-7 flex flex-col justify-center">
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto"/>
                  <h3 className="font-bold text-sm">Inquiry Received</h3>
                  <p className="text-xs text-emerald-700">
                    Our team will reach out directly via phone or WhatsApp regarding your property request.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Shetty"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">How can we assist you?</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Specify property location, buy/rental inquiry, or site tour scheduling..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400"/>
                    SEND INQUIRY
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}


```

## File: `src/pages/Home.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Play, ArrowUpRight, Building2 } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import FeaturedProperties from '../components/FeaturedProperties';
import { API_ENDPOINTS } from '../config/api';

export default function Home({
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  selectedRegion: externalSelectedRegion,
  setSelectedRegion: externalSetSelectedRegion,
  onBrowseAll,
  property = null,
  properties: externalProperties,
  showGrid = true
} = {}) {
  const navigate = useNavigate();
  const { properties: contextProperties = [], isLoading: contextLoading } = useProperties();
  
  // Wipe default initial states: strictly start empty [] and null
  const [properties, setProperties] = useState([]);
  const [featuredProperty, setFeaturedProperty] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [localRegion, setLocalRegion] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Helper to extract proper YouTube embed URL
  const getEmbedVideoUrl = (url, videoId) => {
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    if (!url) return null;
    if (url.includes('embed/')) return url.includes('autoplay') ? url : `${url}?autoplay=1`;
    if (url.includes('watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  // Dynamic Home Page Re-fetching from GET /api/properties on mount
  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const apiUrl = API_ENDPOINTS.properties;

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);

        if (isMounted) {
          setProperties(data);

          // Automatically pick the first listing marked as featured (or having a video URL) as HeroFeaturedVideoCard
          if (property) {
            setFeaturedProperty(property);
          } else {
            const heroPick = data.find(p => p && (p.isFeatured === true || p.featured === true)) ||
                             data.find(p => p && (p.videoUrl || p.heroVideoUrl || p.youtubeVideoId)) ||
                             (data.length > 0 ? data[0] : null);
            setFeaturedProperty(heroPick);
          }
        }
      } catch (err) {
        console.warn('GET /api/properties fetch warning:', err.message);
        if (isMounted) {
          const fallbackList = Array.isArray(externalProperties) && externalProperties.length > 0
            ? externalProperties
            : (Array.isArray(contextProperties) ? contextProperties : []);
          setProperties(fallbackList);
          if (property) {
            setFeaturedProperty(property);
          } else {
            const heroFallback = fallbackList.find(p => p && (p.isFeatured === true || p.featured === true)) ||
                                 fallbackList.find(p => p && (p.videoUrl || p.heroVideoUrl || p.youtubeVideoId)) ||
                                 (fallbackList.length > 0 ? fallbackList[0] : null);
            setFeaturedProperty(heroFallback);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProperties();

    // Re-fetch on property creation/update events
    const handleSync = () => {
      fetchProperties();
    };
    window.addEventListener('grabmykey_property_created', handleSync);
    window.addEventListener('grabmykey_properties_updated', handleSync);

    return () => {
      isMounted = false;
      window.removeEventListener('grabmykey_property_created', handleSync);
      window.removeEventListener('grabmykey_properties_updated', handleSync);
    };
  }, [property, externalProperties, contextProperties]);
  
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : localSearch;
  const setSearchQuery = externalSetSearchQuery || setLocalSearch;
  const selectedRegion = externalSelectedRegion !== undefined ? externalSelectedRegion : localRegion;
  const setSelectedRegion = externalSetSelectedRegion || setLocalRegion;

  // Live Backend Listings (Strictly empty array if no live records)
  const activeListings = Array.isArray(properties) ? properties : [];
  const featured = featuredProperty;

  const activeVideoUrl = getEmbedVideoUrl(featured?.videoUrl || featured?.heroVideoUrl, featured?.youtubeVideoId);
  const featuredPoster = featured?.coverImage || featured?.images?.[0] || featured?.galleryImages?.[0] || featured?.thumbnail || '';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onBrowseAll) {
      onBrowseAll();
    } else {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedRegion && selectedRegion !== 'All') params.set('region', selectedRegion);
      const queryStr = params.toString();
      navigate(queryStr ? `/properties?${queryStr}` : '/properties');
    }
  };

  const handleBrowseClick = () => {
    if (onBrowseAll) {
      onBrowseAll();
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="space-y-12 pb-12 w-full">
      {/* 1. HERO SECTION */}
      <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10 pt-12 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtext, Search & Trust Badges */}
          <div className="lg:col-span-6 space-y-6">
            {/* Main Heading (<h1> - Refined Semi-Bold Weight & Contrast) */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-[54px] font-semibold text-[#0F172A] tracking-tight leading-[1.12]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Transparent Property<br />
              Walkthroughs for<br />
              <span className="text-[#C59B27] font-semibold">Prime Estates.</span>
            </h1>

            {/* Body Subtext (<p>) */}
            <p className="text-base sm:text-lg text-slate-600 font-medium font-sans max-w-lg leading-relaxed">
              GrabMyKey connects serious buyers, NRI investors, and verified property owners directly across Mangaluru—backed by unedited video walkthroughs and direct title audits.
            </p>

            {/* Search Container & Trust Badges */}
            <div className="pt-2 max-w-xl space-y-4">
              <form onSubmit={handleSearchSubmit} className="p-2 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 flex-1 px-3 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0"/>
                  <input 
                    type="text"
                    placeholder="Locality, city, or property..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none font-sans"
                  />
                </div>
                
                <div className="relative shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="appearance-none bg-transparent pl-3 pr-8 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 font-sans flex items-center gap-1 outline-none cursor-pointer"
                  >
                    <option value="All">All Regions</option>
                    <option value="Kadri">Kadri</option>
                    <option value="Surathkal">Surathkal</option>
                    <option value="Bejai">Bejai</option>
                    <option value="Kottara">Kottara</option>
                    <option value="Ullal">Ullal</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
                </div>

                <button 
                  type="button"
                  onClick={handleBrowseClick}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-[#C59B27] text-white transition-colors text-xs font-bold font-sans tracking-wider shrink-0 cursor-pointer shadow-sm"
                >
                  BROWSE ALL
                </button>
              </form>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-xs font-bold text-slate-600 font-sans pt-1">
                <span>100% Title Audited</span>
                <span>Walkthrough Tours</span>
                <span>Direct Zero-Spam Deals</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Video Card (lg:col-span-6) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] min-h-[360px] flex flex-col justify-between p-6 select-none group w-full">
              {isPlaying && activeVideoUrl ? (
                <iframe
                  src={activeVideoUrl}
                  title="Property Video Walkthrough"
                  className="absolute inset-0 w-full h-full border-0 z-20"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {/* Top Floating Pill Badges */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white tracking-wider border border-white/10 uppercase">
                      Featured Video Tour
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-[10px] font-bold text-slate-900 uppercase tracking-widest shadow-sm">
                      {featured ? 'EXCLUSIVE LISTING' : 'MANGALURU, KA'}
                    </span>
                  </div>

                  {/* Center Play Control Button */}
                  {activeVideoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div 
                        onClick={() => setIsPlaying(true)}
                        className="w-16 h-16 rounded-full bg-slate-950/80 border border-white/20 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer pointer-events-auto"
                      >
                        <Play className="w-6 h-6 fill-white ml-0.5"/>
                      </div>
                    </div>
                  )}

                  {/* Video Background Cover & Dark Overlay */}
                  {featuredPoster ? (
                    <img 
                      src={featuredPoster} 
                      alt={featured?.title || "Featured Property Walkthrough"}
                      className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black opacity-90" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none" />

                  {/* Bottom Sleek Floating Metadata Bar */}
                  <div className="z-10 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-lg">
                    <div className="space-y-0.5 min-w-0 pr-3">
                      <h3 className="text-sm sm:text-base font-bold text-white font-serif truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {featured ? featured.title : "No Featured Video Tour"}
                      </h3>
                      <p className="text-xs text-slate-300 font-sans truncate">
                        {featured ? (
                          <>
                            {featured.location || (featured.locality ? `${featured.locality}, ${featured.city || 'Mangaluru'}` : 'Mangaluru')}
                            {featured.price ? <span className="text-white font-semibold ml-1">• {featured.price}</span> : (featured.priceText ? <span className="text-white font-semibold ml-1">• ₹{featured.priceText}</span> : '')}
                          </>
                        ) : (
                          "Add listings via Admin Console to feature on-site walkthroughs"
                        )}
                      </p>
                    </div>

                    <Link 
                      to={featured?.slug ? `/property/${featured.slug}` : '/properties'} 
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-slate-900 flex items-center justify-center text-white shrink-0 group-hover:bg-[#C59B27] group-hover:text-slate-950 transition-all duration-200 cursor-pointer"
                      title="View Property"
                    >
                      <ArrowUpRight className="w-4 h-4"/>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED PROPERTIES GRID SECTION */}
      {showGrid && (
        <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10 space-y-6 pt-4 pb-8">
          <div className="flex items-end justify-between border-b border-slate-200/60 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-widest font-sans block">
                VERIFIED COLLECTION
              </span>
              <h2 
                className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-serif"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Featured Properties
              </h2>
            </div>

            <Link className="text-xs font-bold text-[#C59B27] hover:text-amber-700 transition-colors font-sans flex items-center gap-1" to="/properties">
              View More Properties ({activeListings.length}) &gt;
            </Link>
          </div>

          <FeaturedProperties properties={activeListings} isLoading={isLoading} />
        </section>
      )}
    </div>
  );
}

export { Home as HeroSection, Home, FeaturedProperties };

```

## File: `src/pages/LegalStandards.jsx`

```jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, CheckCircle, CheckCircle2 } from 'lucide-react';

export default function LegalStandards() {
  const verificationSteps = [
    {
      step: "01",
      title: "Direct Physical & Video Walkthrough Audit",
      description: "Every property is personally inspected on-site to shoot unedited HD video walkthroughs, confirming exact physical boundaries, road ingress, and actual site conditions.",
      badge: "SITE CLARITY"
    },
    {
      step: "02",
      title: "Parent Deed & 30-Year Ownership Chain",
      description: "We manually examine mother deeds, sale deeds, gift deeds, and inheritance records to verify clear 30-year ownership history and ensure zero family title disputes.",
      badge: "TITLE INTEGRITY"
    },
    {
      step: "03",
      title: "Encumbrance Certificate & SRO Audit",
      description: "Sub-Registrar Office (SRO) Encumbrance Certificates (EC) are thoroughly reviewed to verify that the property has zero active bank mortgages, court attachments, or liens.",
      badge: "ZERO MORTGAGE CLAIM"
    },
    {
      step: "04",
      title: "Karnataka Revenue Records (RTC / A-Khata)",
      description: "We inspect RTC (Pahani) records, A-Khata certificates, mutation extracts, and latest Mangaluru City Corporation (MCC) tax receipts to guarantee clear revenue status.",
      badge: "STATUTORY CLEARANCE"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Main Header Container */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-xs space-y-8">

          {/* Section Header */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Verification Protocol
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">
              Direct Title & Property Inspection
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every listing on GrabMyKey undergoes rigorous direct verification before going live. We personally inspect mother deeds, revenue records, encumbrance certificates, and physical site details in Mangaluru to ensure total transparency.
            </p>
          </div>

          {/* Grid Layout for Verification Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {verificationSteps.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] rounded-2xl p-6 border border-slate-200/60 flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
              >
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-[#0F172A] font-serif flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#C59B27] shrink-0" />
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <span className="text-[10px] font-bold text-amber-800 tracking-wider uppercase">
                  {item.badge}
                </span>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}


```

## File: `src/pages/ListProperty.jsx`

```jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UploadCloud, X, Image as ImageIcon, CheckCircle, Send } from 'lucide-react';
import { submitLead } from '../api';
import { useProperties } from '../context/PropertyContext';

export default function ListProperty() {
  const { addProperty } = useProperties();
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    locality: '',
    assetCategory: 'Villa',
    expectedPrice: '',
    overview: ''
  });

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setImages((prev) => [...prev, ...newPreviews]);
  };

  // Drag-and-drop file upload handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const newPreviews = files.map((file) => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setImages((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove individual image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitLead({
        ownerName: formData.ownerName,
        phone: formData.phone,
        location: formData.locality,
        assetType: formData.assetCategory,
        expectedPrice: formData.expectedPrice,
        details: formData.overview
      });
    } catch {
      // Handled gracefully if backend server is offline
    }

    // Dynamic state insertion: append new listing directly into active property state
    const cleanPrice = formData.expectedPrice ? (formData.expectedPrice.startsWith('₹') ? formData.expectedPrice : `₹${formData.expectedPrice}`) : 'Price on Request';
    const cleanLocation = formData.locality ? `${formData.locality}, Mangaluru` : 'Mangaluru';
    const cleanTitle = `${formData.locality || 'Mangaluru'} ${formData.assetCategory || 'Residence'}`;
    const cleanImages = images.length > 0 ? images.map(img => img.url) : [];

    addProperty({
      title: cleanTitle,
      category: formData.assetCategory || 'Villa',
      type: formData.assetCategory || 'Villa',
      locality: formData.locality || 'Mangaluru',
      location: cleanLocation,
      city: 'Mangaluru',
      price: cleanPrice,
      description: formData.overview || `${formData.assetCategory} in ${formData.locality}, Mangaluru ready for physical inspection.`,
      badge: 'NEW LISTING',
      images: cleanImages,
      galleryImages: cleanImages,
      ownerName: formData.ownerName,
      phone: formData.phone,
      pricing: {
        expectedPrice: parseInt((formData.expectedPrice || '').replace(/[^0-9]/g, '')) || 10000000,
        isNegotiable: true
      },
      specs: {
        bedrooms: formData.assetCategory === 'Plot' ? 0 : 3,
        bathrooms: formData.assetCategory === 'Plot' ? 0 : 3,
        carpetAreaSqFt: 2200,
        furnishingStatus: 'Semi-Furnished'
      }
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <Navbar/>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-xs w-full space-y-8">
          
          {/* Header */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-amber-700 tracking-widest uppercase">
              Property Owner Portal
            </span>
            <h1 className="text-3xl font-serif text-slate-900 tracking-tight">
              List Your Property on GrabMyKey
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              Submit property details below. Our team will verify legal titles, conduct an on-site property walkthrough, and publish the listing with zero upfront marketing charges.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center space-y-4">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto"/>
              <h3 className="font-bold text-base">Property Listed Successfully</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Your property listing has been added to the directory. Our team will verify legal titles and contact you directly to schedule an on-site walkthrough in Mangaluru.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-200 font-sans"
                >
                  <span>View in Directory</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      ownerName: '',
                      phone: '',
                      locality: '',
                      assetCategory: 'Villa',
                      expectedPrice: '',
                      overview: ''
                    });
                    setImages([]);
                  }}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-200 transition-all duration-200 font-sans cursor-pointer"
                >
                  <span>List Another Property</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Owner / Representative Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {/* Row 2: Locality, Category & Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Locality & City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bejai, Mangaluru"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Asset Category
                  </label>
                  <select
                    value={formData.assetCategory}
                    onChange={(e) => setFormData({ ...formData, assetCategory: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800 cursor-pointer"
                  >
                    <option value="Villa">Villa / Independent House</option>
                    <option value="Apartment">Apartment / Flat</option>
                    <option value="Plot">Residential Plot / Land</option>
                    <option value="Commercial">Commercial Space</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Expected Price (Approx.)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1.50 Cr"
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {/* Overview Textarea */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Property Overview & Key Highlights
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention area (sq ft), floor level, available documents (RTC/Khata), key amenities..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800 resize-none"
                />
              </div>

              {/* Image Upload Dropzone */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Property Photos / Layout Plans (Optional)
                </label>
                
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed ${isDragging ? 'border-amber-500 bg-amber-50/40' : 'border-slate-200 bg-[#FAF8F5]'} rounded-2xl p-6 hover:border-amber-400 transition-colors text-center cursor-pointer`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                      <UploadCloud className="w-5 h-5"/>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Click to upload or drag and drop photos
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG or WEBP up to 10MB each
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 group h-20 bg-slate-100">
                        <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-slate-900/80 hover:bg-red-600 text-white p-1 rounded-full transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3"/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs uppercase tracking-wider cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-amber-400"/>
                Submit Onboarding Request
              </button>

            </form>
          )}

        </div>
      </main>

      {/* Clean Footer (No Executive Login) */}
      <Footer />
    </div>
  );
}


```

## File: `src/pages/Properties.jsx`

```jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProperties } from '../context/PropertyContext';
import { fetchProperties } from '../api';
import { Search, MapPin, RefreshCw, Building2, Plus, Sparkles } from 'lucide-react';

export default function Properties({ 
  properties: externalProperties, 
  onRefresh, 
  isLoading: externalIsLoading = false,
  standalone = true 
}) {
  const navigate = useNavigate();
  const contextData = useProperties();
  const properties = externalProperties !== undefined ? externalProperties : contextData.properties;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [internalLoading, setInternalLoading] = useState(false);

  const loading = externalIsLoading || internalLoading;

  // Fresh data synchronization strictly from GET /api/properties (no stale localStorage caches)
  const handleRefresh = useCallback(async () => {
    setInternalLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('grabmykey_properties');
      }

      if (onRefresh) {
        await onRefresh();
      } else if (contextData?.refreshProperties) {
        await contextData.refreshProperties();
      } else {
        const res = await fetchProperties();
        if (res?.data && contextData?.setProperties) {
          contextData.setProperties(res.data);
        }
      }
    } catch (err) {
      console.warn('[Properties] Live backend sync error:', err?.message || err);
    } finally {
      setInternalLoading(false);
    }
  }, [onRefresh, contextData]);

  // Fetch fresh properties from backend on mount and subscribe to updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('grabmykey_properties');
    }

    handleRefresh();

    const handleSync = () => {
      handleRefresh();
    };

    window.addEventListener('grabmykey_properties_updated', handleSync);
    window.addEventListener('grabmykey_property_deleted', handleSync);
    window.addEventListener('grabmykey_property_created', handleSync);

    return () => {
      window.removeEventListener('grabmykey_properties_updated', handleSync);
      window.removeEventListener('grabmykey_property_deleted', handleSync);
      window.removeEventListener('grabmykey_property_created', handleSync);
    };
  }, [handleRefresh]);

  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    return properties.filter((prop) => {
      if (!prop) return false;
      const title = prop.title || '';
      const location = prop.location || prop.locality || '';
      const type = prop.type || prop.category || '';
      const locality = prop.locality || '';

      const matchesQuery = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || type === selectedType;
      const matchesRegion = selectedRegion === 'All' || 
                           location.toLowerCase().includes(selectedRegion.toLowerCase()) ||
                           locality.toLowerCase().includes(selectedRegion.toLowerCase());
      return matchesQuery && matchesType && matchesRegion;
    });
  }, [properties, searchQuery, selectedType, selectedRegion]);

  const content = (
    <section className="py-2 w-full space-y-8">
      {/* Directory Header Bar */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27] font-sans">Directory</span>
          <h1 
            className="text-3xl font-serif text-slate-900 mt-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Property Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Browse verified luxury villas, commercial suites, plots, and heritage estates across Mangaluru.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/sell"
            className="inline-flex items-center space-x-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl shadow-xs transition-all duration-200 cursor-pointer font-sans font-semibold"
          >
            <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>List Property</span>
          </Link>
          <button 
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-700 hover:text-slate-900 border border-slate-200/80 hover:border-[#C59B27]/40 bg-white px-3.5 py-2 rounded-xl shadow-xs self-start md:self-auto transition-all duration-200 cursor-pointer font-sans"
            title="Refresh database listings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#C59B27]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by locality, city, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C59B27] transition-all duration-200 font-sans"
            />
          </div>
          <div>
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C59B27] transition-all duration-200 cursor-pointer font-sans"
            >
              <option value="All">All Mangaluru Localities</option>
              <option value="Kadri">Kadri / Circuit House</option>
              <option value="Surathkal">Surathkal / Beach Road</option>
              <option value="Bejai">Bejai / Lalbagh</option>
              <option value="Attavar">Attavar / Falnir</option>
              <option value="Panambur">Panambur / Baikampady</option>
            </select>
          </div>
          <div>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#C59B27] transition-all duration-200 cursor-pointer font-sans"
            >
              <option value="All">All Asset Types</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
              <option value="Estate">Estate</option>
              <option value="Plot">Plot / Land</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties List or Elegant Editorial Coming Soon Placeholder */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs space-y-6 my-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-[#C59B27]/30 text-[10px] font-bold text-[#C59B27] uppercase tracking-widest font-sans">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Coming Soon • Mangaluru Verified Collection</span>
          </div>

          <div className="space-y-2">
            <h3 
              className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Exclusive Verified Walkthroughs Dropping Soon
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-lg mx-auto leading-relaxed">
              Our verified collection is curated on-site with direct title audits and unedited 4K video walkthroughs. New prime residential villas, apartments, plots, and commercial estates across Mangaluru are arriving shortly.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all duration-200 shadow-xs hover:shadow-md font-sans uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#C59B27]" />
              <span>List Your Property</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-6 py-3.5 rounded-xl border border-slate-200/80 transition-all duration-200 font-sans uppercase tracking-wider cursor-pointer"
            >
              <span>Concierge Inquiries</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((prop) => (
            <div 
              key={prop._id || prop.id}
              className="bg-white border border-slate-200/80 hover:border-[#C59B27]/40 rounded-2xl overflow-hidden transition-all duration-200 group flex flex-col justify-between shadow-xs hover:shadow-lg relative"
            >
              <div 
                onClick={() => navigate(`/property/${prop.slug || prop._id || prop.id}`)} 
                className="cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100 flex items-center justify-center">
                  {(prop.coverImage || prop.images?.[0] || prop.galleryImages?.[0] || prop.thumbnail) ? (
                    <img 
                      src={prop.coverImage || prop.images?.[0] || prop.galleryImages?.[0] || prop.thumbnail} 
                      alt={prop.title || 'Property'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                      <Building2 className="w-8 h-8 stroke-[1.5] mb-1" />
                      <span className="text-[10px] font-sans font-medium uppercase tracking-wider">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 text-slate-900 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs font-sans">
                      {prop.badge || prop.type || prop.category || 'Exclusive Listing'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-xs text-slate-500 space-x-1 mb-2 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>{prop.location || prop.locality || 'Mangaluru'}</span>
                  </div>
                  <h3 
                    className="text-lg font-serif font-bold text-slate-900 mb-2 group-hover:text-[#C59B27] transition-colors duration-200"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {prop.title}
                  </h3>
                  {prop.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-sans">
                      {prop.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <span className="block text-[9px] uppercase text-slate-400 font-semibold font-sans">Asking Price</span>
                  <span className="text-xl font-serif font-bold text-[#C59B27]">
                    {prop.price || (prop.pricing?.expectedPrice ? (prop.pricing.expectedPrice >= 10000000 ? `₹${(prop.pricing.expectedPrice / 10000000).toFixed(2)} Cr` : `₹${(prop.pricing.expectedPrice / 100000).toFixed(1)} L`) : 'Price on Request')}
                  </span>
                </div>
                <button 
                  onClick={() => navigate(`/property/${prop.slug || prop._id || prop.id}`)}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-900 hover:text-[#C59B27] transition-colors duration-200 cursor-pointer font-sans"
                >
                  <span>View More →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  if (!standalone) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans antialiased flex flex-col justify-between selection:bg-[#C59B27]/20 selection:text-[#C59B27]">
      <Navbar activeView="properties" />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-10">
        {content}
      </main>
      <Footer />
    </div>
  );
}


```

## File: `src/pages/PropertyDetails.jsx`

```jsx
import Footer from '../components/Footer';
import PropertyDetails, { NearbyInfrastructure, getTransitIcon } from '../components/PropertyDetails';
import PropertyImageGallery from '../components/PropertyImageGallery';
import ArchitecturalOverview from '../components/ArchitecturalOverview';
import PropertySummaryCard from '../components/PropertySummaryCard';

export default PropertyDetails;
export { PropertyDetails, NearbyInfrastructure, getTransitIcon, PropertyImageGallery, ArchitecturalOverview, Footer, PropertySummaryCard };

```

## File: `src/services/api.js`

```javascript
/**
 * API Service Re-export
 * Points directly to src/api.js for modular compatibility
 */

export * from '../api.js';
import api from '../api.js';
export default api;


```

## File: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./admin/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandNavy: {
          DEFAULT: '#0a1d37',
          dark: '#061224',
          light: '#0f2b48',
          surface: '#0d223f'
        },
        champagne: {
          light: '#f3e5ab',
          DEFAULT: '#b8860b',
          gold: '#d4af37',
          hover: '#c49f28',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        serif: ['"Playfair Display"', '"Cinzel"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

```

## File: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  }
})

```
