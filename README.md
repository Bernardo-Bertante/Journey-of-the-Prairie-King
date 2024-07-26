# Phaser 3 Webpack Project Template with custom Phaser Build

A Phaser 3 project template with ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/)
that includes hot-reloading for development and production-ready builds.

Loading images via JavaScript module `import` is also supported, or are copied from the `assets` folder.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command         | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `npm install`   | Install project dependencies                                                    |
| `npm start`     | Build project and open web server running project                               |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## How to initialize the project

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development
server by running `npm start`.

After starting the development server with `npm start`, you can edit the `src/index.js` files
and webpack will automatically recompile and reload your server (available at `http://localhost:8080` by default).

### Babel

You can write modern ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you
want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently
targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

```
"browsers": [
  ">0.25%",
  "not ie 11",
  "not op_mini all"
]
```

### Webpack

If you want to customize your build, such as adding a new webpack loader or plugin (i.e. for loading CSS or fonts), you can
modify the `webpack/base.js` file for cross-project changes, or you can modify and / or create
new configuration files and target them in specific npm tasks inside of `package.json'.

### The GAME

This game is inspired by an existing game named The Journey Of The Prairie King, which is a game within another famous game, Stardew Valley! Essentially, you play as a cowboy in a forest landscape fighting against farmer zombies. These zombies come from the four main cardinal directions in groups, chasing you. When they collide with the player, the player dies but respawns blinking and is immune for a few seconds.

As the player, you can shoot in any direction to kill the zombies—one hit, one kill! You can also walk anywhere to run from them. After destroying 3 side waves, you progress to the next level. Each new level is the same but with a different scenario. The last level consists of a boss fight against Dracula (Draco). He shoots at you continuously and doesn't die from one shot, but you can cover yourself to avoid his shots. Finally, when you kill the boss, the final scene starts with you kissing the lady you saved!
