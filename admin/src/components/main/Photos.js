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

  listGalleries = () => {
    return Storage.list('images/')
      .then(result => {
        const galleries = _.uniq(result.map(path => {
          return path.key.split('/')[1];
        }));

        return Promise.all(galleries.map(name => {
          return Storage.list(`images/${name}/thumbnail`).then(subresult => {
            return {
              name,
              files: subresult
            }
          });
        }))
      })
      .then(galleries => {
        this.setState({ galleries });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.listGalleries();
  }

  listFolders() {
    // return this.state.galleries.map(gallery => {
    //   return <p key={ gallery }>{ gallery }</p>
    // })

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
        {/* <S3Image path="temp/" picker /> */}
        <S3Album path="temp/" picker />
        { this.listFolders() }
        <Button variant="fab" color="primary" aria-label="add" className= { classes.button } onClick={ this.addFolderDialog.bind(this) }>
          <AddIcon />
        </Button>

        { this.state.add_dialog_open
          ? <FormDialog onClose={ this.addFolder.bind(this) }/>
          : ''
        }

        {/* <FolderTable /> */}

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

Photos = connect(mapStateToProps, actionCreators)(withStyles(styles)(Photos));

export { Photos };
