import { User, UserFull } from "../utils/endpoints";

type UserAvatarProps = {
  user?: User | UserFull;
};

export default function UserAvatar({ user }: UserAvatarProps) {
  return (
    <img
      alt="profil"
      src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
      className="mx-auto object-cover rounded-full h-10 w-10"
    />
  );
}
