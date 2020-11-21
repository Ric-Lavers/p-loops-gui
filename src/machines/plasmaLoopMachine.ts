//@ts-nocheck
import { Machine } from "xstate"
import { initialise, setWindow } from "../services/pyCamera"


export const plasmaLoopMachine = Machine(
  {
    id: "plasma-loop",
    initial: "inactive",
    context: {
      previewing: false,
      recording: false,
      image_effect: "",
      preview_window: [0, 0, 0, 0],
      resolution: { x: 800, y: 800 },
    },
    states: {
      inactive: {

      },
      active: {},
    },
    on: {
      // SET_PREVIEW_WINDOW: {

      // }
    }
  },
  {
    actions: {
      setInitialCameraState: (ctx, data) => ({ ...ctx, ...data }),
      setPreview: () => { },
    },
    services: {
      getCameraState: initialise,
      setPreviewWindow: setWindow,
    },
  },
)

export default plasmaLoopMachine
