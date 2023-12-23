import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import noresult from '../Images/noresults.png'

export default function AccordionReport() {
  const [recentDel, setRecentDel] = useState([]);
  const [loader2, setloader2] = useState(true)
  const [emptyResult, setEmptyResult] = useState(false)
  const getRecentlyDeleted = async () => {
    const data = await getDocs(collection(db, "recently_deleted"));
    setRecentDel(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    if(data.docs.length > 0){
      setloader2(false)
    }
    else{
      setloader2(false)
      setEmptyResult(true)
    }
  };

  useEffect(() => {
    getRecentlyDeleted();
  }, []);

  const restoreDoc = async (id) => {
    const querySnapshot = await getDoc(doc(db, "recently_deleted", id));
    deleteApi(id, querySnapshot.data());
  };

  const deleteApi = async (id, data) => {
    const recentDoc = data.deleted_from == "archive" ? doc(collection(db, "archive")) : doc(collection(db, "documents"));
    await setDoc(recentDoc, data);
    await deleteDoc(doc(db, "recently_deleted", id));
    toast.success("File Restored")
    getRecentlyDeleted();
  };

  useEffect(() => {
    const deleteExpiredDocuments = async () => {
      const collectionRef = collection(db, 'recently_deleted');
      const snapshot = await getDocs(collectionRef);

      const dateToday = dayjs().toDate().toDateString();

      snapshot.forEach(async(docSnap) => {
        const deletedAt = docSnap.data().deleted_at;
        
        if (deletedAt >= dateToday) {
          const docRef = doc(db, 'recently_deleted', docSnap.id);
          await deleteDoc(docRef);
        }
      });
    };
    deleteExpiredDocuments();

    // Schedule the function to run periodically
    const checkInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const intervalId = setInterval(deleteExpiredDocuments, checkInterval);
    return () => clearInterval(intervalId);
  }, []);


  return (
    <div>
      <Toaster position="bottom-center"/>
        {recentDel.map((recentDel) => (
          <Accordion sx={{ marginBottom: "1vh", backgroundColor: "#E6E4F0" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{display: "flex", flexDirection: "row", alignItems: "center", color: "#666"}}><DeleteSweepIcon sx={{color: "#FF6347", marginRight: "2vh", transform: "scale(1.5)"}}/>{recentDel.document_Type + " (" + recentDel.Description + ")"}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ justifyContent: "flex-end" }}>
              <Typography sx={{color: "#888"}}>
                This document will be deleted on {recentDel.deleted_at}
              </Typography>
              <Button
                variant="contained"
                startIcon={<RestorePageIcon />}
                sx={{
                  backgroundColor: "#52E460",
                  "& ::hover": { backgroundColor: "#3fb44b" },
                }}
                onClick={(e) => restoreDoc(recentDel.id)}
              >
                Restore
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
        {loader2 ? (
          <div className="load-container2">
          <span className="loader"></span>
          </div>
        ) : ""}
        {emptyResult ? (
          <div className="nothing-holder2">
            <img className="noresult" src={noresult} />
            <div className="nothing">No Documents found</div>
          </div>
        ) : (
          ""
        )}
    </div>
  );
}
