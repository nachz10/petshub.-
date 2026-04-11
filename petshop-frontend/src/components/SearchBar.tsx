import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";

interface SearchFormData {
  query: string;
}

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<SearchFormData>({
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = (data: SearchFormData) => {
    if (data.query.trim()) {
      navigate(`/search?query=${encodeURIComponent(data.query.trim())}`);
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative w-full max-w-md mx-auto"
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-2 text-black rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          {...register("query", { required: true })}
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
