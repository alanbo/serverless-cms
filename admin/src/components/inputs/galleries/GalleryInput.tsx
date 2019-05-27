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
import S3ImageUpload, { uploadFiles } from './elements/S3ImageUpload';

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
  resizeImages: (paths: string[], callback: (images: FragmentItem[]) => any) => any
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
  selectable: boolean,
  is_file_drag: boolean
}

class ImageGallery extends Component<Props, State> {
  state = {
    selected_images: [],
    dragged_over: NaN,
    selectable: false,
    is_file_drag: false,
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
      // @ts-ignore
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

  onDragEnter = (e, i) => {
    const types = e.dataTransfer && e.dataTransfer.types;

    if (types.indexOf('Files') >= 0) {
      return;
    }

    e.stopPropagation();

    if (!e.dataTransfer.files.length) {
      this.setState({ dragged_over: i });
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
    const types = e.dataTransfer && e.dataTransfer.types;

    if (types.indexOf('Files') >= 0) {
      return;
    }

    const { images } = this.props.value;
    const dragged_img = images.splice(this.current_dragged, 1)[0];

    images.splice(i, 0, dragged_img);

    // @ts-ignore
    this.props.onChange(R.assoc('images', images, this.props.value));
  }

  onUpload = paths => {
    this.props.resizeImages(paths, images => {
      this.props.onChange(
        // @ts-ignore
        R.assoc(
          'images',
          R.concat(this.props.value.images || [], R.map(img => img.id, images)),
          this.props.value
        )
      );
    });
  }

  onDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.items && e.dataTransfer.items.length) {
      const files = R.values(e.dataTransfer.items)
        // @ts-ignore
        .filter(item => item.kind === 'file')
        // @ts-ignore
        .map(file => file.getAsFile());

      uploadFiles(files, this.props.value.name, this.onUpload);
    }
  }

  onDragOverFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
          onDragEnter={e => this.onDragEnter(e, i)}
          onDragLeave={e => e.stopPropagation()}
          onDragStart={e => this.onDragStart(e, i)}
          onDragEnd={this.onDragEnd}
          onDrop={e => this.onDrop(e, i)}
          onDragOver={e => e.preventDefault()}
          onMouseOut={() => {
            if (this.state.dragged_over === i) {
              this.setState({ dragged_over: NaN })
            }
          }}
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
    const { classes, value } = this.props;

    return (
      <div
        className={classes.root}
        ref={this.galleryRef}
        onDrop={this.onDropFile}
        onDragOverCapture={this.onDragOverFile}
      >
        <GridList cellHeight={180} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">
              <TextField
                value={this.props.value.name || ''}
                onChange={e => {
                  // @ts-ignore
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
          onChange={this.onUpload}
          gallery={value.name}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ImageGallery);