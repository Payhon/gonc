import { Badge, Card, Descriptions, List, Timeline, Typography } from "antd";
import type { ReactNode } from "react";

const timelineItems = [
  { label: "候选地址收集", status: "blue", description: "已获取 4 个候选地址" },
  { label: "向对端发起打洞", status: "processing", description: "等待响应..." }
];

const sessionFacts = [
  { key: "本地 NAT", value: "Symmetric NAT" },
  { key: "远端 NAT", value: "Port Restricted Cone" },
  { key: "协调方式", value: "内置 MQTT" },
  { key: "状态", value: "协商中" }
];

export const P2PConsolePage = () => {
  return (
    <Card title="P2P 控制台">
      <Typography.Paragraph type="secondary">
        监控打洞流程、切换协调策略、查看候选地址及会话日志。
      </Typography.Paragraph>
      <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
        {sessionFacts.map((item) => (
          <Descriptions.Item key={item.key} label={item.key}>
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Typography.Title level={5}>打洞流程</Typography.Title>
      <Timeline
        style={{ marginBottom: 24 }}
        items={timelineItems.map((item) => ({
          color: item.status as "blue" | "green" | "red",
          children: (
            <div>
              <Typography.Text strong>{item.label}</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }}>{item.description}</Typography.Paragraph>
            </div>
          )
        }))}
      />
      <Typography.Title level={5}>候选地址</Typography.Title>
      <List
        bordered
        dataSource={[
          { endpoint: "192.168.1.10:5050", state: "available" },
          { endpoint: "100.64.10.20:4433", state: "testing" }
        ]}
        renderItem={(item) => (
          <List.Item>
            <SpaceBetween>
              <Typography.Text>{item.endpoint}</Typography.Text>
              <Badge status={item.state === "available" ? "success" : "processing"} text={item.state} />
            </SpaceBetween>
          </List.Item>
        )}
      />
    </Card>
  );
};

const SpaceBetween = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>{children}</div>
);
