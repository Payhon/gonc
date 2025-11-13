import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Layout, Menu, Space, Switch, Typography } from "antd";
import type { MenuProps } from "antd";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../constants/nav";
import { useAppStore } from "../store/appStore";
import type { VersionOverview } from "../types";

const { Sider, Header, Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  version?: VersionOverview;
}

export const MainLayout = ({ children, version }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const collapsed = useAppStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const themeMode = useAppStore((state) => state.themeMode);
  const setThemeMode = useAppStore((state) => state.setThemeMode);

  const menuItems: MenuProps["items"] = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        key: item.path,
        icon: item.icon,
        label: item.label
      })),
    []
  );

  const selectedKey = useMemo(() => {
    const candidates = [...NAV_ITEMS].sort((a, b) => b.path.length - a.path.length);
    const match = candidates.find((item) => {
      if (item.path === "/") {
        return location.pathname === "/";
      }
      return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    });
    return match?.path ?? "/";
  }, [location.pathname]);

  const handleThemeToggle = (checked: boolean) => {
    setThemeMode(checked ? "dark" : "light");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        width={224}
        style={{ borderRight: "1px solid var(--ant-color-border)" }}
      >
        <div
          style={{
            height: 48,
            margin: 16,
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
            fontSize: collapsed ? 16 : 18
          }}
        >
          gonc GUI
        </div>
        <Menu
          theme={themeMode === "dark" ? "dark" : "light"}
          mode="inline"
          items={menuItems}
          selectedKeys={[selectedKey]}
          onClick={(info) => navigate(info.key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--ant-color-bg-container)"
          }}
        >
          <Space direction="vertical" size={0}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {NAV_ITEMS.find((item) => item.path === selectedKey)?.label ?? "总览"}
            </Typography.Title>
            {version && (
              <Typography.Text type="secondary">
                {version.name} {version.version}（{version.commit}）
              </Typography.Text>
            )}
          </Space>
          <Space>
            <Typography.Text>主题</Typography.Text>
            <Switch
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              checked={themeMode === "dark"}
              onChange={handleThemeToggle}
            />
          </Space>
        </Header>
        <Content style={{ margin: "16px", padding: 0 }}>
          <div
            style={{
              background: "var(--ant-color-bg-container)",
              padding: 24,
              minHeight: "calc(100vh - 160px)",
              borderRadius: 12
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>gonc © {new Date().getFullYear()} · 打洞更简单</Footer>
      </Layout>
    </Layout>
  );
};
