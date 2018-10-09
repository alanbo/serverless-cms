import React, { Component } from 'react';
import { Storage } from 'aws-amplify';
import { PhotoPicker, S3Image, S3Album } from 'aws-amplify-react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import FormDialog from './photos/FormDialog';
import FolderTable from './photos/FolderTable';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/index';
import { withRouter, Link, Route } from 'react-router-dom';
import Gallery from './photos/Gallery';


const styles = theme => ({
  button: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

class Photos extends Component {
  constructor() {
    super();
    this.state = {
      galleries: [],
      add_dialog_open: false
    }
  }

  listFolders() {
    const data = Object.keys(this.props.galleries).map(name => {
      return {
        name,
        files: this.props.galleries[name].images.length || 0
      }
    });

    return <FolderTable data={ data } onDelete={ this.onDelete }/>
  }

  onDelete = gallery => {
    this.props.removeGallery(this.props.galleries[gallery].id);
  }

  addFolderDialog() {
    this.setState({
      add_dialog_open: true
    });
  }

  addFolder(name) {
    this.props.addGallery(name);

    this.setState({
      add_dialog_open: false
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <h1>Photos</h1>
        { this.listFolders() }
        <Button variant="fab" color="primary" aria-label="add" className= { classes.button } onClick={ this.addFolderDialog.bind(this) }>
          <AddIcon />
        </Button>

        { this.state.add_dialog_open
          ? <FormDialog onClose={ this.addFolder.bind(this) }/>
          : ''
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    galleries: state.galleryList,
    images: state.imageList
  }
}

Photos = withRouter(connect(mapStateToProps, actionCreators)(withStyles(styles)(Photos)));

export { Photos };
