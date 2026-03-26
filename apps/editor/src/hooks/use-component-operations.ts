
import { useCallback } from "react"
import type { ComponentInstance } from "@/types/editor"
import { editorSchemas } from "@/components/editor/schemas"

export interface UseComponentOperationsProps {
  components: ComponentInstance[]
  onComponentsChange: (components: ComponentInstance[]) => void
}

export function useComponentOperations({ components, onComponentsChange }: UseComponentOperationsProps) {
  const getSchemaDefaults = useCallback((selector: string) => {
    const schema = editorSchemas[selector]
    if (!schema) return {}

    const defaults: any = {}
    schema.tabs?.forEach((tab: any) => {
      tab.controls?.forEach((ctrl: any) => {
        const path = ctrl.property.split('.')
        let obj = defaults
        for (let i = 0; i < path.length - 1; i++) {
          obj[path[i]] = obj[path[i]] || {}
          obj = obj[path[i]]
        }
        obj[path[path.length - 1]] = ctrl.defaultValue
      })
    })
    return defaults
  }, [])

  const addComponent = useCallback(
    (selector: string, index?: number) => {
      const newComponent: ComponentInstance = {
        id: `${selector}-${Date.now()}`,
        selector,
        name: `${selector.charAt(0).toUpperCase() + selector.slice(1)} ${components.filter((c) => c.selector === selector).length + 1}`,
        visible: true,
        isDeletable: !["header", "footer"].includes(selector),
        order: index ?? components.length,
        props: getSchemaDefaults(selector),
      }

      if (index !== undefined) {
        const updated = [...components.slice(0, index), newComponent, ...components.slice(index)]
        onComponentsChange(updated)
      } else {
        onComponentsChange([...components, newComponent])
      }
    },
    [components, onComponentsChange, getSchemaDefaults],
  )

  const deleteComponent = useCallback(
    (id: string) => {
      const component = components.find((c) => c.id === id)
      if (component && !component.isDeletable) return

      const updated = components.filter((c) => c.id !== id)
      onComponentsChange(updated)
    },
    [components, onComponentsChange],
  )

  const duplicateComponent = useCallback(
    (id: string) => {
      const component = components.find((c) => c.id === id)
      if (!component) return

      const newComponent: ComponentInstance = {
        ...component,
        id: `${component.selector}-${Date.now()}`,
        name: `${component.name} (Copy)`,
      }

      onComponentsChange([...components, newComponent])
    },
    [components, onComponentsChange],
  )

  const reorderComponent = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updated = [...components]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      onComponentsChange(updated)
    },
    [components, onComponentsChange],
  )

  const toggleVisibility = useCallback(
    (id: string) => {
      const updated = components.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
      onComponentsChange(updated)
    },
    [components, onComponentsChange],
  )

  return {
    addComponent,
    deleteComponent,
    duplicateComponent,
    reorderComponent,
    toggleVisibility,
  }
}
