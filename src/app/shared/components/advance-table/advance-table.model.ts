export interface TableColumn {
    field: string;
    header: string;
    customExportHeader?: string;
    sortable?: boolean;
    minWidth?: string;
    isDelete?: boolean;
    isEdit?: boolean;
    canViewJSON?: boolean;
    canViewTemplate?: boolean;
    canViewOriginal?: boolean;
    canMarkPaid?: boolean;
    isBulkAction?: boolean;
    type?: string
  }
  
  export interface TableConfig {
    totalEmails?: string;
    syncError?: boolean;
    columns: TableColumn[];
    syncMessage?: string;
    isSpinnerRunning? : boolean;
    toolbarConfig: ToolbarConfig;
  }

  export interface ToolbarConfig {
      isMessageSection?: boolean
      showToolbar?: boolean;
      showAdd?: boolean;
      showDelete?: boolean;
      showEdit?: boolean;
      showExport?: boolean;
      showImport?: boolean;
      showFilter?: boolean;
      showSearch?: boolean;
      showBulkAction?: boolean;
  }