import { readFile } from "fs/promises";

const args = process.argv;

const day = `day${args[2]}`;
const input = args[3] ?? "input";

const file = await readFile(`./${day}/${input}.txt`);
const inputText = file.toString();
const inputLines = inputText.split(/\r?\n/);

const solution = await import(`./${day}/index.mjs`);

await solution.default({
  inputText,
  inputLines,
});
