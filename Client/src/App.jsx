import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./modules/components/Login"
import AdminDashboard from "./modules/components/AdminDashboard"
import MasterDashboard from "./modules/components/MasterDashboard"
import ParentDashboard from "./modules/components/ParentDashboard"
import PrivateRoute from "./modules/components/PrivateRouter"
import ChangePassword from "./modules/components/ChangePassword"
import AddDojo from "./modules/components/AddDojo"
import DojoDetails from "./modules/components/DojoDetails"
import ViewMaster from "./modules/components/ViewMasters"
import MasterDetails from "./modules/components/MasterDetails"
import AddMaster from "./modules/components/AddMaster"
import ViewStudents from "./modules/components/ViewStudents"
import StudentDetails from "./modules/components/StudentDetails"
import FilterStudentsByDojo from "./modules/components/FilterStudentsByDojo"
import SendNotification from "./modules/components/SendNotification"
import Register from "./modules/components/Register"
import MasterStudent from "./modules/components/MasterStudent"
import CreateStudent from "./modules/components/CreateStudent"
import FetchNotifications from "./modules/components/FetchNotification"
import StudentAttendance from "./modules/components/StudentAttendance"
import AdminNotification from "./modules/components/AdminNotification"


function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element = {<Login/>}/>
        {/* <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/master-dashboard" element={<MasterDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} /> */}
        <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-dojo" element={<AddDojo />} />
          <Route path="/dojo-details/:id" element={<DojoDetails />} />
          <Route path="/masters" element={<ViewMaster/>}/>
          <Route path="/admin/master/:id" element={<MasterDetails />} />
          <Route path="/add-master" element={<AddMaster />} />
          <Route path="/students" element={<ViewStudents />} />
          <Route path="/student/:id" element={<StudentDetails />} />
          <Route path="/filter-students" element={<FilterStudentsByDojo />} />
          <Route path="/send-notification" element={<SendNotification />} />
          <Route path="/notifications" element={<AdminNotification/>} />

          
          


        </Route>
        
        <Route element={<PrivateRoute allowedRoles={['Master']} />}>
          <Route path="/master-dashboard" element={<MasterDashboard />} />
          <Route path="/MasterStudent/:id" element={<MasterStudent />} />
          <Route path="/add-students" element={<CreateStudent />} />
          <Route path="/master-notifications" element={<FetchNotifications />} />
          <Route path="/student-attendance" element={<StudentAttendance />} />



          {/* <Route path="//MasterStudent/${student._id}" element={<MasterDashboard />} />
   <Route path="/view-students" element={<ViewStudents />} />
   <Route path="/student/:id" element={<ViewStudent />} />
   <Route path="/student-attendance" element={<StudentAttendance />} />
   <Route path="/achievements" element={<AddAchievements />} />
   <Route path="/notifications" element={<ViewNotifications />} /> */}
        </Route>
        
        <Route element={<PrivateRoute allowedRoles={['Parent']} />}>
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
        </Route>
        <Route path="/change-password" element = {<ChangePassword/>}/>
        <Route path="/register" element={<Register/>}/>
        
    </Routes>
    </BrowserRouter>
  )
}

export default App

