import { Link, Outlet } from "react-router-dom";
import "./index.css";
import {useState} from 'react'


export default function RootLayout() {
  const [isOpen, setIsOpen] = useState(true)
  
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={isOpen ? "sidebar-open" : "sidebar-close"}>
        <div className="flex justify-end cursor-pointer rounded-full bg-[#2f3640]" onClick={()=>setIsOpen(!isOpen)}>
          <i className="fa-solid fa-bars m-2"></i>
        </div>
        {
          isOpen ? (
            <>
              <h2 className="logo">MyApp</h2>
              <nav className="nav overflow-y-scroll my-scroll">
                <Link to="/" className="nav-item">Setup</Link>
                <Link to="/transform" className="nav-item">Transform</Link>
                <Link to="/animation" className="nav-item">Animation</Link>
                <Link to="/camera" className="nav-item">Camera</Link>
                <Link to="/geometries" className="nav-item">Geometries</Link>
                <Link to="/debug-ui" className="nav-item">Debug UI</Link>
                <Link to="/texture" className="nav-item">Texture</Link>
                <Link to="/material" className="nav-item">Material</Link>
                <Link to="/3d-text" className="nav-item">3D Text</Link>
                <Link to="/lights" className="nav-item">Lights</Link>
                <Link to="/shadow" className="nav-item">Shadow</Link>
                <Link to="/haunted-hause" className="nav-item">Haunted Hause</Link>
                <Link to="/solar-system" className="nav-item">Solar System</Link>
              </nav>
            </>
          ): null
        }
      </aside>

      {/* Main Content */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
