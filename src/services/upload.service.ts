import fs from "fs";
import util from "util";
import { pipeline } from "stream";
import { MultipartFile } from "@fastify/multipart";
import mime from "mime-types";
import path from "path";
import crypto from "crypto";

const pump = util.promisify(pipeline);
const tempDir = path.join(__dirname, "../storage/tmp");
const uploadDir = path.join(__dirname, "../storage/public");

export async function storeTemporary(data: MultipartFile) {
  const name = crypto.randomUUID() + "." + mime.extension(data.mimetype);
  const location = path.join(tempDir, name);
  await pump(data.file, fs.createWriteStream(location));
  return name;
}

export function isTemporaryFileExists(name: string) {
  const location = path.join(tempDir, name);
  return fs.existsSync(location);
}

export function persistTemporaryFile(name: string) {
  const newName = `uploads/${name}`;
  const source = path.join(tempDir, name);
  const destination = path.join(uploadDir, newName);
  fs.renameSync(source, destination);
  return newName;
}
