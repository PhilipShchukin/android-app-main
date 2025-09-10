
export enum localStorageNames {
    User = 'user',
    PLCStatus = 'plcStatus',
    PrinterStatus = 'printerStatus',
    CameraStatus = 'cameraStatus',
}

export enum RootStatus {
    Success = 'success',
    Error = 'error'
}

export interface RootMessage {
    status: RootStatus,
    message: string
}

export interface RootStatuses {
    isMonitoring: boolean;
    isPaused: boolean;
}