# tone-stream

A simple node.js tone stream library.

You can specify tones to be played by adding item in the format:

  [NUMBER_OF_SAMPLES, FREQUENCY]


```
const ToneStream = require('tone-stream')

const Speaker = require('speaker')

const format = {
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
}

const ts = new ToneStream(format)

const s = new Speaker(format)

ts.add([4000, 261.63]) // C4
ts.add([4000, 296.33]) // D4
ts.add([4000, 329.63]) // E4

ts.pipe(s)

setTimeout(() => {}, 2000)
```
