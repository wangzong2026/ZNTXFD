import { getSearchIndex } from "@/lib/data";
import { SearchClient } from "./SearchClient";

export default function SearchPage() {
  const searchIndex = getSearchIndex();

  return (
    <section className="relative mx-auto w-full max-w-5xl">
      <SearchClient searchIndex={searchIndex} />
    </section>
  );
}
