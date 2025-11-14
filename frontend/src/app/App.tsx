import { Navigate, Route, Routes } from "react-router-dom";
import { Skeleton } from "antd";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/Dashboard";
import { ConnectionsPage } from "./pages/Connections";
import { P2PConsolePage } from "./pages/P2PConsole";
import { FileServicesPage } from "./pages/FileServices";
import { ProxyCenterPage } from "./pages/ProxyCenter";
import { TerminalLogsPage } from "./pages/TerminalLogs";
import { SettingsPage } from "./pages/Settings";
import { TemplatesPage } from "./pages/Templates";
import { useAppBootstrap } from "./hooks/useAppBootstrap";

const LoadingScreen = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Skeleton active paragraph={{ rows: 6 }} style={{ width: 480 }} />
  </div>
);

const App = () => {
  const { data, isLoading } = useAppBootstrap();

  if (isLoading || !data) {
    return <LoadingScreen />;
  }

  return (
    <MainLayout version={data.version}>
      <Routes>
        <Route path="/" element={<DashboardPage version={data.version} />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/p2p" element={<P2PConsolePage />} />
        <Route path="/files" element={<FileServicesPage />} />
        <Route path="/proxy" element={<ProxyCenterPage />} />
        <Route path="/terminal" element={<TerminalLogsPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
