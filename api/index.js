
require('dotenv').config();
const express = require('express');

const { connectToDb, getDb } = require('../config/db');



const app = express();
const PORT =process.env.PORT || 3000;;
const cors= require('cors');

app.use(cors());
app.use(express.json());


app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
// Connect to Mongo
 connectToDb();
 function getRandomNumber(min, max) {
    // Use Math.random() to generate a random decimal number between 0 and 1
    const randomDecimal = Math.random();
  
    // Scale the random decimal to be within the range [min, max]
    const randomInRange = Math.floor(randomDecimal * (max - min + 1)) + min;
  
    return randomInRange;
  }
  const randomNumber=getRandomNumber(1,9);
  console.log("alphabet")
  console.log("A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z")
  console.log(randomNumber)
 app.post('/api/register', async (req, res) => {
    try {
      const db = await getDb();
      const userCollection = await db.collection('users');
  
      const newUser = req.body;
  
      // Check if the email already exists
      const existingUser = await userCollection.findOne({ email: newUser.email });
  
      if (existingUser) {
        // Email already exists, inform the user
        res.status(400).json({ message: 'Email already exists. Please choose another one.' });
      } else {
        // Email is not found, proceed to insert the new user
        const result = await userCollection.insertOne(newUser);
        res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
      }
    } catch (error) {
      console.error('An error occurred while entering user:', error);
      res.status(500).json({ message: 'An error occurred while entering user' });
    }
  });
  app.post('/api/login', async (req, res) => {
    try {
      const db = await getDb();
      const userCollection = await db.collection('users');
      const { email, password } = req.body;
    
  
      // Check if the email exists in the database
      const user = await userCollection.findOne({ email });
  
      if (!user) {
        // User not found
        return res.status(401).json({ message: 'Login failed. Invalid email or password.' });
      }
  
      // Convert and compare the entered password
      const enteredPassword = convertAndComparePassword(password, randomNumber, user.password);
  
      if (enteredPassword === user.password) {
        // Passwords match, login successful
        res.status(200).json({ message: 'Login successful', user });
      } else {
        // Passwords do not match
        res.status(401).json({ message: 'Login failed. Invalid email or password.' });
      }
    } catch (error) {
      console.error('An error occurred while logging in:', error);
      res.status(500).json({ message: 'An error occurred while logging in' });
    }
  });
  
  // Function to convert and compare the entered password
  function convertAndComparePassword(enteredPassword, randomNumber, storedPassword) {
    let convertedPassword = '';
    for (let i = 0; i < enteredPassword.length; i++) {
      const char = enteredPassword.charAt(i);
      let modifiedAscii; // Declare modifiedAscii here to make it available in all cases
  
      if (char >= 'a' && char <= 'z') {
        // Check if the character is a lowercase letter
        const ascii = char.charCodeAt(0);
        modifiedAscii = ascii - randomNumber;
  
        // Ensure the result is within the lowercase ASCII range
        if (modifiedAscii < 97) {
          modifiedAscii += 26; // Wrap around to the end of the lowercase letters
        }
      } else {
        // Character is not a lowercase letter, keep it as-is
        modifiedAscii = char.charCodeAt(0);
      }
  
      convertedPassword += String.fromCharCode(modifiedAscii);
  
    }
    return convertedPassword;
  }
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});