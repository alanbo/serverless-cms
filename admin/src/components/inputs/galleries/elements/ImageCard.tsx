import React from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = createStyles({
  card: {
    maxWidth: 345,
  },
  media: {
    // ⚠️ object-fit is not supported by IE11.
    objectFit: 'cover',
  },
});

interface Props extends WithStyles<typeof styles> {
  path: string,
  filename: string
}

function ImgMediaCard(props: Props) {
  const { classes } = props;
  return (
    <Card className={classes.card}>
      <CardMedia
        component="img"
        className={classes.media}
        image={props.path}
        title={props.filename}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {props.filename}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

export default withStyles(styles)(ImgMediaCard);