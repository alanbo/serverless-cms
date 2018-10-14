import React, { Component } from 'react';
import { Storage } from 'aws-amplify';


function onChange(e, parentOnChange) {
    const file = e.target.files[0];
    console.log(file);
    Storage.put(`temp/${file.name}`, file)
        .then (result => typeof parentOnChange === 'function' ? parentOnChange() : undefined)
        .catch(err => console.log(err));
};

const S3ImageUpload = React.forwardRef((props, ref) => (
    <input
        type='file'
        accept='image/png image/jpeg'
        onChange={e => onChange(e, props.onChange)}
        ref={ref}
        style={{ position: 'fixed', left: '-99999px' }}
    />
));

export default S3ImageUpload;