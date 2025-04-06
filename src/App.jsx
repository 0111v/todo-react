import React, { use, useEffect, useState } from 'react'

const App = () => {

  const LOCAL_STORAGE_KEY = 'my-todos'
  const [todo, setTodo] = useState('')
  const [todoList, setTodoList] = useState(() => {
    const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedTodos == null) {
      return []
    }
    return JSON.parse(storedTodos)
  })
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoList))
  }, [todoList])

  function addTodo() {
    setTodoList((currentTodoList) => {
      return [...currentTodoList, {
        name: todo,
        id: crypto.randomUUID(),
        completed: false
      }]
    })
    setTodo('')
  }

  function toggleTodo(id, checked) {
    setTodoList((currentTodoList) => {
      return currentTodoList.map((todo) => {
        if (todo.id === id) {
          return {...todo, completed: checked}
        }
        return todo
      })
    })
  }

  function deleteTodo(id) {
    setTodoList((currentTodoList) => {
      return currentTodoList.filter(todo => (todo.id !== id))
    })
  }

  function startEditingTodo(editId, editName) {
    setEditingTodoId(editId)
    setEditText(editName)
  }

  function saveEdit(editId, editName) {
    setTodoList((currentTodoList) => {
      return currentTodoList.map((todo) => {
        if (todo.id === editId) {
          return {...todo, name: editName}
        }
        return todo
      })
    })
    cancelEdit()
  }

  function cancelEdit() {
    setEditingTodoId(null)
    setEditText('')
  }

  return (
    <div>
      <h1>Todo List</h1>
      <input 
        type="text"
        value={todo}
        onChange={e => setTodo(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            addTodo()
          }
        }}
      />
      <button onClick={() => addTodo()}>Add todo</button>
      <h2>My todos:</h2>
      <ul>
        {todoList.map((todo) => (
            <li key={todo.id}>
              {editingTodoId === todo.id? 
                <>
                  <input 
                    type="text"
                    autoFocus
                    value={editText} 
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEdit(todo.id, editText)
                      } 
                      if (e.key === 'Escape') {
                        cancelEdit()
                      } 
                    }}
                  />
                  <button onClick={() => saveEdit(todo.id, editText)}>Save</button>
                  <button onClick={() => cancelEdit()}>Cancel</button>
                </> 
                : 
                <>
                  <label htmlFor={todo.name} className='todo-item'>
                  <input 
                    type="checkbox" 
                    id={todo.name}
                    checked={todo.completed}
                    onChange={e => toggleTodo(todo.id, e.target.checked)}
                  />
                  <span className={todo.completed ? 'completed' : ''}>{todo.name}</span>
                  </label>
                  <button onClick={() => startEditingTodo(todo.id, todo.name)}>Edit</button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </>}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default App