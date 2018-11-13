import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AutocompleteSelect from '../common/AutocompleteSelect';
import SaveCancelButtons from '../common/SaveCancelButtons';
import * as R from 'ramda';

const styles = theme => ({
  name_input: {
    width: '100%',
    marginBottom: theme.spacing.unit * 3
  }
});

class EditPage extends Component {
  state = {
    name: '',
    page_type: null,
    page_data: null
  }

  static getDerivedStateFromProps(props, prevState) {
    if (!prevState.page_data && props.location.state && props.location.state.id && props.pages) {


      return { page_data: props.pages[props.location.state.id] };
    }

    else return null;
  }

  renderInputs() {
    if (!this.state.page_data || !this.state.page_data.page_type) {
      return null;
    }

    const {
      inputs,
      page_types
    } = this.props;

    const current_inputs = page_types[this.state.page_data.page_type].inputs;

    return current_inputs.map((input, i) => {
      const id = this.state.page_data.fragments[i];
      const value = R.find(R.propEq('value', id))(inputs[input.type]);

      return <AutocompleteSelect
        key={input.name}
        options={inputs[input.type]}
        onChange={val => this.changeInputFragment(val.value, i)}
        label={value ? false : input.title}
        value={value || { label: '', value: '' }}
      />
    });
  }

  changeInputFragment = (id, index) => {
    const data = this.state.page_data || { fragments: [] };
    const fragments = R.update(index, id, data.fragments);
    const updated_page_data = R.assoc('fragments', fragments, data);

    this.setState({
      page_data: updated_page_data
    });
  }

  changePageType = val => {
    // if the same page type, do not proceed
    if (val.value === this.state.page_data) {
      return;
    }

    const inputs_length = this.props.page_types[val.value].inputs.length;

    const updated_page_data = R.pipe(
      R.assoc('page_type', val.value),
      R.assoc('fragments', R.repeat('', inputs_length))
    )(this.state.page_data);

    this.setState({
      page_data: updated_page_data
    });
  }

  getPageTypeVal = () => {
    if (!this.state.page_data || !this.state.page_data.page_type) {
      return false;
    }

    const value = this.state.page_data.page_type;

    if (!value) {
      return false;
    }

    const label = this.props.page_types[value].name;

    return ({ label, value });
  }

  render() {
    const name = this.props.match.params.page_name;
    const id = this.props.location.state ? this.props.location.state.id : null;

    const {
      page_types,
      classes
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
              className={classes.name_input}
            />
          )
        }

        <AutocompleteSelect
          options={options}
          value={this.getPageTypeVal()}
          onChange={this.changePageType}
        />

        {this.renderInputs()}

        <SaveCancelButtons />
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
    pages: state.pageList
  }
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(EditPage));

