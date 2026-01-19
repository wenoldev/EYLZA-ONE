import type { EditorSchema } from "@/types/editor"
import { headerSchema } from "./header"
import { footerSchema } from "./footer"
import { bannerSchema } from "./banner"
import { sliderSchema } from "./slider"
import { gridSchema } from "./grid"
import { carouselSchema } from "./carousel"
import { productListSchema } from "./productList"
import { productDetailSchema } from "./productDetail"

export {
  headerSchema,
  footerSchema,
  bannerSchema,
  sliderSchema,
  gridSchema,
  carouselSchema,
  productListSchema,
  productDetailSchema
}

export const editorSchemas: Record<string, EditorSchema> = {
  banner: bannerSchema,
  slider: sliderSchema,
  grid: gridSchema,
  carousel: carouselSchema,
  header: headerSchema,
  footer: footerSchema,
  productList: productListSchema,
  productDetail: productDetailSchema
}
