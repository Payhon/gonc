import { Card, Switch, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface ProxyProfile {
  id: string;
  name: string;
  type: "socks5" | "http" | "transparent";
  listen: string;
  acl: string;
  activeClients: number;
  enabled: boolean;
}

const columns: ColumnsType<ProxyProfile> = [
  { title: "名称", dataIndex: "name" },
  {
    title: "类型",
    dataIndex: "type",
    render: (value: ProxyProfile["type"]) => {
      const labelMap = {
        socks5: "SOCKS5",
        http: "HTTP CONNECT",
        transparent: "透明代理"
      };
      return <Tag color="blue">{labelMap[value]}</Tag>;
    }
  },
  { title: "监听地址", dataIndex: "listen" },
  { title: "ACL", dataIndex: "acl" },
  { title: "活跃客户端", dataIndex: "activeClients" },
  {
    title: "启用",
    dataIndex: "enabled",
    render: (value: boolean) => <Switch checked={value} />
  }
];

const data: ProxyProfile[] = [
  {
    id: "proxy-001",
    name: "本地 Socks5",
    type: "socks5",
    listen: "127.0.0.1:1080",
    acl: "默认允许",
    activeClients: 3,
    enabled: true
  },
  {
    id: "proxy-002",
    name: "好友专线",
    type: "transparent",
    listen: "0.0.0.0:6000",
    acl: "严格白名单",
    activeClients: 0,
    enabled: false
  }
];

export const ProxyCenterPage = () => {
  return (
    <Card title="代理与转发">
      <Table rowKey="id" columns={columns} dataSource={data} />
    </Card>
  );
};
