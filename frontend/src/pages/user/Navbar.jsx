import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeOutlined,
  BulbOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

export const menuItems = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: (
      <NavLink to={"/user"} className="text-white">
        Trang chủ
      </NavLink>
    ),
    className: "text-white text-lg",
  },
  {
    key: "suggestions",
    icon: <BulbOutlined />,
    label: (
      <NavLink to={"/user/suggestion"} className="text-white">
        Gợi ý
      </NavLink>
    ),
    className: "text-white text-lg",
  },
  {
    key: "reports",
    icon: <BarChartOutlined />,
    label: (
      <NavLink to={"/user/report"} className="text-white">
        Báo cáo
      </NavLink>
    ),
    className: "text-white text-lg",
  },
];
