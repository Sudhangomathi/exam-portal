const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 80;
const BACKEND_URL = 'http://localhost:8080';
const FRONTEND_DIST = path.join(__dirname, 'frontend', 'dist');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
    // 1. Check if request is an API request
    if (req.url.startsWith('/api')) {
        // Parse the target URL
        const parsedUrl = new URL(req.url, BACKEND_URL);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || 8080,
            path: parsedUrl.pathname + parsedUrl.search,
            method: req.method,
            headers: req.headers,
        };

        // Create proxy request
        const proxyReq = http.request(options, (proxyRes) => {
            // Forward response headers and status code
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            // Pipe response data
            proxyRes.pipe(res);
        });

        proxyReq.on('error', (err) => {
            console.error('Proxy Error:', err.message);
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end('Bad Gateway: Unable to connect to backend server.');
        });

        // Pipe request body if any
        req.pipe(proxyReq);
        return;
    }

    // 2. Otherwise, treat as static file request
    // Normalize URL path to prevent directory traversal
    let safeUrlPath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    // Remove query params/hash from URL for file lookup
    const qIndex = safeUrlPath.indexOf('?');
    if (qIndex !== -1) {
        safeUrlPath = safeUrlPath.substring(0, qIndex);
    }
    const hIndex = safeUrlPath.indexOf('#');
    if (hIndex !== -1) {
        safeUrlPath = safeUrlPath.substring(0, hIndex);
    }

    let filePath = path.join(FRONTEND_DIST, safeUrlPath === '/' ? 'index.html' : safeUrlPath);

    // Check if file exists and is not a directory
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // File does not exist, serve index.html (SPA fallback for React Router)
            filePath = path.join(FRONTEND_DIST, 'index.html');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.on('error', (streamErr) => {
            console.error('File read error:', streamErr);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        });
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Ensure graduatesportal is mapped to 127.0.0.1 in hosts file.`);
});
