const sharp = require('sharp');

async function createSplash() {
  try {
    const imgBuffer = await sharp('public/kareem-logo.png')
      .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
      .composite([
        { input: imgBuffer, blend: 'over' }
      ])
      .png()
      .toFile('public/icon-splash.png');

    console.log('Successfully created icon-splash.png');
  } catch (error) {
    console.error('Error generating splash:', error);
  }
}

createSplash();
