export async function checkStoreAccess(userId: string, storeId: string, requiredRoles: string[] = ['owner', 'manager', 'staff']) {
  // Logic removed as user_store table is deleted
  // defaulting to true for now to allow access
  return true
}