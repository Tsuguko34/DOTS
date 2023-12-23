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

const UserContext = createContext()

export const AuthContextProvider = ({children}) => {
    const userCollectionRef = collection(db, "Users")
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const createUser = (email, password, first_Name, last_Name, cpassword, profilepic) => {
            if(password != cpassword){
                Swal.fire({title: "Password Does not Match", icon: "error", confirmButtonColor: "#FF5600",});
            }else{
              const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
              const isValidEmail = email.endsWith("@bulsu.edu.ph")
              if(isValidEmail){
              Swal.fire({
                title: 'Please wait',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen:async() => {
                  Swal.showLoading()
                  await fetchSignInMethodsForEmail(auth, email).then(async(signInMethods) => {
                    if(signInMethods.length){
                      Swal.fire({title: "Existing Email", text: "The email has already been registered", icon: "error", showConfirmButton: false, timer: 2000, allowEscapeKey: false, allowOutsideClick: false})
                    } else if(password.length < 6){
                      Swal.fire({title: "Password is too short", text: "Password must be at least 6 characters", icon: "error", showConfirmButton: false, timer: 2000, allowEscapeKey: false, allowOutsideClick: false})
                    } else {
                      await createUserWithEmailAndPassword(auth, email, password).then(async(user) => {
                        const userCred = user.user
                        await sendEmailVerification(userCred)
                      })

                      const imageRef = ref(storage, `ProfilePics/${auth.currentUser.uid}`);
                      await uploadBytes(imageRef, profilepic);
                      await addDoc(userCollectionRef, 
                          {
                              full_Name: first_Name + " " + last_Name,
                              UID: auth.currentUser.uid,
                              role: "Faculty",
                              email: email,
                              signInMethod: "Email",
                              Active: true
                          })
                      
                      .then(async() => {
                        Swal.close()
                        await Swal.fire({title: "Successfully Registered. ", text: "Verification Link is sent to the email.", icon: "success", showConfirmButton: false, timer: 2000, allowEscapeKey: false, allowOutsideClick: false})
                        await signOut(auth);
                        navigate('/pages/Login')
                      })   
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
      const q = query(collection(db, "Users"))
        onSnapshot(q, async(data) => {
          setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
      }) 
      console.log(user);
    }, [])

    const signin = (email, password) => {
          Swal.fire({
            title: 'Loggin In',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen:async() => {
              Swal.showLoading()
              try{
                // if(users.some(item => item.email == email)?.signInMethod == "Google"){
                //   Swal.fire({text: "Account is already registered with sign in with Google", confirmButtonColor: "#212121"})
                // }
                if(users.some(item => item.email == email) && users.find(item => item.email === email)?.signInMethod == undefined && users.some(item => item.tempPass == password)){
                  const clerkEmail = users.find(item => item.email == email)?.id;
                  await createUserWithEmailAndPassword(auth, email, password).then(async(userCredential) => {
                    const docUpdate = doc(db, "Users", clerkEmail)
                    console.log(true)
                      const imageRef = ref(storage, `ProfilePics/${auth.currentUser.uid}`);
                      await uploadBytes(imageRef, userPic);
                      await updateDoc(docUpdate, {
                        signInMethod: "Email",
                        UID: auth.currentUser.uid
                      })
                      if(user.user.emailVerified){
                        if(users.find(item => item.email === email)?.Active){
                          navigate('/pages/Settings')
                          Swal.fire({title: "Success", text: "Logged in successfully.", icon: "success", showConfirmButton: false, timer: 1500})
                          }else{
                            await auth.signOut()
                            Swal.fire({confirmButtonColor: "#212121", text: "Account is Deactivated!"})
                        }
                      }else{
                        await sendEmailVerification(user.user)
                        Swal.fire({text: "Account not Verified. Check your email for Verification Link", confirmButtonColor: "#212121"})
                      }
                      
                     
                  }).catch((e) => {
                    console.log(e.message);
                  })
                }else if(users.some(item => item.email == email) && users.find(item => item.email === email)?.signInMethod != undefined){
                  console.log(false);
                  await fetchSignInMethodsForEmail(auth, email).then(async(signInMethods) => {
                    if(signInMethods.length){
                      await signInWithEmailAndPassword(auth, email, password)
                      .then(async(user) => {
                        if(user.user.emailVerified){
                          if(users.find(item => item.email === email)?.Active){
                            navigate('/pages/Dashboard')
                            Swal.fire({title: "Success", text: "Logged in successfully.", icon: "success", showConfirmButton: false, timer: 1500})
                            }else{
                              auth.signOut()
                              Swal.fire({confirmButtonColor: "#212121", text: "Account is Deactivated!"})
                            }
                        }else{
                          Swal.fire({text: "Account not Verified. Check your email for Verification Link", confirmButtonColor: "#212121"})
                          auth.signOut()
                        }
                          
                      }).catch((e) => {
                        if(e = 'auth/wrong-password'){
                        Swal.fire({text: "Wrong Password", icon: "error", showConfirmButton: false, timer: 1500, allowEscapeKey: false, allowOutsideClick: false,})
                        }
                      })                 
                    }
                  })
                }else if(users.some(item => item.email == email) && users.find(item => item.email === email)?.signInMethod == undefined && users.some(item => item.tempPass != password)){
                    Swal.fire({text: "Wrong Password", icon: "error", showConfirmButton: false, timer: 1500, allowEscapeKey: false, allowOutsideClick: false,})
                }
                else{
                  Swal.fire({title: "Email does not exist", text: "The email has not yet been registered", icon: "error", showConfirmButton: false, timer: 2000, allowEscapeKey: false, allowOutsideClick: false})
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