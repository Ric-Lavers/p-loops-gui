//@ts-nocheck
import React from "react"
import { useMachine, asEffect } from "@xstate/react"

import {
  initialise,
  startCam,
  stopCam,
  getEffects,
  changeEffect,
  setWindow,
  setResolution,
  startRecording,
  stopRecording,
} from "./services/pyCamera"
import { CameraState } from "./services/services.types"
import plasmaLoopMachine from "./machines/plasmaLoopMachine"
import { Context } from './types'
import "./App.scss"

interface IMain {
  previewing: boolean
  recording: boolean
}
const Main = ({ previewing, recording }: IMain) => {
  const [isPreviewing, setPreviewing] = React.useState(previewing)
  const [isRecording, setRecording] = React.useState(recording)

  const handleStartCam = async () => {
    try {
      await startCam()
      setPreviewing(true)
    } catch (error) { }
  }
  const handleStopCam = async () => {
    try {
      await stopCam()
      setPreviewing(false)
    } catch (error) { }
  }

  const handleRecord = async () => {
    try {
      await isRecording ? stopRecording() : startRecording(/* filename */)
      setRecording(!isRecording)
    } catch (error) { }
  }

  return (
    <div className="main">
      <button
        disabled={isRecording || !isPreviewing}
        onClick={handleStopCam}
        className="btn circle stop">
        <span className="text">Stop</span>
      </button>
      {!isPreviewing ? (
        <button onClick={handleStartCam} className="btn circle start">
          <span className="text">Start</span>
        </button>
      ) : (
          <button onClick={handleRecord} className={`btn circle ${isRecording ? 'rec' : ''}`}>
            <span className="text">{isRecording ? 'stop Rec' : 'start Rec'}</span>
          </button>
        )}
      <button
        disabled={true}
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
      } catch (error) { }
    }
    handleGetEffects()
  }, [])
  const handleEffectChange = async ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const { effect } = await changeEffect(value)
      setCurrentEffect(effect)
    } catch (error) { }
  }

  return (
    <div className="adjust">
      <div className="field" >
        <table>
          <tr>
            <td>Effects</td>
            <td>
              <select value={currentEffect} onChange={handleEffectChange}>
                {effects.map((effect) => (
                  <option key={effect} value={effect}>
                    {effect}
                  </option>
                ))}
              </select></td>
          </tr>

        </table>
      </div>

    </div>
  )
}

const Settings = ({ resolution, preview_window }: Context) => {
  const [settings, setSettings] = React.useState<{ x: number, y: number, width: number, height: number }>({
    x: preview_window[0],
    y: preview_window[1],
    height: preview_window[2],
    width: preview_window[3],
    resolution: {
      height: resolution.height,
      width: resolution.width,
    }
  })


  function handleChange({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) {


    if (name.includes('resolution')) {
      const [, n] = name.split('.')
      setSettings(prev => ({ ...prev, resolution: { ...prev.resolution, [n]: parseInt(value) } }))
      return
    }
    setSettings(prev => ({ ...prev, [name]: parseInt(value) }))
  }
  function handleSubmit(e: any) {
    e.preventDefault()
    const { resolution, ...windowObj } = settings
    setWindow(windowObj)
    setResolution(resolution)
  }

  return (
    <div className="set">

      <form
        onSubmit={handleSubmit}
        //@ts-ignore
        onChange={handleChange}>
        <div className="form-container">
          <div className="field" >
            <h3>resolution</h3>
            <table>
              <tr>
                <td>resolution height:</td>
                <td> <input name="resolution.height" value={settings.resolution.height} type='number' /></td>
              </tr>
              <tr>
                <td>resolution.width:</td>
                <td> <input name="resolution.width" value={settings.resolution.width} type='number' /></td>
              </tr>
            </table>
          </div>
          <div className="field">
            <h3>window</h3>
            <table>
              <tr>
                <td>x:</td>
                <td><input name="x" value={settings.x} type='number' /></td>
              </tr>
              <tr>
                <td>y:</td>
                <td><input name="y" value={settings.y} type='number' /></td>
              </tr>
              <tr>
                <td>height:</td>
                <td><input name="height" value={settings.height} type='number' /></td>
              </tr>
              <tr>
                <td>width :</td>
                <td><input name="width" value={settings.width} type='number' /></td>
              </tr>
            </table>
          </div>
        </div>
        <input type="submit" value="update" />
      </form>
    </div>
  )
}

function App() {
  const [cameraState, setCamS] = React.useState<0 | 1 | CameraState>(0)
  // const [state, send] = useMachine(plasmaLoopMachine, {

  //   actions: {
  //     setInitialCameraState: asEffect((ctx, data) => ({ ...ctx, ...data })),
  //   },
  // })


  React.useEffect(() => {
    const getInitalState = async () => {
      try {
        const {
          previewing,
          recording,
          image_effect,
          resolution,
          preview_window
        } = await initialise()
        console.log(preview_window);

        setCamS({ previewing, recording, image_effect, resolution, preview_window })
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

      <Settings
        resolution={cameraState.resolution}
        preview_window={cameraState.preview_window}

      />
      <Main
        previewing={cameraState.previewing}
        recording={cameraState.recording}
      />
      <Adjust />
    </section>
  )
}

export default App
