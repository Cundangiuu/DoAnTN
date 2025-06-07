import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { TableDataType, TableOptions, TableType } from "../types";

export default function Table<T extends TableDataType>({
  data,
  pagination,
  paginationInfo,
  options,
  onClickTitle,
}: Readonly<TableType<T>>) {
  if (data.length === 0) {
    throw new Error("Data has no length");
  }

  if (pagination && !paginationInfo) {
    throw new Error("Missing pagination info");
  }

  const { anchorCount }: TableOptions = {
    anchorCount: options?.anchorCount ?? 5,
  };

  const capitalize = (str: string) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const normalizedData = data.map((item) => ({ ...item }));
  const keys = data.map((c) => c.key);
  const columns = Object.keys(normalizedData[0]).map((c) =>
    capitalize(c.replace(/([a-z])([A-Z])/g, "$1 $2"))
  );

  const pageAnchor = () => {
    if (!paginationInfo) {
      throw new Error("Missing pagination info");
    }
    const { number, totalPages } = paginationInfo;

    const current = Math.min(totalPages, Math.max(1, number + 1));
    let left = current - 1;
    let right = current + 1;

    const result = [current];
    while (left > 0 || right <= paginationInfo.totalPages) {
      if (result.length === anchorCount) {
        break;
      }

      if (left > 0 && !result.find((c) => c === left)) {
        result.unshift(left);
        left--;
      }

      if (result.length === anchorCount) {
        break;
      }
      if (
        right <= paginationInfo.totalPages &&
        !result.find((c) => c === right)
      ) {
        result.push(right);
        right++;
      }
      if (result.length === anchorCount) {
        break;
      }
      left--;
      right++;
    }

    return result;
  };

  return (
    <div className="w-full shadow-lg overflow-hidden rounded-lg border-collapse border border-solid border-white flex flex-col">
      <div className="w-full overflow-x-auto">
        <table
          className={`w-full text-nowrap [&_th]:text-slate-600 [&_td]:text-slate-800 [&_th]:border [&_th]:border-solid [&_th]:border-white [&_td]:border [&_td]:border-solid [&_td]:border-white [&_th]:px-2`}
        >
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  onClick={() => onClickTitle(c)}
                  className="py-3 text-nowrap text-sm odd:bg-slate-300 even:bg-slate-200 text-black"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {normalizedData.map((d, i) => (
              <tr key={`tr_${keys[i]}`}>
                {Object.values(d).map((c, index) =>
                  index !== 0 ? (
                    <td
                      className={"px-4 pt-2"}
                      key={`td_${keys[i]}_${columns[index]}`}
                    >
                      {c}
                    </td>
                  ) : (
                    <th
                      className={"bg-slate-100"}
                      key={`th_${keys[i]}_${columns[index]}`}
                    >
                      {c}
                    </th>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div
          className={
            "w-full flex flex-col bg-white border-t border-solid border-slate-300"
          }
        >
          <div className="w-full flex flex-col justify-end">
            <div className="w-full flex justify-end p-2 gap-2">
              <p>Item</p>
              <p>
                {Math.max(
                  1,
                  (paginationInfo?.number ?? 0) * (paginationInfo?.size ?? 0)
                )}
              </p>
              <p>-</p>
              <p>
                {Math.min(
                  paginationInfo?.totalElements ?? 0,
                  (paginationInfo?.number ?? 0) +
                    1 * (paginationInfo?.size ?? 0)
                )}
              </p>
              <p>of</p>
              <p>{paginationInfo?.totalElements}</p>
              <p>entries</p>
            </div>
            <div className="flex justify-end items-center p-2 gap-2">
              {paginationInfo && paginationInfo.number > 0 && (
                <>
                  <button
                    className={`bg-white text-black
                  border-collapse disabled:hidden rounded-md flex border-solid border-white border justify-center items-center hover:bg-slate-200 h-10 px-3 hover:text-neutral font-bold`}
                    disabled={(paginationInfo?.number ?? 0) === 0}
                    onClick={paginationInfo?.onFirst}
                  >
                    First
                  </button>
                  <button
                    onClick={paginationInfo?.onPrevious}
                    className={`bg-white text-black
                  border-collapse disabled:hidden rounded-md flex border-solid border-white border justify-center items-center hover:bg-slate-200 h-10 aspect-square hover:text-neutral font-bold`}
                    disabled={(paginationInfo?.number ?? 0) === 0}
                  >
                    {<MdArrowBackIos />}
                  </button>
                </>
              )}
              {pageAnchor().map((anchor) => (
                <button
                  onClick={() => paginationInfo?.onClickAnchor(anchor)}
                  className={`${
                    anchor === (paginationInfo?.number ?? 0) + 1
                      ? "bg-neutral-400 text-white"
                      : "bg-white text-black"
                  } border-collapse disabled:hidden rounded-md flex border-solid border-white border justify-center items-center hover:bg-slate-200 h-10 aspect-square hover:text-neutral font-bold`}
                  key={`anchor_${anchor}`}
                >
                  {anchor}
                </button>
              ))}
              {paginationInfo &&
                paginationInfo.number < paginationInfo.totalPages - 1 && (
                  <>
                    <button
                      onClick={paginationInfo?.onNext}
                      className={`bg-white text-black
                      border-collapse disabled:hidden rounded-md flex border-solid border-white border justify-center items-center hover:bg-slate-200 h-10 aspect-square hover:text-neutral font-bold`}
                      disabled={
                        (paginationInfo?.totalPages ?? 0) ===
                        (paginationInfo?.number ?? 0)
                      }
                    >
                      {<MdArrowForwardIos />}
                    </button>

                    <button
                      onClick={paginationInfo?.onLast}
                      className={`bg-white text-black
                  border-collapse disabled:hidden rounded-md flex border-solid border-white border justify-center items-center hover:bg-slate-200 h-10 px-3 hover:text-neutral font-bold`}
                      disabled={
                        (paginationInfo?.totalPages ?? 0) ===
                        (paginationInfo?.number ?? 0)
                      }
                    >
                      Last
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { default as ActionButton } from "./ActionButton";
export { default as CustomTable } from "./CustomTable";
export { default as DeleteActionButton } from "./DeleteButton";
export { default as GroupActionButton } from "./GroupActionButton";
