Package.describe({
  name: 'connection-speed',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4.2');

  api.use(['imon-data', 'underscore', 'jquery', 'widget', 'mongo', 'country-info',
      'aldeed:collection2']);
  api.use(['templating', 'd3js:d3'], 'client');

  api.addFiles(['connection_speed.js']);
  api.addFiles([
    'client/info.html',
    'client/settings.html',
    'client/settings.js',
    'client/widget.html',
    'client/widget.js',
    'client/widget.css',
    ], 'client');

  api.export('ConnectionSpeed');
});
