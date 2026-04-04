import { Link } from 'react-router-dom'
import { Clock, Star, UtensilsCrossed } from 'lucide-react'

const CATEGORY_COLORS = {
  breakfast: 'bg-amber-100 text-amber-800',
  lunch: 'bg-green-100 text-green-800',
  dinner: 'bg-blue-100 text-blue-800',
  snack: 'bg-purple-100 text-purple-800',
  dessert: 'bg-pink-100 text-pink-800',
  other: 'bg-gray-100 text-gray-700',
}

export default function RecipeCard({ recipe }) {
  const totalTime = (recipe.prep_minutes || 0) + (recipe.cook_minutes || 0)

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group bg-white rounded-xl border border-border overflow-hidden hover:border-sage/40 hover:shadow-md transition-all"
    >
      {/* Hero image */}
      <div className="aspect-[4/3] bg-cream-dark overflow-hidden">
        {recipe.hero_image_url ? (
          <img
            src={recipe.hero_image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed size={32} className="text-warm-gray-light" />
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Category + Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${CATEGORY_COLORS[recipe.category] || CATEGORY_COLORS.other}`}>
            {recipe.category}
          </span>
          {recipe.rating && (
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < recipe.rating ? 'text-terra fill-terra' : 'text-warm-gray-light'}
                />
              ))}
            </div>
          )}
        </div>

        <h3 className="font-serif text-base text-bark leading-snug mb-2 group-hover:text-sage-dark transition-colors">
          {recipe.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-warm-gray">
          {totalTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {totalTime} min
            </span>
          )}
          {recipe.servings && (
            <span>{recipe.servings} servings</span>
          )}
        </div>

        {/* Tags */}
        {recipe.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {recipe.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-sage-muted text-sage-dark font-medium">
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="text-[10px] text-warm-gray">+{recipe.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
