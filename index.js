const spawn = require('child_process').spawn

const scanner = spawn("node", ["scanner.js"], { stdio: 'inherit'})
scanner.on("exit", () => {
  spawn("node", ["refine.js"], { stdio: 'inherit'})
  spawn("node", ["novice.js"], { stdio: 'inherit'})
})