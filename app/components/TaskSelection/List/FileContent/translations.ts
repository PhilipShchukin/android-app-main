export const getRussianKeyName = (key: string): string | null => {
    const keyNames: { [key: string]: string } = {
        gtin: 'GTIN',
        name: 'Название',
        pieces_per_package: 'Штук в упаковке',
        packaging_per_pallet: 'Упаковок на поддоне',
        batch: 'Партия',
        date_manufacture: 'Дата производства',
        date_expiration: 'Дата истечения срока',
        labelBox: 'Этикетка коробки',
        labelPallet: 'Этикетка поддона',
        startCorob: 'Начало коробки',
        startPallet: 'Начало поддона',
        ITF14: 'ITF-14',
        packer: 'Упаковщик'
    };

    return keyNames[key] || null;
};
