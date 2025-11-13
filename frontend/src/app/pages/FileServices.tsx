import { Button, Card, Col, Progress, Row, Table, Typography, Upload } from "antd";
import type { ColumnsType } from "antd/es/table";

interface TransferRow {
  id: string;
  filename: string;
  progress: number;
  status: string;
}

const columns: ColumnsType<TransferRow> = [
  { title: "任务 ID", dataIndex: "id" },
  { title: "文件名", dataIndex: "filename" },
  {
    title: "进度",
    dataIndex: "progress",
    render: (value: number) => <Progress percent={value} size="small" />
  },
  { title: "状态", dataIndex: "status" }
];

export const FileServicesPage = () => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card title="上传文件" extra={<Button type="link">选择本地目录</Button>}>
          <Upload.Dragger multiple style={{ padding: 24 }}>
            <Typography.Paragraph>拖放文件到此处开始上传</Typography.Paragraph>
          </Upload.Dragger>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="下载目录">
          <Typography.Paragraph>下载路径：~/Downloads/gonc</Typography.Paragraph>
          <Button>更改目录</Button>
        </Card>
      </Col>
      <Col span={24}>
        <Card title="传输任务">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={[
              { id: "task-001", filename: "report.zip", progress: 35, status: "进行中" },
              { id: "task-002", filename: "backup.tar.gz", progress: 100, status: "已完成" }
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
};
