const { ToneStream } = require('../index.js')
const DtmfDetectionStream = require('dtmf-detection-stream')
const Speaker = require('speaker')

sampleRate = 8000

const format = {
  sampleRate,
  bitDepth: 16,
  channels: 1,
}

var num_samples = 0

const ts = new ToneStream(format)
num_samples += ts.add([800, 's']) // silence
num_samples += ts.add([800, 'DTMF:1'])
num_samples += ts.add([800, 's']) // silence
num_samples += ts.add([800, 'DTMF:2'])
num_samples += ts.add([800, 's']) // silence
num_samples += ts.add([800, 'DTMF:3'])
num_samples += ts.add([800, 's']) // silence

var duration = num_samples / sampleRate * 1000

const opts = {
  format
}

const dds = new DtmfDetectionStream(opts)

dds.on('dtmf', data => {
  console.log('Got', data)
})

ts.on('data', data => {
  //console.log('data', data)
  dds.write(data)
})

const s = new Speaker(format)
ts.pipe(s)

