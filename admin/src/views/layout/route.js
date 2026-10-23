import {
  BranchesOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  AppstoreOutlined,
  LinkOutlined,
  HddOutlined,
  FileTextOutlined,
  AccountBookFilled,
  ClockCircleOutlined,
  DashboardOutlined,
  BarChartOutlined,
  SafetyOutlined,
  FormOutlined,
  RedoOutlined,
  InboxOutlined,
  ControlOutlined,
  ReadOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  TranslationOutlined,
  TagsOutlined,
  QuestionCircleOutlined,
  FileDoneOutlined,
  IdcardOutlined,
  MailOutlined,
  GlobalOutlined as WebsiteOutlined,
  CalendarOutlined as EventOutlined,
  CommentOutlined as DiscussionOutlined,
  TeamOutlined as MembersOutlined,
} from "@ant-design/icons";
import { Blog } from "../pages/Blog/Blog";

import Location from "../pages/location/location";

import Enquiries from "../pages/Enquiry/Enquiries";

import { Author } from "../pages/Blog/Author";
import AdminProfile from "../pages/Adminprofile";
import util from "../../utils/util";
import { SubAdmin } from "../pages/super-admin/Subadmin";
import Store from "../pages/Store/store";
import Plan from "../pages/plan/plan";
import { Institute } from "../pages/Institute/Institute";
import { Branch } from "../pages/Branch/Branch";
import { City } from "../pages/City/City";
import { Exam } from "../pages/exam/exam";
import { Listing } from "../pages/listing/listing";
import AddEditForm from "../pages/Branch/AddEditForm";
import AddEditFormListing from "../pages/listing/AddEditForm";
import { ContactUsStudent } from "../pages/Leads/ContactUsStudent";
import { ContactUsInstitute } from "../pages/Leads/ContactUsInstitute";
import { ContactEnquiries } from "../pages/Leads/Enqueries";
import { ContactInstitute } from "../pages/Leads/InstituteQueries";
import { Privacy } from "../pages/Confidential/privacy";
import { Terms } from "../pages/Confidential/terms";
import { Disclaimer } from "../pages/Confidential/disclaimer";
import ParentChildLayout from "../pages/listing/SetListing";
import ExamCityListing from "../pages/listing/SetListing";
import { Header } from "../pages/Header/Header";
import { Footer } from "../pages/Footer/Footer";
import { Youtube } from "../pages/Youtube/youtube";
import { OnlineCoaching } from "../pages/onlineCoaching/online";
import { OfflineCoaching } from "../pages/offlineCoaching/offline";
import { AdvertiseQueries } from "../pages/Leads/AdvertiseQuery";
import { ListingQueries } from "../pages/Leads/ListingQueries";
import { Client } from "../pages/Client-Outreach/Client";
import { Engagement } from "../pages/Engagement/Engagement";
import { Prep } from "../pages/Prep/Prep";
import { Inventory } from "../pages/Inventory/Inventory";
import { Asset } from "../pages/Asset/Asset";
import { Documents } from "../pages/Documents/Documents";
import { Management } from "../pages/Management/Management";
import { Art } from "../pages/Art/Art";
import { Profile } from "../pages/setting/profile";
import { Attendance } from "../pages/Attendance/Attendance";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Follow } from "../pages/Follow/Follow";
import { Hiv } from "../pages/Hiv/Hiv";
import { AssignInventory } from "../pages/Inventory/AssignInventory";
import { Testing } from "../pages/Testing/Testing";
import { PermissionApproval } from "../pages/Permission-Approval/PermissionApproval";
import { Master } from "../pages/Master/Master";
import { Audit } from "../pages/Audit/Audits";
import { Incentives } from "../pages/Incentives/Incentives";
import { Trainer } from "../pages/Trainer/Trainer";
import { Learner } from "../pages/Learner/Learner";
import { Batch } from "../pages/Batch/Batch";
// import { PayRoll } from "../pages/PayRoll/PayRoll";
import { TrainerIncentive } from "../pages/Trainer-Incentive/TrainerIncentive";
import { Beneficiaries } from "../pages/Beneficiaries/Beneficiaries";
import { Payment } from "../pages/Payment/Payment";
import { User } from "../pages/User/User";
import { Course } from "../pages/Course/Course";
import { Quiz } from "../pages/Quiz/Quiz";
import { Assessment } from "../pages/Assessment/Assessment";
import { FormBuilder } from "../pages/FormBuilder/FormBuilder";
import { Newsletter } from "../pages/Newsletter/Newsletter";
import { Events, PolicyDiscussion, Team } from "../pages/WebsitePage/WebsitePage";
import { State } from "../pages/State/State";
import { Language } from "../pages/Language/Language";
import { CourseType } from "../pages/CourseType/CourseType";
const allRoutes = [
  // {
  //   title: "Users",
  //   icon: CalendarOutlined,
  //   hidden: !util.checkRightAccess("SuperAdmin"),

  //   url: "/users",
  //   children: [
  //     {
  //       title: "Portal Users",
  //       icon: CalendarOutlined,
  //       url: "data",
  //       component: SubAdmin,
  //     },
  //     {
  //       title: "App Users",
  //       icon: CalendarOutlined,
  //       url: "app",
  //       component: User,
  //     },
  //   ],
  // },
  // {
  //   title: "Dashboard",
  //   icon: DashboardOutlined,
  //   url: "/dashboard",
  //   component: Dashboard,
  // },
  // {
  //   title: "Course",
  //   icon: TeamOutlined,
  //   url: "/course",
  //   component: Course,
  //   hidden: !util.checkRightAccess("course"),
  // },
  // {
  //   title: "Category",
  //   icon: CalendarOutlined,
  //   hidden: !util.checkRightAccess("category"),

  //   url: "/category",
  //   children: [
  //     {
  //       title: "City",
  //       icon: CalendarOutlined,
  //       url: "/city",
  //       component: City,
  //     },
  //     {
  //       title: "State",
  //       icon: CalendarOutlined,
  //       url: "/state",
  //       component: State,
  //     },
  //     {
  //       title: "Language",
  //       icon: CalendarOutlined,
  //       url: "/language",
  //       component: Language,
  //     },
  //     {
  //       title: "Course Type",
  //       icon: CalendarOutlined,
  //       url: "/course-type",
  //       component: CourseType,
  //     },
  //     {
  //       title: "Quiz",
  //       icon: CalendarOutlined,
  //       url: "/quiz",
  //       component: Quiz,
  //     },

  //   ],
  // },


  // Menu Heading

  // {
  //   title: "Overview",
  //   type: "group",
  //   children: [
  //     {
  //       title: "Dashboard",
  //       url: "/dashboard",
  //       icon: DashboardOutlined,
  //       component: Dashboard,
  //     },
  //     {
  //       title: "Course",
  //       url: "/course",
  //       icon: ReadOutlined,
  //       component: Course,
  //       hidden: !util.checkRightAccess("course"),
  //     },
  //   ],
  // },
  // {
  //   title: "Management",
  //   type: "group",
  //   children: [
  //     // {
  //     //   title: "Users",
  //     //   icon: TeamOutlined,
  //     //   hidden: !util.checkRightAccess("SuperAdmin"),

  //     //   url: "/users",
  //     //   children: [
  //     //     {
  //     //       title: "Portal Users",
  //     //       icon: SafetyOutlined,
  //     //       url: "data",
  //     //       component: SubAdmin,
  //     //     },
  //     //     {
  //     //       title: "App Users",
  //     //       icon: UserOutlined,
  //     //       url: "app",
  //     //       component: User,
  //     //     },
  //     //   ],
  //     // },
  //     {
  //       title: "Category",
  //       icon: AppstoreOutlined,
  //       url: "/category",
  //       hidden: !util.checkRightAccess("category"),
  //       children: [
  //         {
  //           title: "City",
  //           icon: EnvironmentOutlined,
  //           url: "/city",
  //           component: City,
  //           hidden: !util.checkRightAccess("city"),
  //         },
  //         {
  //           title: "State",
  //           icon: GlobalOutlined,
  //           url: "/state",
  //           component: State,
  //           hidden: !util.checkRightAccess("state"),
  //         },
  //         {
  //           title: "Language",
  //           icon: TranslationOutlined,
  //           url: "/language",
  //           component: Language,
  //           hidden: !util.checkRightAccess("language"),
  //         },
  //         {
  //           title: "Course Type",
  //           icon: TagsOutlined,
  //           url: "/course-type",
  //           component: CourseType,
  //           hidden: !util.checkRightAccess("course-type"),
  //         },
  //         {
  //           title: "Quiz",
  //           icon: QuestionCircleOutlined,
  //           url: "/quiz",
  //           component: Quiz,
  //           hidden: !util.checkRightAccess("quiz"),
  //         },
  //         {
  //           title: "Assessment",
  //           icon: FileDoneOutlined,
  //           url: "/assesment",
  //           component: Assessment,
  //           hidden: !util.checkRightAccess("assesment"),
  //         },
  //       ],

  //     },

  //   ],
  // },


  // -----------------------
  {
    title: "Profile",
    icon: IdcardOutlined,
    url: "/profile",
    component: Profile,
    // hidden: !util.checkRightAccess("SuperAdmin"),

  },

  // {
  //   title: "Form Builder",
  //   icon: FormOutlined,
  //   url: "/form-builder",
  //   component: FormBuilder,
  //   hidden: !util.checkRightAccess("SuperAdmin"),
  // },

  {
    title: "Newsletter",
    icon: MailOutlined,
    url: "/newsletter",
    component: Newsletter,
    hidden: !util.checkRightAccess("newsletter"),
  },

  {
    title: "Website Pages",
    icon: WebsiteOutlined,
    url: "/website-pages",
    hidden: !util.checkRightAccess("website-pages"),
    children: [
      {
        title: "Events",
        icon: EventOutlined,
        url: "/events",
        component: Events,
        hidden: !util.checkRightAccess("events"),
      },
      {
        title: "Policy Discussion",
        icon: DiscussionOutlined,
        url: "/policy-discussion",
        component: PolicyDiscussion,
        hidden: !util.checkRightAccess("policy-discussion"),
      },
      {
        title: "Team",
        icon: MembersOutlined,
        url: "/team",
        component: Team,
        hidden: !util.checkRightAccess("team"),
      },
    ],
  },



].filter((v) => !v.hidden || v.children?.length);

export default allRoutes;



