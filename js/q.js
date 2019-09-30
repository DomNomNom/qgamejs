// Copyright (c) 2019 DomNomNom


//
// InitialState
//

export function makeInitialState(num_input_bits, num_working_bits) {
  const input_sidelength = math.pow(2, num_input_bits);
  const working_sidelength = math.pow(2, num_working_bits);
  if (num_input_bits + num_working_bits > 10) throw new Error('too many bits to simulate.');
  const normalizer = 1/math.sqrt(input_sidelength);
  const amplitudes = [];
  const working_bitmask = ((1 << num_working_bits) - 1) << num_input_bits;  // the least significant bits are deemed the working bits.
  for (let i=0; i<math.pow(2, num_input_bits + num_working_bits); ++i) {
    let amplitude = 0;
    if ((i & working_bitmask) === 0) {
      amplitude = normalizer;
    }
    amplitudes.push(amplitude);
  }
  return assertNormalized(amplitudes);
}


//
// Quantum Gates
//

function fastWalshHadamart(amplitudes) {
  // https://en.wikipedia.org/wiki/Fast_Walsh%E2%80%93Hadamard_transform
  const a = [...amplitudes];
  // In-place Fast Walsh-Hadamard Transform of array a
  for (let h=1; h < a.length; h *= 2) {
    for (let i = 0; i < a.length; i += h * 2) {
      for (let j = i; j < i + h; ++j) {
        const x = a[j];
        const y = a[j+h];
        a[j] = x + y;
        a[j+h] = x - y;
      }
    }
  }
  const normalizer = 1/Math.sqrt(a.length);
  return assertNormalized(a.map(x => x * normalizer));
}

export function hadamard(amplitudes, bit) {
  if (bit == 0) {
    return assertNormalized(fastWalshHadamart(amplitudes))
  }
  return assertNormalized(
    swapBits(fastWalshHadamart(swapBits(amplitudes, bit, 0)), bit, 0)
  );
}

export function swapBits(amplitudes, bit1, bit2) {
  assertNormalized(amplitudes);

  if (amplitudes.length == 0) return [];
  const numBits = math.log2(amplitudes.length);
  if (bit1 >= numBits || bit2 >= numBits) {
    throw new Error(`Was asked to switchBits(${bit1}, ${bit2}) but numBits=${numBits}`);
  }
  const bitsToKeepMask = ~((1 << bit1) | (1 << bit2))
  return assertNormalized(amplitudes.map((_, i) => {
    const j = (i & bitsToKeepMask) |
      (((i >>> bit1) & 1) << bit2) |
      (((i >>> bit2) & 1) << bit1);
    return amplitudes[j];
  }));
}

export function controlledNot(amplitudes, controlBit, controlledBit) {
  assertNormalized(amplitudes);
  const numBits = math.log2(amplitudes.length);
  if (controlBit >= numBits || controlledBit >= numBits) {
    throw new Error(`Was asked to do controlledNot(${controlBit}, ${controlledBit}) but numBits=${numBits}`);
  }
  return assertNormalized(amplitudes.map((_, i) => {
    const shouldInvert = i & (1 << controlBit);
    const j = shouldInvert? i ^ (1 << controlledBit) : i;
    return amplitudes[j];
  }));
}

export function not(amplitudes, bit) {
  // flips the specified bit
  const numBits = math.log2(amplitudes.length);
  if (bit >= numBits) {
    throw new Error(`Was asked to flip bit ${bit}, but numBits=${numBits}`);
  }
  return assertNormalized(amplitudes.map((_, i) => {
    const j = i ^ (1 << bit);
    return amplitudes[j];
  }));
}

//
// Utility functions
//

function amplitudeToProbability(amplitude) {
    return math.abs(amplitude) * math.abs(amplitude);
}
function assertNormalized(amplitudes) {
  const totalProbability = math.sum(amplitudes.map(amplitudeToProbability));
  if (math.round(totalProbability, 10) != 1) {
    throw new Error(`probabilities no longer sum to 1 but to ${totalProbability}`);
  }
  return amplitudes
}



//
// Visualization
//


