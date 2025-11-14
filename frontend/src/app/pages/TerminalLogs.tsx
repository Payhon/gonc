import { Button, Card, Divider, Input, List, Typography } from "antd";
import { useMemo, useState } from "react";
import { useLogStore } from "../store/logStore";

export const TerminalLogsPage = () => {
  const [keyword, setKeyword] = useState("");
  const logs = useLogStore((state) => state.logs);
  const clearLogs = useLogStore((state) => state.clear);

  const filteredLogs = useMemo(() => {
    if (!keyword) {
      return logs;
    }
    return logs.filter((log) => log.message.toLowerCase().includes(keyword.toLowerCase()));
  }, [keyword, logs]);

  return (
    <Card title="终端与日志">
      <Typography.Paragraph>将在此嵌入 WebTTY 组件，并展示实时日志流。</Typography.Paragraph>
      <Divider />
      <Input.Search
        placeholder="搜索日志关键字"
        allowClear
        onSearch={setKeyword}
        enterButton
        style={{ marginBottom: 16, maxWidth: 360 }}
      />
      <List
        size="small"
        bordered
        dataSource={filteredLogs}
        style={{ maxHeight: 300, overflow: "auto" }}
        renderItem={(item) => (
          <List.Item>
            <div style={{ flex: 1 }}>
              <Typography.Text strong style={{ marginRight: 12 }}>
                [{item.level.toUpperCase()}]
              </Typography.Text>
              <Typography.Text type="secondary" style={{ marginRight: 12 }}>
                {new Date(item.timestamp).toLocaleTimeString()}
              </Typography.Text>
              <Typography.Text>{item.message}</Typography.Text>
            </div>
            <Typography.Text type="secondary">{item.source}</Typography.Text>
          </List.Item>
        )}
      />
      <Divider />
      <Button type="primary" style={{ marginRight: 12 }}>
        打开交互终端
      </Button>
      <Button onClick={clearLogs}>清空日志</Button>
    </Card>
  );
};
