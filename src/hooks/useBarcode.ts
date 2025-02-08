import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
export const useBarcode = () => {
  let barcode: string;
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const [copies, setCopies] = useState(1); // Number of copies
  const svgRef = useRef<SVGSVGElement>(null);
  const createBarcode = (barcodeValue: string) => {
    if (!barcodeValue) {
      console.error("Invalid barcode value.");
      return;
    }

    if (!svgRef.current) {
      console.error("SVG reference is not available.");
      return;
    }

    if (svgRef.current) {
      // Generate barcode in the SVG
      JsBarcode(svgRef.current, barcodeValue);
      barcode = barcodeValue;

      const svgElement = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svgElement);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL("image/png");

        // Generate multiple copies of the barcode
        const multipleBarcodes = Array(copies).fill(pngData);
        setBarcodes(multipleBarcodes);

        URL.revokeObjectURL(url); // Clean up object URL
      };

      img.src = url;
    }
  };

  const printBarcode = () => {
    const doc = new jsPDF();
    const barcodeWidth = 40; //in mm
    const barcodeHeight = 15;
    const margin = 5;
    const pageWidth = 210;
    const pageHeight = 297; //A4 size in mm

    const barcodePerRow = Math.floor((pageWidth - 2 * margin) / barcodeWidth);
    const barcodesPerColumn = Math.floor(
      (pageHeight - 2 * margin) / barcodeHeight
    );
    let xPos = margin;
    let yPos = margin;

    let pageCount = 1;

    barcodes.forEach((barcode, index) => {
      // Add barcode to the PDF
      doc.addImage(barcode, "PNG", xPos, yPos, barcodeWidth, barcodeHeight);

      // Move to the next position in the row
      xPos += barcodeWidth + margin;

      // If the row overflows, start a new row
      if (xPos + barcodeWidth > pageWidth - margin) {
        xPos = margin; // Reset X position
        yPos += barcodeHeight + margin; // Move down to the next row

        // If the page overflows, add a new page
        if (yPos + barcodeHeight > pageHeight - margin) {
          doc.addPage();
          pageCount++;
          yPos = margin; // Reset Y position for new page
        }
      }

      // Add a new page if barcodes are still left
      if (
        index === barcodes.length - 1 &&
        pageCount <
          Math.ceil(barcodes.length / (barcodePerRow * barcodesPerColumn))
      ) {
        doc.addPage();
        yPos = margin;
        xPos = margin;
      }
    });

    //func to open print window for print
    doc.save(`${barcode}.pdf`);
  };

  return {
    createBarcode,
    printBarcode,
    copies,
    setCopies,
    svgRef,
  };
};
