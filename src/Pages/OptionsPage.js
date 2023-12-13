
import { useNavigate } from "react-router-dom";
import {useEffect, useState } from 'react';

import "./movies.css"
export default function OptionsPage(){

    const navigate =useNavigate();
    //New Movie State
const buybread=()=>{
    navigate("/buybread")
}
const buywater=()=>{
    navigate("/buybread")
}
    

    return(
        <div className="movies-container">
    
    
  
         <button className="button"  onClick={buybread}>Buy Bread</button>
       
         <button className="button"onClick={buywater}>update title</button>
   

      </div>);
}