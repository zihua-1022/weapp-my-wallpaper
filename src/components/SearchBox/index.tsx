import React, { useState, PropsWithChildren } from "react";
import { View, Input, Image } from "@tarojs/components";
import { getImg } from "@assets/img";

import "./index.less";

interface ISearchBoxProps {
  onSearch: (keyword: string) => void;
}

const SearchBox: React.FC<ISearchBoxProps & PropsWithChildren> = ({
  onSearch,
  children,
}) => {
  const [searchText, setSearchText] = useState("");
  const handleSearchInput = (event: any) => {
    setSearchText(event.target.value);
  };
  const handleSearchSubmit = () => {
    onSearch(searchText);
  };
  return (
    <View className="search-box">
      <Input
        className="search-input"
        placeholder="请输入搜索内容"
        value={searchText}
        onInput={handleSearchInput}
      />
      {/* <View className="search-btn"> */}
      <Image className="search-btn" src={getImg("searchButton")}></Image>
      {/* </View> */}
    </View>
  );
};

export default SearchBox;
