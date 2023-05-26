{
  "extends": ["lavy/tsconfig.base.json"],
  "compilerOptions": {
    "target": "ESNEXT",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "./",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
    // "outFile": "./",
    // "allowJs": true,
    // "checkJs": true,
    // "jsx": "react-jsxdev",
    // "declaration": false,
    // "declarationMap": false,
    // "sourceMap": false,
    // "downlevelIteration": true ,
    // "importHelpers": true,
    // "lib": [],
    // "rootDirs": [],
    // "typeRoots": [],
    // "types": [],
  },
  // "include": [""],
  "exclude": ["node_modules", "**/node_modules/*"]
}
