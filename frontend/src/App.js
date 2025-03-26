// import 'bootstrap/dist/css/bootstrap.min.css';
import { Route,Routes } from 'react-router-dom';
import AddRemind from "./component/reminds/addRemind";
import DisplayRemind from "./component/reminds/displayReminds";
import UpdateRemind from "./component/reminds/updateRemind";

import InventoryForm from './components/InventoryForm';
import InventoryList from './components/InventoryList';
import Report from './components/Report';

import InventoryForm from './component/InventoryForm';
import InventoryList from './component/InventoryList';
import Report from './component/Report';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<DisplayRemind/>} />
          <Route path="/add" element={<AddRemind/>} />
          <Route path="/updateremind/:id" element={<UpdateRemind/>} /> 
  
          <Route path="/invform" element={<InventoryForm/>} />
          <Route path="/invlist" element={<InventoryList/>} /> 
          <Route path="/invreport" element={<Report/>} /> 

          <Route path="/invform" element={<InventoryForm/>} />
          <Route path="/invlist" element={<InventoryList/>} /> 
          <Route path="/invreport" element={<Report/>} /> 
      </Routes>
    </div>
  );
}

export default App;
