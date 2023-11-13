
import './App.css';
import { Auth } from './components/auth';
import { db,auth } from './config/firebase';
import {useEffect, useState } from 'react';
import { getDocs ,collection, addDoc,deleteDoc,doc,updateDoc  } from 'firebase/firestore';
import SignIn from './Pages/signInPage';
import SignUp from './Pages/SignUp';
import MovieStore from './Pages/MovieStore';
import { BrowserRouter as Router, Route, Routes, Switch, Link, BrowserRouter } from 'react-router-dom';




function App() {
  
  return (
    <div className="App">

 

        
<Router>


<Routes>
  <Route path="/" element= {<SignUp/>}/>
  <Route path="/register" element= {<SignIn/>}/>
  <Route path="/movie" element={<MovieStore/>}/>
</Routes>
</Router>
    </div>
  );
}

export default App;
