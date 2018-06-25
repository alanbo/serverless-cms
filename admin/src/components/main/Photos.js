import React, { Component } from 'react';
import { Storage } from 'aws-amplify';
import { PhotoPicker, S3Image, S3Album } from 'aws-amplify-react';

class Photos extends Component {

  componentDidMount() {
    Storage.list('temp/')
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <h1>Photos</h1>
        {/* <S3Image path="temp/" picker /> */}
        <S3Album path="temp/" picker />
      </div>
    );
  }
}

export { Photos };
