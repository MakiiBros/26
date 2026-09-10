const sharp = require('sharp');
sharp('public/images/owner/founder-collage.jpg')
  .extract({ left: 512, top: 0, width: 512, height: 341 })
  .resize(200, 200, { fit: 'cover' })
  .toFile('public/images/owner/avatar.jpg')
  .then(() => console.log('Done'))
  .catch(console.error);
