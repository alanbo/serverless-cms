import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Loading from '../components/shared/Loading';

storiesOf('Loading Screen', module)
  .add('Default', () => (
    <div style={{ height: '500px' }}>
      <Loading />
    </div>
  ));