import React, { useState } from "react";
import { Button, Form, Input, Checkbox, Card, message } from "antd";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { UserLogin } from "../../apis/UserServices";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { email, password } = values;
    if (email && password) {
      setIsLoading(true);
      try {
        const response = await UserLogin({ email, password });
        setIsLoading(false);

        if (response?.status === 200) {
          toast.success("Đăng nhập thành công!");
          navigate("/user");
        } else {
          toast.error("Đăng nhập thất bại!");
          console.log(response.data?.message || "Lỗi không xác định");
        }
      } catch (error) {
        setIsLoading(false);
        toast.error("Đăng nhập thất bại!");
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
          <p className="text-gray-600">Chào mừng trở lại Job Portal AI</p>
        </div>
        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<Mail className="w-4 h-4 text-gray-400" />}
              placeholder="Nhập email của bạn"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<Lock className="w-4 h-4 text-gray-400" />}
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="text-center">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Button
              type="link"
              onClick={() => navigate("/register")}
              className="p-0 text-blue-600 hover:text-blue-700"
            >
              Đăng ký ngay
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
