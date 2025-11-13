import { Card, Col, Row, Statistic, Typography } from "antd";
import { useMemo } from "react";
import type { VersionOverview } from "../types";

interface DashboardProps {
  version?: VersionOverview;
}

export const DashboardPage = ({ version }: DashboardProps) => {
  const stats = useMemo(
    () => [
      { title: "活跃会话", value: 0 },
      { title: "成功打洞", value: 0 },
      { title: "传输任务", value: 0 },
      { title: "代理连接", value: 0 }
    ],
    []
  );

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          <Typography.Title level={3} style={{ marginBottom: 8 }}>
            系统总览
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            这里将展示当前 gonc 实例的整体运行情况、网络拓扑与快捷操作入口。
          </Typography.Paragraph>
          {version && (
            <Typography.Paragraph style={{ marginTop: 16 }}>
              当前版本：{version.name} {version.version}（{version.commit}）
            </Typography.Paragraph>
          )}
        </Card>
      </Col>
      {stats.map((item) => (
        <Col xs={12} md={6} key={item.title}>
          <Card>
            <Statistic title={item.title} value={item.value} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};
