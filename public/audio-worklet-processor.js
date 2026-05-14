class PCMCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._chunkSamples = 1600; // 100ms at 16kHz
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;

    for (let i = 0; i < channel.length; i++) {
      this._buffer.push(Math.max(-32768, Math.min(32767, Math.round(channel[i] * 32768))));
      if (this._buffer.length >= this._chunkSamples) {
        const arr = new Int16Array(this._buffer);
        this.port.postMessage(arr.buffer, [arr.buffer]);
        this._buffer = [];
      }
    }

    return true;
  }
}

registerProcessor("pcm-capture", PCMCaptureProcessor);
