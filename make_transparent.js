const fs = require('fs');

async function go() {
    try {
        const { createCanvas, loadImage } = require('canvas');
        const img = await loadImage('src/app/icon.png');
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('20d'); // wait, 2d
    } catch(e) {
        console.log("No canvas installed.");
    }
}
go();
