import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to YN-Blog
          </h1>
          <p className="text-gray-600 mb-6">
            Your personal blog platform built with Vite + React + TypeScript
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Count is {count}
            </button>
            <p className="text-sm text-gray-500">
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
