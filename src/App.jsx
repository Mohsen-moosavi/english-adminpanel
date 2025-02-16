import { Toaster } from "react-hot-toast";
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import environment from "./constant/environment";
import { useSelector } from "react-redux";



function App() {

  const { userInfo} = useSelector(state=>state.userData)

  useEffect(()=>{

    const unloadHandler = ()=>{
      navigator.sendBeacon(`${environment.BASE_API_URL}/upload-cenceled?nicName=${userInfo?.id}`)
  }

  window.addEventListener('beforeunload',unloadHandler)

  return ()=>{window.removeEventListener('beforeunload',unloadHandler)}
  },[])

  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <Toaster
        position="bottom-left"
        reverseOrder={false}
        toastOptions={{
          duration: 7000,
        }}
      />
    </>
  )
}

export default App
