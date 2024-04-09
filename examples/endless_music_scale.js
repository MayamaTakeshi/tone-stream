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

const notes = "C4 D4 E4 F4 G4 A4 B4 C5"
const note_duration = 100 // milliseconds
const rest_duration = 0 // milliseconds

const tones = utils.gen_music_scale(notes, note_duration, rest_duration, SAMPLE_RATE)

ts.concat(tones)

ts.on('empty', () => {
	console.log("Got event 'empty'. Reversing notes.")
	tones.reverse()
	ts.concat(tones)
})

ts.pipe(s)
