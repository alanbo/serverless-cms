import gm from 'gm';
import settings from './settings';
import AWS from 'aws-sdk';

type SettingsKeys = keyof typeof settings;
const settings_keys = Object.keys(settings);

const imageMagick = gm.subClass({ imageMagick: true }); // Enable ImageMagick integration.

const scaleImage = (buffer: Buffer, key: keyof typeof settings) => new Promise((resolve, reject) => {
  const max_width = settings[key].max_width;
  const max_height = settings[key].max_height;

  imageMagick(buffer).size(function (err, size) {
    if (err) {
      reject(err);
    }

    // Transform the image buffer in memory.
    let scalingFactor = Math.min(max_width / size.width, max_height / size.height);
    let width = scalingFactor * size.width;
    let height = scalingFactor * size.height;

    (this as gm.State).resize(width, height).toBuffer('jpg', (error, buffer) => {
      if (error) {
        reject(error);
      } else {
        resolve({ buffer, key });
      }
    });
  });
});

const transformImages = (buffer: Buffer) => {
  const all_buffers = settings_keys.map((key: SettingsKeys) => scaleImage(buffer, key));

  return Promise.all(all_buffers);
};

export default transformImages;
