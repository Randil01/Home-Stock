// import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import AddRemind from './component/reminds/addRemind';
import DisplayRemind from './component/reminds/displayReminds';
import UpdateRemind from './component/reminds/updateRemind';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

// Import Budget
import AddBudget from './component/budget/addBudget';
import BudgetReport from './component/budget/displayBudget';
// Inventory 
import InventoryForm from './component/InventoryForm';
import InventoryList from './component/InventoryList';
import Report from './component/Report';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DisplayRemind />
          </ProtectedRoute>
        } />
        <Route path="/add" element={
          <ProtectedRoute>
            <AddRemind />
          </ProtectedRoute>
        } />
        <Route path="/updateremind/:id" element={
          <ProtectedRoute>
            <UpdateRemind />
          </ProtectedRoute>
        } />
        <Route path="/addBudget" element={
          <ProtectedRoute>
            <AddBudget />
          </ProtectedRoute>
        } />
        <Route path="/budgetDisplay" element={
          <ProtectedRoute>
            <BudgetReport />
          </ProtectedRoute>
        } />
        <Route path="/invform" element={
          <ProtectedRoute>
            <InventoryForm />
          </ProtectedRoute>
        } />
        <Route path="/invlist" element={
          <ProtectedRoute>
            <InventoryList />
          </ProtectedRoute>
        } />
        <Route path="/invreport" element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
