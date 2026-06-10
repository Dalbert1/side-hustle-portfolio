export default function NutritionCard({ nutrition }) {
  if (!nutrition) return null
  const items = [
    { label: 'Calories', value: nutrition.calories, unit: '' },
    { label: 'Protein', value: nutrition.protein, unit: 'g' },
    { label: 'Carbs', value: nutrition.carbs, unit: 'g' },
    { label: 'Fat', value: nutrition.fat, unit: 'g' },
    { label: 'Fiber', value: nutrition.fiber, unit: 'g' },
    { label: 'Sugar', value: nutrition.sugar, unit: 'g' },
    { label: 'Sodium', value: nutrition.sodium, unit: 'mg' },
  ].filter(i => i.value != null && i.value !== '')

  if (items.length === 0) return null

  return (
    <div className="bg-sage-muted rounded-xl p-5 border border-sage/10">
      <h3 className="font-serif text-base text-bark mb-3">Nutrition</h3>
      <p className="text-[11px] text-warm-gray mb-3">Per serving</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(item => (
          <div key={item.label} className="text-center">
            <p className="text-lg font-semibold text-bark leading-none">
              {item.value}<span className="text-xs text-warm-gray font-normal">{item.unit}</span>
            </p>
            <p className="text-[10px] text-warm-gray mt-1 uppercase tracking-wider">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
