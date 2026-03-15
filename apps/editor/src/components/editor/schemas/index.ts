import type { EditorSchema } from "@/types/editor"
import { headerSchema } from "./header"
import { footerSchema } from "./footer"
import { bannerSchema } from "./banner"
import { sliderSchema } from "./slider"
import { gridSchema } from "./grid"
import { carouselSchema } from "./carousel"
import { productListSchema } from "./productList"
import { productDetailSchema } from "./productDetail"
import { collectionGridSchema } from "./collection-grid"
import { 
  contactSchema, loginSchema, cartSchema, checkoutSchema, ordersSchema 
} from "./page-sections"

export {
  headerSchema,
  footerSchema,
  bannerSchema,
  sliderSchema,
  gridSchema,
  carouselSchema,
  productListSchema,
  productDetailSchema,
  collectionGridSchema,
  contactSchema,
  loginSchema,
  cartSchema,
  checkoutSchema,
  ordersSchema
}

export const editorSchemas: Record<string, EditorSchema> = {
  banner: bannerSchema,
  slider: sliderSchema,
  grid: gridSchema,
  carousel: carouselSchema,
  header: headerSchema,
  footer: footerSchema,
  productList: productListSchema,
  productDetail: productDetailSchema,
  collectionGrid: collectionGridSchema,
  contact: contactSchema,
  login: loginSchema,
  cart: cartSchema,
  checkout: checkoutSchema,
  orders: ordersSchema
}
