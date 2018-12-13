import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AutocompleteSelect from '../../main/common/AutocompleteSelect';
import * as R from 'ramda';
import styles, { PageStyle } from './page-styles';
import { FragmentItem, PageTypeConfig } from '../../../types';

interface Page {
  id?: string
  name: string
  page_type: string
  fragments: string[]
}


interface Props extends PageStyle {
  fragments: FragmentItem[],
  page_type_config: PageTypeConfig,
  value: Page,
  onChange: (value: Page) => void
}

interface State {

}

class EditPage extends Component<Props, State> {

  renderInputs() {

    const {
      value,
      page_type_config: config,
      fragments
    } = this.props;

    const page_type_name = value.page_type;
    const { inputs } = config[page_type_name] || [];

    return inputs.map((input, i) => {
      const { type } = input;
      const fg_id_list = value.fragments;
      let input_value = { label: '', value: '' };

      const options = toLabelValue(fragments, type);

      if (fg_id_list && fg_id_list[i]) {
        const id = fg_id_list[i];
        input_value = { label: fragments[id].name, value: id }
      }

      return <AutocompleteSelect
        key={input.name}
        options={options}
        onChange={val => this.changeInputFragment(val.value, i)}
        label={input.title || ''}
        value={input_value}
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

    return ({ label, value });
  }

  render() {
    const name = this.props.match.params.page_name;
    const id = this.props.location.state ? this.props.location.state.id : null;

    const {
      page_types,
      value,
      onChange
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
              onChange={e => onChange(R.assoc('name', e.target.value, value))}
              value={value.name || ''}
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
      </div>
    );
  }
}

function toLabelValue(fragments = {}, type) {
  return R.pipe(
    R.values(),
    R.filter(fg => fg.type === type),
    R.groupBy(item => item.type),
    R.mapObjectIndexed(
      R.map(obj => ({
        label: obj.name,
        value: obj.id
      })),
    )
  )(fragments);
}


withStyles(styles, { withTheme: true })(EditPage);

