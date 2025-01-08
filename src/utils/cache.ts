export default class ImgSrcCache {
  static #cache: Map<string, ImgResponse> = new Map();

  static getImgSrc(id: string) {
    return this.#cache.get(id);
  }

  static setImgSrc(id: string, imgData: ImgResponse) {
    this.#cache.set(id, imgData);
  }

  static clearCache() {
    this.#cache = new Map();
  }
}
