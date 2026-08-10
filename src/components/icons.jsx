import {
  Sparkles,
  Smile,
  Meh,
  Frown,
  CloudRain,
  GraduationCap,
  Wind,
  Flower2,
  UsersRound,
  Compass,
} from "lucide-react";

const iconMap = {
  sparkles: Sparkles,
  smile: Smile,
  meh: Meh,
  frown: Frown,
  cloudRain: CloudRain,
  graduationCap: GraduationCap,
  wind: Wind,
  flower2: Flower2,
  usersRound: UsersRound,
  compass: Compass,
};

export default function Icon({ name, ...props }) {
  const Component = iconMap[name] || Sparkles;
  return <Component {...props} />;
}
