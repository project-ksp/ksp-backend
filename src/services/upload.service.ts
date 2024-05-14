import fs from "fs";
import util from "util";
import { pipeline } from "stream";
import type { MultipartFile } from "@fastify/multipart";
import mime from "mime-types";
import path from "path";
import crypto from "crypto";

const pump = util.promisify(pipeline);
const tempDir = path.join(__dirname, "../storage/tmp");
const uploadDir = path.join(__dirname, "../storage/public");

const placeholderFilename = "placeholder.png";

export async function storeTemporary(data: MultipartFile) {
  fs.mkdirSync(tempDir, { recursive: true });

  const name = crypto.randomUUID() + "." + mime.extension(data.mimetype);
  const location = path.join(tempDir, name);
  await pump(data.file, fs.createWriteStream(location));

  if (data.file.truncated) {
    fs.unlinkSync(location);
    throw new Error("Max file size is 1 MB");
  }

  return name;
}

export function isTemporaryFileExists(name: string) {
  if (name === placeholderFilename) {
    return true;
  }

  const location = path.join(tempDir, name);
  return fs.existsSync(location);
}

export function persistTemporaryFile(name: string) {
  if (name === placeholderFilename) {
    return name;
  }

  fs.mkdirSync(uploadDir, { recursive: true });
  const newName = `uploads/${name}`;
  const source = path.join(tempDir, name);
  const destination = path.join(uploadDir, newName);
  fs.renameSync(source, destination);
  return newName;
}

export function unpersistFile(name: string) {
  if (name === placeholderFilename) {
    return name;
  }

  const newName = name.replace("uploads/", "");
  const source = path.join(uploadDir, name);
  const destination = path.join(tempDir, newName);
  fs.renameSync(source, destination);
  return newName;
}

export function unlinkFile(name: string) {
  if (name === placeholderFilename) {
    return;
  }

  const location = path.join(uploadDir, name);
  fs.unlinkSync(location);
}
