import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import AddToGalleryDialog from './gallery-section/AddToGalleryDialog';
import Gallery from './photos/Gallery';
import { styles } from './Photos';



class GallerySectionClass extends Component {
    constructor() {
        super();
        this.state = {
            add_dialog_open: false
        }
    }

    addDialog() {
        console.log('adding');
        this.setState({
            add_dialog_open: true
        });
    }

    closeDialog = selected => {
        this.setState({
            add_dialog_open: false
        });

        console.log(selected);
    }

    render() {
        const { gallery_name } = this.props.match.params;
        const { classes } = this.props;
        console.log(gallery_name);

        return (
            <div>
                <Gallery gallery_name={ gallery_name } />
                <Button variant="fab" color="primary" aria-label="add" className= { classes.button } onClick={ this.addDialog.bind(this) }>
                    <AddIcon />
                </Button>

                {
                    this.state.add_dialog_open
                        ? <AddToGalleryDialog
                            onClose={ this.closeDialog }
                            onCancel={ this.closeDialog }
                            gallery_name={ gallery_name }
                          />
                        : null
                }
            </div>
        );
    };
}

const GallerySection = withStyles(styles)(GallerySectionClass);
export { GallerySection };