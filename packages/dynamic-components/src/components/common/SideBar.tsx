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
      width="w-64"
    >
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <img src={logoSrc || "/placeholder.svg"} alt="Logo" width={40} height={40} />
          <span className="font-bold text-lg text-gray-800">Menu</span>
        </div>
        <button onClick={toggleNav} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-4">
          {pages && pages.map((page, index) => (
            <li key={index}>
              <Link
                to={page.link}
                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
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