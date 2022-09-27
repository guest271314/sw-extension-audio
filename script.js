try {
  const ac = new AudioContext(),
    mediaElement = new Audio(
      'https://ia800301.us.archive.org/10/items/DELTAnine2013-12-11.WAV/Deltanine121113Pt3Wav.wav'
    ),
    measn = new MediaElementAudioSourceNode(ac, {
      mediaElement,
    }),
    msd = new MediaStreamAudioDestinationNode(ac, { channelCount: 2 }),
    msasn = new MediaStreamAudioSourceNode(ac, { mediaStream: msd.stream }),
    video = document.createElement('video'),
    ctx = document.createElement('canvas').getContext('2d'),
    fontSize = 14,
    metadata = {
      title: new URL(mediaElement.src).pathname.split('/').pop(),
      artist: '',
      album: '',
      artwork: [],
    };

  measn.connect(msd);

  mediaElement.autoplay = video.autoPictureInPicture = video.controls = video.autoplay = true;

  function handlePictureInPictureEvents(e) {
    console.log(e.type, document.pictureInPictureElement);
    e.pictureInPictureWindow.onresize = ({ target }) => {
      console.log(target, target.width, target.height);
    };
  }

  video.addEventListener('enterpictureinpicture', handlePictureInPictureEvents);
  video.addEventListener('leavepictureinpicture', handlePictureInPictureEvents);

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

  ctx.fillStyle = '#000000';
  ctx.font = `${fontSize}px Monospace`;

  const entries = Object.entries(metadata);

  let i = 0;
  for (const [key, value] of entries.slice(0, -1)) {
    ctx.fillText(
      `${key[0].toUpperCase() + key.substr(1)}: ${value}`,
      20,
      ctx.canvas.height / 3.33 + i * fontSize
    );
    i += 1.5;
  }

  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const stream = ctx.canvas.captureStream(0),
    [videoTrack] = stream.getVideoTracks();

  videoTrack.onmute = videoTrack.onunmute = (e) => console.log(e.type);
  videoTrack.requestFrame();

  const mediaStream = new MediaStream([
    videoTrack,
    msasn.mediaStream.getAudioTracks()[0],
  ]);

  video.srcObject = mediaStream;

  video.onloadedmetadata = async () => {
    await chrome.tabs.update(+new URLSearchParams(location.search).get('id'), {
      active: true,
    });
    console.log(document.pictureInPictureElement);
    document.body.appendChild(video);
  };
} catch (err) {
  console.log(err);
}
