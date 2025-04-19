"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type UniqueIdentifier
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion, AnimatePresence } from "framer-motion"
import { GitHub, Trash2, CheckCircle, Circle, X, Download, Upload, Check, ChevronRight, Plus } from "react-feather"

type TodoItem = {
  id: string
  content: string
  completed: boolean
}

function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((content: string) => {
    setTodos(prev => [
      ...prev,
      { id: Date.now().toString(), content, completed: false }
    ])
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  const toggleComplete = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  const updateTodoContent = useCallback((id: string, newContent: string) => {
    setTodos(prev =>
      prev.map(todo => 
        todo.id === id ? { ...todo, content: newContent } : todo
      )
    )
  }, [])

  const reorderTodos = useCallback((startIndex: number, endIndex: number) => {
    setTodos(prev => arrayMove(prev, startIndex, endIndex))
  }, [])

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleComplete,
    updateTodoContent,
    reorderTodos,
    setTodos
  }
}

const SortableTodoItem = ({
  todo,
  editMode,
  onToggleComplete,
  onDelete,
  onEditStart,
  onEditComplete
}: {
  todo: TodoItem
  editMode: boolean
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  onEditStart: (id: string) => void
  onEditComplete: (id: string, content: string) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id })

  useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editMode])

  const handleKeyDown = (e: React.KeyboardEvent, id: string, content: string) => {
    if (e.key === "Enter") {
      onEditComplete(id, content)
    }
    if (e.key === "Escape") {
      onEditComplete(id, todo.content)
    }
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 999 : undefined,
    opacity: isDragging ? 0.8 : 1
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: 1,
        height: "auto",
        scale: isDragging ? 1.05 : 1
      }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative px-4 py-3 bg-white ${
        isDragging ? "shadow-xl ring-1 ring-black/5 rounded-lg" : ""
      } ${todo.completed ? "bg-gray-50" : ""}`}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
          </svg>
        </button>

        <button
          onClick={() => onToggleComplete(todo.id)}
          className="text-gray-400 hover:text-green-500"
        >
          {todo.completed ? (
            <CheckCircle size={20} className="text-green-500" />
          ) : (
            <Circle size={20} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          {editMode ? (
            <input
              ref={inputRef}
              type="text"
              defaultValue={todo.content}
              onBlur={(e) => onEditComplete(todo.id, e.target.value)}
              onKeyDown={(e) => 
                handleKeyDown(e, todo.id, e.currentTarget.value)
              }
              className="w-full bg-transparent focus:outline-none border-b-2 border-blue-500"
              autoFocus
            />
          ) : (
            <span
              className={`block truncate ${
                todo.completed ? "text-gray-400 line-through" : "text-gray-800"
              }`}
              onDoubleClick={() => onEditStart(todo.id)}
            >
              {todo.content}
            </span>
          )}
        </div>

        <button
          onClick={() => onDelete(todo.id)}
          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  )
}

const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message
}: {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  message: string
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                取消
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                确认删除
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Page() {
  const {
    todos,
    addTodo,
    deleteTodo,
    toggleComplete,
    updateTodoContent,
    reorderTodos,
    setTodos
  } = useTodos()
  
  const [content, setContent] = useState("")
  const [editId, setEditId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    addTodo(content)
    setContent("")
    inputRef.current?.focus()
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = todos.findIndex(t => t.id === active.id)
    const newIndex = todos.findIndex(t => t.id === over.id)
    reorderTodos(oldIndex, newIndex)
    setActiveId(null)
  }

  const sidebarActions = [
    { 
      label: "显示进行中", 
      action: () => setTodos(todos.filter(t => !t.completed)),
      icon: <Circle size={16} />
    },
    { 
      label: "显示已完成", 
      action: () => setTodos(todos.filter(t => t.completed)),
      icon: <CheckCircle size={16} />
    },
    { 
      label: "清除已完成", 
      action: () => setTodos(todos.filter(t => !t.completed)),
      icon: <Trash2 size={16} />,
      color: "text-red-500" 
    },
    { 
      label: "清除全部", 
      action: () => setTodos([]),
      icon: <Trash2 size={16} />,
      color: "text-red-500" 
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm relative z-[100]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-yellow-300">
              TodoKit
            </span>
          </h1>
          <a
            href="https://github.com/ZRMYDYCG/mason-todolist"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800"
          >
            <GitHub size={24} />
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 relative z-[100]">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="添加新的任务..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              <span>添加任务</span>
            </button>
          </div>
        </form>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {todos.filter(t => !t.completed).length} 个待办任务
              </span>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <span>更多操作</span>
                <ChevronRight size={16} className={showSidebar ? "rotate-90" : ""} />
              </button>
            </div>

            <SortableContext 
              items={todos.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence mode="sync">
                {todos.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 text-center text-gray-400"
                  >
                    当前没有任务，开始添加吧 🌿
                  </motion.div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {todos.map(todo => (
                      <SortableTodoItem
                        key={todo.id}
                        todo={todo}
                        editMode={editId === todo.id}
                        onToggleComplete={toggleComplete}
                        onDelete={(id) => setDeleteConfirmId(id)}
                        onEditStart={setEditId}
                        onEditComplete={(id, content) => {
                          updateTodoContent(id, content)
                          setEditId(null)
                        }}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </SortableContext>
          </div>

          <DragOverlay adjustScale={false}>
            {activeId ? (
              <div className="bg-white shadow-xl rounded-lg px-4 py-3 ring-1 ring-black/5 opacity-90 w-full">
                {todos.find(t => t.id === activeId)?.content}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl p-6 z-50"
            >
              <div className="flex items-center w-full justify-between">

                <h3 className="text-sm font-semibold text-gray-500">批量操作</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {sidebarActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={action.action}
                    className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 ${
                      action.color || "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 mb-4">数据管理</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Upload size={16} />
                    <span>导入数据</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            try {
                              const imported = JSON.parse(event.target?.result as string)
                              setTodos(imported)
                            } catch {
                              alert("文件格式错误")
                            }
                          }
                          reader.readAsText(file)
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => {
                      const data = JSON.stringify(todos)
                      const blob = new Blob([data], { type: "application/json" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `todos-${new Date().toISOString()}.json`
                      a.click()
                    }}
                    className="w-full px-4 py-3 rounded-lg flex items-center gap-3 text-gray-700 hover:bg-gray-50"
                  >
                    <Download size={16} />
                    <span>导出数据</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmDialog
          isOpen={!!deleteConfirmId}
          onConfirm={() => {
            if (deleteConfirmId) deleteTodo(deleteConfirmId)
            setDeleteConfirmId(null)
          }}
          onCancel={() => setDeleteConfirmId(null)}
          title="确认删除"
          message="确定要永久删除这个任务吗？此操作不可恢复。"
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12 relative z-[100]">
        <div className="max-w-3xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TodoKit. 保持高效，掌控生活。
        </div>
      </footer>
    </div>
  )
}