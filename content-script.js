const originalAudioContext = AudioContext
const originalCreateBufferSource = AudioContext.prototype.createBufferSource

let suspendTimer = null
const autoSuspend = ctx => {
  ctx.resume()

  if(suspendTimer)
    clearTimeout(suspendTimer)

  suspendTimer = setTimeout(_ => {
    ctx.suspend().then(_=>console.log('Auto suspended AudioContext', ctx))
    suspendTimer = null
  }, 2000)
}

AudioContext.prototype.createBufferSource = function(){
  autoSuspend(this)
  return originalCreateBufferSource.call(this)
}

AudioContext = function(){
  const ctx = new originalAudioContext()
  autoSuspend(ctx)
  return ctx
}
