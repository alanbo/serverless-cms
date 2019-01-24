import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import RestoreIcon from '@material-ui/icons/Restore';
import { createStyles } from '@material-ui/core/styles';

import { FragmentItem } from '../../../types';

const styles = theme => createStyles({
  root: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 10,
    display: 'flex',
    overflow: 'none'
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
  data: Array<FragmentItem>,
  type_path?: string,
  onDelete: (id: string) => void
  onRestore: (id: string) => void
}


function ListTable(props: Props) {
  const { classes, type_path } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell className={classes.smallCell}>Restore</TableCell>
            <TableCell className={classes.smallCell}>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((n, i) => {
            return (
              <TableRow key={i}>
                <TableCell component="th" scope="row">{n.name}</TableCell>
                <TableCell component="th" scope="row">{n.type}</TableCell>
                <TableCell>
                  <IconButton aria-label="Restore" onClick={() => props.onRestore(n.id)}>
                    <RestoreIcon />
                  </IconButton>
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

export default withStyles(styles)(ListTable);
