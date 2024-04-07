const { ToneStream } = require('../index.js')

const Speaker = require('speaker')

const assert = require('assert')

const format = {
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
}

const opts = {
  stay_alive: true,
}

const ts = new ToneStream(format, opts)

const s = new Speaker(format)

ts.add([2000, 261.63]) // C4
ts.add([2000, 296.33]) // D4
ts.add([2000, 329.63]) // E4

var b

/*
Be aware that when you call method 'read(N)' on a stream, you will get N bytes, not N samples.
So if you want to get bytes for 10 samples, you should ask: ts.read(10 * (bitDepth/8) * channels)
*/

b = ts.read(500)
assert(b.length == 500)
s.write(b)

b = ts.read(700)
assert(b.length == 700)
s.write(b)

b = ts.read(160)
assert(b.length == 160)
s.write(b)

b = ts.read(140)
assert(b.length == 140)
s.write(b)

b = ts.read(12000)
assert(b.length == 12000) // this will be filled with silence (zero) after all items are consumed.
s.write(b)

setTimeout(() => {}, 2000)

