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
  console.group('eval');
  try {
    eval(code);
  } catch (e) {
    console.error(e);
    document.getElementById('output').textContent = `Program error:\n${e}\n\nCode:\n${code}`;
  } finally {
    console.groupEnd();
  }

  // // put the code into the DOM where it'll execute. ()
  // const container = document.getElementById('code-container');
  // container.innerHTML = '';
  // const s = document.createElement('script');
  // s.type = 'module';
  // try {
  //   s.appendChild(document.createTextNode(code));
  //   document.body.appendChild(s);
  // } catch (e) {
  //   s.text = code;
  //   document.body.appendChild(s);
  // }
};

// Hook a save function onto unload.
BlocklyStorage.backupOnUnload(workspace);
BlocklyStorage.restoreBlocks(workspace);

function onchange(event) {
  document.getElementById('capacity').textContent = workspace.remainingCapacity();
  runJS();
}
setTimeout(() => { workspace.addChangeListener(onchange); }, 0)
onchange();
