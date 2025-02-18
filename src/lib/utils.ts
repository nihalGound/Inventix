import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import QrCode from "qrcode";

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

export const downloadBarcode = (value: string) => {
  QrCode.toString(value, { type: "svg" }, (err, svg) => {
    if (err) {
      console.log("Error generating QR code:", err);
      return;
    }

    const qrSize = 2; // QR code size in cm
    const width = qrSize * 28.35; // Convert cm to px (1cm = 28.35px)
    const height = qrSize * 28.35;
    const labelHeight = 0.5; // Label height in cm
    const totalHeight = height + labelHeight * 28.35; // Total height with label

    // Combine the QR code SVG with no text below it
    const SVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}">
        <!-- QR Code -->
        <g transform="translate(0, 0)">
          ${svg}
        </g>
      </svg>
    `;

    const blob = new Blob([SVG], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qrcode.svg`;
    link.click();

    URL.revokeObjectURL(url);
  });
};
