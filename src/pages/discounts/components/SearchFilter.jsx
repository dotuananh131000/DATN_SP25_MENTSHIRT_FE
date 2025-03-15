import Calendar from "../../../containers/Calendar";

import Button from "./Button";
import Filter from "./Filter";
import Search from "./Search";

function SearchFilter() {
  return (
    <div className="bg-white px-4 py-4 mb-4 rounded-lg shadow">
      <div className="flex justify-between space-x-4">
        <Search />
        <Button />
      </div>
      <div className="flex pt-3">
        <Calendar />
        <Filter />
        <button className="border border-orange-500 rounded-lg text-orange-500 px-2 ml-10 hover:bg-orange-500 hover:text-white">
          Export Excel
        </button>
      </div>
    </div>
  );
}

export default SearchFilter;
