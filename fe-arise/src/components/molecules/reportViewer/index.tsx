"use client";

import { getLocalTimeZone, now } from "@internationalized/date";
import {
  Button,
  DateValue,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RangeValue,
} from "@nextui-org/react";
import { ComponentProps, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoMdDownload, IoMdSearch } from "react-icons/io";
import { toast } from "sonner";
import { read, utils } from "xlsx";
import DateRangePicker from "../form/DateRangePicker";
import TableWrapper from "../table/TableWrapper";
import { DataType, Rest } from "../types";

type Props = {
  url: string;
  title: string;
  columns?: ComponentProps<typeof TableWrapper>["columns"];
  renderCell?: ComponentProps<typeof TableWrapper>["renderCell"];
  isOpen: boolean;
  onClose: () => void;
};

type Inputs = {
  Range: RangeValue<DateValue>;
};

type FileDownload = {
  file: Blob;
  filename: string;
};

export default function ReportViewer({
  url,
  title,
  columns,
  renderCell,
  onClose,
  isOpen,
}: Readonly<Props>) {
  const [file, setFile] = useState<FileDownload>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>();

  const { control, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { Range } = data;
    const start = Range.start.toDate(getLocalTimeZone());
    const end = Range.end.toDate(getLocalTimeZone());
    if (Math.abs(start.getTime() - end.getTime()) <= 86_400_000) {
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${url}?from=${start.toISOString()}&to=${end.toISOString()}`
      );
      setLoading(false);

      if (!response.ok) {
        toast.error("Failed to fetch report");
        return;
      }

      const blob = await response.blob();
      const filename = response.headers.get("Content-Disposition");

      setFile({
        file: blob,
        filename: (
          filename
            ?.split(" ")[1]
            .match(/"([^"]*)"/g)![0]
            .replaceAll('"', "") ?? "report.xlsx"
        ).trim(),
      });
    } catch (error) {
      console.log(error);

      toast.error("Failed to fetch report");
    }
  };

  columns =
    columns ??
    (data ? Object.keys(data[0]).map((v) => ({ name: v, key: v })) : []);
  const defaultRenderCell = (key: string, data: DataType) => {
    return <p>{data[key]}</p>;
  };
  renderCell =
    renderCell ??
    (defaultRenderCell as ComponentProps<typeof TableWrapper>["renderCell"]);

  const onDownload = () => {
    if (!file) {
      toast.error("No file to download");
      return;
    }
    const url = window.URL.createObjectURL(file.file);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.filename);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    if (!link.parentNode) {
      return;
    }
    // Clean up and remove the link
    link.parentNode.removeChild(link);
  };

  useEffect(() => {
    const getData = async () => {
      if (!file) {
        return;
      }

      const ab = await file.file.arrayBuffer();

      const wb = read(ab);

      const ws = wb.Sheets[wb.SheetNames[0]];
      const d = utils.sheet_to_json(ws) as DataType[];
      for (let i = 0; i < d.length; i++) {
        d[i]["id"] = `${file.file.size} ${i + 1}`;
      }

      setData(d);
    };

    getData();
  }, [file]);

  const rest: Rest | undefined = {
    totalElements: 0,
    totalPages: 0,
    size: 0,
    number: 0,
    pageable: {
      pageNumber: 0,
      pageSize: 0,
      offset: 0,
      sort: [],
      paged: true,
      unpaged: false,
    },
    sort: [],
    first: true,
    last: true,
    empty: false,
    numberOfElements: 0,
  };

  return (
    <Modal isOpen={isOpen} size="3xl" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex justify-between">
              <h2 className="uppercase font-bold text-xl mb-6">{title}</h2>
            </ModalHeader>
            <ModalBody>
              <div className="w-full flex flex-col">
                <form
                  className="flex gap-2 items-end mb-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <DateRangePicker
                    control={control}
                    name="Range"
                    defaultValue={{
                      start: now(getLocalTimeZone()),
                      end: now(getLocalTimeZone()),
                    }}
                  />
                  <Button isIconOnly type="submit">
                    <IoMdSearch />
                  </Button>
                </form>
                <div className="w-full flex gap-2 justify-end">
                  <Button
                    isDisabled={!file}
                    onPress={onDownload}
                    startContent={<IoMdDownload />}
                    color="primary"
                  >
                    Download
                  </Button>
                </div>
                <div className="max-h-[500px] overflow-y-auto px-2 mt-3">
                  <TableWrapper<DataType>
                    showControls={false}
                    showInfo={false}
                    rest={rest}
                    columns={columns}
                    data={data}
                    isLoading={loading}
                    renderCell={renderCell}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
