import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { AccordionConfig } from '../../types/Accordion';

const Accordion = (config: AccordionConfig) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    if (config.allowMultiple) {
      setExpandedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
    } else {
      setExpandedItems((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  if (!config.items || config.items.length === 0) return null

  const titleStyle = config.styles.titleFont ? { fontFamily: config.styles.titleFont } : {};
  const contentStyle = config.styles.contentFont ? { fontFamily: config.styles.contentFont } : {};

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {(config.title || config.subTitle) && (
        <div className="mb-8">
          {config.title && (
            <h2
              className="text-4xl mb-4 font-normal"
              style={{ color: config.styles.textColor, ...titleStyle }}
              dangerouslySetInnerHTML={{ __html: config.title }}
            />
          )}
          {config.subTitle && (
            <p
              className="text-lg opacity-80"
              style={{ color: config.styles.textColor, ...contentStyle }}
              dangerouslySetInnerHTML={{ __html: config.subTitle }}
            />
          )}
        </div>
      )}

      <div className="flex flex-col border-t" style={{ borderColor: config.styles.borderColor }}>
        {config.items.map((item, index) => {
          const isOpen = expandedItems.includes(index);
          return (
            <div
              key={index}
              className="border-b"
              style={{
                borderColor: config.styles.borderColor,
                backgroundColor: config.styles.backgroundColor
              }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full py-6 flex items-start justify-between text-left group transition-all hover:bg-black/5 px-2 -mx-2 rounded-lg"
                style={{ cursor: 'pointer' }}
              >
                <div className="flex gap-4 items-center">
                  <span className="text-xl font-normal opacity-50 font-serif">
                    {index + 1}
                  </span>
                  <span
                    className="text-xl font-medium"
                    style={{ color: config.styles.textColor, ...titleStyle }}
                  >
                    {item.title}
                  </span>
                </div>

                <div className="shrink-0 ml-4 pt-1">
                  {config.icon === 'plus' ? (
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      {/* Horizontal line (always visible) */}
                      <div
                        className="absolute w-full h-[1.5px] top-1/2 left-0 -translate-y-1/2 transition-transform duration-300 ease-in-out"
                        style={{ backgroundColor: config.styles.textColor }}
                      />
                      {/* Vertical line (rotates to become horizontal or scales out) */}
                      <div
                        className={`absolute w-[1.5px] h-full left-1/2 top-0 -translate-x-1/2 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                        style={{ backgroundColor: config.styles.textColor }}
                      />
                    </div>
                  ) : (
                    <ChevronDown
                      size={24}
                      style={{ color: config.styles.textColor }}
                      className={`transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </div>
              </button>

              <div
                className="grid transition-[grid-template-rows] duration-500 ease-in-out"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr"
                }}
              >
                <div className="overflow-hidden">
                  <div
                    className="pb-6 pr-12 pl-8 opacity-80"
                    style={{
                      color: config.styles.textColor,
                      ...contentStyle
                    }}
                  >
                    {item.content}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Accordion;
