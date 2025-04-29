/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface IRowData {
  data_descarga: string; // formato de data (ISO string)
  entrevistador: string;
  referencia_id: number;
  registro_id: number;
  unidade_produtiva: string;
  validado: boolean;
}

export function List({
  columns,
  data,
  title,
}: {
  title?: string;
  columns: {
    name: string;
    size?: string;
  }[];
  data: any[];
}) {
  return (
    <Table>
      <TableCaption>{title}</TableCaption>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.name}
              className={`w-[${column.size ? column.size : "100px"}]`}
            >
              {column.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((dataRow: IRowData) => (
          <TableRow key={JSON.stringify(dataRow)}>
            <TableCell>{dataRow.registro_id}</TableCell>
            <TableCell>{dataRow.referencia_id}</TableCell>
            <TableCell>{dataRow.data_descarga}</TableCell>
            <TableCell>{dataRow.unidade_produtiva}</TableCell>
            <TableCell>{dataRow.entrevistador}</TableCell>
            <TableCell>{dataRow.validado ? "✅" : "X"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
