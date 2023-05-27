# lavy

Codelint cli that escort for our code programming.

# Usage

```shell

npm install --save-dev lavy

npx lavy --init

# or Select Configuration
npx lavy -i

# show help
npx lavy -h

```

# eslint-config-lavy

Eslint config with typescript, react, vue, and prettier

```shell

npm install --save-dev eslint-config-lavy

```

```js
// .eslintrc.js
module.exports = {
  extends: [require.resolve('lavy')]
}
module.exports = {
  extends: [require.resolve('lavy/react')]
}
module.exports = {
  extends: [require.resolve('lavy/vue')]
}
module.exports = {
  extends: [require.resolve('lavy/typescript')]
}
module.exports = {
  extends: [require.resolve('lavy/typescript/react')]
}
module.exports = {
  extends: [require.resolve('lavy/typescript/vue')]
}
```

# stylelint-config-lavy

Stylelint config with standard and prettier

```shell

npm install --save-dev stylelint-config-lavy

```

```js
// .stylelintrc.js
module.exports = {
  extends: [require.resolve('lavy')]
}
```
