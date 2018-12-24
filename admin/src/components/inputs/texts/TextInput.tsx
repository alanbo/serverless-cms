import React from 'react';
import ReactQuill from 'react-quill';
import TextField from '@material-ui/core/TextField';
import 'react-quill/dist/quill.snow.css';
import { InputProps } from '../../../types';
import * as R from 'ramda';
import { createStyles, withStyles, WithStyles } from '@material-ui/core';

const styles = theme => createStyles({
  editor: {
    height: '50vh',
    marginBottom: 50
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing.unit * 4
  }
});

interface Props extends WithStyles<typeof styles>, InputProps { };


export default withStyles(styles)((props: Props) => (
  <div>
    <TextField
      value={props.value.name || ''}
      onChange={e => props.onChange(R.assoc('name', e.target.value, props.value))}
      className={props.classes.textField}
      placeholder='Provide a name'
    />
    <ReactQuill
      value={props.value.text || ''}
      onChange={value => props.onChange(R.assoc('text', value, props.value))}
      className={props.classes.editor}
    />
  </div>
));