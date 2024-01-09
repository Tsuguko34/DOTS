import React, { useState, useEffect } from "react";
import AccordionReport from "../components/Accordion";
import "./Pages.css";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import OutboxIcon from "@mui/icons-material/Outbox";
import ReportCharts from "../components/ReportCharts/Reportcharts";
import ReportCharts2 from "../components/ReportCharts/Reportchart2";
import ReportCharts3 from "../components/ReportCharts/Reportchart3";
import Reportchart4 from "../components/ReportCharts/Reportchart4";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import DateandProfile from "../components/DateandProfile";

function Reports() {
  const logcollectionRef = collection(db, "logs");
  const [logData, setLogData] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [openShowLogs, setOpenShowLogs] = useState(false);
  const openLogs = () => {
    setOpenShowLogs(true);
    setLoading2(true);
    getLogs();
  };
  const closeLogs = () => {
    setOpenShowLogs(false);
    setLogData([]);
  };

  const getLogs = async () => {
    const q = query(logcollectionRef, orderBy("date", "desc"));
    const data = await getDocs(q);
    const LogDataset = data.docs.map((doc) => ({ ...doc.data(), id: doc.id, dateTime: new Date(doc.data().date)}));
    LogDataset.sort((a, b) => {
      if (b.dateTime.getFullYear() !== a.dateTime.getFullYear()) {
        return b.dateTime.getFullYear() - a.dateTime.getFullYear();
      } else if (b.dateTime.getMonth() !== a.dateTime.getMonth()) {
        return b.dateTime.getMonth() - a.dateTime.getMonth();
      } else {
        return b.dateTime.getDate() - a.dateTime.getDate();
      }
    });
    setLogData(LogDataset)
    setLoading2(false);
  };

  const [recentlyDel, setRecentlyDel] = useState(0)
  const [totalInc, setTotalInc] = useState(0)
  const [totalOut, setTotalOut] = useState(0)

  
  
  
  useEffect(() => {
    const getRecentDel = async() => {
      const data = await getDocs(collection(db, "recently_deleted"))
      setRecentlyDel(data.size)
    }
   
    getRecentDel();
    
  }, [])

  useEffect(() => {
    const getdocus = async() => {
      const data = await getDocs(collection(db, "documents"))
      data.forEach((doc) => {
        const remark = doc.data().Remark
        if(remark === "Incoming"){
          setTotalInc(prevCount => prevCount + 1)
        }
        else if(remark === "Outgoing"){
          setTotalOut(prevCount2 => prevCount2 + 1)
        }
      })
    }
    getdocus();
  },[])
  return (
    <div className="reports">
      <div className="page-title">
        <p>Dean's Office Transaction</p>
        <p>Reports</p>
        <div className="page-desc">Dean's office transaction data reports</div>
      </div>

      {/* content-items */}
      <div className="report-holder">
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Stack spacing={2} direction="row">
              <Card
                sx={{ minWidth: 49 + "%", height: 150 }}
                className="report_gradient"
              >
                <CardContent>
                  <div className="report_large_icon">
                    <MoveToInboxIcon />
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{ color: "#ffffff", fontWeight: "bold" }}
                    >
                      {totalInc}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="body2"
                      component="div"
                      sx={{ color: "#ffffff" }}
                    >
                      Total Incoming
                    </Typography>
                  </div>
                </CardContent>
              </Card>
              <Card
                sx={{ minWidth: 49 + "%", height: 150 }}
                className="report_gradient_light"
              >
                <CardContent>
                  <div className="report_large_icon">
                    <OutboxIcon />
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{ color: "#ffffff", fontWeight: "bold" }}
                    >
                      {totalOut}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="body2"
                      component="div"
                      sx={{ color: "#ffffff" }}
                    >
                      Total Outgoing
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack spacing={2}>
              <Card
                sx={{
                  maxWidth: 520,
                  transition: "250ms",
                  cursor: "pointer",
                  userSelect: "none",
                  "& :hover": {
                    backgroundColor: " #212121 ",
                    transition: "150ms",
                  },
                }}
                className="report_gradient"
                onClick={openLogs}
              >
                <CardContent>
                  <Stack spacing={2} direction="row">
                    <div className="side-report">
                      <div className="reporticon">
                        <SummarizeIcon />
                      </div>
                      <span className="logs">Logs</span>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ maxWidth: 520 }} className="report_gradient_light">
                <CardContent>
                  <Stack spacing={2} direction="row">
                    <div className="reporticon">
                      <OutboxIcon />
                    </div>
                    <div className="report_all">
                      <h2 className="report_incoming">{recentlyDel}</h2>
                      <br />
                      <span className="report_incoming_total">
                        Recently deleted files
                      </span>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        <div className="reportcharts">
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Card sx={{ height: "100%"}} className="report-card">
                <CardContent>
                  <Reportchart4/>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ height: "100%" }} className="report-card">
                <CardContent>
                  <div>
                    {" "}
                    <ReportCharts />
                  </div>

                  <div>
                    {" "}
                    <ReportCharts3 />
                  </div>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={4} sx={{}}>
              <Card
                sx={{
                  height: "100%",
                  borderTopRightRadius: "none",
                  borderTopLeftRadius: "none",
                  overflowY: "scroll",
                  "&::-webkit-scrollbar": { width: "10px" },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#dad9e0",
                    borderRadius: "10px",
                  },
                }}
                className="report-card"
              >
                <CardContent>
                  <AccordionReport />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
      <Dialog open={openShowLogs} fullWidth maxWidth="md">
        <DialogTitle className="dialogDisplayTitle">
          <div className="display-title-holder">
            <div className="dialog-title-view">Logs</div>
            <div className="dialog-title-close">
              <button onClick={closeLogs}>Close</button>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="dialogDisplay">
          {loading2 ? (
            <div className="load-container">
              <span className="loader"></span>
            </div>
          ) : (
            <div className="log-holder">
              <List>
                {logData.map((logData) => {
                  return (
                    <>
                      <ListItem sx={{ borderBottom: "1px solid #c8d2d6" }} className="dialog-list">
                        <ListItemIcon>
                          <RadioButtonCheckedIcon className="dialog-radio"/>
                        </ListItemIcon>
                        <ListItemText>
                          <div className="log-display">
                            <span className="log-date">{logData.dateTime.toDateString()}</span>
                            <span className="log-data">{logData.log}</span>
                          </div>
                        </ListItemText>
                      </ListItem>
                    </>
                  );
                })}
              </List>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Reports;
