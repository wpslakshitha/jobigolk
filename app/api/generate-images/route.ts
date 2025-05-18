// app/api/generate-images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createCanvas, registerFont } from "canvas";
import path from "path";
import fs from "fs";

// Font paths (project root එකේ ඉඳන්)
const ISKOOLA_POTHA_PATH = path.join(
  process.cwd(),
  "public",
  "fonts",
  "IskoolaPotaRegular.ttf"
); // ඔයාගේ සිංහල font එකේ නම
const OPEN_SANS_PATH = path.join(
  process.cwd(),
  "public",
  "fonts",
  "OpenSans-Regular.ttf"
); // ඔයාගේ English font එකේ නම
const OPEN_SANS_BOLD_PATH = path.join(
  process.cwd(),
  "public",
  "fonts",
  "OpenSans-Bold.ttf"
);

// Register fonts (API route එක load වෙද්දී එක පාරක්)
try {
  if (fs.existsSync(ISKOOLA_POTHA_PATH)) {
    registerFont(ISKOOLA_POTHA_PATH, { family: "Iskoola Pota" });
  } else {
    console.warn("Sinhala font not found at:", ISKOOLA_POTHA_PATH);
  }
  if (fs.existsSync(OPEN_SANS_PATH)) {
    registerFont(OPEN_SANS_PATH, { family: "Open Sans", weight: "normal" });
  } else {
    console.warn("Open Sans Regular font not found at:", OPEN_SANS_PATH);
  }
  if (fs.existsSync(OPEN_SANS_BOLD_PATH)) {
    registerFont(OPEN_SANS_BOLD_PATH, { family: "Open Sans", weight: "bold" });
  } else {
    console.warn("Open Sans Bold font not found at:", OPEN_SANS_BOLD_PATH);
  }
} catch (error) {
  console.error("Error registering fonts:", error);
}

interface RequestBody {
  jobTitles: string[];
  contactPhone: string;
  contactEmail: string;
  contactWebsite: string;
  bottomText: string;
  imageWidth?: number;
  imageHeight?: number;
}

// Helper function to get contrasting text color
function getContrastingTextColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF"; // Dark text on light bg, White text on dark bg
}

// Helper function to check if text contains Sinhala characters
function isSinhala(text: string): boolean {
  // A simple check for common Sinhala Unicode range
  return /[\u0D80-\u0DFF]/.test(text);
}

// Predefined color palette
const COLOR_PALETTE = [
  "#F94144",
  "#F3722C",
  "#F8961E",
  "#F9C74F",
  "#90BE6D",
  "#43AA8B",
  "#4D908E",
  "#577590",
  "#277DA1",
  "#003049",
  "#d62828",
  "#f77f00",
  "#fcbf49",
  "#eae2b7",
  "#2a9d8f",
  "#e76f51",
  "#f4a261",
  "#e9c46a",
  "#264653",
  "#2b2d42",
  "#8d99ae",
  "#edf2f4",
  "#ef233c",
  "#d90429",
];

let lastUsedColorIndex = -1;

function getRandomPaletteColor(): string {
  lastUsedColorIndex = (lastUsedColorIndex + 1) % COLOR_PALETTE.length;
  return COLOR_PALETTE[lastUsedColorIndex];
}

