export interface Context {
  previewing: boolean,
  recording: boolean,
  image_effect: string,
  preview_window: number[],
  resolution: { x: number, y: number },
}
