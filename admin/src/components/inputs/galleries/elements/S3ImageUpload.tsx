import * as React from 'react';
import { Storage } from 'aws-amplify';


function onChange(e, parentOnChange) {
  const storage = [...e.target.files].map(file => {
    return Storage.put(`temp/${file.name}`, file)
  });

  Promise.all(storage)
    .then(result => {
      const res = result as { key: string }[];
      const paths = res
        .map(obj => obj.key)
        .filter(item => !!item)
        .map(path => `public/${path}`);

      typeof parentOnChange === 'function' && parentOnChange(paths);
    })
    .catch(err => console.log(err));
};

interface Props {
  onChange: Function
};

const S3ImageUpload = React.forwardRef<HTMLInputElement, Props>((props: Props, ref) => (
  <input
    type='file'
    accept='image/png image/jpeg'
    onChange={e => onChange(e, props.onChange)}
    ref={ref}
    style={{ position: 'fixed', left: '-99999px' }}
    multiple
  />
));

export default S3ImageUpload;