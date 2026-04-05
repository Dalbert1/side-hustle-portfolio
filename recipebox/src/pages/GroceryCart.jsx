import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2, X, ArrowLeft, CheckCircle2, Circle } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

export default function GroceryCart() {
  const { items, removeItem, toggleItem, clearCart, clearChecked, removeRecipeFromCart, getRecipesInCart } = useCart()

  const recipes = getRecipesInCart()
  const checkedCount = items.filter(i => i.checked).length
  const uncheckedItems = items.filter(i => !i.checked)
  const checkedItems = items.filter(i => i.checked)

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <Link to="/" className="text-sm text-warm-gray hover:text-bark flex items-center gap-1 transition-colors mb-6">
        <ArrowLeft size={15} />
        Feed
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-bark flex items-center gap-2">
            <ShoppingCart size={22} className="text-sage" />
            Grocery Cart
          </h1>
          <p className="text-sm text-warm-gray mt-1">
            {items.length} item{items.length !== 1 ? 's' : ''}
            {checkedCount > 0 && ` (${checkedCount} checked off)`}
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            {checkedCount > 0 && (
              <button
                onClick={clearChecked}
                className="px-3 py-2 text-xs font-medium text-warm-gray border border-border rounded-lg hover:bg-cream-dark transition-colors"
              >
                Remove checked
              </button>
            )}
            <button
              onClick={() => { if (confirm('Clear the entire cart?')) clearCart() }}
              className="px-3 py-2 text-xs font-medium text-terra border border-terra/30 rounded-lg hover:bg-terra/5 transition-colors flex items-center gap-1"
            >
              <Trash2 size={12} />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Recipes in cart */}
      {recipes.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-medium text-warm-gray uppercase tracking-wider mb-2">Recipes in cart</h2>
          <div className="flex flex-wrap gap-2">
            {recipes.map(r => (
              <div key={r.id} className="flex items-center gap-1.5 text-xs bg-sage-muted text-sage-light font-medium px-2.5 py-1.5 rounded-full">
                <Link to={`/recipe/${r.id}`} className="hover:underline">{r.title}</Link>
                <button
                  onClick={() => { if (confirm(`Remove all ingredients from "${r.title}"?`)) removeRecipeFromCart(r.id) }}
                  className="hover:text-terra transition-colors"
                  aria-label={`Remove ${r.title} from cart`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grocery list */}
      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={40} className="text-warm-gray-light mx-auto mb-4" />
          <p className="text-warm-gray mb-2">Your cart is empty</p>
          <p className="text-sm text-warm-gray mb-6">Open a recipe and tap "Add to Cart" to get started.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sage text-white font-semibold text-sm rounded-lg hover:bg-sage-dark transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {/* Unchecked items first */}
          {uncheckedItems.map(item => (
            <CartItem key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} />
          ))}

          {/* Checked items with divider */}
          {checkedItems.length > 0 && uncheckedItems.length > 0 && (
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-warm-gray uppercase tracking-wider">Checked Off</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}
          {checkedItems.map(item => (
            <CartItem key={item.id} item={item} onToggle={toggleItem} onRemove={removeItem} />
          ))}
        </div>
      )}
    </div>
  )
}

function CartItem({ item, onToggle, onRemove }) {
  return (
    <div
      className={`flex items-start gap-3 px-3 py-2.5 rounded-lg group transition-colors ${
        item.checked ? 'bg-cream-dark/50' : 'hover:bg-cream-dark/30'
      }`}
    >
      <button
        onClick={() => onToggle(item.id)}
        className={`p-1 -ml-1 mt-px flex-shrink-0 transition-colors ${item.checked ? 'text-sage' : 'text-warm-gray-light hover:text-sage'}`}
        aria-label={item.checked ? 'Uncheck' : 'Check'}
      >
        {item.checked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${item.checked ? 'line-through text-warm-gray' : 'text-bark'}`}>
          {item.amount && <span className="font-medium">{item.amount} </span>}
          {item.unit && <span className="text-warm-gray">{item.unit} </span>}
          {item.name}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {item.recipeIds.map(r => (
            <Link
              key={r.id}
              to={`/recipe/${r.id}`}
              className="text-[10px] text-sage hover:underline"
            >
              {r.title}
            </Link>
          ))}
          {item.recipeIds.length > 1 && (
            <span className="text-[10px] text-terra font-medium ml-1">
              x{item.recipeIds.length} recipes
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="p-2 -mr-1 text-warm-gray-light opacity-0 group-hover:opacity-100 hover:text-terra transition-all flex-shrink-0"
        aria-label="Remove item"
      >
        <X size={14} />
      </button>
    </div>
  )
}
