import { User } from "@/state/api";
import Image from "next/image";
import React from "react";

type Props = {
  user: User;
};

function UserCard({ user }: Props) {
  return (
    <div className="flex items-center rounded border p-4 shadow">
      {user.profilePictureUrl && (
        <Image
          src={`/${user.profilePictureUrl}`}
          alt="profile picture"
          width={32}
          height={32}
          className="rounded-full"
          unoptimized
        />
      )}
      <div>
        <h3>{user.username}</h3>
      </div>
    </div>
  );
}

export default UserCard;
