import { DatabaseSync } from "node:sqlite";
import express from 'express';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

const db = new DatabaseSync('CRM.db');
const app = express();
const port = 5050;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.post('/',(req,res) => {
    let { source , firstname , lastname , email , phonenumber , companyname , geographicalsource , interest } = req.body;
    const fullname = req.body.firstname + " " + req.body.lastname;
    let interestscore = 0;
    let sourcescore = 0;
    if(interest === "Hot"){
         interestscore = 30;
    }else if(interest === "Warm"){
         interestscore = 15;
    }else{
         interestscore = -10;
    }
    if(source === "Web Form"){
        sourcescore = 10;
    }else if(source === "Facebook Ad"){
        sourcescore = 5;
    }else{
        sourcescore = 15;
    }
    let intentscore = 50 + interestscore + sourcescore
    let assignedrep = "alex"
    if((source === "Web Form") && (geographicalsource === "Americas") && (intentscore >= 80)){
        assignedrep = "sarah"
    }else if((source === "Google Ad") && (geographicalsource === "EMEA") && (intentscore >= 70)){
        assignedrep = "marcus"
    }else if((source === "Facebook Ad") && (geographicalsource === "APAC") && (intentscore >= 60)){
        assignedrep = "priya"
    }
    try{
        const stmt = db.prepare(`INSERT INTO leads (Source_Channel,Full_Name,Email_Address,Phone,Company_Name,Region,Interest,Intent_Score,Assigned_Rep) VALUES (?,?,?,?,?,?,?,?,?)`);
        stmt.run(source,fullname,email,phonenumber,companyname,geographicalsource,interest,intentscore,assignedrep);
        res.send("submitted");
    }catch(err){
        return(res.status(500).send(err.message));
    }
    const {data , error} = resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'abilashjayan123@gmail.com',
        subject : 'greetings from calsoft',
        html: `<p>hello I am ${assignedrep} . I heard you were interested in our products would you mind dropping into a quick 15min video call to discuss this further`
    })       

    if(error){
        return console.error({error});
    }
});

app.get('/leads',(req,res) => {
    try{
        const stmt = db.prepare(`SELECT id,Full_Name,Company_Name,Email_Address,Phone,Source_Channel,Region,Interest,Intent_Score,Pipeline_Stage,Assigned_Rep,Ingestion_Timestamp`)
        const rows = stmt.all();
        res.json(rows);
    }catch(err){
        return(res.status(500).send(err.message));
    }
})

app.listen(port,()=>{console.log("runnin")});