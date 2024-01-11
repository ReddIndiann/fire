
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import {useEffect, useState } from 'react';
import { getDocs ,collection,deleteDoc,doc,updateDoc  } from 'firebase/firestore';
import {db, auth } from '../config/firebase';
 
export default function ManageUsers(){
    const [userList,setUserList] = useState([ ]);
    const navigate =useNavigate();
    //New Movie State

    //uptade title state
    const [updateTitle,setupdateTitle] = useState("");
    
      const userCollectionRef = collection(db ,"users")
    
      
      const getUserList =async ()=>{ 
        try{
        
              const data = await getDocs(userCollectionRef)
              const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id
              }))
             setUserList(filteredData)
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
     
        getUserList( )
      },[]);
 
     
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
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Role</th>
                        <th>Email</th>
                        
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.role}</td>
                          <td>{user.email}</td>
                          
                          <td>
                            <button onClick>Delete</button>
                            <button onClick>Update Title</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }