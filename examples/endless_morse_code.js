const { ToneStream, utils } = require('../index.js')
const Speaker = require('speaker')

const SAMPLE_RATE = 8000

const format = {
	sampleRate: SAMPLE_RATE,
	bitDepth: 16,
	channels: 1
}

const ts = new ToneStream(format)

const s = new Speaker(format)

var tones = utils.gen_morse_tones("What we've got here is failure to communicate", "C6", 70, SAMPLE_RATE)
tones.push([8000, 's'])

ts.concat(tones)

ts.on('empty', () => {
	console.log("Got event 'empty'. Reversing tones.")
	tones.reverse()
	ts.concat(tones)
})

ts.pipe(s)
