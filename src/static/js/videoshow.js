const videoshow = require('videoshow');

const videoOptions = {
    loop: 5,
    fps: 30,
    transition: false,
    format: 'mp4'
};

const video = {
    generateVideoFile: ({id, iterator, callback}) => {
        const images = [];
        const fileName = `${id}-videocam.mp4`;
        const path = `${__dirname}/../video/${fileName}`;
        
        for (let i = 1; i <= iterator; i++){
            images.push({ path: `${__dirname}/../img/${id}-frame-${i}.png` });
        }
        console.log('frames: ', images);

        videoshow(images, videoOptions).save(path)
        .on('start', command => {
            console.log('Conversion started: ', command);
        })
        .on('error', (err, stdout, stderr) => {
            console.log('An error ocurred: ', err);
        })
        .on('end', output => {
            callback({ file: fileName, route: path });
        });
    }
};

module.exports = video;