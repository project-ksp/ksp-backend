import fs from "fs";
import util from "util";
import { pipeline } from "stream";
import { MultipartFile } from "@fastify/multipart";
import mime from "mime-types";
import path from "path";
import crypto from "crypto";

const pump = util.promisify(pipeline);

export async function storeTemporary(data: MultipartFile) {
  const name = crypto.randomUUID() + "." + mime.extension(data.mimetype);
  const location = path.join(__dirname, "../storage/tmp", name);
  await pump(data.file, fs.createWriteStream(location));
  return name;
}
