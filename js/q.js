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
    '0': '𝟘',
    '1': '𝟙',
    '2': '𝟚',
    '3': '𝟛',
    '4': '𝟜',
    '5': '𝟝',
    '6': '𝟞',
    '7': '𝟟',
    '8': '𝟠',
    '9': '𝟡',
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
    const table = `
    <table>
        <tr>
            <td>outcome</td>
            ${labels.map(label => `<td>${label}</td>`).join(' ')}
        </tr>
        <tr>
            <td>amplitudes</td>
            ${amplitudes.map(amp => `<td>${amp.toFixed(3)}</td>`).join(' ')}
        </tr>
        <tr>
            <td>probabilities</td>
            ${probabilities.map(prob => `<td>${prob.toFixed(3)}</td>`).join(' ')}
        </tr>
    </table>
    `;

    const distribution = `
    <div style="width:100%">
        <div>Outcome probability distribution:</div>
        ${probabilities
            .map((prob, i) => ({prob, label: labels[i]}))
            .filter(({prob, label}) => prob > 0)
            .map(({prob, label}, i) => `
                <span style="width:${prob*100}%; background-color: ${getColor(i)}; display: inline-block; margin: 0; text-align: center;">
                    ${label}
                </span>
                `.trim())
            .join('')
        }
    </div>
    `;

    outputElement.innerHTML += table + distribution;
}
