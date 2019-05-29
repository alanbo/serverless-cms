

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBackupList
// ====================================================

export interface GetBackupList_backups {
  id: string;
  lastModified: string;
  size: number;
  url: string;
}

export interface GetBackupList {
  backups: GetBackupList_backups[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Backup
// ====================================================

export interface Backup_backup {
  id: string;
  lastModified: string;
  size: number;
  url: string;
}

export interface Backup {
  backup: Backup_backup;
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
  id: string;
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
  ids: string[];
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================