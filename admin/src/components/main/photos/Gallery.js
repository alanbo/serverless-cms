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
    height: 450,
    alignItems: 'flex-start'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }
});

function makeImgPath(path) {
  return `https://s3-${aws_vars.region}.amazonaws.com/${aws_vars.bucket}/${path}`;
}

class Gallery extends Component {
  removeImage = (id) => {
    this.props.removeImage(id);
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
      <div className={classes.root}>
        <GridList cellHeight={180} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">{gallery_name}</ListSubheader>
          </GridListTile>
          {images.map((img, i) => (
            <GridListTile key={i}>
              <img src={makeImgPath(img.paths[0].path)} alt={img.filename} className={classes.image}/>
              <GridListTileBar
                title={img.filename}
                subtitle={<span>by: {img.id}</span>}
                actionIcon={
                  this.props.hide_delete
                  ? false
                  : (
                    <IconButton className={classes.icon} onClick={ () => this.removeImage(img.id) }>
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              />
            </GridListTile>
          ))}
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