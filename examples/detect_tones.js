const { ToneStream } = require('../index.js')
const DtmfDetectionStream = require('dtmf-detection-stream')

const format = {
        sampleRate: 8000,
        bitDepth: 16,
        channels: 1,
}

const ts = new ToneStream(format)
ts.add([800, 's']) // silence
ts.add([800, 'DTMF:1'])
ts.add([800, 's']) // silence
ts.add([800, 'DTMF:2'])
ts.add([800, 's']) // silence
ts.add([800, 'DTMF:3'])
ts.add([800, 's']) // silence

const dds = new DtmfDetectionStream(format)

dds.on('dtmf', data => {
        console.log('Got', data)
})

ts.on('data', data => {
        dds.write(data)
})

