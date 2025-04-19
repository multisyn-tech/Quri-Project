
export const filterRows = (rows, searchText) => {
    if (!searchText) return rows;
  
    const lowercasedSearchText = searchText.toLowerCase();
    return rows.filter(row =>
      row.Name.toLowerCase().includes(lowercasedSearchText) ||
      row.Email.toLowerCase().includes(lowercasedSearchText)
    );
  };
  