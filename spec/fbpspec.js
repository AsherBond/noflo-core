/* eslint-disable
    import/no-unresolved,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
const fbpspec = require('fbp-spec');

const nodeRuntime = {
  label: 'NoFlo node.js',
  description: '',
  type: 'noflo',
  protocol: 'websocket',
  secret: 'notasecret',
  address: 'ws://localhost:3333',
  id: '7807f4d8-63e0-4a89-a577-2770c14f8106',
  command: './node_modules/.bin/noflo-nodejs --verbose --debug  --catch-exceptions=false --secret notasecret --port=3333 --host=localhost',
};

fbpspec.mocha.run(nodeRuntime, './spec', { fixturetimeout: 20000 });
