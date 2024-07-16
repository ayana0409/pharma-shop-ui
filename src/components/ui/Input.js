import clsx from 'clsx';

const Input = ({ className, type, ...props }) => {
    return (
        <input
            className = {clsx('px-4 py-2 focus:outline-none', className)}
            type = {type}
            {...props}
        />
    )
}

export default Input