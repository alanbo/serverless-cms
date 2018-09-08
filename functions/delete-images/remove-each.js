/* global global */
import AWS from 'aws-sdk';
const s3 = new AWS.S3();

const SUB = ['thumbnail', 'mobile', 'desktop', 'retina']

function deleteOne(Bucket, Key) {
  return new Promise((resolve, reject) => {
    s3.deleteObject({ Bucket, Key }, err => {
      if (err) {
        reject(err);
      } else {
        resolve({ path, type: key });
      }
    });
  });
}

const deleteImages = (Bucket, Key) => {
  const key_arr = Key.split('/');
  const size_folder = key_arr[3];

  console.log(size_folder);

  const image_data = SUB
    .filter(size => size !== size_folder)
    .map(size => {
      const arr = [...key_arr];
      arr[3] = size;

      console.log(arr.join('/'));

      return deleteOne(Bucket, arr.join('/'));
    })


  return Promise.all(image_data);
};

export default deleteImages;
