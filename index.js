var LogScale = require('log-scale')
var range = require('lodash.range')
var average = require('average')

var webAudioAnalyser2 = function (params) {
  var analyser = params.context.createAnalyser()
  if (params.fftSize) { analyser.fftSize = params.fftSize }
  var frequencyDataArray = new Uint8Array(analyser.frequencyBinCount)

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

  return analyser
}

module.exports = webAudioAnalyser2
