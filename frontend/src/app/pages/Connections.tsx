import { Button, Card, Form, Input, Select, Space, Steps } from "antd";

const protocolOptions = [
  { label: "TCP", value: "tcp" },
  { label: "UDP", value: "udp" }
];

const authenticationOptions = [
  { label: "PSK", value: "psk" },
  { label: "TLS", value: "tls" },
  { label: "匿名", value: "none" }
];

export const ConnectionsPage = () => {
  return (
    <Card title="连接向导">
      <Steps
        items={[
          { title: "目标" },
          { title: "认证" },
          { title: "安全" },
          { title: "网络" },
          { title: "进阶" }
        ]}
        current={0}
        style={{ marginBottom: 24 }}
      />
      <Form layout="vertical">
        <Form.Item label="目标地址" required>
          <Input placeholder="example.com" />
        </Form.Item>
        <Form.Item label="目标端口" required>
          <Input placeholder="7000" />
        </Form.Item>
        <Form.Item label="协议">
          <Select options={protocolOptions} defaultValue="tcp" />
        </Form.Item>
        <Form.Item label="认证方式">
          <Select options={authenticationOptions} defaultValue="psk" />
        </Form.Item>
        <Form.Item label="CLI 命令预览">
          <Input.TextArea value="gonc connect --target example.com:7000 --proto tcp" rows={3} readOnly />
        </Form.Item>
        <Space>
          <Button type="primary">发起连接</Button>
          <Button>保存为模板</Button>
        </Space>
      </Form>
    </Card>
  );
};
