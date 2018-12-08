import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import { StorageClass } from 'aws-amplify';
import S3ImageUpload from './elements/S3ImageUpload';

import * as R from 'ramda';

import styles, { GalleryStyle } from './gallery-style';
import { FragmentItem } from '../../../types';


function makeImgPath(path, aws_vars) {
  return `https://s3-${aws_vars.region}.amazonaws.com/${aws_vars.bucket}/${path}`;
}

export interface Gallery {
  id?: string,
  name: string,
  images: { id: string }[]
}

export interface GalleryInput {
  id?: string,
  name: string,
  images: string[]
}

interface Props extends GalleryStyle {
  value: GalleryInput,
  onChange: (value: Gallery) => any,
  fragments: {
    [id: string]: FragmentItem
  },
  aws_vars: {
    region: string,
    bucket: string
  },
  Storage: StorageClass
};

interface State {
  selected_images: string[],
  dragged_over: number,
  selectable: boolean
}

class ImageGallery extends Component<Props, State> {
  state = {
    selected_images: [],
    dragged_over: NaN,
    selectable: false,
    value: {
      name: '',
      images: []
    }
  }

  galleryRef = React.createRef<HTMLDivElement>();
  fileInputRef = React.createRef<HTMLInputElement>();

  current_dragged = NaN;

  selectedToArr() {
    return Object.keys(this.state.selected_images).filter(id => {
      return this.state.selected_images[id];
    });
  }

  removeImage = (id, i) => {
    const filtered = R.remove(i, 1, this.props.value.images);

    this.props.onChange(
      R.assoc('images', filtered, this.props.value)
    );
  }

  onTileClick = (img, i) => {
    if (!this.state.selectable) {
      return;
    }

    const is_selected = this.state.selected_images[img.id];

    if (is_selected) {
      this.setState({
        selected_images: Object.assign({}, this.state.selected_images, { [img.id]: false })
      });
    } else {
      this.setState({
        selected_images: Object.assign({}, this.state.selected_images, { [img.id]: true })
      });
    }
  }

  onDragEnter = event => {
    const tile = event.currentTarget;

    if (tile.tagName === 'LI') {
      tile.style.opacity = 0.4;
      tile.style.filter = 'grayscale(100%)';
    }
  }

  onDragLeave = event => {
    const tile = event.currentTarget;

    if (tile.tagName === 'LI') {
      tile.style.opacity = '';
      tile.style.filter = '';
    }
  }

  onDragStart = (e, i) => {
    this.current_dragged = i;
    if (this.galleryRef && this.galleryRef.current) {
      this.galleryRef.current.classList.add(this.props.classes.tileDragEnter);
    }
  }

  onDragEnd = () => {
    if (this.galleryRef && this.galleryRef.current) {
      this.galleryRef.current.classList.remove(this.props.classes.tileDragEnter);
    }
    this.setState({ dragged_over: NaN })
  }


  onDrop = (e, i) => {
    const { images } = this.props.value;
    const dragged_img = images.splice(this.current_dragged, 1)[0];

    images.splice(i, 0, dragged_img);

    this.props.onChange(R.assoc('images', images, this.props.value));
  }


  renderImageTiles() {
    const { classes, aws_vars, value: { images } } = this.props;

    if (!Array.isArray(images)) {
      return;
    }

    return images.map((img_id, i) => {
      const selected = this.state.selected_images[img_id];
      const dragged_over = this.state.dragged_over === i;

      const selected_class = selected ? classes.selected : '';
      const dragged_over_class = dragged_over ? classes.draggedOver : '';
      const final_class = `gallery-tile ${selected_class} ${dragged_over_class}`;
      const image = this.props.fragments[img_id];

      if (!image) {
        return;
      }

      return (
        <GridListTile
          key={i}
          onClick={() => this.onTileClick(img_id, i)}
          className={final_class}
          draggable={true}
          onDragEnter={() => this.setState({ dragged_over: i })}
          onDragStart={e => this.onDragStart(e, i)}
          onDragEnd={this.onDragEnd}
          onDrop={e => this.onDrop(e, i)}
          onDragOver={e => e.preventDefault()}
        >
          <img
            src={image && image.paths && makeImgPath(image.paths[0].path, aws_vars)}
            alt={image.filename}
            className={classes.image}
          />
          <GridListTileBar
            title={image.filename}
            subtitle={<span>by: {image.id}</span>}
            actionIcon={
              this.state.selectable
                ? false
                : (
                  <IconButton className={classes.icon} onClick={() => this.removeImage(img_id, i)}>
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
    const { classes } = this.props;

    return (
      <div className={classes.root} ref={this.galleryRef}>
        <GridList cellHeight={180} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">
              <TextField
                value={this.props.value.name || ''}
                onChange={e => {
                  this.props.onChange(R.assoc('name', e.target.value, this.props.value));
                }}
                className={classes.nameField}
              />
            </ListSubheader>
          </GridListTile>
          {this.renderImageTiles()}
          <GridListTile className={classes.addIconTile}>
            <IconButton className={classes.addIcon} onClick={() => {
              if (this.fileInputRef && this.fileInputRef.current) {
                this.fileInputRef.current.click();
              }
            }}>
              <AddIcon />
            </IconButton>

          </GridListTile>
        </GridList>

        <S3ImageUpload
          ref={this.fileInputRef}
          onChange={console.log}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ImageGallery);