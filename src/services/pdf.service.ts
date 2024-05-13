import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as memberService from "@/services/member.service";

const DOCUMENTS_DIRECTORY = path.join(__dirname, "../storage/public/documents");
const TEXT_FONT = StandardFonts.Helvetica;

export async function generateMemberCard(id: string) {
  const member = await memberService.getMemberById(id);
  if (!member) {
    throw new Error("Member not found.");
  }

  const buffer = await readDocument("Kartu Anggota.pdf");

  const pdfDoc = await PDFDocument.load(buffer);
  const helveticaFont = await pdfDoc.embedFont(TEXT_FONT);

  const page = pdfDoc.getPages()[0]!;

  page.drawText(member.id, {
    x: 21,
    y: 80,
    size: 8,
    font: helveticaFont,
  });

  page.drawText(member.name, {
    x: 21,
    y: 58,
    size: 8,
    font: helveticaFont,
  });

  const readableDate = member.createdAt.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  page.drawText(readableDate, {
    x: 21,
    y: 34,
    size: 8,
    font: helveticaFont,
  });

  page.drawText(member.branchId.toString(), {
    x: 21,
    y: 13,
    size: 8,
    font: helveticaFont,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function generateDepositForm(id: string) {
  const member = await memberService.getMemberById(id);
  if (!member) {
    throw new Error("Member not found.");
  }

  const buffer = await readDocument("Blanko Simpanan.pdf");

  const pdfDoc = await PDFDocument.load(buffer);
  const helveticaFont = await pdfDoc.embedFont(TEXT_FONT);

  const page = pdfDoc.getPages()[0]!;
  const { height } = page.getSize();

  page.drawText(member.id, {
    x: 186,
    y: height - 101,
    size: 14,
    font: helveticaFont,
  });

  page.drawText(member.name, {
    x: 186,
    y: height - 119,
    size: 14,
    font: helveticaFont,
  });

  page.drawText(member.branchId.toString(), {
    x: 455,
    y: height - 102,
    size: 11,
    font: helveticaFont,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

async function readDocument(name: string) {
  try {
    return fs.readFileSync(path.join(DOCUMENTS_DIRECTORY, name));
  } catch (error) {
    throw new Error("Document not found.");
  }
}
