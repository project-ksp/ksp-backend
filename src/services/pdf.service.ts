import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as memberService from "@/services/member.service";
import * as leaderService from "@/services/leader.service";
import * as branchService from "@/services/branch.service";
import { Logger } from "@/utils";

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

  page.drawText(member.branch.city, {
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

  pages[0]!.drawText(String(member.branchId), {
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

  const joinDate = member.joinDate ?? new Date().toISOString();
  const joinYear = new Date(joinDate).getFullYear().toString().slice(-2);

  pages[0]!.drawText(
    new Date(joinDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
    }),
    {
      x: 460,
      y: height - 746,
      size: 9,
      font: helveticaFont,
    },
  );
  pages[0]!.drawText(joinYear, {
    x: 533,
    y: height - 746,
    size: 9,
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

  pages[1]!.drawText(member.branch.city, {
    x: 43,
    y: height - 488,
    size: 10,
    font: helveticaFont,
  });

  pages[1]!.drawText(
    new Date(joinDate).toLocaleDateString("id-ID", {
      day: "numeric",
    }),
    {
      x: 260,
      y: height - 536,
      size: 10,
      font: helveticaFont,
    },
  );
  pages[1]!.drawText(
    new Date(joinDate).toLocaleDateString("id-ID", {
      month: "long",
    }),
    {
      x: 280,
      y: height - 536,
      size: 10,
      font: helveticaFont,
    },
  );
  pages[1]!.drawText(joinYear, {
    x: 365,
    y: height - 536,
    size: 9,
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

  pages[2]!.drawText(
    new Date(joinDate).toLocaleDateString("id-ID", {
      day: "numeric",
    }),
    {
      x: 395,
      y: height - 601,
      size: 10,
      font: helveticaFont,
    },
  );
  pages[2]!.drawText(
    new Date(joinDate).toLocaleDateString("id-ID", {
      month: "long",
    }),
    {
      x: 413,
      y: height - 601,
      size: 10,
      font: helveticaFont,
    },
  );
  pages[2]!.drawText(joinYear, {
    x: 483,
    y: height - 601,
    size: 9,
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

  pages[3]!.drawText(
    new Date(joinDate).toLocaleDateString("id-ID", {
      day: "numeric",
    }),
    {
      x: 450,
      y: height - 648,
      size: 10,
      font: helveticaFont,
    },
  );
  pages[3]!.drawText(
    new Date(joinDate).toLocaleDateString("id-ID", {
      month: "long",
    }),
    {
      x: 468,
      y: height - 648,
      size: 10,
      font: helveticaFont,
    },
  );
  pages[3]!.drawText(joinYear, {
    x: 535,
    y: height - 648,
    size: 9,
    font: helveticaFont,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function generateMemberListBook(branchId: number) {
  const branch = await branchService.getBranchById(branchId);
  if (!branch) {
    throw new Error("Branch not found.");
  }

  const allMembers = await Promise.all([
    memberService.getAllMembersWithDeletion({
      where: { branchId, isActive: true },
      limit: branch.publishAmount,
    }),
    memberService.getAllMembersWithDeletion({
      where: { branchId, isActive: false },
    }),
  ]);
  allMembers[1] = allMembers[1].filter((member) => member.deleteRequests?.status === "disetujui");

  const members = allMembers[0].concat(allMembers[1]);
  const buffer = await readDocument("Buku Daftar Anggota.pdf");
  const ttdImageBuffer = await readImage("TTD_Ketua.png");

  const pdfDoc = await PDFDocument.load(buffer);
  const helveticaFont = await pdfDoc.embedFont(TEXT_FONT);

  const pages = pdfDoc.getPages();
  const { height: firstPageHeight } = pages[0]!.getSize();
  const totalPage = Math.ceil(members.length / 20);

  pages[0]!.drawText(branch.city, {
    x: 170,
    y: firstPageHeight - 325,
    size: 14,
    font: helveticaFont,
  });
  pages[0]!.drawText(branch.id.toString(), {
    x: 170,
    y: firstPageHeight - 350,
    size: 14,
    font: helveticaFont,
  });
  for (let i = 1; i <= totalPage; i++) {
    if (i > 1) {
      const newPdf = await pdfDoc.copyPages(pdfDoc, [1]);
      pdfDoc.addPage(newPdf[0]);
    }
  }

  let currentMember = 0;
  for (let i = 0; i < totalPage; i++) {
    const page = pdfDoc.getPages()[i + 1]!;
    const { height } = page.getSize();
    let y = height - 115;
    for (let j = 0; j < 19; j++) {
      if (currentMember >= members.length) {
        break;
      }

      const member = members[currentMember]!;
      const memberAge = new Date().getFullYear() - new Date(member.birthDate).getFullYear();
      page.drawText(member.id, {
        x: 40,
        y,
        size: 6,
        font: helveticaFont,
      });

      page.drawText(member.name, {
        x: 100,
        y,
        size: 6,
        font: helveticaFont,
      });
      page.drawText(member.nik, {
        x: 198,
        y,
        size: 6,
        font: helveticaFont,
      });

      page.drawText(memberAge.toString(), {
        x: 290,
        y,
        size: 6,
        font: helveticaFont,
      });

      page.drawText(member.gender.charAt(0).toUpperCase(), {
        x: 319,
        y,
        size: 6,
        font: helveticaFont,
      });

      page.drawText(member.occupation, {
        x: 340,
        y,
        size: 6,
        font: helveticaFont,
      });

      page.drawText(member.address, {
        x: 435,
        y,
        size: 6,
        font: helveticaFont,
      });

      page.drawText(
        new Date(member.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }),
        {
          x: 575,
          y,
          size: 6,
          font: helveticaFont,
        },
      );
      const ttdImage = await pdfDoc.embedPng(ttdImageBuffer);

      page.drawImage(ttdImage, {
        x: 725,
        y: y - 6,
        width: 15,
        height: 15,
      });

      if (member?.deleteRequests?.status === "disetujui") {
        page.drawText(
          new Date(member.deleteRequests.updatedAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          }),
          {
            x: 765,
            y,
            size: 6,
            font: helveticaFont,
          },
        );

        page.drawText(member.deleteRequests.reason, {
          x: 807,
          y,
          size: 6,
          font: helveticaFont,
        });

        page.drawImage(ttdImage, {
          x: 883,
          y: y - 6,
          width: 15,
          height: 15,
        });
      }

      y -= 25;
      currentMember++;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function generateDocument(name: string) {
  const document = await readDocument(name);
  return document;
}

async function readDocument(name: string) {
  try {
    return fs.readFileSync(path.join(DOCUMENTS_DIRECTORY, name));
  } catch (error) {
    Logger.error("READ", `Failed to read document: ${String(error)}`);
    throw new Error("Document not found.");
  }
}

async function readImage(name: string) {
  try {
    return fs.readFileSync(path.join(DOCUMENTS_DIRECTORY, name));
  } catch (error) {
    Logger.error("READ", `Failed to read image: ${String(error)}`);
    throw new Error("Image not found.");
  }
}
