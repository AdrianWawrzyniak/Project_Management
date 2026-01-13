import React from "react";

type Props = {
  name: string;
  buttonComponent?: any;
  isSmallText?: boolean;
};

const Header = ({ name, buttonComponent, isSmallText = false }: Props) => {
  return (
    <div className="mb-6 flex w-full items-center justify-between">
      <h1
        className={`${isSmallText ? "text-xl" : "text-3xl"} font-bold tracking-tight text-gray-900 dark:text-gray-100`}
      >
        {name}
      </h1>
      {buttonComponent}
    </div>
  );
};

export default Header;
