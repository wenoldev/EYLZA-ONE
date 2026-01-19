import { useStore } from "@/store/useStore";

export async function getHeaderMenus() {
  const { store, themeData } = useStore.getState();
  const storeSlug = store?.slug;

  const formatLink = (slug: string) => {
    const path = slug === 'home' ? '' : slug;
    if (!storeSlug) return `/${path}`;
    return `/${storeSlug}/${path}`;
  };

  const pages = themeData?.pages || [];

  return {
    mainSection: pages.map(page => ({
      title: page.name,
      link: formatLink(page.slug)
    })),
    categoryBar: [
      { title: "Men", link: formatLink("category/men") },
      { title: "Women", link: formatLink("category/women") },
      { title: "New Arrivals", link: formatLink("category/new") },
      { title: "Sustainability", link: formatLink("sustainability") }
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