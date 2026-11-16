"use client";
import { createContext, useContext, useState } from "react";
import { Filters, defaultFilters } from "@/lib/data/filters";

const FilterContext = createContext<{ filters: Filters; setFilters: (f: Filters) => void }>({
  filters: defaultFilters, setFilters: () => {},
});

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  return <FilterContext.Provider value={{ filters, setFilters }}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  return useContext(FilterContext);
}
