const { Readable } = require('stream')

const SpecReadStream = require('spec-read-stream')

const DTMF = require('./lib/dtmf')

class ToneStream extends Readable {
	constructor(format, filler) {
		super()

		if(format) {
			this.sampleRate = format.sampleRate
			this.bitDepth = format.bitDepth
			this.channels = format.channels
		} else {
			// default
			this.sampleRate = 8000
			this.bitDepth = 16
			this.channels = 1
		}

		this.filler = filler

		this.amplitude = (2**this.bitDepth)/2 - 1
	
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

		let buf = Buffer.alloc(numSamples * blockAlign)

		let setter = (buf['writeInt' + this.bitDepth + 'LE']).bind(buf)

		var specs = this.specReadStream.read(numSamples)
		//console.log(`specs=${specs}`)

		var buf_idx = 0;

		if(!specs) {
			//console.log(`no specs filler=${this.filler}`)
			if(typeof this.filler == 'number') {
				for(var j=0 ; j<numSamples * this.channels; j++) {
					let offset = (j * sampleSize * this.channels)
					setter(this.filler, offset)
				}
				return buf
			} else {
				return null
			}
		}

		let actualSamples = specs.reduce((total, spec) => { return total + spec[0] }, 0)
		//console.log(`actualSamples=${actualSamples}`)

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
					let val = val_calculator(this.amplitude, this.currentSample) / 2 // halve amplitude
					let offset = (buf_idx * sampleSize * this.channels) + (channel * sampleSize)
					setter(val, offset)
					buf_idx++
					this.currentSample++
				}
			}
		}

		if(typeof this.filler == 'number') {
			while(numSamples > actualSamples) {
				//console.log("adding filler")
				for (let channel = 0; channel < this.channels; channel++) {
					let offset = (actualSamples-1) * sampleSize * this.channels
					setter(this.filler, offset)
					this.currentSample++
					actualSamples++
				}
			}
		}

		if(numSamples > actualSamples) {
			//console.log(`slicing buf from ${numSamples} to ${actualSamples}`)
			//console.log(`${actualSamples * sampleSize * this.channels}`)
			buf = buf.slice(0, actualSamples * sampleSize * this.channels)
		}

		//console.log("pushing")
		//console.log(buf.length)
		this.push(buf)
	}
}

module.exports = {
    ToneStream,
    utils: require('./lib/utils.js'),
}
