# js-template-package

A template to be used as a **JavaScript NPM package**.  
Can be used to create a package that is used as a dependency (or devDependency)
of another JavaScript package or application.

## Includes

* NPM configuration (basically, the contents of our old trusty `package.json`)
* Jest setup (tests are executed using `npm run test`)
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
