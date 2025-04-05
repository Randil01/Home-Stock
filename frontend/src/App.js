import { Route,Routes } from 'react-router-dom';
import AddRemind from "./component/reminds/addRemind";
import DisplayRemind from "./component/reminds/displayReminds";
import UpdateRemind from "./component/reminds/updateRemind"
import Navbar from "./component/navbar/navbar";

//Asset
import AssetChart from './component/AssetChart';
import AssetForm from './component/AssetForm';
import AssetList from './component/AssetList';


function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<DisplayRemind/>} />
          <Route path="/add" element={<AddRemind/>} />
          <Route path="/updateremind/:id" element={<UpdateRemind/>} />

          {/*New Route*/}
        

         <Route path="/assetChart" element={<AssetChart />} />
          <Route path="/assetForm" element={<AssetForm />} />
          <Route path="/assetList" element={<AssetList />} />
      </Routes>
    </div>
  );
}

export default App;
