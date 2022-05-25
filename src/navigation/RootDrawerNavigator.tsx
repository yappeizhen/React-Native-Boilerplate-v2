import { signOut } from "firebase/auth";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";

import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";

import { RootDrawerParamList } from "../../types";
import DrawerMenuButton from "../components/DrawerMenuButton";
import Colors from "../constants/Colors";
import { auth } from "../firebase/firebase";
import { useAuthState } from "../hooks/useAuthState";
import useColorScheme from "../hooks/useColorScheme";
import AboutUsScreen from "../screens/AboutUsScreen";
import AuthStackNavigator from "./AuthStackNavigator";
import HomeStackNavigator from "./HomeStackNavigator";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const renderAppStack = (colorScheme: NonNullable<ColorSchemeName>) => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Successfully logged out");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <Drawer.Navigator
      initialRouteName="Root"
      screenOptions={({ navigation }) => ({
        headerLeft: () => {
          return (
            <DrawerMenuButton
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          );
        },
      })}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Logout"
              onPress={handleLogout}
              icon={() => (
                <SimpleLineIcons
                  name="logout"
                  size={20}
                  color={Colors[colorScheme].text}
                />
              )}
            />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen
        name="Root"
        component={HomeStackNavigator}
        options={({ navigation }) => ({
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
          title: "Home",
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Ionicons
                name="information-circle-outline"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <Drawer.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="people-outline" size={20} color={color} />
          ),
          title: "About Us",
        }}
      />
    </Drawer.Navigator>
  );
};
export default function RootDrawerNavigator() {
  const colorScheme = useColorScheme();
  const { user } = useAuthState();
  if (user) {
    return renderAppStack(colorScheme);
  } else {
    return <AuthStackNavigator />;
  }
}
