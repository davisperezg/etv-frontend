import React from "react";

export const CountryItem = ({ country }) => {
  return (
    <>  
      <option  value={country.name}>{country.name}</option>
    </>
  );
};

/**
 * <div className="hover:bg-blue-100 flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
        <div className="w-6 flex flex-col items-center">
          <div className="flex relative w-5 h-5 bg-orange-500 justify-center items-center m-1 mr-2 w-4 h-4 mt-1 rounded-full ">
            <img className="rounded-full" alt="A" src={country.img} />
          </div>
        </div>
        <div className="w-full items-center flex">
          <div className="mx-2 -mt-1  ">
            {country.country}
            <div className="text-xs truncate w-full normal-case font-normal -mt-1 text-gray-500">
              {country.cod}
            </div>
          </div>
        </div>
      </div>
 */