class SheetLoader {
  constructor(onLoadAllCallBack = undefined) {
    this.sheetsToLoad = [];
    this.sheetsLoaded = 0;
    this.loadAllCallBack = onLoadAllCallBack;
    this.queue = [];
  }

  onLoadSheet() {
    this.sheetsLoaded++;
    if (this.sheetsLoaded >= this.queue.length) {
      if (this.loadAllCallBack) {
        this.loadAllCallBack();
      }
    }
  }

  queueSheet(filepath) {
    const newSheet = new Image();
    this.queue.push({ filepath: filepath, image: newSheet });
    newSheet.src = filepath;
    return newSheet;
  }

  loadSheetQueue(onLoadAllCallBack = undefined) {
    if (onLoadAllCallBack) {
      this.loadAllCallBack = onLoadAllCallBack;
    }

    this.queue.map((item) => {
      item.image.addEventListener("load", () => {
        this.onLoadSheet();
      });
    });
  }
}
