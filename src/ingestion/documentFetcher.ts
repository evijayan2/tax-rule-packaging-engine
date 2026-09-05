import { readFileSync } from "node:fs";
import { computeSha256 } from "../packaging/checksumService.js";
import type { IRawRegulatoryDocument } from "./types.js";

export interface ILocalFileOptions {
  filePath: string;
  authority: string;
  title: string;
  sourceUrl: string;
  publicationDate: string;
  documentType?: string;
}

/**
 * Loads a regulatory document from the local filesystem and attaches SHA-256 document hash.
 * @param options - File loading options.
 * @returns Parsed regulatory document object.
 */
export function loadLocalRegulatoryDocument(options: ILocalFileOptions): IRawRegulatoryDocument {
  const content = readFileSync(options.filePath, "utf8");
  const documentHash = computeSha256(content);

  return {
    authority: options.authority,
    title: options.title,
    sourceUrl: options.sourceUrl,
    publicationDate: options.publicationDate,
    content,
    documentHash,
    documentType: options.documentType ?? "OFFICIAL_GUIDANCE"
  };
}

/**
 * Creates an in-memory regulatory document and computes its SHA-256 hash.
 * @param authority - Authority identifier.
 * @param title - Document title.
 * @param sourceUrl - Public citation URL.
 * @param publicationDate - ISO date string.
 * @param content - Document text.
 * @param documentType - Type of bulletin/notice.
 * @returns Regulatory document with calculated SHA-256 hash.
 */
export function createRegulatoryDocument(
  authority: string,
  title: string,
  sourceUrl: string,
  publicationDate: string,
  content: string,
  documentType = "OFFICIAL_GUIDANCE"
): IRawRegulatoryDocument {
  const documentHash = computeSha256(content);

  return {
    authority,
    title,
    sourceUrl,
    publicationDate,
    content,
    documentHash,
    documentType
  };
}
