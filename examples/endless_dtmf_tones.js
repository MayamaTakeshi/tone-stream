const { ToneStream } = require('../index.js')
const Speaker = require('speaker')

const format = {
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
}

const ts = new ToneStream(format)

const s = new Speaker(format)

var tones = [
	[1000, 'DTMF:1'],
	[1000, 'DTMF:2'],
	[1000, 'DTMF:3'],
	[1000, 'DTMF:4'],
	[1000, 'DTMF:5'],
	[1000, 'DTMF:6'],
	[1000, 'DTMF:7'],
	[1000, 'DTMF:8'],
	[1000, 'DTMF:9'],
	[1000, 'DTMF:0'],
	[1000, 'DTMF:a'],
	[1000, 'DTMF:b'],
	[1000, 'DTMF:c'],
	[1000, 'DTMF:d'],
	[1000, 'DTMF:*'],
	[1000, 'DTMF:#'],
]

ts.concat(tones)

ts.on('empty', () => {
	console.log("Got event 'empty'. Reversing tones.")
	tones.reverse()
	ts.concat(tones)
})

ts.pipe(s)
