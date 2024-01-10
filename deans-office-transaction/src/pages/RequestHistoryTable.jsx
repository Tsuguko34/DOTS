import { useEffect, useState, useRef } from "react";
import "./Pages.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import pdfIcon from '../Images/pdf.png'
import { auth, db, firestore, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getDownloadURL, getMetadata, listAll, ref, uploadBytes } from "firebase/storage";
import { ComponentToPrint } from "./Printing";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import noresult from "../Images/noresults.png";
import {
    Autocomplete,
  Badge,
  Checkbox,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  ImageList,
  ImageListItem,
  InputAdornment,
  InputLabel,
  Menu,
  Tab,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import FilterListIcon from "@mui/icons-material/FilterList";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import letter from "../Images/letter.png";
import ReactToPrint from "react-to-print";
import dayjs from "dayjs";
import TurnRightTwoToneIcon from '@mui/icons-material/TurnRightTwoTone';
import { LocalizationProvider,  DatePicker, TimePicker } from "@mui/x-date-pickers";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import toast, { Toaster } from "react-hot-toast";
import SearchIcon from '@mui/icons-material/Search';
import ArchiveIcon from '@mui/icons-material/Archive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check'
import ShortcutIcon from '@mui/icons-material/Shortcut';
import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css';
import DocViewer, { DocViewerRenderers }  from "@cyntler/react-doc-viewer";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { BitlyClient } from "bitly";
import { CloudDownload } from "@mui/icons-material";
import docxViewIcon from '../Images/docxView.png'
import xlsxViewIcon from '../Images/xlsxView.png'
import axios from "axios";
import JSZip from "jszip";

export default function StickyHeadTable() {
  const port = "http://localhost:3001"
  axios.defaults.withCredentials = true
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });
  //INPUT
  const newPlugin = defaultLayoutPlugin();
  const pagePlugin = pageNavigationPlugin();
  //INPUTS
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [sumbmit, setSumbmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emptyResult, setEmptyResult] = useState(false);

  const [newDateReceived, setNewDateReceived] = useState("");
  const [newDocumentName, setNewDocumentName] = useState("")
  const [newComment, setNewComment] = useState("")
  const [newSched_Date, setNewSched_Date] = useState("")
  const [newSched, setNewSched] = useState("")
  const [newForwardTo, setNewForwardTo] = useState("")
  const [newTimeReceived, setNewTimeReceived] = useState("");
  const [newReceivedBy, setNewReceivedBy] = useState("");
  const [newFromDep, setNewFromDep] = useState("");
  const [newFromPer, setNewFromPer] = useState("");
  const [newType, setNewType] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newRE, setNewRE] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTransmitted, setNewTransmitted] = useState("");
  const [newStatus, setNewStatus] = useState("Pending");
  const uniqueID = uuid();
  const componentRef = useRef();
  const [imageUpload, setImageUpload] = useState();

  const incomingCollectionRef = collection(db, "documents");
  const logcollectionRef = collection(db, "logs");
  const [userInfo, setUserInfo] = useState([]);
  const [userHolder, setuserHolder] = useState(null);
  const [openRows, setOpenRows] = useState({})
  const [categoryPick, setCategoryPick] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    setCategory(categoryPick)
  },[categoryPick])

  const handleClickOpen = () => {
    setNewDateReceived(dayjs())
    setNewTimeReceived(dayjs())
    setOpenAdd(true);
  };

  const handleClose = () => {
    setCategory("")
    setImageDis([]);
    setOpenAdd(false);
  };

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setImageDis([]);
    setEditImageHolder([]);
    setOpenEdit(false);
  };

  const createIncoming = async (e) => {
    if (imageUpload == null) return;
    e.preventDefault();
    setSumbmit(true);
    for (let i = 0; i < imageUpload.length; i++) {
      const imageRef = ref(
        storage,
        `DocumentsPic/${uniqueID}/${imageUpload[i].name}`
      );
      uploadBytes(imageRef, imageUpload[i]);
    }
    if(category == "Student Document"){
        await addDoc(incomingCollectionRef, {
            document_Name: newDocumentName,
            fromPer: newFromPer,
            received_By: newReceivedBy,
            document_Type: category,
            date_Received: formatDate(newDateReceived),
            time_Received: formatTime(newTimeReceived),
            uID: uniqueID,
            Status: newStatus,
            Type: newType,
            Description: newDescription,
            Comment: newComment,
            forward_To: newForwardTo,
            Remark: "",
            deleted_at: "",
          });
    }
    else if (category == "Faculty Document"){
        await addDoc(incomingCollectionRef, {
            document_Name: newDocumentName,
            fromPer: newFromPer,
            fromDep: newFromDep,
            received_By: newReceivedBy,
            document_Type: category,
            date_Received: formatDate(newDateReceived),
            time_Received: formatTime(newTimeReceived),
            uID: uniqueID,
            Status: newStatus,
            Type: newType,
            Description: newDescription,
            Comment: newComment,
            forward_To: newForwardTo,
            Remark: "",
            deleted_at: "",
          });
    }
    else if (category == "New Hire Document"){
        await addDoc(incomingCollectionRef, {
            document_Name: newDocumentName,
            fromPer: newFromPer,
            fromDep: newFromDep,
            received_By: newReceivedBy,
            document_Type: category,
            date_Received: formatDate(newDateReceived),
            time_Received: formatTime(newTimeReceived),
            uID: uniqueID,
            Status: newStatus,
            Type: newType,
            Description: newDescription,
            Comment: newComment,
            forward_To: newForwardTo,
            Remark: "",
            deleted_at: "",
          });
    }
    else if (category == "IPCR/OPCR"){
        await addDoc(incomingCollectionRef, {
            document_Name: newDocumentName,
            fromPer: newFromPer,
            fromDep: newFromDep,
            received_By: newReceivedBy,
            document_Type: category,
            date_Received: formatDate(newDateReceived),
            time_Received: formatTime(newTimeReceived),
            uID: uniqueID,
            Status: newStatus,
            Type: newType,
            Description: newDescription,
            Comment: newComment,
            forward_To: newForwardTo,
            Remark: "",
            deleted_at: "",
          });
    }
    else if (category == "Travel Order"){
        await addDoc(incomingCollectionRef, {
            document_Name: newDocumentName,
            fromPer: newFromPer,
            fromDep: newFromDep,
            received_By: newReceivedBy,
            document_Type: category,
            date_Received: formatDate(newDateReceived),
            time_Received: formatTime(newTimeReceived),
            uID: uniqueID,
            Status: newStatus,
            Description: newDescription,
            Comment: newComment,
            forward_To: newForwardTo,
            Remark: "",
            deleted_at: "",
          });
    }
    else if (category == "Meeting Request"){
        await addDoc(incomingCollectionRef, {
            document_Name: newDocumentName,
            fromPer: newFromPer,
            fromDep: newFromDep,
            received_By: newReceivedBy,
            document_Type: category,
            date_Received: formatDate(newDateReceived),
            time_Received: formatTime(newTimeReceived),
            uID: uniqueID,
            Status: newStatus,
            Sched: newSched,
            Sched_Date: formatDate(newSched_Date),
            Description: newDescription,
            Comment: newComment,
            forward_To: newForwardTo,
            Remark: "",
            deleted_at: "",
          });
    }
    else {
      await addDoc(incomingCollectionRef, {
        document_Name: newDocumentName,
        fromPer: newFromPer,
        fromDep: newFromDep,
        received_By: newReceivedBy,
        document_Type: category,
        date_Received: formatDate(newDateReceived),
        time_Received: formatTime(newTimeReceived),
        uID: uniqueID,
        Status: newStatus,
        Type: newType,
        Description: newDescription,
        Comment: newComment,
        forward_To: newForwardTo,
        Remark: "",
        deleted_at: "",
      });
    }
    setNewDateReceived("")
    setNewDocumentName("")
    setNewComment("")
    setNewSched_Date("")
    setNewSched("")
    setNewForwardTo("")
    setNewTimeReceived("")
    setNewReceivedBy("")
    setNewFromDep("")
    setNewFromPer("")
    setNewType("")
    setNewDescription("")
    setNewStatus("Pending")
    setImageUpload("")
    handleClose();
    getSignInMethods("add");
    setEmptyResult(false);
    setSumbmit(false);
    getIncoming();
    setCategory("")
    toast.success("Successfully uploaded a file.")
  };

  const formatDate = (date) => {
    return dayjs(date).format('MM/DD/YYYY');
  };

  const formatTime = (date) => {
    return dayjs(date).format('h:mm A');
  };
  //

  const [userUID, setUserUID] = useState("")
  const getUserInfo = async (type) => {
    const { uid } = auth.currentUser;
    if (!uid) return;
    const userRef = collection(db, "Users");
    const q = query(userRef, where("UID", "==", uid));
    const data = await getDocs(q);
    setUserInfo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    if (type == "add") {
      await addDoc(logcollectionRef, {
        date: dayjs().format("MMM D, YYYY h:mm A").toString(),
        log: data.docs.map((doc) => doc.data().full_Name) + ` added a ${category}`,
      });
    } else if (type == "edit") {
      await addDoc(logcollectionRef, {
        date: dayjs().format("MMM D, YYYY h:mm A").toString(),
        log: data.docs.map((doc) => doc.data().full_Name)  + ` edited a ${editDocType}`,
      });
    } else if (type == "delete") {
      await addDoc(logcollectionRef, {
        date: dayjs().format("MMM D, YYYY h:mm A").toString(),
        log: data.docs.map((doc) => doc.data().full_Name)  + " deleted a student document",
      });
    } else if (type == "archive") {
      await addDoc(logcollectionRef, {
        date: dayjs().format("MMM D, YYYY h:mm A").toString(),
        log: data.docs.map((doc) => doc.data().full_Name)  + " archived a student document",
      });
    }
  };

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  useEffect(() => {
    const getUser = async() => {
      try{
        await axios.get(`${port}/getUser`).then(async(data) => {
          if(data.status == 200){
            setUser(data.data[0])
            const requests = await axios.get(`${port}/requests`)
            const updatedData = requests.data
            if(updatedData.success == false){
              toast.error("There was an error while retrieving the documents")
            }else{
              setRows(updatedData.filter((item) => item.forwarded_By === data.data[0].uID || item.accepted_Rejected_By === data.data[0].uID || data.data[0].full_Name.includes(item.fromPer)))
              setLoading(false);
              if (updatedData.filter((item) => item.forwarded_By === data.data[0].uID || item.accepted_Rejected_By === data.data[0].uID || data.data[0].full_Name.includes(item.fromPer)).length == 0) {
              setEmptyResult(true);
              }else{
                setEmptyResult(false);
              }
            }
          }
        })
        await axios.get(`${port}/getUsers`).then((data) => {
          setUsers(data.data)
        })
      }catch(e){
        console.log(e);
      }
    }
    getUser()
  }, []);


  // useEffect(() => {
  //   const getRequests = async() => {
      
  //   }
  //   getRequests() 
  // }, [users])

  const getSignInMethods = async (type) => {
    if (userHolder) {
      const signInMethods = userHolder.providerData.map(
        (provider) => provider.providerId
      );
      if (signInMethods.includes("google.com")) {
        if (type == "add") {
          await addDoc(logcollectionRef, {
            date: dayjs().format("MMM D, YYYY h:mm A").toString(),
            log: auth.currentUser.displayName + ` added a ${category}`,
          });
        } else if (type == "edit") {
          await addDoc(logcollectionRef, {
            date: dayjs().format("MMM D, YYYY h:mm A").toString(),
            log: auth.currentUser.displayName + ` edited a ${editDocType}`,
          });
        } else if (type == "delete") {
          await addDoc(logcollectionRef, {
            date: dayjs().format("MMM D, YYYY h:mm A").toString(),
            log: auth.currentUser.displayName + " deleted a student document",
          });
        } else if (type == "archive") {
          await addDoc(logcollectionRef, {
            date: dayjs().format("MMM D, YYYY h:mm A").toString(),
            log:
              auth.currentUser.displayName + " archived a student document",
          });
        }
      } else if (signInMethods.includes("password")) {
       
        getUserInfo(type);
      }
    }
    return null;
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getIncoming();
  }, [page]);

  const getIncoming = async () => {
    // const q = query(
    //   incomingCollectionRef, where("Status", "==", "Pending", orderBy("desc"))
    // );
    // const data = await getDocs(q);
    // setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id, dateTime: new Date(doc.data().date_Received)})));
    // setLoading(false);
    // if (data.docs.length == 0) {
    //   setEmptyResult(true);
    // }
  };

  useEffect(() =>{
    
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteIncoming = (id) => {
    Swal.fire({
      title: "Archive?",
      text: "The document will be added to the archives.",
      icon: "info",
      iconColor: "#FF5600",
      showCancelButton: true,
      confirmButtonColor: "#FF5600",
      cancelButtonColor: "#888",
      confirmButtonText: "Archive doc",
      focusConfirm: true,
    }).then(async (result) => {
    if(result.isConfirmed) {
        const querySnapshot = await getDoc(doc(db, "documents", id));
        archiveFile(id, querySnapshot.data());
      }
    });
  };

  const archiveFile = async (id, data) => {
    const recentDoc = doc(collection(db, "archive"));
    await setDoc(recentDoc, data);
    await deleteDoc(doc(db, "documents", id));
    getSignInMethods("archive");
    toast.success("File has been archived")
    getIncoming();
  };

  const [openShowFile, setOpenShowFile] = useState(false);
  const [displayFile, setDisplayFile] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [filePDF, setFilePDF] = useState([]);
  const [fileDocx, setFileDocx] = useState([]);
  const [fileXlsx, setFileXlsx] = useState([]);
  const [currentPDF, setCurrentPDF] = useState([])
  const [tabValue, setTabValue] = useState('1');
  const [loading3, setLoading3] = useState(true);
  const openFile = (id) => {
    setLoading3(true)
    setOpenShowFile(true);
    showFile(id);
  };
  const showFile = async (id) => {
    const imageListRef = await axios.get(`${port}/getFile?id=${id}`);
    const data = await axios.get(`${port}/openFile?id=${id}`);
    setDisplayFile(data.data);
    imageListRef.data.forEach((item) => {
        if(item.file_Name.includes('.png') || item.file_Name.includes('.jpg') || item.file_Name.includes('.jpeg')){
            setImageList((prev) => [...prev, item.file_Name]);
        }
        else if (item.file_Name.includes('.pdf')){
            setFilePDF((prev) => [...prev, item]);
        }
        else if (item.file_Name.includes('.docx') || item.file_Name.includes('.doc')){
            setFileDocx((prev) => [...prev, item]);
        }
        else if (item.file_Name.includes('.xlsx')){
            setFileXlsx((prev) => [...prev, item]);
        }
    });
    setLoading2(false);
   
  };

  const handlePDFChange = (event, newValue) => {
    setCurrentPDF(newValue);
  };
  useEffect(() => {
    setCurrentPDF(filePDF[0])
  }, [filePDF])

  useEffect(() => {
    setTabValue(imageList.length != 0 ? '1' : (imageList.length == 0 && filePDF.length != 0) ? '2' : (imageList.length == 0 && filePDF.length == 0 && fileDocx.length != 0) ? '3' : (imageList.length == 0 && filePDF.length == 0 && fileDocx.length == 0 && fileXlsx.length != 0) && '4')
  }, [filePDF, imageList, fileDocx, fileXlsx])

  const closeFile = async () => {
    await setOpenShowFile(false);
    setLoading2(true);
    setDisplayFile([]);
    setImageList([]);
    setFilePDF([]);
    setFileDocx([]);
    setFileXlsx([]);
  };

  
  const [openFilter, setOpenFilter] = useState(false);
  const [uniqueValuesArray, setUniqueValuesArray] = useState([]);
  const [years, setYears] = useState([]);
  const [from, setFrom] = useState([]);
  const filterOpen = async () => {
    const fetchData = async () => {
      const myCollectionRef = collection(db, "documents");
      const myQuery = query(myCollectionRef, where("Status", "==", "Completed"));

      const querySnapshot = await getDocs(myQuery);
      const uniqueValues = new Set();
      const yearsDataArray = new Set();
      const fromDataArray = new Set();

      querySnapshot.forEach((doc) => {
        const fieldValue = doc.data().Type != undefined ? doc.data().Type : doc.data().document_Type;
        uniqueValues.add(fieldValue);
        const dateObject = new Date(doc.data().date_Received);
        yearsDataArray.add(dateObject.getFullYear());
        const fromObject = doc.data().document_Type;
        fromDataArray.add(fromObject);
      });
      const uniqueValuesArray = Array.from(uniqueValues);
      const yearsArray = Array.from(yearsDataArray);
      const fromArray = Array.from(fromDataArray);
      setYears(yearsArray);
      setFrom(fromArray);
      setUniqueValuesArray(uniqueValuesArray);
    };
    await fetchData();
    setOpenFilter(true);
  };

  const filterClose = () => {
    setOpenFilter(false);
  };

  const [formID, setFormID] = useState("");
  const [editDateReceived, setEditDateReceived] = useState("");
  const [editTimeReceived, setEditTimeReceived] = useState("");
  const [editReceivedBy, setEditReceivedBy] = useState("");
  const [editFromDep, setEditFromDep] = useState("");
  const [editFromPer, setEditFromPer] = useState("");
  const [editType, setEditType] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRE, setEditRE] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTransmitted, setEditTransmitted] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editDocType, setEditDocType] = useState("");
  const [editDocName, setEditDocName] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editSched_Date, setEditSched_Date] = useState("");
  const [editSched, setEditSched] = useState("");
  const [editImageHolder, setEditImageHolder] = useState([]);
  const editIncoming = (
    id,
    dateRecieved,
    timeReceived,
    receivedBy,
    fromDep,
    fromPer,
    type,
    date,
    status,
    uID,
    remark,
    description,
    docuName,
    category,
    comment,
    sched_Date,
    meeting_Details
  ) => {
    const imageListRef = ref(storage, `DocumentsPic/${uID}/`);
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setEditImageHolder((prev) => [...prev, url]);
        });
      });
    });
    const data = {
      id: id,
      fromDep: fromDep,
      fromPer: fromPer,
      received_By: receivedBy,
      document_Type: category,
      date_Received: dateRecieved,
      time_Received: timeReceived,
      uID: uID,
      Status: status,
      Type: type,
      Description: description,
      Sched_Date: sched_Date,
      Sched: meeting_Details,
      Comment: comment,
      Remark: "",
      deleted_at: "",
      document_Name: docuName,
    };
    setFormID(data);
    handleEditOpen();
  };

  const formatDateBack = (date) => {
    return dayjs(date);
  };

  const formatTimeBack = (date) => {
    return dayjs(date, "hh:mm A");
  };
  useEffect(() => {
    setEditDateReceived(formatDateBack(formID.date_Received))
    setEditTimeReceived(formatTimeBack(formID.time_Received))
    setEditReceivedBy(formID.received_By)
    setEditFromDep(formID.fromDep)
    setEditFromPer(formID.fromPer)
    setEditType(formID.Type)
    setEditDescription(formID.Description)
    setEditDate(formatDateBack(formID.Date))
    setEditStatus(formID.Status)
    setEditDocType(formID.document_Type)
    setEditDocName(formID.document_Name)
    setEditComment(formID.Comment)
    setEditSched_Date(formatDateBack(formID.Sched_Date))
    setEditSched(formID.Sched)
  }, [formID]);

  const updateIncoming = async (e) => {
    e.preventDefault();
    setSumbmit(true);
    const editDoc = doc(db, "documents", formID.id);
    const editFields = {
        document_Name: editDocName,
        fromPer: editFromPer,
        received_By: editReceivedBy,
        date_Received: formatDate(editDateReceived),
        time_Received: formatTime(editTimeReceived),
        Status: editStatus,
        Type: editType,
        Description: editDescription,
        Comment: editComment,
    };
    const editFields2 = {
        document_Name: editDocName,
        fromDep: editFromDep,
        fromPer: editFromPer,
        received_By: editReceivedBy,
        date_Received: formatDate(editDateReceived),
        time_Received: formatTime(editTimeReceived),
        Status: editStatus,
        Type: editType,
        Description: editDescription,
        Comment: editComment,
      };
      const editFields3 = {
        document_Name: editDocName,
        fromDep: editFromDep,
        fromPer: editFromPer,
        received_By: editReceivedBy,
        date_Received: formatDate(editDateReceived),
        time_Received: formatTime(editTimeReceived),
        Status: editStatus,
        Type: editType,
        Description: editDescription,
        Comment: editComment,
      };
      const editFields4 = {
        document_Name: editDocName,
        fromDep: editFromDep,
        fromPer: editFromPer,
        received_By: editReceivedBy,
        date_Received: formatDate(editDateReceived),
        time_Received: formatTime(editTimeReceived),
        Status: editStatus,
        Type: editType,
        Description: editDescription,
        Comment: editComment,
      };
      const editFields5 = {
        document_Name: editDocName,
        fromDep: editFromDep,
        fromPer: editFromPer,
        received_By: editReceivedBy,
        date_Received: formatDate(editDateReceived),
        time_Received: formatTime(editTimeReceived),
        Status: editStatus,
        Description: editDescription,
        Comment: editComment,
      };
      const editFields6 = {
        document_Name: editDocName,
        fromDep: editFromDep,
        fromPer: editFromPer,
        received_By: editReceivedBy,
        date_Received: formatDate(editDateReceived),
        time_Received: formatTime(editTimeReceived),
        Status: editStatus,
        Description: editDescription,
        Sched_Date: formatDate(editSched_Date),
        Sched: editSched,
        Comment: editComment,
      };
    if (imageUpload.length == 0) {
        if(editDocType == "Student Document"){
            await updateDoc(editDoc, editFields);
        }
        else if(editDocType == "Faculty Document"){
            await updateDoc(editDoc, editFields2);
        }
        else if(editDocType == "New Hire Document"){
            await updateDoc(editDoc, editFields3);
        }
        else if(editDocType == "IPCR/OPCR"){
            await updateDoc(editDoc, editFields4);
        }
        else if(editDocType == "Travel Order"){
            await updateDoc(editDoc, editFields5);
        }
        else if(editDocType == "Meeting Request"){
            await updateDoc(editDoc, editFields6);
        }
      
      setSumbmit(false);
    } else if (imageUpload.length != 0) {
      await updateDoc(editDoc, editFields);
      for (let i = 0; i < imageUpload.length; i++) {
        const imageRef = ref(
          storage,
          `DocumentsPic/${formID.uID}/${imageUpload[i].name}`
        );
        uploadBytes(imageRef, imageUpload[i]);
      }
      setSumbmit(false);
    }

    getSignInMethods("edit");
    getIncoming();
    handleEditClose();
    toast.success("Successfully Edited.")
  };

  const [imageDis, setImageDis] = useState([]);
  const onImageChange = (event) => {
    setImageDis([]);
    setImageUpload();
    setImageUpload(event.target.files);
    if (event.target.files) {
      const fileArray = Array.from(event.target.files).map((file) =>
        URL.createObjectURL(file)
      );

      setImageDis((prevImages) => prevImages.concat(fileArray));
      Array.from(event.target.files).map((file) => URL.revokeObjectURL(file));
    }
  };


  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filter2, setFilter2] = useState("");
  const [filter3, setFilter3] = useState("");
  const [filter4, setFilter4] = useState(false);
  const [filter5, setFilter5] = useState(false);
  const [filter6, setFilter6] = useState(false);
  const [filter7, setFilter7] = useState("");
  const [filter8, setFilter8] = useState("");
  const [filter9, setFilter9] = useState("");
  const [filter10, setFilter10] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredOptionsName, setFilteredOptionsName] = useState([]);
  const [filteredOptionsDocType, setFilteredOptionsDocType] = useState([]);
  const [filteredOptionsReceive, setFilteredOptionsReceive] = useState([]);
  const [filteredOptionsfromDep, setFilteredOptionsfromDep] = useState([]);
  const [filteredOptionsDateReceived, setFilteredOptionsDateReceived] = useState([]);
  const [filteredOptionsStatus, setFilteredOptionsStatus] = useState([]);
  useEffect(() => {
    const filteredOptionName = new Set()
    const filteredOptionDocType = new Set()
    const filteredOptionReceive = new Set()
    const filteredOptionfromDep = new Set()
    const filteredOptionDate = new Set()
    const filteredOptionStatus = new Set()
    const filtered = rows.filter((item) =>
      item.received_By.toLowerCase().includes(search.toLowerCase())||
      item.fromPer.toLowerCase().includes(search.toLowerCase()) ||
      item.document_Name.toLowerCase().includes(search.toLowerCase()) || 
      item.Description.toLowerCase().includes(search.toLowerCase()) || 
      item.Comment.toLowerCase().includes(search.toLowerCase())
    ).filter((item) =>
        item.document_Name == undefined ? item.document_Name.toLowerCase().includes(filter.toLowerCase()) : item.document_Name.toLowerCase().includes(filter.toLowerCase())
    ).filter((item) =>
        item.fromDep == undefined ? item.fromPer.toLowerCase().includes(filter9.toLowerCase()) :  item.fromDep.toLowerCase().includes(filter9.toLowerCase())
    ).filter((item) =>
        item.Type == undefined ? item.document_Type.toLowerCase().includes(filter8.toLowerCase()) : item.Type.toLowerCase().includes(filter8.toLowerCase())
    ).filter((item) => 
      item.received_By.toLowerCase().includes(filter2.toString().toLowerCase())
    ).filter((item) => 
      filter10 == "" || filter10 == null? item.date_Received.includes("") : item.date_Received.includes(dayjs(filter10).format('MM/DD/YYYY').toString())
    ).filter((item) =>
      filter3 != "" ? item.Status.toLowerCase() === filter3.toLowerCase(): item.Status.toLowerCase().includes("")
    ).filter((item) =>
      filter4 == true ? (new Date(item.date_Received).getFullYear()).toString().includes(dayjs().year().toString()) : (new Date(item.date_Received).getFullYear()).toString().includes("")
    ).filter((item) =>
      filter5 == true ? (new Date(item.date_Received).getMonth()).toString().includes(dayjs().month().toString()) : (new Date(item.date_Received).getMonth()).toString().includes("")
    ).filter((item) =>
      filter6 == true ? (new Date(item.date_Received).getDay()).toString().includes(dayjs().day().toString()) : (new Date(item.date_Received).getDay()).toString().includes("")
    )

  filtered.forEach(doc => {
      filteredOptionName.add(doc.document_Name)
      filteredOptionDocType.add(doc.Type == undefined ? doc.document_Type : doc.Type)
      filteredOptionReceive.add(doc.received_By)
      filteredOptionStatus.add(doc.Status)
      filteredOptionfromDep.add(doc.fromDep == undefined ? doc.fromPer : doc.fromDep)
      const [timePart, ampm] = doc.time_Received.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (ampm === 'PM' && hours !== 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }
      doc.time = new Date();
      doc.time.setHours(hours);
      doc.time.setMinutes(minutes);
   })

   const timeFiltered = filtered.sort((a, b) => b.time - a.time)

   timeFiltered.sort((a, b) => {
    if (new Date(b.date_Received).getFullYear() !== new Date(a.date_Received).getFullYear()) {
      return new Date(b.date_Received).getFullYear() - new Date(a.date_Received).getFullYear();
    } else if (new Date(b.date_Received).getMonth() !== new Date(a.date_Received).getMonth()) {
      return new Date(b.date_Received).getMonth() - new Date(a.date_Received).getMonth();
    } else {
      return new Date(b.date_Received).getDate() - new Date(a.date_Received).getDate();
    }
 })

    setFilteredOptionsReceive(Array.from(filteredOptionReceive))
    setFilteredOptionsfromDep(Array.from(filteredOptionfromDep))
    setFilteredOptionsDocType(Array.from(filteredOptionDocType))
    setFilteredOptionsName(Array.from(filteredOptionName))
    setFilteredOptionsStatus(Array.from(filteredOptionStatus))
    setFilteredData(timeFiltered);
  }, [rows, search, filter, filter2, filter3, filter4, filter5, filter6, filter7, filter8, filter9, filter10]);

  const filterSearch = (e) => {
    setSearch(e.target.value)
  }

  //FILTEROPEN
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [anchorEl3, setAnchorEl3] = useState(null);
  const [anchorEl4, setAnchorEl4] = useState(null);
  const [anchorEl5, setAnchorEl5] = useState(null);
  const [anchorEl6, setAnchorEl6] = useState(null);
  const open1 = Boolean(anchorEl1);
  const open2 = Boolean(anchorEl2);
  const open3 = Boolean(anchorEl3);
  const open4 = Boolean(anchorEl4);
  const open5 = Boolean(anchorEl5);
  const open6 = Boolean(anchorEl6);
  const handleFilter = (event, buttonNumber) => {
    if(buttonNumber === 1){
      setAnchorEl1(event.currentTarget);
    }
    else if(buttonNumber === 2){
      setAnchorEl2(event.currentTarget);
    }
    else if(buttonNumber === 3){
      setAnchorEl3(event.currentTarget);
    }
    else if(buttonNumber === 4){
      setAnchorEl4(event.currentTarget);
    }
    else if(buttonNumber === 5){
      setAnchorEl5(event.currentTarget);
    }
    else if(buttonNumber === 6){
      setAnchorEl6(event.currentTarget);
    }
  }
   
  const handleFilterClose = (event, buttonNumber) => {
    if(buttonNumber === 1){
      setAnchorEl1(null);
    }
    else if(buttonNumber === 2){
      setAnchorEl2(null);
    }
    else if(buttonNumber === 3){
      setAnchorEl3(null);
    }
    else if(buttonNumber === 4){
      setAnchorEl4(null);
    }
    else if(buttonNumber === 5){
      setAnchorEl5(null);
    }
    else if(buttonNumber === 6){
      setAnchorEl6(null);
    }
  };

  const [actionHolder, setActionHolder] = useState("")
  const [action, setAction] = useState("")
  const [comment, setComment] = useState("")
  const [forward, setForward] = useState("")
  //OPEN COMMENT
  const [approveReject, setApproveReject] = useState(false);
  const openApproveReject = (id) => {
    const data = {
      id: id
    }
    setActionHolder(data)
    setApproveReject(true)
  }

  useEffect(() => {
    setAction(actionHolder.Action)
  }, [actionHolder])

  const submitApproveReject = async (e) => {
    e.preventDefault()
    setSumbmit(true)
    const editDoc = doc(db, "documents", actionHolder.id);
    const updateFields = {
      forward_To: forward,
      Comment: comment,
      forwarded_By: user.uID,
      forwarded_DateTime: dayjs().format('MM/DD/YYYY h:mm A').toString(),
      unread: true
    }
    await updateDoc(editDoc, updateFields).then(() => {
      closrApproveReject()
      setSumbmit(false)
      toast.success("Forwarded a Document.")
    })
  }

  const closrApproveReject = () => {
      setApproveReject(false)
  }

  //UNREAD
  const unread = async(unread, id) => {
    if(unread){
      const docRef = doc(db, "documents", id)
      await updateDoc(docRef, {
        unread: false,
      })
    }
  }

  //LightBox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setIsLightboxOpen(true);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  //Tab Pannel
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDownload = (type, name) => {
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    
      if (type === "docx" || type === "xlsx") {
        const fileName = name.substring(37)
        const fileURL = `${port}/document_Files/${name}`;
        fetch(fileURL)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          })
          .catch(error => console.error('Error downloading file:', error));
      }
    else if(type == "image"){
      if(imageList.length > 1){
        const zip = new JSZip()
        const promises = imageList.map((image, index) => {
          const imageUrl = `${port}/document_Files/${image}`;
          const filename = image.substring(37);
  
          return fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => zip.file(filename, blob));
        });
  
        Promise.all(promises).then(() => {
          zip.generateAsync({ type: 'blob' }).then(blob => {
            const url = URL.createObjectURL(blob);
            anchor.href = url;
            anchor.download = `${displayFile[0].document_Name}.zip`;
  
            anchor.target = '_blank';
            anchor.click();
  
            URL.revokeObjectURL(url);
          });
        });
       
      }else{
        for(const image of imageList){
          const imageUrl = `${port}/document_Files/${image}`;
          fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
              const objectUrl = URL.createObjectURL(blob);
              anchor.href = objectUrl;
              anchor.download = image.substring(37);
              anchor.target = '_blank';
              anchor.click();
              URL.revokeObjectURL(objectUrl);
            })
            .catch(error => {
              console.error('Error fetching image:', error);
            });
        }
      }
    }
    document.body.removeChild(anchor);
};

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Toaster position="bottom-center"/>
    <Paper sx={{ width: "100%", overflow: "hidden", height: "100%", position: "relative" }}>
      <Box height={10} className="table-main" />
      <Stack
        className="table-main"
        direction="row"
        spacing={2}
        style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px" }}
      >
        
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <FormControl variant="standard">
          <TextField
            value={search}
            className = "table-input"
            size="small"
            variant="outlined"
            onChange={filterSearch}
            InputProps={{
              placeholder: "Document Name, Description",
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </Stack>
      <TableContainer
        className="table-main"
        sx={{maxHeight: "540px", tableLayout: "fixed", pl: "20px", pr: "20px", userSelect: "none" }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                className="table-cell2"
                align="left"
                sx={{
                  minWidth: "100px",
                }}
              >
                <Typography sx={{
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  padding: "0"
                }}> Document Name<FilterAltIcon className={filter || open1 ? "filter-icon active" : "filter-icon"} aria-label="filter1"  aria-controls={open1 ? 'filter1' : undefined}
                aria-haspopup="true"
                aria-expanded={open1 ? 'true' : undefined}
                onClick={(e) => handleFilter(e, 1)}/></Typography>
              </TableCell>
              <Menu
                sx={{height: "100%"}}
                id="filter1"
                anchorEl={anchorEl1}
                open={open1}
                onClose={(e) => handleFilterClose(e, 1)}
                MenuListProps={{
                  'aria-labelledby': 'filter1',
                }}
              >
                <Box sx={{height: "100%", padding: "20px"}}>
                  <Autocomplete
                    size="small"
                    defaultValue={filter}
                    id="combo-box-demo"
                    onChange={(e) => setFilter(e.target.innerText == undefined ? "" : e.target.innerText)}
                    options={filteredOptionsName.map((option) => option)}
                    sx={{ width: 250, maxHeight: "100px" }}
                    renderInput={(params) => <TextField onChange={(e) => setFilter(e.target.value == undefined ? "" : e.target.value)} {...params} label="Filter Document Name" />}
                  />
                </Box>
                
              </Menu>
              <TableCell
                className="table-cell2"
                align="left"
                style={{
                  minWidth: "100px",
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                }}
              >
               <Typography sx={{
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  padding: "0"
                }}> Document Type<FilterAltIcon className={filter8 || open2 ? "filter-icon active" : "filter-icon"} aria-label="filter2" aria-controls={open2 ? 'filter2' : undefined}
                aria-haspopup="true"
                aria-expanded={open2 ? 'true' : undefined}
                onClick={(e) => handleFilter(e,2)}/></Typography>
              </TableCell>
              <Menu
                id="filter2"
                anchorEl={anchorEl2}
                open={open2}
                onClose={(e) => handleFilterClose(e, 2)}
                MenuListProps={{
                  'aria-labelledby': 'filter2',
                }}
              >
                <Box sx={{height: "100%", padding: "20px"}}>
                  <Autocomplete
                    size="small"
                    defaultValue={filter8}
                    id="combo-box-demo"
                    onChange={(e) => setFilter8(e.target.innerText == undefined ? "" : e.target.innerText)}
                    options={filteredOptionsDocType.map((option) => option)}
                    sx={{ width: 250, maxHeight: "100px" }}
                    renderInput={(params) => <TextField onChange={(e) => setFilter8(e.target.value == undefined ? "" : e.target.value)} {...params} label="Filter Document Type" />}
                  />
                </Box>
              </Menu>

              <TableCell
              className="table-cell2"
                align="left"
                style={{
                  minWidth: "100px",
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                }}
              >
                <Typography sx={{
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  padding: "0"
                }}> Received By<FilterAltIcon className={filter2|| open3 ? "filter-icon active" : "filter-icon"} aria-label="filter1"  aria-controls={open3 ? 'filter1' : undefined}
                aria-haspopup="true"
                aria-expanded={open3 ? 'true' : undefined}
                onClick={(e) => handleFilter(e, 3)}/></Typography>
              </TableCell>
              <Menu
                id="filter2"
                anchorEl={anchorEl3}
                open={open3}
                onClose={(e) => handleFilterClose(e, 3)}
                MenuListProps={{
                  'aria-labelledby': 'filter2',
                }}
              >
                <Box sx={{height: "100%", padding: "20px"}}>
                  <Autocomplete
                    size="small"
                    defaultValue={filter2}
                    id="combo-box-demo"
                    onChange={(e) => setFilter2(e.target.innerText == undefined ? "" : e.target.innerText)}
                    options={filteredOptionsReceive.map((option) => option)}
                    sx={{ width: 250, maxHeight: "100px" }}
                    renderInput={(params) => <TextField onChange={(e) => setFilter2(e.target.value == undefined ? "" : e.target.value)} {...params} label="Filter Received By" />}
                  />
                </Box>
              </Menu>

              <TableCell
              className="table-cell2"
                align="left"
                style={{
                  minWidth: "100px",
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                }}
              >
                <Typography sx={{
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  padding: "0"
                }}> Office/Dep<FilterAltIcon className={filter9|| open4 ? "filter-icon active" : "filter-icon"} aria-label="filter1"  aria-controls={open4 ? 'filter1' : undefined}
                aria-haspopup="true"
                aria-expanded={open4 ? 'true' : undefined}
                onClick={(e) => handleFilter(e, 4)}/></Typography>
              </TableCell>
              <Menu
                id="filter2"
                anchorEl={anchorEl4}
                open={open4}
                onClose={(e) => handleFilterClose(e, 4)}
                MenuListProps={{
                  'aria-labelledby': 'filter2',
                }}
              >
                <Box sx={{height: "100%", padding: "20px"}}>
                  <Autocomplete
                    size="small"
                    defaultValue={filter2}
                    id="combo-box-demo"
                    onChange={(e) => setFilter9(e.target.innerText == undefined ? "" : e.target.innerText)}
                    options={filteredOptionsfromDep.map((option) => option)}
                    sx={{ width: 250, maxHeight: "100px" }}
                    renderInput={(params) => <TextField onChange={(e) => setFilter9(e.target.value == undefined ? "" : e.target.value)} {...params} label="Filter Office/Dept" />}
                  />
                </Box>
              </Menu>

              <TableCell
              className="table-cell2"
                align="left"
                style={{
                  minWidth: "100px",
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                }}
              >
                <Typography sx={{
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  padding: "0"
                }}> Date Received<FilterAltIcon className={filter10|| filter4 || filter5 || filter6 || open5 ? "filter-icon active" : "filter-icon"} aria-label="filter1"  aria-controls={open5 ? 'filter1' : undefined}
                aria-haspopup="true"
                aria-expanded={open5 ? 'true' : undefined}
                onClick={(e) => handleFilter(e, 5)} /></Typography>
              </TableCell>
              <Menu
                id="filter2"
                anchorEl={anchorEl5}
                open={open5}
                onClose={(e) => handleFilterClose(e, 5)}
                MenuListProps={{
                  'aria-labelledby': 'filter2',
                }}
              >
                <Box sx={{height: "100%", padding: "20px"}}>
                  <Box sx={{display: "flex", flexDirection: "column"}}>
                    <DatePicker format="MM/DD/YYYY" value={dayjs(filter10)} label="Basic date picker" onChange={(e) => setFilter10(e)}/>
                    <Button onClick={(e) => setFilter10("")} sx={{fontSize: "0.9rem", textTransform: "none"}}>Clear date</Button>
                  </Box>
                  <Box sx={{display: "flex", flexDirection: "column"}}>
                    <FormControlLabel control={<Checkbox checked={filter4}  onChange={(e) => setFilter4(!filter4)}/>} label="This Year"/>
                    <FormControlLabel control={<Checkbox checked={filter5}  onChange={(e) => setFilter5(!filter5)}/>} label="This Month"/>
                    <FormControlLabel control={<Checkbox checked={filter6}  onChange={(e) => setFilter6(!filter6)}/>} label="This Day"/>
                  </Box>
                </Box>
              </Menu>

              <TableCell
              className="table-cell2"
                align="left"
                style={{
                  minWidth: "100px",
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                }}
              >
                <Typography sx={{
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  padding: "0"
                }}> Status<FilterAltIcon className={filter3|| open6 ? "filter-icon active" : "filter-icon"} aria-label="filter1"  aria-controls={open6 ? 'filter1' : undefined}
                aria-haspopup="true"
                aria-expanded={open6 ? 'true' : undefined}
                onClick={(e) => handleFilter(e, 6)} /></Typography>
              </TableCell>
              <Menu
                id="filter2"
                anchorEl={anchorEl6}
                open={open6}
                onClose={(e) => handleFilterClose(e, 6)}
                MenuListProps={{
                  'aria-labelledby': 'filter2',
                }}
              >
                <Box sx={{height: "100%", padding: "20px"}}>
                  <Autocomplete
                    size="small"
                    defaultValue={filter3}
                    id="combo-box-demo"
                    onChange={(e) => setFilter3(e.target.innerText == undefined ? "" : e.target.innerText)}
                    options={filteredOptionsStatus.map((option) => option)}
                    sx={{ width: 250, maxHeight: "100px" }}
                    renderInput={(params) => <TextField onChange={(e) => setFilter3(e.target.value == undefined ? "" : e.target.value)} {...params} label="Filter Status" />}
                  />
                </Box>
              </Menu>

              <TableCell
              className="table-cell2"
                align="left"
                style={{
                  minWidth: "100px",
                  fontWeight: "bold",
                  fontFamily: "Lato",
                  fontSize: "1rem",
                }}
              >
                {" "}
                Action{" "}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ height: "100%" }}>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <>
                <TableRow hover role="checkbox" tabIndex={-1} key={row.uID} sx={{cursor: "pointer", userSelect: "none", height: "50px", background: "#F0EFF6",'& :last-child': {borderBottomRightRadius: "10px", borderTopRightRadius: "10px"} ,'& :first-child':  {borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px"} }}>
                  <TableCell className={"table-cell"} align="left" onClick={() => setOpenRows((prevState => ({...prevState, [row.id]: !prevState[row.id]})))}> {row.document_Name} </TableCell>
                  <TableCell className={"table-cell"} align="left" onClick={() => setOpenRows((prevState => ({...prevState, [row.id]: !prevState[row.id]})))}> {row.Type == undefined || row.Type == "" ? row.document_Type : row.Type} </TableCell>
                  <TableCell className={"table-cell"} align="left" onClick={() => setOpenRows((prevState => ({...prevState, [row.id]: !prevState[row.id]})))}> {row.received_By} </TableCell>
                  <TableCell className={"table-cell"} align="left" onClick={() => setOpenRows((prevState => ({...prevState, [row.id]: !prevState[row.id]})))}> {row.fromDep == undefined || row.fromDep == "" ? row.fromPer : row.fromDep} </TableCell>
                  <TableCell className={"table-cell"} align="left" onClick={() => setOpenRows((prevState => ({...prevState, [row.id]: !prevState[row.id]})))}> {row.date_Received} </TableCell>
                  <TableCell className={"table-cell"} align="left" > 
                  {row.Status === 'Completed' ? <span className='table-Done'>Completed</span>: 
                  row.Status === 'Pending' ? <span className='table-Ongoing'>Pending</span>:
                  row.Status === 'Rejected' ? <span className='table-NotDone'>Rejected</span>: <span className='table-Default'>{row.Status}</span>}
                  </TableCell>
                  <TableCell className={"table-cell"} align="left">
                    <Stack spacing={1} direction="row">
                      <Tooltip title={<Typography sx={{fontSize: "0.8rem"}}>View Document</Typography>} arrow>
                      <VisibilityIcon
                        style={{
                          fontSize: "30px",
                          color: "#FFF",
                          cursor: "pointer",
                          background: "#FF6347",
                          borderRadius: "5px",
                        }}
                        className="cursor-pointer"
                        onClick={() => openFile(row.uID)}
                      />
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow className="drop-down" sx={{height: "100%", padding: "0", '& :hover': {pointerEvents: "none", cursor: "pointer"}}}>
                  <TableCell colSpan={7} sx={{width: "100%", padding: "0 0 0 0", boxShadow: '0px 15px 10px -13px #E6E4F0', borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px"}}>
                    <Collapse in={openRows[row.id]}>
                      <Box sx={{p: "20px"}}>
                          <Box sx={{}}>
                              <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Description</Typography>
                              <Typography sx={{fontWeight: "300", fontSize: "1rem",overflow: "hidden", maxWidth: "1000px", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{row.Description}</Typography>
                          </Box>
                          <Box sx={{mt: "20px"}}>
                              <Typography sx={{fontWeight: "300", fontSize: "0.8rem"}}>Comment/Note</Typography>
                              <Typography sx={{fontWeight: "300", fontSize: "1rem",overflow: "hidden", maxWidth: "1000px", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{row.Comment}</Typography>
                          </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
                </>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {loading ? (
        <div className="load-container">
          <span className="loader"></span>
        </div>
      ) : (
        ""
      )}
      {emptyResult ? (
        <div className="nothing-holder">
          <img className="noresult" src={noresult} />
          <div className="nothing">No Documents found</div>
          <div className="nothing-bottom">
          No documents received.
          </div>
        </div>
      ) : (
        ""
      )}
      <TablePagination
        className="table-pagination"
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={approveReject} fullWidth maxWidth="sm">
        <DialogTitle className="dialogDisplayTitle">
          <div className="display-title-holder">
            <div className="dialog-title-view">Forward To</div>
            <div className="dialog-title-close">
              <button onClick={closrApproveReject}>Close</button>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="dialogDisplay" sx={{height: "45vh"}}>
            <Box onSubmit={submitApproveReject} component="form" sx={{width: "100%", height: "100%", padding:  windowWidth >= 768 ? "20px": 0}}>
                <TextField
                className="requests-note"
                id="outlined-multiline-static"
                label="Comment/Note"
                multiline
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="Comment..."
                sx={{width: "100%", mb: "20px",}}
                />
                <FormControl fullWidth className="Select-input">
                  <InputLabel id="demo-simple-select-label">ForwardTo</InputLabel>
                  <Select
                    className="Select-input-button"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={forward}
                    label="Age"
                    onChange={(e) => setForward(e.target.value)}
                  >
                    {users.map((users) => (
                      <MenuItem value={users.UID}>{"("+ users.role + ")" + " - " + users.full_Name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div className="form-bottom">
                <div className="form-submit-cancel">
                  <div className="submit-cancel">
                    <button
                      type="button"
                      className="form-cancel"
                      onClick={closrApproveReject}
                    >
                      Cancel
                    </button>
                    {sumbmit ? (
                      <button type="submit" className="form-submit2">
                        <div className="load-container3">
                          <span class="loader2"></span>
                        </div>
                      </button>
                    ) : (
                      <button type="submit" className="form-submit">
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Box>
            
        </DialogContent>
      </Dialog>


      <Dialog open={openShowFile} fullWidth maxWidth="xl">
        <DialogTitle className="dialogDisplayTitle">
          <div className="display-title-holder">
            <div className="dialog-title-view">View Document</div>
            <div className="dialog-title-close">
              <button onClick={closeFile}>Close</button>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="dialogDisplay">
          {loading2 ? (
            <div className="load-container">
              <span className="loader"></span>
            </div>
          ) : (
            <section className="monitoring2">
              {displayFile.map((displayFile) => {
                return (
                  <div className="view-container">
                    <div className="view-details-container">
                      <div className="view-details">
                        <div className="details">
                          <h2>Document Name: </h2>
                          <p>{displayFile.document_Name}</p>
                        </div>
                        <div className="details">
                          <h2>Category: </h2>
                          <p>{displayFile.document_Type}</p>
                        </div>
                        {displayFile.Type == "" ? "" : (
                            <div className="details">
                                <h2>Document Type:</h2>
                                <p>{displayFile.Type}</p>
                            </div>
                        )}
                        <div className="details">
                          <h2>Received By: </h2>
                          <p>{displayFile.received_By}</p>
                        </div>
                        <div className="details">
                          <h2>{displayFile.document_Type == "Student Document" ? "Student Name: ": displayFile.document_Type == "Faculty Document" ? "Faculty Name: ":displayFile.document_Type == "New Hire Document" ? "Applicant Name: ":displayFile.document_Type == "IPCR/OPCR" ? "Ratee Name: ": "Contact Person: "} </h2>
                          <p>{displayFile.fromPer}</p>
                        </div>
                        <div className="details">
                          <h2>Date Received: </h2>
                          <p>{displayFile.date_Received + " " + displayFile.time_Received}</p>
                        </div>
                        <div className="details">
                          <h2>Description:</h2>
                          <p>{displayFile.Description}</p>
                        </div>
                        {displayFile.Sched_Date == undefined ? "" : (
                            <div className="details">
                                <h2>Office/Dept:</h2>
                                <p>{displayFile.fromDep}</p>
                            </div>
                        )}
                        {displayFile.Sched_Date == undefined ? "" : (
                            <div className="details">
                                <h2>Schedule Date:</h2>
                                <p>{displayFile.Sched_Date}</p>
                            </div>
                        )}
                        {displayFile.Sched == undefined ? "" : (
                            <div className="details">
                                <h2>Meeting Details:</h2>
                                <p>{displayFile.Sched}</p>
                            </div>
                        )}
                        <div className="details">
                          <h2>Status: </h2>
                          <p>{displayFile.Status}</p>
                        </div>
                        <div className="details">
                          <h2>Comment/Note: </h2>
                          <p>{displayFile.Comment}</p>
                        </div>
                        <div className="details">
                          <h2>Forwarded By: </h2>
                          <p>{users.find((item) => item.UID === displayFile.forwarded_By)?.full_Name}</p>
                        </div>
                        <div className="details">
                          <h2>Forwarded Date: </h2>
                          <p>{displayFile.forwarded_DateTime}</p>
                        </div>
                        <div className="details">
                          <h2>Approved/Rejected By: </h2>
                          <p>{users.find((item) => item.UID === displayFile.accepted_Rejected_By)?.full_Name}</p>
                        </div>
                        <div className="details">
                          <h2>Approved/Rejected Date: </h2>
                          <p>{displayFile.accepted_Rejected_In}</p>
                        </div>
                      </div>
                    </div>
                    <div className="view-img">
                      { [imageList, filePDF, fileDocx, fileXlsx].filter(arr => arr.length > 0).length >=2?(
                        <TabContext value={tabValue}>
                          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example" variant="scrollable">
                              {imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Image/s" value="1" />}
                              {filePDF.length != 0  && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="PDF" value="2" />}
                              {fileDocx.length != 0  && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Docx" value="3" />}
                              {fileXlsx.length != 0  && <Tab sx={{textTransform: "none", fontSize: "1rem"}} label="Excel" value="4" />}
                            </TabList>
                          </Box>
                          <TabPanel value="1">
                          <Grid container xs={12}>
                              <Button component="label" onClick={(e) => handleDownload("image")} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none", marginBottom: "10px"}}>
                                      Download Image/s
                              </Button>
                              {imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) &&(
                                    <ImageList variant="masonry" cols={windowWidth <= 375 ? 1 : windowWidth <=576 && windowWidth > 375? 2 : 3} gap={8}>
                                      {imageList.map((url, index) => (
                                            <ImageListItem key={url}>
                                              <img loading="eager" srcSet={`${port}/document_Files/${url}?w=248&fit=crop&auto=format&dpr=2 2x`} src={`${port}/document_Files/${url}?w=248&fit=crop&auto=format`} onClick={(e) => openLightbox(index)}/>
                                            </ImageListItem>                                  
                                      ))}
                                  </ImageList>
                                )}
                            </Grid>
                          </TabPanel>
                          <TabPanel value="2">
                            {
                              filePDF.length != 0 && (
                                <>
                                {windowWidth >= 768 ? (
                                  <>
                                    <TabContext value={currentPDF}>
                                    <TabList onChange={handlePDFChange} aria-label="lab API tabs example" variant="scrollable">
                                      {filePDF.map((pdf) => {
                                        return(
                                          <Tab sx={{textTransform: "none", fontSize: "1rem"}} label={pdf.file_Name.substring(37)} value={pdf}/>
                                        )
                                      })}
                                    </TabList>
                                    </TabContext>
                                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
                                      <>
                                        
                                        {imageList && (
                                          <Box>
                                            <Viewer fileUrl={`${port}/document_Files/${currentPDF && currentPDF.file_Name}`} defaultScale={1} plugins={[newPlugin, pagePlugin]} theme="dark"/>
                                          </Box>
                                        )}  
                                        {!imageList && <>No PDF</>}
                                      </>
                                    </Worker>
                                  </>
                                ) : (
                                  <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                  {filePDF.map((file) => {
                                    return(
                                        <>
                                          <img src={pdfIcon} style={{width: "150px", height: '150px'}}></img>
                                          <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                          <Button component="label" onClick={(e) => handleDownload("docx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#ff3232", textTransform: "none", marginBottom: "20px"}}>
                                            Download .pdf File
                                          </Button>
                                        </>
                                    )
                                        
                                  })}
                                  </Box>
                                )}
                                </>
                              )
                            }
                          </TabPanel>
                          <TabPanel value="3">
                            {
                              fileDocx.length != 0 && (
                                <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                  {fileDocx.map((file) => {
                                    return(
                                        <>
                                          <img src={docxViewIcon} style={{width: "150px", height: '150px'}}></img>
                                          <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                          <Button component="label" onClick={(e) => handleDownload("docx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none", marginBottom: "20px"}}>
                                            Download .docx File
                                          </Button>
                                        </>
                                    )
                                        
                                  })}
                                </Box>
                              )
                            }
                          </TabPanel>
                          <TabPanel value="4">
                            {
                              fileXlsx.length != 0 && (
                                <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                  {fileXlsx.map((file) => {
                                    return(
                                        <>
                                          <img src={xlsxViewIcon} style={{width: "150px", height: '150px'}}></img>
                                          <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                          <Button component="label" onClick={(e) => handleDownload("xlsx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "hsl(126, 49%, 36%)", textTransform: "none", marginBottom: "20px"}}>
                                            Download .xlsx File
                                          </Button>
                                        </>
                                    )
                                        
                                  })}
                                </Box>
                              )
                            }
                          </TabPanel>
                      </TabContext>  
                      )
                      :
                      imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) ?(
                        <Grid container xs={12}>
                        <Button component="label" onClick={(e) => handleDownload("image")} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none", marginBottom: "10px"}}>
                                  Download Image/s
                        </Button>
                        {imageList.some(item => item.includes(".jpg") || item.includes(".jpeg") || item.includes(".png")) &&(
                              <ImageList variant="masonry" cols={windowWidth <= 375 ? 1 : windowWidth <=576 && windowWidth > 375? 2 : 3} gap={8}>
                                {imageList.map((url, index) => (
                                      <ImageListItem key={url}>
                                        <img loading="eager" srcSet={`${port}/document_Files/${url}?w=248&fit=crop&auto=format&dpr=2 2x`} src={`${port}/document_Files/${url}?w=248&fit=crop&auto=format`} onClick={(e) => openLightbox(index)}/>
                                      </ImageListItem>                                  
                                ))}
                            </ImageList>
                          )}
                      </Grid>
                      ) 
                      :
                      filePDF.length != 0 ? (
                        <>
                        {windowWidth >= 768 ? (
                            <>
                              <TabContext value={currentPDF}>
                              <TabList onChange={handlePDFChange} aria-label="lab API tabs example" variant="scrollable">
                                {filePDF.map((pdf) => {
                                  return(
                                    <Tab sx={{textTransform: "none", fontSize: "1rem"}} label={pdf.file_Name.substring(37)} value={pdf}/>
                                  )
                                })}
                              </TabList>
                              </TabContext>
                              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
                                <>
                                  
                                  {imageList && (
                                    <Box>
                                      <Viewer fileUrl={`${port}/document_Files/${currentPDF && currentPDF.file_Name}`} defaultScale={1} plugins={[newPlugin, pagePlugin]} theme="dark"/>
                                    </Box>
                                  )}  
                                  {!imageList && <>No PDF</>}
                                </>
                              </Worker>
                            </>
                          ) : (
                            <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            {filePDF.map((file) => {
                              return(
                                  <>
                                    <img src={pdfIcon} style={{width: "150px", height: '150px'}}></img>
                                    <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                    <Button component="label" onClick={(e) => handleDownload("docx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#ff3232", textTransform: "none", marginBottom: "20px"}}>
                                      Download .pdf File
                                    </Button>
                                  </>
                              )
                                  
                            })}
                            </Box>
                          )}
                        </>
                      )
                      : fileDocx.length !=0 ? (
                        <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                          {fileDocx.map((file) => {
                            return(
                                <>
                                  <img src={docxViewIcon} style={{width: "150px", height: '150px'}}></img>
                                  <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                  <Button component="label" onClick={(e) => handleDownload("docx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "#296da9", textTransform: "none", marginBottom: "20px"}}>
                                    Download .docx File
                                  </Button>
                                </>
                            )
                                
                          })}
                        </Box>
                      ) : fileXlsx.length !=0 ? (
                          <Box sx={{width: "100%", height: '100%', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            {fileXlsx.map((file) => {
                              return(
                                  <>
                                    <img src={xlsxViewIcon} style={{width: "150px", height: '150px'}}></img>
                                    <Typography sx={{mt: "5vh"}}>{file.file_Name.substring(37)}</Typography>
                                    <Button component="label" onClick={(e) => handleDownload("xlsx", file.file_Name)} variant="contained" startIcon={<CloudDownload />} sx={{backgroundColor: "hsl(126, 49%, 36%)", textTransform: "none", marginBottom: "20px"}}>
                                      Download .xlsx File
                                    </Button>
                                  </>
                              )
                                  
                            })}
                          </Box>
                      )
                      :
                      (
                        <div className="load-containerImage">
                          <span className="loader"></span>
                        </div>
                      )}
                      {isLightboxOpen && (
                        <Lightbox
                          mainSrc={`${port}/document_Files/${imageList[lightboxIndex]}`}
                          nextSrc={imageList[(lightboxIndex + 1) % imageList.length]}
                          prevSrc={imageList[(lightboxIndex + imageList.length - 1) % imageList.length]}
                          onCloseRequest={closeLightbox}
                          onMovePrevRequest={() => setLightboxIndex((lightboxIndex + imageList.length - 1) % imageList.length)}
                          onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % imageList.length)}
                          reactModalStyle={{ overlay: { zIndex: 9999 }, content: { zIndex: 9999 } }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={openFilter} fullWidth maxWidth="sm">
        <DialogTitle className="dialogDisplayTitle">
          <div className="display-title-holder">
            <div className="dialog-title-view">Filter</div>
            <div className="dialog-title-close">
              <button onClick={filterClose}>Close</button>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="dialogDisplay">
        <Box sx={{display: "flex", width: "100%", mb: "5vh"}}>
            <Box sx={{width: "100%", padding: "1vh"}}>
                <FormControl variant="outlined" sx={{ marginTop: 1, width: "100%" }}>
                <InputLabel id="DocuType" className="table-filter">Document Type</InputLabel>
                <Select
                labelId="DocuType"
                id="demo-simple-select"
                label="Document Type"
                onChange={(e) => setFilter(e.target.value)}
                className="table-filter"
                value={filter}
                >
                <MenuItem value={""}>Clear Filter</MenuItem>
                {uniqueValuesArray.map((value, index) =>(
                    <MenuItem value={value}>{value}</MenuItem>
                ))}
                </Select>
            </FormControl>
            <TextField label="Description Keyword..." value={filter2} onChange={(e) => setFilter2(e.target.value)} sx={{marginTop: 1}} className="Label-input"/>
            </Box>
            <Box sx={{width: "100%", padding: "1vh"}}>
                <FormControl variant="outlined" sx={{ marginTop: 1, width: "100%" }}>
                <InputLabel id="DocuFrom" className="table-filter">Status</InputLabel>
                <Select
                labelId="DocuFrom"
                id="demo-simple-select"
                label="Status"
                onChange={(e) => setFilter3(e.target.value)}
                className="table-filter"
                value={filter3}
                >
                <MenuItem value={""}>Clear Filter</MenuItem>
                <MenuItem value={"Completed"}><span className='table-Done'>Completed</span></MenuItem>
                <MenuItem value={"Pending"}><span className='table-Ongoing'>Pending</span></MenuItem>
                <MenuItem value={"Rejected"}><span className='table-NotDone'>Rejected</span></MenuItem>
            
                </Select>
            </FormControl>
            <Autocomplete
                className="requests-Forward"
                value={filter7}
                disablePortal
                id="combo-box-demo"
                onSelect={(e) => setFilter7(e.target.value)}
                options={["Student Document", "Faculty Document", "New Hire Document", "IPCR/OPCR", "Travel Order", "Meeting Request"]}
                sx={{ width: "100%", marginTop: 1 }}
                renderInput={(params) => <TextField value={filter7} onChange={(e) => setFilter7(e.target.value)} {...params} label="Category" />}
                />
            </Box>
        </Box>
          
          
          <FormGroup sx={{padding: "1vh"}}>
            <FormControlLabel className="filter-time" control={<Checkbox checked={filter4}  onChange={(e) => setFilter4((prev) => !prev)}/>} label="This Year" />
            <FormControlLabel className="filter-time" control={<Checkbox checked={filter5}  onChange={(e) => setFilter5((prev) => !prev)}/>} label="This Month" />
            <FormControlLabel className="filter-time" control={<Checkbox checked={filter6}  onChange={(e) => setFilter6((prev) => !prev)}/>} label="This Day" />
          </FormGroup>
        </DialogContent>
      </Dialog>
    </Paper>
    </LocalizationProvider>
  );
}
