import { View, Text, Image } from "@tarojs/components";
import { mockUser } from "../mock/data";
import "./header.scss";

interface HeaderProps {
  communityName?: string;
}

const Header: React.FC<HeaderProps> = ({ communityName = "幸福小区" }) => {
  return (
    <View className="header">
      <View className="community-name">
        <Text>{communityName}</Text>
      </View>
      <View className="user-info">
        <Text className="room-number">{mockUser.roomNumber}</Text>
        <Image className="avatar" src={mockUser.avatar} />
      </View>
    </View>
  );
};

export default Header;
