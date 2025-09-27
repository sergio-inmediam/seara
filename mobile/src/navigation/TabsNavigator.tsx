import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScheduleScreen from "@/screens/ScheduleScreen";
import ConfessionScreen from "@/screens/ConfessionScreen";
import AlertsScreen from "@/screens/AlertsScreen";
import AdminDashboard from "@/screens/Admin/Dashboard";

export type TabParamList = {
  Programacao: undefined;
  Alertas: undefined;
  Confissoes: undefined;
  Admin: undefined;
};

const Tabs = createBottomTabNavigator<TabParamList>();

const TabsNavigator: React.FC = () => (
  <Tabs.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] = "calendar";
        if (route.name === "Alertas") iconName = "bell";
        if (route.name === "Confissoes") iconName = "church";
        if (route.name === "Admin") iconName = "shield-account";
        return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
      },
    })}
  >
    <Tabs.Screen name="Programacao" component={ScheduleScreen} options={{ title: "Programação" }} />
    <Tabs.Screen name="Alertas" component={AlertsScreen} />
    <Tabs.Screen name="Confissoes" component={ConfessionScreen} options={{ title: "Confissões" }} />
    <Tabs.Screen name="Admin" component={AdminDashboard} />
  </Tabs.Navigator>
);

export default TabsNavigator;
