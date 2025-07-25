const express = require("express");
const router = express.Router();
const timetableController = require("../Controllers/Cs");
const multer = require("multer");

const upload = multer(); // Parse FormData without files

// Routes
router.get("/", timetableController.getAllTimetables);
router.post("/", upload.none(), timetableController.addTimetable);
router.get("/:className/:day", timetableController.getTimetableByDay);
router.get("/:className", timetableController.getTimetableByClass);
router.put("/:id", upload.none(), timetableController.updateTimetable);
router.delete("/:timetableId/:scheduleItemId", timetableController.deleteScheduleItem);


module.exports = router;