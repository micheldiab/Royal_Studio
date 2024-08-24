import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://royal-studio.vercel.app'; // Use environment variable

function App() {
    const [barcodeData, setBarcodeData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api/barcodes`);
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
                {barcodeData.length > 0 ? (
                    barcodeData.map(([barcode, { imageURL, qrCode }]) => (
                        <div key={barcode} className="image-container">
                            <img src={`${SERVER_URL}${imageURL}`} alt={`Barcode ${barcode}`} />
                            <img src={qrCode} alt={`QR Code ${barcode}`} />
                            <a href={`${SERVER_URL}${imageURL}`} download className="download-button">
                                Download Image
                            </a>
                        </div>
                    ))
                ) : (
                    <p>No images available.</p>
                )}
            </main>
        </div>
    );
}

export default App;
