
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import {useEffect, useState } from 'react';
import { getDocs ,collection, addDoc,deleteDoc,doc,updateDoc  } from 'firebase/firestore';
import {db, auth } from '../config/firebase';
import "./movies.css"
export default function MovieDisplay(){
    const [moviesList,setMoviesList] = useState([ ]);
    const navigate =useNavigate();
    //New Movie State

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
    
    <div  className="movie-list" >{moviesList.map((movies)=>(
     <div className="movie-card" key={movies.id}>
        <h1 style={{color: movies.receivedAnOscar ? "green" : "red"}}>{movies.title}</h1>
         <p>Date:{movies.releaseDate}</p>
         <button className="button delete-button"  onClick={()=> deleteMovie(movies.id)}>Delete Movie</button>
         <input className="input update-input" onChange={(e)=>setupdateTitle(e.target.value)}/>
         <button className="button update-button"onClick={()=>updateMovieTitle(movies.id)}>update title</button>
      </div>
    ))}</div>
      </div>);
}