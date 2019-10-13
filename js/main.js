// Copyright (c) 2019 DomNomNom

import {
  makeInitialState,
  hadamard,
  swapBits,
  not,
  controlledNot,
  phaseShift,
  debugState,
} from './q.js'

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
  if (!code.trim().startsWith("let state =")) {
    console.log("Ignoring invalid code, most likely caused by a temporary dragging of blocks")
    return;
  }
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  const outputElement = document.getElementById('output');
  outputElement.innerHTML = '';
  const context = {
    makeInitialState,
    hadamard,
    swapBits,
    not,
    controlledNot,
    phaseShift,
    debugState,
    outputElement,
  };
  const functionWithContext = Function(...Object.keys(context), code);
  console.group('eval');
  try {
    functionWithContext(...Object.values(context));
  } catch (e) {
    outputElement.innerHTML = `
    Program error:\n
    <pre>${e}</pre>
    <div>
      Code:
      <pre>${code}</pre>
    </div>`;
    throw e;
  } finally {
    console.groupEnd();
  }

};

// Hook a save function onto unload.
BlocklyStorage.backupOnUnload(workspace);

const defaultBlocks = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="quantum_start" id="rCNbrP=Hbfq81DD,U`SF" x="46" y="26"><field name="num_input_bits">2</field><field name="num_working_bits">0</field></block><block type="phase_shift" id="n?)%mK?PWfxw2j1P*WZ`" x="49" y="163"><field name="bit">0</field><field name="angle">45</field><next><block type="hadamard" id="*~*z_jt*]f5H?fE]Gn!{"><field name="bit">0</field><next><block type="phase_shift" id=")S%f`NI~pMFhlr2!(Kf,"><field name="bit">1</field><field name="angle">0</field><next><block type="hadamard" id="irC[2tRfCOU_gRk/IaGE"><field name="bit">1</field></block></next></block></next></block></next></block><block type="debug_state" id="95VJO^7!M:YKl{PJm66F" x="65" y="420"/></xml>';
function restoreBlocks(workspace) {
  const url = window.location.href.split('#')[0];
  let blocks = defaultBlocks;
  if ('localStorage' in window && window.localStorage[url]) {
    blocks = window.localStorage[url];
    // console.log(window.localStorage[url]);
  }
  const xml = Blockly.Xml.textToDom(blocks);
  Blockly.Xml.domToWorkspace(xml, workspace);
}
restoreBlocks(workspace);

function onchange(event) {
  if (event && new Set(['ui', 'create']).has(event.type)) {
    return;
  }
  // console.log(event && event.type || 'no event type')
  runJS();
}
setTimeout(() => { workspace.addChangeListener(onchange); }, 0)
onchange();
