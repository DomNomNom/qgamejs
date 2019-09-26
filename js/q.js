export function makeInitialState(num_input_bits, num_working_bits) {
    const input_sidelength = math.pow(2, num_input_bits);
    const working_sidelength = math.pow(2, num_working_bits);
    if (num_input_bits + num_working_bits > 10) throw 'too many bits to simulate.'
    const normalizer = 1/math.sqrt(input_sidelength);
    const state = [];
    const working_bitmask = (1 << num_working_bits) - 1;  // the least significant bits are deemed the working bits.
    for (let i=0; i<math.pow(2, num_input_bits + num_working_bits); ++i) {
        let amplitude = 0;
        if ((i & working_bitmask) === 0) {
            amplitude = normalizer;
        }
        state.push(amplitude);
    }
    return state
}


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

function amplitudeToProbability(amplitude) {
    return math.abs(amplitude) * math.abs(amplitude);
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
    const labels = labelOutcomes(amplitudes);
    const probabilities = amplitudes.map(amplitudeToProbability);
    // const table = `
    // <table>
    //     <tr>
    //         <td>outcome</td>
    //         ${labels.map(label => `<td>${label}</td>`).join(' ')}
    //     </tr>
    //     <tr>
    //         <td>amplitudes</td>
    //         ${amplitudes.map(amp => `<td>${amp.toFixed(3)}</td>`).join(' ')}
    //     </tr>
    //     <tr>
    //         <td>probabilities</td>
    //         ${probabilities.map(prob => `<td>${prob.toFixed(3)}</td>`).join(' ')}
    //     </tr>
    // </table>
    // `;

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

function chart() {
  const root = treemap(data);

  const svg = d3.select(outputElement).append("svg")
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
    .style("font-size", function(d) { return Math.min((d.x1 - d.x0), ((d.x1 - d.x0) * .9) / this.getComputedTextLength() * 10) + "px"; })
    .attr("x", d => (d.x1 - d.x0)/2)
    .attr("y", d => (d.y1 - d.y0)/2)
    .attr("dy", d => '0.35em')
    .style("text-anchor", "middle")

  return svg.node();
};
chart()

}
