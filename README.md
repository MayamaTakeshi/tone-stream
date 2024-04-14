# tone-stream

## Overview

A simple node.js tone stream library.

You can specify frequencies to be played by adding items in the format:
```
  [NUMBER_OF_SAMPLES, FREQUENCY]
```
or DTMF tones:
```
  [NUMBER_OF_SAMPLES, 'DTMF:ID']
```
You can add multiple of such tones and they will be enequeued and played in order.

## Installation
```
npm i tone-stream
```

## Sample usage

Playing some musical notes:

```
const { ToneStream } = require('tone-stream')

const Speaker = require('speaker')

const sampleRate = 8000

const format = {
  sampleRate,
  bitDepth: 16,
  channels: 1
}

const ts = new ToneStream(format)

const s = new Speaker(format)

var ns = 0
ns += ts.add([1000, 261.63]) // C4
ns += ts.add([1000, 296.33]) // D4
ns += ts.add([1000, 329.63]) // E4

var duration = ns / sampleRate * 1000

ts.pipe(s)

setTimeout(() => {
  console.log("done")
  process.exit(0)
}, duration)

```

Playing some DTMF tones:

```
const { ToneStream } = require('tone-stream')

const Speaker = require('speaker')

const sampleRate = 8000

const format = {
  sampleRate,
  bitDepth: 16,
  channels: 1
}

const ts = new ToneStream(format)

const s = new Speaker(format)

var ns = 0

ns += ts.add([1000, 'DTMF:1'])
ns += ts.add([500, 's'])
ns += ts.add([1000, 'DTMF:2'])
ns += ts.add([500, 's'])
ns += ts.add([1000, 'DTMF:3'])
ns += ts.add([500, 's'])

var duration = ns / sampleRate * 1000

ts.pipe(s)

setTimeout(() => {
  console.log("done")
  process.exit(0)
}, duration)

```

Using some helper function to add miscelaneous tones
```
const { ToneStream, utils } = require('tone-stream')

const Speaker = require('speaker')

const _ = require('lodash')

const SAMPLE_RATE = 8000

const format = {
        sampleRate: SAMPLE_RATE,
        bitDepth: 16,
        channels: 1
}

const ts = new ToneStream(format)

const s = new Speaker(format)

const tones = _.flatten([
    utils.gen_dtmf_tones("1234567890abcdef", 100, 0, SAMPLE_RATE),
    utils.gen_morse_tones("Be yourself; everyone else is already taken", 880, 70, SAMPLE_RATE),
    utils.gen_music_scale("C5 D5 E5 F5 G5 A5 B5 C6", 100, 0, SAMPLE_RATE),
])

console.log("Inspecting tones:")
tones.forEach(tone => {
    console.log(tone)
})

ts.concat(tones)

ts.on('empty', () => {
    console.log("Got event 'empty'. Reversing tones and playing again.")
    tones.reverse()
    ts.concat(tones)
})

console.log("Starting playing tones")
ts.pipe(s)

```
## Events

The stream emits events:
  - 'empty': when there are no more tones to be played in the queue (it happens when the queue of tones is found empty)
  - 'ended': when all tones in the queue were generated (it happens when the consumer tries to read data from the stream and there are no more tones to be generated)

## More examples

See [here](https://github.com/MayamaTakeshi/tone-stream/tree/master/examples).
