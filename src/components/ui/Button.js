import clsx from 'clsx';

const Button = ({ children, className, primary, type = 'button', ...props }) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 focus:outline-none',
        {
          'bg-white text-green-600 hover:bg-blue-100': !primary,
          'bg-green-600 text-white hover:bg-green-500': primary
        },
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

