import React, { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    fetchSignInMethodsForEmail,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification} from "firebase/auth";
import Swal from "sweetalert2";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { ref, uploadBytes } from "firebase/storage";
import userPic from '../Images/user.png'
import axios from "axios";
import { v4 as uuid } from "uuid";

const UserContext = createContext()

export const AuthContextProvider = ({children}) => {
    const port = "http://localhost:3001"
    axios.defaults.withCredentials = true
    const uniqueID = uuid();
    const userCollectionRef = collection(db, "Users")
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const createUser = (email, password, first_Name, last_Name, cpassword, profilepic) => {
            if(password != cpassword){
                Swal.fire({title: "Password Does not Match", icon: "error", confirmButtonColor: "#FF5600",});
            }else{
              const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
              const isValidEmail = email.endsWith("@bulsu.edu.ph")
              if(email){
              Swal.fire({
                title: 'Please wait',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen:async() => {
                  Swal.showLoading()
                  await axios.get(`${port}/lookEmail?email=${email}`).then(async(signInMethods) => {
                    if(signInMethods.data.length){
                      Swal.fire({title: "Existing Email", text: "The email has already been registered", icon: "error", showConfirmButton: false, timer: 2000, allowEscapeKey: false, allowOutsideClick: false})
                    } else if(password.length < 6){
                      Swal.fire({title: "Password is too short", text: "Password must be at least 6 characters", icon: "error", showConfirmButton: false, timer: 2000, allowEscapeKey: false, allowOutsideClick: false})
                    } else {
                      const formData = new FormData();
                      formData.append(`files`, profilepic)
                      formData.append(`email`, email)
                      formData.append(`password`, password)
                      formData.append(`full_Name`, first_Name + " " + last_Name)
                      formData.append(`file_Name`, profilepic.name)
                      try{
                        await axios.post(`${port}/register?uID=${uniqueID}`, formData, {
                          headers: {
                              'Content-Type': 'multipart/form-data',
                          },
                        }).then(async() => {
                          Swal.close()
                          await Swal.fire({title: "Successfully Registered. ", text: "Verification Link is sent to the email.", icon: "success", showConfirmButton: false, timer: 2000, allowEscapeKey: false, allowOutsideClick: false})
                          navigate('/pages/Login')
                        })   
                      }catch(e){

                      }
                      
                    }
                  })
                }})  
              }else{
                Swal.fire({text: "Only Bulsu Email is Accepted", confirmButtonColor: "#FF5600",});
              } 
            }
    }

    const [users, setUsers] = useState([]);
    useEffect(() => {
      const getUsers = async() => {
        try{
          await axios.get(`${port}/getUsers`).then((data) => {
            setUsers(data.data)
          })
        }catch(e){

        }
      }
      getUsers()
    }, [])

    const signin = (email, password) => {
          Swal.fire({
            title: 'Loggin In',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen:async() => {
              Swal.showLoading()
              try{
                // if(users.some(item => item.email == email) && users.find(item => item.email === email)?.signInMethod == undefined && users.some(item => item.tempPass == password)){
                //   const clerkEmail = users.find(item => item.email == email)?.id;
                //   await createUserWithEmailAndPassword(auth, email, password).then(async(userCredential) => {
                //     const docUpdate = doc(db, "Users", clerkEmail)
                //     console.log(true)
                //       const imageRef = ref(storage, `ProfilePics/${auth.currentUser.uid}`);
                //       await uploadBytes(imageRef, userPic);
                //       await updateDoc(docUpdate, {
                //         signInMethod: "Email",
                //         UID: auth.currentUser.uid
                //       })
                //       if(user.user.emailVerified){
                //         if(users.find(item => item.email === email)?.Active){
                //           navigate('/pages/Settings')
                //           Swal.fire({title: "Success", text: "Logged in successfully.", icon: "success", showConfirmButton: false, timer: 1500})
                //           }else{
                //             await auth.signOut()
                //             Swal.fire({confirmButtonColor: "#212121", text: "Account is Deactivated!"})
                //         }
                //       }else{
                //         await sendEmailVerification(user.user)
                //         Swal.fire({text: "Account not Verified. Check your email for Verification Link", confirmButtonColor: "#212121"})
                //       }
                      
                     
                //   }).catch((e) => {
                //     console.log(e.message);
                //   })
                // }else 
                if(users.some(item => item.email == email)){
                  const vals = {
                    email: email,
                    password: password
                  }
                  await axios.post(`${port}/login`, vals).then(async(data) => {
                    if(data.status == 200){
                      
                      if(data.data.success != false){
                        if (data.data[0].temporary == 1){
                          navigate('/pages/CompleteDetails')
                          Swal.fire({text: "Complete the account details to use the website.", icon: "success", confirmButtonColor: "#FF5600",showConfirmButton: true})
                        }
                        else if(data.data[0].verified == 1){
                          if(data.data[0].Active == 1){
                            navigate('/pages/Dashboard')
                            Swal.fire({title: "Success", text: "Logged in successfully.", icon: "success", showConfirmButton: false, timer: 1500})
                          }else{
                            Swal.fire({confirmButtonColor: "#212121", text: "Account is Deactivated!"})
                          }
                        }else{
                          Swal.fire({text: "Account not Verified. Check your email for Verification Link", confirmButtonColor: "#212121"})
                        }
                      }else if(data.data.success == false){
                        Swal.fire({text: "Wrong Email/Password", icon: "error", showConfirmButton: false, timer: 1500, allowEscapeKey: false, allowOutsideClick: false,})
                      }
                    } 
                  })
                }else{
                  Swal.fire({text: "User does not exist", icon: "error", showConfirmButton: false, timer: 1500, allowEscapeKey: false, allowOutsideClick: false,})
                }
                  
              }
              catch{

              }
            }})  
       
        
    }

    const provider = new GoogleAuthProvider();

    

    const googleSignIn = () => {
        signInWithPopup(auth, provider)
        .then(async (result) => {
            const username = result.user.displayName;
            const email = result.user.email;
            const profilePic = result.user.photoURL;
            const uid = result.user.uid

            const isValidEmail = email.endsWith("@bulsu.edu.ph")
            if(isValidEmail){
              if(!users.some(item => item.UID === uid)){
                await addDoc(userCollectionRef, 
                  {
                      full_Name: username,
                      UID: uid,
                      role: "Faculty",
                      email: email,
                      signInMethod: "Google",
                      profilePic: profilePic,
                      Active: true
                  })
                  console.log(users);
                  localStorage.setItem("username", username)
                  localStorage.setItem("email", email)
                  localStorage.setItem("profilePic", profilePic)
                  navigate('/pages/Dashboard')
                  Swal.fire({title: "Success", text: "Logged in successfully.", icon: "success", showConfirmButton: false, timer: 1500})
              }else{
                if(users.find(item => item.UID === uid)?.Active){
                  console.log(users);
                  localStorage.setItem("username", username)
                  localStorage.setItem("email", email)
                  localStorage.setItem("profilePic", profilePic)
                  navigate('/pages/Dashboard')
                  Swal.fire({title: "Success", text: "Logged in successfully.", icon: "success", showConfirmButton: false, timer: 1500})
                }
                else{
                  auth.signOut()
                  Swal.fire({confirmButtonColor: "#212121", text: "Account is Deactivated!"})
                }
              }
            }else{
                  auth.signOut()
                  Swal.fire({confirmButtonColor: "#212121", text: "Email must be a BulSU email"})
            }
              
        })
        .catch((error) => {
           
        })
    }

    const signout = () => {
        return signOut(auth)
    }

    const [userActive, setUSerActive] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
  
        })
        return() => {
            unsubscribe()
        }
    }, [])
    return(
        <UserContext.Provider value={{createUser, user, signout, signin, googleSignIn, users}}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return React.useContext(UserContext)
}