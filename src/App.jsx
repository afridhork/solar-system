import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "./layout/Sidebar";
import Setup from "./pages/Setup";
import Transform from "./pages/Transform";
import Animation from "./pages/Animation";
import Camera from "./pages/Camera";
import Geometries from "./pages/Geometries";
import DebugUI from "./pages/DebugUI";
import Texture from "./pages/Texture";
import Material from "./pages/Material";
import ThreeDText from "./pages/3DText";
import Lights from "./pages/Lights";
import Shadow from "./pages/Shadow";
import HauntedHause from "./pages/HauntedHouse";
import SolarSystem from "./pages/SolarSystem";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Setup />} />
      <Route path="transform" element={<Transform />} />
      <Route path="animation" element={<Animation />} />
      <Route path="camera" element={<Camera />} />
      <Route path="geometries" element={<Geometries />} />
      <Route path="debug-ui" element={<DebugUI />} />
      <Route path="texture" element={<Texture />} />
      <Route path="material" element={<Material />} />
      <Route path="3d-text" element={<ThreeDText />} />
      <Route path="lights" element={<Lights />} />
      <Route path="shadow" element={<Shadow />} />
      <Route path="haunted-hause" element={<HauntedHause />} />
      <Route path="solar-system" element={<SolarSystem />} />
    </Route>
  )
);

export default function App() {
  console.log('cek env', import.meta.env.MODE);
  
  return <RouterProvider router={router} />;
}
