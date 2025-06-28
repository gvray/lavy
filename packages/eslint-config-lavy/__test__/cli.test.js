const assert = require("assert");
const path = require("path");
const fs = require("fs-extra");
const execa = require("execa");
const packageJson = require("../package.json");

const cli = (args, options) => {
	return execa(
		"node",
		[path.resolve(__dirname, "../cli.js"), ...args],
		options,
	);
};

it("--version should output right version", async () => {
	const { stdout } = await cli(["-v"]);
	assert.strictEqual(stdout, packageJson.version);
});
