const { Readable } = require('stream')

const SpecReadStream = require('spec-read-stream')

const DTMF = require('./lib/dtmf')

class ToneStream extends Readable {
	constructor(opts) {
		super()

		if(opts) {
			this.sampleRate = opts.sampleRate
			this.bitDepth = opts.bitDepth
			this.channels = opts.channels
			this.amplitude = (2**opts.bitDepth)/2 - 1

		} else {
			
		}
	
		this.specReadStream = new SpecReadStream()
		this.currentSample = 0
	}

	add(spec) {
		this.specReadStream.add(spec)
	}

	concat(specs) {
		specs.forEach(spec => {
			this.specReadStream.add(spec)
		})
	}

	on(evt, cb) {
		super.on(evt, cb)

		if(evt == 'empty') {
			this.specReadStream.on(evt, cb)
		}
	}

	_read(n) {
		//console.log(`_read(${n})`)

		let sampleSize = this.bitDepth / 8
		let blockAlign = sampleSize * this.channels

		let numSamples = Math.floor(n / blockAlign)

		let end = this.currentSample + numSamples

		var specs = this.specReadStream.read(numSamples)
		//console.log(`specs=${specs}`)

		if(!specs) return null;

		let actualSamples = specs.reduce((total, spec) => { return total + spec[0] }, 0)
		//console.log(`actualSamples=${actualSamples}`)

		let buf = Buffer.alloc(actualSamples * blockAlign)

		var buf_idx = 0;

		for(var i=0 ; i<specs.length ; i++) {
			var spec = specs[i]
			//console.log(`spec=${spec}`)

			var nSamples = spec[0]
			var spec_val = spec[1]

			var val_calculator = (() => {
				if(spec_val == 's') {
					// silence
					return () => { return 0 }
				} else if(typeof spec_val == 'number') {
					var freq = spec_val
					let t = (Math.PI * 2 * freq) / this.sampleRate

					return (amplitude, currentSample) => {
						return Math.round(amplitude * Math.sin(t * currentSample)) // sine wave
					}
				} else if(typeof spec_val == 'string' && spec_val.startsWith("DTMF:")) {
					var tone = DTMF[spec_val.split(":")[1]]
					var lo = tone[0]
					var hi = tone[1]

					let t_lo = (Math.PI * 2 * lo) / this.sampleRate
					let t_hi = (Math.PI * 2 * hi) / this.sampleRate

					return (amplitude, currentSample) => {
						return (
							Math.round(amplitude * Math.sin(t_lo * currentSample)) +
							Math.round(amplitude * Math.sin(t_hi * currentSample))
						) / 2
					}
				} else {
					throw `invalid spec ${spec}`
				}
			})()

			for(var j=0 ; j<nSamples ; j++) {
				for (let channel = 0; channel < this.channels; channel++) {
					let val = val_calculator(this.amplitude, this.currentSample)
					//console.log(this.currentSample, val)
					let offset = (buf_idx * sampleSize * this.channels) + (channel * sampleSize)
					buf['writeInt' + this.bitDepth + 'LE'](val, offset)
					buf_idx++
					this.currentSample++
				}
			}
		}

		this.push(buf)

		return buf
	}
}

module.exports = ToneStream
