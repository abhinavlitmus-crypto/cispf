import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { message, Spin } from "antd";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import commonObj from "./commonObj";
import { useValidateTokenMutation } from "./query/admin.query";
import Loader from "./views/components/Loaders/loader";
import SiteLoader from "./views/components/Loaders/SiteLoader";
import Login from "./views/pages/Login";
import Consent from "./views/components/consent/Consent";
import { useMouseIdleLogout } from './views/components/LogoutSession/LogoutSession';
import { useLogoutSaveMutation } from './query/logout.query';
import { Link, useNavigate } from "react-router-dom";

Spin.setDefaultIndicator(
  <div>
    <Loader />
  </div>,
);

const LayoutAdmin = React.lazy(() => import("./views/layout/Layout"));

function AuthGate() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const validateTokenMutation = useValidateTokenMutation();
  const navigate = useNavigate();

  const isIntitialCheck = useRef(true); 
  const useSave = useLogoutSaveMutation();

 const EraseUserData = () => {
		const dateOnly = () => {
			const d = new Date();
			d.setHours(0, 0, 0, 0);
			return d;
		};

		const todayDate = dateOnly();
		const payload = {
			userId: commonObj?._id,
			date: todayDate,
		};
		useSave.mutate(
			payload
		)
		window.localStorage.clear();
		navigate("/", { replace: true });
		window.location.reload();
	};

  useMouseIdleLogout({
    minutes:20,
    onLogout: EraseUserData,
  })
  useEffect(() => {
    validateTokenMutation.mutate(null, {
      onSuccess: (res) => {
        // console.log("VALIDATE TOKEN RESPONSE", res.data)
        setIsLoggedin(true);
        commonObj.userType = res.data.type;
        commonObj.adminRights = res.data.adminRights || [];
        commonObj.name = res.data.name;
        commonObj.avatar = res.data.avatar;
        commonObj._id = res.data._id;
        commonObj.moduleAccess = res.data.moduleAccess || {};
  
        message.success(res.message);
      },
      onError: () => {
        setIsLoggedin(false);
        window.localStorage.clear();
        if(isIntitialCheck.current){
          message.error("Unauthorized. Login Again!!");
        }
      },
    });
    isIntitialCheck.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (validateTokenMutation.isPending) return <SiteLoader />;

  return isLoggedin ? (
    <Suspense fallback={<SiteLoader />}>
      <LayoutAdmin />
    </Suspense>
  ) : (
    <Suspense fallback={<SiteLoader />}>
      <Login />
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        {/* ✅ Public page: NO auth, NO menu, NO layout */}
        <Route path="/consent" element={<Consent />} />

        {/* 🔒 Everything else behaves like before */}
        <Route path="/*" element={<AuthGate />} />
      </Routes>

      <ReactQueryDevtools />
    </BrowserRouter>
  );
}

export default App;
