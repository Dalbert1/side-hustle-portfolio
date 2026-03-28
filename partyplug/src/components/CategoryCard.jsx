import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/vendors?category=${category.id}`}
      className="group flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-light transition-all no-underline"
    >
      <span className="text-3xl group-hover:scale-110 transition-transform">
        {category.icon}
      </span>
      <span className="text-sm font-medium text-gray-700 group-hover:text-primary text-center transition-colors">
        {category.name}
      </span>
    </Link>
  )
}
