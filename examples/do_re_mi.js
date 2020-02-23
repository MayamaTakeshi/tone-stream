const ToneStream = require('../index.js')

const ts = new ToneStream({
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
})

const Speaker = require('speaker')

const s = new Speaker({
	sampleRate: 8000,
	bitDepth: 16,
	channels: 1,
})

ts.add([4000, 261.63]) // C4
ts.add([2000, 's'])    // silence
ts.add([4000, 296.33]) // D4
ts.add([2000, 's'])    // silence
ts.add([4000, 329.63]) // E4

ts.pipe(s)

setTimeout(() => {}, 2000)
