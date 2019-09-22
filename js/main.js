// Copyright (c) 2019 DomNomNom

import {foo} from './q.js';

const workspace = Blockly.inject('blocklyDiv', {
  media: '/third_party/google-blockly-4efa0da/media/',
  maxBlocks: 5,
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
  try {
    // eval(code);
  } catch (e) {
    alert(`Program error:\n${e}`);
  }
  return code;
};


function onchange(event) {
  document.getElementById('capacity').textContent =
      workspace.remainingCapacity();

  document.getElementById('output').textContent = runJS();;
}
workspace.addChangeListener(onchange);
onchange();


// Hook a save function onto unload.
BlocklyStorage.backupOnUnload(workspace);
BlocklyStorage.restoreBlocks(workspace);
