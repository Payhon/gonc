import { Button, Card, List, Space, Tag, Typography } from "antd";

const templates = [
  {
    id: "tpl-001",
    name: "内网穿透（HTTP）",
    description: "将本地 8080 暴露至公网 443",
    tags: ["HTTP", "TLS", "P2P"]
  },
  {
    id: "tpl-002",
    name: "家庭 NAS 文件同步",
    description: "启用 :mux + 文件服务实现快速同步",
    tags: ["文件", "mux"]
  }
];

export const TemplatesPage = () => {
  return (
    <Card title="模板库">
      <List
        itemLayout="horizontal"
        dataSource={templates}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="link" key="use">
                应用
              </Button>,
              <Button key="export">导出</Button>
            ]}
          >
            <List.Item.Meta
              title={<Typography.Text strong>{item.name}</Typography.Text>}
              description={
                <Space size={[8, 4]} wrap>
                  <Typography.Text type="secondary">{item.description}</Typography.Text>
                  {item.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
