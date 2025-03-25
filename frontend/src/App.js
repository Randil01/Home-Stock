import { Route,Routes } from 'react-router-dom';
import AddRemind from "./component/reminds/addRemind";
import DisplayRemind from "./component/reminds/displayReminds";
import UpdateRemind from "./component/reminds/updateRemind"
import Navbar from "./component/navbar/navbar";


function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<DisplayRemind/>} />
          <Route path="/add" element={<AddRemind/>} />
          <Route path="/updateremind/:id" element={<UpdateRemind/>} />
      </Routes>
    </div>
  );
}

export default App;
