import { Button, Form, Input, message } from "antd";
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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(160deg,#097483_0%,#05636E_50%,#07545C_100%)] px-6 text-white">
      <img src={`${process.env.PUBLIC_URL}/logo-white.png`} alt="CISPF" className="mb-10 w-[min(280px,70vw)] object-contain" />
      <Form
        layout="vertical"
        size="large"
        onSubmitCapture={login}
        className="login-form w-full max-w-[320px]"
      >
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
        <div className="mt-8 flex justify-center">
          <Button
            ghost
            className="min-w-[180px] border-white tracking-[0.2em] text-white"
            htmlType="submit"
            loading={loginMutation.isPending}
          >
            LOGIN
          </Button>
        </div>
      </Form>
      <p className="absolute bottom-3 left-0 w-full px-6 text-center text-xs text-white/80">
        © {new Date().getFullYear()} CISPF. All rights reserved. Developed by{" "}
        <a href="https://litmusink.com/" className="underline" target="_blank" rel="noopener noreferrer">Litmusink</a>
      </p>
    </div>
  );
}
