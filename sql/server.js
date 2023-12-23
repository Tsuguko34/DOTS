import express, { json } from 'express'
import mysql from 'mysql2'
import cors from 'cors'
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
    const q = `SELECT * FROM documents WHERE Remark = '${req.query.remark}' AND document_Type = '${req.query.type}'ORDER BY date_Received DESC`
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
    console.log(req.body);
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
        console.log(true);
        if(err) return res.json(err);
        return res.json({sucess: true})
    })
})

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

app.listen(3001, () => { 
    
})
