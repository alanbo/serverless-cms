import React from 'react';
import ReactQuill from 'react-quill';
import { withStyles } from '@material-ui/core/styles';
import 'react-quill/dist/quill.snow.css';

const styles = theme => ({
  editor: {
    height: '50vh',
    marginBottom: 50
  }
});

class RichTextEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '' } // You can also pass a Quill Delta here
  }

  handleChange = value => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }

    this.setState({ text: value })
  }

  render() {
    const { classes } = this.props;
    return (
      <ReactQuill
        value={this.state.text}
        onChange={this.handleChange}
        className={classes.editor}
      />
    )
  }
}

export default withStyles(styles)(RichTextEditor);