import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { theme } from "@/constants/theme";

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="automatic" tintColor={theme.colors.primary}>
      <NativeTabs.Trigger disableScrollToTop={false} name="home">
        <Label>Home</Label>
        <Icon
          drawable="custom_android_drawable"
          sf={{
            default: "house",
            selected: "house.fill",
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="radio">
        <Icon
          drawable="custom_settings_drawable"
          sf={{
            default: "dot.radiowaves.left.and.right",
            selected: "dot.radiowaves.left.and.right",
          }}
        />
        <Label>Radio</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="library/index">
        <Icon
          drawable="custom_settings_drawable"
          sf={{
            default: "square.stack",
            selected: "square.stack.fill",
          }}
        />
        <Label>Library</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <Icon
          drawable="custom_settings_drawable"
          sf={{
            default: "magnifyingglass",
            selected: "magnifyingglass.circle.fill",
          }}
        />
        <Label>Search</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