const outcomeFontMap = {
    '0': '𝟬',
    '1': '𝟭',
    '2': '𝟮',
    '3': '𝟯',
    '4': '𝟰',
    '5': '𝟱',
    '6': '𝟲',
    '7': '𝟳',
    '8': '𝟴',
    '9': '𝟵',
};
function toOutcomeFont(str) {
    return [...str].map(c => outcomeFontMap[c] || c).join('');
}
function labelOutcomes(amplitudes) {
    const numBits = math.log2(amplitudes.length);
    return amplitudes.map((_, i) => toOutcomeFont(i.toString(2).padStart(numBits, '0')));
}

const visualizationPallete = [
    // https://learnui.design/tools/data-color-picker.html
    '#003f5c',
    '#58508d',
    '#bc5090',
    '#ff6361',
    '#ffa600',
];
function getColor(i) {
    // returns a non-unique visualization from a pallete;
    return visualizationPallete[i % visualizationPallete.length];
}

export function debugState(amplitudes, outputElement) {
  assertNormalized(amplitudes);

  const labels = labelOutcomes(amplitudes);
  const probabilities = amplitudes.map(amplitudeToProbability);
  const out = d3.select(outputElement);
  visualizeAmplitudes(labels, amplitudes, out.append("svg"));
  visualizeOutcomeDistribution(labels, probabilities, out.append("svg"));
}

function visualizeAmplitudes(labels, amplitudes, svg) {
  const viewBoxWidth = 600;
  const viewBoxHeight = 300;
  svg.attr("viewBox", [0, 0, viewBoxWidth, viewBoxHeight])

  const margin = {top: 20, right: 20, bottom: 50, left: 40};
  const width = viewBoxWidth - margin.left - margin.right;
  const height = viewBoxHeight - margin.top - margin.bottom;

  const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // svg = d3.select("svg"),
  //     margin = {top: 20, right: 20, bottom: 30, left: 40},
  //     width = +svg.attr("width") - margin.left - margin.right,
  //     height = +svg.attr("height") - margin.top - margin.bottom;

  // const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  // const y = d3.scaleLinear().rangeRound([height, 0]);

  // const g = svg.append("g")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // svg = d3.select("body").append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //     .attr("transform",
  //           "translate(" + margin.left + "," + margin.top + ")");

  const data = amplitudes.map((amplitude,i) => ({
    amplitude,
    polar_r: math.abs(amplitude),
    polar_phi: math.arg(amplitude),
    i,
    label: labels[i],
  }));
  x.domain(data.map(d => d.label));
  y.domain([0, d3.max(data, d => d.polar_r) ]);

  const scaleX = 6.5/math.log2(amplitudes.length+1);
  const scaleY = Math.min(5, 45/amplitudes.length);
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.25em")
        .attr("dy", "-.5em")
        .attr("transform", ` rotate(-60) scale(${scaleX} ${scaleY}) `)// translate(0 0) scale(${2*scale}, ${3*scale}) `);
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.label) )
      .attr("y", d => y(d.polar_r) )
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.polar_r))
}

function visualizeOutcomeDistribution(labels, probabilities, svg) {
  const width = 500;
  const height = 300;
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const data = {
      name: '',
      children: probabilities
              .map((prob, i) => ({value: prob, name: labels[i]}))
              .filter(({value, name}) => value > 0)
  };

  const treemap = data => d3.treemap()
      .tile(d3.treemapBinary)
      .size([width, height])
      .padding(1)
      .round(true)
    (d3.hierarchy(data)
      .count()
      .sort((a, b) => b.value - a.value))

  function drawTreemap() {
    const root = treemap(data);

    svg
        .attr("viewBox", [0, 0, width, height])
        .style("font", "10px sans-serif");

    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    leaf.append("title")
        .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}`);

    leaf.append("rect")
        .attr("id", d => (d.leafUid = "leaf").id)
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    leaf.append("clipPath")
        .attr("id", d => (d.clipUid = "clip").id)
      .append("use")
        .attr("xlink:href", d => d.leafUid.href);

    leaf.append("text")
      .text(d => d.data.name)
      .style("font-size", function(d) {
        return Math.min((d.x1 - d.x0), ((d.x1 - d.x0) * .9) / this.getComputedTextLength() * 10) + "px";
      })
      .attr("x", d => (d.x1 - d.x0)/2)
      .attr("y", d => (d.y1 - d.y0)/2)
      .attr("dy", d => '0.35em')
      .style("text-anchor", "middle")

    return svg.node();
  };
  drawTreemap()

}
