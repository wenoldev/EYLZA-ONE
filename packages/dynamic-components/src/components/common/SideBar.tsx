import type React from "react"
import { X } from "lucide-react"
import {Link} from "react-router-dom"
import SidePanel from "./SidePanel" // Import the reusable SidePanel component

interface Page {
  name: string
  link: string
}

interface SideBarProps {
  logoSrc: string
  isNavOpen: boolean
  toggleNav: () => void
  pages: Page[]
}

const SideBar: React.FC<SideBarProps> = ({ logoSrc, isNavOpen, toggleNav, pages }) => {
  return (
    <SidePanel
      isOpen={isNavOpen}
      togglePanel={toggleNav}
      position="left"
      width="w-[85%] max-w-[320px]"
    >
      <div className="flex justify-between items-center px-6 py-5 border-b border-gray-50">
        <div className="flex items-center gap-3">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="h-6 w-auto object-contain" />
          ) : (
            <span className="font-black text-xl tracking-tighter uppercase">Menu</span>
          )}
        </div>
        <button onClick={toggleNav} className="text-gray-400 hover:text-gray-900 transition-colors">
          <X size={22} />
        </button>
      </div>

      <nav className="py-6 px-4">
        <ul className="space-y-1">
          {pages && pages.map((page, index) => (
            <li key={index}>
              <Link
                to={page.link}
                className="block py-3 px-4 text-[13px] font-bold uppercase tracking-widest text-gray-800 hover:bg-gray-50 rounded-lg transition-all"
                onClick={toggleNav}
              >
                {page.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </SidePanel>
  )
}

export default SideBar