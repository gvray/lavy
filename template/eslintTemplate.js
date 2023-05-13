module.exports = {
  javascriptnone: `module.exports = {
  extends: ['lavy'].map(require.resolve)
}
`,
  javascriptreact: `module.exports = {
  extends: ['lavy/react'].map(require.resolve)
}
`,
  javascriptvue: `module.exports = {
  extends: ['lavy/vue'].map(require.resolve)
}
`,
  typescriptnone: `module.exports = {
  extends: ['lavy/typescript'].map(require.resolve)
}
`,
  typescriptreact: `module.exports = {
  extends: ['lavy/typescript/react'].map(require.resolve)
}
`,
  typescriptvue: `module.exports = {
  extends: ['lavy/typescript/vue'].map(require.resolve)
}
`
}
