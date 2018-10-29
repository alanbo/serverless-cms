import React, { Component } from 'react';
import Tabs from './common/Tabs';
import Menus from './fragments/Menus';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import AddDialog from './common/AddDialog';
import TextList from './fragments/common/TextList';
import * as actionCreators from '../../actions/index';

const styles = theme => ({
  button: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  textField: {
    width: '100%'
  },
  editor: {
    height: '50vh',
    marginBottom: 50
  }
});


class UnstyledFragments extends Component {
  state = {
    add_dialog_open: false,
    current_tab: 0,
    simple_text: '',
    rich_text: ''
  }

  current_text = '';

  tab_data = [
    {
      title: 'Text',
      renderTab: () => <TextList data={this.props.simple_texts} key='Text' />,
      dialog_title: 'Simple Text Editor',
      dialog_text: 'Fill out the text',
      dialog_add_btn_text: 'Add Text',

      dialogRenderInner: () => (
        <TextField
          label='Simple Text'
          multiline
          rows='8'
          className={this.props.classes.textField}
          margin='normal'
          variant='filled'
          value={this.state.simple_text}
          onChange={e => this.setState({ simple_text: e.target.value })}
        />
      ),

      onClose: () => this.closeTextDialog(false)
    },
    {
      title: 'Rich Text',
      renderTab: () => <TextList data={this.props.rich_texts} key='Rich Text' />,
      dialog_title: 'Rich Text Editor',
      dialog_text: 'Fill out the text',
      dialog_add_btn_text: 'Add Text',
      dialogRenderInner: () => (<ReactQuill
        value={this.state.rich_text}
        onChange={rich_text => this.setState({ rich_text })}
        className={this.props.classes.editor}
      />),
      onClose: () => this.closeTextDialog(true)
    },
    {
      title: 'Menu',
      renderTab: () => <Menus key='Menu' />,
      dialog_title: 'Menu Editor',
      dialog_text: 'Design the menu',
      dialog_add_btn_text: 'Add Menu',
      dialogRenderInner: () => <div>Menu Placeholder</div>,
      onClose: () => { }
    },
  ]

  addDialog() {
    this.setState({
      add_dialog_open: true
    });
  }

  closeTextDialog = (is_rich) => {
    const text = is_rich ? this.state.rich_text : this.state.simple_text;

    this.props.putText(text, is_rich);

    this.setState({
      add_dialog_open: false,
      rich_text: '',
      simple_text: ''
    });
  }

  cancelDialog = () => {
    this.setState({
      add_dialog_open: false,
      rich_text: '',
      simple_text: ''
    });
  };


  renderDialog() {
    const tab_data = this.tab_data[this.state.current_tab];

    return (
      <AddDialog
        onClose={tab_data.onClose.bind(this)}
        onCancel={this.cancelDialog.bind(this)}
        title={tab_data.dialog_title}
        text={tab_data.dialog_text}
        add_btn_text={tab_data.dialog_add_btn_text}
      >
        {tab_data.dialogRenderInner()}

      </AddDialog>
    )
  }

  render() {
    const { classes } = this.props;

    return (<div>
      <h1>Fragments</h1>
      <Tabs
        onChange={current_tab => this.setState({ current_tab })}
        titles={this.tab_data.map(tab => tab.title)}
      >
        {
          this.tab_data.map(item => item.renderTab())
        }
      </Tabs>
      <Button
        variant="fab"
        color="primary"
        aria-label="add"
        className={classes.button}
        onClick={this.addDialog.bind(this)}
      >
        <AddIcon />
      </Button>

      {
        this.state.add_dialog_open
          ? this.renderDialog()
          : null
      }
    </div>);
  }
};


function mapStateToProps(state) {
  const texts = Object
    .keys(state.textList)
    .map(id => state.textList[id]);

  const rich_texts = texts.filter(text_obj => text_obj.is_rich);
  const simple_texts = texts.filter(text_obj => !text_obj.is_rich);

  return { rich_texts, simple_texts };
}

const Fragments = withRouter(connect(mapStateToProps, actionCreators)(withStyles(styles)(UnstyledFragments)));

export { Fragments };
