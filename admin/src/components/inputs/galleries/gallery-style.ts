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
  }
});

export default styles;

export interface GalleryStyle extends WithStyles<typeof styles> { };
