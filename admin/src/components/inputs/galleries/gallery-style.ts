import { createStyles, WithStyles } from '@material-ui/core';

const styles = theme => createStyles({
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
  },

  draggedOver: {
    opacity: 0.4,
    filter: 'grayscale(100%)'
  },

  nameField: {
    marginBottom: theme.spacing.unit * 4,
    width: '100%'
  },

  addIcon: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
  },

  addIconTile: {
    backgroundColor: 'rgba(200, 200, 200, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fileover: {
    opacity: 0.3,

    '& $gridList': {
      pointerEvents: 'none'
    }
  }
});

export default styles;

export interface GalleryStyle extends WithStyles<typeof styles> { };
