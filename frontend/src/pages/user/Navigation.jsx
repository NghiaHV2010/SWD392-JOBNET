import React, { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Menu, Dropdown, Button, Layout, Avatar } from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Loading from "../../components/user/Loading";

export const Navigation = ({ children, menuNavbar }) => {
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Sider, Content } = Layout;
  const navigate = useNavigate();

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  const handleLogOut = () => {
    // Hiển thị hộp thoại xác nhận đăng xuất
    Swal.fire({
      title: "Are you sure?", // Tiêu đề của hộp thoại
      text: "Log Out Your Account!", // Nội dung chính của hộp thoại
      icon: "warning", // Hiển thị biểu tượng cảnh báo
      showCancelButton: true, // Hiển thị nút hủy
      confirmButtonText: "Yes, Log Out", // Văn bản nút xác nhận
      cancelButtonText: "No, cancel.", // Văn bản nút hủy
      reverseButtons: true, // Đảo ngược vị trí các nút
    }).then((result) => {
      // Kiểm tra kết quả khi người dùng nhấn vào nút
      if (result.isConfirmed) {
        // Nếu người dùng xác nhận đăng xuất
        // resetUserStore(); // Gọi hàm reset trạng thái người dùng (đăng xuất)

        // Hoặc hiển thị một thông báo thành công khác với SweetAlert2 (nếu muốn)
        Swal.fire({
          title: "Logged Out!",
          text: "You have successfully logged out.",
          icon: "success",
          timer: 2000, // Đóng sau 2 giây
          showConfirmButton: false, // Ẩn nút OK
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Nếu người dùng hủy
        Swal.fire({
          title: "Cancelled",
          text: "Cancelled Log Out!",
          icon: "error",
          timer: 2000, // Đóng sau 2 giây
          showConfirmButton: false, // Ẩn nút OK
        });
      }
    });
  };

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogOut
    },
  ];

  return (
    <Layout className="min-h-screen">
      {/* Vertical Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        className="shadow-lg"
        width={250}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <h1
            className={`font-bold text-blue-600 transition-all duration-200 ${
              collapsed ? "text-lg text-center" : "text-xl"
            }`}
          >
            {collapsed ? "JPA" : "Job Portal AI"}
          </h1>
        </div>
        <Menu
          mode="inline"
          items={menuNavbar}
          theme="light"
          className="h-full font-medium"
        />
      </Sider>

      <Layout>
        {/* Top Header */}
        <Header
          className="shadow-sm border-b px-4 flex items-center justify-between"
          style={{ backgroundColor: "white" }}
        >
          {/* Collapse Button */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />

          {/* User Menu */}
          <div className="flex items-center">
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Button type="text" className="flex items-center gap-2 h-auto">
                <Avatar size="small" icon={<UserOutlined />} />
                {!collapsed && <span>User</span>}
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content className="min-h-screen bg-white">
          <div>
            {loading ? (
              <Loading /> // Hiển thị component loading
            ) : (
              children // Không cần dấu ngoặc nhọn ở đây
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default memo(Navigation);
