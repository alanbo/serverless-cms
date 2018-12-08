import * as React from 'react';
import * as R from 'ramda';
import {
  page_props,
  gallery_props,
  menu_props,
  text_props,
  image_props
} from './graphql/fragment-queries';

import TextInput from './components/inputs/texts/TextInput';
import MenuInput from './components/inputs/menus/MenuInput';
import ImageGalleryInput, { Gallery, GalleryInput } from './components/inputs/galleries/GalleryInput';

import { InputProps, FragmentItem, FragmentInput } from './types';


interface Config {
  [path: string]: {
    type: string,
    gql_props: string,
    icon?: string,
    input?: React.FunctionComponent<any> | React.ComponentClass<any>,
    transformer?: (item: any) => any
  }
}

const config: Config = {
  pages: {
    type: 'Page',
    gql_props: page_props,
    input: (props: InputProps) => <div>this is input</div>,
    icon: 'pages',
  },

  galleries: {
    type: 'Gallery',
    gql_props: gallery_props,
    input: ImageGalleryInput,
    icon: 'photo_library',
    transformer: (data: Gallery): GalleryInput => {
      return R.assoc(
        'images',
        data.images.map(obj => obj.id),
        data
      )
    }
  },

  menus: {
    type: 'Menu',
    gql_props: menu_props,
    input: MenuInput,
    icon: 'menu'
  },

  texts: {
    type: 'Text',
    gql_props: text_props,
    input: TextInput,
    icon: 'notes'
  },

  images: {
    type: 'Image',
    gql_props: image_props,
  }
}

export default config;