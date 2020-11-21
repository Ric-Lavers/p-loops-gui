import urlService from "./Axios"
import { CameraState } from "./services.types"

let Axios = urlService()

export const initialise = async (): Promise<CameraState> => {
  await fetch("https://skribbl-lists-serverless.now.sh/api/ip/all")
    .then((data: Response) => data.json())
    .then(([{ ip }]: { ip: string }[]) => {
      Axios = urlService({ baseURL: `http://${ip}` })
    })
  return Axios.get("/init")
}
export const startCam = () => {
  return Axios.get("/start")
}
export const stopCam = () => {
  return Axios.get("stop")
}
export const startRecording = (filename: string) => {
  let data = {}
  if (filename) data = { filename }
  return Axios.post("start_recording", data)
}
export const stopRecording = () => {
  return Axios.get("stop_recording")
}

export const getEffects = (): Promise<{
  IMAGE_EFFECTS: string[]
  current: string
}> => {
  return Axios.get("/effect")
}
export const changeEffect = (effect: string): Promise<{ effect: string }> => {
  return Axios.post("/effect", { effect })
}
export const setWindow = (preview_window: { x: number, y: number, width: number, height: number }): Promise<{ success: boolean }> => {
  return Axios.post("/set_window", preview_window)
}
export const setResolution = (res: { width: number, height: number }): Promise<{ success: boolean }> => {
  return Axios.post("/set_res", res)
}
