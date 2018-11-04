import * as R from 'ramda';

// Detect if the name attribute on the path
// that is about to be changed
// is empty
function isNameEmpty(path, data) {
  return R.pipe(
    R.intersperse('items'),
    R.prepend('items'),
    R.lensPath(),
    R.view(R.__, data),
    R.ifElse(
      R.has('name'),
      R.prop('name'),
      () => false
    ),
    R.isEmpty()
  )(path);
}

// prepares lenses path for the item being edited and updates it
function getUpdatedMenuData(path, prop_name, value, data) {
  return R.pipe(
    R.intersperse('items'),
    R.prepend('items'),
    R.append(prop_name),
    R.assocPath(R.__, value, data)
  )(path);
}

// check if all path elements cover current_path elements
function isOnPath(path, current_path) {
  let on_path = true;

  path.forEach((item, i) => {
    if (item !== current_path[i]) {
      on_path = false;
    }
  });

  return on_path;
}

const NEW_ITEM = {
  name: '',
  href: null,
  items: null
}

export { isNameEmpty, getUpdatedMenuData, NEW_ITEM, isOnPath };