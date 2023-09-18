var express = require('express');
var router = express.Router();
const userController = require('../UserController/LoginControl')

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/blog')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

router.post('/admin/register',  userController.adminRegister);
router.post('/admin/login',  userController.adminLogin);
router.get('/allUsers', userController.secure , userController.allUsers);

router.post('/register', userController.register);
router.post('/login',  userController.login);


router.post('/category/create',  userController.ADsecure ,userController.cateCreate);
router.post('/category/update', userController.ADsecure , userController.cateUpdate);
router.delete('/category/delete', userController.ADsecure, userController.cateDelete);
router.get('/category/allCategory',userController.ADsecure,userController.allCategory);

router.post('/blog/create',userController.ADsecure, upload.single('blogImage'), userController.blogCreate)
router.patch('/blog/update',userController.ADsecure, userController.blogUpdate)
router.delete('/blog/delete',userController.ADsecure, userController.blogDelete)
router.get('/blog/allData', userController.allData)
router.get('/blog/detailData',userController.secure, userController.detailData)

router.get('/searchData',userController.searchData);



module.exports = router;