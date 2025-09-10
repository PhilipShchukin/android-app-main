export const validateFileContent = (content: any) => {
    const requiredFields = ["gtin", "name", "labelBox", "labelPallet", "pieces_per_package", "packaging_per_pallet", "date_manufacture", "date_expiration", "startCorob", "startPallet"];
    for (const field of requiredFields) {
      if (!content[field]) {
        return false;
      }
    }

    const isValidDate = (date: any) => {
      return /^\d{2}.\d{2}.\d{4}$/.test(date);
    };

    const isValidNumber = (num: any) => {
      return !isNaN(num);
    };

    if (!isValidDate(content.date_manufacture) || !isValidDate(content.date_expiration)) {
      return false;
    }

    if (!/^\d{14}$/.test(content.gtin)) {
      return false;
    }

    const numberFields = ["pieces_per_package", "packaging_per_pallet", "nettoUnit", "bruttoUnit", "bruttoBox"];
    for (const field of numberFields) {
      if (content[field] && !isValidNumber(content[field])) {
        return false;
      }
    }

    return true;
  };