import React from 'react';

export default function SearchFilter({ selectedRegion = 'All', onRegionChange }) {
  return (
    <select 
      value={selectedRegion}
      onChange={(e) => onRegionChange && onRegionChange(e.target.value)}
      className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
    >
      <option value="All">All Mangaluru Localities</option>
      <option value="Kadri">Kadri / Circuit House</option>
      <option value="Surathkal">Surathkal / Beach Road</option>
      <option value="Bejai">Bejai / Lalbagh</option>
      <option value="Attavar">Attavar / Falnir</option>
      <option value="Panambur">Panambur / Baikampady</option>
    </select>
  );
}

