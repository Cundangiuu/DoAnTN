import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useMemo } from "react";
import { ColumnType, DtoType, TablePaginationType } from "../types";

type Props<T> = {
  columns: ColumnType;
  data?: T[];
  renderCell: (key: string, data: T) => JSX.Element | undefined;
  paginationInfo?: TablePaginationType;
  isLoading: boolean;
  topContent: React.JSX.Element;
  showControl?: boolean;
};

const CustomTable = <T extends DtoType>({
  columns,
  data,
  renderCell,
  paginationInfo,
  isLoading,
  topContent,
  showControl,
}: Props<T>): JSX.Element => {
  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls={showControl ?? true}
          showShadow
          color="primary"
          page={(paginationInfo && paginationInfo.number + 1) ?? 1}
          total={paginationInfo?.totalPages ?? 1}
          onChange={paginationInfo?.onClickAnchor}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          {!paginationInfo?.first && (
            <Button
              isDisabled={paginationInfo?.totalPages === 1}
              size="sm"
              variant="flat"
              onPress={paginationInfo?.onFirst}
            >
              First
            </Button>
          )}
          {!paginationInfo?.last && (
            <Button
              isDisabled={paginationInfo?.totalPages === 1}
              size="sm"
              variant="flat"
              onPress={paginationInfo?.onLast}
            >
              Last
            </Button>
          )}
        </div>
      </div>
    );
  }, [paginationInfo, showControl]);

  return (
    <div className="w-full">
      <Table
        isStriped
        aria-label="Table"
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn align={column.align || "center"} key={column.key}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          loadingContent={<Spinner />}
          isLoading={isLoading}
          emptyContent="No data"
          items={data || []}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(columnKey.toString(), item)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
