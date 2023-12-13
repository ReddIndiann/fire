
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import {useEffect, useState } from 'react';
import { getDocs ,collection, addDoc,deleteDoc,doc,updateDoc  } from 'firebase/firestore';
import {db, auth } from '../config/firebase';
import "./movies.css"


export default function BuyBread(){
    const [moviesList,setMoviesList] = useState([ ]);
    const navigate =useNavigate();
    //New Movie State
    const[newBreadType,setNewBreadType] = useState("")
    const[newQantity,setNewQantity] = useState("0")
    const[newSize,setNewSize] = useState("")


    
    const [updateTitle,setupdateTitle] = useState("");
    
      const bakeryCollectionRef = collection(db ,"Backery")
    
      
      const getMovieList =async ()=>{ 
        try{
        
              const data = await getDocs(bakeryCollectionRef)
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
       const movieDoc = doc(db, "Backery",id)
              await deleteDoc(movieDoc)
    
            }
            const updateMovieTitle = async(id) => {
              const movieDoc = doc(db, "Backery",id)
                     await updateDoc(movieDoc,{title:updateTitle})
           
                   }
      useEffect((
        
      )=> {
     
        getMovieList( )
      },[]);
     const onSubmitMoive = async()=>{
      try{
    await addDoc(bakeryCollectionRef, {

        
        BreadType:  newBreadType, 
        Quantity: newQantity,
        Size: newSize,
       userId:auth?.currentUser?.uid,
       userEmail:auth.currentUser?.email
    });  
       navigate("/movielist")
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
            return (
                <div className="movies-container">
                  <div className="movies-container">
                    <p>Movies Page Email:{auth.currentUser?.email} </p>
                    <label>Select Bread Type:</label>
                    <select className="input" onChange={(e) => setNewBreadType(e.target.value)}>
                      <option value="white">White Bread</option>
                      <option value="whole-grain">Whole Grain Bread</option>
                      <option value="rye">Rye Bread</option>
                      {/* Add more options as needed */}
                    </select>
            
                    <label>Select Size:</label>
                    <select className="input" onChange={(e) => setNewSize(e.target.value)}>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      {/* Add more options as needed */}
                    </select>
            
                    <label>Enter Quantity:</label>
                    <input className="input" type='number' onChange={(e) => setNewQantity(e.target.value)} />
                    <button className="button" onClick={onSubmitMoive}>Submit Bread</button>
                  </div>
                </div>
              );
            }