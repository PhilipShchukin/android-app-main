import { getRussianKeyName } from "./translations";

const keyOrder = [
    'gtin',
    'name',
    'pieces_per_package',
    'packaging_per_pallet',
    'batch',
    'date_manufacture',
    'date_expiration',
    'labelBox',
    'labelPallet',
    'startCorob',
    'startPallet',
    'ITF14',
    'packer'
];

export const getTableData = (selectedFileContent: { [key: string]: unknown } | null) =>
    keyOrder
        .map(key => ({
            key: getRussianKeyName(key),
            value: selectedFileContent?.[key] ?? null,
        }))
        .filter(({ key, value }) => key && value);
