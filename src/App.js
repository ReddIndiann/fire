
import './App.css';
import { Auth } from './components/auth';
import { db,auth } from './config/firebase';
import {useEffect, useState } from 'react';
import { getDocs ,collection, addDoc,deleteDoc,doc,updateDoc  } from 'firebase/firestore';
import SignIn from './Pages/signInPage';
import SignUp from './Pages/SignUp';
import BuyBread from './Pages/BuyBread';
import MovieStore from './Pages/MovieStore';
import { BrowserRouter as Router, Route, Routes, Switch, Link, BrowserRouter } from 'react-router-dom';
import MovieDisplay from './Pages/movieDisplay';
import OptionsPage from './Pages/OptionsPage';
import ManageUsers from './Admin/ManageUsers';
import PurchaseProduct from './Pages/Products';
import SplashScreen from './Pages/SplashScreen';

function App() {
  
  return (
    <div className="App">

 

        
<Router>


<Routes>
  <Route path="/" element= {<SplashScreen/>}/>
  <Route path="/register" element= {<SignIn/>}/>
  <Route path="/movie" element={<MovieStore/>}/>
  <Route path="/movielist" element={<MovieDisplay/>}/>
   <Route path="/buybread" element={<BuyBread/>}/>
   <Route path="/options" element={<OptionsPage/>}/>
   <Route path="/users" element={<ManageUsers/>}/>
   <Route path="/products" element={<PurchaseProduct/>}/>
</Routes>
</Router>
    </div>
  );
}

export default App;
