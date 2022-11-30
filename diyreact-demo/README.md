# js-template

A template to be used as a **JavaScript web application**.

## Includes

* NPM configuration (basically, the contents of our old trusty `package.json`)
* Jest setup (tests are executed using `npm run test`)
  * Jest uses Babel behind the scenes. However, we must specifically enable `@babel/preset-env`
    and add it as a `devDependency` or else Jest will keep throwing errors...
* webpack configuration (with an HTML template and Sass transpilation)
* ESLint (configured in `.eslintrc.json`)
  * Recommended VSCode setup is to use the ESLint plugin with these (global or project-specific) settings:
    ```
    ...
    "editor.codeActionsOnSave": {
        "source.organizeImports": true,
        "source.fixAll.eslint": true,
        "source.fixAll": true,
    },
    ...
    ```
