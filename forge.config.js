module.exports = {
  packagerConfig: {
    ignore: [ "cfg", "doc", "experiments" ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: [ 'win32', 'win64' ],
      config: {}
    }
  ],
};
