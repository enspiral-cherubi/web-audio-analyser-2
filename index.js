var LogScale = require('log-scale')
var range = require('lodash.range')
var average = require('average')
var getClosest = require('get-closest')

var webAudioAnalyser2 = function (params) {
  ///////////////////////////////////////////////////
  /* prepare analyser */
  ///////////////////////////////////////////////////
  var analyser = params.context.createAnalyser()
  if (params.fftSize) { analyser.fftSize = params.fftSize }
  var frequencyDataArray = new Uint8Array(analyser.frequencyBinCount)


  ///////////////////////////////////////////////////
  /* add equalTemperedFrequencyData to analyser */
  ///////////////////////////////////////////////////
  var logScale = new LogScale(0, frequencyDataArray.length)
  analyser.equalTemperedFreqBinCount = params.equalTemperedFreqBinCount || 8
  var sliceIndices = range(0, 1, 1 / analyser.equalTemperedFreqBinCount).map(function (val, i, array) {
    return logScale.linearToLogarithmic(val)
  }).concat(frequencyDataArray.length)

  var sliceRanges = []
  for (var i = 0; i < sliceIndices.length - 1; i++) {
    var start = sliceIndices[i], end = sliceIndices[i + 1] + 1
    sliceRanges.push({ start: start, end: end })
  }

  analyser.equalTemperedFrequencyData = function () {
    this.getByteFrequencyData(frequencyDataArray)

    return sliceRanges.map(function (sliceRange) {
      var slice = frequencyDataArray.slice(sliceRange.start, sliceRange.end)
      return parseInt(average(slice))
    })
  }
  ///////////////////////////////////////////////////


  ///////////////////////////////////////////////////
  /* add barkScaleFrequencyData to analyser */
  ///////////////////////////////////////////////////
  // https://www.wikiwand.com/en/Bark_scale
  // http://stackoverflow.com/questions/14789283/what-does-the-fft-data-in-the-web-audio-api-correspond-to
  var barkFrequencies = [60, 150, 250, 350, 450, 570, 700, 840, 1000, 1170, 1370, 1600, 1850, 2150, 2500, 2900, 3400, 4000, 4800, 5800, 7000, 8500, 10500, 13500]
  var bandSpacing = params.context.sampleRate / analyser.fftSize

  var frequencies = range(0, frequencyDataArray.length).map(function (n) {
    return parseInt(n * bandSpacing)
  })

  var barkIndices = barkFrequencies.map(function (barkFrequency) {
    return getClosest.number(barkFrequency, frequencies)
  })

  analyser.barkScaleFrequencyData = function () {
    this.getByteFrequencyData(frequencyDataArray)

    return barkIndices.map(function (barkIndex) {
      return frequencyDataArray[barkIndex]
    })
  }
  ///////////////////////////////////////////////////

  return analyser
}

module.exports = webAudioAnalyser2
