# web-audio-analyser-2

returns a web audio `AnalyserNode` with the following extensions:

- `equalTemperedFrequencyData(binCount)`
- `barkScaleFrequencyData()`
- ~~`on('beat')`~~ TODO

## install

`npm i --save web-audio-analyser-2`

## usage

```js
var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

var webAudioAnalyser2 = require('web-audio-analyser-2')
var analyser = webAudioAnalyser2({
  context: audioCtx,
  fftSize: 2048,
  equalTemperedFreqBinCount: 10
})

someSourceNode.connect(analyser)
analyser.connect(someDestinationNode)

var interval = setInterval(function () {
  var equalTemperedFrequencyData = analyser.equalTemperedFrequencyData(8)
  console.log('equalTemperedFrequencyData.frequencies: ', equalTemperedFrequencyData.frequencies)
  console.log('equalTemperedFrequencyData.overallAmplitude: ', equalTemperedFrequencyData.overallAmplitude)

  var barkScaleFrequencyData = analyser.barkScaleFrequencyData()
  console.log('barkScaleFrequencyData.frequencies: ', barkScaleFrequencyData.frequencies)
  console.log('barkScaleFrequencyData.overallAmplitude: ', barkScaleFrequencyData.overallAmplitude)
}, 50)
```
