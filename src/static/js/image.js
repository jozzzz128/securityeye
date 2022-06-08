const fs = require("fs");
const { resolve } = require("path");
// Pipes an image with "new-path.jpg" as the name.


const image = {
    generateImages: ({ base64array, id }) => {
        base64array.forEach((buffer, i) => this.generateImage({
            base64Image: buffer, 
            id: id, 
            i: i
        }));
    },
    generateImage: ({ base64Image, id, i, callback }) => {
        try {
            const fileName = `${id}-frame-${i}.png`;
            const filePath = `${__dirname}/../img/${fileName}`;
            const buffer = base64Image.replace(/^data:image\/png;base64,/, "");
            fs.writeFile(filePath, buffer, 'base64', function(err){});

            callback(filePath);
        } catch (error) {
            console.log('imagen vacia');
        }
    },
    generateImagePromise: ({base64Image, id, i}) => new Promise((res, rej) => {
        setTimeout( () => {
            image.generateImage({
                base64Image: base64Image,
                id: id,
                i: i
            });
            res('Imagen generada');
        }, 200);
    })
};

module.exports = image;