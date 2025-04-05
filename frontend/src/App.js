// import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import AddRemind from './component/reminds/addRemind';
import DisplayRemind from './component/reminds/displayReminds';
import UpdateRemind from './component/reminds/updateRemind';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './component/ProtectedRoute';
// Import Budget
import AddBudget from './component/budget/addBudget';
import BudgetReport from './component/budget/displayBudget';
// Inventory 
import InventoryForm from './component/grocery/InventoryForm';
import InventoryList from './component/grocery/InventoryList';
import Report from './component/grocery/Report';
import Home from './component/home/home';
//Asset
import AssetChart from './component/assets/AssetChart';
import AssetForm from './component/assets/AssetForm';
import AssetList from './component/assets/AssetList';


function App() {
  return (
    <div className="App">
      <Routes>
          {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path="/remind" element={<ProtectedRoute> <DisplayRemind /> </ProtectedRoute> } />
        <Route path="/add" element={ <ProtectedRoute><AddRemind /></ProtectedRoute> } />
        <Route path="/updateremind/:id" element={ <ProtectedRoute> <UpdateRemind /> </ProtectedRoute> } />
        <Route path="/addBudget" element={ <ProtectedRoute> <AddBudget /> </ProtectedRoute> } />
        <Route path="/budgetDisplay" element={ <ProtectedRoute>  <BudgetReport />  </ProtectedRoute>} />
        <Route path="/invform" element={ <ProtectedRoute>  <InventoryForm /> </ProtectedRoute> } />
        <Route path="/invlist" element={ <ProtectedRoute>  <InventoryList />   </ProtectedRoute> } />
        <Route path="/invreport" element={<ProtectedRoute>  <Report /> </ProtectedRoute>} />
                      
        <Route path="/assetChart" element={<AssetChart />} />
        <Route path="/assetForm" element={<AssetForm />} />
        <Route path="/assetList" element={<AssetList />} />                       
      </Routes>
    </div>
  );
}

export default App;
