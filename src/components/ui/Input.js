import clsx from 'clsx';

const Input = ({ className, type, ...props }) => {
    return (
        <input
            className = {clsx('px-4 py-2 border-solid border-2 w-full border-green-500 rounded-lg focus:outline-none disabled:bg-slate-200 disabled:border-green-300', className)}
            type = {type}
            {...props}
        />
    )
}

export default Input