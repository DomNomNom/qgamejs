// Copyright (c) 2019 DomNomNom

import {makeInitialState, debugState} from './q.js'

const workspace = Blockly.inject('blocklyDiv', {
  media: '/third_party/google-blockly-4efa0da/media/',
  toolbox: document.getElementById('toolbox')
});


function runJS() {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = 'checkTimeout();\n';
  let timeouts = 0;
  const checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw 'Maximum execution iterations exceeded.';
    }
  };
  const code = Blockly.JavaScript.workspaceToCode(workspace);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  const outputElement = document.getElementById('output');
  outputElement.innerHTML = '';
  const context = {
    makeInitialState,
    debugState,
    outputElement,
  };
  const functionWithContext = Function(...Object.keys(context), code);
  console.group('eval');
  try {
    functionWithContext(...Object.values(context));
  } catch (e) {
    console.error(e);
    outputElement.innerHTML = `
    Program error:\n
    <pre>${e}</pre>
    <div>
      Code:
      <pre>${code}</pre>
    </div>`;
  } finally {
    console.groupEnd();
  }

};

// Hook a save function onto unload.
BlocklyStorage.backupOnUnload(workspace);
BlocklyStorage.restoreBlocks(workspace);

function onchange(event) {
  if (event && new Set(['ui', 'create']).has(event.type)) {
    return;
  }
  console.log(event && event.type || 'no event type')
  runJS();
}
setTimeout(() => { workspace.addChangeListener(onchange); }, 0)
onchange();
