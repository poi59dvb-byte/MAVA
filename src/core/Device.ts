export class Device {
  static isTouch(): boolean {
    return matchMedia('(pointer: coarse)').matches;
  }
}
