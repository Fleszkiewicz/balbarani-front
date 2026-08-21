const AdminPlaceholder = ({ title, description }) => {
    return (
        <section className="bg-base-100 rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600">{description}</p>
        </section>
    )
}

export default AdminPlaceholder