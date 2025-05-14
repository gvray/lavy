import fs from "fs-extra";
import { spawn } from "cross-spawn";
import chalk from "chalk";
import emoji from "./emoji";

/**
 * 复制文件从源路径到目标路径
 * @param src 源文件路径
 * @param dest 目标文件路径
 */
async function mvFile(src: string, dest: string): Promise<void> {
	try {
		const content = await fs.readFile(src);
		await fs.ensureFile(dest);
		await fs.writeFile(dest, content);
	} catch (error) {
		return Promise.reject(error);
	}
}

/**
 * 读取源文件内容，通过管道函数处理后写入目标文件
 * @param src 源文件路径
 * @param dest 目标文件路径
 * @param pipe 处理函数
 */
async function changeFile(
	src: string,
	dest: string,
	pipe: (content: string) => string
): Promise<void> {
	try {
		const data = await fs.readFile(src);
		const str = pipe(data.toString());
		await fs.writeFile(dest, str);
	} catch (error) {
		return Promise.reject(error);
	}
}

/**
 * 安装依赖包
 * @param dependencies 依赖包列表
 */
function installPackage(...dependencies: string[]): Promise<string[]> {
	return new Promise((resolve, reject) => {
		let command: string;
		if (fs.existsSync("yarn.lock")) {
			command = /^win/.test(process.platform) ? "yarn.cmd" : "yarn";
		} else if (fs.existsSync("pnpm-lock.yaml")) {
			command = /^win/.test(process.platform) ? "pnpm.cmd" : "pnpm";
		} else {
			command = /^win/.test(process.platform) ? "npm.cmd" : "npm";
		}

		// 根据选择的包管理器，确定使用的命令
		let installCommand: string[];
		if (command.includes("yarn")) {
			installCommand = ["add", "-D"];
		} else if (command.includes("pnpm")) {
			if (fs.existsSync("pnpm-workspace.yaml")) {
				installCommand = ["add", "-D", "-w"];
			} else {
				installCommand = ["add", "-D"];
			}
		} else {
			installCommand = ["install", "-D"];
		}

		const childProcess = spawn(
			command,
			installCommand.concat(...dependencies),
			{ stdio: "inherit" }
		);

		childProcess.on("close", (code: number) => {
			if (code !== 0) {
				console.log(
					chalk.red("Error occurred while installing dependencies!"),
					`with code ${code}`
				);
				reject(
					`❌ Unable to install dependencies, manually install dependencies according to the specific conditions of your project, such as npm yarn or pnpm, the next dependencies you need to see ${dependencies.toString()} 🔧`
				);
				// process.exit(1)
			} else {
				console.log(
					chalk.cyan(`Install finished with ${dependencies.toString()}`)
				);
				resolve(dependencies);
			}
		});
	});
}

/**
 * 移除注释
 * @param msg 输入字符串
 * @returns 移除注释后的字符串
 */
function removeComment(msg: string): string {
	return msg.replace(/^#.*[\n\r]*/gm, "");
}

export {
	mvFile,
	changeFile,
	installPackage,
	removeComment,
	emoji
};
