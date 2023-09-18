const LOGIN = require('../models/Login')
const CATEGORY = require('../models/category')
const BLOGDATA = require('../models/blogData')
const ADLOGIN = require('../models/ADLogin ')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

async function main(email) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'divyeshgabani072@gmail.com',
        pass: 'ytlauqyilszsgned'
      }
    });
  
    let message = {
      from: 'divyeshgabani072@gmail.com',
      to: email,
      subject: 'Nodemailer is unicode friendly ✔',
      text: 'Hello to myself!',
      html: '<p><b>you are registered successfully</p>'
    };
  
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }
  
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  }

// ----------------------------login--------------------------------

  exports.secure = async function (req, res, next) {
      try {
          const token = req.headers.token;
          if(!token){
              throw new Error("Please enter token")
          }
          const checkToken = await jwt.verify(token, "CDMI")
          next()
      } catch (err) {
          res.status(401).json({
              message: err.message
          })
      }
  }
  exports.ADsecure = async function (req, res, next) {
    try {
        const token = req.headers.token;
        if(!token){
            throw new Error("Please enter token")
        }
        const checkToken = await jwt.verify(token, "ADMIN")
        next()
    } catch (err) {
        res.status(401).json({
            message: err.message
        })
    }
}
  exports.register = async function (req, res, next) {
      try {
        let fname = req.body.fname
        let email = req.body.email
        let username = req.body.username
        let password = req.body.password
    
        if (!fname || !email || !username || !password) {
          throw new Error("Please enter valid field")
        }
    
        let data = {
          fname: fname,
          email: email,
          username: username,
          password: await bcrypt.hash(password, 10)
        }
        const newUser = await LOGIN.create(data)
        await main(email)
        const token = await jwt.sign({id: newUser._id}, "CDMI")
        res.status(201).json({
          status: "success",
          message: "user create successful",
          data: newUser,
          token
        })
      } catch (err) {
        res.status(404).json({
          status: "fail",
          message: err.message,
        })
      }
  }
  exports.login = async function (req, res, next) {
      try {
        let username = req.body.username;
        let password = req.body.password;
    
        const data = await LOGIN.findOne({ username: username })
        if (!data) {
          throw new Error("User Not found")
        }
    
        const checkPass = await bcrypt.compare(password, data.password)
        if (!checkPass) {
          throw new Error("Password is wrong!")
        }

        const token = await jwt.sign({id: data._id}, "CDMI")

        res.status(200).json({
          status: "success",
          message: "Login Successfully",
          data: data,
            token
        })
      } catch (err) {
        res.status(404).json({
          status: "fail",
          message: err.message,
        })
      }
  }
  exports.adminLogin = async function (req, res, next) {  
    try {
      let username = req.body.username;
      let password = req.body.password;
  
      const data = await ADLOGIN.findOne({ username: username })
      if (!data) {
        throw new Error("User Not found")
      }
  
      const checkPass = await bcrypt.compare(password, data.password)
      if (!checkPass) {
        throw new Error("Password is wrong!")
      }

      const token = await jwt.sign({id: data._id}, "ADMIN")

      res.status(200).json({
        status: "success",
        message: "Login Successfully",
        data: data,
          token
      })
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      })
    }
}
  exports.adminRegister = async function (req, res, next) {
    try {
      let username = req.body.username
      let password = req.body.password

      if (!username || !password) {
        throw new Error("Please enter valid field")
      }

      let data = {
        username: username,
        password: await bcrypt.hash(password, 10)
      }
      const newUser = await ADLOGIN.create(data)
      const token = await jwt.sign({id: newUser._id}, "CDMI")
      res.status(201).json({
        status: "success",
        message: "user create successful",
        data: newUser,
        token
      })
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      })
    }
  }
  exports.allUsers =  async function (req, res, next) {
      try {
        const data = await LOGIN.find()        
        res.status(200).json({
          status: "success",
          message: "All data found",
          data: data
        })
      } catch (err) {
        res.status(404).json({
          status: "fail",
          message: err.message,
        })
      }
  }

  // -------------------------category----------------------------

  exports.cateCreate = async function(req, res, next) {
    try {
      let categoryName = req.body.category
  
      if(!categoryName){
        throw new Error("Fill required field")
      }
      let data ={
        category : categoryName
      }
      const newCategory = await CATEGORY.create(data)
  
      res.status(201).json({
        status: 'success',
        message: "Data inserted successfully",
        data: newCategory
      })
  
    } catch (error) {
        res.status(404).json({
        status: "fail",
        message: error.message, 
        })
    }
  }
  exports.cateUpdate = async function(req, res, next) {
    try {
        let index = req.query.id
        await CATEGORY.findByIdAndUpdate(index,req.body)
    
        newCate = await CATEGORY.findById(index)
    
        res.status(200).json({
        status: 'success',
        message: "Data updated successfully",
        data: newCate
        })
        
    } catch (err) {
        res.status(404).json({
        status: "fail",
        message: err.message,
        })
    }
  }
  exports.cateDelete =async function(req, res, next) {
    try {
        let index = req.query.id
        const newCate = await CATEGORY.findByIdAndDelete(index)
    
        res.status(200).json({
        status: 'success',
        message: "Data deleted successfully",
        data: newCate
        })
    
    } catch (err) {
        res.status(404).json({
        status: "fail",
        message: err.message,
        })
    }
  }
  exports.allCategory = async function(req, res, next) {
    try {
  
      const allcategory = await CATEGORY.find()
  
      res.status(200).json({
        status: 'success',
        message: "Data found successfully",
        data: allcategory
      })
    } catch (err) {
        res.status(404).json({
        status: "fail",
        message: err.message, 
        })
    }
}

