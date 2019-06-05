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

class PageInput extends Component<Props, State> {

  renderInputs() {

    const {
      value,
      page_type_config: config,
      fragments,
      onChange
    } = this.props;

    if (R.isEmpty(value) || R.isEmpty(config) || R.isEmpty(fragments)) {
      return;
    }

    const page_type_name = value.page_type;
    const inputs = config[page_type_name] ? config[page_type_name].inputs : [];


    return inputs.map((input, i) => {
      const { type } = input;
      const fg_id_list = value.fragments;
      let input_value = { label: '', value: '' };

      const options = toLabelValue(fragments, type);

      if (fg_id_list && fg_id_list[i]) {
        const id = fg_id_list[i];

        if (!fragments[id]) {
          return;
        }

        input_value = { label: fragments[id].name, value: id }
      }

      return (
        <div key={input.name}>
          <h3>{input.title}</h3>

          <AutocompleteSelect
            options={options}
            onChange={val => this.changeInputFragment(val.value, i, inputs.length)}
            value={input_value}
          />
        </div>
      );
    });
  }

  changeInputFragment = (id, index, length) => {
    const { value } = this.props;

    const fragments = R.update(index, id, value.fragments);
    const updated_page_data = R.assoc('fragments', fragments, value);

    this.props.onChange(updated_page_data);
  }

  changePageType = type => {
    const {
      value,
      page_type_config
    } = this.props;

    const type_value = R.prop('value', type);
    const length = (page_type_config[type_value].inputs || []).length;

    let empty_fragments = R.times(() => '', length);

    const new_value = R.pipe(
      R.assoc('page_type', type_value),
      R.assoc('fragments', empty_fragments)
    )(value);

    // @ts-ignore
    this.props.onChange(new_value);
  }

  getPageTypeVal = () => {
    const label = this.props.value.page_type;

    return ({ label, value: label });
  }

  render() {
    const {
      value,
      onChange,
      classes,
      page_type_config
    } = this.props;

    const options = Object.keys(page_type_config)
      .map(key => ({ label: key, value: key }));


    return (
      <div>
        <TextField
          onChange={e => onChange(R.assoc('name', e.target.value, value))}
          value={value.name || ''}
          label='Name'
          className={classes.name_input}
        />

        {
          R.isEmpty(options) ? null :

            <div>
              <h3>Choose page type: </h3>

              <AutocompleteSelect
                options={options}
                value={this.getPageTypeVal()}
                onChange={this.changePageType}
              />
            </div>
        }

        {this.renderInputs()}
      </div>
    );
  }
}

function toLabelValue(fragments = {}, type) {
  return R.pipe(
    // @ts-ignore
    R.values(),
    // @ts-ignore
    R.filter(fg => fg.type === type),
    // @ts-ignore
    R.groupBy(item => item.type),
    R.mapObjIndexed(
      R.map(obj => ({
        // @ts-ignore
        label: obj.name,
        // @ts-ignore
        value: obj.id
      })),
    ),
    R.prop(type)
  )(fragments);
}


export default withStyles(styles, { withTheme: true })(PageInput);

