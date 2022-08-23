const express = require('express')
const router =  express.Router()
// const path = require('path')
const employeesControler = require('../../controllers/employeesController')
const ROLES_LIST =require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')


router.route('/')
     .get(employeesControler.getAllEmployees)
     .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), employeesControler.createNewEmployee)
     .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesControler.updateEmployee)
     .delete(verifyRoles(ROLES_LIST.Admin), employeesControler.deleteEmployee)

router.route('/:id')
  .get(employeesControler.getEmployee)

module.exports = router