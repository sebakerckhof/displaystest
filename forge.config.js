module.exports = {
  'make_targets': {
    'win32': [
      'squirrel'
    ],
    'darwin': [
      'zip'
    ],
    'linux': [
      'deb'
    ]
  },
  'electronPackagerConfig': {
    'asar': true,
    'app-copyright': 'Barco NV',
    'prune': true,
    'ignore': [
      '^/toolbox',
      '^/resources',
      '^/images',
      '^/\\.vscode',
      '^/readme.md',
      '^/yarn.lock',
      '^/forge.config.js'
    ]
  },
  'electronWinstallerConfig': {
    'iconUrl': 'resources/icon.ico',
    'noMsi': true
  },
  'electronInstallerDMGConfig': {
    'icon': 'resources/icon.incs'
  },
  'electronInstallerDebian': {
    'dest': 'dist/installers/',
    'icon': 'resources/icon.png',
    'categories': [
      'Utility'
    ],
    'lintianOverrides': [
      'changelog-file-missing-in-native-package'
    ]
  }
}
