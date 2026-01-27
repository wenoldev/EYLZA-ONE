
interface CarouselProps {
  "data-x-id"?: string
  title: string
  items: Array<{ id: string; image: string; name: string }>
  isEditing?: boolean
  onElementClick?: (id: string) => void
}

export function CarouselEditor(props: CarouselProps) {
  const { "data-x-id": dataXId = "carousel_1", title, items, isEditing, onElementClick } = props

  return (
    <div
      data-x-id={dataXId}
      className={`w-full p-4 ${isEditing ? "ring-2 ring-blue-500" : ""}`}
      onClick={() => onElementClick?.(dataXId)}
    >
      <h2
        data-x-id={`${dataXId}-title`}
        className="mb-6 text-2xl font-bold"
        onClick={(e) => {
          e.stopPropagation()
          onElementClick?.(`${dataXId}-title`)
        }}
      >
        {title}
      </h2>
      <div className="flex overflow-x-auto gap-4 pb-4">
        {items.map((item) => (
          <div
            key={item.id}
            data-x-id={`${dataXId}-item-${item.id}`}
            className="flex-shrink-0 cursor-pointer rounded-lg bg-gray-100 p-4 transition hover:shadow-lg"
            onClick={(e) => {
              e.stopPropagation()
              onElementClick?.(`${dataXId}-item-${item.id}`)
            }}
          >
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="mb-2 h-40 w-40 rounded object-cover"
            />
            <p className="text-center text-sm font-medium">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
