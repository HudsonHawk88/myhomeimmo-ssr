import React, {
  useState,
  useContext,
  useFocusRef,
  createContext,
  useMemo,
} from "react";
import DataGrid from "react-data-grid";

const DataTable = ({ cols, rows, headerRowHeight, direction }) => {
  const [filters, setFilters] = useState({});
  const FilterContext = createContext();

  const FilterRenderer = ({ isCellSelected, column, children }) => {
    const filters = useContext(FilterContext);
    const { ref, tabIndex } = useFocusRef(isCellSelected);

    return (
      <>
        <div>{column.name}</div>
        {filters.enabled && <div>{children({ ref, tabIndex, filters })}</div>}
      </>
    );
  };

  const getFilter = (column, filters, p, rest) => {
    switch (column.filterType) {
      case "text": {
        return (
          <FilterRenderer {...p}>
            <input
              {...rest}
              className={filterClassname}
              value={filters[column.name]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  [column.name]: e.target.value,
                })
              }
            />
          </FilterRenderer>
        );
      }
      case "option": {
        return (
          <FilterRenderer {...p}>
            <select
              {...rest}
              className={filterClassname}
              value={filters[column.name]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  [column.name]: e.target.value,
                })
              }
              onKeyDown={selectStopPropagation}
            >
              <option key="" value="">
                {"Kérjük válasszon..."}
              </option>
              {column.filterOptions &&
                Array.isArray(column.filterOptions) &&
                column.filterOptions.length > 0 &&
                column.filterOptions.map((filterOption) => {
                  return (
                    <option key={filterOption.key} value={filterOption.value}>
                      {filterOption.text}
                    </option>
                  );
                })}
            </select>
          </FilterRenderer>
        );
      }
      default: {
        return (
          <FilterRenderer {...p}>
            <input
              {...rest}
              className={filterClassname}
              value={filters[column.name]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  [column.name]: e.target.value,
                })
              }
            />
          </FilterRenderer>
        );
      }
    }
  };

  const columns = cols.map((column) => {
    const newColumn = {
      key: column.id,
      name: column.name,
      width: column.width || "50",
      headerCellClass: column.headerCellClass || "",
      headerRenderer:
        (p) =>
        (filters, ...rest) => {
          getFilter(column, filters, ...p, ...rest);
        },
    };

    return newColumn;
  });

  const getFilterType = (row) => {
    const keys = Object.keys(row);
    let filterType;
    columns.forEach((column, index) => {
      keys.forEach((key) => {
        if (key === column.name) {
          if (column.filterType && column.filterType === "text") {
            filterType = "text";
          } else if (column.filterType && column.filterType === "option") {
            filterType = "option";
          }
        }
      });
    });
    return filterType;
  };

  const renderFilters = (filterType, row) => {
    let filts = filters;
    return [...filts].map((filter, index) => {
      if (filts.length === index) {
        if (filterType === "text") {
          return `${
            filts[row.name] ? row[row.name].includes(filts[row.name]) : true
          } &&`;
        } else if (filterType === "option") {
          return `${
            filts[row.name] !== "" ? row[row.name] === filts[row.name] : true
          } &&`;
        } else {
        }
      } else {
        if (filterType === "text") {
          return `${
            filts[row.name] ? row[row.name].includes(filts[row.name]) : true
          }`;
        } else if (filterType === "option") {
          return `${
            filts[row.name] !== "" ? row[row.name] === filts[row.name] : true
          }`;
        }
      }
    });
  };

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const filterType = getFilterType(r);
      return (
        filterType && renderFilters(filterType, r)
        /* (filters.task ? r.task.includes(filters.task) : true) &&
            (filters.priority !== 'All' ? r.priority === filters.priority : true) &&
            (filters.issueType !== 'All' ? r.issueType === filters.issueType : true) &&
            (filters.developer
              ? r.developer.toLowerCase().startsWith(filters.developer.toLowerCase())
              : true) &&
            (filters.complete !== undefined ? r.complete >= filters.complete : true) */
      );
    });
  }, [rows, filters]);

  return (
    <FilterContext.Provider value={filters}>
      <DataGrid
        columns={columns}
        rows={filteredRows}
        headerRowHeight={headerRowHeight || 70}
        direction={direction || "ltr"}
      />
    </FilterContext.Provider>
  );
};

export default DataTable;
