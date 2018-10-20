import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import aws_vars from '../../../aws-stack-vars';
import * as actionCreators from '../../../actions/index';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    alignItems: 'flex-start'
  },
  gridList: {
    width: '100%',
    height: 'auto',
    alignItems: 'flex-start'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: 'none'
  },
  selected: {
    opacity: 0.5
  },

  tileDragEnter: {
    '& .gallery-tile *': {
      pointerEvents: 'none'
    }
  }
});

function makeImgPath(path) {
  return `https://s3-${aws_vars.region}.amazonaws.com/${aws_vars.bucket}/${path}`;
}

class Gallery extends Component {
  state = {
    selected_images: []
  }

  galleryRef = React.createRef();
  current_dragged = NaN;

  selectedToArr() {
    return Object.keys(this.state.selected_images).filter( id => {
      return this.state.selected_images[id];
    });
  }

  removeImage = (id, i) => {
    if (this.props.gallery_name) {
      const gallery_id = this.props.galleries[this.props.gallery_name].id;

      this.props.removeImageFromGallery(gallery_id, i);
    } else {
      this.props.removeImage(id);
    }
  }

  onTileClick = (img, i) => {
    if (!this.props.selectable) {
      return;
    }

    const is_selected = this.state.selected_images[img.id];

    if (is_selected) {
      this.setState({
        selected_images: Object.assign({}, this.state.selected_images, { [img.id]: false })
      }, () => {
        if (this.props.onTileClick) {
          this.props.onTileClick(this.selectedToArr());
        }
      });
    } else {
      this.setState({
        selected_images: Object.assign({}, this.state.selected_images, { [img.id]: true })
      }, () => {
        if (this.props.onTileClick) {
          this.props.onTileClick(this.selectedToArr());
        }
      });
    }
  }

  onDragEnter = event => {
    if (!this.props.reorder_allowed) {
      return;
    }

    const tile = event.currentTarget;

    if (tile.tagName === 'LI') {
      tile.style.opacity = 0.4;
      tile.style.filter = 'grayscale(100%)';
    }
  }

  onDragLeave = event => {
    if (!this.props.reorder_allowed) {
      return;
    }

    const tile = event.currentTarget;

    if (tile.tagName === 'LI') {
      tile.style.opacity = '';
      tile.style.filter = '';
    }
  }

  onDragStart = (e, i) => {
    if (!this.props.reorder_allowed) {
      return;
    }

    this.current_dragged = i;
    this.galleryRef.current.classList.add(this.props.classes.tileDragEnter);
  }

  onDragEnd = () => {
    if (!this.props.reorder_allowed) {
      return;
    }

    this.galleryRef.current.classList.remove(this.props.classes.tileDragEnter);
  }

  onDrop = (e, i) => {
    if (!this.props.reorder_allowed) {
      return;
    }

    const { id, images }= this.props.galleries[this.props.gallery_name];

    const dragged_img = images.splice(this.current_dragged, 1)[0];
    images.splice(i, 0, dragged_img);

    this.props.reorderImagesInGallery(id, images);
  }
  

  renderImageTiles() {
    const { classes, gallery_name } = this.props;
    const gallery = this.props.galleries[gallery_name];
    let images = [];

    if (gallery && Object.keys(this.props.images).length) {
      images = gallery.images.map(image_id => this.props.images[image_id])
    } else {
      images = Object.keys(this.props.images).map(key => this.props.images[key]);
    }

    return images.map((img, i) => {
      const selected = this.state.selected_images[img.id];

      return (
        <GridListTile
          key={i}
          onClick={ () => this.onTileClick(img, i) }
          className={ `${selected ? classes.selected : ''} gallery-tile` }
          draggable={ this.props.reorder_allowed }
          onDragEnter={ this.onDragEnter }
          onDragLeave={ this.onDragLeave }
          onDragStart={ e => this.onDragStart(e, i) }
          onDragEnd={ this.onDragEnd }
          onDrop={ e => this.onDrop(e, i) }
          onDragOver={ e => e.preventDefault() }
        >
          <img
            src={makeImgPath(img.paths[0].path)}
            alt={img.filename}
            className={classes.image}
          />
          <GridListTileBar
            title={img.filename}
            subtitle={<span>by: {img.id}</span>}
            actionIcon={
              this.props.selectable
              ? false
              : (
                <IconButton className={classes.icon} onClick={ () => this.removeImage(img.id, i) }>
                  <DeleteIcon />
                </IconButton>
              )
            }
          />
        </GridListTile>
      );
    });
  }

  render() {
    const { classes, gallery_name } = this.props;
    const gallery = this.props.galleries[gallery_name];
    let images = [];

    if (gallery && Object.keys(this.props.images).length) {
      images = gallery.images.map(image_id => this.props.images[image_id])
    } else {
      images = Object.keys(this.props.images).map(key => this.props.images[key]);
    }

    return (
      <div className={classes.root} ref={ this.galleryRef }>
        <GridList cellHeight={180} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">{gallery_name}</ListSubheader>
          </GridListTile>
          { this.renderImageTiles() }
        </GridList>
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

export default withRouter(connect(mapStateToProps, actionCreators)(withStyles(styles)(Gallery)));