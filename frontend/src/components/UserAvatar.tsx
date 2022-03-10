import { User, UserFull } from "../utils/endpoints";

type Size = 8 | 10 | 12 | 14 | 16 | 18 | 20;

const getSize = (size: Size) => {
  switch (size) {
    // 8, 10, 12, 14, 16, 18, 20
    case 8:
      return "w-8";
    case 10:
      return "w-10";
    case 12:
      return "w-12";
    case 14:
      return "w-14";
    case 16:
      return "w-16";
    case 18:
      return "w-18";
    case 20:
      return "w-20";
    default:
      throw new Error("SIZE NOT IMPLEMENTED " + size);
  }
};

type UserAvatarProps = {
  user?: User | UserFull;
  size?: Size;
  className?: string;
};

export default function UserAvatar({
  user,
  size = 10,
  className = "",
}: UserAvatarProps) {
  return (
    <img
      alt={
        user
          ? `${user.first_name} ${user.last_name}'s Profile Picture`
          : "Profile Picture"
      }
      src={
        user?.image_link ??
        "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
      }
      className={`mx-auto object-cover rounded-full aspect-square ${getSize(
        size
      )} ${className}`}
    />
  );
}
