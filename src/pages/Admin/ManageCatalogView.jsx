import { useState, useEffect } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'react-hot-toast'
import { MdDragIndicator } from 'react-icons/md'
import { FiChevronRight } from 'react-icons/fi'
import { FaBoxes, FaCheck } from 'react-icons/fa'

// Servicios backend
import { getAllCategoriesService, reorderCategoriesService } from '../../services/categoryServices'
import { getSubcategoriesByCategoryService, reorderSubcategoriesService } from '../../services/subcategoryServices'
import { getAllProductsService, reorderProductsService } from '../../services/productServices'

// Modificador para restringir el movimiento exclusivamente en el eje vertical
const restrictToVerticalAxis = ({ transform }) => {
    return {
        ...transform,
        x: 0,
    }
}

// Fila visual (usada tanto en la lista como en el DragOverlay flotante)
const ItemRow = ({ item, index, level, onEnter, isDragging, isOverlay, dragHandleProps }) => {
    return (
        <div
            className={`flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border select-none transition-colors ${isOverlay
                ? 'bg-white border-neutral-300 shadow-2xl ring-2 ring-neutral-900/10 cursor-grabbing'
                : isDragging
                    ? 'opacity-25 border-dashed border-gray-300 bg-gray-50'
                    : 'bg-white border-gray-200/90 shadow-2xs hover:border-gray-300'
                }`}
        >
            {/* Lado izquierdo: Manija + Posición + Thumbnail + Nombre */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Manija de arrastre */}
                <button
                    type="button"
                    {...dragHandleProps}
                    className={`p-1.5 rounded-lg text-gray-400 shrink-0 ${isOverlay
                        ? 'cursor-grabbing text-neutral-800'
                        : 'cursor-grab hover:text-gray-700 hover:bg-gray-100 transition-colors'
                        }`}
                    title="Arrastrar para cambiar orden"
                >
                    <MdDragIndicator size={20} />
                </button>

                {/* Número de posición visual */}
                {index !== undefined && (
                    <span className="w-6 text-center font-bold text-xs text-gray-400 shrink-0">
                        #{index + 1}
                    </span>
                )}

                {/* Imagen/Thumbnail */}
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-11 h-11 rounded-xl object-cover border border-gray-100 shrink-0 pointer-events-none"
                    />
                ) : (
                    <div className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs shrink-0 font-medium">
                        N/A
                    </div>
                )}

                {/* Info textual */}
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-gray-900 truncate">
                        {item.name}
                    </p>
                    {level === 'products' && (
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                            ${item.price} • {item.inventoryType === 'stock' ? `Stock: ${item.stock ?? 0} u.` : 'Sabores artesanales'}
                        </p>
                    )}
                    {level === 'categories' && item.description && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                            {item.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Lado derecho: Botón para entrar a subcategorías o productos */}
            {onEnter && !isOverlay && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        onEnter(item)
                    }}
                    className="btn btn-sm btn-ghost hover:bg-gray-100 text-gray-700 rounded-xl gap-1 text-xs font-semibold px-2.5 sm:px-3 shrink-0 cursor-pointer"
                    title={level === 'categories' ? 'Entrar a subcategorías' : 'Entrar a productos'}
                >
                    <span className="hidden sm:inline">
                        {level === 'categories' ? 'Subcategorías' : 'Productos'}
                    </span>
                    <FiChevronRight size={16} />
                </button>
            )}
        </div>
    )
}

// Componente sortable dentro del contexto de la lista
const SortableItem = ({ item, index, level, onEnter }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item._id })

    // Usamos CSS.Translate para evitar deformaciones y desactivamos transition mientras se arrastra
    const style = {
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? undefined : transition,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <ItemRow
                item={item}
                index={index}
                level={level}
                onEnter={onEnter}
                isDragging={isDragging}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    )
}

