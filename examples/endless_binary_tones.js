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

const tone_duration = 10
const zero = 500
const one = 2000

var tones = utils.gen_binary_tones_from_text("How soon is now?", tone_duration, zero, one, SAMPLE_RATE)
tones.push([50, 's'])

ts.concat(tones)

ts.on('empty', () => {
	console.log("Got event 'empty'. Reversing tones.")
	tones.reverse()
	ts.concat(tones)
})

ts.pipe(s)
