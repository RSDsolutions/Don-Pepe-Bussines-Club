import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, PackageCheck, Loader2 } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { useLang } from "@/contexts/LangContext";

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

export function ProductDetail() {
  const { id } = useParams();
  const { T } = useLang();
  
  // Find product in translations
  let foundProduct = null;
  let foundImg = "";
  let foundTag = "";
  
  const importIndex = T.import.products.findIndex(p => getSlug(p.name) === id);
  if (importIndex !== -1) {
    foundProduct = T.import.products[importIndex];
    foundImg = exportImgs[importIndex];
    foundTag = "Don Pepe Import";
  } else {
    const seafoodIndex = T.seafood.products.findIndex(p => getSlug(p.name) === id);
    if (seafoodIndex !== -1) {
      foundProduct = T.seafood.products[seafoodIndex];
      foundImg = seafoodImgs[seafoodIndex];
      foundTag = "Don Pepe Sea Food";
    }
  }

  const product = {
    id,
    name: foundProduct ? foundProduct.name : (id ? id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Producto Premium"),
    tag: foundTag || "Don Pepe Business Club",
    desc: foundProduct ? foundProduct.desc : "Este producto premium cuenta con los más altos estándares de calidad para exportación.",
    img: foundImg || "https://images.pexels.com/photos/4109751/pexels-photo-4109751.jpeg?auto=compress&cs=tinysrgb&w=1920",
    pricePerPaca: 120.00,
    unitsPerPaca: 50,
    minOrder: 1
  };
  
  const [pacas, setPacas] = useState<number>(product.minOrder);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    setShowModal(true);
  };

  const confirmPayment = () => {
    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  const closeModal = () => {
    if (!isProcessing) {
      setShowModal(false);
      if (isSuccess) {
        // Reset state if we close after success
        setIsSuccess(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-brand-black)] pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <FadeIn>
          <Link to="/productos" className="inline-flex items-center gap-2 text-[var(--color-brand-gold)] hover:text-[var(--color-brand-goldlight)] font-sans font-semibold text-sm uppercase tracking-widest mb-10 transition-colors">
            <ArrowLeft size={18} /> Volver a Productos
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column: Image */}
          <FadeIn direction="right">
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px] w-full border border-[var(--color-brand-gold)]/25 bg-[var(--color-brand-navymid)] overflow-hidden">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-black)] via-transparent to-transparent opacity-60" />
            </div>
          </FadeIn>

          {/* Right Column: Details & B2B Logic */}
          <FadeIn direction="left" delay={0.2} className="flex flex-col justify-center">
            <span className="inline-block px-3 py-1 mb-6 rounded-sm border border-[var(--color-brand-gold)]/40 text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-gold)] w-fit">
              {product.tag}
            </span>
            <h1 className="font-serif font-bold text-[40px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-tight mb-6">
              {product.name}
            </h1>
            <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)] leading-relaxed mb-10">
              {product.desc}
            </p>

            {/* B2B Logic Area */}
            <div className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/20 p-8 mb-10">
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

              <button 
                onClick={handleCheckoutClick}
                className="w-full bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:scale-[1.02] transition-all"
              >
                Comprar / Proceder al Pago
              </button>
            </div>
          </FadeIn>
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