// ---------------------------blogData---------------------------------------

  exports.blogCreate = async function(req, res, next) {
    try {
      let title = req.body.title
      let desc = req.body.description
      let category = req.body.category
      let blogImg = req.file.filename

      if(!title || !desc || !category){
        throw new Error("Fill required field")
      } 
      let data ={
        title : title,
        description : desc,
        category : category,
        blogImage: blogImg
      }
      const newBlog = await BLOGDATA.create(data)

      res.status(200).json({
        status: 'success',
        message: "Data found successfully",
       data
      })
    } catch (err) {
        res.status(404).json({
        status: "fail",
        message: err.message, 
        })
    }
  }
  exports.blogUpdate = async function(req, res, next) {
    try {
      let index = req.query.id
      await BLOGDATA.findByIdAndUpdate(index,req.body)
  
      let newQuiz = await BLOGDATA.findById(index)
  
      res.status(200).json({
        status: 'success',
        message: "Data updated successfully",
        data: newQuiz
      })
      
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      })
    }
  }
  exports.blogDelete = async function(req, res, next) {
    try {
      let index = req.query.id
      const newQuiz = await BLOGDATA.findByIdAndDelete(index)
  
      res.status(200).json({
        status: 'success',
        message: "Data deleted successfully",
        data: newQuiz
      })
  
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      })
    }
  }
  exports.allData = async function(req, res, next) {
    try {
      const newStd = await BLOGDATA.find().populate('category')
      res.status(200).json({
        status: 'success',
        message: "Data found successfully",   
        data: newStd
      })
  
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      })
    }
  }
  exports.detailData = async function(req, res, next) {
    let id = req.query.id
    try {
      const newStd = await BLOGDATA.findById(id).populate('category')
      res.status(200).json({
        status: 'success',
        message: "Data found successfully",   
        data: newStd
      })
  
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      })
    }
  }
  exports.searchData =async function(req, res, next) {
    try {
      const newStd = await BLOGDATA.find({title: {$regex: req.query.search, $options: 'i' }})
  
      res.status(200).json({
        status: 'success',
        message: "Data found successfully",
        data: newStd
      })
  
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err.message,
      })
    }
  };