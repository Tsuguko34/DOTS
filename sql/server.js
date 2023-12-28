import express, { json } from 'express'
import mysql from 'mysql2'
import cors from 'cors'
import fs from 'fs'
import multer from 'multer'

const app = express()
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"DeansOffice2023",
    database:"dots"
})

app.get("/documents", (req, res) => {
    let q = null
    if(req.query.type == "Other"){
        q = `SELECT * FROM documents WHERE document_Type NOT IN ('Memorandum', 'Communication') ORDER BY date_Received DESC`
    }else{
        q = `SELECT * FROM documents WHERE Remark = '${req.query.remark}' AND document_Type = '${req.query.type}'ORDER BY date_Received DESC`
    }
    
    db.query(q, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})
const storage = multer.diskStorage({
    destination: "../document_Files",
    filename: function (req, file, cb) {
        return cb(null, `${file.originalname}`)
    }
})

const upload = multer({storage})
const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
app.use('/document_Files', express.static('../document_Files'));
app.post("/documentFiles", upload.array('files'),(req, res) => {
    let queriesExecuted = 0;
    try{
        for(const file of req.files){
            const q = "INSERT INTO files (`file_Name`,`uID`, `size`) VALUES (?)"
            const values = [
                file.filename,
                req.body.uID,
                bytesToSize(file.size)
            ]
        
            db.query(q, [values], (err, data) => {
                if(err){
                    return res.json(err.message);
                }else{
                    queriesExecuted++;
                    if(queriesExecuted == req.files.length){
                        return res.json({sucess: true})
                    }
                }
            })
        }
    }catch(e){
        console.error(e)
    }
})

app.post("/documents",(req, res) => {
    const q = "INSERT INTO documents (`document_Name`,`document_Type`,`date_Received`,`received_By`,`fromPer`,`fromDep`,`time_Received`,`uID`,`Status`,`Type`,`Description`,`Comment`,`forward_To`,`Remark`,`deleted_at`,`urgent`,`unread`) VALUES (?)"
    const values = [
        req.body.document_Name,
        req.body.document_Type,
        req.body.date_Received,
        req.body.received_By,
        req.body.fromPer,
        req.body.fromDep,
        req.body.time_Received,
        req.body.uID,
        req.body.Status,
        req.body.Type,
        req.body.Description,
        req.body.Comment,
        req.body.forward_To,
        req.body.Remark,
        req.body.deleted_at,
        req.body.urgent,
        req.body.unread,
    ]

    db.query(q, [values], (err, data) => {
        
        if(err) return res.json(err);
        return res.json({sucess: true})
    })
})

app.put("/update",(req, res) => {
    const q = "UPDATE documents SET `document_Name` = ?,`date_Received` = ?,`received_By` = ?,`fromPer` = ?,`fromDep` = ?,`time_Received` = ?,`Status` = ?,`Type` = ?,`Description` = ?,`Comment` = ? WHERE uID = ?"
    const values = [
        req.body.document_Name,
        req.body.date_Received,
        req.body.received_By,
        req.body.fromPer,
        req.body.fromDep,
        req.body.time_Received,
        req.body.Status,
        req.body.Type,
        req.body.Description,
        req.body.Comment,
    ]

    db.query(q, [...values, req.body.uID], (err, data) => {
        if(err) return console.log(err);;
        return res.json({sucess: true})
    })
})

app.put("/updateFile", upload.array('files'),(req, res) => {
    let queriesExecuted = 0;
    const selectQuery = `SELECT * FROM files WHERE uID = '${req.body.uID}'`
        db.query(selectQuery, (err, data) => {
            if (err) return console.log(err);
            const fileNames = data.map(item => item.file_Name)
            console.log(fileNames);
            const deleteQuery = `DELETE FROM files WHERE uID = '${req.body.uID}'`;
            db.query(deleteQuery, (deleteErr, deleteData) => {
                if (deleteErr) {
                    return console.log(deleteErr.message);
                }
            })

            const filesQuery = `SELECT * FROM files`
            db.query(filesQuery, (err, data) => {
                data.forEach(file => {
                    const existingFileNames = data.map(item => item.file_Name)
                    fileNames.forEach(filename => {
                        if(!existingFileNames.includes(filename)){
                            const filePath = `../document_Files/${filename}`;
                            if(fs.existsSync(filePath)){
                                console.log(true);
                                fs.unlinkSync(filePath)
                            }
                        }
                    });  
                })
            })
                  
            try{
                for(const file of req.files){
                    const insertQuery = "INSERT INTO files (`file_Name`, `uID`, `size`) VALUES (?)";
                    const values = [
                        file.filename,
                        req.body.uID,
                        bytesToSize(file.size),
                    ]
                
                    db.query(insertQuery, [values], (err, data) => {
                        if(err){
                            return res.json(err.message);
                        }else{
                            queriesExecuted++;
                            if(queriesExecuted == req.files.length){
                                return res.json({sucess: true})
                            }
                        }
                    })
                }
            }catch(e){
                console.error(e)
            }
        })
    
})



app.get("/getArchives",(req, res) => {
    const q = `SELECT * FROM archives`;
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
});

app.get("/getFilteredArchives",(req, res) => {
    console.log(req.query.documentType, req.query.year);
    const q = `SELECT * FROM archives WHERE document_Type = '${req.query.documentType}' AND SUBSTRING(date_Received, 7, 4) = '${req.query.year}';`;
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      console.log(data);
      return res.json(data);
    });
});

app.post("/archiveFile",(req, res) => {
    const selectQuery = `SELECT * FROM documents WHERE uID = '${req.query.id}'`;
    const deleteQuery = `DELETE FROM documents WHERE uID = '${req.query.id}'`;
    const insertQuery = "INSERT INTO archives (`document_Name`,`document_Type`,`date_Received`,`received_By`,`fromPer`,`fromDep`,`time_Received`,`uID`,`Status`,`Type`,`Description`,`Comment`,`forward_To`,`Remark`,`deleted_at`,`urgent`,`unread`) VALUES (?)"
    db.query(selectQuery, (err, data) => {
      if (err) return res.json(err);
        const selectedData = data[0]
        const values = [
            selectedData.document_Name,
            selectedData.document_Type,
            selectedData.date_Received,
            selectedData.received_By,
            selectedData.fromPer,
            selectedData.fromDep,
            selectedData.time_Received,
            selectedData.uID,
            selectedData.Status,
            selectedData.Type,
            selectedData.Description,
            selectedData.Comment,
            selectedData.forward_To,
            selectedData.Remark,
            selectedData.deleted_at,
            selectedData.urgent,
            selectedData.unread,
        ]
        db.query(insertQuery, [values], (err, insertData) => {
            if (err) return res.json(err);
            db.query(deleteQuery, (err, delData) => {
                if (err) return res.json(err);
                return res.json({sucess: true})
            })
        })
    });
});

app.get("/openFile",(req, res) => {
    const q = `SELECT * FROM documents WHERE uID = '${req.query.id}'`;
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
});

app.get("/getFile",(req, res) => {
    const q = `SELECT * FROM files WHERE uID = '${req.query.id}'`;
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
});

app.get("/openArchiveFile",(req, res) => {
    const q = `SELECT * FROM archives WHERE uID = '${req.query.id}'`;
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
});

app.get("/getArchiveFiles",(req, res) => {
    const q = `SELECT * FROM files`;
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
});

app.listen(3001, () => { 
    
})
