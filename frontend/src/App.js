// import 'bootstrap/dist/css/bootstrap.min.css';
import { Route,Routes } from 'react-router-dom';
import AddRemind from "./component/reminds/addRemind";
import DisplayRemind from "./component/reminds/displayReminds";
import UpdateRemind from "./component/reminds/updateRemind";

//Import Budget
import AddBudget from "./component/budget/addBudget";
import BudgetReport from './component/budget/displayBudget';
//Inventroy 
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

          {/*New Route*/}
          <Route path="/addBudget" element={<AddBudget/>} />
          <Route path="/budgetDisplay" element={<BudgetReport/>} />
  
          <Route path="/invform" element={<InventoryForm/>} />
          <Route path="/invlist" element={<InventoryList/>} /> 
          <Route path="/invreport" element={<Report/>} /> 
      </Routes>
    </div>
  );
}

export default App;
