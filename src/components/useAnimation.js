import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect, useRef, useState } from "react";

const useAnimation = (filepath, extension, frames, start) => {
  const [currFrame, setCurrFrame] = useState(start);
  const texture = useLoader(TextureLoader, `${filepath}${currFrame < 10 ? "00" + currFrame : (currFrame < 100 ? "0" + currFrame : currFrame )}.${extension}`)
  const interval = useRef()

  const animation = () => {
    // if (currFrame == frames - 1) return;
    setCurrFrame(state => {
      if (state == frames - 1) {
        clearInterval(interval.current);
      }
      return state + 1;
    })
    // setTimeout(animation, 33)
  }

  useEffect(() => {
    // animation();
    interval.current = setInterval(animation, 33);
  }, []);

  return texture;
}

export default useAnimation;