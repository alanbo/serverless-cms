import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AutocompleteSelect from '../common/AutocompleteSelect';

class EditPage extends Component {
  state = {
    name: '',
    page_type: null
  }

  renderInputs() {
    if (!this.state.page_type) {
      return null;
    }

    const {
      inputs,
      page_types
    } = this.props;

    const current_inputs = page_types[this.state.page_type.value].inputs;
    console.log(inputs);

    return current_inputs.map(input => {
      console.log(inputs[input.type]);

      return <AutocompleteSelect
        key={input.name}
        options={inputs[input.type]}
        onChange={console.log}
        label={input.title}
      />
    });
  }

  render() {
    const name = this.props.match.params.page_name;
    const id = this.props.location.state ? this.props.location.state.id : null;

    const {
      page_types,
    } = this.props;

    const options = Object.keys(page_types)
      .map(type => ({ label: page_types[type].name, value: type }));

    return (
      <div>
        <h1>Edit Page</h1>
        {
          id ? <h2>{name}</h2> : (
            <TextField
              onChange={e => this.setState({ name: e.target.value })}
              value={this.state.value}
              label='Name'
            />
          )
        }

        <AutocompleteSelect
          options={options}
          value={this.state.page_type}
          onChange={val => this.setState({ page_type: val })}
        />

        {this.renderInputs()}
      </div>
    );
  }
}

function toLabelValue(obj, filterFunc = filter => true) {
  if (!obj) {
    return [];
  }

  return Object.keys(obj)
    .map(key => obj[key])
    .filter(filterFunc)
    .map(obj => ({
      label: obj.name || obj.filename || obj.snippet,
      value: obj.id
    }));
}
function mapStateToProps(state) {
  return {
    inputs: {
      gallery: toLabelValue(state.galleryList),
      image: toLabelValue(state.imageList),
      text: toLabelValue(state.textList, ({ is_rich }) => !is_rich),
      rich_text: toLabelValue(state.textList, ({ is_rich }) => !!is_rich),
      menu: toLabelValue(state.menuList)
    },
    page_types: state.pageTypeList || [],
  }
}

export default connect(mapStateToProps)(EditPage);