function wrapText(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  baseFont: string,
  isBold: boolean = false
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  const fontWeight = isBold ? "bold " : "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    context.font = fontWeight + baseFont; // Set font for measurement
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, currentY);
  return currentY + lineHeight; // Return Y position after last line
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const {
      jobTitles,
      contactPhone,
      contactEmail,
      contactWebsite,
      bottomText,
      imageWidth = 1080, // Default Facebook/Instagram post size
      imageHeight = 1080, // Default Facebook/Instagram post size
    } = body;

    if (!jobTitles || jobTitles.length === 0) {
      return NextResponse.json(
        { error: "Job titles are required" },
        { status: 400 }
      );
    }

    const generatedImages: string[] = [];
    lastUsedColorIndex = -1; // Reset color index for each batch

    for (const title of jobTitles) {
      const canvas = createCanvas(imageWidth, imageHeight);
      const ctx = canvas.getContext("2d");

      // 1. Background
      const bgColor = getRandomPaletteColor();
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, imageWidth, imageHeight);

      const textColor = getContrastingTextColor(bgColor);
      ctx.fillStyle = textColor;

      const padding = Math.floor(imageWidth * 0.08); // 8% padding
      const contentWidth = imageWidth - 2 * padding;

      // 2. Job Title
      const isSinhalaTitle = isSinhala(title);
      const titleFontSize = Math.floor(imageWidth * 0.07); // Responsive font size
      const titleFontFamily = isSinhalaTitle ? "Iskoola Pota" : "Open Sans";
      const titleLineHeight = titleFontSize * 1.2;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Use wrapText for title
      const titleYPosition = imageHeight * 0.35; // Start title around 35% from top
      const lastTitleY = wrapText(
        ctx,
        title,
        imageWidth / 2,
        titleYPosition,
        contentWidth,
        titleLineHeight,
        `${titleFontSize}px "${titleFontFamily}"`,
        true
      );

      // 3. Separator Line (optional)
      const separatorY = lastTitleY + Math.floor(imageHeight * 0.05); // Space after title
      if (separatorY < imageHeight - padding * 3) {
        // Ensure there's space
        ctx.beginPath();
        ctx.moveTo(padding, separatorY);
        ctx.lineTo(imageWidth - padding, separatorY);
        ctx.strokeStyle = textColor; // Use contrasting color
        ctx.globalAlpha = 0.5; // Make it a bit subtle
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1.0; // Reset alpha
      }

      // 4. Contact Information
      const contactFontSize = Math.floor(imageWidth * 0.035);
      const contactLineHeight = contactFontSize * 1.4;
      const contactFont = `${contactFontSize}px "Open Sans"`; // Assuming contact info is mostly English
      ctx.font = contactFont;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom"; // Align text to its bottom

      if (bottomText) {
        const bottomTextYPos = imageHeight - padding;
        wrapText(
          ctx,
          bottomText,
          imageWidth / 2,
          bottomTextYPos - contactLineHeight,
          contentWidth * 0.9,
          contactLineHeight * 0.8,
          `${contactFontSize * 0.9}px "Open Sans"`
        );
      }
      if (contactWebsite) {
        const websiteYPos =
          imageHeight - padding - (bottomText ? contactLineHeight * 1.2 : 0);
        wrapText(
          ctx,
          contactWebsite,
          imageWidth / 2,
          websiteYPos,
          contentWidth,
          contactLineHeight,
          contactFont
        );
      }
      if (contactEmail) {
        const emailYPos =
          imageHeight -
          padding -
          (bottomText ? contactLineHeight * 1.2 : 0) -
          (contactWebsite ? contactLineHeight : 0);
        wrapText(
          ctx,
          contactEmail,
          imageWidth / 2,
          emailYPos,
          contentWidth,
          contactLineHeight,
          contactFont
        );
      }
      if (contactPhone) {
        const phoneYPos =
          imageHeight -
          padding -
          (bottomText ? contactLineHeight * 1.2 : 0) -
          (contactWebsite ? contactLineHeight : 0) -
          (contactEmail ? contactLineHeight : 0);
        wrapText(
          ctx,
          contactPhone,
          imageWidth / 2,
          phoneYPos,
          contentWidth,
          contactLineHeight,
          contactFont
        );
      }

      // Convert canvas to PNG Base64
      generatedImages.push(canvas.toDataURL("image/png"));
    }

    return NextResponse.json({ images: generatedImages });
  } catch (error) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      { error: "Failed to generate images", details: (error as Error).message },
      { status: 500 }
    );
  }
}
