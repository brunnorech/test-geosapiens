/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { SelectFilter } from "../Select";
import { Button } from "../ui/button";
import { DateOperatorsEnum } from "@/enums/operators";
import { filterService } from "@/services/FilterService";

type FieldDefinition = {
  identificador: string;
  campo: string;
  tipo: string;
  operadores: string[];
};

type SimplifiedField = {
  id: string;
  value: string;
};

type FilterRow = {
  id: string;
  field?: string;
  operator?: string;
  value?: any;
};

type FiltersProps = {
  onApply?: (filters: FilterRow[]) => void;
  onClear?: () => void;
};

export default function Filters({ onApply, onClear }: FiltersProps) {
  const [filterData, setFilterData] = useState<FieldDefinition[]>([]);
  const [fieldList, setFieldList] = useState<SimplifiedField[]>([]);
  const [rowFilter, setRowFilter] = useState<FilterRow[]>([]);

  function extractIdentificadorAndCampo(
    fields: FieldDefinition[]
  ): SimplifiedField[] {
    return fields.map(({ identificador, campo }) => ({
      id: identificador,
      value: campo,
    }));
  }

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const responseFilters = await filterService.getFilters();
        const fieldListFormated = extractIdentificadorAndCampo(responseFilters);
        setFieldList(fieldListFormated);
        setFilterData(responseFilters);
      } catch (err) {
        console.error(err);
      }
    };

    loadFilters();
  }, []);

  const handleAddFilter = () => {
    setRowFilter((prev) => [...prev, { id: `${Math.random()}` }]);
  };

  const handleErase = () => {
    setRowFilter([]);
    onClear?.();
  };

  const handleChangeField = (filterId: string, fieldId: string) => {
    setRowFilter((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? { ...filter, field: fieldId, operator: undefined, value: undefined }
          : filter
      )
    );
  };

  const handleChangeOperator = (filterId: string, operator: string) => {
    setRowFilter((prev) =>
      prev.map((filter) =>
        filter.id === filterId
          ? { ...filter, operator, value: undefined }
          : filter
      )
    );
  };

  const handleChangeValue = (filterId: string, value: any) => {
    setRowFilter((prev) =>
      prev.map((filter) =>
        filter.id === filterId ? { ...filter, value } : filter
      )
    );
  };

  const getOperatorsForField = (fieldId?: string) => {
    const field = filterData.find((f) => f.identificador === fieldId);
    return (
      field?.operadores.map((op) => ({
        id: op,
        value: op,
      })) || []
    );
  };

  const getFieldType = (fieldId?: string) => {
    return filterData.find((f) => f.identificador === fieldId)?.tipo || "text";
  };

  const renderValueInput = (
    fieldType: string,
    filterId: string,
    value: any,
    operator?: string
  ) => {
    if (fieldType === "date" && operator === DateOperatorsEnum.BETWEEN) {
      return (
        <div className="flex flex-row gap-2">
          <Input
            className="w-[150px]"
            type="date"
            value={value?.startDate ?? ""}
            placeholder="Data Inicial"
            onChange={(e) =>
              handleChangeValue(filterId, {
                ...(value || {}),
                startDate: e.target.value,
              })
            }
          />
          <Input
            className="w-[150px]"
            type="date"
            value={value?.endDate ?? ""}
            placeholder="Data Final"
            onChange={(e) =>
              handleChangeValue(filterId, {
                ...(value || {}),
                endDate: e.target.value,
              })
            }
          />
        </div>
      );
    }

    switch (fieldType) {
      case "number":
        return (
          <Input
            className="w-[200px]"
            type="number"
            value={value ?? ""}
            onChange={(e) => handleChangeValue(filterId, e.target.value)}
          />
        );
      case "date":
        return (
          <Input
            className="w-[200px]"
            type="date"
            value={value ?? ""}
            onChange={(e) => handleChangeValue(filterId, e.target.value)}
          />
        );
      case "bool":
        return (
          <SelectFilter
            label="Valor"
            options={[
              { id: "true", value: "Verdadeiro" },
              { id: "false", value: "Falso" },
            ]}
            value={value ?? ""}
            onChange={(val) => handleChangeValue(filterId, val)}
          />
        );
      case "text":
      default:
        return (
          <Input
            className="w-[200px]"
            type="text"
            value={value ?? ""}
            onChange={(e) => handleChangeValue(filterId, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col flex-1 p-[24px]">
      <div className="mb-12 h-auto">
        <h1>Filtros</h1>
      </div>

      <div className="flex flex-col mb-8 gap-4">
        {rowFilter.map((row) => {
          const operators = getOperatorsForField(row.field);
          const fieldType = getFieldType(row.field);

          return (
            <div key={row.id} className="flex flex-row gap-8">
              <SelectFilter
                label="Campo"
                options={fieldList}
                value={row.field ?? ""}
                onChange={(value) => handleChangeField(row.id, value)}
              />
              <SelectFilter
                label="Operador"
                options={operators}
                value={row.operator ?? ""}
                onChange={(value) => handleChangeOperator(row.id, value)}
              />
              {renderValueInput(fieldType, row.id, row.value, row.operator)}
            </div>
          );
        })}
      </div>

      <div className="flex flex-1">
        <Button onClick={handleAddFilter}>Adicionar Filtro</Button>
        <div className="flex flex-1 flex-row justify-end gap-8">
          <Button onClick={handleErase}>Limpar</Button>
          <Button onClick={() => onApply?.(rowFilter)}>Aplicar</Button>
        </div>
      </div>
    </div>
  );
}
