import { Routes, Route } from 'react-router-dom'

const Home = () => {
  return <div>Home</div>
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  )
}

export default App
