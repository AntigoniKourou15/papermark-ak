import * as XLSX from "xlsx";

let cachedPdfjs: typeof import("react-pdf").pdfjs | null = null;

const loadPdfjs = async () => {
  if (cachedPdfjs) return cachedPdfjs;
  if (typeof window === "undefined") return null;

  const { pdfjs } = await import("react-pdf");

  // Default to CDN worker URL
  const cdnWorkerUrl = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  pdfjs.GlobalWorkerOptions.workerSrc = cdnWorkerUrl;

  cachedPdfjs = pdfjs;
  return cachedPdfjs;
};

export const getPagesCount = async (arrayBuffer: ArrayBuffer) => {
  const pdfjs = await loadPdfjs();

  // If we're not in a browser (e.g., during SSR/build), skip PDF parsing
  if (!pdfjs) {
    return 1;
  }

  try {
    // First attempt with the current worker configuration
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    return pdf.numPages;
  } catch (error) {
    console.warn("PDF worker error, trying fallback:", error);

    // Fall back to local worker
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages;
    } catch (fallbackError) {
      console.warn("Both CDN and local worker failed:", fallbackError);
      return 1; // Default to 1 page if both attempts fail
    }
  }
};

export const getSheetsCount = (arrayBuffer: ArrayBuffer) => {
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: "array" });
  return workbook.SheetNames.length ?? 1;
};
