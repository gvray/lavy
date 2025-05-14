#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import packageJson from "./package.json";
import {
  mvFile,
  changeFile,
  installPackage,
  removeComment,
  emoji,
} from "./utils";

const cwd = process.cwd();
const program = new Command();

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version, "-v, --version");

// 创建 --init 命令
program
  .option("-i, --init", "Initialize the program")
  .action(async (options: { init?: boolean }) => {
    const { init } = options;
    if (init) {
      try {
        const { languageSelected } = await inquirer.prompt<{ languageSelected: string }>([
          {
            type: "list",
            name: "languageSelected",
            prefix: "🏄‍♂️",
            suffix: "",
            message: "Which language does your project use?",
            choices: ["Typescript", "Javascript"],
          },
        ]);
        const { frameSelected } = await inquirer.prompt<{ frameSelected: string }>([
          {
            type: "list",
            name: "frameSelected",
            prefix: "🏄‍♂️",
            suffix: "",
            message: "Which framework does your project use?",
            choices: ["React", "Vue", "None"],
          },
        ]);
        const { styleSelected } = await inquirer.prompt<{ styleSelected: string }>([
          {
            type: "list",
            name: "styleSelected",
            prefix: "🏄‍♂️",
            suffix: "",
            message: "Which style does your project use?",
            choices: ["Css", "None"],
          },
        ]);
        const { editorSelected } = await inquirer.prompt<{ editorSelected: string }>([
          {
            type: "list",
            name: "editorSelected",
            prefix: "🏄‍♂️",
            suffix: "",
            message: "Which editor does your project use?",
            choices: ["Vscode", "None"],
          },
        ]);

        console.log(
          chalk.green(`🏄‍♂️ Lavy is starting the setup for your project...`),
        );
        // 根据 options 输出 .eslintrc.js 适配的项目 code
        await changeFile(
          join(__dirname, "template", "eslint.tpl"),
          join(cwd, ".eslintrc.js"),
          (str: string) => {
            const getLavy = (): string => {
              const pathName: string[] = [];
              if (languageSelected !== "Javascript") {
                pathName.push(languageSelected.toLowerCase());
              }
              if (frameSelected !== "None") {
                pathName.push(frameSelected.toLowerCase());
              }
              return pathName.length > 0 ? `/${pathName.join("/")}` : "";
            };
            const newStr = str.replace(
              "{{ eslintPath }}",
              `'lavy${getLavy()}'`,
            );
            return newStr;
          },
        );
        // copy 一些文件
        await mvFile(
          join(__dirname, "template", "editorconfig.tpl"),
          join(cwd, ".editorconfig"),
        );
        await mvFile(
          join(__dirname, "template", "eslintignore.tpl"),
          join(cwd, ".eslintignore"),
        );
        await mvFile(
          join(__dirname, "template", "prettierrc.tpl"),
          join(cwd, ".prettierrc.js"),
        );
        if (languageSelected === "Typescript") {
          await mvFile(
            join(__dirname, "template", "tsconfig.tpl"),
            join(cwd, "tsconfig.json"),
          );
        }
        if (styleSelected === "Css") {
          await changeFile(
            join(__dirname, "template", "stylelint.tpl"),
            join(cwd, ".stylelintrc.js"),
            (str: string) =>
              str.replace("{{ stylelintPath }}", `'stylelint-config-lavy'`),
          );
        }
        // editor
        if (editorSelected === "Vscode") {
          await mvFile(
            join(__dirname, "template", "extensions.tpl"),
            join(cwd, ".vscode", "extensions.json"),
          );
          await mvFile(
            join(__dirname, "template", "settings.tpl"),
            join(cwd, ".vscode", "settings.json"),
          );
        }

        // install package
        await installPackage("eslint-config-lavy");
        if (styleSelected === "Css") {
          await installPackage("stylelint-config-lavy");
        }

        console.log(
          chalk.green("Lavy has finished, have a nice journey"),
          "🌈☀️",
        );
      } catch (error) {
        console.log(chalk.red(error));
        process.exit(1);
      }
    }
    if (!options || !Object.keys(options).length) {
      program.help();
    }
  });

// 创建 verify-commit命令

program
  .command("verify-commit")
  .description("Verify the commit message.")
  .argument("[commit-message]", "The commit message to verify")
  .action(async (commitMessage?: string) => {
    let message: string;
    if (!commitMessage) {
      const msgPath = process.env.GIT_PARAMS || process.env.HUSKY_GIT_PARAMS;
      if (!msgPath) {
        console.log(chalk.red("No match GIT_PARAMS or HUSKY_GIT_PARAMS"));
        process.exit(1);
      }
      message = readFileSync(msgPath, "utf-8");
    } else {
      message = commitMessage;
    }
    if (!message) {
      console.log(chalk.red("No commit message found."));
      process.exit(1);
    }
    message = removeComment(message.trim());
    const scope: string[] = [
      "feat",
      "fix",
      "docs",
      "style",
      "refactor",
      "perf",
      "test",
      "workflow",
      "build",
      "ci",
      "chore",
      "types",
      "wip",
      "release",
      "dep",
      "deps",
      "example",
      "examples",
      "merge",
      "revert",
    ];
    // Define your commit message verification logic here
    // const pattern = /^(feat|fix|docs|style|refactor|perf|test|chore)(\(.+\))?: .{1,50}/
    const pattern = new RegExp(
      `^((${emoji}(${scope.join("|")})(\\(.+\\))?:)|(Merge|Revert|Version)) .{1,50}`,
      "i",
    );
    if (!pattern.test(message)) {
      console.log("Commit message is valid.");
      console.log();
      console.log(`Error: ${chalk.red(`Invalid commit message format.`)}`);
      console.log();
      console.log(
        `Proper commit message format is required for automated changelog generation.`,
      );
      console.log(`Examples:`);
      console.log();
      console.log(chalk.green(`  chore(release): update changelog`));
      console.log(
        chalk.green(`  fix(core): handle events on blur (close #188)`),
      );
      console.log(chalk.green(`  📖 docs(core): update docs`));
      console.log();
      process.exit(1);
    }
  });

// 保存原始的 unknownOption 方法
const originalUnknownOption = program.unknownOption;

// 自定义处理未知选项的错误消息
program.unknownOption = function (flag: string) {
  console.error(`Unknown option: ${flag}`);
  program.help();
};

// // 检查是否存在命令
// program.arguments('<command>').action(() => {
//   console.error('No command provided.')
//   program.help()
// })

program.parse(process.argv);
