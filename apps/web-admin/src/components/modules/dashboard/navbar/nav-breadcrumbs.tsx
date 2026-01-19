import { Link, useLocation } from "react-router-dom"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"

export const Breadcrumbs = () => {
  const location = useLocation()
  const segments = location.pathname.split("/").filter(Boolean) 
  // e.g. "/settings" -> ["dashboard", "settings"]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/")
          const isLast = index === segments.length - 1
          const label = segment.charAt(0).toUpperCase() + segment.slice(1)

          return (
            <BreadcrumbItem key={href} className="flex items-center">
              {isLast ? (
                <BreadcrumbPage className="text-sm font-medium">
                  {label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={href} className="text-sm">
                    {label}
                  </Link>
                </BreadcrumbLink>
              )}
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
