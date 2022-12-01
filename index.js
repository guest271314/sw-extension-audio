try {
    const ac = new AudioContext(),
      mediaElement = new Audio(
        'https://ia800301.us.archive.org/10/items/DELTAnine2013-12-11.WAV/Deltanine121113Pt3Wav.wav'
      ),
      measn = new MediaElementAudioSourceNode(ac, {
        mediaElement,
      }),
      ctx = document.createElement('canvas').getContext('2d'),
      fontSize = 14,
      metadata = {
        title: new URL(mediaElement.src).pathname.split('/').pop(),
        artist: '',
        album: '',
        artwork: [],
      };
  
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    const blob = await new Promise((resolve) => ctx.canvas.toBlob(resolve));
  
    metadata.artwork.push(
      {
        src: URL.createObjectURL(blob),
        type: 'image/png',
        sizes: `${ctx.canvas.width}x${ctx.canvas.height}`,
      },
    );
  
    navigator.mediaSession.metadata = new MediaMetadata(metadata);
    measn.connect(ac.destination);
    mediaElement.onended = async () => {
      measn.disconnect();
      await ac.close();
      close();
    }
    await mediaElement.play();
  } catch (err) {
    console.log(err);
  }
  
