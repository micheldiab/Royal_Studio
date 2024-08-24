// src/App.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

server='royal-studio.vercel.app';

function App() {
    const [barcodeData, setBarcodeData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://${server}/api/barcodes`);
                setBarcodeData(Object.entries(response.data));
            } catch (error) {
                console.error('Error fetching barcode data:', error);
            }
        };

        fetchData();

        // Polling every 10 seconds to check for new images
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Royal Studio</h1>
            </header>
            <main>
                {barcodeData.map(([barcode, { imageURL, qrCode }]) => (
                    <div key={barcode} className="image-container">
                         <img src={`https://${server}${imageURL}`} alt={`Barcode ${barcode}`} />
                        <img src={qrCode} alt={`QR Code ${barcode}`} />
                        <a href={`https://${server}${imageURL}`} download className="download-button">
                            Download Image
                        </a>
                    </div>
                ))}
            </main>
        </div>
    );
}

export default App;
