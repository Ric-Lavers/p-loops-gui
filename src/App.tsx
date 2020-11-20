import React from "react"
import { useMachine, asEffect } from "@xstate/react"

import {
  initialise,
  startCam,
  stopCam,
  getEffects,
  changeEffect,
} from "./services/pyCamera"
import { CameraState } from "./services/services.types"
import plasmaLoopMachine from "./machines/plasmaLoopMachine"
import "./App.scss"

const Main = () => {
  const [isPreviewing, setPreviewing] = React.useState(false)
  const [isRecording, setRecording] = React.useState(false)

  const handleStartCam = async () => {
    try {
      await startCam()
      setPreviewing(true)
    } catch (error) {}
  }
  const handleStopCam = async () => {
    try {
      await stopCam()
      setPreviewing(false)
    } catch (error) {}
  }

  const handleRecord = () => {
    setRecording(!isRecording)
  }

  return (
    <div className="main">
      <button
        // disabled={!isPreviewing}
        onClick={handleStopCam}
        className="btn circle stop">
        <span className="text">Stop</span>
      </button>
      {!isPreviewing ? (
        <button onClick={handleStartCam} className="btn circle start">
          <span className="text">Start</span>
        </button>
      ) : (
        <button onClick={handleRecord} className="btn circle rec">
          <span className="text">Rec</span>
        </button>
      )}
      <button
        //disabled={!isPreviewing}
        className="btn circle snap">
        <span className="text">Snap</span>
      </button>
    </div>
  )
}

const Adjust = () => {
  const [effects, setEffects] = React.useState([])
  const [currentEffect, setCurrentEffect] = React.useState("")

  React.useEffect(() => {
    const handleGetEffects = async () => {
      try {
        const { IMAGE_EFFECTS, current } = await getEffects()

        //@ts-ignore
        setEffects(IMAGE_EFFECTS)
        setCurrentEffect(current)
      } catch (error) {}
    }
    handleGetEffects()
  }, [])
  const handleEffectChange = async ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const { effect } = await changeEffect(value)
      setCurrentEffect(effect)
    } catch (error) {}
  }

  return (
    <div className="adjust">
      <select value={currentEffect} onChange={handleEffectChange}>
        {effects.map((effect) => (
          <option key={effect} value={effect}>
            {effect}
          </option>
        ))}
      </select>
    </div>
  )
}

function App() {
  const [cameraState, setCamS] = React.useState<0 | 1 | CameraState>(0)
  const [state, send] = useMachine(plasmaLoopMachine, {
    context: {
      previewing: false,
      recording: false,
      image_effect: "",
      resolution: { x: 800, y: 800 },
    },
    actions: {
      setInitialCameraState: asEffect((ctx, data) => ({ ...ctx, ...data })),
    },
  })
  console.log(state, state.context)

  React.useEffect(() => {
    const getInitalState = async () => {
      try {
        const {
          previewing,
          recording,
          image_effect,
          resolution,
        } = await initialise()
        setCamS({ previewing, recording, image_effect, resolution })
      } catch (e) {
        setCamS(1)
      }
    }
    getInitalState()
  }, [])

  if (cameraState === 1)
    return <section className="App">an error ocurred</section>
  if (!cameraState) return <section className="App">loading...</section>
  return (
    <section className="App">
      <div className="set"></div>
      <Main />
      <Adjust />
    </section>
  )
}

export default App
