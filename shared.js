
const yaml = require('yaml');
const ScreepsAPI = require('screeps-api')
const fs = require('fs').promises
const path = require('path');

let _config;
let _path;
async function getConfig() {
  if (_config) {
    return _config
  }
  const paths = [];
  if (process.env.SCREEPS_CONFIG) {
    paths.push(process.env.SCREEPS_CONFIG);
  }
  const dirs = [__dirname, ''];
  for (const dir of dirs) {
    paths.push(path.join(dir, '.screeps.yaml'));
    paths.push(path.join(dir, '.screeps.yml'));
  }
  if (process.platform === 'win32') {
    paths.push(path.join(process.env.APPDATA, 'screeps/config.yaml'));
    paths.push(path.join(process.env.APPDATA, 'screeps/config.yml'));
  } else {
    if (process.env.XDG_CONFIG_PATH) {
      paths.push(
        path.join(process.env.XDG_CONFIG_HOME, 'screeps/config.yaml')
      );
      paths.push(
        path.join(process.env.XDG_CONFIG_HOME, 'screeps/config.yml')
      );
    }
    if (process.env.HOME) {
      paths.push(path.join(process.env.HOME, '.config/screeps/config.yaml'));
      paths.push(path.join(process.env.HOME, '.config/screeps/config.yml'));
      paths.push(path.join(process.env.HOME, '.screeps.yaml'));
      paths.push(path.join(process.env.HOME, '.screeps.yml'));
    }
  }
  for (const path of paths) {
    const data = await loadConfig(path);
    if (data) {
      if (!data.servers) {
        throw new Error(
          `Invalid config: 'servers' object does not exist in '${path}'`
        )
      }
      _config = data;
      _path = path;
      return data
    }
  }
  return null
}

async function loadConfig(file) {
  try {
    const contents = await fs.readFile(file, 'utf8');
    return yaml.parse(contents)
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false
    } else {
      throw e
    }
  }
}

module.exports = {
  getConfig,
}