const ToneStream = require('../index.js')

const ts = new ToneStream({
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
})

var notes = [
	[1000, 261.63], // C4
	[1000, 296.33], // D4
	[1000, 329.63], // E4
	[1000, 349.23], // F4
	[1000, 392.00], // G4
	[1000, 440.00], // A4
	[1000, 493.88], // B4
	[1000, 523.25], // C5
]

ts.concat(notes)

ts.on('empty', () => {
	console.log("Got event 'empty'. Reversing notes.")
	notes.reverse()
	ts.concat(notes)
})

const Speaker = require('speaker')

const s = new Speaker({
	sampleRate: 8000,
	bitDepth: 16,
	channels: 1,
})

ts.pipe(s)
