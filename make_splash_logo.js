const sharp = require('sharp');

// Ensure the source image fits nicely within the 512x512 canvas with padding
sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    {
      input: 'public/kareem-logo.png', // This is likely already 512x512, let's resize it down slightly to act as an icon inside a white box
      blend: 'over'
    }
  ])
  .png()
  .toFile('public/icon-512-maskable.png')
  .then(info => console.log('Successfully generated solid maskable icon:', info))
  .catch(err => console.error('Error:', err));

