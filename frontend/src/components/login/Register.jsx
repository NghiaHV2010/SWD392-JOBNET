import React, { useState } from 'react';
import { Button, Form, Input, Checkbox, Card, message } from 'antd';
import { Mail, Lock, User, Building } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom'

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h1>
          <p className="text-gray-600">Tạo tài khoản Job Portal AI</p>
        </div>

        <Form
          name="register"
          // onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input
              prefix={<User className="w-4 h-4 text-gray-400" />}
              placeholder="Nhập họ tên"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
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
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<Lock className="w-4 h-4 text-gray-400" />}
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<Lock className="w-4 h-4 text-gray-400" />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => 
                value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản!'))
              }
            ]}
          >
            <Checkbox>
              Tôi đồng ý với điều khoản sử dụng
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div className="text-center">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <Button 
              type="link" 
              onClick={() => navigate("/login")}
              className="p-0 text-blue-600 hover:text-blue-700"
            >
              Đăng nhập ngay
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register;