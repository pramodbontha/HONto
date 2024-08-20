import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Menu, MenuProps } from "antd";
import { useState } from "react";
import FilteredArticles from "./FilteredArticles";
import FilteredCases from "./FilteredCases";
import FilteredReferences from "./FilteredReferences";

const { Item } = Menu;

const FilteredResultsPage = () => {
  const [selectedKey, setSelectedKey] = useState("articles");

  const { articles, articlesCount } = useAppSelector(
    (state: RootState) => state.articles
  );
  const { cases, casesCount } = useAppSelector(
    (state: RootState) => state.cases
  );
  const { references, referencesCount } = useAppSelector(
    (state: RootState) => state.references
  );

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSelectedKey(e.key as string);
  };

  return (
    <>
      <div className="flex mt-4">
        <div>
          <div className="font-semibold text-lg">Search Results</div>
          <div
            style={{ width: "250px" }}
            className=" h-44 bg-white drop-shadow-md rounded-md"
          >
            <Menu
              onClick={handleMenuClick}
              selectedKeys={[selectedKey]}
              mode="inline"
              className="mt-5 pt-5 text-center"
            >
              <Item key="articles">{`Articles (${articlesCount})`}</Item>
              <Item key="cases">{`Cases (${casesCount})`}</Item>
              <Item key="references">{`References (${referencesCount})`}</Item>
            </Menu>
          </div>
        </div>
        <div>
          {articles.length !== 0 && selectedKey === "articles" && (
            <FilteredArticles />
          )}
          {cases.length !== 0 && selectedKey === "cases" && <FilteredCases />}
          {references.length !== 0 && selectedKey === "references" && (
            <FilteredReferences />
          )}
        </div>
      </div>
    </>
  );
};

export default FilteredResultsPage;
