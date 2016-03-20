# web-audio-analyser-2

returns a web audio `AnalyserNode` with the following extensions:

- `equalTemperedFrequencyData(binCount)`
- ~~`barkScaleFrequencyData`~~ TODO
- ~~`on('beat')`~~ TODO
- ~~`loudness`~~ TODO

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
  var frequencyData = analyser.equalTemperedFrequencyData()
  console.log('frequencyData: ', frequencyData)
}, 50)
```
