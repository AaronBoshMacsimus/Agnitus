import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useGLTF } from "@react-three/drei";
import MainLayout from "./layouts/MainLayout";
import About from "./screens/About";
import Events from "./screens/Events";
import Home from "./screens/Home";
import Map from "./screens/Map";
import Workshops from "./screens/Workshops";
import Contacts from "./screens/Contacts";
import Loading from "./screens/loading";

// Preload the 3D model
useGLTF.preload("/models/knife.glb");
useGLTF.preload("/models/fireball.glb");

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Remove the loading screen from DOM after the transition is fully done (6s buffer)
    setTimeout(() => setCleanupLoading(true), 6000);
  };

  return (
    <>
      {/* Layer 0: Loading Screen (Background) */}
      {!cleanupLoading && (
        <div className="fixed inset-0 z-0">
          <Loading onComplete={handleLoadingComplete} />
        </div>
      )}

      {/* Layer 10: Main App (Transparent Overlay initially) */}
      {!isLoading && (
        <div className="relative z-10">
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/events" element={<Events />} />
                <Route path="/workshops" element={<Workshops />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/map" element={<Map />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </>
  );
}
