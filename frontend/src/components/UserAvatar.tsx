import { User, UserFull } from "../utils/endpoints";

type UserAvatarProps = {
  user?: User | UserFull;
  size?: number;
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
      className={`mx-auto object-cover rounded-full aspect-square w-${size} ${className}`}
    />
  );
}
