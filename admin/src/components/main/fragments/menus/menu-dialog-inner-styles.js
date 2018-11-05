export default theme => ({
  text_field: {
    width: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  addBtnWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 10
  },

  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  list: {
    listStyleType: 'none',
    padding: 20,
    marginBottom: 20
  },

  expansionPanel: {
    marginTop: 20,
    marginBottom: 20,
  },

  expansionPanelDetails: {
    display: 'block'
  },

  textFieldsWrapper: {
    padding: 20,
    marginBottom: 20
  }
});