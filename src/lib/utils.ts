import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// import QrCode from "qrcode";
import Jsbarcode from "jsbarcode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStartDateForPeriod = (period: string) => {
  const currentDate = new Date();
  switch (period) {
    case "weekly":
      const startOfWeek = currentDate.getDate() - currentDate.getDay(); // Get the start of the week (Sunday)
      currentDate.setDate(startOfWeek);
      break;
    case "monthly":
      currentDate.setDate(1); // Set the date to the first day of the current month
      break;
    case "yearly":
      currentDate.setMonth(0); // Set the date to the first month (January)
      currentDate.setDate(1); // Set the day to the first day
      break;
    default:
      currentDate.setDate(1); // Default to the first day of the month if no period specified
  }
  return currentDate;
};

// export const downloadBarcode = (value: string) => {
//   QrCode.toString(value, { type: "svg" }, (err, svg) => {
//     if (err) {
//       console.log("Error generating QR code:", err);
//       return;
//     }

//     const qrSize = 2; // QR code size in cm
//     const width = qrSize * 28.35; // Convert cm to px (1cm = 28.35px)
//     const height = qrSize * 28.35;
//     const labelHeight = 0.5; // Label height in cm
//     const totalHeight = height + labelHeight * 28.35; // Total height with label

//     // Combine the QR code SVG with no text below it
//     const SVG = `
//       <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}">
//         <!-- QR Code -->
//         <g transform="translate(0, 0)">
//           ${svg}
//         </g>
//       </svg>
//     `;

//     const blob = new Blob([SVG], { type: "image/svg+xml" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `qrcode.svg`;
//     link.click();

//     URL.revokeObjectURL(url);
//   });
// };

export const downloadBarcode = (value: string) => {
  // Create an SVG element instead of canvas
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  // Generate barcode directly to SVG
  Jsbarcode(svgElement, value, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 100,
    displayValue: true,
    fontSize: 16,
    margin: 10,
  });

  // Get the SVG as a string
  const svgString = new XMLSerializer().serializeToString(svgElement);

  // Create a Blob with the SVG string
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  // Create download link
  const link = document.createElement("a");
  link.href = url;
  link.download = `barcode_${value}.svg`;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// export const downloadBarcode = (value: string) => {
//   // Create a temporary SVG element
//   const svgElement = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "svg"
//   );

//   // Generate the barcode in the SVG element
//   Jsbarcode(svgElement, value, {
//     format: "CODE128",
//     lineColor: "#000",
//     width: 2,
//     height: 80,
//     displayValue: true,
//     fontSize: 14,
//     margin: 10,
//   });

//   // Get the SVG string
//   const svgString = new XMLSerializer().serializeToString(svgElement);

//   // Set dimensions
//   const barcodeWidth = 5; // Barcode width in cm
//   const width = barcodeWidth * 28.35; // Convert cm to px (1cm = 28.35px)
//   const height = 2 * 28.35; // 2cm height
//   const labelHeight = 0.5; // Label height in cm
//   const totalHeight = height + labelHeight * 28.35; // Total height with label

//   // Create the final SVG with specific dimensions
//   const finalSVG = `
//     <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}">
//       <!-- Barcode -->
//       <g transform="translate(0, 0)">
//         ${svgString}
//       </g>
//     </svg>
//   `;

//   // Create a downloadable blob
//   const blob = new Blob([finalSVG], { type: "image/svg+xml" });
//   const url = URL.createObjectURL(blob);

//   // Create and trigger download link
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `barcode-${value}.svg`;
//   link.click();

//   // Clean up
//   URL.revokeObjectURL(url);
// };
