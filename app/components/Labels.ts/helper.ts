import { ITemplateResponce, LabelType } from "@/app/API/types/types";

const formatDate = (date: string) => {
    const [day, month, year] = date.split('.');
    return `${year.slice(2)}${month}${day}`;
};

export const options = ['10', '11', '17', '21', '30', '37'];
export const defaultOptions = ['01 gtin', '', '', '', '', ''];

export const generateTemplate = (template: string[], task: any, packagingNumber: number) => {
    const generatedString = template.map((num) => {
        switch (num) {
            case '01 gtin':
                return `01${task.gtin}`;
            case '01 itf14':
                return `01${task.ITF14}`;
            case '10':
                return `10${task.batch}`;
            case '11':
                return `11${formatDate(task.date_manufacture)}`;
            case '17':
                return `17${formatDate(task.date_expiration)}`;
            case '21':
                return `21${packagingNumber}`;
            case '30':
                return `30${task.packaging_per_pallet}`;
            case '37':
                return `37${task.pieces_per_package}`;
            default:
                return '';
        }
    }).join('');
    return generatedString;
};

export const getBoxTemplate = (allTemplates: ITemplateResponce[]) => allTemplates.find(el => el.type === LabelType.Box)
export const getPalletTemplate = (allTemplates: ITemplateResponce[]) => allTemplates.find(el => el.type === LabelType.Pallet)