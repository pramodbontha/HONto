import Case from "./Case";
import Article from "./Article";
import Book from "./Book";
import { useAppDispatch } from "@/redux/hooks";
import { setQuery } from "@/slices/SearchBarSlice";

const HomePage = () => {
  const dispatch = useAppDispatch();
  dispatch(setQuery(""));
  return (
    <>
      <Article />
      <Case />
      <Book />
    </>
  );
};

export default HomePage;
