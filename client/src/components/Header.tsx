import { Select } from "antd";
import { setLanguage } from "@/slices/LanguageSlice";
import { useAppDispatch } from "@/redux/hooks";
const Header = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="w-full h-16 bg-white drop-shadow-md flex items-center justify-between">
      <div className="pt-0 ml-20  text-xl font-bold text-black">TENJI</div>
      <div className="mr-20">
        <Select
          defaultValue={"en"}
          onChange={(value) => dispatch(setLanguage(value))}
          options={[
            { label: "EN", value: "en" },
            { label: "DE", value: "de" },
          ]}
        />
      </div>
    </div>
  );
};

export default Header;
