import React, { useState } from "react";

export const GenresItem = ({ genre }) => {
  const [isColor, setColor] = useState({
    blue: true,
  });

  const className = isColor.blue
    ? "flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative "
    : "flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative bg-blue-100 border-blue-600";

  const hanldeChangeColor = () => {
    setColor({ blue: !isColor.blue });
  };

  return (
    <>
      <option
        className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative"
        onClick={hanldeChangeColor}
        value={genre.name}
      >
        {genre.name}
      </option>
    </>
  );
};

/**
 * <div className="flex flex-col w-full">
        <div className="cursor-pointer w-full border-gray-100 border-b hover:bg-blue-100">
          <div className={className} onClick={hanldeChangeColor}>
            <option value={genre.name}>{genre.name}</option>
          </div>
        </div>
      </div>
 */
