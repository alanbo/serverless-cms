import React, { Component } from 'react';

class EditPage extends Component {
  render() {
    const name = this.props.match.params.page_name;
    const id = this.props.location.state ? this.props.location.state.id : null;
    console.log(id);
    console.log(name);

    return (
      <div>
        <h1>Edit Page</h1>
      </div>
    );
  }
}

export default EditPage;

