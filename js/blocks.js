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
  var code = `let state = makeInitialState(${number_num_input_bits}, ${number_num_working_bits});\n`;
  return code;
};

Blockly.Blocks['swap_bits'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Swap bits by index");
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0, 0), "bit1");
    this.appendDummyInput()
        .appendField("⇔")
        .appendField(new Blockly.FieldNumber(1, 0), "bit2");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
Blockly.JavaScript['swap_bits'] = function(block) {
  var number_bit1 = block.getFieldValue('bit1');
  var number_bit2 = block.getFieldValue('bit2');
  var code = `state = swapBits(state, ${number_bit1}, ${number_bit2})\n`;
  return code;
};

Blockly.Blocks['not'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Flip bit ")
        .appendField(new Blockly.FieldNumber(0, 0), "bit");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("This is called the NOT gate");
    this.setHelpUrl("");
  }
};
Blockly.JavaScript['not'] = function(block) {
  var number_bit = block.getFieldValue('bit');
  var code = `state = not(state, ${number_bit})\n`;
  return code;
};

Blockly.Blocks['controlled_not'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("If bit ");
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0, 0), "controlBit");
    this.appendDummyInput()
        .appendField("is set, flip bit ")
        .appendField(new Blockly.FieldNumber(1, 0), "controlledBit");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("This is called the controlled-NOT gate");
    this.setHelpUrl("");
  }
};
Blockly.JavaScript['controlled_not'] = function(block) {
  var number_controlBit = block.getFieldValue('controlBit');
  var number_controlledBit = block.getFieldValue('controlledBit');
  var code = `state = controlledNot(state, ${number_controlBit}, ${number_controlledBit})\n`;
  return code;
};

Blockly.Blocks['hadamard'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Hadamard bit ");
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0, 0), "bit");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
Blockly.JavaScript['hadamard'] = function(block) {
  var number_bit = block.getFieldValue('bit');
  var code = `state = hadamard(state, ${number_bit})\n`;
  return code;
};

Blockly.Blocks['phase_shift'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("If bit")
        .appendField(new Blockly.FieldNumber(0, 0), "bit")
        .appendField("is set, shift the phase by ")
        .appendField(new Blockly.FieldAngle(45), "angle");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.JavaScript['phase_shift'] = function(block) {
  var number_bit = block.getFieldValue('bit');
  var angle_name = block.getFieldValue('angle');
  var code = `state = phaseShift(state, ${number_bit}, ${angle_name});\n`;
  return code;
};

Blockly.Blocks['debug_state'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Visualize state");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
Blockly.JavaScript['debug_state'] = function(block) {
  var code = 'debugState(state, outputElement);\n';
  return code;
};
