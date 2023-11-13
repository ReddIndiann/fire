
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import {useEffect, useState } from 'react';
import { getDocs ,collection, addDoc,deleteDoc,doc,updateDoc  } from 'firebase/firestore';
import {db, auth } from '../config/firebase';

import { BrowserRouter as Router, Route, Routes, Switch, Link, BrowserRouter } from 'react-router-dom';


export default function MovieStore(){
    const [moviesList,setMoviesList] = useState([ ]);
    const navigate =useNavigate();
    //New Movie State
    const[newMovieTitle,setNewMovieTitle] = useState("")
    const[newReleaseDate,setNewReleaseDate] = useState("0")
    const[isNewMovieOscar,setisNewMovieOscare] = useState(false)
    //uptade title state
    const [updateTitle,setupdateTitle] = useState("");
    
      const moviesCollectionRef = collection(db ,"movies")
    
      
      const getMovieList =async ()=>{ 
        try{
        
              const data = await getDocs(moviesCollectionRef)
              const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id
              }))
             setMoviesList(filteredData)
        } catch(err){ 
          console.error(err)
        } 
            }
      const deleteMovie = async(id) => {
       const movieDoc = doc(db, "movies",id)
              await deleteDoc(movieDoc)
    
            }
            const updateMovieTitle = async(id) => {
              const movieDoc = doc(db, "movies",id)
                     await updateDoc(movieDoc,{title:updateTitle})
           
                   }
      useEffect((
        
      )=> {
     
        getMovieList( )
      },[]);
     const onSubmitMoive = async()=>{
      try{
    await addDoc(moviesCollectionRef, {
      title:                                    newMovieTitle, 
       releaseDate: newReleaseDate,
       receivedAnOscar: isNewMovieOscar,
       userId:auth?.currentUser?.uid});  
       getMovieList();
      }catch(err){
        console.error(err)
      }
     }
     
     const logout = async ()=>{
      
        try{await signOut(auth);
        navigate("/")
        }
        catch(err){
            console.error(err)
        }
            };

    return(
      <div>
       <div>
        <p>Movies Page </p> 
      <input placeholder='Movie title...' onChange={(e)=> setNewMovieTitle(e.target.value)}/>
      <input placeholder='Release Date..' type='number' onChange={(e)=> setNewReleaseDate(Number(e.target.value))}/>
      <input type='checkbox' checked={isNewMovieOscar} onChange={(e)=> setisNewMovieOscare(e.target.checked)}/>
      <label>Recieved An Oscar</label>
      
       <button onClick={logout}>logout</button>
      <button onClick={onSubmitMoive}> SUBMIT MOVIE</button>
    </div>
    <div>{moviesList.map((movies)=>(
      <div>
        <h1 style={{color: movies.receivedAnOscar ? "green" : "red"}}>{movies.title}</h1>
         <p>Date:{movies.releaseDate}</p>
         <button onClick={()=> deleteMovie(movies.id)}>Delete Movie</button>
         <input onChange={(e)=>setupdateTitle(e.target.value)}/>
         <button onClick={()=>updateMovieTitle(movies.id)}>update title</button>
      </div>
    ))}</div>
      </div>
    )
    ;
    
}