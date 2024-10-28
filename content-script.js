(() => {

  if(localStorage.getItem('disableAudioContextSuspender'))
    return

  const originalAudioContext = AudioContext
  const originalCreateBufferSource = AudioContext.prototype.createBufferSource
  const map = new Map()

  const autoSuspend = ctx => {
    const timer = map.get(ctx)

    if(timer)
      clearTimeout(timer)

    map.set(ctx, setTimeout(function(){
      map.delete(ctx)

      if(ctx.state === 'suspended')
        return

      ctx.suspend().then(_=>console.log('Auto-suspended AudioContext'))
    }, 2000))
  }

  AudioContext.prototype.createBufferSource = function(){
    const buffer = originalCreateBufferSource.call(this)
    buffer._audioContext = this

    buffer.start = function(){
      autoSuspend(this._audioContext)

      if(this._audioContext.state === 'running')
        return AudioScheduledSourceNode.prototype.start.call(this)

      this._audioContext.resume().then(_=>{
        console.log('Resumed auto-suspended AudioContext')
        return AudioScheduledSourceNode.prototype.start.call(this)
      })
    }

    return buffer
  }

  AudioContext = function(){
    const ctx = new originalAudioContext()
    autoSuspend(ctx)
    return ctx
  }
})();
