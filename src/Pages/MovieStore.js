
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import {useEffect, useState } from 'react';
import { getDocs ,collection, addDoc,deleteDoc,doc,updateDoc  } from 'firebase/firestore';
import {db, auth } from '../config/firebase';
import "./movies.css"


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
      title:  newMovieTitle, 
       releaseDate: newReleaseDate,
       receivedAnOscar: isNewMovieOscar,
       userId:auth?.currentUser?.uid});  
       navigate("/movielist")
      }catch(err){
        console.error(err)
      }
     }
    const serve=()=>{

      navigate("/options")
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
        <div className="movies-container">
      <div className="movies-container">
        <p>Movies Page Email:{auth.currentUser?.email} </p> 
      <input  className="input" placeholder='Movie title...'
      onChange={(e)=> setNewMovieTitle(e.target.value)}/>

      <input  className="input" placeholder='Release Date..'
       type='number'
        onChange={(e)=> setNewReleaseDate(Number(e.target.value))}/>

      <input type='checkbox'  className="checkbox"
       checked={isNewMovieOscar} onChange={(e)=> setisNewMovieOscare(e.target.checked)}/>
      <label>Recieved An Oscar</label>
      
       <button className="button" onClick={logout}>logout</button>
       <button className="button" onClick={serve}>Goods and services</button>
      <button className="button" onClick={onSubmitMoive}> SUBMIT MOVIE</button>
    </div>
   
      </div>
    )
    ;
    
}