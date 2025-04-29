/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Filters from "@/components/Filters";
import { List } from "@/components/List";
import { SelectFilter } from "@/components/Select";
import usePagination from "@/hooks/usePagination";
import { useEffect, useState } from "react";
import { isAfter, isBefore, parseISO } from "date-fns";

import {
  OperatorsTypeNumEnum,
  TextOperatorsEnum,
  DateOperatorsEnum,
  BoolOperatorsEnum,
} from "@/enums/operators";
import { listService } from "@/services/ListService";

const tableColumns = [
  {
    name: "Codigo do registro",
    size: "200px",
  },
  {
    name: "Codigo de referencia",
    size: "40px",
  },
  {
    name: "Data da descarga",
    size: "40px",
  },
  {
    name: "Unidade produtiva",
    size: "40px",
  },
  {
    name: "Entrevistador",
    size: "40px",
  },
  {
    name: "Acao",
    size: "40px",
  },
];

const itemsPerPageOptions = [
  {
    id: "10",
    value: "10",
  },
  {
    id: "30",
    value: "30",
  },
  {
    id: "50",
    value: "50",
  },
] as {
  id: string;
  value: string;
}[];

export default function Home() {
  const [listData, setListData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<FilterRow[]>([]);

  type FilterRow = {
    id: string;
    field?: string;
    operator?: string;
    value?: any;
  };
  function applyFilters(data: any[], filters: FilterRow[]) {
    return data.filter((item) => {
      return filters.every((filter) => {
        const { field, operator, value } = filter;
        const itemValue = item[field ?? ""];

        if (!field || !operator || value === undefined) return true;

        switch (operator) {
          case OperatorsTypeNumEnum.EQUAL:
          case TextOperatorsEnum.EQUAL:
          case DateOperatorsEnum.EQUAL:
          case BoolOperatorsEnum.EQUAL:
            return itemValue == value;

          case OperatorsTypeNumEnum.NOT_EQUAL:
          case TextOperatorsEnum.NOT_EQUAL:
          case DateOperatorsEnum.NOT_EQUAL:
            return itemValue != value;

          // Números e Datas
          case OperatorsTypeNumEnum.GREATER_THAN:
          case DateOperatorsEnum.GREATER_THAN:
            return itemValue > value;

          case OperatorsTypeNumEnum.LESS_THAN:
          case DateOperatorsEnum.LESS_THAN:
            return itemValue < value;

          case OperatorsTypeNumEnum.GREATER_THAN_OR_EQUAL:
            return itemValue >= value;

          case OperatorsTypeNumEnum.LESS_THAN_OR_EQUAL:
            return itemValue <= value;

          case TextOperatorsEnum.CONTAINS:
            return typeof itemValue === "string" && itemValue.includes(value);

          case TextOperatorsEnum.NOT_CONTAINS:
            return typeof itemValue === "string" && !itemValue.includes(value);

          case DateOperatorsEnum.BETWEEN:
            if (
              typeof value === "object" &&
              value.startDate &&
              value.endDate &&
              itemValue
            ) {
              const itemDate = parseISO(itemValue);
              const start = parseISO(value.startDate);
              const end = parseISO(value.endDate);
              return isAfter(itemDate, start) && isBefore(itemDate, end);
            }
            return true;

          default:
            return true;
        }
      });
    });
  }
  useEffect(() => {
    const loadListData = async () => {
      try {
        const responseList = await listService.getList();
        setListData(responseList);
      } catch (err) {
        console.log(err);
      }
    };

    loadListData();
  }, []);

  const filteredList = applyFilters(listData, filters);

  const {
    items = [],
    totalPages,
    gotoPage,
    previousPage,
    currentPage,
    nextPage,
  } = usePagination({
    list: filteredList ?? [],
    itemsPerPage,
  });

  const pageNumbers = Array.from({ length: totalPages }).map(
    (_, idx) => idx + 1
  );

  return (
    <div>
      <Filters onApply={setFilters} onClear={() => setFilters([])} />
      <div className="flex flex-col px-8">
        <h2>Resultado:</h2>
        <List columns={tableColumns} data={items} />

        {/* @TODO separar em um componente a parte */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            flex: 1,
            justifyContent: "center",
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          <span style={{ cursor: "pointer" }} onClick={() => gotoPage(0)}>
            {"<<"} Primeiro
          </span>
          <span style={{ cursor: "pointer" }} onClick={previousPage}>
            {"<"} Anterior
          </span>
          {pageNumbers.map((page) => (
            <span
              key={page}
              onClick={() => gotoPage(page)}
              className="cursor-pointer"
              style={{
                textDecoration: currentPage === page ? "underline" : "none",
              }}
            >
              {page}
            </span>
          ))}
          <span style={{ cursor: "pointer" }} onClick={nextPage}>
            Proximo {">"}
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => gotoPage(totalPages)}
          >
            Ultimo {">>"}
          </span>

          <SelectFilter
            label="Items por pagina"
            className="w-[80px]"
            options={itemsPerPageOptions}
            onChange={(value) => setItemsPerPage(Number(value))}
            value={String(itemsPerPage)}
          />
        </div>
      </div>
    </div>
  );
}
