export type EditorEventType =
  | "section.hover"
  | "section.select"
  | "section.insert"
  | "section.delete"
  | "section.duplicate"
  | "section.toggle-visibility"
  | "section.reorder"
  | "theme.update"
  | "property.change"
  | "iframe-ready"

export interface EditorEvent {
  type: EditorEventType
  payload?: Record<string, any>
  timestamp: number
}

export interface SectionHoverEvent extends EditorEvent {
  type: "section.hover"
  payload: {
    id: string
    rect?: DOMRect
    device?: string
  }
}

export interface SectionSelectEvent extends EditorEvent {
  type: "section.select"
  payload: {
    id: string
    componentType: string
  }
}

export interface SectionInsertEvent extends EditorEvent {
  type: "section.insert"
  payload: {
    type: string
    variant?: string
    position: number
  }
}

export interface SectionDeleteEvent extends EditorEvent {
  type: "section.delete"
  payload: {
    id: string
  }
}

export interface ThemeUpdateEvent extends EditorEvent {
  type: "theme.update"
  payload: {
    key: "colors" | "fonts" | "spacing" | "breakpoints"
    value: Record<string, any>
  }
}

export class EditorEventEmitter {
  private listeners: Map<EditorEventType, Set<(event: EditorEvent) => void>> = new Map()

  on(type: EditorEventType, callback: (event: EditorEvent) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    this.listeners.get(type)?.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.get(type)?.delete(callback)
    }
  }

  emit(event: EditorEvent): void {
    const callbacks = this.listeners.get(event.type)
    callbacks?.forEach((callback) => callback(event))
  }

  off(type: EditorEventType, callback: (event: EditorEvent) => void): void {
    this.listeners.get(type)?.delete(callback)
  }

  clearAll(): void {
    this.listeners.clear()
  }
}

// Singleton instance
export const editorEventEmitter = new EditorEventEmitter()
