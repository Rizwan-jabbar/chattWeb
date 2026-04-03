import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './rtk/store/store'
import { VoiceCallProvider } from './context/VoiceCallContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <BrowserRouter>
          <VoiceCallProvider>
            <App />
          </VoiceCallProvider>
        </BrowserRouter>
    </Provider>
  </StrictMode>,
)
