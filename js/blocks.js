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
  var code = ';\n';
  return code;
};


Blockly.Blocks['debug_distribution'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("debug_distribution");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['debug_distribution'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = ';\n';
  return code;
};
