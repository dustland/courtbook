import { View, Text, ScrollView } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import * as TaroifyIcons from "@taroify/icons";
import "./index.scss";

export default function IconsShowcase() {
  useLoad(() => {
    console.log("Icons showcase page loaded");
  });

  // Filter out non-component exports
  const iconNames = Object.keys(TaroifyIcons).filter(
    (name) =>
      typeof TaroifyIcons[name] === "function" &&
      !["default", "createIcon"].includes(name)
  );

  // Group icons by category
  const categories = {
    Basic: iconNames.filter((name) => !name.includes("Outlined")),
    Outlined: iconNames.filter((name) => name.includes("Outlined")),
  };

  return (
    <View className="icons-page">
      <View className="header">
        <Text className="title">Taroify Icons</Text>
        <Text className="subtitle">Available icons: {iconNames.length}</Text>
      </View>

      <ScrollView scrollY className="content">
        {Object.entries(categories).map(([category, icons]) => (
          <View key={category} className="category">
            <Text className="category-title">{category}</Text>
            <View className="icon-grid">
              {icons.map((iconName) => {
                const IconComponent = TaroifyIcons[iconName];
                return (
                  <View key={iconName} className="icon-item">
                    <IconComponent size="26px" />
                    <Text className="icon-name">{iconName}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
