import React, { Component } from 'react';
import Tabs from './common/Tabs';
import RichTexts from './fragments/RichTexts';
import Texts from './fragments/Texts';
import Menus from './fragments/Menus';
import All from './fragments/All';
import styles from './common/btn_styles';
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Link, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import AddDialog from './common/AddDialog';
import RichTextEditor from './common/RichTextEditor';
import * as actionCreators from '../../actions/index';


class UnstyledFragments extends Component {
  state = {
    add_dialog_open: false,
  }

  current_text = '';

  addDialog() {
    this.setState({
      add_dialog_open: true
    });
  }

  closeDialog = selected => {
    this.props.putText(this.current_text);
    this.current_text = '';

    this.setState({
      add_dialog_open: false,
    });
  }

  setCurrentText = text => {
    this.current_text = text;
  }

  render() {
    const { classes } = this.props;

    return (<div>
      <h1>Fragments</h1>
      <Tabs titles={['Texts', 'Rich Texts', 'Menus', 'All']}>
        <Texts />
        <RichTexts />
        <Menus />
        <All />
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
          ? <AddDialog
            onClose={this.closeDialog.bind(this)}
            onCancel={this.closeDialog.bind(this)}
            title='Rich Text Editor'
            text='Fill out the text'
            add_btn_text='Add Text'
          >
            <RichTextEditor onChange={text => this.setCurrentText(text)} />
          </AddDialog>
          : null
      }
    </div>);
  }
};


function mapStateToProps(state) {
  return {
    galleries: state.galleryList,
    images: state.imageList
  }
}

const Fragments = withRouter(connect(mapStateToProps, actionCreators)(withStyles(styles)(UnstyledFragments)));

export { Fragments };
