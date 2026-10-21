import type { IncomingMessage, ServerResponse } from "node:http";
import defaultHandler from "../src/server/server.js";

/**
 * Vercel Serverless Function entry point for the Tax Rule Package Server.
 * Routes requests to the package request handler serving catalog and package downloads.
 */
export default function handler(req: IncomingMessage, res: ServerResponse): void {
  defaultHandler(req, res);
}
