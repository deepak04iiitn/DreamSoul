import express from 'express';
import { google, signin, signup, deleteAccount, signout } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup' , signup);
router.post('/signin' , signin);
router.post('/google' , google);
router.get('/signout', signout);
router.delete('/delete-account', verifyToken, deleteAccount);

export default router;