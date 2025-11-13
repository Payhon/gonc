import { ConfigProvider, theme } from "antd";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { useAppStore } from "../store/appStore";

const PRIMARY_COLOR = "#1677ff";

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const themeMode = useAppStore((state) => state.themeMode);

  useEffect(() => {
    document.body.dataset.theme = themeMode;
  }, [themeMode]);

  const algorithms = useMemo(
    () => (themeMode === "dark" ? [theme.darkAlgorithm, theme.compactAlgorithm] : [theme.defaultAlgorithm]),
    [themeMode]
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: algorithms,
        token: {
          colorPrimary: PRIMARY_COLOR,
          colorLink: PRIMARY_COLOR
        },
        components: {
          Layout: {
            headerPadding: "0 20px"
          }
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
};
