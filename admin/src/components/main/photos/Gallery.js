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
import InfoIcon from '@material-ui/icons/Info';
import aws_vars from '../../../aws-stack-vars';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 'auto',
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
function makeImgPath(path) {
  return `https://s3-${aws_vars.region}.amazonaws.com/${aws_vars.bucket}/${path}`;
}

class TitlebarGridList extends Component {
  render() {
    const { classes } = this.props;
    const { gallery_name } = this.props.match.params;
    const gallery = this.props.galleries[gallery_name];
    const images = gallery && Object.keys(this.props.images).length
      ? gallery.images
        .map(image_id => this.props.images[image_id])
      : [];
    console.log(images);

    return (
      <div className={classes.root}>
        <GridList cellHeight={180} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">{gallery_name}</ListSubheader>
          </GridListTile>
          {images.map((img, i) => (
            <GridListTile key={i}>
              <img src={makeImgPath(img.paths[0].path)} alt={img.filename} />
              <GridListTileBar
                title={img.filename}
                subtitle={<span>by: {img.id}</span>}
                actionIcon={
                  <IconButton className={classes.icon}>
                    <InfoIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    galleries: state.galleryList,
    images: state.imageList
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(TitlebarGridList)));