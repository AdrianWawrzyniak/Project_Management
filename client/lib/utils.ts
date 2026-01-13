export const dataGridClassNames =
  "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";

export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    "& .MuiDataGrid-columnHeaders": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
      '& [role="row"] > *': {
        backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
        borderColor: `${isDarkMode ? "#2d3135" : ""}`,
      },
    },
    "& .MuiDataGrid-cell": {
      border: "none",
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
    },
    "& .MuiDataGrid-row": {
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
      "&:hover": {
        backgroundColor: `${isDarkMode ? "#2d3135" : "#f9fafb"}`,
      },
    },
    "& .MuiIconButton-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiTablePagination-root": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
    },
    "& .MuiTablePagination-selectIcon": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiDataGrid-toolbarContainer": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
    },
    "& .MuiButton-root": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: `${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
    },
  };
};
