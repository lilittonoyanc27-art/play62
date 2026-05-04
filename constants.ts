export const getSpanishNumber = (n: number): string => {
  const ones = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
  const teens = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
  const tens = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];

  if (n < 10) return ones[n];
  if (n >= 10 && n < 20) return teens[n - 10];
  if (n === 20) return "veinte";
  if (n > 20 && n < 30) return `veinti${ones[n - 20] === 'uno' ? 'ún' : ones[n - 20]}`; 
  // Correction: veintiuno, veintidós (with accents usually, but let's stick to standard for A1)
  if (n > 20 && n < 30) {
      if (n === 21) return "veintiuno";
      if (n === 22) return "veintidós";
      if (n === 23) return "veintitrés";
      if (n === 26) return "veintiséis";
      return `veinti${ones[n-20]}`;
  }
  
  if (n % 10 === 0) return n === 100 ? "cien" : tens[n / 10];
  
  return `${tens[Math.floor(n / 10)]} y ${ones[n % 10]}`;
};

export const SPANISH_NUMBERS = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1,
    word: getSpanishNumber(i + 1)
}));
