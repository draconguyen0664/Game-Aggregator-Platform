import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { astToString, default as openapiTS } from "openapi-typescript";

const source = process.env.OPENAPI_URL ?? process.argv[2];
if (!source) {
  console.error(
    "Set OPENAPI_URL or pass a schema path/URL: pnpm generate:api -- ./openapi.json",
  );
  process.exit(1);
}

const input = /^https?:\/\//.test(source)
  ? new URL(source)
  : path.resolve(process.cwd(), source);
const ast = await openapiTS(input);
const output = `${astToString(ast)}\n`;
const destination = path.resolve("src/generated/schema.ts");

await fs.mkdir(path.dirname(destination), { recursive: true });
await fs.writeFile(destination, output, "utf8");
console.log(`Generated ${destination} from ${source}`);
