export function findBoxPage(
    boxNumber: number | undefined,
    allBoxNumbers: number[],
    itemsPerPage: number
): number {
    if (!boxNumber || !allBoxNumbers.length) return 1;
    
    // const boxTest = [...allBoxNumbers].reverse(); // Без мутации
    const boxIndex = allBoxNumbers.indexOf(boxNumber);
    if (boxIndex === -1) return 1;
    
    return Math.ceil((boxIndex + 1) / itemsPerPage); // Исправленный расчёт
}