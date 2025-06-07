export default function NotFound() {
    return (
        <div className="w-full h-full flex flex-col justify-center text-3xl gap-20 font-bold items-center">
            <p className="text-[10rem] h-fit">404</p>
            <p className="text-red-600">
                OOPS!! <span className="text-black-accent">Page Not Found</span>
            </p>
        </div>
    );
}