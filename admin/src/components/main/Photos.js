import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import AddDialog from './common/AddDialog';
import FolderTable from './common/ListTable';
import FullWidthTabs from './common/Tabs';
import Gallery from './photos/Gallery';
import S3ImageUpload from './photos/S3ImageUpload';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/index';
import { withRouter } from 'react-router-dom';
import styles from './common/btn_styles';

const match = /^[a-zA-Z0-9_]+$/ig;


class Photos extends Component {
  constructor() {
    super();
    this.state = {
      galleries: [],
      add_dialog_open: false,
      current_tab: 0,
      input_text: '',
      input_error: false
    }
    this.file_input = React.createRef();
  }

  listFolders() {
    const data = Object.keys(this.props.galleries).map(name => {
      return {
        name,
        files: this.props.galleries[name].images.length || 0
      }
    });

    return <FolderTable data={data} onDelete={({ name }) => this.onDelete(name)} key="galleries" root_path="gallery" />
  }

  onDelete = gallery => {
    this.props.removeGallery(this.props.galleries[gallery].id);
  }

  addFolderDialog() {
    if (!!this.state.current_tab) {
      this.setState({
        add_dialog_open: true
      });
    } else {
      this.file_input.current.click();
    }
  }

  addFolder(name) {
    if (match.test(this.state.text)) {
      this.setState({ input_error: false });
      this.props.addGallery(this.state.input_text);

      this.setState({
        add_dialog_open: false,
        input_error: false
      });
    } else {
      this.setState({ input_error: true });
    }

  }

  cancelAddFolder() {
    this.setState({
      add_dialog_open: false,
      input_text: ''
    });
  }

  refetchImages = () => {
    // TO DO: temporary solution through timeout
    // fix later by using graphql subscriptions
    setTimeout(() => {
      this.props.fetchImageList();
    }, 4000)
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <h1>Photos</h1>
        <FullWidthTabs
          onChange={current_tab => this.setState({ current_tab })}
          titles={['Images', 'Galleries']}
        >
          {
            [
              <Gallery all={true} key="all_images" />,
              this.listFolders()
            ]
          }
        </FullWidthTabs>
        <Button variant="fab" color="primary" aria-label="add" className={classes.button} onClick={this.addFolderDialog.bind(this)}>
          <AddIcon />
        </Button>

        <S3ImageUpload ref={this.file_input} onChange={this.refetchImages} />

        {this.state.add_dialog_open
          ? <AddDialog
            onClose={this.addFolder.bind(this)}
            onCancel={this.cancelAddFolder.bind(this)}
            title='Add Gallery'
            text='Type in the name of the gallery. It should be composed of alphanumeric characters and underscores.'
            add_btn_text='Add Gallery'
          >
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Gallery Name"
              type="text"
              fullWidth
              value={this.state.text}
              onChange={e => this.setState({ input_text: e.target.value })}
              error={this.state.input_error}
            />
          </AddDialog>
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
