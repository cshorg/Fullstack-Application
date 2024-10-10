import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import queryClient from './config/queryClient.js'
import App from './App.jsx'
import theme from './theme/index.js'
import './index.css'

createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <ReactQueryDevtools position='bottom' initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>
  </ChakraProvider>
)
