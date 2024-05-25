import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as memberService from "@/services/member.service";
import * as leaderService from "@/services/leader.service";

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

export async function generateLoanForm(id: string) {
  const member = await memberService.getMemberById(id);
  if (!member) {
    throw new Error("Member not found.");
  }

  const buffer = await readDocument("Blanko Pinjaman.pdf");

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

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function generateRegistrationForm(id: string) {
  const member = await memberService.getMemberById(id);
  if (!member) {
    throw new Error("Member not found.");
  }

  const leader = await leaderService.getLeaderById(member.leaderId, member.branchId);
  if (!leader) {
    throw new Error("Leader not found.");
  }

  const buffer = await readDocument("Formulir Pendaftaran.pdf");

  const pdfDoc = await PDFDocument.load(buffer);
  const helveticaFont = await pdfDoc.embedFont(TEXT_FONT);

  const pages = pdfDoc.getPages();
  const { height } = pages[0]!.getSize();

  pages[0]!.drawText(member.id, {
    x: 162,
    y: height - 163,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.leader.name, {
    x: 162,
    y: height - 180,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.name, {
    x: 162,
    y: height - 220,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(`${member.birthPlace}, ${member.birthDate}`, {
    x: 162,
    y: height - 240,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.nik, {
    x: 162,
    y: height - 260,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.religion.charAt(0).toUpperCase() + member.religion.substring(1).toLowerCase(), {
    x: 162,
    y: height - 281,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.address, {
    x: 162,
    y: height - 301,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.kelurahan, {
    x: 162,
    y: height - 321,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.city, {
    x: 162,
    y: height - 341,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.education.toUpperCase(), {
    x: 162,
    y: height - 361,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.isMarried ? "Menikah" : "Tidak Menikah", {
    x: 415,
    y: height - 220,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.gender.charAt(0).toUpperCase() + member.gender.substring(1).toLowerCase(), {
    x: 415,
    y: height - 240,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.spouse ?? "", {
    x: 415,
    y: height - 260,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.occupation, {
    x: 415,
    y: height - 281,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.kecamatan, {
    x: 415,
    y: height - 321,
    size: 10,
    font: helveticaFont,
  });

  pages[0]!.drawText(member.phoneNumber, {
    x: 415,
    y: height - 361,
    size: 10,
    font: helveticaFont,
  });

  pages[1]!.drawText(member.name, {
    x: 157,
    y: height - 224,
    size: 10,
    font: helveticaFont,
  });

  pages[1]!.drawText(`${member.birthPlace}, ${member.birthDate}`, {
    x: 157,
    y: height - 246,
    size: 10,
    font: helveticaFont,
  });

  pages[1]!.drawText(member.address, {
    x: 157,
    y: height - 268,
    size: 10,
    font: helveticaFont,
  });

  pages[1]!.drawText(member.id, {
    x: 157,
    y: height - 290,
    size: 10,
    font: helveticaFont,
  });

  pages[2]!.drawText(leader.name, {
    x: 157,
    y: height - 196,
    size: 10,
    font: helveticaFont,
  });

  pages[2]!.drawText(`${leader.birthPlace}, ${leader.birthDate}`, {
    x: 157,
    y: height - 218,
    size: 10,
    font: helveticaFont,
  });

  pages[2]!.drawText(leader.address, {
    x: 157,
    y: height - 240,
    size: 10,
    font: helveticaFont,
  });

  pages[2]!.drawText(leader.id, {
    x: 157,
    y: height - 262,
    size: 10,
    font: helveticaFont,
  });

  pages[2]!.drawText(member.name, {
    x: 157,
    y: height - 310,
    size: 10,
    font: helveticaFont,
  });

  pages[2]!.drawText(member.id, {
    x: 157,
    y: height - 332,
    size: 10,
    font: helveticaFont,
  });

  pages[3]!.drawText(member.name, {
    x: 157,
    y: height - 261,
    size: 10,
    font: helveticaFont,
  });

  pages[3]!.drawText(`${member.birthPlace}, ${member.birthDate}`, {
    x: 157,
    y: height - 283,
    size: 10,
    font: helveticaFont,
  });

  pages[3]!.drawText(member.address, {
    x: 157,
    y: height - 305,
    size: 10,
    font: helveticaFont,
  });

  pages[3]!.drawText(member.id, {
    x: 157,
    y: height - 327,
    size: 10,
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
