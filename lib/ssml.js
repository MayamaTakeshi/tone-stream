
const xml = require("xml-js")

function process(sampleRate, params, gen_tones, default_tone_duration) {
  var elements
  if(typeof params == 'string') {
    if(params.startsWith('<speak>')) {
      const parsed = xml.xml2js(params)
      elements = parsed.elements[0].elements
    } else {
      elements = [
        {
          type: "text",
          text: params
        },
      ]
    }
  } else {
    if(params["content-type"] == "application/ssml+xml" || params.text.startsWith('<speak>')) {
      const parsed = xml.xml2js(params.text)
      elements = parsed.elements[0].elements
    } else {
      elements = [
        {
          type: "text",
          text: params.text,
        },
      ]
    }
  }

  //console.log(elements)

  return process_elements(sampleRate, elements, gen_tones, default_tone_duration)
}

function parse_duration(duration) {
  if (duration.endsWith("ms")) {
    return parseInt(duration)
  } else if (duration.endsWith("s")) {
    return parseInt(duration) * 1000
  } else {
    throw `parse-failure: invalid duration ${duration}`
  }
}

function gen_silence(sampleRate, duration) {
  var milliseconds = parse_duration(duration)
  var samples = Math.round((sampleRate / 1000) * milliseconds)
  return [samples, "s"]
}

function process_elements(sampleRate, elements, gen_tones, default_tone_duration) {
  var res
  var spec = []
  for (var i = 0; i < elements.length; i++) {
    var e = elements[i]
    if (e.type == "text") {
      spec = spec.concat(gen_tones(sampleRate, e.text, default_tone_duration))
    } else if (
      e.type == "element" &&
      e.name == "prosody" &&
      e.attributes.rate &&
      e.elements &&
      e.elements[0] &&
      e.elements[0].type == "text"
    ) {
      var duration = parse_duration(e.attributes.rate)
      spec = spec.concat(gen_tones(sampleRate, e.elements[0].text, duration))
    } else if (
      e.type == "element" &&
      e.name == "break" &&
      typeof e.attributes.time == "string"
    ) {
      spec.push(gen_silence(sampleRate, e.attributes.time))
    } else {
      throw `parse-failure: invalid SSML element ${JSON.stringify(e)}`
    }
  }
  
  return spec
}

module.exports = {
  process,
}
