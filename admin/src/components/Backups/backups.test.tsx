import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer from 'react-test-renderer';

import Backups, {
  getBackupListQuery,
  deleteBackupsMutation,
  backupMutation,
  restoreFromBackupMutation
} from './';
import { MockedProvider } from "react-apollo/test-utils";

const mocks = [
  {
    request: {
      query: getBackupListQuery,
    },
    result: {
      data: {
        backups: [
          'backup/2019-05-26T18:07:59.826Z.zip',
          'backup/2019-05-26T06:24:27.613Z.zip',
          'backup/2019-05-26T06:24:30.375Z.zip',
          'backup/2019-05-26T06:24:32.611Z.zip'
        ]
      }
    }
  },
  {
    request: {
      query: deleteBackupsMutation,
      variables: {
        iso_dates: ['2019-05-26T18:07:59.826Z']
      }
    },
    result: {
      data: {
        success: true
      }
    }
  },
  {
    request: {
      query: backupMutation,
    },

    result: {
      data: {
        iso_date: (new Date()).toISOString()
      }
    }
  },
  {
    request: {
      query: restoreFromBackupMutation,
      response: {
        data: {
          success: true
        }
      }
    }
  }
]


it('renders without error', () => {
  TestRenderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Backups />
    </MockedProvider>,
  );
});