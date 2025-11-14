import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import App from "./app/App";
import { AppThemeProvider } from "./app/theme/AppThemeProvider";
import "./app/theme/global.css";

dayjs.extend(utc);
dayjs.extend(timezone);

const queryClient = new QueryClient();

const container = document.getElementById("root");

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ConfigProvider locale={zhCN}>
            <AntdApp>
              <AppThemeProvider>
                <App />
              </AppThemeProvider>
            </AntdApp>
          </ConfigProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
} else {
  console.error("Cannot find root container");
}
