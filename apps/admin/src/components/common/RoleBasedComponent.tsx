import { useAuthGuard } from "@/stores/authStore";

interface RoleBasedComponentProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'vendor')[];
  fallback?: React.ReactNode;
}

export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({ 
  children, 
  allowedRoles, 
  fallback = null 
}) => {
  const { role } = useAuthGuard();
  
  if (!role || !allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
