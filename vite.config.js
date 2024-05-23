import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/multivar-game/",
  server:{
    proxy:{
      '/socket.io':{
        target:"https://multivar-server.onrender.com/",
        ws:true
      }
    }
  }
})
