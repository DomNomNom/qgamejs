// Copyright (c) 2019 DomNomNom


Blockly.Blocks['quantum_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("num_input_bits")
        .appendField(new Blockly.FieldNumber(1), "num_input_bits");
    this.appendDummyInput()
        .appendField("num_working_bits")
        .appendField(new Blockly.FieldNumber(1), "num_working_bits");
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['quantum_start'] = function(block) {
  var number_num_input_bits = block.getFieldValue('num_input_bits');
  var number_num_working_bits = block.getFieldValue('num_working_bits');
  // TODO: Assemble JavaScript into code variable.
  var code = `let state = makeInitialState(${number_num_input_bits}, ${number_num_working_bits});\n`;
  return code;
};


Blockly.Blocks['debug_state'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("debug_state");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['debug_state'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'debugState(state, outputElement);\n';
  return code;
};
