import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)

  const loadCart = useCallback(async () => {
    if (!user) { setItems([]); setLoaded(true); return }

    const { data } = await supabase
      .from('cart_items')
      .select('*, cart_item_recipes(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (data) {
      setItems(data.map(row => ({
        id: row.id,
        name: row.name,
        amount: row.amount || '',
        unit: row.unit || '',
        checked: row.checked,
        recipeIds: (row.cart_item_recipes || []).map(r => ({
          id: r.recipe_id,
          title: r.recipe_title,
        })),
      })))
    }

    // Migrate any leftover localStorage cart
    try {
      const key = `cart_${user.id}`
      const raw = localStorage.getItem(key)
      if (raw) {
        const old = JSON.parse(raw)
        if (old.length > 0 && (!data || data.length === 0)) {
          for (const item of old) {
            const { data: inserted } = await supabase
              .from('cart_items')
              .insert({ user_id: user.id, name: item.name, amount: item.amount || '', unit: item.unit || '', checked: item.checked || false })
              .select()
              .single()
            if (inserted && item.recipeIds?.length > 0) {
              await supabase.from('cart_item_recipes').insert(
                item.recipeIds.map(r => ({ cart_item_id: inserted.id, recipe_id: r.id, recipe_title: r.title }))
              )
            }
          }
          loadCart()
        }
        localStorage.removeItem(key)
      }
    } catch { /* ignore migration errors */ }

    setLoaded(true)
  }, [user])

  useEffect(() => { loadCart() }, [loadCart])

  async function addRecipeToCart(recipe) {
    if (!user) return
    const ingredients = recipe.ingredients || []
    if (ingredients.length === 0) return
    const recipeRef = { id: recipe.id, title: recipe.title }

    // Optimistic: add to local state immediately
    setItems(prev => {
      const next = [...prev]
      for (const ing of ingredients) {
        if (!ing.name?.trim()) continue
        const existing = next.find(item => item.name.toLowerCase().trim() === ing.name.toLowerCase().trim())
        if (existing) {
          if (!existing.recipeIds.some(r => r.id === recipe.id)) {
            existing.recipeIds = [...existing.recipeIds, recipeRef]
          }
        } else {
          next.push({
            id: crypto.randomUUID(),
            name: ing.name.trim(),
            amount: ing.amount || '',
            unit: ing.unit || '',
            recipeIds: [recipeRef],
            checked: false,
          })
        }
      }
      return next
    })

    // Persist to Supabase
    for (const ing of ingredients) {
      if (!ing.name?.trim()) continue

      // Check if item already exists for this user
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id')
        .eq('user_id', user.id)
        .ilike('name', ing.name.trim())
        .maybeSingle()

      let cartItemId
      if (existing) {
        cartItemId = existing.id
      } else {
        const { data: inserted } = await supabase
          .from('cart_items')
          .insert({ user_id: user.id, name: ing.name.trim(), amount: ing.amount || '', unit: ing.unit || '' })
          .select()
          .single()
        if (!inserted) continue
        cartItemId = inserted.id
      }

      // Link to recipe (ignore conflict if already linked)
      await supabase
        .from('cart_item_recipes')
        .upsert({ cart_item_id: cartItemId, recipe_id: recipe.id, recipe_title: recipe.title }, { onConflict: 'cart_item_id,recipe_id' })
    }

    loadCart()
  }

  async function removeRecipeFromCart(recipeId) {
    if (!user) return

    // Optimistic
    setItems(prev =>
      prev
        .map(item => ({ ...item, recipeIds: item.recipeIds.filter(r => r.id !== recipeId) }))
        .filter(item => item.recipeIds.length > 0)
    )

    // Delete recipe links
    const { data: links } = await supabase
      .from('cart_item_recipes')
      .select('cart_item_id')
      .eq('recipe_id', recipeId)
      .in('cart_item_id', items.map(i => i.id))

    if (links) {
      await supabase
        .from('cart_item_recipes')
        .delete()
        .eq('recipe_id', recipeId)
        .in('cart_item_id', items.map(i => i.id))

      // Delete orphaned cart items (no remaining recipe links)
      for (const link of links) {
        const { count } = await supabase
          .from('cart_item_recipes')
          .select('*', { count: 'exact', head: true })
          .eq('cart_item_id', link.cart_item_id)
        if (count === 0) {
          await supabase.from('cart_items').delete().eq('id', link.cart_item_id)
        }
      }
    }

    loadCart()
  }

  async function removeItem(itemId) {
    setItems(prev => prev.filter(i => i.id !== itemId))
    await supabase.from('cart_items').delete().eq('id', itemId)
  }

  async function toggleItem(itemId) {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i))
    await supabase.from('cart_items').update({ checked: !item.checked }).eq('id', itemId)
  }

  async function clearCart() {
    if (!user) return
    setItems([])
    await supabase.from('cart_items').delete().eq('user_id', user.id)
  }

  async function clearChecked() {
    if (!user) return
    const checkedIds = items.filter(i => i.checked).map(i => i.id)
    setItems(prev => prev.filter(i => !i.checked))
    if (checkedIds.length > 0) {
      await supabase.from('cart_items').delete().in('id', checkedIds)
    }
  }

  function isRecipeInCart(recipeId) {
    return items.some(item => item.recipeIds.some(r => r.id === recipeId))
  }

  function getRecipesInCart() {
    const map = new Map()
    for (const item of items) {
      for (const r of item.recipeIds) {
        if (!map.has(r.id)) map.set(r.id, r.title)
      }
    }
    return [...map.entries()].map(([id, title]) => ({ id, title }))
  }

  return (
    <CartContext.Provider value={{
      items,
      addRecipeToCart,
      removeRecipeFromCart,
      removeItem,
      toggleItem,
      clearCart,
      clearChecked,
      isRecipeInCart,
      getRecipesInCart,
      cartCount: items.length,
      loaded,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
