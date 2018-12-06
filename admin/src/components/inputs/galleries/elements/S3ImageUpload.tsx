import * as React from 'react';
import { Storage } from 'aws-amplify';


function onChange(e, parentOnChange) {
  const storage = [...e.target.files].map(file => {
    return Storage.put(`temp/${file.name}`, file)
  });

  Promise.all(storage)
    .then(result => typeof parentOnChange === 'function' ? parentOnChange() : undefined)
    .catch(err => console.log(err));
};

interface Props {
  onChange: Function
};

type Ref = HTMLInputElement;

const S3ImageUpload = React.forwardRef<Ref, Props>((props: Props, ref) => (
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