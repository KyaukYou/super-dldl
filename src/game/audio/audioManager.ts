type BgmMode = 'city' | 'battle'

class AudioManager {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private bgmGain: GainNode | null = null
  private loopTimer = 0
  private mode: BgmMode | null = null
  private unlocked = false

  unlock() {
    const context = this.ensureContext()
    this.unlocked = true
    if (context.state === 'suspended') void context.resume()
    if (!this.mode) this.playCityBgm()
  }

  playCityBgm() {
    this.setBgm('city')
  }

  playBattleBgm() {
    this.setBgm('battle')
  }

  stopBgm() {
    if (this.loopTimer) window.clearInterval(this.loopTimer)
    this.loopTimer = 0
    this.mode = null
  }

  playClick() {
    this.playTone(520, 0.045, 'triangle', 0.045)
  }

  playHit() {
    this.playTone(130, 0.08, 'sawtooth', 0.07)
  }

  playSkill() {
    this.playArp([440, 660, 880], 0.065, 'triangle', 0.07)
  }

  playItem() {
    this.playArp([520, 650], 0.055, 'sine', 0.055)
  }

  playVictory() {
    this.playArp([523, 659, 784, 1047], 0.09, 'triangle', 0.08)
  }

  playDefeat() {
    this.playArp([330, 247, 196], 0.12, 'sine', 0.08)
  }

  private setBgm(mode: BgmMode) {
    if (!this.unlocked && !this.context) {
      this.mode = mode
      return
    }
    if (this.mode === mode && this.loopTimer) return
    this.stopBgm()
    this.mode = mode
    this.playBgmPhrase()
    this.loopTimer = window.setInterval(() => this.playBgmPhrase(), mode === 'city' ? 3600 : 2600)
  }

  private playBgmPhrase() {
    if (!this.mode) return
    const notes = this.mode === 'city' ? [196, 247, 294, 247] : [147, 196, 220, 196]
    this.playArp(notes, this.mode === 'city' ? 0.28 : 0.18, 'sine', this.mode === 'city' ? 0.022 : 0.032, true)
  }

  private playArp(notes: number[], step: number, type: OscillatorType, volume: number, bgm = false) {
    const context = this.ensurePlayableContext()
    if (!context) return
    notes.forEach((note, index) => this.scheduleTone(context, note, context.currentTime + index * step, step * 0.9, type, volume, bgm))
  }

  private playTone(freq: number, duration: number, type: OscillatorType, volume: number) {
    const context = this.ensurePlayableContext()
    if (!context) return
    this.scheduleTone(context, freq, context.currentTime, duration, type, volume, false)
  }

  private scheduleTone(context: AudioContext, freq: number, start: number, duration: number, type: OscillatorType, volume: number, bgm: boolean) {
    const target = bgm ? this.bgmGain : this.master
    if (!target) return
    const osc = context.createOscillator()
    const gain = context.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    osc.connect(gain)
    gain.connect(target)
    osc.start(start)
    osc.stop(start + duration + 0.03)
  }

  private ensurePlayableContext(): AudioContext | null {
    if (!this.unlocked) return null
    const context = this.ensureContext()
    if (context.state === 'suspended') void context.resume()
    return context
  }

  private ensureContext(): AudioContext {
    if (this.context) return this.context
    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    this.context = new AudioContextCtor()
    this.master = this.context.createGain()
    this.master.gain.value = 0.62
    this.bgmGain = this.context.createGain()
    this.bgmGain.gain.value = 0.34
    this.bgmGain.connect(this.master)
    this.master.connect(this.context.destination)
    return this.context
  }
}

export const audioManager = new AudioManager()
