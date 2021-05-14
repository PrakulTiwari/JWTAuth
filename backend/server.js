require('dotenv').config()
const cors = require('cors')
const express =  require('express')
const mongoose = require('mongoose')
const app = express()
const User = require('./model/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

mongoose.connect(process.env.dbURI,{ useUnifiedTopology: true ,useNewUrlParser: true,useCreateIndex:true })
    .then(console.log('db connected'))

app.use(express.json())
app.use(cors())

app.post('/api/login',async (req,res)=>{
    const {username,password} = req.body
    const user = await User.findOne({username}).lean()

    if(!user){
       return res.json({status:'error',data:'invalid username/password'})
    }
    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET)

        return res.json({status:'ok',data:token})
    }

    res.json({status:'error',data:'invalid username/password'})
})

app.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			console.log(error)
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	return res.json({ status: 'ok' })
})

app.post('/api/change-password',async (req,res)=>{
	const {token,newpassword:plainTextPassword} = req.body
	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}
	try{
	const user = jwt.verify(token,process.env.JWT_SECRET)
	const _id = user.id
	const hashedpassword = await bcrypt.hash(plainTextPassword,10)
	await User.updateOne({_id},{
		$set:{hashedpassword}
	})
	}
	catch (error){
		res.json({ status:'error',data:'nopes'})
	}
	res.json({status:'ok'})
})


app.listen(3000,()=>{
    console.log('hey i am running')
})