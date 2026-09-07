import { Button, Col, Form, Input, message, Row } from "antd";
import { useState } from "react";
import { useLoginMutation } from "../../query/admin.query";
import util from "../../utils/util";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({});
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();
  const login = () => {
    loginMutation.mutate(
      { ...data },
      {
        onSuccess: (res) => {
          console.log("userData from login button", res.data)
          util.setUserData(res.data);
          // navigate("/dashboard",{replace: true})
          navigate("/course", { replace: true })
          window.location.reload();

        },
        onError: (err) => {
          if (typeof err.message !== "string") {
            message.error(err.message[Object.keys(err.message)[0]][0]);
          } else {
            message.error(err.message);
          }
        },
      }
    );
  };

  return (
    <>
      <div className="bg-[#002428]  text-[#FAFDFF] flex justify-center items-center h-screen ">
        {/* <div className="w-1/2 hidden h-screen lg:flex justify-center items-center flex-col px-8 relative gap-14"> */}
        <div className="w-1/2 hidden h-screen  justify-center items-center flex-col px-8 relative gap-14">
          <div className="py-8">
            <div className="">
              {/* <img src="/image/logo-unfpa-blue.png" */}
              {/* <img src="/image/logo-unfpa-blue-Photoroom.png"
										alt="UNFPA"
										className="w-[18vw] object-contain" />{" "} */}
            </div>
            <br />
          </div>
          {/* <div>
            <p className="text-6xl font-medium text-white">UNFPA</p>
            <p className="text-5xl font-medium my-4 text-white">Welcome,</p>
            <p className="text-5xl font-medium my-3 text-white">
              To Your Dashboard!
            </p>
            <div className="h-[1px] bg-gray-500 w-full mb-2"></div>
            <div className="flex flex-row items-center -ml-4">
              <img src="/image/PrEP-Logo-Final-Cropped.png" alt="logo" className="h-14" />
              <img src="/image/eltonJohn.png" alt="logo" className="h-[2.8rem]" />
            </div>
          </div> */}

          <p className="text-left absolute bottom-0 w-full mb-2 text-[1rem] text-white">

            ©  {new Date().getFullYear()} . All right reserved
          </p>
          <p className="text-left absolute bottom-0 pl-[80%] w-full mb-2 text-xs text-white">
            Developed by <a href="https://litmusink.com/" className="text-blue-500" target="_blank" rel="noopener noreferrer">Litmusink</a>
          </p>
        </div>
        {/* <div className="h-[80%] w-[0.5px] bg-[#FAFDFF] hidden lg:block" /> */}
        <div className="h-[80%] w-[0.5px] bg-[#FAFDFF] hidden " />
        {/* <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2 "> */}
       {/* <div className="flex flex-col items-center p-8 w-full lg:w-1/2  gap-12 "> */}
        <div className="flex flex-col items-center p-8 w-full   gap-12 ">
          <div className="text-center">
            <h1 className="text-6xl font-medium mb-4">Welcome</h1>
            <h2 className="text-lg font-normal text-[#c2c9ce] mb-4">PLEASE LOGIN TO DASHBOARD</h2>
          </div>
          <Form layout="vertical" size="large" onSubmitCapture={login}>
            <Row gutter={[12, 2]} span={20}>
              <Col span={24}>
                <Form.Item>
                  <Input
                    placeholder="Email"
                    value={data.code}
                    onChange={(e) => {
                      setData({
                        ...data,
                        code: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <Input.Password
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) => {
                      setData({
                        ...data,
                        password: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} className="my-8">
                <Button
                  // type="primary"
                  className=" bg-[#F96000] text-white border-0 hover:bg-[#cc5002]"
                  htmlType="submit"
                  block
                  loading={loginMutation.isPending}
                >
                  Login
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
}
