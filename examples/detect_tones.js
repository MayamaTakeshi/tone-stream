const ToneStream = require('../index.js')
const goertzel = require('goertzel-stream')

const {PassThrough} = require('stream')

const sampleRate = 8000

const format = {
	sampleRate: sampleRate,
	bitDepth: 16,
	channels: 1,
}

const ts = new ToneStream(format)

var notes = [
	//[2000, 'DTMF:#'],
	[2000, 697],
	[1000, 's'],
	/*
	[2000, 770],
	[1000, 's'],
	[2000, 852],
	[1000, 's'],
	*/
]

ts.concat(notes)

var detector = goertzel([697, 770, 852, 941, 1209, 1336, 1477, 1633], {
	sampleRate: sampleRate,
})

// adding PassThrough stream to check data in the pipe
const pt = new PassThrough()

pt.on('data', data => {
	console.log(data.length, data)
})

ts.pipe(pt)
pt.pipe(detector)

detector.on('toneStart', function (tones) {
  console.log('start', tones)
})

detector.on('toneEnd', function (tones) {
  console.log('end', tones)
})

