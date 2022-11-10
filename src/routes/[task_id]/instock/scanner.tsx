import { component$, useStylesScoped$, useRef, useClientEffect$, PropFunction, $} from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import styles from './scanner.css?inline';

export default component$((props : {MsgPipe$ : PropFunction<(value:string) => void>, TurnOff$ : PropFunction<() => void>}) => {
  useStylesScoped$(styles);
  const canvasRef = useRef<HTMLCanvasElement>();
  const videoRef = useRef<HTMLVideoElement>();
  const turnOffCamera = $(() =>{
    videoRef.current?.srcObject?.getVideoTracks().forEach((track : any) => {
      track.stop();
    });
  });

  useClientEffect$(() => {
    const width :number = 320;
    const height :number = 512;
    const startCam = () => {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video:
              // true
              {
                facingMode: "environment",
                width: width,
                height: height,
              },
          })
          .then((stream) => {
            if(videoRef.current){
              videoRef.current.srcObject = stream;
            }
          })
          .catch(function (error) {
            console.log("Something went wrong! -> " + error);
          });
      }
    };

      const capture = async() => {
        if(canvasRef && canvasRef.current && videoRef && videoRef.current){
          const context = canvasRef.current.getContext("2d");
          if(context){
            const vWidth = videoRef.current.videoWidth;
            const vHeight = videoRef.current.videoHeight;
            if(vWidth === 0){
              return null;
            }
            canvasRef.current.width = vWidth;
            canvasRef.current.height = vHeight;
            context.drawImage(videoRef.current,0,0,vWidth, vHeight);
            const imgData = context.getImageData(0, 0,vWidth, vHeight);
            return imgData;
          }
        }
      }

      const worker = async () => {
        const w = new Worker(
          new URL("./libs/worker.ts", import.meta.url),
          {
            type: "module",
          }
        );
        w.onmessage = (event) => {
          props.MsgPipe$(new TextDecoder().decode(event.data));
        };
        return w;
      };
      worker().then((worker) => {
        window.setInterval(async () => {worker.postMessage(await capture());}, 500);
      });
      startCam();
    }
  )
  return (
    <>
        <button onClick$={()=>{turnOffCamera(); props.TurnOff$()}}>OFF</button>
        <video ref={videoRef} autoPlay></video>
        <canvas ref={canvasRef}></canvas>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Snowbucket Client ver 0.0.1',
};