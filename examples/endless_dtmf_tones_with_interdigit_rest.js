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

var tones = utils.gen_dtmf_tones("1234576890abcd*#", 50, 50, SAMPLE_RATE)

ts.concat(tones)

ts.on('empty', () => {
	console.log("Got event 'empty'. Reversing tones.")
	tones.reverse()
	ts.concat(tones)
})

ts.pipe(s)
