import React from 'react'
import ReactDOM from 'react-dom/client'
import PickleballScheduler from '../sports-scheduler.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PickleballScheduler />
  </React.StrictMode>,
)