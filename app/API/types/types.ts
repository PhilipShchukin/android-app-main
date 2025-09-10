export enum LabelType {
    Box = 'box',
    Pallet = 'pallet'
}

export interface IMonitoringStatus {
    status: boolean,
    taskName: string
}

export enum UsersRoles {
    SuperAdmin = 'super_admin',
    Admin = 'admin',
    Master = 'master',
    Operator = 'operator',
    OperatorMaster = 'operator-master',
    Service = 'service',
    Guest = 'guest',
}

export interface ITemplateResponce {
    id: number;
    type: LabelType;
    template: string[]
}

export interface IDeleteCodesData {
    code: string;
    boxNumber: number;
}

export enum SearchFrom {
    Code = 'code',
    Box = 'box'
}

export interface IIsUnfinishedTask {
    isUnfinishedTask: boolean;
    taskFileName: string;
}