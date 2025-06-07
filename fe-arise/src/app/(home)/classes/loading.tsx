import { Spinner } from "@nextui-org/react";

export default function Loading() {
    return (<div className="flex justify-center items-center h-full w-full">
        <Spinner size="lg" />
    </div>)
}