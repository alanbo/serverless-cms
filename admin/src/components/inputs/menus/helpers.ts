import * as R from 'ramda';
import { Item } from './types';

function fixPath(path: number[]): (number | string)[] {
  return R.pipe(
    R.intersperse('items'),
    R.prepend('items'),
    // @ts-ignore
  )(path);
}

// Detect if the name attribute on the path
// that is about to be changed
// is empty
function isNameEmpty(path: number[], data: Item) {
  return R.pipe(
    fixPath,
    // @ts-ignore
    R.lensPath(),
    // @ts-ignore
    R.view(R.__, data),
    R.ifElse(
      R.has('name'),
      R.prop('name'),
      () => false
    ),
    // @ts-ignore
    R.isEmpty()
  )(path);
}

// prepares lenses path for the item being edited and updates it
function getUpdatedMenuData(path: string[], prop_name: string, value: string, data: Item) {
  return R.pipe(
    fixPath,
    R.append(prop_name),
    R.assocPath(R.__, value, data)
    // @ts-ignore
  )(path);
}

function getDissocMenuData(path: number[], data: Item) {
  const fixed_path = fixPath(path);
  const parent_items_path = R.init(fixed_path);

  // @ts-ignore
  return R.pipe(
    // @ts-ignore
    R.dissocPath(R.__, data),
    R.ifElse(
      // @ts-ignore
      R.pathSatisfies(items => !!items.length, parent_items_path),
      R.identity,
      R.dissocPath(parent_items_path)
    )
    // @ts-ignore
  )(fixed_path);

}

// check if all path elements cover current_path elements
function isOnPath(path: number[], current_path: number[]): boolean {
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

export { isNameEmpty, getUpdatedMenuData, getDissocMenuData, NEW_ITEM, isOnPath };