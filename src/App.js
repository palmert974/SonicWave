import { Routes, Route } from "react-router-dom";
import Hero from "./components/Hero/Hero";
import Game from "./pages/Game";
import "./App.scss";


function App() {
  return (
    <main>
      <Routes>
        <Route path='/' element={<Hero />} />
        <Route path='/sonicwave' element={<Game />} />
      </Routes>
    </main>
  );
}

export default App;
