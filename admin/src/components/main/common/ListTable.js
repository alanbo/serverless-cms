import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 400,
  },
});


function FolderTable(props) {
  const { classes } = props;
  const has_files = props.data[0] && props.data[0].files;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            {
              has_files
                ? (
                  <TableCell numeric>Number of files</TableCell>
                ) : null
            }
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((n, i) => {
            return (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  <Link
                    to={{
                      pathname: `/${props.root_path}/${n.name}`,
                      state: { id: n.id }
                    }}
                  >{n.name}</Link>
                </TableCell>
                {
                  has_files
                    ? (
                      <TableCell numeric>{n.files}</TableCell>
                    ) : null
                }
                <TableCell>
                  <IconButton aria-label="Delete" onClick={() => props.onDelete(n)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

FolderTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FolderTable);
