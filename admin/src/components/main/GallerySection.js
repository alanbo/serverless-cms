import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import AddDialog from './common/AddDialog';
import Gallery from './photos/Gallery';
import styles from './common/btn_styles';
import * as actionCreators from '../../actions/index';
import { connect } from 'react-redux';



class GallerySectionClass extends Component {
    state = {
        add_dialog_open: false
    };

    selected = [];

    addDialog() {
        this.setState({
            add_dialog_open: true
        });
    }

    closeDialog = () => {
        const { gallery_name } = this.props.match.params;
        const gallery_id = this.props.galleries[gallery_name].id;
        this.props.addImagesToGallery(gallery_id, this.selected);
        this.selected = [];

        this.setState({
            add_dialog_open: false
        });
    }

    cancelDialog = () => {
        this.props.onCancel();
        this.selected = [];
    }

    handleSelect = selected => {
        this.selected = selected;
    }

    render() {
        const { gallery_name } = this.props.match.params;
        const { classes } = this.props;
        console.log(gallery_name);

        return (
            <div>
                <Gallery gallery_name={ gallery_name } reorder_allowed={ true }/>
                <Button variant="fab" color="primary" aria-label="add" className= { classes.button } onClick={ this.addDialog.bind(this) }>
                    <AddIcon />
                </Button>

                {
                    this.state.add_dialog_open
                        ? <AddDialog
                            onClose={ this.closeDialog }
                            onCancel={ this.cancelDialog }
                            title='Add Image'
                            text='Click on the image to mark it to be added to gallery. Click it again to unmark it.'
                            add_btn_text='Add Image'
                            >
                                <Gallery
                                    selectable={ true }
                                    onTileClick={ this.handleSelect }
                                />
                            </AddDialog>
                        : null
                }
            </div>
        );
    };
}

function mapStateToProps(state) {
  return {
    galleries: state.galleryList,
    images: state.imageList
  }
}

const GallerySection = withStyles(styles)(connect(mapStateToProps, actionCreators)(GallerySectionClass));
export { GallerySection };