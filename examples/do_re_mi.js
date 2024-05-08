const { ToneStream } = require('../index.js')
const Speaker = require('speaker')

const sampleRate = 8000

const format = {
	sampleRate,
	bitDepth: 16,
	channels: 1
}

const ts = new ToneStream(format)

const s = new Speaker(format)

var num_samples = 0

num_samples += ts.add([2000, 261.63]) // C4
num_samples += ts.add([1000, 's'])    // silence
num_samples += ts.add([2000, 296.33]) // D4
num_samples += ts.add([1000, 's'])    // silence
num_samples += ts.add([2000, 329.63]) // E4
num_samples += ts.add([1000, 's'])    // silence

var duration = num_samples / sampleRate * 1000

ts.pipe(s)
