import * as functions from 'firebase-functions';
import express from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';
import { FirestoreSimple } from '@firestore-simple/admin';

const environment = functions.config();
const serviceAccount = require(`../serviceAccount.json`);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const firestore = admin.firestore();
const firestoreSimple = new FirestoreSimple(firestore);
const app = express();
app.use(cors({ origin: true }));

const auth = function (req:any, res:any, next:any) {
  const apiKey = req.headers['api-key']; 
  if(apiKey !== environment.app.apikey){
    return res.status(401).send(`Unauthorized`);
  }
  next();
}

app.use(auth);

app.get("/specialty", async (req:any, res:any) => {
  const dao = firestoreSimple.collection<any>({ path: `specialty` });
  const collection = await dao.fetchAll();
  res.json(collection);
})

app.get("/staff", async (req:any, res:any) => {
  const dao = firestoreSimple.collection<any>({ path: `staff` });
  let collection = await dao.fetchAll();

  const specialtyID = req.query?.filter?.specialtyID;
  if(specialtyID){
    collection = await dao.where('specialtyID', '==', specialtyID).fetch();
  }

  res.json(collection);
})

app.get("/payment-method", async (req:any, res:any) => {
  const dao = firestoreSimple.collection<any>({ path: `paymentMethod` });
  const collection = await dao.fetchAll();
  res.json(collection);
})

app.get("/slot", async (req:any, res:any) => {
  const dao = firestoreSimple.collection<any>({ path: `slot` });
  let collection = await dao.fetchAll();

  const staffID = req.query?.filter?.staffID;
  if(staffID){
    collection = await dao.where('staffID', '==', staffID).fetch();
  }

  res.json(collection);
})

app.post("/appointment", async (req:any, res:any) => {
  const encode = (appointment:any) => {
    return {
      ...appointment,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  }
  const appointmentDAO = firestoreSimple.collection<any>({ path: `appointment`, encode });
  const slotDAO = firestoreSimple.collection<any>({ path: `slot` });
  const { slotID, ...payload } = req.body;
  const slot = await slotDAO.fetch(slotID);

  if(typeof slot === 'undefined'){
    return res.status(400).send(`wrong slotID: ${slotID}`);
  }

  if(!slot.available){
    return res.status(400).send(`unavailable slot: ${slotID}`);
  }

  //@todo validate if the slot.start > than today

  await firestoreSimple.runTransaction(async (_tx) => {
    const appointmentID =  await appointmentDAO.add({ slotID, ...payload });
    await slotDAO.update({ id:slotID, available:false, appointmentID: appointmentID, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.status(200).send({appointmentID});
  })
})

export const api = functions.https.onRequest(app);