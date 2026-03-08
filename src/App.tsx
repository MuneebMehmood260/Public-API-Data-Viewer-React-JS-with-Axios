import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// Type definitions for API response
interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: number
}

// DummyJSON API response wrapper
interface PostsResponse {
  posts: Post[]
}

function App() {
  // State management
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  // API URL - using DummyJSON as public API (returns real human-written content)
  const API_URL = 'https://dummyjson.com/posts'

  // useEffect for fetching data on component mount
  useEffect(() => {
    fetchPosts()
  }, [])

  // Function to fetch data using Axios
  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Axios GET request
      const response = await axios.get<PostsResponse>(API_URL, {
        timeout: 10000 // 10 second timeout
      })
      
      // Data display - DummyJSON returns posts in 'posts' property
      const postsData = response.data.posts;
      setPosts(postsData.slice(0, 10))
      setLoading(false)
    } catch (err) {
      // Error handling
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Server responded with error status
          setError(`Server Error: ${err.response.status} - ${err.response.statusText}`)
        } else if (err.request) {
          // Request made but no response
          setError('Network Error: No response from server. Please check your internet connection.')
        } else {
          // Error in request setup
          setError(`Request Error: ${err.message}`)
        }
      } else {
        setError('An unexpected error occurred')
      }
      setLoading(false)
    }
  }

  // Loading state component
  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    )
  }

  // Error state component
  if (error) {
    return (
      <div className="app-container">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={fetchPosts} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Data display
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📡 Public API Data Viewer</h1>
        <p>Fetching data from DummyJSON API using Axios</p>
      </header>

      <main className="posts-grid">
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-id">Post #{post.id}</div>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-body">{post.body}</p>
            <div className="post-meta">
              <span>User ID: {post.userId}</span>
            </div>
          </article>
        ))}
      </main>

      <footer className="app-footer">
        <p>Data fetched from: <a href={API_URL} target="_blank" rel="noopener noreferrer">DummyJSON API</a></p>
        <button onClick={fetchPosts} className="refresh-button">
          🔄 Refresh Data
        </button>
      </footer>
    </div>
  )
}

export default App

