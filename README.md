# tone-stream

A simple node.js tone stream library.

You can specify frequencies to be played by adding item in the format:
```
  [NUMBER_OF_SAMPLES, FREQUENCY]
```
or DTMF tones:
```
  [NUMBER_OF_SAMPLES, 'DTMF:ID']
```


Playing some musical notes:

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

Playing some DTMF tones:

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

ts.add([1000, 'DTMF:1'])
ts.add([500, 's'])
ts.add([1000, 'DTMF:2'])
ts.add([500, 's'])
ts.add([1000, 'DTMF:3'])

ts.pipe(s)

setTimeout(() => {}, 2000)
```

