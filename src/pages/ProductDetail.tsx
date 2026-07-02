import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, PackageCheck, Loader2, ChevronLeft, ChevronRight, Star, Heart, Share2, Camera, Send, ShoppingCart, Tag as TagIcon, ShieldCheck, MapPin } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { useLang } from "@/contexts/LangContext";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const exportImgs = [
  "https://images.pexels.com/photos/30893343/pexels-photo-30893343.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/5149342/pexels-photo-5149342.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/4109751/pexels-photo-4109751.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/35585310/pexels-photo-35585310.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/31437952/pexels-photo-31437952.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
];

const seafoodImgs = [
  "https://images.pexels.com/photos/8352346/pexels-photo-8352346.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/33211047/pexels-photo-33211047.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/30648997/pexels-photo-30648997.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/3903587/pexels-photo-3903587.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
];

const getSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const StarRating = ({ rating, className }: { rating: number; className?: string }) => (
  <div className={cn("flex items-center gap-0.5", className)}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating) ? "text-[var(--color-brand-gold)] fill-[var(--color-brand-gold)]" : "text-[var(--color-brand-graylight)]/30"
        )}
      />
    ))}
    <span className="ml-2 text-sm font-sans font-medium text-[var(--color-brand-graylight)]">{rating.toFixed(1)}</span>
  </div>
);

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { T } = useLang();
  const { addToCart } = useCart();
  
  // Find product in translations
  let foundProduct = null;
  let foundImg = "";
  let foundTag = "";
  let imagesArray: string[] = [];
  
  const importIndex = T.import.products.findIndex(p => getSlug(p.name) === id);
  if (importIndex !== -1) {
    foundProduct = T.import.products[importIndex];
    foundImg = exportImgs[importIndex];
    foundTag = "Don Pepe Import";
    imagesArray = [foundImg, exportImgs[(importIndex + 1) % exportImgs.length], exportImgs[(importIndex + 2) % exportImgs.length]];
  } else {
    const seafoodIndex = T.seafood.products.findIndex(p => getSlug(p.name) === id);
    if (seafoodIndex !== -1) {
      foundProduct = T.seafood.products[seafoodIndex];
      foundImg = seafoodImgs[seafoodIndex];
      foundTag = "Don Pepe Sea Food";
      imagesArray = [foundImg, seafoodImgs[(seafoodIndex + 1) % seafoodImgs.length], seafoodImgs[(seafoodIndex + 2) % seafoodImgs.length]];
    }
  }

  // Fallback for direct testing
  if (imagesArray.length === 0) {
    imagesArray = [
      foundImg || "https://images.pexels.com/photos/4109751/pexels-photo-4109751.jpeg?auto=compress&cs=tinysrgb&w=1920",
      exportImgs[0],
      seafoodImgs[0]
    ];
  }

  const product = {
    id,
    name: foundProduct ? foundProduct.name : (id ? id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Producto Premium"),
    tag: foundTag || "Don Pepe Business Club",
    desc: foundProduct ? foundProduct.desc : "Este producto premium cuenta con los más altos estándares de calidad para exportación.",
    images: imagesArray,
    pricePerPaca: 120.00,
    unitsPerPaca: 50,
    minOrder: 1,
    tags: [
      { label: "Premium Quality", icon: ShieldCheck },
      { label: foundTag || "Export", icon: TagIcon },
      { label: "Verified Source", icon: MapPin },
    ]
  };

  const allProducts = [
    ...T.import.products.map((p, i) => ({ ...p, img: exportImgs[i % exportImgs.length] })),
    ...T.seafood.products.map((p, i) => ({ ...p, img: seafoodImgs[i % seafoodImgs.length] }))
  ];
  
  const relatedProducts = allProducts.filter(p => getSlug(p.name) !== id).slice(0, 6);

  const seller = {
    name: "Don Pepe Business Group",
    avatarUrl: "/favicon.png",
    rating: 5.0
  };
  
  const [pacas, setPacas] = useState<number>(product.minOrder);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalEstimate = pacas * product.pricePerPaca;
  const totalUnits = pacas * product.unitsPerPaca;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      setPacas(val);
    }
  };

  const handleCheckoutClick = () => {
    if (pacas < product.minOrder) {
      alert(`El pedido mínimo es de ${product.minOrder} pacas.`);
      setPacas(product.minOrder);
      return;
    }
    navigate("/checkout");
  };

  const handleAddToCart = () => {
    if (pacas < product.minOrder) {
      alert(`El pedido mínimo es de ${product.minOrder} pacas.`);
      setPacas(product.minOrder);
      return;
    }
    addToCart({
      id: product.id || "unknown",
      name: product.name,
      price: product.pricePerPaca,
      image: product.images[0],
      quantity: pacas,
      tag: product.tag
    });
    navigate("/cart");
  };

  const confirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  const closeModal = () => {
    if (!isProcessing) {
      setShowModal(false);
      if (isSuccess) {
        setIsSuccess(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-brand-black)] pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Top Header: Breadcrumbs & Actions */}
        <FadeIn className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center text-[12px] font-sans font-semibold uppercase tracking-widest text-[var(--color-brand-graylight)]">
            <Link to="/" className="hover:text-[var(--color-brand-gold)] transition-colors">Inicio</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-[var(--color-brand-goldmuted)]" />
            <Link to="/productos" className="hover:text-[var(--color-brand-gold)] transition-colors">Productos</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-[var(--color-brand-goldmuted)]" />
            <span className="text-[var(--color-brand-gold)]">{product.name}</span>
          </nav>
          

        </FadeIn>

        {/* Mobile Title Section (Name -> Image -> Desc) */}
        <div className="block lg:hidden mb-8">
          <span className="inline-block px-3 py-1 mb-4 rounded-sm border border-[var(--color-brand-gold)]/40 text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-gold)] w-fit">
            {product.tag}
          </span>
          <h1 className="font-serif font-bold text-[36px] sm:text-[40px] text-[var(--color-brand-offwhite)] leading-tight mb-4">
            {product.name}
          </h1>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/20 text-[var(--color-brand-graylight)]">
                {tag.icon && <tag.icon className="h-3 w-3 text-[var(--color-brand-gold)]" />}
                <span className="font-sans text-[11px]">{tag.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Image Gallery */}
          <FadeIn direction="right" className="flex flex-col gap-6">
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px] w-full border border-[var(--color-brand-gold)]/25 bg-[var(--color-brand-navymid)] overflow-hidden rounded-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={product.images[currentImageIndex]} 
                    alt={`${product.name} - view ${currentImageIndex + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-black)] via-transparent to-transparent opacity-50 pointer-events-none" />
            </div>
            

          </FadeIn>

          {/* Right Column: Details & B2B Logic */}
          <FadeIn direction="left" delay={0.2} className="flex flex-col justify-center">
            
            {/* Desktop Title Section */}
            <div className="hidden lg:block">
              <span className="inline-block px-3 py-1 mb-4 rounded-sm border border-[var(--color-brand-gold)]/40 text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-gold)] w-fit">
                {product.tag}
              </span>
              <h1 className="font-serif font-bold text-[40px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-tight mb-4">
                {product.name}
              </h1>
              
              {/* Tags/Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {product.tags.map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/20 text-[var(--color-brand-graylight)]">
                    {tag.icon && <tag.icon className="h-3.5 w-3.5 text-[var(--color-brand-gold)]" />}
                    <span className="font-sans text-xs">{tag.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)] leading-relaxed mb-10 text-justify hyphens-auto mt-4 lg:mt-0">
              {product.desc.length > 150 && !isExpanded ? `${product.desc.substring(0, 150)}...` : product.desc}
              {product.desc.length > 150 && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[var(--color-brand-gold)] hover:text-[var(--color-brand-offwhite)] font-semibold ml-2 transition-colors border-b border-[var(--color-brand-gold)] border-dashed"
                >
                  {isExpanded ? "Leer menos" : "Leer más"}
                </button>
              )}
            </p>

            {/* B2B Logic Area */}
            <div className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/20 p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-gold)]/10 flex items-center justify-center text-[var(--color-brand-gold)] shrink-0">
                  <PackageCheck size={20} />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-[18px] text-[var(--color-brand-offwhite)] mb-1">Pedidos al por mayor</h3>
                  <p className="font-sans text-[14px] text-[var(--color-brand-gold)]">
                    1 Paca = {product.unitsPerPaca} unidades. Pedido mínimo: {product.minOrder} {product.minOrder === 1 ? 'Paca' : 'Pacas'}.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end gap-6 mb-8">
                <div className="w-full sm:w-auto flex flex-col">
                  <label htmlFor="quantity" className="block font-sans text-[12px] font-semibold text-[var(--color-brand-graylight)] uppercase tracking-wider mb-2">
                    Cantidad (Pacas)
                  </label>
                  <div className="flex items-center bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 rounded-md overflow-hidden h-12 w-full sm:w-36">
                    <button 
                      type="button"
                      onClick={() => setPacas(Math.max(product.minOrder, pacas - 1))}
                      className="w-10 h-full flex items-center justify-center text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      id="quantity"
                      min={product.minOrder}
                      value={pacas}
                      onChange={handleQuantityChange}
                      className="w-full bg-transparent text-[var(--color-brand-offwhite)] text-center font-sans text-lg focus:outline-none focus:ring-0 appearance-none m-0"
                      style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                    />
                    <button 
                      type="button"
                      onClick={() => setPacas(pacas + 1)}
                      className="w-10 h-full flex items-center justify-center text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex-1 text-right">
                  <p className="font-sans text-[12px] font-semibold text-[var(--color-brand-graylight)] uppercase tracking-wider mb-1">
                    Total Estimado ({totalUnits} uds)
                  </p>
                  <p className="font-serif text-[32px] text-[var(--color-brand-gold)] leading-none">
                    ${totalEstimate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 border border-[var(--color-brand-gold)]/50 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 px-8 py-4 rounded-none text-[13px] sm:text-sm font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-center"
                >
                  <ShoppingCart className="h-4 w-4" /> Añadir al carrito
                </button>
                <button 
                  onClick={handleCheckoutClick}
                  className="flex-1 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-8 py-4 rounded-none text-[13px] sm:text-sm font-semibold uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  Comprar
                </button>
              </div>
            </div>
            
            {/* Seller Information */}
            <div className="mt-4 pt-8 border-t border-[var(--color-brand-gold)]/10">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-brand-white)] flex items-center justify-center overflow-hidden border-2 border-[var(--color-brand-gold)]">
                    <img src={seller.avatarUrl} alt={seller.name} className="w-10 h-10 object-contain" />
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-[var(--color-brand-offwhite)]">{seller.name}</p>
                    <StarRating rating={seller.rating} className="mt-1" />
                  </div>
                </div>
                <Link to="/contacto" className="font-sans text-xs font-semibold text-[var(--color-brand-gold)] uppercase tracking-widest hover:text-[var(--color-brand-offwhite)] transition-colors">
                  Ver perfil completo &rarr;
                </Link>
              </div>
            </div>

          </FadeIn>
        </div>
      </div>

      {/* Related Products Carousel */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 md:mt-16 pt-8 md:pt-12 border-t border-[var(--color-brand-gold)]/10 relative">
        <div className="flex flex-row justify-between items-center mb-6 md:mb-10 gap-4">
          <h2 className="font-serif font-bold text-[22px] md:text-[36px] text-[var(--color-brand-offwhite)] text-left flex-1">
            También podría interesarte
          </h2>
          <div className="flex gap-2 md:gap-4 shrink-0">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[var(--color-brand-gold)]/40 flex items-center justify-center text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 transition-colors"
              aria-label="Desplazar a la izquierda"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[var(--color-brand-gold)]/40 flex items-center justify-center text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 transition-colors"
              aria-label="Desplazar a la derecha"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
        
        {/* Make sure we hide scrollbar natively in index.css or via tailwind if plugin exists. Fallback via inline style for now */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Custom style for webkit scrollbar hiding inline since we don't know if tailwind-scrollbar is installed */}
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {relatedProducts.map((prod, i) => (
            <Link 
              key={i} 
              to={`/producto/${getSlug(prod.name)}`}
              className="snap-start shrink-0 w-[280px] md:w-[360px] block h-full"
            >
              <article
                className="group h-full overflow-hidden border transition-all duration-300 bg-[var(--color-brand-navymid)] border-[var(--color-brand-gold)]/25 hover:border-[var(--color-brand-gold)]"
              >
                <div className="h-[250px] overflow-hidden relative">
                  <img src={prod.img} alt={prod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(58,58,58,0.65)] via-transparent to-transparent" />
                </div>
                <div className="p-8">
                  <span className="inline-flex mb-4 px-3 py-1 rounded-sm border border-[var(--color-brand-gold)]/40 text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-gold)]">
                    {prod.type === "import" ? "Don Pepe Import" : "Don Pepe Sea Food"}
                  </span>
                  <h3 className="font-serif font-bold text-[28px] leading-none text-[var(--color-brand-offwhite)] mb-4 line-clamp-2">{prod.name}</h3>
                  <p className="font-sans text-[15px] leading-relaxed text-[var(--color-brand-graylight)] line-clamp-3">{prod.desc}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Checkout Modal Simulation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="relative bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/30 w-full max-w-md p-8 shadow-2xl z-10 animate-in fade-in zoom-in duration-200">
            {isSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 size={64} className="text-green-500 mx-auto mb-6" />
                <h2 className="font-serif font-bold text-[32px] text-[var(--color-brand-offwhite)] mb-4">¡Pago Exitoso!</h2>
                <p className="font-sans text-[16px] text-[var(--color-brand-graylight)] mb-8">
                  Su orden de {pacas} pacas de {product.name} ha sido generada correctamente.
                </p>
                <button 
                  onClick={closeModal}
                  className="w-full border border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-[var(--color-brand-gold)]/10 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-serif font-bold text-[28px] text-[var(--color-brand-offwhite)] mb-6 border-b border-[var(--color-brand-gold)]/20 pb-4">
                  Resumen de Orden
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[var(--color-brand-graylight)]">
                    <span>Producto</span>
                    <span className="font-semibold text-[var(--color-brand-offwhite)]">{product.name}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-brand-graylight)]">
                    <span>Cantidad</span>
                    <span className="font-semibold text-[var(--color-brand-offwhite)]">{pacas} Pacas</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-brand-graylight)]">
                    <span>Unidades totales</span>
                    <span className="font-semibold text-[var(--color-brand-offwhite)]">{totalUnits} uds</span>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-brand-gold)]/20 flex justify-between items-center">
                    <span className="text-[18px] font-semibold text-[var(--color-brand-offwhite)]">Total a Pagar</span>
                    <span className="font-serif text-[28px] text-[var(--color-brand-gold)]">
                      ${totalEstimate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={confirmPayment}
                  disabled={isProcessing}
                  className="w-full bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Procesando...
                    </>
                  ) : (
                    "Confirmar Pago"
                  )}
                </button>
                {!isProcessing && (
                  <button 
                    onClick={closeModal}
                    className="w-full mt-4 text-[12px] font-sans font-semibold text-[var(--color-brand-graylight)] uppercase tracking-wider hover:text-[var(--color-brand-offwhite)] transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