const ManageCatalogView = ({ onBackToCatalog }) => {
    const [level, setLevel] = useState('categories') // 'categories' | 'subcategories' | 'products'
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedSubcategory, setSelectedSubcategory] = useState(null)

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const [activeId, setActiveId] = useState(null)

    // Sensores optimizados (4px de umbral para respuesta instantánea)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 4,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        loadLevelData()
    }, [level, selectedCategory, selectedSubcategory])

    const loadLevelData = async () => {
        try {
            setLoading(true)
            setHasChanges(false)

            if (level === 'categories') {
                const data = await getAllCategoriesService()
                setItems(data)
            } else if (level === 'subcategories' && selectedCategory) {
                const data = await getSubcategoriesByCategoryService(selectedCategory.slug)
                setItems(data)
            } else if (level === 'products' && selectedCategory && selectedSubcategory) {
                const data = await getAllProductsService(selectedCategory.slug, selectedSubcategory.slug)
                setItems(data)
            }
        } catch (error) {
            toast.error(error.message || 'Error al cargar los elementos')
        } finally {
            setLoading(false)
        }
    }

    const handleDragStart = (event) => {
        setActiveId(event.active.id)
    }

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            setItems((prevItems) => {
                const oldIndex = prevItems.findIndex((item) => item._id === active.id)
                const newIndex = prevItems.findIndex((item) => item._id === over.id)
                return arrayMove(prevItems, oldIndex, newIndex)
            })
            setHasChanges(true)
        }
        setActiveId(null)
    }

    const handleDragCancel = () => {
        setActiveId(null)
    }

    const handleSaveOrder = async () => {
        try {
            setSaving(true)
            const payload = items.map((item, index) => ({
                id: item._id,
                order: index,
            }))

            if (level === 'categories') {
                await reorderCategoriesService(payload)
                toast.success('Orden de categorías guardado')
            } else if (level === 'subcategories') {
                await reorderSubcategoriesService(payload)
                toast.success('Orden de subcategorías guardado')
            } else if (level === 'products') {
                await reorderProductsService(payload)
                toast.success('Orden de productos guardado')
            }

            setHasChanges(false)
        } catch (error) {
            toast.error(error.message || 'Error al guardar el nuevo orden')
        } finally {
            setSaving(false)
        }
    }

    const handleEnterCategory = (category) => {
        setSelectedCategory(category)
        setSelectedSubcategory(null)
        setLevel('subcategories')
    }

    const handleEnterSubcategory = (subcategory) => {
        setSelectedSubcategory(subcategory)
        setLevel('products')
    }

    const activeItem = items.find((item) => item._id === activeId)

    return (
        <div className="flex flex-col gap-5 max-w-4xl mx-auto pb-16">


            {/* 2. Barra de Nivel y Botón Guardar Cambios */}
            <div className="flex items-center justify-between gap-3 px-1">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                        {level === 'categories' && 'Orden de categorías'}
                        {level === 'subcategories' && `Orden de subcategorías: ${selectedCategory?.name}`}
                        {level === 'products' && `Orden de productos: ${selectedSubcategory?.name}`}
                    </h2>
                    {/* 1. Breadcrumbs de Navegación */}
                    <div className="text-xs sm:text-sm breadcrumbs text-gray-500 px-1 py-1">
                        <ul>
                            <li>
                                <button
                                    type="button"
                                    onClick={onBackToCatalog}
                                    className="hover:text-black font-medium cursor-pointer"
                                >
                                    Catálogo
                                </button>
                            </li>
                            <li>
                                {level === 'categories' ? (
                                    <span className="font-bold text-gray-900">Administrar catálogo</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLevel('categories')
                                            setSelectedCategory(null)
                                            setSelectedSubcategory(null)
                                        }}
                                        className="hover:text-black font-medium cursor-pointer"
                                    >
                                        Administrar catálogo
                                    </button>
                                )}
                            </li>
                            {selectedCategory && (
                                <li>
                                    {level === 'subcategories' ? (
                                        <span className="font-bold text-gray-900">{selectedCategory.name}</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setLevel('subcategories')
                                                setSelectedSubcategory(null)
                                            }}
                                            className="hover:text-black font-medium cursor-pointer"
                                        >
                                            {selectedCategory.name}
                                        </button>
                                    )}
                                </li>
                            )}
                            {selectedSubcategory && (
                                <li>
                                    <span className="font-bold text-gray-900">{selectedSubcategory.name}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSaveOrder}
                    disabled={saving || !hasChanges}
                    className="btn btn-sm rounded-full bg-neutral text-white hover:bg-neutral-800 border-none font-semibold text-xs px-5 gap-1.5 shadow-xs disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer shrink-0"
                >
                    {saving ? (
                        <>
                            <span className="loading loading-spinner loading-xs"></span>
                            <span>Guardando...</span>
                        </>
                    ) : (
                        <>
                            <FaCheck size={11} />
                            <span>Guardar cambios</span>
                        </>
                    )}
                </button>
            </div>

            {/* 3. Lista Ordenable con Drag & Drop y DragOverlay */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <span className="loading loading-spinner loading-md text-neutral"></span>
                    <p className="text-xs text-gray-400 font-medium mt-3">Cargando elementos...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
                    <FaBoxes className="mx-auto text-3xl mb-2 text-gray-300" />
                    <p className="font-semibold text-sm">No hay elementos registrados en este nivel</p>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <SortableContext
                        items={items.map((item) => item._id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="flex flex-col gap-2.5">
                            {items.map((item, index) => (
                                <SortableItem
                                    key={item._id}
                                    item={item}
                                    index={index}
                                    level={level}
                                    onEnter={
                                        level === 'categories'
                                            ? handleEnterCategory
                                            : level === 'subcategories'
                                                ? handleEnterSubcategory
                                                : null
                                    }
                                />
                            ))}
                        </div>
                    </SortableContext>

                    {/* DragOverlay: Tarjeta flotante que sigue al cursor en tiempo real sin lag ni tirones */}
                    <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
                        {activeItem ? (
                            <ItemRow
                                item={activeItem}
                                level={level}
                                isOverlay
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
        </div>
    )
}

export default ManageCatalogView
