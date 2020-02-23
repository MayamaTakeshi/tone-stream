const ToneStream = require('../index.js')
const Speaker = require('speaker')

const format = {
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
}

const ts = new ToneStream(format)

const s = new Speaker(format)

ts.add([2000, 261.63]) // C4
ts.add([1000, 's'])    // silence
ts.add([2000, 296.33]) // D4
ts.add([1000, 's'])    // silence
ts.add([2000, 329.63]) // E4

ts.pipe(s)

setTimeout(() => {}, 2000)
