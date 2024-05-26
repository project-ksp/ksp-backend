import type { FastifyReply, FastifyRequest } from "fastify";
import * as pdfService from "@/services/pdf.service";

export async function getBlankoPinjaman(_request: FastifyRequest, reply: FastifyReply) {
  const pdf = await pdfService.generateDocument("Blanko Pinjaman.pdf");
  reply.header("Content-Type", "application/pdf").send(pdf);
}

export async function getBlankoSimpanan(_request: FastifyRequest, reply: FastifyReply) {
  const pdf = await pdfService.generateDocument("Blanko Simpanan.pdf");
  reply.header("Content-Type", "application/pdf").send(pdf);
}

export async function getEmptyForm(_request: FastifyRequest, reply: FastifyReply) {
  const pdf = await pdfService.generateDocument("Formulir Pendaftaran.pdf");
  reply.header("Content-Type", "application/pdf").send(pdf);
}
