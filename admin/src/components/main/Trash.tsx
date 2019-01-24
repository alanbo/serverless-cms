import React from 'react';
import ListTableTrash from './trash/ListTableTrash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FragmentItem, Fragments, FgState } from '../../types';
import * as R from 'ramda';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import { restoreFragment, permanentlyDeleteFragments } from '../../actions';

const styles = theme => createStyles({
  button: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

interface Props extends WithStyles<typeof styles> {
  deleted_fragments: Array<FragmentItem>
  restoreFragment: (id: string) => any
  permanentlyDeleteFragments: (ids: string[]) => any
}

const selectFragments: (state: FgState) => Fragments = state => state.fragments;

const getDeletedFragments = createSelector(
  [selectFragments], fragments => {
    return R.pipe(
      R.values(),
      R.filter(fg => fg.is_deleted)
    )(fragments)
  }
);

const TrashList = (props: Props) => {

  return (
    <div>
      <h1>Trash</h1>
      <ListTableTrash
        data={props.deleted_fragments}
        onDelete={id => props.permanentlyDeleteFragments([id])}
        onRestore={props.restoreFragment}
      />

      <Button
        variant="fab"
        color="primary"
        aria-label="add"
        className={props.classes.button}
        onClick={() => props.permanentlyDeleteFragments(props.deleted_fragments.map(item => item.id))}
      >
        <DeleteForeverIcon />
      </Button>
    </div>
  )
};

function mapStateToProps(state) {
  return {
    deleted_fragments: getDeletedFragments(state),
  }
}

const Trash = connect(mapStateToProps, { restoreFragment, permanentlyDeleteFragments })(withStyles(styles)(TrashList));


export { Trash };