import gm from 'gm';
import settings from './settings';

const imageMagick = gm.subClass({imageMagick: true}); // Enable ImageMagick integration.
const settings_keys = Object.keys(settings);

const scaleImage = (buffer, key) => new Promise((resolve, reject) => {
    const max_width = settings[key].max_width;
    const max_height = settings[key].max_height;

    imageMagick(buffer).size(function(err, size) {
        // Transform the image buffer in memory.
        let scalingFactor = Math.min(max_width / size.width, max_height / size.height);
        let width = scalingFactor * size.width;
        let height = scalingFactor * size.height;

        this.resize(width, height).toBuffer('jpg', (error, buffer) => {
            if (error) {
              reject(error);
            } else {
              resolve({ buffer, key });
            }
        });
    });
});

const transformImages = buffer => {
    const all_buffers = settings_keys.map(key => scaleImage(buffer, key));

    return Promise.all(all_buffers);
};

export default transformImages;
