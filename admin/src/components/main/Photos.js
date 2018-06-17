import React, { Component } from 'react';
import { Storage } from 'aws-amplify';
import { PhotoPicker, S3Image } from 'aws-amplify-react';

class S3ImageUpload extends React.Component {
  onChange(e) {
      const file = e.target.files[0];
      Storage.put('example.png', file, {
          contentType: 'image/png'
      })
      .then (result => console.log(result))
      .catch(err => console.log(err));
  }

  render() {
      return (
          <input
              type="file" accept='image/png'
              onChange={(e) => this.onChange(e)}
          />
      )
  }
}

class Photos extends Component {
  render() {
    return (
      <div>
        <h1>Photos</h1>
        <S3ImageUpload />
      </div>
    );
  }
}

export { Photos };
