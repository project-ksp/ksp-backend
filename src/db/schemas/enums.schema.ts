import { pgEnum } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["laki-laki", "perempuan"]);
export const roleEnum = pgEnum("role", ["owner", "teller", "branch_head"]);
export const religionEnum = pgEnum("religion", ["islam", "kristen", "katolik", "hindu", "buddha", "konghucu"]);
export const educationEnum = pgEnum("education", ["sd", "smp", "sma", "s1", "s2"]);
export const statusEnum = pgEnum("member_status", ["diproses", "belum disetujui", "disetujui", "ditolak"]);
