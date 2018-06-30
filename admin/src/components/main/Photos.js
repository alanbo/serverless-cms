import React, { Component } from 'react';
import { Storage } from 'aws-amplify';
import { PhotoPicker, S3Image, S3Album } from 'aws-amplify-react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import FormDialog from './photos/FormDialog';

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

        this.setState({ galleries });

        console.log(galleries);
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.listGalleries();
  }

  listFolders() {
    return this.state.galleries.map(gallery => {
      return <p key={ gallery }>{ gallery }</p>
    })
  }

  addFolderDialog() {
    this.setState({
      add_dialog_open: true
    });
    console.log('dialog open');
  }

  addFolder(name) {
    Storage.put(`images/${name}/`, '')
      .then(this.listGalleries);
    this.setState({
      add_dialog_open: false
    });
    console.log(name);
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <h1>Photos</h1>
        {/* <S3Image path="temp/" picker /> */}
        {/* <S3Album path="temp/" picker /> */}
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

Photos = withStyles(styles)(Photos);

export { Photos };
