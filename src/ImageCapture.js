export default class ImageCapture {

  constructor(videoContainerEl, videoEl, canvas) {
    this.videoContainerEl = videoContainerEl;
    this.videoEl = videoEl;
    this.canvas = canvas;
    this.isPortrait = true;
  }

  constraints() {
    return { video: { facingMode: this.isFront ? 'user' : 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } };
  }

  async startCamera(isFront = true) {
    this.isFront = isFront;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints());
      this.videoEl.srcObject = this.stream;
      this.videoEl.onloadedmetadata = () => {
        this.videoEl.play();
      };
    } catch (err) {
      throw Error(err);
    }
  }

  toggleCamera() {
    this.stream
      .getTracks()
      .forEach(track => track.stop());
    this.startCamera(!this.isFront);
  }

  setPortrait(isPortrait) {
    this.isPortrait = isPortrait;
  }

  getDate() {
    const now = new Date();
    return `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
  }

  drawImage() {
    const margin = 40;
    const video = this.videoEl;
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');

    if (this.isPortrait) {
      const cropPercentage = this.videoContainerEl.clientHeight / this.videoEl.clientHeight;
      const cropAmount = (video.videoHeight - video.videoHeight * cropPercentage) / 2;
      const croppedHeight = video.videoHeight - cropAmount * 2;

      canvas.width = video.videoWidth + margin * 2;
      canvas.height = croppedHeight + margin * 2 + 80;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, cropAmount, video.videoWidth, croppedHeight, margin, margin, video.videoWidth, croppedHeight);
    } else {
      const cropPercentage = this.videoContainerEl.clientWidth / this.videoEl.clientWidth;
      const cropAmount = (video.videoWidth - video.videoWidth * cropPercentage) / 2;
      const croppedWidth = video.videoWidth - cropAmount * 2;

      canvas.width = croppedWidth + margin * 2;
      canvas.height = video.videoHeight + margin * 2 + 80;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#dddddd";
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, cropAmount, 0, croppedWidth, video.videoHeight, margin, margin, croppedWidth, video.videoHeight);
    }

    ctx.textAlign = "center";
    ctx.font = '700 80px "Exo 2"';
    ctx.fillStyle = "#000000";
    ctx.fillText(this.getDate(), canvas.width / 2, canvas.height - 30);

    return canvas;
  }

  takePhoto() {
    const image = this.drawImage();
    const data = image.toDataURL("image/jpeg", 1);
    return data;
  }
}
