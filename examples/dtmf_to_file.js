const { ToneStream, utils } = require('../index.js')
const Speaker = require('speaker')
const wav = require('wav')
const au = require('@mayama/audio-utils')

function usage() {
	console.log(`
Required parameters: 'dtmf_sequence' output_file sample_rate bit_depth, channels
                     '1234' digits.1234.8000hz.wav 8000 16 1
                     '1234' digits.1234.16000hz.wav 16000 16 1
                     '1234' digits.1234.32000hz.wav 32000 32 1
`)
}


if(process.argv.length != 7) {
	usage()
	process.exit(1)
}

const dtmfSequence = process.argv[2]
const outputFile = process.argv[3]
const sampleRate = parseInt(process.argv[4])
const bitDepth = parseInt(process.argv[5])
const channels = parseInt(process.argv[6])

const format = {
	sampleRate,
	bitDepth,
	channels,
}

console.log("format:", format)

const tones = utils.gen_dtmf_tones(dtmfSequence, 100, 100, sampleRate)

console.log("tones:", tones)

const fileWriter = new wav.FileWriter(outputFile, format)

const ts = new ToneStream(format)

const speaker = new Speaker(format)

// We need to write some initial silence to the speaker to avoid scratchyness/gaps
const size = 320 * 64 
console.log("writing initial silence to speaker", size)
data = au.gen_silence(format.audioFormat, format.signed, size)
speaker.write(data)

ts.pipe(speaker)
ts.pipe(fileWriter)

var num_samples = ts.concat(tones)
num_samples += ts.add([ sampleRate, 's' ])

var duration = num_samples / sampleRate * 1000

console.log("num_samples", num_samples)
