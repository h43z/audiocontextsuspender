const originalAudioContext = window.AudioContext

exportFunction(function(){
  const context = new originalAudioContext()
  console.log("monkey patching audioContext", context)
  setTimeout(_=>context.suspend(), 4000)
  return context
}, window, {
  defineAs: "AudioContext"
})
