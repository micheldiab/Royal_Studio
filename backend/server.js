// server.js

const express = require('express');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

// Directory to watch for new images
const IMAGES_DIR = path.join(__dirname, 'images');

// Ensure the images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR);
}

// Store barcode to image mappings
let barcodeImageMapping = {};

// Watch the folder for new images
const watcher = chokidar.watch(IMAGES_DIR, {
    persistent: true,
});

watcher.on('add', (filePath) => {
    const fileName = path.basename(filePath);
    const imageURL = `/images/${fileName}`;

    // Generate a unique barcode (using the filename as the barcode value)
    const barcode = fileName.split('.')[0];

    // Generate QR code data URL
    QRCode.toDataURL(barcode, (err, url) => {
        if (err) {
            console.error('Error generating QR code:', err);
            return;
        }

        // Save the mapping
        barcodeImageMapping[barcode] = { imageURL, qrCode: url };
        console.log(`New image added: ${fileName}, Barcode: ${barcode}`);
    });
});

// Serve images and mappings
app.use('/images', express.static(IMAGES_DIR));

app.get('/api/barcodes', (req, res) => {
    res.json(barcodeImageMapping);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});