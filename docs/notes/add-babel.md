# Babel

## LD Steps

1. `npm i @babel/core @babel/present-env`
2. `npm i --save-dev @babel/node`
3. add .babelrc
```json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```
4. update `devstart` script to `nodemon --exec babel-node ./bin/www`

## Resources

[https://www.robinwieruch.de/minimal-node-js-babel-setup](https://www.robinwieruch.de/minimal-node-js-babel-setup)
