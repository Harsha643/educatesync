
import {Routes,Route} from "react-router-dom" 
import Main1 from "../Mainpage/main1"
import Events from "../SchoolEvents/Events"
import Assign from "../SubjectAndClass/Assign"
import Gallery from "../Gallery/Gallery"
import StudentDataFetching from "../StudentManagement/StudentdataFetching"
import StaffDataFetching from "../StaffManagement/staffdata"
import Timetable from "../Time-Table/Timetable"
import FeeManagement from "../FeeManagement/FeeManagement"
import ClassManagement from "../ClassManagement/ClassManagement"
import Feedback from "../../StaftPage/Dashboard/Feedback"
import Notes from "../Notes/Notes"
import NewStdt from "../Newstudent/NewStdt"
import ClassTeacher from "../classTeacher/Classteacher"
import Dashboard from "../../Studentspage/Dashboard/Dashboard"


const RoutesComponent = () => {
    return(
        <Routes>
            <Route path="/" element={<Main1 />} />
            <Route path="NewStudent" element={<NewStdt />} />
            <Route path="Studentsdata" element={<StudentDataFetching />} />
            <Route path="Staffdata" element={<StaffDataFetching />} />
            <Route path="ClassManagement" element={<ClassManagement />} />
            <Route path="Timetable" element={<Timetable />} />
            <Route path="feemanagement" element={<FeeManagement />} />
            <Route path="Events" element={<Events />} />
            <Route path="Assign" element={<Assign />} />
            <Route path="Gallery" element={<Gallery />} />
            <Route path="Notes" element={<Notes />} />
            <Route path="Attendance" element={<ClassTeacher />||<h1>Attendance</h1>}/>
            <Route path="Feedback" element={<Feedback />} />
            
        </Routes>
    )
}
export default RoutesComponent;