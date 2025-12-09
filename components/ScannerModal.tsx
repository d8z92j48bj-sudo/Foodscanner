import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, AlertTriangle } from 'lucide-react';

interface ScannerModalProps {
  onDetected: (barcode: string) => void;
  onClose: () => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ onDetected, onClose }) => {
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    mountedRef.current = true;
    const readerId = "reader";

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(readerId);
        scannerRef.current = scanner;

        // Specific formats for food products (EAN, UPC)
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };
        
        // We focus on 1D barcodes for products
        // Note: formatsToSupport is passed to the constructor or start config depending on version,
        // but explicit config helps performance.
        
        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
             // Success callback
             if (mountedRef.current) {
               // Play a beep or haptic feedback if possible
               if (navigator.vibrate) navigator.vibrate(200);
               onDetected(decodedText);
               // Stop immediately after detection to prevent duplicates
               scanner.stop().catch(console.error);
             }
          },
          (errorMessage) => {
            // Ignore parse errors, they happen every frame no code is detected
          }
        );
      } catch (err: any) {
        if (mountedRef.current) {
          console.error("Scanner error:", err);
          setError("Could not access camera. Please ensure permissions are granted.");
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
        startScanner();
    }, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => {
                scannerRef.current?.clear();
            }).catch(console.error);
        } else {
             scannerRef.current.clear();
        }
      }
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center text-white space-x-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm tracking-wide">Scan Barcode</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="relative aspect-square bg-slate-900">
             {!error ? (
                <>
                    <div id="reader" className="w-full h-full"></div>
                    {/* Visual Guides */}
                    <div className="absolute inset-0 border-2 border-emerald-500/30 pointer-events-none rounded-3xl m-8">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl -mt-1 -ml-1"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl -mt-1 -mr-1"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl -mb-1 -ml-1"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl -mb-1 -mr-1"></div>
                    </div>
                    <div className="absolute bottom-8 left-0 right-0 text-center text-white/70 text-sm font-medium animate-pulse">
                        Point camera at a barcode
                    </div>
                </>
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <p className="max-w-xs text-sm text-slate-300">{error}</p>
                    <button onClick={onClose} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm font-medium transition-colors">
                        Close
                    </button>
                </div>
             )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 p-4 text-center">
            <p className="text-xs text-slate-500">Supports EAN, UPC, and other standard food barcodes.</p>
        </div>
      </div>
    </div>
  );
};

export default ScannerModal;
