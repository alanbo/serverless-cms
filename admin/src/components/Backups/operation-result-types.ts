

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBackupList
// ====================================================

export interface GetBackupList {
  backups: (string | null)[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Backup
// ====================================================

export interface Backup {
  iso_date: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RestoreFromBackup
// ====================================================

export interface RestoreFromBackup {
  success: boolean | null;
}

export interface RestoreFromBackupVariables {
  iso_date: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteBackups
// ====================================================

export interface DeleteBackups {
  success: boolean | null;
}

export interface DeleteBackupsVariables {
  iso_dates: string[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================