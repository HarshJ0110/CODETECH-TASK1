const Alert = ({ title, message}) => {
    return (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 items-center p-4 rounded-lg bg-red-50 border-s-4 border-red-500 dark:bg-red-800/30 w-60" role="alert">
            <div className="ms-3">
                <h3 className="text-gray-800 font-semibold dark:text-white">
                    {title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-neutral-400">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default Alert;
