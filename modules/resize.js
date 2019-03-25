'use strict';

class Resize {
  constructor(){
    this.sharp = require('sharp');
  }

  resizeImage(image, destination, next){
    this.sharp(image)
        .resize(400, 400)
        .toFile(destination)
        .then(() => {
          next();
    }).catch(e => {
      console.log(e);
    });
  }
}
module.exports = new Resize();