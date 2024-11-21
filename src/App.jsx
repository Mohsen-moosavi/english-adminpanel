import { Toaster } from "react-hot-toast";
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";



function App() {

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
