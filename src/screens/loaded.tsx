import { useGLTF, PresentationControls, Center } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Group } from "three";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

interface LoadedProps {
  onPeak?: () => void;
  isMobile?: boolean;
}

function MobileFireball({ onPeak }: LoadedProps) {
  const { scene } = useGLTF("/models/fireball.glb");
  const modelRef = useRef<Group>(null);

  // Trigger onPeak immediately for mobile as there is no entry animation
  useEffect(() => {
    if (onPeak) onPeak();
  }, [onPeak]);

  // Auto-spin logic
  useGSAP(() => {
    if (!modelRef.current) return;

    // Initial setup - centered
    gsap.set(modelRef.current.position, { x: 0, y: 0, z: 0 });
    // Scale fireball appropriately - adjusting scalar might be needed based on model size
    // Assuming similar scale needs to knife or slightly larger/smaller visually
    modelRef.current.scale.setScalar(0.2);

    gsap.to(modelRef.current.rotation, {
      y: "+=" + Math.PI * 2,
      duration: 6,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <Center>
      <group ref={modelRef}>
        <PresentationControls
          global={true}
          enabled={true}
          snap={false}
          speed={2}
          rotation={[0, 0, 0]}
          polar={[0, 0]}
          azimuth={[-Infinity, Infinity]}
        >
          <primitive object={scene} />
        </PresentationControls>
      </group>
    </Center>
  );
}

function DesktopKnife({ onPeak }: LoadedProps) {
  gsap.registerPlugin(MotionPathPlugin);
  const { scene } = useGLTF("/models/knife.glb");
  const modelRef = useRef<Group>(null);
  const [enabled, setEnabled] = useState(false);
  const { viewport } = useThree();
  scene.scale.setScalar(0.025);

  useGSAP(() => {
    if (!modelRef.current) return;
    gsap.set(modelRef.current.position, { y: -10, z: 0 });
    gsap.set(modelRef.current.rotation, { y: (Math.PI / 11) * 7.5 });
    gsap.set(modelRef.current.scale, { x: 0.8, y: 0.8, z: 0.8 });

    // Desktop Configuration
    const config = {
      targetPos: {
        x: viewport.width * 0.032,
        y: viewport.height * 0.421,
        z: 0,
      },
      midPoint: { x: viewport.width * 0.1, y: 2.5, z: 0 },
    };

    const tl = gsap.timeline();

    // 1. Knife Starts First (Moves Up)
    tl.to(modelRef.current.position, {
      y: 5,
      duration: 2.5,
      ease: "sine.inOut",
    })
      // TRIGGER UI REVEAL AT PEAK
      .call(() => {
        if (onPeak) onPeak();
      })
      // 2. Knife Return Animation
      .to(modelRef.current.position, {
        x: config.targetPos.x,
        y: config.targetPos.y,
        z: config.targetPos.z,
        duration: 2,
        ease: "power2.out",
      })
      // Simultaneous rotation during the move
      .to(
        modelRef.current.rotation,
        {
          x: 0,
          y: Math.PI * 4, // multiple spins
          z: 0, // Lands upright
          duration: 2,
          ease: "power1.inOut",
        },
        "<"
      )
      .to(
        modelRef.current.scale,
        {
          x: 0.25,
          y: 0.25,
          z: 0.25,
          duration: 2,
          ease: "power1.inOut",
        },
        "<"
      )
      .call(() => {
        setEnabled(true);
      })
      .to(modelRef.current.rotation, {
        y: "+=" + Math.PI * 2,
        duration: 6,
        repeat: -1,
        ease: "none",
      });
  }, []);

  return (
    <Center>
      <group ref={modelRef}>
        <PresentationControls
          global={true}
          enabled={enabled}
          snap={false}
          speed={2}
          rotation={[0, 0, 0]}
          polar={[0, 0]}
          azimuth={[-Infinity, Infinity]}
        >
          <primitive object={scene} />
        </PresentationControls>
      </group>
    </Center>
  );
}

export default function Loaded(props: LoadedProps) {
  const { viewport } = useThree();
  const isMobile = viewport.width < viewport.height; // Simple heuristic for mobile

  if (isMobile) {
    return <MobileFireball {...props} />;
  }

  return <DesktopKnife {...props} />;
}
