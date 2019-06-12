import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import GalleryTable, { Data } from '../components/Gallery/GalleryTable';

const data: Data[] = [
  {
    id: '1111111111',
    items_num: 50,
    name: 'food gallery',
    lastModified: +(new Date()) - 5000000
  },
  {
    id: '2222222222',
    items_num: 25,
    name: 'street',
    lastModified: +(new Date()) - 4000000
  },
  {
    id: '3333333333',
    items_num: 0,
    name: 'products',
    lastModified: +(new Date()) - 20000000
  },
  {
    id: '4444444444',
    items_num: 30,
    name: 'random',
    lastModified: +(new Date())
  },
]

storiesOf('Gallery Table', module)
  .add('default', () => (
    <GalleryTable
      title='Galleries'
      onEdit={action('Edit Table')}
      onDelete={action('Delete Table')}
      data={data}
    />
  ));