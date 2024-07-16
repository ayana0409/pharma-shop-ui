
const Breadcrumbs = ({path, children}) => {
    return (
        <>
            <h3 className="font-bold text-green-400 text-left mx-4">{path}</h3>
            {children}
        </>
    )
}

export default Breadcrumbs