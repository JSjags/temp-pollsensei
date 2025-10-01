 export function formatNumber(value: number | string | undefined) {
    const numberValue = typeof value === "string" ? parseFloat(value) : value;
    if (typeof numberValue !== "number" || isNaN(numberValue)) return "";
    return numberValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }