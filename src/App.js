import HistoryPro from "history-pro"
import { HistoryProRouter, Route, Routes } from "react-router-history-pro"
import GalleryView from "./views/GalleryView/GalleryView";

const historyPro = new HistoryPro()

function App() {
  return (
    <div className="App">
      <HistoryProRouter history={historyPro}>
        <Routes>
          <Route path="/" element={<GalleryView />} />
          <Route path="/photo/:id" element={<GalleryView />} />
        </Routes>
      </HistoryProRouter>
    </div>
  )

}

export default App;
