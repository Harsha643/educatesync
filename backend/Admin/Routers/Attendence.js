const express = require("express");
const router = express.Router();
const attendanceController = require("../Controllers/Attendence");



router.get("/", attendanceController.getAttendence);
router.get("/:id", attendanceController.getAttendenceById);
router.get("/classAttendance/:classNumber",attendanceController.getAttendenceByClassNumber)
router.get("/:studentName", attendanceController.getAttendenceByName);
router.post("/", attendanceController.createAttendence);
router.put("/:id", attendanceController.updateAttendence);
router.delete("/:id", attendanceController.deleteAttendence);

module.exports = router;
