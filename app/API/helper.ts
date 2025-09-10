export function extractTimestamp(filename: string) {
    const regex = /(\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2})\.json$/;
    const match = filename.match(regex);
    return match ? match[1] : '';
}