const morse = require('morse-node').create("ITU")

const noteToFrequency = require('note-to-frequency')

const tone2freq = tone => {
    if(typeof tone === 'number') {
        return tone
    }
    return noteToFrequency(tone)
}

const asciiToBinary = char => {
    // Get the ASCII value of the character
    const asciiValue = char.charCodeAt(0)

    // Convert the ASCII value to a binary string and pad with leading zeros to ensure it's 8 bits
    const binaryString = asciiValue.toString(2).padStart(8, '0')

    // Return the binary string
    return binaryString
}

const wpm2rate = (wpm, sampleRate) => {
    // WPM = 2.4 * (Dots per second)
    // Ref: http://www.nu-ware.com/NuCode%20Help/index.html?morse_code_structure_and_timing_.htm
    var dots_per_second = wpm / 2.4
    return sampleRate / dots_per_second
}

const gen_morse_tones = (text, freq_tone, wpm, sampleRate) => {
    if(!morse.isValid(text, 'chars')) {
        throw `parse-failure: invalid chars`
    }

    var signals = morse.encode(text)

    signals = signals.replace(/ \/ /g, "/")

    var dot_duration = Math.round(wpm2rate(wpm, sampleRate)) // converts from WPM to number of samples
    var dash_duration = dot_duration * 3
    var word_space_duration = dot_duration * 7

    var tone = tone2freq(freq_tone)

    var last_was_dot_or_dash = false

    var tones = []

    for(var i=0 ; i<signals.length ; i++) {
        var signal = signals[i]
        if(last_was_dot_or_dash && (signal == '.'|| signal == '-')) {
            tones.push([dot_duration, 's']) // silence
        }
        switch(signal) {
        case '.':
            tones.push([dot_duration, tone])
            last_was_dot_or_dash = true
            break
        case '-':
            tones.push([dash_duration, tone])
            last_was_dot_or_dash = true
            break
        case ' ':
            tones.push([dash_duration, 's']) // silence
            last_was_dot_or_dash = false
            break
        case '/':
            tones.push([word_space_duration, 's']) // silence
            last_was_dot_or_dash = false
            break
        }
    }

    return tones
}

const gen_dtmf_tones = (digits, digit_duration, interdigit_duration, sampleRate) => {
    if(!digits.match(/^[0123456789abcdefABCDEF\*#]+/)) {
        throw `parse-failure: invalid DTMF digits`
    }

    var samples_per_digit = Math.round(digit_duration * sampleRate / 1000)
    var samples_per_rest = Math.round(interdigit_duration * sampleRate / 1000)
    
    var tones = []

    for (var i=0 ; i<digits.length; i++) {
        if(i > 0) {
            tones.push([samples_per_rest, 's'])
        }
        tones.push([samples_per_digit, 'DTMF:' + digits.charAt(i)])
    }

    return tones
}

const gen_music_scale = (notes, note_duration, rest_duration, sampleRate) => {
    var tones = []

    var samples_per_note = Math.round(note_duration * sampleRate / 1000)
    var samples_per_rest = Math.round(rest_duration * sampleRate / 1000)

    var notes = notes.split(" ")

    for (var i=0 ; i<notes.length; i++) {
        var note = notes[i]
        if(i > 0) {
            tones.push([samples_per_rest, 's'])
        }
        var freq = noteToFrequency(note)
        tones.push([samples_per_note, freq])
    }

    return tones
}

const gen_binary_tones_from_text = (text, tone_duration, zero_freq, one_freq, sampleRate) => {
    const tones = []
    const samples_per_tone = Math.round(tone_duration * sampleRate / 1000)

    const binaries = text.split("").map(asciiToBinary).join("").split("")
    console.log("binaries", binaries)
    const freqs = binaries.map(binary => binary == '0' ? zero_freq : one_freq)
    console.log("freqs", freqs)

    var last = null
    for (var i=0 ; i<freqs.length; i++) {
        var freq = freqs[i]
        if(i > 0 && last == freq) { 
            tones.push([samples_per_tone, 's'])
        }
        tones.push([samples_per_tone, freq])
        last = freq
    }

    return tones
}



module.exports = {
    gen_morse_tones,
    gen_dtmf_tones,
    gen_music_scale,
    gen_binary_tones_from_text,
}
