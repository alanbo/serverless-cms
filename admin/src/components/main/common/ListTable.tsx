import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import { createStyles } from '@material-ui/core/styles';

import { FragmentItem } from '../../../types';

const styles = theme => createStyles({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    display: 'flex',
  },
  table: {
    minWidth: 400,
  },
  smallCell: {
    width: '5%',
    textAlign: 'center',
  }
});


interface Props {
  classes: {
    root: string,
    table: string,
    smallCell: string
  },
  data: Array<FragmentItem>
  onDelete: (id: string) => void
}


function FolderTable(props: Props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell className={classes.smallCell}>Edit</TableCell>
            <TableCell className={classes.smallCell}>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((n, i) => {
            return (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  <Link
                    to={{
                      pathname: `/${n.type}/${n.id}`,
                      state: { id: n.id }
                    }}
                  >{n.name}</Link>
                </TableCell>
                <TableCell>
                  <Link
                    to={{
                      pathname: `/${n.type}/${n.id}`,
                      state: { id: n.id }
                    }}
                  >
                    <IconButton aria-label='Edit'>
                      <EditIcon />
                    </IconButton>
                  </Link>
                </TableCell>
                <TableCell>
                  <IconButton aria-label="Delete" onClick={() => props.onDelete(n.id)}>
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

export default withStyles(styles)(FolderTable);
