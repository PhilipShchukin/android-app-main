import { SearchFrom, UsersRoles } from "../API/types/types";
import { IUser } from "../components/Auth/types";

export interface IInputData {
    name: string;
    label: string;
    comment: string;
    required?: boolean;
    value: string;
}

export interface IJsonNState {
    selectedFileName: string; // имя выбранного json файла номенклатур
    jsonFiles: string[]; // список json файлов номенклатур
    selectedFileContent: string[]; // содержимое файла номенклатур для отображения
    selectedAllFileContent: any; // полное содержимое файла номенклатур {}
}

export interface IOldSorting {
    selectedFileName: string;
    jsonFiles: string[];
    selectedAllFileContent: any;
    selectedFileContent: any;
    selectedFileContentBoxLimit: null | number;
    allBoxes: any[];
    totalBoxesCount: number;
    selectedBoxNumber: number | null;
    allPallets: any[];
    totalPalletsCount: number;
    selectedPalletNumber: number | null;
}

export interface IJsonTaskState {
    selectedFileName: string; // имя выбранного json файла задания
    jsonFiles: string[]; // список json файлов задания
    selectedFileContent: any; // содержимое файла задания для отображения
}

export interface ITemplateState {
    boxTemplate: string[];
    palletTemplate: string[];
}

export interface ISearchRes {
    id: number, pallet_number: number | null, box_number: number, code: string
}
export interface IReportRes {
    status: number,
    message: string,
    foundTables?: string;
}

export interface IUserState {
    user: IUser | null;
    role: UsersRoles;
    isAuthUser: boolean;
    authPage: AuthPages;
}

export enum AuthPages {
    Register = 'register',
    Auth = 'auth'
}

export interface IDBWork {
    codeResponce: ISearchRes | null;
    countInBox: number | null;
    selectedBoxNumber: number | null;
    currentBoxPage: number;
    boxResponce: ISearchRes[];
    allBoxes: any[];
    totalBoxes: number;
    allPallets: any[];
    totalPallets: number;
    currentGtin: string;
    isRequest: boolean;
    from: SearchFrom | null;
}

export interface IBoxRes {
    data: any
}

export interface IMonitoring {
    isMonitoring: boolean;
    isOldMonitoring: boolean;
    isSorting: boolean;
    isPause: boolean;
    isUnfinishedTask: boolean;
    taskName: string;
    countProduct: number;
    productsInCurrentBox: number;
    boxesInCurrentPallet: number;
    currentBoxNumber: number;
    currentPalletNumber: number;
    countBox: number;
    countPallet: number;
}

export interface IChangeCount {
    productCount: number;
    productsInCurrentBox: number;
    boxesInCurrentPallet: number;
    boxCount: number;
    palletCount: number;
    currentBoxNumber: number;
    currentPalletNumber: number;
}