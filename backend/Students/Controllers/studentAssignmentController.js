const StudentAssignment = require('../models/studentAssignmentmodels')

exports.getSubmissions = async (req, res) => {
    try {
        const submissions = await StudentAssignment.find();
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getSubmissionById=async (req,res)=>{
    const id=req.params.id;
    try {
        const submission=await StudentAssignment.findById(id);
        if(!submission){
            return res.status(404).json({ message: "Submission not found" });
            }
            res.status(200).json(submission);
            } catch (error) {
                res.status(500).json({ message: error.message });
                }
}

exports.createSubmission = async (req, res) => {
    console.log(req.body)
    try {
        const { classNumber,rollNumber,subject,topic,link } = req.body;

        const newSubmission = new StudentAssignment({
            classNumber,
            rollNumber,
            subject,
            topic,
            link,
            submittedAt:new Date()
        });

        await newSubmission.save();

        res.status(201).json({ message: "Submission created successfully", submission: newSubmission });
    } catch (error) {
        res.status(500).json({ message: "Error creating submission", error: error.message });
    }
}

exports.updateSubmission = async (req, res) => {
    try {
        const updatedSubmission = await StudentAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSubmission) return res.status(404).json({ message: "Submission not found" });
        res.status(200).json({ message: "Submission updated successfully", submission: updatedSubmission });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
    }
exports.deleteSubmission = async (req, res) => {    

    try {
        const deletedSubmission = await StudentAssignment.findByIdAndDelete(req.params.id);
        if (!deletedSubmission) return res.status(404).json({ message: "Submission not found" });
        res.status(200).json({ message: "Submission deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
