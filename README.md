# **Coil-React-Cli**

A Command line interface for module generation for React Framework -- [**`Coil React`**](https://github.com/Jamyth/coil-react)

## Installation & Usage

```bash
$ yarn global add coil-react-cli
or
$ npm install -G coil-react-cli
```

There are two ways to use this library

### 1: Add Script to package.json (**Recommended**)

```json
// Package.json
{
    "scripts": {
        "module": "coil-react"
    }
}
```

Then in your terminal:

```bash
$ yarn module your/module
or
$ npm run module your/module
```

The reason why this is recommended is because coil-react-cli will look for the `src folder` in your current directory, if we set the script in `package.json`, we can ensure that every time we run `yarn module`, the path it resolves is always correct.

### 2: Run the command in terminal

```bash
$ coil-react your/module
```
