import { NavigationContainer } from "@react-navigation/native";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <NavigationContainer
        theme={{
          dark: false,
          colors: {
            primary: "rgb(10, 132, 255)",
            background: "white",
            card: "white",
            text: "black",
            border: "rgb(210, 210, 210)",
            notification: "rgb(255, 59, 48)",
          },
          fonts: {
            regular: { fontFamily: "System", fontWeight: "normal" },
            medium: { fontFamily: "System", fontWeight: "500" },
            bold: { fontFamily: "System", fontWeight: "300" },
            heavy: { fontFamily: "System", fontWeight: "100" },
          },
        }}
        children={undefined} >
        {/* Your app's navigation structure goes here */}
      </NavigationContainer>
    </Stack>
  );
}
