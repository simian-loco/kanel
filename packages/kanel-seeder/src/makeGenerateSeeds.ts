import { Dirent, promises as fs } from "fs";
import { resolve } from "path";
import { InstantiatedConfig, Output, PreRenderHook, writeFile } from "kanel";
import parseMdconf from "@kristiandupont/mdconf";
import seedInput, { SeedInput } from "./seedInput";
import preprocessData from "./preprocessData";

const makeGenerateSeeds =
  ({ srcPath, dstPath }: { srcPath: string; dstPath: string }): PreRenderHook =>
  async (
    outputAcc: Output,
    instantiatedConfig: InstantiatedConfig,
  ): Promise<Output> => {
    // Use the built-in node module to find files in path with the .mdconf extension
    const allFiles = await fs.readdir(srcPath, { withFileTypes: true });
    const mdconfFiles = allFiles.filter((file) =>
      file.name.endsWith(".mdconf"),
    );

    // For each file, parse the file and add it to the output
    for (const file of mdconfFiles) {
      const srcFilePath = resolve(srcPath, file.name);
      const contents = await fs.readFile(srcFilePath, "utf-8");
      const parsed = parseMdconf(contents, {
        keyNormalizationFunction: (s: string) => s.toLowerCase(),
        validator: seedInput,
      });

      processSeedInput(parsed, instantiatedConfig, srcFilePath, dstPath, file);
    }

    // Return unchanged as we wrote the file manually
    return outputAcc;
  };

export default makeGenerateSeeds;

function processSeedInput(
  parsed: SeedInput,
  instantiatedConfig: InstantiatedConfig,
  srcFilePath: string,
  dstPath: string,
  file: Dirent,
) {
  const { config, defaults, data: inputData } = parsed;

  if (!config.schema) {
    if (Object.keys(instantiatedConfig.schemas).length === 1) {
      config.schema = Object.keys(instantiatedConfig.schemas)[0];
    } else {
      throw new Error(
        `No schema specified in ${srcFilePath} and no default schema found in config`,
      );
    }
  }

  if (!inputData) {
    throw new Error(`No data found in ${srcFilePath}`);
  }

  const data = preprocessData(
    inputData,
    instantiatedConfig.schemas[config.schema],
    defaults,
  );

  const fullPath = resolve(dstPath, file.name.replace(".mdconf", ".js"));

  const lines = [
    "// @generated",
    "// This file is automatically generated by Kanel. Do not modify manually.",
    "",
    'const { makeSeeder } = require("kanel-seeder");',
    "",
    `const data = ${JSON.stringify(data, null, 2)};`,
    "",
    "exports.seed = makeSeeder({ data });",
  ];

  writeFile({ fullPath, lines, ensureFolder: true });
}