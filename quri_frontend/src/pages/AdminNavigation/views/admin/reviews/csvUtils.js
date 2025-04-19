export const jsonToCSV = (json, columns) => {
  if (!json.length) {
    return '';
  }
  const replacer = (key, value) => (value === null ? '' : value);
  let csv = json.map((row) =>
    columns
      .map((column) => JSON.stringify(row[column.field], replacer))
      .join(',')
  );
  csv.unshift(columns.map(column => column.headerName).join(',')); // add header column
  csv = csv.join('\r\n');
  return csv;
};

export const downloadCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
