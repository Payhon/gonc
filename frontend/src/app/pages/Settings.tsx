import { Button, Card, Form, Input, Radio, Switch } from "antd";
import { useEffect } from "react";
import { appBridge } from "../services/appBridge";
import { useAppStore } from "../store/appStore";

export const SettingsPage = () => {
  const themeMode = useAppStore((state) => state.themeMode);
  const setThemeMode = useAppStore((state) => state.setThemeMode);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      theme: themeMode,
      language: "zh-CN",
      rememberState: true
    });
  }, [form, themeMode]);

  const handleSubmit = async (values: { theme: "light" | "dark"; language: string; rememberState: boolean }) => {
    setThemeMode(values.theme);
    await appBridge.saveUserPreferences({
      theme: values.theme,
      language: values.language,
      rememberState: values.rememberState
    });
  };

  return (
    <Card title="设置">
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item label="主题" name="theme">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="light">浅色</Radio.Button>
            <Radio.Button value="dark">深色</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="语言" name="language">
          <Input disabled />
        </Form.Item>
        <Form.Item label="记住上次状态" name="rememberState" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
