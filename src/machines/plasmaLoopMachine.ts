import { Machine } from "xstate"
import { initialise } from "../services/pyCamera"

export const plasmaLoopMachine = Machine(
  {
    id: "plasma-loop",
    initial: "inactive",
    context: {
      previewing: false,
      recording: false,
      image_effect: "",
      resolution: { x: 800, y: 800 },
    },
    states: {
      inactive: {},
      active: {},
    },
  },
  {
    actions: {
      setInitialCameraState: (ctx, data) => ({ ...ctx, ...data }),
      setPreview: () => {},
    },
    services: {
      getCameraState: initialise,
    },
  },
)

export default plasmaLoopMachine
