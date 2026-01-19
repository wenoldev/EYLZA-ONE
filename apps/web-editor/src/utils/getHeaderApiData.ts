export async function getHeaderMenus() {
  return {
    mainSection: [
      { title: "Home", link: "/" },
      {
        title: "Template",
        link: "/template",
        subMenu: [
          { title: "Standard", link: "/template/standard" },
          { title: "Modern", link: "/template/modern" }
        ]
      },
      { title: "Docs", link: "/docs" },
      { title: "Sale", link: "/sale", isAccent: true }
    ],
    categoryBar: [
      { title: "Men", link: "/category/men" },
      { title: "Women", link: "/category/women" },
      { title: "New Arrivals", link: "/category/new" },
      { title: "Sustainability", link: "/sustainability" }
    ]
  }
}

export function getHeaderActions() {
  return {
    onToggleCart: () => console.log("Toggle Cart"),
    onToggleLoginDialog: () => console.log("Toggle Login"),
    cartCount: 3
  }
}